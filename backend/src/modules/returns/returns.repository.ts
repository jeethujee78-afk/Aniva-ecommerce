import { db } from "../../db/connection.js";
import { 
  DbReturnRequest, 
  DbRefund, 
  DbOrder, 
  DbSellerOrder, 
  DbOrderItem, 
  DbPayment, 
  ReturnStatus, 
  RefundStatus 
} from "../../db/schema.js";

export class ReturnsRepository {
  async getOrderById(orderId: string): Promise<DbOrder | null> {
    return db.getOrderById(orderId);
  }

  async getSellerOrderById(sellerOrderId: string): Promise<DbSellerOrder | null> {
    return db.getSellerOrderById(sellerOrderId);
  }

  async getOrderItemById(orderItemId: string): Promise<DbOrderItem | null> {
    const allItems = await db.getOrderItemsByParentOrderId("");
    return (db as any).orderItems.get(orderItemId) || null;
  }

  async getSellerReturnPolicy(sellerId: string, productId?: string) {
    return db.getSellerReturnPolicy(sellerId, productId);
  }

  async createReturnRequest(req: DbReturnRequest): Promise<DbReturnRequest> {
    return db.createReturnRequest(req);
  }

  async getReturnRequestById(id: string): Promise<DbReturnRequest | null> {
    return db.getReturnRequestById(id);
  }

  async getReturnRequestsByUserId(userId: string): Promise<DbReturnRequest[]> {
    return db.getReturnRequestsByUserId(userId);
  }

  async getReturnRequestsBySellerId(sellerId: string): Promise<DbReturnRequest[]> {
    return db.getReturnRequestsBySellerId(sellerId);
  }

  async getAllReturnRequests(): Promise<DbReturnRequest[]> {
    return db.getAllReturnRequests();
  }

  async updateReturnStatus(id: string, status: ReturnStatus, notes?: string, reviewerId?: string): Promise<DbReturnRequest | null> {
    return db.updateReturnStatus(id, status, notes, reviewerId);
  }

  async createRefund(refund: DbRefund): Promise<DbRefund> {
    return db.createRefund(refund);
  }

  async getRefundById(id: string): Promise<DbRefund | null> {
    return db.getRefundById(id);
  }

  async getRefundsByParentOrderId(orderId: string): Promise<DbRefund[]> {
    return db.getRefundsByParentOrderId(orderId);
  }

  async getAllRefunds(): Promise<DbRefund[]> {
    return db.getAllRefunds();
  }

  async updateRefundStatus(id: string, status: RefundStatus, gatewayRefundId?: string): Promise<DbRefund | null> {
    return db.updateRefundStatus(id, status, gatewayRefundId);
  }

  async getPaymentByOrderId(orderId: string): Promise<DbPayment | null> {
    return db.getPaymentByParentOrderId(orderId);
  }

  async restoreInventory(items: Array<{ variantId: string; quantity: number }>): Promise<void> {
    return db.restoreInventory(items);
  }
}

export const returnsRepository = new ReturnsRepository();
