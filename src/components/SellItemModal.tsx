import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { ConditionGrade } from "../types";
import { CONDITION_GRADES } from "../data/initialData";
import { 
  X, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Watch, 
  Footprints, 
  FileText, 
  Camera, 
  TrendingUp, 
  Info,
  Building
} from "lucide-react";

export const SellItemModal: React.FC = () => {
  const { isSellItemModalOpen, setIsSellItemModalOpen, addPreOwnedSubmission, showToast } = useShop();

  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<"Watches" | "Shoes">("Watches");
  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [condition, setCondition] = useState<ConditionGrade>("S");
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [askingPrice, setAskingPrice] = useState<string>("");

  // Accompaniments
  const [hasBox, setHasBox] = useState<boolean>(true);
  const [hasPapers, setHasPapers] = useState<boolean>(true);
  const [hasInvoice, setHasInvoice] = useState<boolean>(true);

  // Photos
  const [photos, setPhotos] = useState<{ angle: string; url: string }[]>([]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>("");

  // Seller info
  const [sellerName, setSellerName] = useState<string>("");
  const [sellerEmail, setSellerEmail] = useState<string>("");
  const [sellerPhone, setSellerPhone] = useState<string>("");
  const [sellerCity, setSellerCity] = useState<string>("Chennai");

  // AI Valuation State
  const [isValuating, setIsValuating] = useState<boolean>(false);
  const [aiEstimate, setAiEstimate] = useState<{
    min: number;
    max: number;
    suggested: number;
    confidence: "High" | "Medium" | "Low";
    factors: string[];
  } | null>(null);

  if (!isSellItemModalOpen) return null;

  const brandsList = category === "Watches" 
    ? ["Rolex", "Omega", "Grand Seiko", "Cartier", "Tudor", "Seiko", "Tag Heuer", "Breitling", "IWC Schaffhausen"]
    : ["Jordan", "Nike", "New Balance", "Adidas Yeezy", "Balenciaga", "Gucci", "Asics", "Salomon"];

  const watchAngles = ["Dial (Direct 12 o'clock)", "Caseback & Movement", "Crown & Side Profile", "Clasp & Serial Number", "Box & Papers Flatlay"];
  const shoeAngles = ["Lateral Profile (Left)", "Lateral Profile (Right)", "Sole / Tread Condition", "Tongue / Size Tag", "Box & Laces"];

  const runAiValuation = () => {
    setIsValuating(true);
    setTimeout(() => {
      const orig = Number(originalPrice) || (category === "Watches" ? 500000 : 35000);
      let multiplier = 0.85;

      if (brand.toLowerCase().includes("rolex") || brand.toLowerCase().includes("jordan")) {
        multiplier = 1.1; // Appreciates or holds strong value
      } else if (brand.toLowerCase().includes("omega") || brand.toLowerCase().includes("grand seiko")) {
        multiplier = 0.78;
      } else {
        multiplier = 0.72;
      }

      if (condition === "S") multiplier += 0.08;
      if (condition === "C") multiplier -= 0.15;
      if (hasBox && hasPapers) multiplier += 0.05;

      const suggested = Math.round(orig * multiplier);
      const minVal = Math.round(suggested * 0.93);
      const maxVal = Math.round(suggested * 1.07);

      const calculatedEstimate = {
        min: minVal,
        max: maxVal,
        suggested: suggested,
        confidence: (hasBox && hasPapers && (brand === "Rolex" || brand === "Omega" || brand === "Jordan")) ? "High" as const : "Medium" as const,
        factors: [
          `Condition Grade ${condition} retention curve calculated against 2026 secondary trade index`,
          hasBox && hasPapers ? "Full double box and original warranty papers boost valuation by +5%" : "Absence of complete papers factored into estimate range",
          `High demand for ${brand} across South Indian metro collectors (Chennai, Bengaluru, Hyderabad)`
        ]
      };

      setAiEstimate(calculatedEstimate);
      if (!askingPrice) {
        setAskingPrice(suggested.toString());
      }
      setIsValuating(false);
    }, 1000);
  };

  const handleAddSamplePhoto = (angle: string) => {
    const defaultSampleUrl = category === "Watches"
      ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
      : "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80";

    const newPhoto = { angle, url: customPhotoUrl.trim() || defaultSampleUrl };
    setPhotos(prev => [...prev.filter(p => p.angle !== angle), newPhoto]);
    setCustomPhotoUrl("");
    showToast(`Added photograph for ${angle}`, "info");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !askingPrice || !sellerName || !sellerPhone) {
      showToast("Please fill in all mandatory seller and product details.", "error");
      return;
    }

    addPreOwnedSubmission({
      category,
      brand,
      model,
      referenceNumber,
      condition,
      originalPrice: Number(originalPrice) || Number(askingPrice),
      askingPrice: Number(askingPrice),
      aiSuggestedPrice: aiEstimate?.suggested,
      aiMarketRange: aiEstimate ? { min: aiEstimate.min, max: aiEstimate.max } : undefined,
      aiConfidence: aiEstimate?.confidence,
      hasBox,
      hasPapers,
      hasInvoice,
      photos: photos.length > 0 ? photos : [
        { 
          angle: "Overview", 
          url: category === "Watches"
            ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
            : "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80" 
        }
      ],
      sellerName,
      sellerEmail: sellerEmail || "client@aniva.in",
      sellerPhone,
      sellerCity
    });

    setIsSellItemModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#121212] border border-[#C9A86A]/40 rounded-3xl p-6 sm:p-8 text-[#F8F6F2] shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={() => setIsSellItemModalOpen(false)}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white bg-[#1F1F1F] p-2 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pb-6 border-b border-[#262626]">
          <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A] bg-[#C9A86A]/10 px-3 py-1 rounded-full border border-[#C9A86A]/20">
            ANIVA PRE-OWNED SUBMISSION [DEMO DATA]
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Sell Your Item
          </h2>
          <p className="text-xs text-neutral-400 font-light max-w-xl mx-auto">
            Submit your pre-owned timepiece or collectible footwear for ANIVA Verification and secondary market listing.
          </p>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step === s ? "w-8 bg-[#C9A86A]" : step > s ? "w-4 bg-emerald-500" : "w-4 bg-[#262626]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Category & Brand */}
        {step === 1 && (
          <div className="py-6 space-y-6 animate-fadeIn">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#C9A86A]">
              Step 1: Select Category & Brand
            </h3>

            {/* Category Toggle */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setCategory("Watches");
                  setBrand("");
                }}
                className={`p-5 rounded-2xl border flex flex-col items-center gap-3 transition-all cursor-pointer ${
                  category === "Watches"
                    ? "bg-[#1F1910] border-[#C9A86A] text-[#C9A86A]"
                    : "bg-[#181818] border-[#2A2A2A] text-neutral-400 hover:border-neutral-600"
                }`}
              >
                <Watch className="w-8 h-8" />
                <span className="font-bold text-sm">Luxury Watches</span>
                <span className="text-2xs text-neutral-400 text-center">Omega, Rolex, Grand Seiko, Cartier, etc.</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory("Shoes");
                  setBrand("");
                }}
                className={`p-5 rounded-2xl border flex flex-col items-center gap-3 transition-all cursor-pointer ${
                  category === "Shoes"
                    ? "bg-[#1F1910] border-[#C9A86A] text-[#C9A86A]"
                    : "bg-[#181818] border-[#2A2A2A] text-neutral-400 hover:border-neutral-600"
                }`}
              >
                <Footprints className="w-8 h-8" />
                <span className="font-bold text-sm">Branded Grails & Shoes</span>
                <span className="text-2xs text-neutral-400 text-center">Jordans, Yeezys, New Balance 990, Balenciaga</span>
              </button>
            </div>

            {/* Brand Selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-300">Select Brand *</label>
              <div className="grid grid-cols-3 gap-2">
                {brandsList.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrand(b)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                      brand === b
                        ? "bg-[#C9A86A] text-[#0D0D0D] border-[#C9A86A] font-bold"
                        : "bg-[#181818] border-[#2A2A2A] text-neutral-300 hover:border-[#C9A86A]/50"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Name & Ref */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-300">Model Name *</label>
                <input
                  type="text"
                  placeholder={category === "Watches" ? "e.g. Speedmaster Moonwatch 42mm" : "e.g. Air Jordan 1 Chicago"}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C9A86A]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-300">Reference / Style Code</label>
                <input
                  type="text"
                  placeholder={category === "Watches" ? "e.g. 310.30.42.50.01.001" : "e.g. DZ5485-612"}
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C9A86A]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                disabled={!brand || !model}
                onClick={() => setStep(2)}
                className="bg-[#C9A86A] disabled:opacity-50 hover:bg-[#b89558] text-[#0D0D0D] font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>Continue to Condition</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Condition & Accompaniments */}
        {step === 2 && (
          <div className="py-6 space-y-6 animate-fadeIn">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#C9A86A]">
              Step 2: Condition Grading & Provenance Checklist
            </h3>

            {/* Condition Grade Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(["S", "A", "B", "C"] as ConditionGrade[]).map((g) => {
                const info = CONDITION_GRADES[g];
                const isSelected = condition === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setCondition(g)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1F1910] border-[#C9A86A]"
                        : "bg-[#181818] border-[#2A2A2A] hover:border-neutral-600"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1">
                      <span className={`px-2 py-0.5 rounded text-2xs font-mono font-bold uppercase border ${info.badgeColor}`}>
                        Grade {g}
                      </span>
                      <span className="text-xs font-bold text-white">{info.title}</span>
                    </div>
                    <p className="text-2xs text-neutral-400 pt-1 leading-relaxed">{info.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Provenance Accompaniments Checklist */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-mono text-neutral-300">Accompaniments & Proof Included</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-3 bg-[#181818] p-3 rounded-xl border border-[#2A2A2A] cursor-pointer hover:border-neutral-600">
                  <input
                    type="checkbox"
                    checked={hasBox}
                    onChange={(e) => setHasBox(e.target.checked)}
                    className="accent-[#C9A86A] w-4 h-4"
                  />
                  <span className="text-xs text-neutral-200">Original Box</span>
                </label>

                <label className="flex items-center gap-3 bg-[#181818] p-3 rounded-xl border border-[#2A2A2A] cursor-pointer hover:border-neutral-600">
                  <input
                    type="checkbox"
                    checked={hasPapers}
                    onChange={(e) => setHasPapers(e.target.checked)}
                    className="accent-[#C9A86A] w-4 h-4"
                  />
                  <span className="text-xs text-neutral-200">Warranty Papers / Card</span>
                </label>

                <label className="flex items-center gap-3 bg-[#181818] p-3 rounded-xl border border-[#2A2A2A] cursor-pointer hover:border-neutral-600">
                  <input
                    type="checkbox"
                    checked={hasInvoice}
                    onChange={(e) => setHasInvoice(e.target.checked)}
                    className="accent-[#C9A86A] w-4 h-4"
                  />
                  <span className="text-xs text-neutral-200">Original Purchase Receipt</span>
                </label>
              </div>
            </div>

            {/* Original Purchase Price */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-neutral-300">Original Retail / Purchase Price (₹)</label>
              <input
                type="number"
                placeholder="e.g. 520000"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C9A86A]"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-[#181818] hover:bg-[#222222] text-neutral-300 font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>Continue to Photo Guide</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Guided Photography Uploads */}
        {step === 3 && (
          <div className="py-6 space-y-6 animate-fadeIn">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#C9A86A] flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Step 3: Studio Guided Photographs ({category})
            </h3>
            <p className="text-xs text-neutral-400">
              Clear, macro photographs ensure faster laboratory verification and higher price realization.
            </p>

            {/* Suggested Angles */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(category === "Watches" ? watchAngles : shoeAngles).map((ang) => {
                  const uploaded = photos.find((p) => p.angle === ang);
                  return (
                    <div
                      key={ang}
                      className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-3 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-white block">{ang}</span>
                        <span className="text-2xs text-neutral-400 font-mono">
                          {uploaded ? "✓ Photo uploaded" : "Required angle"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddSamplePhoto(ang)}
                        className={`text-2xs font-mono px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                          uploaded
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                            : "bg-[#222222] text-[#C9A86A] border-[#C9A86A]/40 hover:bg-[#C9A86A] hover:text-black"
                        }`}
                      >
                        {uploaded ? "Replace" : "+ Add Photo"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Photo URL Input */}
            <div className="space-y-1 bg-[#151515] p-3.5 rounded-xl border border-[#262626]">
              <label className="text-2xs font-mono uppercase tracking-wider text-neutral-400">
                Or paste direct image URL for your upload:
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={customPhotoUrl}
                onChange={(e) => setCustomPhotoUrl(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-[#181818] hover:bg-[#222222] text-neutral-300 font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  runAiValuation();
                  setStep(4);
                }}
                className="bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run ANIVA Value AI</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: ANIVA Value AI Market Estimation */}
        {step === 4 && (
          <div className="py-6 space-y-6 animate-fadeIn">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#C9A86A] flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Step 4: ANIVA Value AI Market Assessment
            </h3>

            {isValuating ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 border-2 border-[#C9A86A] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-mono text-xs text-[#C9A86A]">
                  Analyzing secondary market demand, condition decay models, and recent South Indian transaction signals...
                </p>
              </div>
            ) : aiEstimate ? (
              <div className="space-y-6">
                {/* Valuation Metrics Box */}
                <div className="bg-gradient-to-b from-[#1C1812] to-[#141414] border border-[#C9A86A]/50 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#2A2A2A] pb-4">
                    <div>
                      <span className="text-2xs font-mono uppercase tracking-widest text-neutral-400 block">
                        Estimated Secondary Market Range
                      </span>
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                        ₹{aiEstimate.min.toLocaleString()} — ₹{aiEstimate.max.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xs font-mono uppercase tracking-widest text-neutral-400 block">
                        Valuation Confidence
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {aiEstimate.confidence} Confidence
                      </span>
                    </div>
                  </div>

                  {/* AI Value Factors */}
                  <div className="space-y-2">
                    <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A] block">
                      Valuation Reasoning & Signals:
                    </span>
                    <ul className="space-y-1.5 text-xs text-neutral-300">
                      {aiEstimate.factors.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A86A] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Safety Disclaimer */}
                  <div className="bg-[#121212] p-3 rounded-xl border border-[#2A2A2A] flex items-start gap-2.5 text-2xs text-neutral-400 leading-relaxed">
                    <Info className="w-4 h-4 text-[#C9A86A] shrink-0 mt-0.5" />
                    <span>
                      <strong>ANIVA Safety Note:</strong> AI estimations serve as non-binding pricing guidance. Final verified listing price is decided by you, subject to ANIVA physical laboratory inspection and authenticity clearance.
                    </span>
                  </div>
                </div>

                {/* Asking Price Input */}
                <div className="space-y-2 bg-[#181818] p-4 rounded-xl border border-[#2A2A2A]">
                  <label className="text-xs font-mono text-white block">
                    Your Asking Listing Price (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-neutral-400 font-mono">₹</span>
                    <input
                      type="number"
                      value={askingPrice}
                      onChange={(e) => setAskingPrice(e.target.value)}
                      className="w-full bg-[#121212] border border-[#333333] rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono text-[#C9A86A] font-bold focus:outline-none focus:border-[#C9A86A]"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-[#181818] hover:bg-[#222222] text-neutral-300 font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    disabled={!askingPrice}
                    onClick={() => setStep(5)}
                    className="bg-[#C9A86A] disabled:opacity-50 hover:bg-[#b89558] text-[#0D0D0D] font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                  >
                    <span>Final Step: Seller Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Step 5: Seller Contact & Submission */}
        {step === 5 && (
          <form onSubmit={handleSubmit} className="py-6 space-y-6 animate-fadeIn">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#C9A86A] flex items-center gap-2">
              <Building className="w-4 h-4" />
              Step 5: Seller Contact & Atelier Logistics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-300">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya V."
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-300">Phone Number (WhatsApp for OTP) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98400 12345"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-300">Email Address</label>
                <input
                  type="email"
                  placeholder="seller@example.com"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-300">Pickup City (South India First)</label>
                <select
                  value={sellerCity}
                  onChange={(e) => setSellerCity(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C9A86A]"
                >
                  <option value="Chennai">Chennai, Tamil Nadu</option>
                  <option value="Bengaluru">Bengaluru, Karnataka</option>
                  <option value="Hyderabad">Hyderabad, Telangana</option>
                  <option value="Kochi">Kochi, Kerala</option>
                  <option value="Coimbatore">Coimbatore, Tamil Nadu</option>
                  <option value="Visakhapatnam">Visakhapatnam, Andhra Pradesh</option>
                  <option value="Pan-India">Other Metro (Pan-India)</option>
                </select>
              </div>
            </div>

            {/* Submission Summary Pill */}
            <div className="bg-[#181818] p-4 rounded-2xl border border-[#C9A86A]/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Consignment Item:</span>
                <span className="font-bold text-white">{brand} {model}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Condition Grade:</span>
                <span className="font-mono text-[#C9A86A] font-bold">Grade {condition} ({CONDITION_GRADES[condition].title})</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Your Listed Asking Price:</span>
                <span className="font-mono text-emerald-400 font-bold">₹{Number(askingPrice || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-[#262626] pt-2">
                <span className="text-neutral-400">Estimated Net Payout (after 18% commission):</span>
                <span className="font-mono text-white font-bold">₹{Math.round(Number(askingPrice || 0) * 0.82).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="bg-[#181818] hover:bg-[#222222] text-neutral-300 font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-xl transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit to ANIVA Atelier</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
