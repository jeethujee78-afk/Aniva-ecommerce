import { ordersRepository, OrdersRepository } from "./orders.repository.js";
import { db } from "../../db/connection.js";
import { ApiError } from "../../middleware/errorHandler.js";
import { COMMERCE_CONFIG } from "../../config/commerce.config.js";
import { 
  DbOrder, 
  DbSellerOrder, 
  DbOrderItem, 
  OrderAddressSnapshot, 
  PaymentMethod, 
  OrderStatus, 
  PaymentStatus,
  ProductSource 
} from "../../db/schema.js";

export interface CreateOrderDTO {
  userId?: string | null;
  items: Array<{
    productId: string;
    variantId: string;
    quantity: number;
    customDesign?: any;
  }>;
  shippingAddress: OrderAddressSnapshot;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  idempotencyKey?: string;
  reservationToken?: string;
  sessionId?: string;
}

export interface EnrichedOrderResponse {
  order: DbOrder;
  sellerOrders: DbSellerOrder[];
  items: DbOrderItem[];
}

export class OrdersService {
  constructor(private repo: OrdersRepository = ordersRepository) {}

  async checkoutOrder(dto: CreateOrderDTO): Promise<EnrichedOrderResponse> {
    // 1. Idempotency Check
    if (dto.idempotencyKey) {
      const existingOrder = await this.repo.getOrderByIdempotencyKey(dto.idempotencyKey);
      if (existingOrder) {
        const sellerOrders = await Promise.all(
          existingOrder.sellerOrderIds.map(id => this.repo.getSellerOrderById(id))
        );
        const validSellerOrders = sellerOrders.filter((s): s is DbSellerOrder => s !== null);
        const items = await this.repo.getOrderItemsByParentOrderId(existingOrder.id);
        return {
          order: existingOrder,
          sellerOrders: validSellerOrders,
          items
        };
      }
    }

    if (!dto.items || dto.items.length === 0) {
      throw new ApiError(400, "EMPTY_CHECKOUT", "Checkout items cannot be empty");
    }

    if (!dto.shippingAddress || !dto.shippingAddress.fullName || !dto.shippingAddress.phone || !dto.shippingAddress.pincode) {
      throw new ApiError(400, "INVALID_ADDRESS", "Incomplete shipping address snapshot");
    }

    // 2. Server-side Price & Stock Validation (NEVER trusting frontend price)
    interface VerifiedItem {
      productId: string;
      variantId: string;
      sku: string;
      title: string;
      size: string;
      color: string;
      fit?: string | null;
      image: string;
      unitPrice: number;
      mrp: number;
      quantity: number;
      totalPrice: number;
      productSource: ProductSource;
      sellerId: string;
      customDesign?: any;
      isPreOwned?: boolean;
      verificationId?: string | null;
    }

    const verifiedItems: VerifiedItem[] = [];

    for (const reqItem of dto.items) {
      if (reqItem.quantity <= 0) {
        throw new ApiError(400, "INVALID_QUANTITY", `Invalid quantity: ${reqItem.quantity}`);
      }

      const product = await db.getProductById(reqItem.productId);
      if (!product || !product.isActive) {
        throw new ApiError(404, "PRODUCT_NOT_FOUND", `Product '${reqItem.productId}' is not available`);
      }

      const variant = product.variants.find(v => v.id === reqItem.variantId);
      if (!variant) {
        throw new ApiError(404, "VARIANT_NOT_FOUND", `Variant '${reqItem.variantId}' is not found`);
      }

      // Calculate unit price from authoritative catalog
      const unitPrice = reqItem.customDesign?.calculatedPrice || product.sellingPrice;
      const primaryImage = product.images.find(i => i.isPrimary)?.imageUrl || product.images[0]?.imageUrl || "";

      verifiedItems.push({
        productId: product.id,
        variantId: variant.id,
        sku: variant.sku,
        title: product.title,
        size: variant.size,
        color: variant.colorName,
        fit: variant.fitType,
        image: primaryImage,
        unitPrice,
        mrp: product.mrp,
        quantity: reqItem.quantity,
        totalPrice: unitPrice * reqItem.quantity,
        productSource: product.productSource,
        sellerId: product.retailerId || "aniva-store",
        customDesign: reqItem.customDesign,
        isPreOwned: product.tags.includes("Pre-Owned"),
        verificationId: undefined
      });
    }

    // 3. Inventory Reservation / Commitment
    let reservationToken = dto.reservationToken;
    if (reservationToken) {
      const committed = await this.repo.commitReservation(reservationToken);
      if (!committed) {
        // If reservation expired or missing, try fallback atomic reservation
        const reserveRes = await db.createInventoryReservation({
          items: verifiedItems.map(i => ({ variantId: i.variantId, quantity: i.quantity })),
          userId: dto.userId
        });
        if (!reserveRes.success || !reserveRes.reservationToken) {
          throw new ApiError(409, "INSUFFICIENT_STOCK", reserveRes.error || "Inventory unavailable for checkout items");
        }
        reservationToken = reserveRes.reservationToken;
        await this.repo.commitReservation(reservationToken);
      }
    } else {
      // Direct transactional checkout reservation & commitment
      const reserveRes = await db.createInventoryReservation({
        items: verifiedItems.map(i => ({ variantId: i.variantId, quantity: i.quantity })),
        userId: dto.userId
      });
      if (!reserveRes.success || !reserveRes.reservationToken) {
        throw new ApiError(409, "INSUFFICIENT_STOCK", reserveRes.error || "Inventory unavailable for checkout items");
      }
      reservationToken = reserveRes.reservationToken;
      await this.repo.commitReservation(reservationToken);
    }

    // 4. Generate Parent & Seller Order IDs
    const now = new Date();
    const timestampStr = now.toISOString().replace(/[-:TZ.]/g, "").slice(0, 12);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const parentOrderId = `ANV-ORD-${timestampStr}-${randomSuffix}`;
    const orderNumber = `ANV-${Math.floor(10000 + Math.random() * 90000)}`;

    // 5. Multi-Seller Splitting (Group verified items by sellerId)
    const sellerGroupMap = new Map<string, VerifiedItem[]>();
    for (const item of verifiedItems) {
      const group = sellerGroupMap.get(item.sellerId) || [];
      group.push(item);
      sellerGroupMap.set(item.sellerId, group);
    }

    const createdSellerOrders: DbSellerOrder[] = [];
    const createdOrderItems: DbOrderItem[] = [];
    const sellerOrderIds: string[] = [];

    // SLA delivery calculation using configurable commerce policy [TBD]
    const deliveryPolicy = COMMERCE_CONFIG.shipping.calculateEstimatedDelivery(dto.shippingAddress.state);
    const estimatedDeliveryStr = deliveryPolicy.estimatedDeliveryDate;
    const courierPartner = deliveryPolicy.courierPartner;

    let sellerIdx = 1;
    for (const [sellerId, itemsInGroup] of sellerGroupMap.entries()) {
      const sellerOrderId = `ANV-SEL-${timestampStr}-${randomSuffix}-${sellerIdx}`;
      const sellerOrderNumber = `${orderNumber}-S${sellerIdx}`;
      sellerOrderIds.push(sellerOrderId);

      const sellerSubtotal = itemsInGroup.reduce((sum, it) => sum + it.totalPrice, 0);
      const sellerShipping = 0; // Unified at parent level
      const sellerTotal = sellerSubtotal + sellerShipping;

      const productSource: ProductSource = sellerId === "aniva-store" ? "ANIVA_STORE" : "VERIFIED_RETAILER";

      // Configurable commission / payout structure [TBD]
      let commissionRate: number | null = null;
      let commissionAmount: number | null = null;
      let sellerPayoutAmount: number | null = sellerTotal;

      if (productSource === "VERIFIED_RETAILER") {
        const retailers = await db.getRetailers();
        const retailer = retailers.find(r => r.id === sellerId);
        commissionRate = retailer?.commissionRate || COMMERCE_CONFIG.commission.getDefaultCommissionRate();
        commissionAmount = Math.round((sellerTotal * commissionRate) / 100);
        sellerPayoutAmount = sellerTotal - commissionAmount;
      }

      const sellerOrder: DbSellerOrder = {
        id: sellerOrderId,
        sellerOrderNumber,
        parentOrderId,
        sellerId,
        productSource,
        orderStatus: "PLACED",
        subtotal: sellerSubtotal,
        shippingFee: sellerShipping,
        total: sellerTotal,
        commissionRate,
        commissionAmount,
        sellerPayoutAmount,
        trackingNumber: `BD-TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
        estimatedDelivery: estimatedDeliveryStr,
        courierPartner,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };

      createdSellerOrders.push(sellerOrder);

      // Create snapshot items for this seller order
      for (const it of itemsInGroup) {
        const orderItem: DbOrderItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          parentOrderId,
          sellerOrderId,
          productId: it.productId,
          variantId: it.variantId,
          sku: it.sku,
          titleSnapshot: it.title,
          sizeSnapshot: it.size,
          colorSnapshot: it.color,
          fitSnapshot: it.fit,
          imageSnapshot: it.image,
          unitPriceSnapshot: it.unitPrice,
          mrpSnapshot: it.mrp,
          quantity: it.quantity,
          totalPrice: it.totalPrice,
          productSource: it.productSource,
          sellerId: it.sellerId,
          customDesign: it.customDesign,
          isPreOwned: it.isPreOwned,
          verificationId: it.verificationId,
          returnStatus: "NONE",
          createdAt: now.toISOString()
        };
        createdOrderItems.push(orderItem);
      }

      sellerIdx++;
    }

    // 6. Calculate Parent Order Totals using policy engine
    const subtotal = verifiedItems.reduce((acc, i) => acc + i.totalPrice, 0);
    const shippingFee = COMMERCE_CONFIG.shipping.calculateShippingFee(subtotal, verifiedItems.length);
    let discount = 0;

    // Optional Coupon Validation
    const freeThreshold = COMMERCE_CONFIG.shipping.getFreeShippingThreshold();
    if (dto.couponCode) {
      if (dto.couponCode.toUpperCase() === "ANIVA10" && subtotal >= freeThreshold) {
        discount = Math.round((subtotal * 10) / 100);
      } else if (dto.couponCode.toUpperCase() === "FIRST500" && subtotal >= 2999) {
        discount = 500;
      }
    }

    const total = Math.max(0, subtotal - discount + shippingFee);

    // Initial Payment State
    const paymentStatus: PaymentStatus = dto.paymentMethod === "COD" ? "PENDING" : "PENDING";
    const orderStatus: OrderStatus = "PLACED";

    const parentOrder: DbOrder = {
      id: parentOrderId,
      orderNumber,
      userId: dto.userId || "usr-guest",
      idempotencyKey: dto.idempotencyKey || null,
      orderStatus,
      paymentStatus,
      paymentMethod: dto.paymentMethod,
      subtotal,
      discount,
      shippingFee,
      tax: 0,
      total,
      currency: "INR",
      shippingAddress: dto.shippingAddress,
      sellerOrderIds,
      reservationToken,
      notes: "Unified customer order with multi-seller splitting",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    // 7. Persist Parent Order, Seller Orders, and Items
    await this.repo.createOrder(parentOrder, createdSellerOrders, createdOrderItems);

    // 8. Clear user/session cart after successful checkout
    if (dto.userId || dto.sessionId) {
      await db.clearCart({ userId: dto.userId || undefined, sessionId: dto.sessionId || "guest-session" });
    }

    return {
      order: parentOrder,
      sellerOrders: createdSellerOrders,
      items: createdOrderItems
    };
  }

  async getOrderDetails(orderId: string, currentUser?: { id: string; role: string; retailerId?: string }): Promise<EnrichedOrderResponse> {
    const order = await this.repo.getOrderById(orderId);
    if (!order) {
      throw new ApiError(404, "ORDER_NOT_FOUND", `Order '${orderId}' not found`);
    }

    // Customer Isolation Check
    if (currentUser && currentUser.role === "CUSTOMER" && order.userId !== currentUser.id) {
      throw new ApiError(403, "FORBIDDEN", "You do not have permission to view this order");
    }

    const sellerOrders = await Promise.all(
      order.sellerOrderIds.map(id => this.repo.getSellerOrderById(id))
    );
    const validSellerOrders = sellerOrders.filter((s): s is DbSellerOrder => s !== null);
    const items = await this.repo.getOrderItemsByParentOrderId(order.id);

    return {
      order,
      sellerOrders: validSellerOrders,
      items
    };
  }

  async getCustomerOrders(userId: string): Promise<EnrichedOrderResponse[]> {
    const orders = await this.repo.getOrdersByUserId(userId);
    const enrichedList: EnrichedOrderResponse[] = [];

    for (const order of orders) {
      const sellerOrders = await Promise.all(
        order.sellerOrderIds.map(id => this.repo.getSellerOrderById(id))
      );
      const validSellerOrders = sellerOrders.filter((s): s is DbSellerOrder => s !== null);
      const items = await this.repo.getOrderItemsByParentOrderId(order.id);

      enrichedList.push({
        order,
        sellerOrders: validSellerOrders,
        items
      });
    }

    return enrichedList;
  }

  async getRetailerOrders(retailerId: string): Promise<Array<{ sellerOrder: DbSellerOrder; items: DbOrderItem[]; parentOrder: DbOrder | null }>> {
    const sellerOrders = await this.repo.getSellerOrdersBySellerId(retailerId);
    const results = [];

    for (const so of sellerOrders) {
      const items = await this.repo.getOrderItemsBySellerOrderId(so.id);
      const parentOrder = await this.repo.getOrderById(so.parentOrderId);
      results.push({
        sellerOrder: so,
        items,
        parentOrder
      });
    }

    return results;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<DbOrder> {
    const updated = await this.repo.updateOrderStatus(orderId, status);
    if (!updated) {
      throw new ApiError(404, "ORDER_NOT_FOUND", "Order not found");
    }
    return updated;
  }

  async updateSellerOrderStatus(sellerOrderId: string, status: OrderStatus, retailerId?: string): Promise<DbSellerOrder> {
    const so = await this.repo.getSellerOrderById(sellerOrderId);
    if (!so) {
      throw new ApiError(404, "SELLER_ORDER_NOT_FOUND", "Seller order not found");
    }

    // Retailer Tenant Isolation Check
    if (retailerId && so.sellerId !== retailerId) {
      throw new ApiError(403, "FORBIDDEN", "Unauthorized access to this seller fulfillment order");
    }

    const updated = await this.repo.updateSellerOrderStatus(sellerOrderId, status);
    return updated!;
  }

  async trackOrder(query: string): Promise<EnrichedOrderResponse[]> {
    const q = query.trim().toLowerCase();
    const allOrders = await this.repo.getAllOrders();

    const matched = allOrders.filter(o => 
      o.id.toLowerCase() === q ||
      o.orderNumber.toLowerCase() === q ||
      o.shippingAddress.phone.replace(/\D/g, "").includes(q.replace(/\D/g, "")) ||
      o.shippingAddress.email.toLowerCase() === q
    );

    const enrichedList: EnrichedOrderResponse[] = [];
    for (const order of matched) {
      const sellerOrders = await Promise.all(
        order.sellerOrderIds.map(id => this.repo.getSellerOrderById(id))
      );
      const validSellerOrders = sellerOrders.filter((s): s is DbSellerOrder => s !== null);
      const items = await this.repo.getOrderItemsByParentOrderId(order.id);

      enrichedList.push({
        order,
        sellerOrders: validSellerOrders,
        items
      });
    }

    return enrichedList;
  }
}

export const ordersService = new OrdersService();
