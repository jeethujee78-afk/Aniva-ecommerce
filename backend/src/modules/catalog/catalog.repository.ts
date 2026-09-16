import { db } from "../../db/connection.js";
import { DbCategory, DbBrand, DbProduct, DbProductVariant, DbProductImage } from "../../db/schema.js";

export class CatalogRepository {
  async getCategories(): Promise<DbCategory[]> {
    return db.getCategories();
  }

  async getCategoryBySlug(slug: string): Promise<DbCategory | null> {
    return db.getCategoryBySlug(slug);
  }

  async getBrands(): Promise<DbBrand[]> {
    return db.getBrands();
  }

  async getBrandById(id: string): Promise<DbBrand | null> {
    return db.getBrandById(id);
  }

  async getProducts(params?: {
    categorySlug?: string;
    brandSlug?: string;
    source?: 'ANIVA_STORE' | 'VERIFIED_RETAILER';
    retailerId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    inStockOnly?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'featured';
  }) {
    return db.getProducts(params);
  }

  async getProductById(id: string) {
    return db.getProductById(id);
  }

  async getVariantsByProductId(productId: string): Promise<DbProductVariant[]> {
    return db.getVariantsByProductId(productId);
  }

  async getImagesByProductId(productId: string): Promise<DbProductImage[]> {
    return db.getImagesByProductId(productId);
  }
}

export const catalogRepository = new CatalogRepository();
