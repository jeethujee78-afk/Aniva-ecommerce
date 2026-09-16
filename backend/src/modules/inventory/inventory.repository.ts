import { db } from "../../db/connection.js";
import { DbInventoryRecord } from "../../db/schema.js";

export class InventoryRepository {
  async getInventoryByVariantId(variantId: string): Promise<DbInventoryRecord | null> {
    return db.getInventoryByVariantId(variantId);
  }

  async getInventoryBySku(sku: string): Promise<DbInventoryRecord | null> {
    return db.getInventoryBySku(sku);
  }
}

export const inventoryRepository = new InventoryRepository();
