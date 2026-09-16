import { 
  DbCategory, 
  DbBrand, 
  DbProduct, 
  DbProductVariant, 
  DbProductImage, 
  DbInventoryRecord, 
  DbUser, 
  DbRetailer, 
  DbAddress,
  DbRetailerDocument,
  DbCart,
  DbCartItem,
  DbInventoryReservation,
  DbOrder,
  DbSellerOrder,
  DbOrderItem,
  DbPayment,
  DbPaymentAuditLog,
  DbReturnRequest,
  DbRefund,
  OrderStatus,
  PaymentStatus,
  ReturnStatus,
  RefundStatus
} from "./schema.js";
import { 
  SEED_CATEGORIES, 
  SEED_BRANDS, 
  SEED_PRODUCTS, 
  SEED_VARIANTS, 
  SEED_IMAGES, 
  SEED_INVENTORY, 
  SEED_USERS, 
  SEED_RETAILERS 
} from "./seed.js";
import { ENV } from "../config/env.js";
import { COMMERCE_CONFIG } from "../config/commerce.config.js";

// ============================================================================
// ANIVA DATABASE ADAPTER & TRANSACTIONAL DATA ACCESS LAYER
// ============================================================================

class DatabaseAdapter {
  private categories: Map<string, DbCategory> = new Map();
  private brands: Map<string, DbBrand> = new Map();
  private products: Map<string, DbProduct> = new Map();
  private variants: Map<string, DbProductVariant> = new Map();
  private images: Map<string, DbProductImage> = new Map();
  private inventory: Map<string, DbInventoryRecord> = new Map();
  private users: Map<string, DbUser> = new Map();
  private retailers: Map<string, DbRetailer> = new Map();
  private addresses: Map<string, DbAddress> = new Map();
  private retailerDocuments: Map<string, DbRetailerDocument> = new Map();

  // Commerce Engine Stores
  private carts: Map<string, DbCart> = new Map(); // Keyed by cartId or userId/sessionId
  private reservations: Map<string, DbInventoryReservation> = new Map();
  private orders: Map<string, DbOrder> = new Map();
  private sellerOrders: Map<string, DbSellerOrder> = new Map();
  private orderItems: Map<string, DbOrderItem> = new Map();
  private payments: Map<string, DbPayment> = new Map();
  private paymentAuditLogs: DbPaymentAuditLog[] = [];
  private returnRequests: Map<string, DbReturnRequest> = new Map();
  private refunds: Map<string, DbRefund> = new Map();

  // Mutex simulation for transactional inventory synchronization
  private inventoryLock = false;
  private isInitialized = false;

  constructor() {
    this.init();
  }

