import { DbCategory, DbBrand, DbProduct, DbProductVariant, DbProductImage, DbInventoryRecord, DbUser, DbRetailer } from "./schema.js";

// ============================================================================
// ANIVA PRODUCTION SEED DATA — EXPLICITLY MARKED AS [DEMO DATA]
// ============================================================================

export const SEED_CATEGORIES: DbCategory[] = [
  {
    id: "cat-plain-tees",
    slug: "plain-t-shirts",
    name: "Plain T-Shirts",
    parentId: null,
    description: "Premium everyday essentials designed for versatile styling and comfort.",
    isPreOwnedEligible: false,
    displayOrder: 1,
    isActive: true
  },
  {
    id: "cat-printed-tees",
    slug: "printed-t-shirts",
    name: "Printed T-Shirts",
    parentId: null,
    description: "Contemporary Tamil typography, Dravidian architectural silhouettes, and minimal graphic art.",
    isPreOwnedEligible: false,
    displayOrder: 2,
    isActive: true
  },
  {
    id: "cat-custom-print",
    slug: "custom-printed-t-shirts",
    name: "Custom Printed T-Shirts",
    parentId: null,
    description: "Interactive bespoke canvas. Upload personal vector graphics or customize typography on luxury garments.",
    isPreOwnedEligible: false,
    displayOrder: 3,
    isActive: true
  },
  {
    id: "cat-shoes",
    slug: "shoes",
    name: "Shoes",
    parentId: null,
    description: "Handcrafted full-grain leather loafers, dress shoes, and curated contemporary sneakers.",
    isPreOwnedEligible: true,
    displayOrder: 4,
    isActive: true
  },
  {
    id: "cat-mens-acc",
    slug: "mens-accessories",
    name: "Men's Accessories",
    parentId: null,
    description: "Top-grain leather cardholders, handcrafted brass cufflinks, and minimal matte belts.",
    isPreOwnedEligible: false,
    displayOrder: 5,
    isActive: true
  },
  {
    id: "cat-womens-acc",
    slug: "womens-accessories",
    name: "Women's Accessories",
    parentId: null,
    description: "Temple-inspired minimalist jewelry, silk twill pocket squares, and Italian nappa leather totes.",
    isPreOwnedEligible: false,
    displayOrder: 6,
    isActive: true
  },
  // Subcategories for Pre-Owned Marketplace taxonomy hierarchy
  {
    id: "cat-preowned-shoes",
    slug: "pre-owned-shoes",
    name: "Pre-Owned Shoes",
    parentId: "cat-shoes",
    description: "Inspected and authenticated luxury sneakers and bespoke leather footwear [DEMO DATA].",
    isPreOwnedEligible: true,
    displayOrder: 7,
    isActive: true
  },
  {
    id: "cat-preowned-watches",
    slug: "pre-owned-watches",
    name: "Pre-Owned Watches",
    parentId: null, // Standalone pre-owned taxonomy node; NOT one of the 6 core store categories
    description: "Physical inspection certified luxury horology and collector timepieces [DEMO DATA].",
    isPreOwnedEligible: true,
    displayOrder: 8,
    isActive: true
  }
];

export const SEED_BRANDS: DbBrand[] = [
  {
    id: "brand-aniva",
    slug: "aniva-monolith",
    name: "ANIVA",
    logoUrl: null,
    isPreOwnedEligible: false
  },
  {
    id: "brand-dravida",
    slug: "dravida-atelier",
    name: "Dravida Atelier",
    logoUrl: null,
    isPreOwnedEligible: false
  },
  {
    id: "brand-sangam",
    slug: "sangam-leather-works",
    name: "Sangam Leather Works",
    logoUrl: null,
    isPreOwnedEligible: false
  },
  {
    id: "brand-madurai",
    slug: "madurai-silk-studios",
    name: "Madurai Silk Studios",
    logoUrl: null,
    isPreOwnedEligible: false
  },
  {
    id: "brand-rolex",
    slug: "rolex",
    name: "Rolex [DEMO DATA]",
    logoUrl: null,
    isPreOwnedEligible: true
  },
  {
    id: "brand-jordan",
    slug: "jordan",
    name: "Jordan [DEMO DATA]",
    logoUrl: null,
    isPreOwnedEligible: true
  }
];

