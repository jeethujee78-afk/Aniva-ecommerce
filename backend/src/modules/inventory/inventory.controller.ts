import { Request, Response, NextFunction } from "express";
import { inventoryService } from "./inventory.service.js";
import { ApiResponse } from "../../types/common.js";

export class InventoryController {
  async getVariantStock(req: Request, res: Response, next: NextFunction) {
    try {
      const stock = await inventoryService.checkStock(req.params.variantId);
      const response: ApiResponse = {
        success: true,
        data: stock
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getSkuStock(req: Request, res: Response, next: NextFunction) {
    try {
      const stock = await inventoryService.checkStockBySku(req.params.sku);
      const response: ApiResponse = {
        success: true,
        data: stock
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const inventoryController = new InventoryController();
