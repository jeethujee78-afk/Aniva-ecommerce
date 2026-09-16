import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = Router();

router.get("/session", authenticate, (req, res, next) => authController.getSession(req, res, next));

export default router;
