import { z } from "zod";

export const getProductsQuerySchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  source: z.enum(["ANIVA_STORE", "VERIFIED_RETAILER"]).optional(),
  minPrice: z.string().regex(/^\d+$/).transform(Number).optional(),
  maxPrice: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().max(100).optional(),
  inStockOnly: z.enum(["true", "false"]).transform(v => v === "true").optional(),
  sortBy: z.enum(["newest", "price_asc", "price_desc", "rating", "featured"]).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional()
});

export const productIdParamSchema = z.object({
  id: z.string().min(1, "Product identifier required")
});
