import { Request, Response, NextFunction } from "express";
import { usersService } from "./users.service.js";
import { ApiResponse } from "../../types/common.js";

export class UsersController {
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await usersService.getProfile(req.user!.id);
      const response: ApiResponse = {
        success: true,
        data: user
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getMyAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const addresses = await usersService.getUserAddresses(req.user!.id);
      const response: ApiResponse = {
        success: true,
        data: addresses
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();
