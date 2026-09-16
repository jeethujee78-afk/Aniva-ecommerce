import { cartRepository, CartRepository } from "./cart.repository.js";
import { db } from "../../db/connection.js";
import { ApiError } from "../../middleware/errorHandler.js";
import { DbCart, DbCartItem } from "../../db/schema.js";
import { COMMERCE_CONFIG } from "../../config/commerce.config.js";

export interface EnrichedCartItem {
  id: string;
  productId: string;
  variantId: string;
  sku: string;
  title: string;
  size: string;
  colorName: string;
  colorHex: string;
  fitType?: string | null;
  image: string;
  price: number;
  mrp: number;
  quantity: number;
  totalPrice: number;
  productSource: "ANIVA_STORE" | "VERIFIED_RETAILER";
  sellerId: string;
  sellerName: string;
  customDesign?: any;
  inStock: boolean;
  availableStock: number;
  isPreOwned?: boolean;
}

export interface EnrichedCart {
  id: string;
  userId?: string | null;
  sessionId: string;
  items: EnrichedCartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  total: number;
  currency: string;
}

export class CartService {
  constructor(private repo: CartRepository = cartRepository) {}

  async getEnrichedCart(identifier: { userId?: string; sessionId: string }): Promise<EnrichedCart> {
    const rawCart = await this.repo.getCart(identifier);
    const enrichedItems: EnrichedCartItem[] = [];

    for (const item of rawCart.items) {
      const product = await db.getProductById(item.productId);
      if (!product) continue;

      const variant = product.variants.find(v => v.id === item.variantId);
      if (!variant) continue;

      const inventory = await db.getInventoryByVariantId(variant.id);
      const effectiveStock = inventory ? Math.max(0, inventory.availableStock - inventory.reservedStock) : 0;
      const inStock = effectiveStock >= item.quantity && effectiveStock > 0;

      let sellerName = "ANIVA Direct";
      if (product.productSource === "VERIFIED_RETAILER" && product.retailerId) {
        const retailers = await db.getRetailers();
        const retailer = retailers.find(r => r.id === product.retailerId);
        sellerName = retailer?.businessName || "Verified Retailer";
      }

      const primaryImage = product.images.find(i => i.isPrimary)?.imageUrl || product.images[0]?.imageUrl || "";
      const unitPrice = item.customDesign?.calculatedPrice || product.sellingPrice;

      enrichedItems.push({
        id: item.id,
        productId: product.id,
        variantId: variant.id,
        sku: variant.sku,
        title: product.title,
        size: variant.size,
        colorName: variant.colorName,
        colorHex: variant.colorHex,
        fitType: variant.fitType,
        image: primaryImage,
        price: unitPrice,
        mrp: product.mrp,
        quantity: item.quantity,
        totalPrice: unitPrice * item.quantity,
        productSource: product.productSource,
        sellerId: product.retailerId || "aniva-store",
        sellerName,
        customDesign: item.customDesign,
        inStock,
        availableStock: effectiveStock,
        isPreOwned: product.tags.includes("Pre-Owned")
      });
    }

    const subtotal = enrichedItems.reduce((acc, i) => acc + i.totalPrice, 0);
    const freeShippingThreshold = COMMERCE_CONFIG.shipping.getFreeShippingThreshold();
    const shippingFee = COMMERCE_CONFIG.shipping.calculateShippingFee(subtotal, enrichedItems.length);
    const discount = 0; // Coupon discount applied at checkout
    const total = Math.max(0, subtotal - discount + shippingFee);
    const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);

