import { Request, Response, NextFunction } from "express";
import { cartService } from "./cart.service.js";
import { ApiResponse } from "../../types/common.js";

function extractIdentifier(req: Request): { userId?: string; sessionId: string } {
  const userId = req.user?.id;
  const sessionId = (req.headers["x-session-id"] as string) || req.body.sessionId || (req.query.sessionId as string) || userId || "guest-session";
  return { userId, sessionId };
}

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = extractIdentifier(req);
      const cart = await cartService.getEnrichedCart(identifier);
      const response: ApiResponse = {
        success: true,
        data: cart
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = extractIdentifier(req);
      const { productId, variantId, quantity, customDesign } = req.body;
      const cart = await cartService.addItem(identifier, {
        productId,
        variantId,
        quantity: Number(quantity) || 1,
        customDesign
      });
      const response: ApiResponse = {
        success: true,
        data: cart
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = extractIdentifier(req);
      const { itemId } = req.params;
      const { quantity } = req.body;
      const cart = await cartService.updateQuantity(identifier, itemId, Number(quantity));
      const response: ApiResponse = {
        success: true,
        data: cart
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = extractIdentifier(req);
      const { itemId } = req.params;
      const cart = await cartService.removeItem(identifier, itemId);
      const response: ApiResponse = {
        success: true,
        data: cart
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = extractIdentifier(req);
      await cartService.clearCart(identifier);
      const response: ApiResponse = {
        success: true,
        data: { message: "Cart cleared successfully" }
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async reserveCheckout(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = extractIdentifier(req);
      const reservation = await cartService.reserveCheckoutInventory(identifier);
      const response: ApiResponse = {
        success: true,
        data: reservation
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