  public init() {
    if (this.isInitialized) return;

    // Seed default records with [DEMO DATA] identifiers
    SEED_CATEGORIES.forEach(c => this.categories.set(c.id, { ...c }));
    SEED_BRANDS.forEach(b => this.brands.set(b.id, { ...b }));
    SEED_PRODUCTS.forEach(p => this.products.set(p.id, { ...p }));
    SEED_VARIANTS.forEach(v => this.variants.set(v.id, { ...v }));
    SEED_IMAGES.forEach(i => this.images.set(i.id, { ...i }));
    SEED_INVENTORY.forEach(inv => this.inventory.set(inv.id, { ...inv }));
    SEED_USERS.forEach(u => this.users.set(u.id, { ...u }));
    SEED_RETAILERS.forEach(r => this.retailers.set(r.id, { ...r }));

    // Seed initial demo parent and seller order for testing & tracking lookup
    const demoParentOrderId = "ANV-ORD-89420";
    const demoSellerOrderId = "ANV-SEL-89420-1";
    const demoOrderItemId = "item-demo-89420-1";

    const demoParentOrder: DbOrder = {
      id: demoParentOrderId,
      orderNumber: "ANV-89420",
      userId: "usr-customer-01",
      idempotencyKey: "idem-seed-89420",
      orderStatus: "DISPATCHED",
      paymentStatus: "PAID",
      paymentMethod: "UPI",
      subtotal: 2598,
      discount: 260,
      shippingFee: 0,
      tax: 0,
      total: 2338,
      currency: "INR",
      shippingAddress: {
        fullName: "Siddharth Rajan",
        phone: "+91 98401 23456",
        email: "siddharth.r@example.com",
        addressLine: "No 42, Nungambakkam High Road",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600034",
        landmark: "Opposite Express Avenue"
      },
      sellerOrderIds: [demoSellerOrderId],
      reservationToken: "res-seed-89420",
      notes: "Demo seed customer order",
      createdAt: "2026-07-22T10:30:00Z",
      updatedAt: "2026-07-22T10:35:00Z"
    };

    const demoSellerOrder: DbSellerOrder = {
      id: demoSellerOrderId,
      sellerOrderNumber: "ANV-SEL-89420",
      parentOrderId: demoParentOrderId,
      sellerId: "aniva-store",
      productSource: "ANIVA_STORE",
      orderStatus: "DISPATCHED",
      subtotal: 2598,
      shippingFee: 0,
      total: 2338,
      commissionRate: null,
      commissionAmount: null,
      sellerPayoutAmount: 2338,
      trackingNumber: "BD-TN-8829102",
      estimatedDelivery: "2026-07-25",
      courierPartner: "Express Logistics",
      createdAt: "2026-07-22T10:30:00Z",
      updatedAt: "2026-07-22T10:35:00Z"
    };

    const demoOrderItem: DbOrderItem = {
      id: demoOrderItemId,
      parentOrderId: demoParentOrderId,
      sellerOrderId: demoSellerOrderId,
      productId: "ANV-TS-01",
      variantId: "var-ts01-l-blk",
      sku: "ANV-TS01-L-BLK",
      titleSnapshot: "Monolith Classic Plain Tee",
      sizeSnapshot: "L",
      colorSnapshot: "Matte Black",
      fitSnapshot: "Oversized",
      imageSnapshot: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
      unitPriceSnapshot: 1299,
      mrpSnapshot: 1899,
      quantity: 2,
      totalPrice: 2598,
      productSource: "ANIVA_STORE",
      sellerId: "aniva-store",
      isPreOwned: false,
      returnStatus: "NONE",
      createdAt: "2026-07-22T10:30:00Z"
    };

    const demoPayment: DbPayment = {
      id: "pay-demo-89420",
      parentOrderId: demoParentOrderId,
      paymentMethod: "UPI",
      gatewayProvider: "DEMO_GATEWAY",
      transactionId: "TXN-DEMO-89420-UPI",
      gatewayOrderId: "GATEWAY-ORD-89420",
      amount: 2338,
      currency: "INR",
      status: "PAID",
      isTestMode: true,
      createdAt: "2026-07-22T10:30:00Z",
      updatedAt: "2026-07-22T10:30:05Z"
    };

    this.orders.set(demoParentOrder.id, demoParentOrder);
    this.sellerOrders.set(demoSellerOrder.id, demoSellerOrder);
    this.orderItems.set(demoOrderItem.id, demoOrderItem);
    this.payments.set(demoPayment.id, demoPayment);

    this.isInitialized = true;
  }

