import { catalogRepository, CatalogRepository } from "./catalog.repository.js";
import { ApiError } from "../../middleware/errorHandler.js";

export class CatalogService {
  constructor(private repo: CatalogRepository = catalogRepository) {}

  async listCategories() {
    const categories = await this.repo.getCategories();
    return categories.map(c => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      isPreOwnedEligible: c.isPreOwnedEligible,
      displayOrder: c.displayOrder
    }));
  }

  async listBrands() {
    const brands = await this.repo.getBrands();
    return brands.map(b => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      logoUrl: b.logoUrl,
      isPreOwnedEligible: b.isPreOwnedEligible
    }));
  }

  async listProducts(filters: {
    category?: string;
    brand?: string;
    source?: 'ANIVA_STORE' | 'VERIFIED_RETAILER';
    retailerId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    inStockOnly?: boolean;
    sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'featured';
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    const { products, total } = await this.repo.getProducts({
      categorySlug: filters.category,
      brandSlug: filters.brand,
      source: filters.source,
      retailerId: filters.retailerId,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      search: filters.search,
      inStockOnly: filters.inStockOnly,
      sortBy: filters.sortBy,
      page,
      limit
    });

    const totalPages = Math.ceil(total / limit);

    // Format into frontend-compatible payload
    const formatted = products.map(p => {
      const inStock = p.variants.some(v => v.stockQuantity > 0);
      const totalStock = p.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
      const uniqueSizes = Array.from(new Set(p.variants.map(v => v.size)));
      const uniqueColors = Array.from(
        new Map(p.variants.map(v => [v.colorName, { name: v.colorName, hex: v.colorHex }])).values()
      );

      return {
        id: p.id,
        slug: p.slug,
        name: p.title,
        category: p.category?.name || "General",
        categorySlug: p.category?.slug || "",
        brand: p.brand?.name || "ANIVA",
        brandSlug: p.brand?.slug || "",
        price: p.sellingPrice,
        originalPrice: p.mrp > p.sellingPrice ? p.mrp : undefined,
        description: p.description,
        productSource: p.productSource,
        sellerType: p.productSource === "ANIVA_STORE" ? "ANIVA Store" : "Verified Retailer",
        sellerName: p.productSource === "ANIVA_STORE" ? "ANIVA Official" : (p.brand?.name || "Verified Merchant"),
        rating: p.rating,
        reviewCount: p.reviewCount,
        inStock,
        stockCount: totalStock,
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        tags: p.tags,
        images: p.images.map(img => img.imageUrl),
        sizes: uniqueSizes,
        colors: uniqueColors,
        variants: p.variants.map(v => ({
          id: v.id,
          sku: v.sku,
          size: v.size,
          color: { name: v.colorName, hex: v.colorHex },
          fitType: v.fitType,
          stockQuantity: v.stockQuantity
        }))
      };
    });

    return {
      products: formatted,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  async getProductById(id: string) {
    const p = await this.repo.getProductById(id);
    if (!p) {
      throw new ApiError(404, "PRODUCT_NOT_FOUND", `Product '${id}' was not found in active catalog`);
    }

    const inStock = p.variants.some(v => v.stockQuantity > 0);
    const totalStock = p.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
    const uniqueSizes = Array.from(new Set(p.variants.map(v => v.size)));
    const uniqueColors = Array.from(
      new Map(p.variants.map(v => [v.colorName, { name: v.colorName, hex: v.colorHex }])).values()
    );

    return {
      id: p.id,
      slug: p.slug,
      name: p.title,
      category: p.category?.name || "General",
      categorySlug: p.category?.slug || "",
      brand: p.brand?.name || "ANIVA",
      brandSlug: p.brand?.slug || "",
      price: p.sellingPrice,
      originalPrice: p.mrp > p.sellingPrice ? p.mrp : undefined,
      description: p.description,
      productSource: p.productSource,
      sellerType: p.productSource === "ANIVA_STORE" ? "ANIVA Store" : "Verified Retailer",
      sellerName: p.productSource === "ANIVA_STORE" ? "ANIVA Official" : (p.brand?.name || "Verified Merchant"),
      rating: p.rating,
      reviewCount: p.reviewCount,
      inStock,
      stockCount: totalStock,
      isFeatured: p.isFeatured,
      isNewArrival: p.isNewArrival,
      tags: p.tags,
      images: p.images.map(img => img.imageUrl),
      sizes: uniqueSizes,
      colors: uniqueColors,
      variants: p.variants.map(v => ({
        id: v.id,
        sku: v.sku,
        size: v.size,
        color: { name: v.colorName, hex: v.colorHex },
        fitType: v.fitType,
        stockQuantity: v.stockQuantity
      }))
    };
  }

  async getProductVariants(productId: string) {
    const variants = await this.repo.getVariantsByProductId(productId);
    return variants.map(v => ({
      id: v.id,
      sku: v.sku,
      size: v.size,
      color: { name: v.colorName, hex: v.colorHex },
      fitType: v.fitType,
      stockQuantity: v.stockQuantity,
      inStock: v.stockQuantity > 0
    }));
  }

  async getProductImages(productId: string) {
    const images = await this.repo.getImagesByProductId(productId);
    return images.map(img => ({
      id: img.id,
      imageUrl: img.imageUrl,
      altText: img.altText,
      displayOrder: img.displayOrder,
      isPrimary: img.isPrimary
    }));
  }
}

export const catalogService = new CatalogService();
