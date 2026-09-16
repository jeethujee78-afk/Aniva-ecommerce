import { Router } from "express";
import { inventoryController } from "./inventory.controller.js";

const router = Router();

router.get("/variant/:variantId", (req, res, next) => inventoryController.getVariantStock(req, res, next));
router.get("/sku/:sku", (req, res, next) => inventoryController.getSkuStock(req, res, next));

export default router;
