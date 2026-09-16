import { inventoryRepository, InventoryRepository } from "./inventory.repository.js";
import { ApiError } from "../../middleware/errorHandler.js";

export class InventoryService {
  constructor(private repo: InventoryRepository = inventoryRepository) {}

  async checkStock(variantId: string) {
    const record = await this.repo.getInventoryByVariantId(variantId);
    if (!record) {
      throw new ApiError(404, "INVENTORY_NOT_FOUND", `Inventory record for variant '${variantId}' was not found`);
    }

    return {
      variantId: record.variantId,
      sku: record.sku,
      availableStock: record.availableStock,
      status: record.status,
      isAvailable: record.availableStock > 0
    };
  }

  async checkStockBySku(sku: string) {
    const record = await this.repo.getInventoryBySku(sku);
    if (!record) {
      throw new ApiError(404, "INVENTORY_NOT_FOUND", `Inventory record for SKU '${sku}' was not found`);
    }

    return {
      variantId: record.variantId,
      sku: record.sku,
      availableStock: record.availableStock,
      status: record.status,
      isAvailable: record.availableStock > 0
    };
  }
}

export const inventoryService = new InventoryService();