export const SEED_USERS: DbUser[] = [
  {
    id: "usr-admin-super",
    mobile: "+919840100001",
    email: "admin@aniva.in",
    fullName: "ANIVA Super Administrator [DEMO DATA]",
    role: "ADMIN_SUPER",
    authProviderId: "auth-admin-01",
    isActive: true,
    isVerified: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "usr-verifier-01",
    mobile: "+919840100002",
    email: "verifier@aniva.in",
    fullName: "Lead Authentication Specialist [DEMO DATA]",
    role: "ADMIN_VERIFIER",
    authProviderId: "auth-verifier-01",
    isActive: true,
    isVerified: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "usr-retailer-dravida",
    mobile: "+919840100003",
    email: "partner@dravidaatelier.com",
    fullName: "Dravida Atelier Partner [DEMO DATA]",
    role: "RETAILER",
    authProviderId: "auth-retailer-01",
    isActive: true,
    isVerified: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "usr-customer-01",
    mobile: "+919840123456",
    email: "siddharth.r@example.com",
    fullName: "Siddharth Rajan [DEMO DATA]",
    role: "CUSTOMER",
    authProviderId: "auth-cust-01",
    isActive: true,
    isVerified: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  }
];

export const SEED_RETAILERS: DbRetailer[] = [
  {
    id: "ret-dravida",
    userId: "usr-retailer-dravida",
    businessName: "Dravida Atelier Private Limited [DEMO DATA]",
    tradeName: "Dravida Atelier",
    contactEmail: "partner@dravidaatelier.com",
    contactPhone: "+919840100003",
    commissionRate: 15.0, // [TBD]
    status: "APPROVED",
    payoutAccountToken: "tok_payout_demo_dravida_99812", // [LEGAL VALIDATION]
    gstinNumber: "33AAAAA0000A1Z5", // [DEMO DATA]
    panNumber: "AAAAA0000A",
    pickupPincode: "600002",
    pickupAddress: "42, Anna Salai, Chennai, Tamil Nadu",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  }
];

export const SEED_PRODUCTS: DbProduct[] = [
  {
    id: "ANV-TS-01",
    slug: "monolith-classic-plain-tee",
    title: "Monolith Classic Plain Tee",
    categoryId: "cat-plain-tees",
    brandId: "brand-aniva",
    productSource: "ANIVA_STORE",
    retailerId: null,
    description: "Designed for everyday style and relaxed comfort. Features drop-shoulder tailoring and a clean collar finish.",
    mrp: 1899,
    sellingPrice: 1299,
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewCount: 48,
    tags: ["plain", "classic", "oversized", "bestseller"],
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-01-10T00:00:00.000Z"
  },
  {
    id: "ANV-TS-02",
    slug: "dravidian-gopuram-minimal-graphic-tee",
    title: "Dravidian Architectural Silhouette Tee",
    categoryId: "cat-printed-tees",
    brandId: "brand-aniva",
    productSource: "ANIVA_STORE",
    retailerId: null,
    description: "Architectural line vector tribute to South Indian temple stone engineering. High-definition print designed for everyday wear.",
    mrp: 2199,
    sellingPrice: 1599,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    rating: 4.8,
    reviewCount: 36,
    tags: ["printed", "graphic", "dravidian", "tamil-nadu", "temple"],
    createdAt: "2026-01-12T00:00:00.000Z",
    updatedAt: "2026-01-12T00:00:00.000Z"
  },
  {
    id: "ANV-CP-01",
    slug: "bespoke-custom-print-canvas-tee",
    title: "Bespoke Custom Print Tee",
    categoryId: "cat-custom-print",
    brandId: "brand-aniva",
    productSource: "ANIVA_STORE",
    retailerId: null,
    description: "Your personalized canvas on our signature everyday blank. Configure custom graphics, typography layers, chest coordinates, and back prints with our real-time interactive 2D canvas.",
    mrp: 2499,
    sellingPrice: 1799,
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    rating: 5.0,
    reviewCount: 82,
    tags: ["custom", "print-on-demand", "bespoke", "personalize"],
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-01-15T00:00:00.000Z"
  },
  {
    id: "ANV-SH-01",
    slug: "dravida-full-grain-penny-loafer",
    title: "Dravida Handcrafted Full-Grain Loafer",
    categoryId: "cat-shoes",
    brandId: "brand-dravida",
    productSource: "VERIFIED_RETAILER",
    retailerId: "ret-dravida",
    description: "Artisanal hand-stitched Blake-welted leather loafer crafted from vegetable-tanned full-grain leather. Finished with natural leather outsoles and cushioned calfskin insoles.",
    mrp: 7499,
    sellingPrice: 5299,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 29,
    tags: ["shoes", "leather", "loafer", "handcrafted", "formal"],
    createdAt: "2026-01-20T00:00:00.000Z",
    updatedAt: "2026-01-20T00:00:00.000Z"
  },
  {
    id: "ANV-AC-01",
    slug: "sangam-matte-brass-cufflinks",
    title: "Sangam Hand-Turned Brass Cufflinks",
    categoryId: "cat-mens-acc",
    brandId: "brand-sangam",
    productSource: "VERIFIED_RETAILER",
    retailerId: "ret-dravida",
    description: "Solid forged bell-metal brass cufflinks inspired by Chola metallurgical traditions. Finished with anti-tarnish micro-coating and engraved geometric grid motifs.",
    mrp: 2999,
    sellingPrice: 1899,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    rating: 4.7,
    reviewCount: 19,
    tags: ["accessories", "brass", "cufflinks", "menswear", "gift"],
    createdAt: "2026-01-25T00:00:00.000Z",
    updatedAt: "2026-01-25T00:00:00.000Z"
  },
  {
    id: "ANV-AC-02",
    slug: "madurai-silk-twill-scarf",
    title: "Madurai Heritage Mulberry Silk Pocket Scarf",
    categoryId: "cat-womens-acc",
    brandId: "brand-madurai",
    productSource: "ANIVA_STORE",
    retailerId: null,
    description: "100% pure 16-momme mulberry silk twill scarf with hand-rolled edges. Features minimal gold-foil leaf border work honoring South Indian weaving heritage.",
    mrp: 3499,
    sellingPrice: 2299,
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 22,
    tags: ["accessories", "silk", "scarf", "womens", "heritage"],
    createdAt: "2026-01-28T00:00:00.000Z",
    updatedAt: "2026-01-28T00:00:00.000Z"
  }
];

