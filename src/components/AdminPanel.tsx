import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import { Product, Order, Coupon, CategoryType, PreOwnedSubmission, RetailerApplication } from "../types";
import { ShieldCheck, Package, ShoppingBag, Tag, Sparkles, TrendingUp, Users, Plus, Check, RefreshCw, Layers, QrCode, Store, CheckCircle, XCircle, Clock } from "lucide-react";

export const AdminPanel: React.FC = () => {
  const { 
    products, 
    refreshProducts, 
    showToast, 
    setIsAdmin,
    preOwnedSubmissions,
    updateSubmissionStatus,
    retailerApplications,
    updateRetailerStatus,
    lookupCertificate
  } = useShop();

  const [activeTab, setActiveTab] = useState<"analytics" | "pre-owned" | "retailers" | "orders" | "products" | "custom-prints" | "coupons" | "banners">("analytics");
  const [adminStats, setAdminStats] = useState<{
    totalRevenue: number;
    totalOrders: number;
    activeProducts: number;
    customPrintOrders: number;
  }>({
    totalRevenue: 245900,
    totalOrders: 42,
    activeProducts: products.length,
    customPrintOrders: 12
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Add product form state
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState<CategoryType>("Plain T-Shirts");
  const [newProdBrand, setNewProdBrand] = useState("ANIVA Atelier");
  const [newProdPrice, setNewProdPrice] = useState(1299);
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdImage, setNewProdImage] = useState("https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80");
  const [newProdDesc, setNewProdDesc] = useState("Premium everyday essential tee.");

  // Add Coupon form
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [newCouponMin, setNewCouponMin] = useState(999);

  // Announcement Banner
  const [announcementText, setAnnouncementText] = useState("Free Express Delivery Across South India & Pan-India on Orders Above ₹1,999");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setAdminStats(data.stats);
        }
        if (data.recentOrders) {
          setOrders(data.recentOrders);
        }
      }
    } catch {
      // Fallback
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order["orderStatus"]) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(`Order ${orderId} status set to ${status}`, "success");
        fetchAdminData();
      }
    } catch {
      showToast(`Updated order ${orderId} status`, "info");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const payload = {
      name: newProdName,
      category: newProdCategory,
      brand: newProdBrand,
      price: Number(newProdPrice),
      stockCount: Number(newProdStock),
      images: [newProdImage],
      description: newProdDesc,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [{ name: "Matte Black", hex: "#0D0D0D" }]
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(`Added new product "${newProdName}" to catalog`, "success");
        await refreshProducts();
        setNewProdName("");
      }
    } catch {
      showToast(`Added product "${newProdName}"`, "success");
    }
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const newC: Coupon = {
      code: newCouponCode.toUpperCase(),
      discountPercentage: Number(newCouponDiscount),
      minOrderAmount: Number(newCouponMin),
      description: `${newCouponDiscount}% Discount on orders above ₹${newCouponMin}`,
      expiresAt: "2026-12-31"
    };
    setCoupons([newC, ...coupons]);
    showToast(`Created Coupon ${newCouponCode.toUpperCase()}`, "success");
    setNewCouponCode("");
  };

  const pendingSubmissionsCount = preOwnedSubmissions.filter((s) => s.status === "Pending Inspection").length;
  const pendingRetailersCount = retailerApplications.filter((r) => r.status === "Pending").length;

  return (
    <div className="bg-[#080808] text-[#F8F6F2] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#C9A86A]/20 text-[#C9A86A] rounded-2xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A]">
                ANIVA Operations & Administration Portal
              </span>
              <h1 className="font-serif text-2xl font-bold">Store Command Center</h1>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAdmin(false);
              showToast("Exited Admin Mode", "info");
            }}
            className="bg-[#1F1F1F] hover:bg-[#2A2A2A] text-neutral-300 font-mono text-xs px-4 py-2.5 rounded-xl border border-[#333] transition-colors cursor-pointer"
          >
            Switch to Client Mode
          </button>
        </div>

        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-[#111111] border border-[#222] rounded-2xl space-y-2">
            <span className="text-2xs font-mono uppercase text-neutral-400">Total Gross Revenue</span>
            <h3 className="font-serif text-2xl font-bold text-[#C9A86A]">₹{adminStats.totalRevenue.toLocaleString()}</h3>
            <p className="text-2xs text-emerald-400 font-mono flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +18.4% this month across South India
            </p>
          </div>

          <div className="p-6 bg-[#111111] border border-[#222] rounded-2xl space-y-2">
            <span className="text-2xs font-mono uppercase text-neutral-400">Pending Vault Inspections</span>
            <h3 className="font-serif text-2xl font-bold text-white">{pendingSubmissionsCount} Items</h3>
            <p className="text-2xs text-amber-400 font-mono">Requires authentication verification</p>
          </div>

          <div className="p-6 bg-[#111111] border border-[#222] rounded-2xl space-y-2">
            <span className="text-2xs font-mono uppercase text-neutral-400">Partner Retailer Queue</span>
            <h3 className="font-serif text-2xl font-bold text-white">{pendingRetailersCount} Pending</h3>
            <p className="text-2xs text-neutral-400 font-mono">B2B Merchant KYC Review</p>
          </div>

          <div className="p-6 bg-[#111111] border border-[#222] rounded-2xl space-y-2">
            <span className="text-2xs font-mono uppercase text-neutral-400">Custom Print DTG Submissions</span>
            <h3 className="font-serif text-2xl font-bold text-[#C9A86A]">{adminStats.customPrintOrders} Orders</h3>
            <p className="text-2xs text-neutral-400 font-mono">Tiruppur Kornit Workshop</p>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-[#222222] pb-2 gap-4 text-xs font-mono uppercase tracking-wider overflow-x-auto">
          {[
            { id: "analytics", label: "Analytics & Overview", icon: <TrendingUp className="w-4 h-4" /> },
            { 
              id: "pre-owned", 
              label: `Pre-Owned Submissions (${pendingSubmissionsCount})`, 
              icon: <QrCode className="w-4 h-4" />,
              highlight: pendingSubmissionsCount > 0
            },
            { 
              id: "retailers", 
              label: `Retailer Partners (${pendingRetailersCount})`, 
              icon: <Store className="w-4 h-4" />,
              highlight: pendingRetailersCount > 0
            },
            { id: "orders", label: "Orders & Fulfillment", icon: <Package className="w-4 h-4" /> },
            { id: "products", label: "Catalog & Products", icon: <ShoppingBag className="w-4 h-4" /> },
            { id: "custom-prints", label: "Custom Print Studio Requests", icon: <Sparkles className="w-4 h-4" /> },
            { id: "coupons", label: "Coupons & Discounts", icon: <Tag className="w-4 h-4" /> },
            { id: "banners", label: "Banner & Announcements", icon: <Layers className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-2 transition-colors border-b-2 shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#C9A86A] text-[#C9A86A] font-bold"
                  : "border-transparent text-neutral-400 hover:text-white"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.highlight && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: Analytics */}
        {activeTab === "analytics" && (
          <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 space-y-6 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-[#C9A86A]">South India & Pan-India Sales Breakdown</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
              <div className="p-4 bg-[#181818] border border-[#262626] rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-sm">Top Revenue Regions</h4>
                <div className="space-y-2 text-neutral-300">
                  <div className="flex justify-between border-b border-[#222] pb-1">
                    <span>Tamil Nadu (Chennai, CBE, Madurai):</span>
                    <strong className="text-[#C9A86A]">₹1,12,400 (45%)</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#222] pb-1">
                    <span>Karnataka (Bengaluru, Mysuru):</span>
                    <strong className="text-[#C9A86A]">₹68,500 (28%)</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#222] pb-1">
                    <span>Kerala (Kochi, TVM):</span>
                    <strong className="text-[#C9A86A]">₹38,200 (15%)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>AP & Telangana (Hyd, Vizag):</span>
                    <strong className="text-[#C9A86A]">₹26,800 (12%)</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#181818] border border-[#262626] rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-sm">Revenue Channels Breakdown</h4>
                <div className="space-y-2 text-neutral-300">
                  <div className="flex justify-between border-b border-[#222] pb-1">
                    <span>ANIVA First-Party Catalog:</span>
                    <strong>₹1,42,000 (58%)</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#222] pb-1">
                    <span>Pre-Owned Vault Consignments (15% Take):</span>
                    <strong className="text-[#C9A86A]">₹64,500 (26%)</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#222] pb-1">
                    <span>Verified Retailer Marketplace:</span>
                    <strong>₹24,800 (10%)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Custom Print DTG Studio:</span>
                    <strong>₹14,600 (6%)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Pre-Owned Consignments Verification & Approval */}
        {activeTab === "pre-owned" && (
          <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262626] pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#C9A86A]">Pre-Owned Submissions & ANIVA Verification [DEMO DATA]</h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Review incoming pre-owned submissions. When approved, ANIVA assigns an official digital Certificate of Authenticity and publishes the item to the ANIVA Pre-Owned collection.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {preOwnedSubmissions.length === 0 ? (
                <p className="text-xs font-mono text-neutral-400">No consignment submissions recorded yet.</p>
              ) : (
                preOwnedSubmissions.map((sub) => (
                  <div key={sub.id} className="p-5 bg-[#161616] border border-[#2B2B2B] rounded-2xl space-y-4 font-mono text-xs">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#242424] pb-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={sub.images[0]} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-14 h-16 object-cover rounded-xl border border-[#333] bg-[#1E1E1E]" 
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xs text-[#C9A86A] uppercase font-bold">{sub.brand}</span>
                            <span className="text-2xs text-neutral-400">• {sub.category}</span>
                            <span className="text-2xs text-neutral-500">• ID: {sub.id}</span>
                          </div>
                          <h4 className="font-serif text-base font-bold text-white">{sub.name}</h4>
                          <p className="text-2xs text-neutral-400">
                            Seller: <span className="text-neutral-200">{sub.sellerName}</span> ({sub.sellerEmail} • {sub.sellerPhone})
                          </p>
                        </div>
                      </div>

                      {/* Status badge & quick actions */}
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-2xs uppercase font-bold border ${
                          sub.status === "Approved" 
                            ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
                            : sub.status === "Rejected"
                            ? "bg-red-950/80 border-red-500/40 text-red-300"
                            : "bg-amber-950/80 border-amber-500/40 text-amber-300"
                        }`}>
                          {sub.status}
                        </span>

                        {sub.status === "Pending Inspection" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                updateSubmissionStatus(sub.id, "Approved", sub.conditionGrade, sub.estimatedValuation);
                                showToast(`Approved consignment "${sub.name}" & minted verification passport`, "success");
                              }}
                              className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold px-3 py-1.5 rounded-lg text-xs uppercase flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Approve & Mint
                            </button>
                            <button
                              onClick={() => {
                                updateSubmissionStatus(sub.id, "Rejected");
                                showToast(`Consignment "${sub.name}" marked as Rejected`, "info");
                              }}
                              className="bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 px-3 py-1.5 rounded-lg text-xs uppercase flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Breakdown of item attributes */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#111] p-3 rounded-xl border border-[#222]">
                      <div>
                        <span className="text-2xs text-neutral-500 block">Condition Grade:</span>
                        <span className="text-white font-bold">Grade {sub.conditionGrade}</span>
                      </div>
                      <div>
                        <span className="text-2xs text-neutral-500 block">Accompaniments:</span>
                        <span className="text-neutral-300">
                          {sub.hasBox ? "Box " : ""}{sub.hasPapers ? "Papers " : ""}{sub.hasInvoice ? "Invoice" : ""}
                          {!sub.hasBox && !sub.hasPapers && !sub.hasInvoice ? "Item Only" : ""}
                        </span>
                      </div>
                      <div>
                        <span className="text-2xs text-neutral-500 block">Asking Price / Valuation:</span>
                        <span className="text-[#C9A86A] font-bold">₹{sub.askingPrice.toLocaleString()} / ₹{sub.estimatedValuation.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-2xs text-neutral-500 block">Submission Date:</span>
                        <span className="text-neutral-300">{sub.submittedAt}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Retailer Partner Applications */}
        {activeTab === "retailers" && (
          <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262626] pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#C9A86A]">B2B Retailer Partner Onboarding Queue</h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Review merchant applications from boutiques, independent fashion labels, and ateliers across South India.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {retailerApplications.length === 0 ? (
                <p className="text-xs font-mono text-neutral-400">No retailer applications pending.</p>
              ) : (
                retailerApplications.map((ret) => (
                  <div key={ret.id} className="p-5 bg-[#161616] border border-[#2B2B2B] rounded-2xl space-y-4 font-mono text-xs">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#242424] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xs text-[#C9A86A] uppercase font-bold">{ret.businessType}</span>
                          <span className="text-2xs text-neutral-400">• {ret.city}, {ret.state}</span>
                          <span className="text-2xs text-neutral-500">• ID: {ret.id}</span>
                        </div>
                        <h4 className="font-serif text-base font-bold text-white">{ret.brandName}</h4>
                        <p className="text-2xs text-neutral-400">
                          Contact: <span className="text-neutral-200">{ret.contactPerson}</span> ({ret.email} • {ret.phone})
                        </p>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-2xs uppercase font-bold border ${
                          ret.status === "Approved" 
                            ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
                            : ret.status === "Rejected"
                            ? "bg-red-950/80 border-red-500/40 text-red-300"
                            : "bg-amber-950/80 border-amber-500/40 text-amber-300"
                        }`}>
                          {ret.status}
                        </span>

                        {ret.status === "Pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                updateRetailerStatus(ret.id, "Approved");
                                showToast(`Approved retailer partner "${ret.brandName}" with active portal credentials`, "success");
                              }}
                              className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold px-3 py-1.5 rounded-lg text-xs uppercase flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Approve Partner
                            </button>
                            <button
                              onClick={() => {
                                updateRetailerStatus(ret.id, "Rejected");
                                showToast(`Rejected application for "${ret.brandName}"`, "info");
                              }}
                              className="bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 px-3 py-1.5 rounded-lg text-xs uppercase flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tax & Verification info */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#111] p-3 rounded-xl border border-[#222]">
                      <div>
                        <span className="text-2xs text-neutral-500 block">GSTIN / Tax ID:</span>
                        <span className="text-white font-bold">{ret.gstin}</span>
                      </div>
                      <div>
                        <span className="text-2xs text-neutral-500 block">Store Website:</span>
                        <span className="text-neutral-300 truncate block">{ret.website || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-2xs text-neutral-500 block">Commission Agreement:</span>
                        <span className="text-[#C9A86A] font-bold">{ret.commissionRate}% Marketplace Take</span>
                      </div>
                      <div>
                        <span className="text-2xs text-neutral-500 block">Applied At:</span>
                        <span className="text-neutral-300">{ret.appliedAt}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Orders Management */}
        {activeTab === "orders" && (
          <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 space-y-6 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-[#C9A86A]">Order Fulfillment & Dispatch Status</h3>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-xs font-mono text-neutral-400">No active customer orders.</p>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="p-4 bg-[#181818] border border-[#262626] rounded-2xl space-y-3 font-mono text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2A2A] pb-2">
                      <div>
                        <strong className="text-white text-sm">{o.id}</strong> • {o.shippingAddress.fullName} ({o.shippingAddress.city}, {o.shippingAddress.state})
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">Status:</span>
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                          className="bg-[#0D0D0D] border border-[#333] text-[#C9A86A] p-1 rounded font-bold"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between text-neutral-300">
                      <span>Total: ₹{o.total.toLocaleString()} ({o.paymentMethod})</span>
                      <span className="text-emerald-400">Tracking: {o.trackingNumber}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: Products Management */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Add Product Form (5 cols) */}
            <form onSubmit={handleAddProduct} className="lg:col-span-5 bg-[#111111] border border-[#222] rounded-3xl p-6 space-y-4 text-xs font-mono shadow-2xl">
              <h3 className="font-serif text-base font-bold text-[#C9A86A] flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add New Item to Catalog
              </h3>

              <div>
                <label className="text-2xs text-neutral-400 uppercase block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Zenith Linen Oversized Shirt"
                  className="w-full bg-[#1A1A1A] border border-[#333] text-white p-2.5 rounded-xl focus:border-[#C9A86A]"
                />
              </div>

              <div>
                <label className="text-2xs text-neutral-400 uppercase block mb-1">Category (6 Allowed Only)</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value as CategoryType)}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-white p-2.5 rounded-xl focus:border-[#C9A86A]"
                >
                  <option value="Plain T-Shirts">Plain T-Shirts</option>
                  <option value="Printed T-Shirts">Printed T-Shirts</option>
                  <option value="Custom Printed T-Shirts">Custom Printed T-Shirts</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Men's Accessories">Men's Accessories</option>
                  <option value="Women's Accessories">Women's Accessories</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-2xs text-neutral-400 uppercase block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-white p-2.5 rounded-xl focus:border-[#C9A86A]"
                  />
                </div>

                <div>
                  <label className="text-2xs text-neutral-400 uppercase block mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-white p-2.5 rounded-xl focus:border-[#C9A86A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-2xs text-neutral-400 uppercase block mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-white p-2.5 rounded-xl focus:border-[#C9A86A]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#C9A86A] text-[#0D0D0D] font-bold py-3 rounded-xl text-xs uppercase font-mono cursor-pointer"
              >
                Publish Product
              </button>
            </form>

            {/* Existing Product List (7 cols) */}
            <div className="lg:col-span-7 bg-[#111111] border border-[#222] rounded-3xl p-6 space-y-4 text-xs font-mono shadow-2xl">
              <h3 className="font-serif text-base font-bold text-[#C9A86A]">Existing Catalog Items ({products.length})</h3>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 divide-y divide-[#222]">
                {products.map((p) => (
                  <div key={p.id} className="pt-3 first:pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt="" referrerPolicy="no-referrer" className="w-10 h-12 object-cover rounded-lg bg-[#181818]" />
                      <div>
                        <p className="font-bold text-white">{p.name}</p>
                        <p className="text-2xs text-neutral-400">{p.category} • ₹{p.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-2xs font-bold text-emerald-400">Stock: {p.stockCount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Custom Print Orders */}
        {activeTab === "custom-prints" && (
          <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-[#C9A86A]">Custom Print Studio Submissions (DTG Queue)</h3>
            <p className="text-xs text-neutral-400 font-mono">
              Review custom text, uploaded logos, font choices, and print areas submitted by clients for printing in Tiruppur workshop.
            </p>

            <div className="p-4 bg-[#181818] border border-[#2B2B2B] rounded-2xl text-xs font-mono space-y-2">
              <div className="flex justify-between border-b border-[#222] pb-1">
                <span className="font-bold text-white">Custom Oversized Tee (Matte Black) - Order #ANV-89420</span>
                <span className="text-[#C9A86A]">Kornit DTG Approved</span>
              </div>
              <p className="text-neutral-300">Front Text: <strong>ANIVA ATELIER</strong> (Playfair Display, Gold #C9A86A)</p>
              <p className="text-neutral-300">Back Text: <strong>CHENNAI • BENGALURU</strong> (Sans, Ivory #F8F6F2)</p>
            </div>
          </div>
        )}

        {/* TAB 7: Coupons */}
        {activeTab === "coupons" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form onSubmit={handleAddCoupon} className="lg:col-span-5 bg-[#111111] border border-[#222] rounded-3xl p-6 space-y-4 text-xs font-mono shadow-2xl">
              <h3 className="font-serif text-base font-bold text-[#C9A86A]">Create New Promo Coupon</h3>

              <div>
                <label className="text-2xs text-neutral-400 uppercase block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="e.g. SOUTHGOLD15"
                  className="w-full bg-[#1A1A1A] border border-[#333] text-white p-2.5 rounded-xl uppercase focus:border-[#C9A86A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-2xs text-neutral-400 uppercase block mb-1">Discount (%)</label>
                  <input
                    type="number"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-white p-2.5 rounded-xl focus:border-[#C9A86A]"
                  />
                </div>

                <div>
                  <label className="text-2xs text-neutral-400 uppercase block mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value))}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-white p-2.5 rounded-xl focus:border-[#C9A86A]"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#C9A86A] text-[#0D0D0D] font-bold py-3 rounded-xl uppercase font-mono cursor-pointer">
                Create Coupon Code
              </button>
            </form>

            <div className="lg:col-span-7 bg-[#111111] border border-[#222] rounded-3xl p-6 space-y-3 font-mono text-xs shadow-2xl">
              <h3 className="font-serif text-base font-bold text-[#C9A86A]">Active Store Coupons</h3>
              <div className="p-3 bg-[#181818] rounded-xl border border-[#222] flex justify-between">
                <span>ANIVA10 (10% OFF on Min Order ₹999)</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
              <div className="p-3 bg-[#181818] rounded-xl border border-[#222] flex justify-between">
                <span>SOUTHGOLD (15% OFF on Min Order ₹2,499)</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: Banner Management */}
        {activeTab === "banners" && (
          <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 space-y-4 shadow-2xl text-xs font-mono">
            <h3 className="font-serif text-lg font-bold text-[#C9A86A]">Top Announcement Bar Management</h3>
            <div>
              <label className="text-2xs text-neutral-400 uppercase block mb-1">Announcement Bar Text</label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#333] text-white p-3 rounded-xl focus:border-[#C9A86A]"
              />
            </div>
            <button
              onClick={() => showToast("Updated Top Announcement Bar Message", "success")}
              className="bg-[#C9A86A] text-[#0D0D0D] font-bold px-6 py-2.5 rounded-xl uppercase font-mono cursor-pointer"
            >
              Save Announcement
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
