// ============================================================================
// ANIVA PRODUCTION POSTGRESQL SCHEMA SPECIFICATION & TYPES
// ============================================================================

export type UserRole = 
  | 'CUSTOMER' 
  | 'RETAILER' 
  | 'ADMIN_SUPER' 
  | 'ADMIN_OPS' 
  | 'ADMIN_VERIFIER' 
  | 'ADMIN_FINANCE';

export type ProductSource = 'ANIVA_STORE' | 'VERIFIED_RETAILER';

export type RetailerStatus = 
  | 'PENDING_ONBOARDING' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'SUSPENDED';

export type DocumentType = 
  | 'GST_CERTIFICATE' 
  | 'PAN_CARD' 
  | 'BANK_PROOF' 
  | 'BRAND_AUTH_LETTER';

export type DocumentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

// 1. Users Table
export interface DbUser {
  id: string; // UUID PK
  mobile?: string | null; // 10-Digit Indian Mobile (+91...) [CONFIRMED]
  email?: string | null;
  fullName?: string | null;
  role: UserRole;
  authProviderId?: string | null; // Managed auth UID
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// 2. Addresses Table (India-Only format)
export interface DbAddress {
  id: string; // UUID PK
  userId: string; // FK -> users.id
  recipientName: string;
  phoneNumber: string;
  pincode: string; // 6-Digit Indian Pincode [CONFIRMED]
  flatBuilding: string;
  streetArea: string;
  landmark?: string | null;
  cityDistrict: string;
  state: string; // Tamil Nadu, Karnataka, Kerala, AP, Telangana, etc.
  addressType: 'HOME' | 'WORK' | 'OTHER';
  isDefault: boolean;
  createdAt: string;
}

// 3. Retailers Table (B2B Multi-Seller)
export interface DbRetailer {
  id: string; // UUID PK
  userId: string; // FK -> users.id (Unique)
  businessName: string;
  tradeName?: string | null;
  contactEmail: string;
  contactPhone: string;
  commissionRate?: number | null; // Configurable per retailer [TBD]
  status: RetailerStatus;
  payoutAccountToken?: string | null; // Tokenized reference via payout provider [LEGAL VALIDATION]
  gstinNumber?: string | null; // [LEGAL VALIDATION]
  panNumber?: string | null; // [LEGAL VALIDATION]
  pickupPincode: string;
  pickupAddress: string;
  createdAt: string;
  updatedAt: string;
}

// 4. Retailer Documents Table
export interface DbRetailerDocument {
  id: string; // UUID PK
  retailerId: string; // FK -> retailers.id
  documentType: DocumentType;
  s3PrivateKey: string; // Encrypted private S3 key [CONFIRMED]
  mimeType: string;
  verificationStatus: DocumentStatus;
  reviewedBy?: string | null; // FK -> users.id
  rejectionReason?: string | null;
  createdAt: string;
}

// 5. Categories Table (6 Core Launch Categories + Pre-Owned Subcategories)
export interface DbCategory {
  id: string; // UUID PK
  slug: string; // Unique
  name: string; // e.g. 'Plain T-Shirts', 'Printed T-Shirts', 'Custom Printed T-Shirts', 'Shoes', 'Men\'s Accessories', 'Women\'s Accessories'
  parentId?: string | null; // FK -> categories.id (For subcategory hierarchies)
  description?: string | null;
  isPreOwnedEligible: boolean;
  displayOrder: number;
  isActive: boolean;
}

// 6. Brands Table
export interface DbBrand {
  id: string; // UUID PK
  slug: string; // Unique
  name: string;
  logoUrl?: string | null;
  isPreOwnedEligible: boolean;
}

// 7. Products Table (Master Catalog)
export interface DbProduct {
  id: string; // UUID PK
  slug: string; // Unique
  title: string;
  categoryId: string; // FK -> categories.id
  brandId?: string | null; // FK -> brands.id
  productSource: ProductSource; // 'ANIVA_STORE' | 'VERIFIED_RETAILER'
  retailerId?: string | null; // FK -> retailers.id (NULL for ANIVA_STORE)
  description: string;
  mrp: number; // Maximum Retail Price (INR ₹)
  sellingPrice: number; // Listed Transaction Price (INR ₹)
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 8. Product Variants Table (SKU Level)
export interface DbProductVariant {
  id: string; // UUID PK
  productId: string; // FK -> products.id
  sku: string; // Unique SKU code
  size: string; // 'S', 'M', 'L', 'XL', 'XXL', 'UK 7', 'UK 8', etc.
  colorName: string;
  colorHex: string;
  fitType?: 'Classic' | 'Oversized' | 'Relaxed' | null; // Garment fit specification [PROPOSED]
  stockQuantity: number; // Positive integer >= 0
  createdAt: string;
}

// 9. Product Images Table
export interface DbProductImage {
  id: string; // UUID PK
  productId: string; // FK -> products.id
  imageUrl: string;
  altText?: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

// 10. Inventory Tracking Table
export interface DbInventoryRecord {
  id: string; // UUID PK
  variantId: string; // FK -> product_variants.id (Unique)
  sku: string;
  availableStock: number;
  reservedStock: number; // Active reservations
  safetyStockThreshold: number;
  status: InventoryStatus;
  lastRestockedAt?: string | null;
  updatedAt: string;
}

// 11. Inventory Reservation Table (Safe Checkout Hold)
export type ReservationStatus = 'ACTIVE' | 'COMMITTED' | 'EXPIRED' | 'RELEASED';

export interface DbInventoryReservation {
  id: string; // UUID PK
  reservationToken: string; // Unique idempotency / checkout session token
  variantId: string; // FK -> product_variants.id
  quantity: number;
  userId?: string | null;
  expiresAt: string; // ISO String (e.g. +15 mins)
  status: ReservationStatus;
  createdAt: string;
  committedAt?: string | null;
}

// 12. Cart & Cart Items Table (Persistent Customer Cart)
export interface DbCartItem {
  id: string; // Unique item ID
  productId: string; // FK -> products.id
  variantId: string; // FK -> product_variants.id
  quantity: number;
  customDesign?: any; // JSON custom print configuration if applicable
  addedAt: string;
}

export interface DbCart {
  id: string; // Cart UUID
  userId?: string | null; // Set for logged-in users
  sessionId: string; // Session / Guest identifier
  items: DbCartItem[];
  createdAt: string;
  updatedAt: string;
}

// 13. Orders & Order Splitting Schema (Parent / Seller Architecture)
export type OrderStatus = 
  | 'PLACED' 
  | 'CONFIRMED' 
  | 'PROCESSING' 
  | 'DISPATCHED' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export type PaymentStatus = 
  | 'PENDING' 
  | 'AUTHORIZED' 
  | 'PAID' 
  | 'FAILED' 
  | 'CANCELLED' 
  | 'REFUNDED' 
  | 'PARTIALLY_REFUNDED';

export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'COD';

export interface OrderAddressSnapshot {
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string | null;
}

// Parent Order (Unified Customer View)
export interface DbOrder {
  id: string; // e.g. "ANV-ORD-20260815-1049"
  orderNumber: string; // Customer readable order number
  userId: string; // FK -> users.id (or guest identifier)
  idempotencyKey?: string | null; // Prevents duplicate checkouts
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number; // Configurable / TBD
  total: number;
  currency: string; // "INR"
  shippingAddress: OrderAddressSnapshot;
  sellerOrderIds: string[]; // FKs -> seller_orders.id
  reservationToken?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Child / Seller Fulfillment Order (Isolated Merchant View)
export interface DbSellerOrder {
  id: string; // e.g. "ANV-SEL-20260815-9012"
  sellerOrderNumber: string;
  parentOrderId: string; // FK -> orders.id
  sellerId: string; // FK -> retailers.id or 'aniva-store'
  productSource: ProductSource;
  orderStatus: OrderStatus;
  subtotal: number;
  shippingFee: number;
  total: number;
  commissionRate?: number | null; // Configurable / TBD
  commissionAmount?: number | null; // Configurable / TBD
  sellerPayoutAmount?: number | null; // Configurable / TBD
  trackingNumber: string;
  estimatedDelivery: string;
  courierPartner: string; // Configurable / TBD
  createdAt: string;
  updatedAt: string;
}

// Order Items (Immutable Price & Product Snapshot)
export interface DbOrderItem {
  id: string; // UUID PK
  parentOrderId: string; // FK -> orders.id
  sellerOrderId: string; // FK -> seller_orders.id
  productId: string; // FK -> products.id
  variantId: string; // FK -> product_variants.id
  sku: string;
  titleSnapshot: string;
  sizeSnapshot: string;
  colorSnapshot: string;
  fitSnapshot?: string | null;
  imageSnapshot: string;
  unitPriceSnapshot: number; // Snapshot of selling price at time of checkout
  mrpSnapshot: number;
  quantity: number;
  totalPrice: number;
  productSource: ProductSource;
  sellerId: string;
  customDesign?: any | null;
  isPreOwned?: boolean;
  verificationId?: string | null;
  returnStatus?: 'NONE' | 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'RETURNED';
  createdAt: string;
}

// 14. Payment Gateway & Webhook Ledger Schema
export type PaymentGatewayProvider = 'DEMO_GATEWAY' | 'RAZORPAY' | 'STRIPE' | 'CASH_ON_DELIVERY';

export interface DbPayment {
  id: string; // UUID PK
  parentOrderId: string; // FK -> orders.id
  paymentMethod: PaymentMethod;
  gatewayProvider: PaymentGatewayProvider;
  transactionId: string; // Gateway transaction/payment reference
  gatewayOrderId?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  isTestMode: boolean; // Marked true for DEMO adapter
  gatewayResponse?: any;
  createdAt: string;
  updatedAt: string;
}

export interface DbPaymentAuditLog {
  id: string; // UUID PK
  paymentId?: string | null;
  parentOrderId: string;
  eventType: string; // e.g. "PAYMENT_INITIATED", "WEBHOOK_PROCESSED", "REFUND_TRIGGERED"
  previousStatus?: string | null;
  newStatus?: string | null;
  actorId?: string | null;
  actorRole?: string | null;
  idempotencyKey?: string | null;
  ipAddress?: string | null;
  details?: any;
  createdAt: string;
}

// 15. Returns & Refunds Schema
export type ReturnReason = 
  | 'SIZE_FIT' 
  | 'DEFECTIVE' 
  | 'DIFFERENT_FROM_DESCRIPTION' 
  | 'QUALITY_NOT_EXPECTED' 
  | 'CHANGED_MIND' 
  | 'OTHER';

export type ReturnStatus = 
  | 'REQUESTED' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'PICKUP_SCHEDULED' 
  | 'RECEIVED' 
  | 'INSPECTED' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type RefundStatus = 
  | 'REQUESTED' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'PROCESSING' 
  | 'COMPLETED' 
  | 'FAILED';

export interface DbReturnRequest {
  id: string; // e.g. "RET-20260815-001"
  parentOrderId: string; // FK -> orders.id
  sellerOrderId: string; // FK -> seller_orders.id
  orderItemId: string; // FK -> order_items.id
  userId: string; // FK -> users.id
  reason: ReturnReason;
  customerNotes?: string | null;
  images: string[];
  status: ReturnStatus;
  sellerPolicySnapshot: {
    sellerId: string;
    returnWindowDays: number; // Configurable per seller [TBD]
    isReturnable: boolean;
  };
  adminOrSellerNotes?: string | null;
  reviewedBy?: string | null; // FK -> users.id
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DbRefund {
  id: string; // e.g. "REF-20260815-001"
  returnRequestId?: string | null; // FK -> return_requests.id
  parentOrderId: string; // FK -> orders.id
  paymentId?: string | null; // FK -> payments.id
  amount: number;
  currency: string;
  type: 'FULL' | 'PARTIAL';
  status: RefundStatus;
  gatewayRefundId?: string | null;
  reason: string;
  authorizedBy: string; // FK -> users.id (Admin/Finance)
  authorizedAt: string;
  createdAt: string;
  updatedAt: string;
}
