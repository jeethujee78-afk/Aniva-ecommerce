import { Router } from "express";
import { cartController } from "./cart.controller.js";
import { optionalAuthenticate } from "../../middleware/auth.js";

const router = Router();

// All cart endpoints support both guest session ID and authenticated user
router.use(optionalAuthenticate);

router.get("/", (req, res, next) => cartController.getCart(req, res, next));
router.post("/items", (req, res, next) => cartController.addItem(req, res, next));
router.patch("/items/:itemId", (req, res, next) => cartController.updateQuantity(req, res, next));
router.delete("/items/:itemId", (req, res, next) => cartController.removeItem(req, res, next));
router.delete("/", (req, res, next) => cartController.clearCart(req, res, next));
router.post("/reserve", (req, res, next) => cartController.reserveCheckout(req, res, next));

export default router;
