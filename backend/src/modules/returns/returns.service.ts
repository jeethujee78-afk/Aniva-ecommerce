import { returnsRepository, ReturnsRepository } from "./returns.repository.js";
import { PaymentGatewayFactory } from "../payments/payment.adapter.js";
import { db } from "../../db/connection.js";
import { ApiError } from "../../middleware/errorHandler.js";
import { 
  DbReturnRequest, 
  DbRefund, 
  ReturnReason, 
  ReturnStatus, 
  RefundStatus 
} from "../../db/schema.js";

export class ReturnsService {
  constructor(private repo: ReturnsRepository = returnsRepository) {}

  async checkEligibility(params: {
    parentOrderId: string;
    orderItemId: string;
    userId?: string;
  }) {
    const order = await this.repo.getOrderById(params.parentOrderId);
    if (!order) {
      throw new ApiError(404, "ORDER_NOT_FOUND", "Order not found");
    }

    if (params.userId && order.userId !== params.userId) {
      throw new ApiError(403, "FORBIDDEN", "Unauthorized access to order");
    }

    const items = await db.getOrderItemsByParentOrderId(order.id);
    const item = items.find(i => i.id === params.orderItemId);
    if (!item) {
      throw new ApiError(404, "ITEM_NOT_FOUND", "Order item not found in order");
    }

    const sellerPolicy = await this.repo.getSellerReturnPolicy(item.sellerId, item.productId);

    // Calculate days since delivery
    const orderDate = new Date(order.createdAt).getTime();
    const daysSinceOrder = Math.floor((Date.now() - orderDate) / (1000 * 60 * 60 * 24));
    const isWithinWindow = sellerPolicy.returnWindowDays > 0 ? daysSinceOrder <= sellerPolicy.returnWindowDays : false;

    const isEligible = sellerPolicy.isReturnable && isWithinWindow && (item.returnStatus === "NONE" || !item.returnStatus);

    return {
      isEligible,
      itemTitle: item.titleSnapshot,
      sellerId: item.sellerId,
      returnWindowDays: sellerPolicy.returnWindowDays,
      daysSinceOrder,
      currentReturnStatus: item.returnStatus || "NONE",
      policyNote: sellerPolicy.policyNote,
      reason: !sellerPolicy.isReturnable 
        ? (sellerPolicy.policyNote || "Item is marked as non-returnable under policy")
        : !isWithinWindow 
        ? `Exceeded the ${sellerPolicy.returnWindowDays}-day return window` 
        : item.returnStatus !== "NONE" && item.returnStatus !== undefined
        ? `A return request has already been ${item.returnStatus.toLowerCase()}`
        : "Item is eligible for return under current policy"
    };
  }

