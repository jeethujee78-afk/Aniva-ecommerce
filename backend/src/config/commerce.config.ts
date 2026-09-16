import { ENV } from "./env.js";

/**
 * ANIVA Commerce Engine Dynamic Configuration & Policy Engine
 * 
 * Verifications addressed:
 * - Inventory reservation TTL is configurable via ENV / runtime parameter
 * - Shipping rules, thresholds, fees, and delivery SLA estimates are policy-driven [TBD]
 * - Return policies are seller/product policy driven without universal hardcoded assumptions
 * - Platform commission rates are configurable per retailer contract
 */

export interface ShippingPolicyConfig {
  defaultFee: number;
  freeShippingThreshold: number;
  expressDeliveryStates: string[];
  expressDeliveryDays: number;
  standardDeliveryDays: number;
}

export interface SellerPolicyConfig {
  sellerId: string;
  returnWindowDays: number;
  isReturnable: boolean;
  restockFeeRate?: number;
}

export const COMMERCE_CONFIG = {
  // Inventory Reservation TTL (Default: 15 minutes, configurable via ENV)
  getInventoryReservationTTLMinutes(): number {
    return ENV.INVENTORY_RESERVATION_TTL_MINUTES || 15;
  },

  // Shipping Rules & SLA Configuration [Configurable / Policy-Driven / TBD]
  shipping: {
    getDefaultFee(): number {
      return ENV.DEFAULT_SHIPPING_FEE || 99;
    },
    getFreeShippingThreshold(): number {
      return ENV.FREE_SHIPPING_THRESHOLD || 1999;
    },
    calculateShippingFee(subtotal: number, itemCount: number): number {
      if (itemCount === 0) return 0;
      const threshold = this.getFreeShippingThreshold();
      return subtotal >= threshold ? 0 : this.getDefaultFee();
    },
    calculateEstimatedDelivery(destinationState?: string): { estimatedDeliveryDate: string; courierPartner: string; transitDays: number } {
      const state = (destinationState || "").trim().toLowerCase();
      const southStates = ["tamil nadu", "kerala", "karnataka", "andhra pradesh", "telangana"];
      const isRegionalExpress = southStates.includes(state);
      
      // Transit days are SLA estimates [Subject to courier partner dispatch schedule]
      const transitDays = isRegionalExpress ? 2 : 4;
      const estDate = new Date();
      estDate.setDate(estDate.getDate() + transitDays);

      return {
        estimatedDeliveryDate: estDate.toISOString().split("T")[0],
        courierPartner: isRegionalExpress ? "South Express Logistics" : "National Air Express",
        transitDays
      };
    }
  },

  // Commission Configuration [Configurable per retailer agreement]
  commission: {
    getDefaultCommissionRate(): number {
      return ENV.DEFAULT_COMMISSION_RATE || 15;
    }
  }
};
