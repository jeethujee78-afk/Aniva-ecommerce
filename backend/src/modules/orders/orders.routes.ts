import { Router } from "express";
import { ordersController } from "./orders.controller.js";
import { authenticate, optionalAuthenticate, requireRole, enforceRetailerTenant } from "../../middleware/auth.js";

const router = Router();

// Checkout route (supports guest or authenticated user)
router.post("/checkout", optionalAuthenticate, (req, res, next) => ordersController.checkout(req, res, next));

// Public tracking lookup
router.get("/track/:query", (req, res, next) => ordersController.trackOrder(req, res, next));

// Customer order history (requires authentication)
router.get("/my", authenticate, (req, res, next) => ordersController.getMyOrders(req, res, next));

// Order details by parent order ID
router.get("/:orderId", optionalAuthenticate, (req, res, next) => ordersController.getOrderById(req, res, next));

// Retailer isolated seller orders
router.get("/retailer/seller-orders", authenticate, enforceRetailerTenant, (req, res, next) => ordersController.getRetailerOrders(req, res, next));
router.patch("/seller-orders/:sellerOrderId/status", authenticate, (req, res, next) => ordersController.updateSellerOrderStatus(req, res, next));

export default router;
