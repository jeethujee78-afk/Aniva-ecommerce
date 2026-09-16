import { db } from "../../db/connection.js";
import { ApiError } from "../../middleware/errorHandler.js";

export class UsersService {
  async getProfile(userId: string) {
    const user = await db.getUserById(userId);
    if (!user) {
      throw new ApiError(404, "USER_NOT_FOUND", "User profile not found");
    }

    return {
      id: user.id,
      mobile: user.mobile,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    };
  }

  async getUserAddresses(userId: string) {
    return db.getAddressesByUserId(userId);
  }
}

export const usersService = new UsersService();