    return {
      id: rawCart.id,
      userId: rawCart.userId,
      sessionId: rawCart.sessionId,
      items: enrichedItems,
      itemCount: enrichedItems.reduce((acc, i) => acc + i.quantity, 0),
      subtotal,
      discount,
      shippingFee,
      freeShippingThreshold,
      freeShippingRemaining,
      total,
      currency: "INR"
    };
  }

  async addItem(identifier: { userId?: string; sessionId: string }, payload: {
    productId: string;
    variantId: string;
    quantity?: number;
    customDesign?: any;
  }): Promise<EnrichedCart> {
    const qty = Math.max(1, payload.quantity || 1);
    const product = await db.getProductById(payload.productId);
    if (!product || !product.isActive) {
      throw new ApiError(404, "PRODUCT_NOT_FOUND", "Product does not exist or is inactive");
    }

    const variant = product.variants.find(v => v.id === payload.variantId);
    if (!variant) {
      throw new ApiError(404, "VARIANT_NOT_FOUND", "Product variant does not exist");
    }

    const inventory = await db.getInventoryByVariantId(variant.id);
    const effectiveStock = inventory ? Math.max(0, inventory.availableStock - inventory.reservedStock) : 0;
    if (effectiveStock < qty) {
      throw new ApiError(400, "INSUFFICIENT_STOCK", `Only ${effectiveStock} units available for SKU ${variant.sku}`);
    }

    const cart = await this.repo.getCart(identifier);
    const existingIndex = cart.items.findIndex(
      i => i.productId === payload.productId && i.variantId === payload.variantId && !payload.customDesign
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + qty;
      if (effectiveStock < newQty) {
        throw new ApiError(400, "INSUFFICIENT_STOCK", `Cannot add ${qty} more. Available stock: ${effectiveStock}`);
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      const newItem: DbCartItem = {
        id: `cart-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        variantId: variant.id,
        quantity: qty,
        customDesign: payload.customDesign,
        addedAt: new Date().toISOString()
      };
      cart.items.push(newItem);
    }

    await this.repo.saveCart(cart);
    return this.getEnrichedCart(identifier);
  }

  async updateQuantity(
    identifier: { userId?: string; sessionId: string },
    itemId: string,
    quantity: number
  ): Promise<EnrichedCart> {
    const cart = await this.repo.getCart(identifier);
    const itemIndex = cart.items.findIndex(i => i.id === itemId);

    if (itemIndex === -1) {
      throw new ApiError(404, "ITEM_NOT_FOUND", "Item not found in cart");
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const item = cart.items[itemIndex];
      const inventory = await db.getInventoryByVariantId(item.variantId);
      const effectiveStock = inventory ? Math.max(0, inventory.availableStock - inventory.reservedStock) : 0;

      if (effectiveStock < quantity) {
        throw new ApiError(400, "INSUFFICIENT_STOCK", `Only ${effectiveStock} units available in stock`);
      }

      item.quantity = quantity;
    }

    await this.repo.saveCart(cart);
    return this.getEnrichedCart(identifier);
  }

  async removeItem(identifier: { userId?: string; sessionId: string }, itemId: string): Promise<EnrichedCart> {
    const cart = await this.repo.getCart(identifier);
    cart.items = cart.items.filter(i => i.id !== itemId);
    await this.repo.saveCart(cart);
    return this.getEnrichedCart(identifier);
  }

  async clearCart(identifier: { userId?: string; sessionId: string }): Promise<void> {
    await this.repo.clearCart(identifier);
  }

  async reserveCheckoutInventory(identifier: { userId?: string; sessionId: string }): Promise<{
    reservationToken: string;
    expiresAt: string;
  }> {
    const cart = await this.getEnrichedCart(identifier);
    if (cart.items.length === 0) {
      throw new ApiError(400, "CART_EMPTY", "Cannot reserve inventory for an empty cart");
    }

    const itemsToReserve = cart.items.map(i => ({
      variantId: i.variantId,
      quantity: i.quantity
    }));

    const ttlMinutes = COMMERCE_CONFIG.getInventoryReservationTTLMinutes();

    const result = await this.repo.createReservation({
      items: itemsToReserve,
      userId: identifier.userId,
      ttlMinutes
    });

    if (!result.success || !result.reservationToken) {
      throw new ApiError(409, "STOCK_RESERVATION_FAILED", result.error || "Inventory reservation failed due to stock changes");
    }

    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
    return {
      reservationToken: result.reservationToken,
      expiresAt
    };
  }
}

export const cartService = new CartService();
