import { Router } from "express";
import { usersController } from "./users.controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = Router();

router.get("/me", authenticate, (req, res, next) => usersController.getMe(req, res, next));
router.get("/me/addresses", authenticate, (req, res, next) => usersController.getMyAddresses(req, res, next));

export default router;
