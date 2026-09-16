import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Product, 
  CartItem, 
  Order, 
  FilterState, 
  PageView, 
  CategoryType, 
  CustomDesign, 
  Review, 
  PreOwnedSubmission, 
  RetailerApplication, 
  VerificationCertificate,
  AdminRole
} from "../types";
import { 
  INITIAL_PRODUCTS, 
  INITIAL_REVIEWS, 
  INITIAL_PREOWNED_SUBMISSIONS, 
  INITIAL_RETAILER_APPLICATIONS, 
  INITIAL_CERTIFICATES 
} from "../data/initialData";
import { catalogApiService } from "../services/catalogService";

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

interface ShopContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  selectedCategory: CategoryType | "All";
  setSelectedCategory: (cat: CategoryType | "All") => void;
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: { name: string; hex: string }, quantity?: number, customDesign?: CustomDesign) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlist: string[]; // Product IDs
  toggleWishlist: (productId: string) => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  appliedCoupon: { code: string; discountPercentage: number; discountAmount: number } | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "info" | "error") => void;
  userOrders: Order[];
  addOrder: (order: Order) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  adminRole: AdminRole;
  setAdminRole: (role: AdminRole) => void;
  reviews: Review[];
  addReview: (productId: string, rating: number, comment: string, name: string, location: string) => Promise<boolean>;
  refreshProducts: () => Promise<void>;
  
  // Pre-Owned & Verification
  preOwnedSubmissions: PreOwnedSubmission[];
  addPreOwnedSubmission: (submission: Omit<PreOwnedSubmission, "id" | "submittedAt" | "status">) => PreOwnedSubmission;
  updateSubmissionStatus: (submissionId: string, status: PreOwnedSubmission["status"], verificationId?: string) => void;
  isSellItemModalOpen: boolean;
  setIsSellItemModalOpen: (open: boolean) => void;
  
  // Verification Certificates
  certificates: Record<string, VerificationCertificate>;
  activeCertificate: VerificationCertificate | null;
  setActiveCertificate: (cert: VerificationCertificate | null) => void;
  lookupCertificate: (verificationId: string) => VerificationCertificate | null;
  
  // Retailer Marketplace
  retailerApplications: RetailerApplication[];
  addRetailerApplication: (app: Omit<RetailerApplication, "id" | "appliedAt" | "status" | "commissionRate">) => RetailerApplication;
  updateRetailerStatus: (appId: string, status: RetailerApplication["status"]) => void;
  
  // AI Customer Assistant
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
}

