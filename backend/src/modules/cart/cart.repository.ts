import { db } from "../../db/connection.js";
import { DbCart, DbProduct, DbProductVariant } from "../../db/schema.js";

export class CartRepository {
  async getCart(identifier: { userId?: string; sessionId: string }): Promise<DbCart> {
    return db.getCart(identifier);
  }

  async saveCart(cart: DbCart): Promise<DbCart> {
    return db.saveCart(cart);
  }

  async clearCart(identifier: { userId?: string; sessionId: string }): Promise<void> {
    return db.clearCart(identifier);
  }

  async getProductById(productId: string): Promise<DbProduct | null> {
    return db.getProductById(productId);
  }

  async getVariantById(variantId: string): Promise<DbProductVariant | null> {
    const variants = await db.getVariantsByProductId(""); // will query all variants
    return (db as any).variants.get(variantId) || null;
  }

  async getInventory(variantId: string) {
    return db.getInventoryByVariantId(variantId);
  }

  async createReservation(params: {
    items: Array<{ variantId: string; quantity: number }>;
    userId?: string | null;
    ttlMinutes?: number;
  }) {
    return db.createInventoryReservation(params);
  }
}

export const cartRepository = new CartRepository();
