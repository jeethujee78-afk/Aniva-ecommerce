import { Request, Response, NextFunction } from "express";
import { paymentsService } from "./payments.service.js";
import { ApiResponse } from "../../types/common.js";

export class PaymentsController {
  async initiate(req: Request, res: Response, next: NextFunction) {
    try {
      const { parentOrderId, paymentMethod } = req.body;
      const result = await paymentsService.initiatePayment({
        parentOrderId,
        paymentMethod: paymentMethod || "UPI",
        actorId: req.user?.id,
        ipAddress: req.ip
      });
      const response: ApiResponse = {
        success: true,
        data: result
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { parentOrderId, transactionId, gatewayOrderId } = req.body;
      const result = await paymentsService.verifyPayment({
        parentOrderId,
        transactionId,
        gatewayOrderId,
        actorId: req.user?.id,
        ipAddress: req.ip
      });
      const response: ApiResponse = {
        success: true,
        data: result
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = (req.headers["x-webhook-signature"] as string) || (req.headers["x-razorpay-signature"] as string);
      const result = await paymentsService.handleWebhook(req.body, signature, req.ip);
      const response: ApiResponse = {
        success: true,
        data: result
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const result = await paymentsService.getPaymentDetails(orderId);
      const response: ApiResponse = {
        success: true,
        data: result
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const paymentsController = new PaymentsController();
