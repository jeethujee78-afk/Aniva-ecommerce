import { apiClient } from "./apiClient";
import { Product } from "../types";

export interface CatalogCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  isPreOwnedEligible: boolean;
  displayOrder: number;
}

export interface CatalogBrand {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  isPreOwnedEligible: boolean;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  source?: "ANIVA_STORE" | "VERIFIED_RETAILER";
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStockOnly?: boolean;
  sortBy?: "newest" | "price_asc" | "price_desc" | "rating" | "featured";
  page?: number;
  limit?: number;
}

export const catalogApiService = {
  async getCategories(): Promise<CatalogCategory[]> {
    try {
      const res = await apiClient.get<CatalogCategory[]>("/categories");
      if (res.success && res.data) {
        return res.data;
      }
      return [];
    } catch (err) {
      console.error("[CatalogService] Failed to load categories from API:", err);
      return [];
    }
  },

  async getBrands(): Promise<CatalogBrand[]> {
    try {
      const res = await apiClient.get<CatalogBrand[]>("/brands");
      if (res.success && res.data) {
        return res.data;
      }
      return [];
    } catch (err) {
      console.error("[CatalogService] Failed to load brands from API:", err);
      return [];
    }
  },

  async getProducts(filters?: ProductFilters): Promise<{ products: Product[]; total: number }> {
    try {
      const res = await apiClient.get<Product[]>("/products", filters);
      if (res.success && res.data) {
        return {
          products: res.data,
          total: res.meta?.total || res.data.length
        };
      }
      return { products: [], total: 0 };
    } catch (err) {
      console.error("[CatalogService] Failed to load products from API:", err);
      return { products: [], total: 0 };
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await apiClient.get<Product>(`/products/${id}`);
      if (res.success && res.data) {
        return res.data;
      }
      return null;
    } catch (err) {
      console.error(`[CatalogService] Failed to load product ${id} from API:`, err);
      return null;
    }
  },

  async getVariantStock(variantId: string) {
    try {
      const res = await apiClient.get<{ variantId: string; availableStock: number; isAvailable: boolean }>(`/inventory/variant/${variantId}`);
      if (res.success && res.data) {
        return res.data;
      }
      return null;
    } catch (err) {
      console.error(`[CatalogService] Failed to check stock for ${variantId}:`, err);
      return null;
    }
  }
};
