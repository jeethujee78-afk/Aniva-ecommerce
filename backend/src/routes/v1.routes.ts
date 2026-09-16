import { Router } from "express";
import catalogRoutes from "../modules/catalog/catalog.routes.js";
import inventoryRoutes from "../modules/inventory/inventory.routes.js";
import usersRoutes from "../modules/users/users.routes.js";
import retailerRoutes from "../modules/retailer/retailer.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import cartRoutes from "../modules/cart/cart.routes.js";
import ordersRoutes from "../modules/orders/orders.routes.js";
import paymentsRoutes from "../modules/payments/payments.routes.js";
import returnsRoutes from "../modules/returns/returns.routes.js";
import { ApiResponse } from "../types/common.js";
import { ENV } from "../config/env.js";

const router = Router();

// 1. Health & Environment Diagnostics Endpoint [CONFIRMED]
router.get("/health", (req, res) => {
  const response: ApiResponse = {
    success: true,
    data: {
      status: "healthy",
      service: "ANIVA Modular Monolith Backend",
      version: "v1",
      environment: ENV.NODE_ENV,
      region: ENV.PRIMARY_REGION,
      dbMode: ENV.HAS_EXTERNAL_DB ? "postgresql" : "in-memory (development seed)",
      cacheMode: ENV.HAS_EXTERNAL_REDIS ? "redis" : "in-memory (development)",
      authMode: ENV.HAS_MANAGED_AUTH ? `managed (${ENV.AUTH_PROVIDER})` : `development (${ENV.AUTH_PROVIDER})`,
      timestamp: new Date().toISOString()
    }
  };
  res.json(response);
});

// 2. Catalog & Discovery Domain
router.use("/", catalogRoutes); // Exposes /categories, /brands, /products, /products/:id, /products/:id/variants, /products/:id/images

// 3. Inventory Domain
router.use("/inventory", inventoryRoutes); // Exposes /inventory/variant/:variantId, /inventory/sku/:sku

// 4. Identity & User Profile Domain
router.use("/users", usersRoutes); // Exposes /users/me, /users/me/addresses

// 5. Retailer Domain (Isolated Tenant)
router.use("/retailer", retailerRoutes); // Exposes /retailer/profile, /retailer/products

// 6. Authentication Domain
router.use("/auth", authRoutes); // Exposes /auth/session

// 7. 5.6 Cart & Reservation Domain
router.use("/cart", cartRoutes);

// 8. 5.7 Orders & Multi-Seller Fulfillment Domain
router.use("/orders", ordersRoutes);

// 9. 5.8 Payments & Gateway Abstraction Domain
router.use("/payments", paymentsRoutes);

// 10. 5.9 Returns & Refunds Domain
router.use("/returns", returnsRoutes);

export default router;

