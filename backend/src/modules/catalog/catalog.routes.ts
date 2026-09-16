import { Router } from "express";
import { catalogController } from "./catalog.controller.js";
import { validate } from "../../middleware/validate.js";
import { getProductsQuerySchema, productIdParamSchema } from "./catalog.validation.js";

const router = Router();

// Public Catalog Endpoints
router.get("/categories", (req, res, next) => catalogController.getCategories(req, res, next));
router.get("/brands", (req, res, next) => catalogController.getBrands(req, res, next));
router.get("/products", validate({ query: getProductsQuerySchema }), (req, res, next) => catalogController.getProducts(req, res, next));
router.get("/products/:id", validate({ params: productIdParamSchema }), (req, res, next) => catalogController.getProductById(req, res, next));
router.get("/products/:id/variants", validate({ params: productIdParamSchema }), (req, res, next) => catalogController.getProductVariants(req, res, next));
router.get("/products/:id/images", validate({ params: productIdParamSchema }), (req, res, next) => catalogController.getProductImages(req, res, next));

export default router;
