import { Request, Response, NextFunction } from "express";
import { returnsService } from "./returns.service.js";
import { ApiResponse } from "../../types/common.js";
import { ApiError } from "../../middleware/errorHandler.js";

export class ReturnsController {
  async checkEligibility(req: Request, res: Response, next: NextFunction) {
    try {
      const { parentOrderId, orderItemId } = req.params;
      const result = await returnsService.checkEligibility({
        parentOrderId,
        orderItemId,
        userId: req.user?.id
      });
      const response: ApiResponse = {
        success: true,
        data: result
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async createReturn(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "UNAUTHORIZED", "Authentication required to submit return request");
      }
      const { parentOrderId, orderItemId, reason, customerNotes, images } = req.body;
      const result = await returnsService.requestReturn({
        parentOrderId,
        orderItemId,
        userId: req.user.id,
        reason,
        customerNotes,
        images
      });
      const response: ApiResponse = {
        success: true,
        data: result
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async reviewReturn(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "UNAUTHORIZED", "Authentication required");
      }
      const { returnRequestId } = req.params;
      const { status, notes } = req.body;

      const result = await returnsService.reviewReturnRequest({
        returnRequestId,
        status,
        notes,
        reviewerId: req.user.id,
        reviewerRole: req.user.role,
        retailerId: req.user.retailerId
      });

      const response: ApiResponse = {
        success: true,
        data: result
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async processRefund(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "UNAUTHORIZED", "Authentication required");
      }
      const { parentOrderId, returnRequestId, amount, reason, restockInventory } = req.body;
      const result = await returnsService.processRefund({
        parentOrderId,
        returnRequestId,
        amount,
        reason: reason || "Customer return refund",
        authorizedBy: req.user.id,
        authorizedRole: req.user.role,
        restockInventory: Boolean(restockInventory)
      });
      const response: ApiResponse = {
        success: true,
        data: result
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getMyReturns(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, "UNAUTHORIZED", "Authentication required");
      }
      const list = await returnsService.getCustomerReturns(req.user.id);
      const response: ApiResponse = {
        success: true,
        data: list
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getRetailerReturns(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || (req.user.role !== "RETAILER" && req.user.role !== "ADMIN_SUPER")) {
        throw new ApiError(403, "FORBIDDEN", "Retailer access required");
      }
      const retailerId = req.user.retailerId || (req.query.retailerId as string);
      if (!retailerId) {
        throw new ApiError(400, "MISSING_RETAILER_ID", "Retailer ID required");
      }
      const list = await returnsService.getRetailerReturns(retailerId);
      const response: ApiResponse = {
        success: true,
        data: list
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getOrderRefunds(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const list = await returnsService.getOrderRefunds(orderId);
      const response: ApiResponse = {
        success: true,
        data: list
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const returnsController = new ReturnsController();