const defaultFilterState: FilterState = {
  category: "All",
  minPrice: 0,
  maxPrice: 1200000,
  sizes: [],
  colors: [],
  brands: [],
  minRating: 0,
  inStockOnly: false,
  isPreOwnedOnly: false,
  isVerifiedOnly: false,
  conditionGrades: [],
  sortBy: "featured",
  searchQuery: ""
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activePage, setActivePage] = useState<PageView>("home");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | "All">("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("aniva_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("aniva_wishlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercentage: number; discountAmount: number } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("aniva_orders");
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRole>("SUPER_ADMIN");
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Pre-Owned state
  const [preOwnedSubmissions, setPreOwnedSubmissions] = useState<PreOwnedSubmission[]>(() => {
    const saved = localStorage.getItem("aniva_po_subs");
    return saved ? JSON.parse(saved) : INITIAL_PREOWNED_SUBMISSIONS;
  });
  const [isSellItemModalOpen, setIsSellItemModalOpen] = useState(false);

  // Certificates state
  const [certificates, setCertificates] = useState<Record<string, VerificationCertificate>>(() => {
    const saved = localStorage.getItem("aniva_certs");
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });
  const [activeCertificate, setActiveCertificate] = useState<VerificationCertificate | null>(null);

  // Retailer Applications
  const [retailerApplications, setRetailerApplications] = useState<RetailerApplication[]>(() => {
    const saved = localStorage.getItem("aniva_ret_apps");
    return saved ? JSON.parse(saved) : INITIAL_RETAILER_APPLICATIONS;
  });

  // AI Assistant Modal
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("aniva_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("aniva_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("aniva_orders", JSON.stringify(userOrders));
  }, [userOrders]);

  useEffect(() => {
    localStorage.setItem("aniva_po_subs", JSON.stringify(preOwnedSubmissions));
  }, [preOwnedSubmissions]);

  useEffect(() => {
    localStorage.setItem("aniva_certs", JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem("aniva_ret_apps", JSON.stringify(retailerApplications));
  }, [retailerApplications]);

  // Fetch live products from backend modular monolith (/api/v1/products)
  const refreshProducts = async () => {
    try {
      const { products: apiProducts } = await catalogApiService.getProducts();
      if (apiProducts && apiProducts.length > 0) {
        setProducts(apiProducts);
      }
    } catch {
      // Fallback to local initial products if offline
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const addToCart = (
    product: Product,
    size: string,
    color: { name: string; hex: string },
    quantity = 1,
    customDesign?: CustomDesign
  ) => {
    const cartItemId = `${product.id}-${size}-${color.name}${customDesign ? "-custom" : ""}`;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === cartItemId);
      if (existing) {
        return prevCart.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            product,
            selectedSize: size,
            selectedColor: color,
            quantity,
            customDesign,
            sellerId: product.sellerId || "ANIVA-DIRECT"
          }
        ];
      }
    });

    showToast(`Added "${product.name}" (${size}) to your bag`, "success");
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast("Item removed from bag", "info");
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast("Removed from Wishlist", "info");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Saved to Wishlist", "success");
        return [...prev, productId];
      }
    });
  };

  const resetFilters = () => {
    setFilterState(defaultFilterState);
  };

  const applyCoupon = async (code: string) => {
    const subtotal = cart.reduce(
      (acc, item) => acc + (item.customDesign ? item.customDesign.calculatedPrice : item.product.price) * item.quantity,
      0
    );

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, amount: subtotal })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountPercentage: data.coupon.discountPercentage,
          discountAmount: data.discountAmount
        });
        showToast(data.message, "success");
        return { success: true, message: data.message };
      } else {
        showToast(data.message, "error");
        return { success: false, message: data.message };
      }
    } catch {
      // Local fallback coupon validation
      const codeUpper = code.toUpperCase().trim();
      if (codeUpper === "ANIVA10") {
        const discountVal = Math.round((subtotal * 10) / 100);
        setAppliedCoupon({ code: "ANIVA10", discountPercentage: 10, discountAmount: discountVal });
        showToast("Coupon ANIVA10 applied! (10% OFF)", "success");
        return { success: true, message: "10% OFF applied!" };
      } else if (codeUpper === "SOUTHGOLD" && subtotal >= 2499) {
        const discountVal = Math.round((subtotal * 15) / 100);
        setAppliedCoupon({ code: "SOUTHGOLD", discountPercentage: 15, discountAmount: discountVal });
        showToast("Coupon SOUTHGOLD applied! (15% OFF)", "success");
        return { success: true, message: "15% OFF applied!" };
      } else {
        showToast("Invalid or expired coupon code", "error");
        return { success: false, message: "Invalid coupon code" };
      }
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon removed", "info");
  };

  const addOrder = (order: Order) => {
    setUserOrders((prev) => [order, ...prev]);
    clearCart();
  };

  const addReview = async (
    productId: string,
    rating: number,
    comment: string,
    userName: string,
    location: string
  ) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment, userName, location })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        await refreshProducts();
        return true;
      }
    } catch {
      // Local review update
      const newRev: Review = {
        id: "REV-" + Date.now(),
        productId,
        userName,
        location,
        rating,
        comment,
        date: new Date().toISOString().split("T")[0],
        verifiedPurchase: true
      };
      setReviews((prev) => [newRev, ...prev]);
      showToast("Thank you for your review!", "success");
      return true;
    }
    return false;
  };

  // Pre-Owned actions
  const addPreOwnedSubmission = (
    submissionData: Omit<PreOwnedSubmission, "id" | "submittedAt" | "status">
  ): PreOwnedSubmission => {
    const newId = "SUB-2026-" + Math.floor(100 + Math.random() * 900);
    const newSubmission: PreOwnedSubmission = {
      ...submissionData,
      id: newId,
      status: "SUBMITTED",
      submittedAt: new Date().toISOString()
    };

    setPreOwnedSubmissions((prev) => [newSubmission, ...prev]);
    showToast(`Submission #${newId} logged for ANIVA physical authentication inspection!`, "success");
    return newSubmission;
  };

  const updateSubmissionStatus = (
    submissionId: string, 
    status: PreOwnedSubmission["status"], 
    verificationId?: string
  ) => {
    setPreOwnedSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === submissionId) {
          return {
            ...sub,
            status,
            verificationId: verificationId || sub.verificationId
          };
        }
        return sub;
      })
    );

    // If authenticated, generate certificate & publish product
    if (status === "AUTHENTICATED" && verificationId) {
      const sub = preOwnedSubmissions.find((s) => s.id === submissionId);
      if (sub) {
        const newCert: VerificationCertificate = {
          verificationId,
          productId: "ANV-PO-" + Date.now(),
          productName: `${sub.brand} ${sub.model}`,
          brand: sub.brand,
          model: sub.model,
          serialNumber: sub.referenceNumber || "SR-" + Math.floor(100000 + Math.random() * 900000),
          conditionGrade: sub.condition,
          verifiedDate: new Date().toISOString().split("T")[0],
          authenticatorName: "ANIVA Verification Board",
          authenticatorRole: "Certified Lead Inspector",
          inspectionPassed: [
            "100% Genuine movement & materials authenticated",
            "Ultrasonic cleaning & serial stamp verified against manufacturer registry",
            "Physical inspection passed with COSC / tooling standards"
          ],
          qrCodeUrl: `https://aniva.in/verify/${verificationId}`,
          status: "VERIFIED"
        };

        setCertificates((prev) => ({ ...prev, [verificationId]: newCert }));

        // Add to active product catalog
        const newProduct: Product = {
          id: newCert.productId,
          name: newCert.productName,
          slug: `${sub.brand}-${sub.model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          category: sub.category === "Watches" ? "Pre-Owned Watches" : "Pre-Owned Shoes",
          brand: sub.brand,
          price: sub.askingPrice,
          originalPrice: sub.originalPrice,
          description: `ANIVA Verified Pre-Owned ${sub.brand} ${sub.model}. Complete with tamper-proof certificate #${verificationId}.`,
          details: [
            `Condition: Grade ${sub.condition}`,
            `Serial/Ref: ${newCert.serialNumber}`,
            `Verification ID: ${verificationId}`,
            `Box: ${sub.hasBox ? "Yes" : "No"}, Papers: ${sub.hasPapers ? "Yes" : "No"}`
          ],
          sizes: sub.category === "Watches" ? ["40mm Case"] : ["UK 9"],
          colors: [{ name: "Original", hex: "#0D0D0D" }],
          images: sub.photos.map((p) => p.url).length > 0 ? sub.photos.map((p) => p.url) : [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"
          ],
          rating: 5.0,
          reviewCount: 1,
          inStock: true,
          stockCount: 1,
          isNewArrival: true,
          isTrending: true,
          isPreOwned: true,
          conditionGrade: sub.condition,
          verificationId,
          verificationDate: newCert.verifiedDate,
          serialNumber: newCert.serialNumber,
          hasBox: sub.hasBox,
          hasPapers: sub.hasPapers,
          hasInvoice: sub.hasInvoice,
          isVerified: true,
          sellerType: "Private Collector",
          sellerName: sub.sellerName,
          estimatedMarketRange: sub.aiMarketRange,
          tags: ["pre-owned", "verified", sub.brand.toLowerCase()]
        };

        setProducts((prev) => [newProduct, ...prev]);
        showToast(`Verification ID ${verificationId} generated and listed live!`, "success");
      }
    }
  };

  const lookupCertificate = (verificationId: string): VerificationCertificate | null => {
    const cleanId = verificationId.trim().toUpperCase();
    return certificates[cleanId] || null;
  };

  // Retailer application actions
  const addRetailerApplication = (
    appData: Omit<RetailerApplication, "id" | "appliedAt" | "status" | "commissionRate">
  ): RetailerApplication => {
    const newId = "RET-APP-" + Math.floor(100 + Math.random() * 900);
    const newApp: RetailerApplication = {
      ...appData,
      id: newId,
      status: "PENDING_REVIEW",
      appliedAt: new Date().toISOString(),
      commissionRate: 18
    };

    setRetailerApplications((prev) => [newApp, ...prev]);
    showToast(`Retailer KYC application #${newId} submitted for compliance review!`, "success");
    return newApp;
  };

  const updateRetailerStatus = (appId: string, status: RetailerApplication["status"]) => {
    setRetailerApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status } : app))
    );
    showToast(`Retailer application #${appId} status updated to ${status}`, "info");
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        setProducts,
        activePage,
        setActivePage,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        setSelectedProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        filterState,
        setFilterState,
        resetFilters,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        toasts,
        showToast,
        userOrders,
        addOrder,
        searchQuery,
        setSearchQuery,
        isAdmin,
        setIsAdmin,
        adminRole,
        setAdminRole,
        reviews,
        addReview,
        refreshProducts,
        preOwnedSubmissions,
        addPreOwnedSubmission,
        updateSubmissionStatus,
        isSellItemModalOpen,
        setIsSellItemModalOpen,
        certificates,
        activeCertificate,
        setActiveCertificate,
        lookupCertificate,
        retailerApplications,
        addRetailerApplication,
        updateRetailerStatus,
        isAiAssistantOpen,
        setIsAiAssistantOpen
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