export const SEED_VARIANTS: DbProductVariant[] = [
  // Variants for Monolith Classic Plain Tee (ANV-TS-01)
  {
    id: "var-ts01-m-blk",
    productId: "ANV-TS-01",
    sku: "ANV-TS01-BLK-M",
    size: "M",
    colorName: "Matte Black",
    colorHex: "#0D0D0D",
    fitType: "Oversized",
    stockQuantity: 45,
    createdAt: "2026-01-10T00:00:00.000Z"
  },
  {
    id: "var-ts01-l-blk",
    productId: "ANV-TS-01",
    sku: "ANV-TS01-BLK-L",
    size: "L",
    colorName: "Matte Black",
    colorHex: "#0D0D0D",
    fitType: "Oversized",
    stockQuantity: 38,
    createdAt: "2026-01-10T00:00:00.000Z"
  },
  {
    id: "var-ts01-xl-blk",
    productId: "ANV-TS-01",
    sku: "ANV-TS01-BLK-XL",
    size: "XL",
    colorName: "Matte Black",
    colorHex: "#0D0D0D",
    fitType: "Oversized",
    stockQuantity: 20,
    createdAt: "2026-01-10T00:00:00.000Z"
  },
  {
    id: "var-ts01-l-wht",
    productId: "ANV-TS-01",
    sku: "ANV-TS01-WHT-L",
    size: "L",
    colorName: "Warm Ivory",
    colorHex: "#F8F6F2",
    fitType: "Oversized",
    stockQuantity: 25,
    createdAt: "2026-01-10T00:00:00.000Z"
  },
  // Variants for Dravidian Tee (ANV-TS-02)
  {
    id: "var-ts02-m-blk",
    productId: "ANV-TS-02",
    sku: "ANV-TS02-BLK-M",
    size: "M",
    colorName: "Carbon Charcoal",
    colorHex: "#1C1C1C",
    fitType: "Classic",
    stockQuantity: 30,
    createdAt: "2026-01-12T00:00:00.000Z"
  },
  {
    id: "var-ts02-l-blk",
    productId: "ANV-TS-02",
    sku: "ANV-TS02-BLK-L",
    size: "L",
    colorName: "Carbon Charcoal",
    colorHex: "#1C1C1C",
    fitType: "Classic",
    stockQuantity: 18,
    createdAt: "2026-01-12T00:00:00.000Z"
  },
  // Variants for Custom Print Blank (ANV-CP-01)
  {
    id: "var-cp01-m-blk",
    productId: "ANV-CP-01",
    sku: "ANV-CP01-BLK-M",
    size: "M",
    colorName: "Matte Black",
    colorHex: "#0D0D0D",
    fitType: "Oversized",
    stockQuantity: 50,
    createdAt: "2026-01-15T00:00:00.000Z"
  },
  {
    id: "var-cp01-l-blk",
    productId: "ANV-CP-01",
    sku: "ANV-CP01-BLK-L",
    size: "L",
    colorName: "Matte Black",
    colorHex: "#0D0D0D",
    fitType: "Oversized",
    stockQuantity: 65,
    createdAt: "2026-01-15T00:00:00.000Z"
  },
  // Variants for Loafer (ANV-SH-01)
  {
    id: "var-sh01-uk8",
    productId: "ANV-SH-01",
    sku: "ANV-SH01-BRN-UK8",
    size: "UK 8",
    colorName: "Cognac Brown",
    colorHex: "#5C3A21",
    fitType: null,
    stockQuantity: 8,
    createdAt: "2026-01-20T00:00:00.000Z"
  },
  {
    id: "var-sh01-uk9",
    productId: "ANV-SH-01",
    sku: "ANV-SH01-BRN-UK9",
    size: "UK 9",
    colorName: "Cognac Brown",
    colorHex: "#5C3A21",
    fitType: null,
    stockQuantity: 12,
    createdAt: "2026-01-20T00:00:00.000Z"
  },
  // Accessories (ANV-AC-01 and ANV-AC-02)
  {
    id: "var-ac01-uni",
    productId: "ANV-AC-01",
    sku: "ANV-AC01-BRS-UNI",
    size: "Standard",
    colorName: "Antique Brass",
    colorHex: "#C9A86A",
    fitType: null,
    stockQuantity: 15,
    createdAt: "2026-01-25T00:00:00.000Z"
  },
  {
    id: "var-ac02-uni",
    productId: "ANV-AC-02",
    sku: "ANV-AC02-GLD-UNI",
    size: "Standard (55cm)",
    colorName: "Temple Gold",
    colorHex: "#D4AF37",
    fitType: null,
    stockQuantity: 14,
    createdAt: "2026-01-28T00:00:00.000Z"
  }
];

