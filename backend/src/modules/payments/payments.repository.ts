import { db } from "../../db/connection.js";
import { DbPayment, DbPaymentAuditLog, DbOrder, PaymentStatus } from "../../db/schema.js";

export class PaymentsRepository {
  async getOrderById(orderId: string): Promise<DbOrder | null> {
    return db.getOrderById(orderId);
  }

  async getPaymentById(paymentId: string): Promise<DbPayment | null> {
    return db.getPaymentById(paymentId);
  }

  async getPaymentByParentOrderId(orderId: string): Promise<DbPayment | null> {
    return db.getPaymentByParentOrderId(orderId);
  }

  async createPayment(payment: DbPayment): Promise<DbPayment> {
    return db.createPayment(payment);
  }

  async updatePayment(paymentId: string, updates: Partial<DbPayment>): Promise<DbPayment | null> {
    return db.updatePayment(paymentId, updates);
  }

  async updateOrderPaymentStatus(orderId: string, status: PaymentStatus): Promise<DbOrder | null> {
    const order = await db.getOrderById(orderId);
    if (!order) return null;
    order.paymentStatus = status;
    if (status === "PAID" && order.orderStatus === "PLACED") {
      order.orderStatus = "PROCESSING";
    }
    order.updatedAt = new Date().toISOString();
    return order;
  }

  async logAudit(log: Omit<DbPaymentAuditLog, "id" | "createdAt">): Promise<DbPaymentAuditLog> {
    return db.logPaymentAudit(log);
  }

  async getAuditLogs(orderId?: string): Promise<DbPaymentAuditLog[]> {
    return db.getPaymentAuditLogs(orderId);
  }
}

export const paymentsRepository = new PaymentsRepository();
