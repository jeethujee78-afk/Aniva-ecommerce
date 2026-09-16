import { db } from "../../db/connection.js";
import { DbOrder, DbSellerOrder, DbOrderItem, OrderStatus, PaymentStatus } from "../../db/schema.js";

export class OrdersRepository {
  async getOrderById(id: string): Promise<DbOrder | null> {
    return db.getOrderById(id);
  }

  async getOrderByIdempotencyKey(key: string): Promise<DbOrder | null> {
    return db.getOrderByIdempotencyKey(key);
  }

  async getOrdersByUserId(userId: string): Promise<DbOrder[]> {
    return db.getOrdersByUserId(userId);
  }

  async getAllOrders(): Promise<DbOrder[]> {
    return db.getAllOrders();
  }

  async getSellerOrderById(id: string): Promise<DbSellerOrder | null> {
    return db.getSellerOrderById(id);
  }

  async getSellerOrdersBySellerId(sellerId: string): Promise<DbSellerOrder[]> {
    return db.getSellerOrdersBySellerId(sellerId);
  }

  async getOrderItemsByParentOrderId(parentOrderId: string): Promise<DbOrderItem[]> {
    return db.getOrderItemsByParentOrderId(parentOrderId);
  }

  async getOrderItemsBySellerOrderId(sellerOrderId: string): Promise<DbOrderItem[]> {
    return db.getOrderItemsBySellerOrderId(sellerOrderId);
  }

  async createOrder(order: DbOrder, sellerOrders: DbSellerOrder[], items: DbOrderItem[]): Promise<DbOrder> {
    return db.createOrder(order, sellerOrders, items);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<DbOrder | null> {
    return db.updateOrderStatus(orderId, status);
  }

  async updateSellerOrderStatus(sellerOrderId: string, status: OrderStatus): Promise<DbSellerOrder | null> {
    return db.updateSellerOrderStatus(sellerOrderId, status);
  }

  async commitReservation(token: string): Promise<boolean> {
    return db.commitInventoryReservation(token);
  }

  async releaseReservation(token: string): Promise<boolean> {
    return db.releaseInventoryReservation(token);
  }
}

export const ordersRepository = new OrdersRepository();
