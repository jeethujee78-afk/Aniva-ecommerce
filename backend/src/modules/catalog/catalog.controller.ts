import { Request, Response, NextFunction } from "express";
import { catalogService } from "./catalog.service.js";
import { ApiResponse } from "../../types/common.js";

export class CatalogController {
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await catalogService.listCategories();
      const response: ApiResponse = {
        success: true,
        data: categories
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await catalogService.listBrands();
      const response: ApiResponse = {
        success: true,
        data: brands
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        category,
        brand,
        source,
        minPrice,
        maxPrice,
        search,
        inStockOnly,
        sortBy,
        page,
        limit
      } = req.query as any;

      const result = await catalogService.listProducts({
        category,
        brand,
        source,
        minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
        maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
        search,
        inStockOnly: inStockOnly === true || inStockOnly === "true",
        sortBy,
        page: page !== undefined ? Number(page) : undefined,
        limit: limit !== undefined ? Number(limit) : undefined
      });

      const response: ApiResponse = {
        success: true,
        data: result.products,
        meta: result.meta
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await catalogService.getProductById(req.params.id);
      const response: ApiResponse = {
        success: true,
        data: product
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getProductVariants(req: Request, res: Response, next: NextFunction) {
    try {
      const variants = await catalogService.getProductVariants(req.params.id);
      const response: ApiResponse = {
        success: true,
        data: variants
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getProductImages(req: Request, res: Response, next: NextFunction) {
    try {
      const images = await catalogService.getProductImages(req.params.id);
      const response: ApiResponse = {
        success: true,
        data: images
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const catalogController = new CatalogController();
