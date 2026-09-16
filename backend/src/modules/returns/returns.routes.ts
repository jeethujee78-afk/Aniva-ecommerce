import { Router } from "express";
import { returnsController } from "./returns.controller.js";
import { authenticate, optionalAuthenticate, requireRole, enforceRetailerTenant } from "../../middleware/auth.js";

const router = Router();

// Check return eligibility for a specific order item
router.get("/eligibility/:parentOrderId/:orderItemId", optionalAuthenticate, (req, res, next) => 
  returnsController.checkEligibility(req, res, next)
);

// Customer submits a return request
router.post("/request", authenticate, (req, res, next) => 
  returnsController.createReturn(req, res, next)
);

// Customer views their return history
router.get("/my", authenticate, (req, res, next) => 
  returnsController.getMyReturns(req, res, next)
);

// Retailer views returns for their seller orders
router.get("/retailer", authenticate, enforceRetailerTenant, (req, res, next) => 
  returnsController.getRetailerReturns(req, res, next)
);

// Retailer or Admin reviews (approve/reject/update status) return request
router.patch("/:returnRequestId/review", authenticate, (req, res, next) => 
  returnsController.reviewReturn(req, res, next)
);

// Admin / Finance issues a refund
router.post("/refund", authenticate, requireRole("ADMIN_SUPER", "ADMIN_FINANCE", "ADMIN_OPS"), (req, res, next) => 
  returnsController.processRefund(req, res, next)
);

// Get refunds associated with an order
router.get("/refunds/:orderId", optionalAuthenticate, (req, res, next) => 
  returnsController.getOrderRefunds(req, res, next)
);

export default router;
