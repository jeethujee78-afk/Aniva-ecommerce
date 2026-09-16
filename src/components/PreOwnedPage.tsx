import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { ProductCard } from "./ProductCard";
import { CONDITION_GRADES } from "../data/initialData";
import { ConditionGrade } from "../types";
import { 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  Watch, 
  Footprints, 
  ArrowRight, 
  Lock, 
  RefreshCw,
  QrCode
} from "lucide-react";

export const PreOwnedPage: React.FC = () => {
  const { 
    products, 
    setIsSellItemModalOpen, 
    lookupCertificate, 
    setActiveCertificate, 
    showToast 
  } = useShop();

  const [selectedSubCategory, setSelectedSubCategory] = useState<"ALL" | "WATCHES" | "SHOES">("ALL");
  const [selectedGrade, setSelectedGrade] = useState<ConditionGrade | "ALL">("ALL");
  const [brandFilter, setBrandFilter] = useState<string>("ALL");
  const [certSearch, setCertSearch] = useState<string>("");

  // Filter products for pre-owned inventory
  const preOwnedProducts = products.filter((p) => {
    if (!p.isPreOwned) return false;
    if (selectedSubCategory === "WATCHES" && p.category !== "Pre-Owned Watches") return false;
    if (selectedSubCategory === "SHOES" && p.category !== "Pre-Owned Shoes") return false;
    if (selectedGrade !== "ALL" && p.conditionGrade !== selectedGrade) return false;
    if (brandFilter !== "ALL" && p.brand !== brandFilter) return false;
    return true;
  });

  const uniqueBrands = Array.from(new Set(products.filter(p => p.isPreOwned).map(p => p.brand)));

  const handleCertLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certSearch.trim()) return;

    const cert = lookupCertificate(certSearch.trim());
    if (cert) {
      setActiveCertificate(cert);
    } else {
      showToast(`No certificate record found for ID "${certSearch}". Please check spelling.`, "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F8F6F2] pt-24 pb-20 font-sans">
      {/* Luxury Hero Banner */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <div className="relative rounded-3xl overflow-hidden border border-[#C9A86A]/40 bg-gradient-to-r from-[#14120E] via-[#1A1610] to-[#0D0D0D] p-8 sm:p-14 shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A86A]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A86A]/15 border border-[#C9A86A]/40 text-[#C9A86A] text-xs font-mono tracking-widest uppercase">
              <ShieldCheck className="w-4 h-4" /> ANIVA PRE-OWNED & VERIFIED
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Authenticated. Verified. <br />
              <span className="text-[#C9A86A] italic">Ready to Own.</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-2xl">
              Every branded timepiece and collectible shoe undergoes multi-point inspection. Accompanied by the ANIVA Verified Certificate and QR Verification Record.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => setIsSellItemModalOpen(true)}
                className="bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sell Your Item</span>
              </button>

              <button
                onClick={() => {
                  const cert = lookupCertificate("ANV-VER-2026-000842");
                  if (cert) setActiveCertificate(cert);
                }}
                className="bg-[#1A1A1A] hover:bg-[#252525] border border-[#C9A86A]/40 text-[#C9A86A] font-mono px-5 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>View Sample Certificate</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Provenance Ledger Pillars */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#C9A86A]/10 border border-[#C9A86A]/30 flex items-center justify-center text-[#C9A86A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Multi-Point Inspection</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every item is screened with multi-angle verification and physical evidence review before listing.
            </p>
          </div>

          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#C9A86A]/10 border border-[#C9A86A]/30 flex items-center justify-center text-[#C9A86A]">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">QR Verification Record</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Each piece receives an ANIVA Verified Certificate with public QR code lookup.
            </p>
          </div>

          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#C9A86A]/10 border border-[#C9A86A]/30 flex items-center justify-center text-[#C9A86A]">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Protected Payment</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Buyer funds are secured until delivery confirmation and buyer review.
            </p>
          </div>

          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#C9A86A]/10 border border-[#C9A86A]/30 flex items-center justify-center text-[#C9A86A]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Authenticity Commitment</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Clear provenance, transparent condition grading, and documented physical accompaniments.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Condition Grading Spectrum Guide */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#222222] pb-4">
            <div>
              <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A] block">
                ANIVA TRANSPARENCY STANDARD [PROPOSED]
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Condition Grading Matrix (Grades S to C)
              </h2>
            </div>
            <p className="text-xs text-neutral-400 max-w-md">
              We eliminate guesswork with standardized grading criteria applied to every pre-owned listing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(["S", "A", "B", "C"] as ConditionGrade[]).map((g) => {
              const info = CONDITION_GRADES[g];
              return (
                <div key={g} className="bg-[#181818] border border-[#262626] rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase border ${info.badgeColor}`}>
                      Grade {g}
                    </span>
                    <span className="text-xs font-bold text-white">{info.title}</span>
                  </div>
                  <p className="text-xs text-neutral-300 pt-1 leading-relaxed">
                    {info.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Passport Verification Search Bar */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <div className="bg-[#161412] border border-[#C9A86A]/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-serif text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C9A86A]" />
              Verify an ANIVA Verification Record
            </h3>
            <p className="text-xs text-neutral-400">
              Have an ANIVA Certificate ID? Enter it below to inspect the verified record and product specifications.
            </p>
          </div>

          <form onSubmit={handleCertLookup} className="flex w-full md:w-auto gap-2">
            <input
              type="text"
              placeholder="e.g. ANV-VER-2026-000842"
              value={certSearch}
              onChange={(e) => setCertSearch(e.target.value)}
              className="bg-[#1F1F1F] border border-[#333333] rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C9A86A] font-mono w-full sm:w-64"
            />
            <button
              type="submit"
              className="bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-mono cursor-pointer transition-colors shrink-0"
            >
              Verify
            </button>
          </form>
        </div>
      </section>

      {/* Filter Tabs & Collection Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[#222222] pb-6">
          {/* Subcategory Toggles */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedSubCategory("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                selectedSubCategory === "ALL"
                  ? "bg-[#C9A86A] text-[#0D0D0D] font-bold"
                  : "bg-[#181818] text-neutral-400 hover:text-white"
              }`}
            >
              All Vault Pieces ({products.filter(p => p.isPreOwned).length})
            </button>

            <button
              onClick={() => setSelectedSubCategory("WATCHES")}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                selectedSubCategory === "WATCHES"
                  ? "bg-[#C9A86A] text-[#0D0D0D] font-bold"
                  : "bg-[#181818] text-neutral-400 hover:text-white"
              }`}
            >
              <Watch className="w-3.5 h-3.5" />
              <span>Luxury Watches</span>
            </button>

            <button
              onClick={() => setSelectedSubCategory("SHOES")}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                selectedSubCategory === "SHOES"
                  ? "bg-[#C9A86A] text-[#0D0D0D] font-bold"
                  : "bg-[#181818] text-neutral-400 hover:text-white"
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Collector Shoes</span>
            </button>
          </div>

          {/* Quick Filter Drops */}
          <div className="flex items-center gap-3">
            {/* Grade Filter */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as ConditionGrade | "ALL")}
              className="bg-[#181818] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-[#C9A86A] font-mono"
            >
              <option value="ALL">All Grades (S, A, B, C)</option>
              <option value="S">Grade S (Pristine)</option>
              <option value="A">Grade A (Excellent)</option>
              <option value="B">Grade B (Good)</option>
              <option value="C">Grade C (Fair)</option>
            </select>

            {/* Brand Filter */}
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="bg-[#181818] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-[#C9A86A] font-mono"
            >
              <option value="ALL">All Brands</option>
              {uniqueBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {preOwnedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {preOwnedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#141414] border border-[#262626] rounded-3xl space-y-4">
            <ShieldCheck className="w-12 h-12 text-[#C9A86A] mx-auto opacity-50" />
            <h3 className="font-serif text-xl font-bold text-white">No items matching selected filters</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Try adjusting the condition grade or brand filters to view all authenticated vault pieces.
            </p>
            <button
              onClick={() => {
                setSelectedSubCategory("ALL");
                setSelectedGrade("ALL");
                setBrandFilter("ALL");
              }}
              className="bg-[#1F1F1F] hover:bg-[#2A2A2A] text-[#C9A86A] border border-[#C9A86A]/40 font-mono text-xs px-5 py-2.5 rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
