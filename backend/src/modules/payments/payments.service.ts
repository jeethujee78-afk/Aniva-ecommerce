import { paymentsRepository, PaymentsRepository } from "./payments.repository.js";
import { PaymentGatewayFactory, IPaymentGatewayAdapter, PaymentWebhookPayload } from "./payment.adapter.js";
import { ApiError } from "../../middleware/errorHandler.js";
import { DbPayment, PaymentMethod, PaymentStatus } from "../../db/schema.js";

export class PaymentsService {
  constructor(private repo: PaymentsRepository = paymentsRepository) {}

  async initiatePayment(params: {
    parentOrderId: string;
    paymentMethod: PaymentMethod;
    actorId?: string;
    ipAddress?: string;
  }) {
    const order = await this.repo.getOrderById(params.parentOrderId);
    if (!order) {
      throw new ApiError(404, "ORDER_NOT_FOUND", `Order '${params.parentOrderId}' was not found`);
    }

    if (order.paymentStatus === "PAID") {
      throw new ApiError(400, "ALREADY_PAID", "Order has already been paid successfully");
    }

    const adapter: IPaymentGatewayAdapter = PaymentGatewayFactory.getAdapter();

    // Create gateway session
    const session = await adapter.createPaymentSession({
      parentOrderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.total,
      currency: order.currency,
      paymentMethod: params.paymentMethod,
      customerEmail: order.shippingAddress.email,
      customerPhone: order.shippingAddress.phone,
      customerName: order.shippingAddress.fullName
    });

    const paymentRecord: DbPayment = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      parentOrderId: order.id,
      paymentMethod: params.paymentMethod,
      gatewayProvider: adapter.providerName,
      transactionId: session.transactionId,
      gatewayOrderId: session.gatewayOrderId,
      amount: order.total,
      currency: order.currency,
      status: session.status,
      isTestMode: session.isTestMode,
      gatewayResponse: { session_created: true },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.repo.createPayment(paymentRecord);

    // Audit Log
    await this.repo.logAudit({
      paymentId: paymentRecord.id,
      parentOrderId: order.id,
      eventType: "PAYMENT_INITIATED",
      previousStatus: order.paymentStatus,
      newStatus: session.status,
      actorId: params.actorId || order.userId,
      actorRole: "CUSTOMER",
      ipAddress: params.ipAddress,
      details: {
        method: params.paymentMethod,
        amount: order.total,
        transactionId: session.transactionId,
        provider: adapter.providerName
      }
    });

    return {
      payment: paymentRecord,
      session
    };
  }

  async verifyPayment(params: {
    parentOrderId: string;
    transactionId: string;
    gatewayOrderId?: string;
    actorId?: string;
    ipAddress?: string;
  }) {
    const order = await this.repo.getOrderById(params.parentOrderId);
    if (!order) {
      throw new ApiError(404, "ORDER_NOT_FOUND", `Order '${params.parentOrderId}' was not found`);
    }

    const payment = await this.repo.getPaymentByParentOrderId(order.id);
    if (!payment) {
      throw new ApiError(404, "PAYMENT_NOT_FOUND", "No payment initiation record found for this order");
    }

    const adapter = PaymentGatewayFactory.getAdapter(payment.gatewayProvider);
    const verification = await adapter.processPaymentVerification(params.transactionId, params.gatewayOrderId);

    const prevPaymentStatus = payment.status;
    payment.status = verification.status;
    payment.gatewayResponse = verification.gatewayResponse;
    await this.repo.updatePayment(payment.id, payment);

    await this.repo.updateOrderPaymentStatus(order.id, verification.status);

    // Audit Log
    await this.repo.logAudit({
      paymentId: payment.id,
      parentOrderId: order.id,
      eventType: "PAYMENT_VERIFIED",
      previousStatus: prevPaymentStatus,
      newStatus: verification.status,
      actorId: params.actorId || order.userId,
      actorRole: "CUSTOMER",
      ipAddress: params.ipAddress,
      details: {
        transactionId: params.transactionId,
        verificationStatus: verification.status
      }
    });

    return {
      success: verification.status === "PAID" || verification.status === "AUTHORIZED",
      paymentStatus: verification.status,
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus
    };
  }

  async handleWebhook(payload: PaymentWebhookPayload, signature?: string, ipAddress?: string) {
    const adapter = PaymentGatewayFactory.getAdapter();
    const isValid = adapter.verifyWebhookSignature(payload.rawPayload || payload, signature);
    if (!isValid) {
      throw new ApiError(401, "INVALID_WEBHOOK_SIGNATURE", "Webhook signature verification failed");
    }

    // Webhook Idempotency Check
    const pastLogs = await this.repo.getAuditLogs(payload.parentOrderId);
    const alreadyProcessed = pastLogs.some(
      l => l.idempotencyKey === payload.eventId || (l.details?.transactionId === payload.transactionId && l.eventType === "WEBHOOK_PROCESSED")
    );

    if (alreadyProcessed) {
      return {
        success: true,
        message: "Webhook event already processed (idempotent skip)",
        eventId: payload.eventId
      };
    }

    const order = await this.repo.getOrderById(payload.parentOrderId);
    if (!order) {
      throw new ApiError(404, "ORDER_NOT_FOUND", `Order '${payload.parentOrderId}' not found`);
    }

    const payment = await this.repo.getPaymentByParentOrderId(order.id);
    const prevStatus = payment ? payment.status : order.paymentStatus;

    if (payment) {
      payment.status = payload.status;
      payment.gatewayResponse = payload.rawPayload;
      await this.repo.updatePayment(payment.id, payment);
    }

    await this.repo.updateOrderPaymentStatus(order.id, payload.status);

    // Audit Log
    await this.repo.logAudit({
      paymentId: payment?.id,
      parentOrderId: order.id,
      eventType: "WEBHOOK_PROCESSED",
      previousStatus: prevStatus,
      newStatus: payload.status,
      idempotencyKey: payload.eventId,
      actorId: "GATEWAY_WEBHOOK",
      actorRole: "SYSTEM",
      ipAddress,
      details: {
        eventId: payload.eventId,
        eventType: payload.eventType,
        transactionId: payload.transactionId,
        amount: payload.amount
      }
    });

    return {
      success: true,
      message: "Webhook processed successfully",
      orderId: order.id,
      status: payload.status
    };
  }

  async getPaymentDetails(parentOrderId: string) {
    const payment = await this.repo.getPaymentByParentOrderId(parentOrderId);
    const auditLogs = await this.repo.getAuditLogs(parentOrderId);
    return {
      payment,
      auditLogs
    };
  }
}

export const paymentsService = new PaymentsService();
