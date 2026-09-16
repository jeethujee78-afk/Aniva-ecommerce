import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../types/common.js";
import { authenticate } from "../../middleware/auth.js";

export class AuthController {
  async getSession(req: Request, res: Response, next: NextFunction) {
    try {
      const response: ApiResponse = {
        success: true,
        data: {
          user: req.user
        }
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