  async requestReturn(params: {
    parentOrderId: string;
    orderItemId: string;
    userId: string;
    reason: ReturnReason;
    customerNotes?: string;
    images?: string[];
  }): Promise<DbReturnRequest> {
    const eligibility = await this.checkEligibility({
      parentOrderId: params.parentOrderId,
      orderItemId: params.orderItemId,
      userId: params.userId
    });

    if (!eligibility.isEligible) {
      throw new ApiError(400, "RETURN_NOT_ELIGIBLE", eligibility.reason);
    }

    const items = await db.getOrderItemsByParentOrderId(params.parentOrderId);
    const item = items.find(i => i.id === params.orderItemId)!;

    const sellerPolicy = await this.repo.getSellerReturnPolicy(item.sellerId, item.productId);

    const now = new Date();
    const returnRequest: DbReturnRequest = {
      id: `RET-${now.toISOString().replace(/[-:TZ.]/g, "").slice(0, 12)}-${Math.floor(1000 + Math.random() * 9000)}`,
      parentOrderId: params.parentOrderId,
      sellerOrderId: item.sellerOrderId,
      orderItemId: item.id,
      userId: params.userId,
      reason: params.reason,
      customerNotes: params.customerNotes,
      images: params.images || [],
      status: "REQUESTED",
      sellerPolicySnapshot: sellerPolicy,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    return this.repo.createReturnRequest(returnRequest);
  }

  async reviewReturnRequest(params: {
    returnRequestId: string;
    status: ReturnStatus;
    notes?: string;
    reviewerId: string;
    reviewerRole: string;
    retailerId?: string;
  }): Promise<DbReturnRequest> {
    const returnReq = await this.repo.getReturnRequestById(params.returnRequestId);
    if (!returnReq) {
      throw new ApiError(404, "RETURN_REQUEST_NOT_FOUND", "Return request not found");
    }

    // Retailer Tenant Isolation Check
    if (params.reviewerRole === "RETAILER") {
      const sellerOrder = await this.repo.getSellerOrderById(returnReq.sellerOrderId);
      if (!sellerOrder || sellerOrder.sellerId !== params.retailerId) {
        throw new ApiError(403, "FORBIDDEN", "Unauthorized access to this seller return request");
      }
    }

    const updated = await this.repo.updateReturnStatus(
      params.returnRequestId,
      params.status,
      params.notes,
      params.reviewerId
    );

    return updated!;
  }

  async processRefund(params: {
    parentOrderId: string;
    returnRequestId?: string;
    amount?: number;
    reason: string;
    authorizedBy: string;
    authorizedRole: string;
    restockInventory?: boolean;
  }): Promise<DbRefund> {
    // Only Admin / Finance or Ops can authorize refunds
    if (
      params.authorizedRole !== "ADMIN_SUPER" &&
      params.authorizedRole !== "ADMIN_FINANCE" &&
      params.authorizedRole !== "ADMIN_OPS"
    ) {
      throw new ApiError(403, "FORBIDDEN", "Unauthorized: Financial refund privilege required");
    }

    const order = await this.repo.getOrderById(params.parentOrderId);
    if (!order) {
      throw new ApiError(404, "ORDER_NOT_FOUND", "Parent order not found");
    }

    const payment = await this.repo.getPaymentByOrderId(order.id);
    const refundAmount = params.amount !== undefined ? Math.min(order.total, params.amount) : order.total;
    const isFullRefund = refundAmount >= order.total;

    const adapter = PaymentGatewayFactory.getAdapter(payment?.gatewayProvider);
    const gatewayResult = await adapter.processRefund({
      paymentId: payment?.id || "pay-manual",
      transactionId: payment?.transactionId || "TXN-MANUAL",
      amount: refundAmount,
      reason: params.reason
    });

    const now = new Date();
    const refundRecord: DbRefund = {
      id: `REF-${now.toISOString().replace(/[-:TZ.]/g, "").slice(0, 12)}-${Math.floor(1000 + Math.random() * 9000)}`,
      returnRequestId: params.returnRequestId || null,
      parentOrderId: order.id,
      paymentId: payment?.id || null,
      amount: refundAmount,
      currency: order.currency,
      type: isFullRefund ? "FULL" : "PARTIAL",
      status: gatewayResult.status,
      gatewayRefundId: gatewayResult.refundId,
      reason: params.reason,
      authorizedBy: params.authorizedBy,
      authorizedAt: now.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    await this.repo.createRefund(refundRecord);

    // Update parent order payment status
    order.paymentStatus = isFullRefund ? "REFUNDED" : "PARTIALLY_REFUNDED";
    order.updatedAt = now.toISOString();

    // If linked to return request, update return status to COMPLETED
    if (params.returnRequestId) {
      await this.repo.updateReturnStatus(params.returnRequestId, "COMPLETED", "Refund processed and closed", params.authorizedBy);
    }

    // Optional inventory restock upon return completion
    if (params.restockInventory && params.returnRequestId) {
      const returnReq = await this.repo.getReturnRequestById(params.returnRequestId);
      if (returnReq) {
        const item = await this.repo.getOrderItemById(returnReq.orderItemId);
        if (item) {
          await this.repo.restoreInventory([{ variantId: item.variantId, quantity: item.quantity }]);
        }
      }
    }

    return refundRecord;
  }

  async getCustomerReturns(userId: string): Promise<DbReturnRequest[]> {
    return this.repo.getReturnRequestsByUserId(userId);
  }

  async getRetailerReturns(retailerId: string): Promise<DbReturnRequest[]> {
    return this.repo.getReturnRequestsBySellerId(retailerId);
  }

  async getAllReturns(): Promise<DbReturnRequest[]> {
    return this.repo.getAllReturnRequests();
  }

  async getOrderRefunds(orderId: string): Promise<DbRefund[]> {
    return this.repo.getRefundsByParentOrderId(orderId);
  }
}

export const returnsService = new ReturnsService();