export const SEED_IMAGES: DbProductImage[] = [
  {
    id: "img-ts01-1",
    productId: "ANV-TS-01",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
    altText: "Monolith Classic Plain Tee in Matte Black",
    displayOrder: 1,
    isPrimary: true
  },
  {
    id: "img-ts01-2",
    productId: "ANV-TS-01",
    imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80",
    altText: "Monolith Plain Tee back silhouette",
    displayOrder: 2,
    isPrimary: false
  },
  {
    id: "img-ts02-1",
    productId: "ANV-TS-02",
    imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80",
    altText: "Dravidian Architectural Silhouette Printed Tee",
    displayOrder: 1,
    isPrimary: true
  },
  {
    id: "img-cp01-1",
    productId: "ANV-CP-01",
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80",
    altText: "Bespoke Custom Print Blank Canvas",
    displayOrder: 1,
    isPrimary: true
  },
  {
    id: "img-sh01-1",
    productId: "ANV-SH-01",
    imageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=80",
    altText: "Dravida Handcrafted Full-Grain Loafer in Cognac Brown",
    displayOrder: 1,
    isPrimary: true
  },
  {
    id: "img-ac01-1",
    productId: "ANV-AC-01",
    imageUrl: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80",
    altText: "Sangam Hand-Turned Brass Cufflinks",
    displayOrder: 1,
    isPrimary: true
  },
  {
    id: "img-ac02-1",
    productId: "ANV-AC-02",
    imageUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=80",
    altText: "Madurai Mulberry Silk Pocket Scarf",
    displayOrder: 1,
    isPrimary: true
  }
];

export const SEED_INVENTORY: DbInventoryRecord[] = SEED_VARIANTS.map((v) => ({
  id: `inv-${v.id}`,
  variantId: v.id,
  sku: v.sku,
  availableStock: v.stockQuantity,
  reservedStock: 0,
  safetyStockThreshold: 3,
  status: v.stockQuantity > 5 ? "IN_STOCK" : v.stockQuantity > 0 ? "LOW_STOCK" : "OUT_OF_STOCK",
  lastRestockedAt: "2026-01-15T00:00:00.000Z",
  updatedAt: "2026-01-15T00:00:00.000Z"
}));
