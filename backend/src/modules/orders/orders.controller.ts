import { Request, Response, NextFunction } from "express";
import { ordersService } from "./orders.service.js";
import { ApiResponse } from "../../types/common.js";
import { ApiError } from "../../middleware/errorHandler.js";

export class OrdersController {
  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const idempotencyKey = (req.headers["x-idempotency-key"] as string) || req.body.idempotencyKey;
      const sessionId = (req.headers["x-session-id"] as string) || req.body.sessionId;
      const userId = req.user?.id || req.body.userId || null;

      const orderData = await ordersService.checkoutOrder({
        userId,
        items: req.body.items,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod || "UPI",
        couponCode: req.body.couponCode,
        idempotencyKey,
        reservationToken: req.body.reservationToken,
        sessionId
      });

      const response: ApiResponse = {
        success: true,
        data: orderData
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const orderData = await ordersService.getOrderDetails(orderId, req.user);
      const response: ApiResponse = {
        success: true,
        data: orderData
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "UNAUTHORIZED", "Authentication required to fetch order history");
      }
      const orders = await ordersService.getCustomerOrders(req.user.id);
      const response: ApiResponse = {
        success: true,
        data: orders
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async trackOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.params;
      const results = await ordersService.trackOrder(query);
      const response: ApiResponse = {
        success: true,
        data: results
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getRetailerOrders(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || (req.user.role !== "RETAILER" && req.user.role !== "ADMIN_SUPER")) {
        throw new ApiError(403, "FORBIDDEN", "Retailer access required");
      }
      const retailerId = req.user.retailerId || req.query.retailerId as string;
      if (!retailerId) {
        throw new ApiError(400, "MISSING_RETAILER_ID", "Retailer identifier is required");
      }
      const orders = await ordersService.getRetailerOrders(retailerId);
      const response: ApiResponse = {
        success: true,
        data: orders
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateSellerOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { sellerOrderId } = req.params;
      const { status } = req.body;
      const retailerId = req.user?.role === "RETAILER" ? req.user.retailerId : undefined;
      const updated = await ordersService.updateSellerOrderStatus(sellerOrderId, status, retailerId);
      const response: ApiResponse = {
        success: true,
        data: updated
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const ordersController = new OrdersController();
