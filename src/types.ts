export type CategoryType = 
  | "Plain T-Shirts"
  | "Printed T-Shirts"
  | "Custom Printed T-Shirts"
  | "Shoes"
  | "Men's Accessories"
  | "Women's Accessories"
  | "Pre-Owned Watches"
  | "Pre-Owned Shoes";

export type ConditionGrade = "S" | "A" | "B" | "C";

export interface ConditionGradeInfo {
  grade: ConditionGrade;
  title: string;
  badgeColor: string;
  description: string;
}

export interface VerificationCertificate {
  verificationId: string;
  productId: string;
  productName: string;
  brand: string;
  model: string;
  serialNumber?: string;
  conditionGrade: ConditionGrade;
  verifiedDate: string;
  authenticatorName: string;
  authenticatorRole: string;
  inspectionPassed: string[];
  qrCodeUrl: string;
  status: "VERIFIED" | "PENDING_PHYSICAL_INSPECTION" | "REJECTED";
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryType;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  details: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  tags: string[];
  fabric?: string;
  careInstructions?: string;
  
  // Pre-Owned & Marketplace Extensions
  isPreOwned?: boolean;
  conditionGrade?: ConditionGrade;
  conditionNotes?: string;
  verificationId?: string;
  verificationDate?: string;
  serialNumber?: string;
  hasBox?: boolean;
  hasPapers?: boolean;
  hasInvoice?: boolean;
  inspectionReport?: string[];
  sellerId?: string;
  sellerName?: string;
  sellerType?: "ANIVA Direct" | "Verified Retailer" | "Private Collector";
  isVerified?: boolean;
  estimatedMarketRange?: { min: number; max: number };
}

export interface CustomDesign {
  baseColor: string;
  size: string;
  fit: "Oversized Fit" | "Classic Fit" | "Slim Fit";
  frontText?: string;
  frontFont?: string;
  frontTextColor?: string;
  frontTextSize?: number;
  frontArtworkUrl?: string;
  frontEmblem?: string;
  backText?: string;
  backFont?: string;
  backTextColor?: string;
  backTextSize?: number;
  backArtworkUrl?: string;
  calculatedPrice: number;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
  customDesign?: CustomDesign;
  sellerId?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  minOrderAmount: number;
  description: string;
  expiresAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  image: string;
  customDesign?: CustomDesign;
  sellerId?: string;
  sellerName?: string;
  isPreOwned?: boolean;
  verificationId?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  state: string; // e.g. Tamil Nadu, Kerala, Karnataka, Telangana, Andhra Pradesh, Maharashtra, Delhi
  pincode: string;
  landmark?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: "Razorpay" | "Cash on Delivery" | "UPI Direct" | "Card / Net Banking" | "UPI" | "CARD" | "NET_BANKING" | "COD" | string;
  paymentStatus: "Paid" | "Pending" | "COD Confirmed" | "Authorized" | "Failed" | "Refunded" | string;
  orderStatus: "Placed" | "Processing" | "Dispatched" | "Out for Delivery" | "Delivered" | "Cancelled" | string;
  trackingNumber: string;
  estimatedDelivery: string;
  courierPartner: string;
}

export interface PreOwnedSubmission {
  id: string;
  category: "Watches" | "Shoes";
  brand: string;
  model: string;
  referenceNumber?: string;
  condition: ConditionGrade;
  originalPrice: number;
  askingPrice: number;
  aiSuggestedPrice?: number;
  aiMarketRange?: { min: number; max: number };
  aiConfidence?: "High" | "Medium" | "Low";
  hasBox: boolean;
  hasPapers: boolean;
  hasInvoice: boolean;
  photos: { angle: string; url: string }[];
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerCity: string;
  status: "SUBMITTED" | "DOCUMENT_REVIEW" | "PHYSICAL_INTAKE" | "AUTHENTICATED" | "REJECTED";
  submittedAt: string;
  verificationId?: string;
}

export interface RetailerApplication {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstin: string;
  state: string;
  city: string;
  brandCategories: string[];
  bankAccountNumber: string;
  bankIfsc: string;
  brandAuthLetterUrl?: string;
  status: "PENDING_REVIEW" | "KYC_VERIFIED" | "APPROVED" | "REJECTED";
  appliedAt: string;
  commissionRate: number; // e.g., 18%
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  brands: string[];
  minRating: number;
  inStockOnly: boolean;
  isPreOwnedOnly?: boolean;
  isVerifiedOnly?: boolean;
  conditionGrades?: ConditionGrade[];
  sortBy: "featured" | "newest" | "best_selling" | "price_low_high" | "price_high_low" | "rating";
  searchQuery: string;
}

export type AdminRole = 
  | "SUPER_ADMIN" 
  | "VERIFICATION_SPECIALIST" 
  | "OPERATIONS_DTG" 
  | "RETAILER_MANAGER" 
  | "FINANCE";

export type PageView =
  | "home"
  | "shop"
  | "category"
  | "product"
  | "custom-studio"
  | "pre-owned"
  | "sell-item"
  | "retailer-portal"
  | "verify-lookup"
  | "cart"
  | "checkout"
  | "wishlist"
  | "track-order"
  | "my-orders"
  | "my-profile"
  | "about"
  | "contact"
  | "privacy"
  | "terms"
  | "refund"
  | "admin";