  // CATEGORIES
  public async getCategories(): Promise<DbCategory[]> {
    return Array.from(this.categories.values())
      .filter(c => c.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public async getCategoryById(id: string): Promise<DbCategory | null> {
    return this.categories.get(id) || null;
  }

  public async getCategoryBySlug(slug: string): Promise<DbCategory | null> {
    return Array.from(this.categories.values()).find(c => c.slug === slug) || null;
  }

  // BRANDS
  public async getBrands(): Promise<DbBrand[]> {
    return Array.from(this.brands.values());
  }

  public async getBrandById(id: string): Promise<DbBrand | null> {
    return this.brands.get(id) || null;
  }

  // PRODUCTS
  public async getProducts(params?: {
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
  }): Promise<{ products: Array<DbProduct & { brand?: DbBrand; category?: DbCategory; images: DbProductImage[]; variants: DbProductVariant[] }>; total: number }> {
    let list = Array.from(this.products.values()).filter(p => p.isActive);

    // Tenant isolation filtering if retailerId is requested
    if (params?.retailerId) {
      list = list.filter(p => p.retailerId === params.retailerId);
    }

    if (params?.source) {
      list = list.filter(p => p.productSource === params.source);
    }

    if (params?.categorySlug) {
      const cat = await this.getCategoryBySlug(params.categorySlug);
      if (cat) {
        list = list.filter(p => p.categoryId === cat.id);
      } else {
        return { products: [], total: 0 };
      }
    }

    if (params?.brandSlug) {
      const brand = Array.from(this.brands.values()).find(b => b.slug === params.brandSlug);
      if (brand) {
        list = list.filter(p => p.brandId === brand.id);
      } else {
        return { products: [], total: 0 };
      }
    }

    if (params?.minPrice !== undefined) {
      list = list.filter(p => p.sellingPrice >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      list = list.filter(p => p.sellingPrice <= params.maxPrice!);
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (params?.inStockOnly) {
      list = list.filter(p => {
        const prodVariants = Array.from(this.variants.values()).filter(v => v.productId === p.id);
        return prodVariants.some(v => v.stockQuantity > 0);
      });
    }

    // Sorting
    if (params?.sortBy) {
      switch (params.sortBy) {
        case 'newest':
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'price_asc':
          list.sort((a, b) => a.sellingPrice - b.sellingPrice);
          break;
        case 'price_desc':
          list.sort((a, b) => b.sellingPrice - a.sellingPrice);
          break;
        case 'rating':
          list.sort((a, b) => b.rating - a.rating);
          break;
        case 'featured':
        default:
          list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    const total = list.length;
    const page = Math.max(1, params?.page || 1);
    const limit = Math.min(100, Math.max(1, params?.limit || 20));
    const offset = (page - 1) * limit;

    const paginated = list.slice(offset, offset + limit);

    const enriched = paginated.map(p => {
      const category = this.categories.get(p.categoryId);
      const brand = p.brandId ? this.brands.get(p.brandId) : undefined;
      const images = Array.from(this.images.values())
        .filter(i => i.productId === p.id)
        .sort((a, b) => a.displayOrder - b.displayOrder);
      const variants = Array.from(this.variants.values()).filter(v => v.productId === p.id);

      return {
        ...p,
        category,
        brand,
        images,
        variants
      };
    });

    return { products: enriched, total };
  }

  public async getProductById(id: string): Promise<(DbProduct & { brand?: DbBrand; category?: DbCategory; images: DbProductImage[]; variants: DbProductVariant[] }) | null> {
    const product = this.products.get(id) || Array.from(this.products.values()).find(p => p.slug === id);
    if (!product || !product.isActive) return null;

    const category = this.categories.get(product.categoryId);
    const brand = product.brandId ? this.brands.get(product.brandId) : undefined;
    const images = Array.from(this.images.values())
      .filter(i => i.productId === product.id)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    const variants = Array.from(this.variants.values()).filter(v => v.productId === product.id);

    return {
      ...product,
      category,
      brand,
      images,
      variants
    };
  }

  public async getVariantsByProductId(productId: string): Promise<DbProductVariant[]> {
    return Array.from(this.variants.values()).filter(v => v.productId === productId);
  }

  public async getImagesByProductId(productId: string): Promise<DbProductImage[]> {
    return Array.from(this.images.values())
      .filter(i => i.productId === productId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  // INVENTORY
  public async getInventoryByVariantId(variantId: string): Promise<DbInventoryRecord | null> {
    return Array.from(this.inventory.values()).find(inv => inv.variantId === variantId) || null;
  }

  public async getInventoryBySku(sku: string): Promise<DbInventoryRecord | null> {
    return Array.from(this.inventory.values()).find(inv => inv.sku === sku) || null;
  }

  // USERS & RETAILERS
  public async getUserById(id: string): Promise<DbUser | null> {
    return this.users.get(id) || null;
  }

  public async getUserByMobile(mobile: string): Promise<DbUser | null> {
    return Array.from(this.users.values()).find(u => u.mobile === mobile) || null;
  }

  public async getUserByAuthProviderId(authId: string): Promise<DbUser | null> {
    return Array.from(this.users.values()).find(u => u.authProviderId === authId) || null;
  }

  public async getRetailerByUserId(userId: string): Promise<DbRetailer | null> {
    return Array.from(this.retailers.values()).find(r => r.userId === userId) || null;
  }

  public async getRetailers(): Promise<DbRetailer[]> {
    return Array.from(this.retailers.values());
  }

  public async getAddressesByUserId(userId: string): Promise<DbAddress[]> {
    return Array.from(this.addresses.values()).filter(a => a.userId === userId);
  }

  // ==========================================================================
  // 5.6 CART OPERATIONS & VALIDATION
  // ==========================================================================
  public async getCart(identifier: { userId?: string; sessionId: string }): Promise<DbCart> {
    // 1. Try lookup by userId if authenticated
    if (identifier.userId) {
      const userCart = Array.from(this.carts.values()).find(c => c.userId === identifier.userId);
      if (userCart) return userCart;
    }

    // 2. Lookup by sessionId
    const sessionCart = this.carts.get(identifier.sessionId);
    if (sessionCart) {
      if (identifier.userId && !sessionCart.userId) {
        sessionCart.userId = identifier.userId;
        sessionCart.updatedAt = new Date().toISOString();
      }
      return sessionCart;
    }

    // 3. Create fresh cart
    const newCart: DbCart = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: identifier.userId || null,
      sessionId: identifier.sessionId,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.carts.set(identifier.sessionId, newCart);
    return newCart;
  }

  public async saveCart(cart: DbCart): Promise<DbCart> {
    cart.updatedAt = new Date().toISOString();
    this.carts.set(cart.sessionId, cart);
    if (cart.userId) {
      this.carts.set(`user-${cart.userId}`, cart);
    }
    return cart;
  }

  public async clearCart(identifier: { userId?: string; sessionId: string }): Promise<void> {
    const cart = await this.getCart(identifier);
    cart.items = [];
    cart.updatedAt = new Date().toISOString();
    await this.saveCart(cart);
  }

  // ==========================================================================
  // 5.6 SAFE INVENTORY RESERVATION & TRANSACTIONS
  // ==========================================================================
  private async acquireLock(): Promise<void> {
    while (this.inventoryLock) {
      await new Promise(res => setTimeout(res, 5));
    }
    this.inventoryLock = true;
    this.sweepExpiredReservations();
  }

  private releaseLock(): void {
    this.inventoryLock = false;
  }

  /**
   * Sweeps and auto-releases any ACTIVE inventory reservations that have exceeded their TTL.
   */
  public sweepExpiredReservations(): number {
    const now = new Date().toISOString();
    let expiredCount = 0;

    for (const res of this.reservations.values()) {
      if (res.status === "ACTIVE" && res.expiresAt < now) {
        res.status = "EXPIRED";
        const inv = Array.from(this.inventory.values()).find(i => i.variantId === res.variantId);
        if (inv) {
          inv.reservedStock = Math.max(0, inv.reservedStock - res.quantity);
          inv.updatedAt = now;
        }
        expiredCount++;
      }
    }

    return expiredCount;
  }

  public async createInventoryReservation(params: {
    items: Array<{ variantId: string; quantity: number }>;
    userId?: string | null;
    ttlMinutes?: number;
  }): Promise<{ success: boolean; reservationToken?: string; error?: string }> {
    await this.acquireLock();
    try {
      // 1. Verify stock for each variant
      for (const item of params.items) {
        if (item.quantity <= 0) {
          return { success: false, error: `Invalid quantity '${item.quantity}' for item` };
        }
        const inv = Array.from(this.inventory.values()).find(i => i.variantId === item.variantId);
        const variant = this.variants.get(item.variantId);
        if (!inv || !variant) {
          return { success: false, error: `Variant '${item.variantId}' does not exist or is unavailable` };
        }
        const effectiveAvailable = inv.availableStock - inv.reservedStock;
        if (effectiveAvailable < item.quantity) {
          return {
            success: false,
            error: `Insufficient stock for SKU ${variant.sku}. Requested: ${item.quantity}, Available: ${Math.max(0, effectiveAvailable)}`
          };
        }
      }

      // 2. Reserve stock with configurable TTL
      const ttl = params.ttlMinutes || COMMERCE_CONFIG.getInventoryReservationTTLMinutes();
      const token = `res-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const expiresAt = new Date(Date.now() + ttl * 60 * 1000).toISOString();

      for (const item of params.items) {
        const inv = Array.from(this.inventory.values()).find(i => i.variantId === item.variantId)!;
        inv.reservedStock += item.quantity;
        inv.updatedAt = new Date().toISOString();

        const reservation: DbInventoryReservation = {
          id: `res-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          reservationToken: token,
          variantId: item.variantId,
          quantity: item.quantity,
          userId: params.userId || null,
          expiresAt,
          status: "ACTIVE",
          createdAt: new Date().toISOString()
        };
        this.reservations.set(reservation.id, reservation);
      }

      return { success: true, reservationToken: token };
    } finally {
      this.releaseLock();
    }
  }

  public async commitInventoryReservation(token: string): Promise<boolean> {
    await this.acquireLock();
    try {
      const activeReservations = Array.from(this.reservations.values()).filter(
        r => r.reservationToken === token && r.status === "ACTIVE"
      );

      if (activeReservations.length === 0) return false;

      for (const res of activeReservations) {
        const inv = Array.from(this.inventory.values()).find(i => i.variantId === res.variantId);
        const variant = this.variants.get(res.variantId);
        if (inv) {
          inv.availableStock = Math.max(0, inv.availableStock - res.quantity);
          inv.reservedStock = Math.max(0, inv.reservedStock - res.quantity);
          inv.status = inv.availableStock === 0 ? "OUT_OF_STOCK" : inv.availableStock <= inv.safetyStockThreshold ? "LOW_STOCK" : "IN_STOCK";
          inv.updatedAt = new Date().toISOString();
        }
        if (variant) {
          variant.stockQuantity = Math.max(0, variant.stockQuantity - res.quantity);
        }
        res.status = "COMMITTED";
        res.committedAt = new Date().toISOString();
      }

      return true;
    } finally {
      this.releaseLock();
    }
  }

  public async releaseInventoryReservation(token: string): Promise<boolean> {
    await this.acquireLock();
    try {
      const activeReservations = Array.from(this.reservations.values()).filter(
        r => r.reservationToken === token && r.status === "ACTIVE"
      );

      if (activeReservations.length === 0) return false;

      for (const res of activeReservations) {
        const inv = Array.from(this.inventory.values()).find(i => i.variantId === res.variantId);
        if (inv) {
          inv.reservedStock = Math.max(0, inv.reservedStock - res.quantity);
          inv.updatedAt = new Date().toISOString();
        }
        res.status = "RELEASED";
      }

      return true;
    } finally {
      this.releaseLock();
    }
  }

  public async restoreInventory(items: Array<{ variantId: string; quantity: number }>): Promise<void> {
    await this.acquireLock();
    try {
      for (const item of items) {
        const inv = Array.from(this.inventory.values()).find(i => i.variantId === item.variantId);
        const variant = this.variants.get(item.variantId);
        if (inv) {
          inv.availableStock += item.quantity;
          inv.status = inv.availableStock > inv.safetyStockThreshold ? "IN_STOCK" : "LOW_STOCK";
          inv.updatedAt = new Date().toISOString();
        }
        if (variant) {
          variant.stockQuantity += item.quantity;
        }
      }
    } finally {
      this.releaseLock();
    }
  }

  // ==========================================================================
  // 5.7 ORDERS & MULTI-SELLER SPLITTING
  // ==========================================================================
  public async getOrderById(id: string): Promise<DbOrder | null> {
    return this.orders.get(id) || Array.from(this.orders.values()).find(o => o.orderNumber === id) || null;
  }

  public async getOrderByIdempotencyKey(key: string): Promise<DbOrder | null> {
    return Array.from(this.orders.values()).find(o => o.idempotencyKey === key) || null;
  }

  public async getOrdersByUserId(userId: string): Promise<DbOrder[]> {
    return Array.from(this.orders.values())
      .filter(o => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async getAllOrders(): Promise<DbOrder[]> {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public async getSellerOrderById(id: string): Promise<DbSellerOrder | null> {
    return this.sellerOrders.get(id) || Array.from(this.sellerOrders.values()).find(s => s.sellerOrderNumber === id) || null;
  }

  public async getSellerOrdersBySellerId(sellerId: string): Promise<DbSellerOrder[]> {
    return Array.from(this.sellerOrders.values())
      .filter(s => s.sellerId === sellerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async getOrderItemsByParentOrderId(parentOrderId: string): Promise<DbOrderItem[]> {
    return Array.from(this.orderItems.values()).filter(i => i.parentOrderId === parentOrderId);
  }

  public async getOrderItemsBySellerOrderId(sellerOrderId: string): Promise<DbOrderItem[]> {
    return Array.from(this.orderItems.values()).filter(i => i.sellerOrderId === sellerOrderId);
  }

  public async createOrder(order: DbOrder, sellerOrders: DbSellerOrder[], items: DbOrderItem[]): Promise<DbOrder> {
    this.orders.set(order.id, order);
    sellerOrders.forEach(so => this.sellerOrders.set(so.id, so));
    items.forEach(it => this.orderItems.set(it.id, it));
    return order;
  }

  public async updateOrderStatus(orderId: string, status: OrderStatus): Promise<DbOrder | null> {
    const order = this.orders.get(orderId);
    if (!order) return null;
    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();

    // Propagate to child seller orders if order is cancelled or delivered
    if (status === "CANCELLED" || status === "DELIVERED") {
      order.sellerOrderIds.forEach(soId => {
        const so = this.sellerOrders.get(soId);
        if (so && so.orderStatus !== "CANCELLED") {
          so.orderStatus = status;
          so.updatedAt = new Date().toISOString();
        }
      });
    }

    return order;
  }

  public async updateSellerOrderStatus(sellerOrderId: string, status: OrderStatus): Promise<DbSellerOrder | null> {
    const so = this.sellerOrders.get(sellerOrderId);
    if (!so) return null;
    so.orderStatus = status;
    so.updatedAt = new Date().toISOString();
    return so;
  }

  // ==========================================================================
  // 5.8 PAYMENTS & AUDIT LEDGER
  // ==========================================================================
  public async createPayment(payment: DbPayment): Promise<DbPayment> {
    this.payments.set(payment.id, payment);
    return payment;
  }

  public async getPaymentById(id: string): Promise<DbPayment | null> {
    return this.payments.get(id) || null;
  }

  public async getPaymentByParentOrderId(orderId: string): Promise<DbPayment | null> {
    return Array.from(this.payments.values()).find(p => p.parentOrderId === orderId) || null;
  }

  public async updatePayment(paymentId: string, updates: Partial<DbPayment>): Promise<DbPayment | null> {
    const payment = this.payments.get(paymentId);
    if (!payment) return null;
    Object.assign(payment, updates, { updatedAt: new Date().toISOString() });
    return payment;
  }

  public async logPaymentAudit(log: Omit<DbPaymentAuditLog, "id" | "createdAt">): Promise<DbPaymentAuditLog> {
    const auditRecord: DbPaymentAuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      ...log
    };
    this.paymentAuditLogs.push(auditRecord);
    return auditRecord;
  }

  public async getPaymentAuditLogs(orderId?: string): Promise<DbPaymentAuditLog[]> {
    if (orderId) {
      return this.paymentAuditLogs.filter(l => l.parentOrderId === orderId);
    }
    return [...this.paymentAuditLogs];
  }

  // ==========================================================================
  // 5.9 RETURNS & REFUNDS
  // ==========================================================================
  public async getSellerReturnPolicy(sellerId: string, productId?: string): Promise<{ sellerId: string; returnWindowDays: number; isReturnable: boolean; policyNote?: string }> {
    // Check product-specific returnability overrides
    if (productId) {
      const product = this.products.get(productId);
      if (product) {
        if (product.tags.includes("Non-Returnable") || product.tags.includes("Final Sale")) {
          return {
            sellerId,
            returnWindowDays: 0,
            isReturnable: false,
            policyNote: "Item is marked as Final Sale / Non-Returnable"
          };
        }
      }
    }

    // Configurable seller-specific return policy lookup
    // If ANIVA Store direct -> policy-driven window (default 7 days) [CONFIRMED]
    // If Verified Retailer -> retailer agreement policy [TBD / Seller-Configured]
    if (sellerId === "aniva-store") {
      return { 
        sellerId: "aniva-store", 
        returnWindowDays: 7, 
        isReturnable: true,
        policyNote: "Standard ANIVA direct return policy"
      };
    }

    const retailer = this.retailers.get(sellerId);
    return {
      sellerId,
      returnWindowDays: 7, // Configurable per retailer contract [TBD]
      isReturnable: retailer ? retailer.status === "APPROVED" : true,
      policyNote: "Verified Retailer return policy"
    };
  }

  public async createReturnRequest(req: DbReturnRequest): Promise<DbReturnRequest> {
    this.returnRequests.set(req.id, req);
    const item = this.orderItems.get(req.orderItemId);
    if (item) {
      item.returnStatus = "REQUESTED";
    }
    return req;
  }

  public async getReturnRequestById(id: string): Promise<DbReturnRequest | null> {
    return this.returnRequests.get(id) || null;
  }

  public async getReturnRequestsByUserId(userId: string): Promise<DbReturnRequest[]> {
    return Array.from(this.returnRequests.values())
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async getReturnRequestsBySellerId(sellerId: string): Promise<DbReturnRequest[]> {
    return Array.from(this.returnRequests.values())
      .filter(r => {
        const so = this.sellerOrders.get(r.sellerOrderId);
        return so && so.sellerId === sellerId;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async getAllReturnRequests(): Promise<DbReturnRequest[]> {
    return Array.from(this.returnRequests.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public async updateReturnStatus(id: string, status: ReturnStatus, notes?: string, reviewerId?: string): Promise<DbReturnRequest | null> {
    const req = this.returnRequests.get(id);
    if (!req) return null;
    req.status = status;
    if (notes) req.adminOrSellerNotes = notes;
    if (reviewerId) req.reviewedBy = reviewerId;
    req.reviewedAt = new Date().toISOString();
    req.updatedAt = new Date().toISOString();

    const item = this.orderItems.get(req.orderItemId);
    if (item) {
      if (status === "APPROVED") item.returnStatus = "APPROVED";
      else if (status === "REJECTED") item.returnStatus = "REJECTED";
      else if (status === "COMPLETED") item.returnStatus = "RETURNED";
    }

    return req;
  }

  public async createRefund(refund: DbRefund): Promise<DbRefund> {
    this.refunds.set(refund.id, refund);
    return refund;
  }

  public async getRefundById(id: string): Promise<DbRefund | null> {
    return this.refunds.get(id) || null;
  }

  public async getRefundsByParentOrderId(orderId: string): Promise<DbRefund[]> {
    return Array.from(this.refunds.values()).filter(r => r.parentOrderId === orderId);
  }

  public async getAllRefunds(): Promise<DbRefund[]> {
    return Array.from(this.refunds.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public async updateRefundStatus(id: string, status: RefundStatus, gatewayRefundId?: string): Promise<DbRefund | null> {
    const ref = this.refunds.get(id);
    if (!ref) return null;
    ref.status = status;
    if (gatewayRefundId) ref.gatewayRefundId = gatewayRefundId;
    ref.updatedAt = new Date().toISOString();
    return ref;
  }
}

export const db = new DatabaseAdapter();
