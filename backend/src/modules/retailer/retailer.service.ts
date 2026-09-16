import { db } from "../../db/connection.js";
import { ApiError } from "../../middleware/errorHandler.js";

export class RetailerService {
  async getRetailerProfile(retailerId: string) {
    const retailers = await db.getRetailers();
    const retailer = retailers.find(r => r.id === retailerId);
    if (!retailer) {
      throw new ApiError(404, "RETAILER_NOT_FOUND", "Retailer merchant profile not found");
    }

    return {
      id: retailer.id,
      businessName: retailer.businessName,
      tradeName: retailer.tradeName,
      contactEmail: retailer.contactEmail,
      contactPhone: retailer.contactPhone,
      status: retailer.status,
      pickupPincode: retailer.pickupPincode,
      pickupAddress: retailer.pickupAddress,
      createdAt: retailer.createdAt
    };
  }

  async getRetailerProducts(retailerId: string) {
    // Strictly isolate by retailerId
    const result = await db.getProducts({ retailerId });
    return result.products;
  }
}

export const retailerService = new RetailerService();
