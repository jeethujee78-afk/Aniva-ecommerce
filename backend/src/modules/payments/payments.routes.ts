import { Router } from "express";
import { paymentsController } from "./payments.controller.js";
import { optionalAuthenticate } from "../../middleware/auth.js";

const router = Router();

// Payment initiation and client verification
router.post("/initiate", optionalAuthenticate, (req, res, next) => paymentsController.initiate(req, res, next));
router.post("/verify", optionalAuthenticate, (req, res, next) => paymentsController.verify(req, res, next));

// Webhook endpoint (authenticated via cryptographic signature check)
router.post("/webhook", (req, res, next) => paymentsController.webhook(req, res, next));

// Payment status lookup
router.get("/status/:orderId", optionalAuthenticate, (req, res, next) => paymentsController.getStatus(req, res, next));

export default router;
