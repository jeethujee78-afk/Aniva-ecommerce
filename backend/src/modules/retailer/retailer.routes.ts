import { Router } from "express";
import { retailerController } from "./retailer.controller.js";
import { authenticate, requireRole, enforceRetailerTenant } from "../../middleware/auth.js";

const router = Router();

// Protected Retailer Endpoints (Requires RETAILER role and tenant isolation)
router.get("/profile", authenticate, requireRole("RETAILER", "ADMIN_SUPER"), enforceRetailerTenant, (req, res, next) => retailerController.getProfile(req, res, next));
router.get("/products", authenticate, requireRole("RETAILER", "ADMIN_SUPER"), enforceRetailerTenant, (req, res, next) => retailerController.getMyProducts(req, res, next));

export default router;
