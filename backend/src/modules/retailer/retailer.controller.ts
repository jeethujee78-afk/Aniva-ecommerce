import { Request, Response, NextFunction } from "express";
import { retailerService } from "./retailer.service.js";
import { ApiResponse } from "../../types/common.js";
import { ApiError } from "../../middleware/errorHandler.js";

export class RetailerController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.retailerId) {
        throw new ApiError(403, "FORBIDDEN", "Retailer tenant association missing");
      }
      const profile = await retailerService.getRetailerProfile(req.user.retailerId);
      const response: ApiResponse = {
        success: true,
        data: profile
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getMyProducts(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.retailerId) {
        throw new ApiError(403, "FORBIDDEN", "Retailer tenant association missing");
      }
      const products = await retailerService.getRetailerProducts(req.user.retailerId);
      const response: ApiResponse = {
        success: true,
        data: products
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const retailerController = new RetailerController();
