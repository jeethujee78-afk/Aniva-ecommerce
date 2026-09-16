import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { RetailerApplication, Product } from "../types";
import { 
  Building2, 
  TrendingUp, 
  Package, 
  DollarSign, 
  ShieldCheck, 
  FileCheck, 
  PlusCircle, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Sparkles,
  ShoppingBag,
  BarChart3,
  ExternalLink
} from "lucide-react";

export const RetailerPortal: React.FC = () => {
  const { 
    retailerApplications, 
    addRetailerApplication, 
    products, 
    setProducts, 
    showToast 
  } = useShop();

  const [activeTab, setActiveTab] = useState<"APPLY" | "DASHBOARD">("DASHBOARD");

  // Application Form State
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gstin, setGstin] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [brandCategory, setBrandCategory] = useState("Men's Footwear & Streetwear");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [hasAuthLetter, setHasAuthLetter] = useState(true);

  // New Merchant Product Creation Modal State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Men's Footwear");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("12");

  // Merchant Orders Mock
  const [merchantOrders, setMerchantOrders] = useState([
    {
      orderId: "ORD-2026-9041",
      customer: "Karthik R. (Bengaluru)",
      item: "Grand Horizon Chronometer",
      amount: 495000,
      commission: 89100,
      netPayout: 405900,
      status: "READY_FOR_PICKUP",
      awb: "BLUEDART-8890213"
    },
    {
      orderId: "ORD-2026-8812",
      customer: "Sneha M. (Chennai)",
      item: "Air Jordan 1 High OG Lost & Found",
      amount: 42000,
      commission: 7560,
      netPayout: 34440,
      status: "DISPATCHED",
      awb: "BLUEDART-7712399"
    }
  ]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !ownerName || !email || !phone || !gstin) {
      showToast("Please fill all mandatory business and tax identification fields.", "error");
      return;
    }

    addRetailerApplication({
      businessName,
      ownerName,
      email,
      phone,
      gstin: gstin.toUpperCase(),
      city,
      brandCategory,
      bankAccount,
      bankIfsc: bankIfsc.toUpperCase(),
      brandAuthorizationDoc: hasAuthLetter ? "https://aniva.in/docs/sample_auth_letter.pdf" : undefined
    });

    setActiveTab("DASHBOARD");
    showToast("Application submitted! Showing simulated retailer command center.", "success");
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) {
      showToast("Please enter product name and price.", "error");
      return;
    }

    const newProd: Product = {
      id: "RET-PROD-" + Date.now(),
      name: newProdName,
      slug: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: newProdCategory as any,
      brand: businessName || "Kavalar Luxury Goods",
      price: Number(newProdPrice),
      originalPrice: Number(newProdOriginalPrice) || Number(newProdPrice) * 1.2,
      description: `Curated partner collection item by ${businessName || "Kavalar Luxury Goods"}, fulfilled with ANIVA Quality Standard.`,
      details: ["100% Genuine Partner Stock", "Dispatched via ANIVA Express Logistics", "GST Invoice Included"],
      sizes: ["S", "M", "L", "XL"],
      colors: [{ name: "Matte Black", hex: "#0D0D0D" }],
      images: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
      ],
      rating: 4.9,
      reviewCount: 4,
      inStock: true,
      stockCount: Number(newProdStock) || 10,
      isNewArrival: true,
      sellerType: "Verified Retailer",
      sellerName: businessName || "Kavalar Luxury Goods",
      sellerId: "RET-001",
      tags: ["partner", "boutique"]
    };

    setProducts((prev) => [newProd, ...prev]);
    setIsAddingProduct(false);
    showToast(`Product "${newProdName}" added to live ANIVA storefront!`, "success");
  };

  const handleMarkDispatched = (orderId: string) => {
    setMerchantOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: "DISPATCHED" } : o))
    );
    showToast(`Order #${orderId} marked as dispatched. BlueDart courier tracking pinged.`, "success");
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F8F6F2] pt-24 pb-20 font-sans">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#222222] pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C9A86A]/10 border border-[#C9A86A]/40 rounded-full text-[#C9A86A] text-2xs font-mono tracking-widest uppercase">
              <Building2 className="w-3.5 h-3.5" /> ANIVA MERCHANT & RETAIL HUB
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white">
              B2B Partner Ecosystem & Merchant Console
            </h1>
            <p className="text-xs text-neutral-400">
              Direct access for certified boutiques and fashion houses across South India.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center bg-[#181818] p-1.5 rounded-2xl border border-[#2A2A2A]">
            <button
              onClick={() => setActiveTab("DASHBOARD")}
              className={`px-5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "DASHBOARD"
                  ? "bg-[#C9A86A] text-[#0D0D0D] font-bold shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Merchant Console
            </button>
            <button
              onClick={() => setActiveTab("APPLY")}
              className={`px-5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "APPLY"
                  ? "bg-[#C9A86A] text-[#0D0D0D] font-bold shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              KYC Onboarding
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === "DASHBOARD" ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Merchant Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase">
                  <span>Gross GMV (30D)</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-serif text-2xl font-bold text-white">₹5,37,000</div>
                <div className="text-2xs text-emerald-400 font-mono">+18.4% vs previous cycle</div>
              </div>

              <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase">
                  <span>Net Payout Settlement</span>
                  <TrendingUp className="w-4 h-4 text-[#C9A86A]" />
                </div>
                <div className="font-serif text-2xl font-bold text-[#C9A86A]">₹4,40,340</div>
                <div className="text-2xs text-neutral-400 font-mono">Next payout cycle: Friday (Auto-NEFT)</div>
              </div>

              <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase">
                  <span>Active Listings</span>
                  <Package className="w-4 h-4 text-sky-400" />
                </div>
                <div className="font-serif text-2xl font-bold text-white">24 SKUs</div>
                <div className="text-2xs text-neutral-400 font-mono">98% in-stock availability</div>
              </div>

              <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase">
                  <span>Commission Rate</span>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-serif text-2xl font-bold text-white">18.0%</div>
                <div className="text-2xs text-neutral-400 font-mono">Includes BlueDart Express + Escrow</div>
              </div>
            </div>

            {/* Merchant Quick Actions & Inventory Header */}
            <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#222222] pb-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-white">Partner Orders & Fulfillment Queue</h2>
                  <p className="text-xs text-neutral-400">
                    Dispatch items within 24 hours to maintain Tier-1 Partner status.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>List New Product</span>
                </button>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-[#262626] text-neutral-400 font-mono uppercase text-2xs">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer & Destination</th>
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3">Gross Total</th>
                      <th className="pb-3">Net Payout</th>
                      <th className="pb-3">Status / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222222]">
                    {merchantOrders.map((ord) => (
                      <tr key={ord.orderId} className="hover:bg-[#1A1A1A]">
                        <td className="py-4 font-mono text-[#C9A86A] font-bold">{ord.orderId}</td>
                        <td className="py-4 text-white font-medium">{ord.customer}</td>
                        <td className="py-4 text-neutral-300">{ord.item}</td>
                        <td className="py-4 font-mono font-bold text-white">₹{ord.amount.toLocaleString()}</td>
                        <td className="py-4 font-mono font-bold text-emerald-400">₹{ord.netPayout.toLocaleString()}</td>
                        <td className="py-4">
                          {ord.status === "READY_FOR_PICKUP" ? (
                            <button
                              onClick={() => handleMarkDispatched(ord.orderId)}
                              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-2xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Dispatch BlueDart</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-2xs font-mono text-neutral-400 bg-[#1A1A1A] px-2.5 py-1 rounded border border-[#333]">
                              <CheckCircle2 className="w-3 h-3 text-sky-400" /> Dispatched ({ord.awb})
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Product Modal (Inline) */}
            {isAddingProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className="bg-[#141414] border border-[#C9A86A]/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                    <h3 className="font-serif text-lg font-bold">List Partner Inventory Item</h3>
                    <button
                      onClick={() => setIsAddingProduct(false)}
                      className="text-neutral-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-neutral-300">Product Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Handmade Mysore Silk Overshirt"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-neutral-300">Retail Price (₹) *</label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 4500"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                          className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-neutral-300">Stock Qty</label>
                        <input
                          type="number"
                          value={newProdStock}
                          onChange={(e) => setNewProdStock(e.target.value)}
                          className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingProduct(false)}
                        className="bg-[#222] hover:bg-[#333] text-neutral-300 font-mono text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl cursor-pointer"
                      >
                        Publish to ANIVA
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* KYC Application Form */
          <div className="max-w-3xl mx-auto bg-[#141414] border border-[#262626] rounded-3xl p-6 sm:p-10 space-y-6 animate-fadeIn">
            <div className="space-y-2 border-b border-[#262626] pb-4">
              <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A] bg-[#C9A86A]/10 px-3 py-1 rounded-full border border-[#C9A86A]/20">
                MERCHANT ONBOARDING PROGRAM
              </span>
              <h2 className="font-serif text-2xl font-bold text-white">
                Apply for ANIVA Partner Boutique Status
              </h2>
              <p className="text-xs text-neutral-400">
                Sell your luxury apparel, footwear, and designer collections across South India with unified ANIVA logistics and 18% standard take-rate.
              </p>
            </div>

            <form onSubmit={handleApply} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Registered Business / Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kavalar Atelier Private Limited"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Authorized Representative Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arvind R."
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Corporate Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="partners@kavalar.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98400 55432"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">GSTIN Identification (Mandatory) *</label>
                  <input
                    type="text"
                    required
                    placeholder="33AAAAA0000A1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#C9A86A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Warehouse City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                  >
                    <option value="Bengaluru">Bengaluru, Karnataka</option>
                    <option value="Chennai">Chennai, Tamil Nadu</option>
                    <option value="Hyderabad">Hyderabad, Telangana</option>
                    <option value="Kochi">Kochi, Kerala</option>
                    <option value="Coimbatore">Coimbatore, Tamil Nadu</option>
                  </select>
                </div>
              </div>

              {/* Settlement Bank Details */}
              <div className="space-y-3 bg-[#181818] p-4 rounded-2xl border border-[#2A2A2A]">
                <span className="text-xs font-mono text-[#C9A86A] block uppercase tracking-wider">
                  Settlement & Escrow Bank Details:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-2xs font-mono text-neutral-400">Current Account Number *</label>
                    <input
                      type="text"
                      placeholder="987654321098"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="w-full bg-[#121212] border border-[#333] rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-2xs font-mono text-neutral-400">IFSC Code *</label>
                    <input
                      type="text"
                      placeholder="HDFC0001234"
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value)}
                      className="w-full bg-[#121212] border border-[#333] rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="space-y-2">
                <label className="flex items-start gap-3 bg-[#181818] p-3.5 rounded-xl border border-[#2A2A2A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAuthLetter}
                    onChange={(e) => setHasAuthLetter(e.target.checked)}
                    className="accent-[#C9A86A] w-4 h-4 mt-0.5"
                  />
                  <span className="text-xs text-neutral-300">
                    We certify that all listed goods are 100% authentic, covered by manufacturer/distributor warranties, and agree to the standard 18% ANIVA Marketplace take-rate.
                  </span>
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg transition-transform active:scale-95"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Submit KYC for Verification</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
