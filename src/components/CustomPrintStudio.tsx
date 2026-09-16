import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { CustomDesign, Product } from "../types";
import { Upload, Type, Sparkles, Move, RotateCcw, ShoppingBag, Eye, Layers, Palette, Check } from "lucide-react";

const BASE_TEES = [
  { name: "Matte Black", hex: "#0D0D0D", textContrast: "#F8F6F2" },
  { name: "Ivory White", hex: "#F8F6F2", textContrast: "#0D0D0D" },
  { name: "Sand Beige", hex: "#C8B9A6", textContrast: "#0D0D0D" },
  { name: "Deep Navy", hex: "#1A2530", textContrast: "#F8F6F2" }
];

const FONTS = [
  { name: "Playfair Display (Serif)", family: "'Playfair Display', serif" },
  { name: "Cinzel Luxury", family: "'Cinzel', serif" },
  { name: "Plus Jakarta Sans", family: "'Plus Jakarta Sans', sans-serif" },
  { name: "Monospace Code", family: "monospace" },
  { name: "Dravidian Calligraphy", family: "cursive" }
];

const EMBLEMS = [
  { id: "emb1", name: "ANIVA Gold Monogram", url: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=300&q=80" },
  { id: "emb2", name: "Heritage Dravidian Crest", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80" },
  { id: "emb3", name: "Minimalist Geometry", url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80" }
];

export const CustomPrintStudio: React.FC = () => {
  const { addToCart, showToast } = useShop();

  const [activeView, setActiveView] = useState<"front" | "back">("front");
  const [selectedBaseColor, setSelectedBaseColor] = useState(BASE_TEES[0]);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedFit, setSelectedFit] = useState<"Oversized Fit" | "Classic Fit" | "Slim Fit">("Oversized Fit");

  // Front Print Specs
  const [frontText, setFrontText] = useState("ANIVA ATELIER");
  const [frontFont, setFrontFont] = useState(FONTS[0].family);
  const [frontTextColor, setFrontTextColor] = useState("#C9A86A");
  const [frontTextSize, setFrontTextSize] = useState(24);
  const [frontArtworkUrl, setFrontArtworkUrl] = useState<string | undefined>(undefined);
  const [frontEmblem, setFrontEmblem] = useState<string | undefined>(undefined);

  // Back Print Specs
  const [backText, setBackText] = useState("CHENNAI • BENGALURU");
  const [backFont, setBackFont] = useState(FONTS[2].family);
  const [backTextColor, setBackTextColor] = useState("#F8F6F2");
  const [backTextSize, setBackTextSize] = useState(18);
  const [backArtworkUrl, setBackArtworkUrl] = useState<string | undefined>(undefined);

  // Active Tool Tab
  const [activeTab, setActiveTab] = useState<"text" | "upload" | "emblem">("text");

  // Calculate Price
  const basePrice = 999;
  const frontPrintFee = frontText || frontArtworkUrl || frontEmblem ? 200 : 0;
  const backPrintFee = backText || backArtworkUrl ? 200 : 0;
  const totalPrice = basePrice + frontPrintFee + backPrintFee;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (activeView === "front") {
          setFrontArtworkUrl(reader.result as string);
        } else {
          setBackArtworkUrl(reader.result as string);
        }
        showToast(`Uploaded ${file.name} to ${activeView} design layer`, "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    if (activeView === "front") {
      setFrontText("");
      setFrontArtworkUrl(undefined);
      setFrontEmblem(undefined);
    } else {
      setBackText("");
      setBackArtworkUrl(undefined);
    }
    showToast(`Reset ${activeView} design elements`, "info");
  };

  const handleAddToBag = () => {
    const customDesign: CustomDesign = {
      baseColor: selectedBaseColor.name,
      size: selectedSize,
      fit: selectedFit,
      frontText,
      frontFont,
      frontTextColor,
      frontTextSize,
      frontArtworkUrl,
      frontEmblem,
      backText,
      backFont,
      backTextColor,
      backTextSize,
      backArtworkUrl,
      calculatedPrice: totalPrice
    };

    const customProduct: Product = {
      id: "ANV-CUSTOM-" + Date.now(),
      name: `Custom ${selectedFit} Tee (${selectedBaseColor.name})`,
      slug: "custom-print-tee",
      category: "Custom Printed T-Shirts",
      brand: "ANIVA Custom Studio",
      price: totalPrice,
      description: `Custom printed t-shirt prototype. Base: ${selectedBaseColor.name}, Fit: ${selectedFit}. Custom printed graphic design. [PROPOSED DESIGN]`,
      details: [
        "Cotton t-shirt garment",
        "Direct digital garment print [PROPOSED]",
        "Configurable placement zones"
      ],
      sizes: [selectedSize],
      colors: [{ name: selectedBaseColor.name, hex: selectedBaseColor.hex }],
      images: ["/src/assets/images/aniva_custom_studio_1784879774954.jpg"],
      rating: 5.0,
      reviewCount: 1,
      inStock: true,
      stockCount: 50,
      tags: ["custom", "bespoke"]
    };

    addToCart(customProduct, selectedSize, { name: selectedBaseColor.name, hex: selectedBaseColor.hex }, 1, customDesign);
  };

  return (
    <div className="bg-[#0D0D0D] text-[#F8F6F2] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Studio Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A86A]/10 border border-[#C9A86A]/30 text-[#C9A86A] text-2xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Custom Print Studio [PROPOSED CONFIGURATION]</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F8F6F2]">
            Design Your ANIVA Tee
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light">
            Personalize your garment with custom graphics, typography, and live 2D canvas preview.
          </p>
        </div>

        {/* Studio Interactive Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Middle Column: Garment Visualizer Canvas (7 cols) */}
          <div className="lg:col-span-7 bg-[#121212] border border-[#222222] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between shadow-2xl relative min-h-[520px]">
            {/* View Switcher Tabs (Front vs Back) */}
            <div className="w-full flex items-center justify-between gap-4 border-b border-[#222222] pb-4">
              <div className="flex bg-[#1A1A1A] p-1 rounded-xl border border-[#2B2B2B]">
                <button
                  onClick={() => setActiveView("front")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                    activeView === "front" ? "bg-[#C9A86A] text-[#0D0D0D] font-bold shadow" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Front View
                </button>
                <button
                  onClick={() => setActiveView("back")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                    activeView === "back" ? "bg-[#C9A86A] text-[#0D0D0D] font-bold shadow" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Back View
                </button>
              </div>

              <button
                onClick={handleReset}
                className="text-xs text-neutral-400 hover:text-[#C9A86A] flex items-center gap-1 font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset View
              </button>
            </div>

            {/* Simulated Garment Canvas Mockup Area */}
            <div className="relative my-8 w-full max-w-md aspect-3/4 rounded-2xl flex items-center justify-center p-6 transition-all duration-300 shadow-2xl overflow-hidden border border-[#333]/40"
                 style={{ backgroundColor: selectedBaseColor.hex }}>
              
              {/* Garment Collar & Shoulder Vector Outline */}
              <div className="absolute top-0 w-36 h-12 border-b-2 border-x-2 border-black/20 rounded-b-full bg-transparent" />

              {/* Printable Area Box Guide */}
              <div className="relative z-10 w-full h-full border border-dashed border-neutral-400/30 rounded-xl p-4 flex flex-col items-center justify-center text-center overflow-hidden">
                {activeView === "front" ? (
                  <>
                    {/* Front Artwork Image */}
                    {frontArtworkUrl && (
                      <img src={frontArtworkUrl} alt="Custom Artwork" className="max-h-40 max-w-full object-contain mb-2 rounded shadow-md" />
                    )}

                    {/* Front Emblem */}
                    {frontEmblem && !frontArtworkUrl && (
                      <img src={frontEmblem} alt="Emblem" className="w-16 h-16 object-cover rounded-full border border-[#C9A86A] mb-2 shadow-lg" />
                    )}

                    {/* Front Custom Text */}
                    {frontText && (
                      <p
                        style={{
                          fontFamily: frontFont,
                          color: frontTextColor,
                          fontSize: `${frontTextSize}px`
                        }}
                        className="font-bold tracking-widest drop-shadow-md transition-all uppercase leading-tight select-none"
                      >
                        {frontText}
                      </p>
                    )}

                    {!frontText && !frontArtworkUrl && !frontEmblem && (
                      <span className="text-2xs font-mono uppercase text-neutral-400/60 flex items-center gap-1">
                        <Move className="w-3 h-3" /> Front Printable Zone (DTG)
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {/* Back Artwork Image */}
                    {backArtworkUrl && (
                      <img src={backArtworkUrl} alt="Back Artwork" className="max-h-48 max-w-full object-contain mb-2 rounded shadow-md" />
                    )}

                    {/* Back Custom Text */}
                    {backText && (
                      <p
                        style={{
                          fontFamily: backFont,
                          color: backTextColor,
                          fontSize: `${backTextSize}px`
                        }}
                        className="font-bold tracking-widest drop-shadow-md transition-all uppercase leading-tight select-none"
                      >
                        {backText}
                      </p>
                    )}

                    {!backText && !backArtworkUrl && (
                      <span className="text-2xs font-mono uppercase text-neutral-400/60 flex items-center gap-1">
                        <Move className="w-3 h-3" /> Back Printable Zone (DTG)
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Garment Base Color & Size Quick Selector */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#222222]">
              {/* Base Color Picker */}
              <div>
                <label className="text-2xs font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                  Garment Shade: <strong className="text-white">{selectedBaseColor.name}</strong>
                </label>
                <div className="flex items-center gap-3">
                  {BASE_TEES.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedBaseColor(t)}
                      style={{ backgroundColor: t.hex }}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        selectedBaseColor.name === t.name ? "border-[#C9A86A] ring-2 ring-[#C9A86A]/50 scale-110" : "border-neutral-600"
                      }`}
                      title={t.name}
                    />
                  ))}
                </div>
              </div>

              {/* Fit & Size */}
              <div>
                <label className="text-2xs font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                  Fit & Size:
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedFit}
                    onChange={(e) => setSelectedFit(e.target.value as any)}
                    className="bg-[#1A1A1A] border border-[#333] text-xs text-[#F8F6F2] py-1.5 px-2 rounded-lg font-mono focus:outline-none"
                  >
                    <option value="Oversized Fit">Oversized Fit</option>
                    <option value="Classic Fit">Classic Fit</option>
                    <option value="Slim Fit">Slim Fit</option>
                  </select>

                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="bg-[#1A1A1A] border border-[#333] text-xs text-[#F8F6F2] py-1.5 px-2 rounded-lg font-mono focus:outline-none"
                  >
                    {["S", "M", "L", "XL", "XXL", "3XL"].map((sz) => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls Panel (5 cols) */}
          <div className="lg:col-span-5 bg-[#121212] border border-[#222222] rounded-3xl p-6 space-y-6 shadow-2xl">
            {/* Tool Tabs Header */}
            <div className="flex border-b border-[#222222] pb-3 gap-4 text-xs font-mono uppercase tracking-wider">
              <button
                onClick={() => setActiveTab("text")}
                className={`flex items-center gap-1.5 pb-1 transition-colors border-b-2 ${
                  activeTab === "text" ? "border-[#C9A86A] text-[#C9A86A] font-bold" : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                <Type className="w-4 h-4" /> Text Tool
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex items-center gap-1.5 pb-1 transition-colors border-b-2 ${
                  activeTab === "upload" ? "border-[#C9A86A] text-[#C9A86A] font-bold" : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                <Upload className="w-4 h-4" /> Upload Artwork
              </button>
              <button
                onClick={() => setActiveTab("emblem")}
                className={`flex items-center gap-1.5 pb-1 transition-colors border-b-2 ${
                  activeTab === "emblem" ? "border-[#C9A86A] text-[#C9A86A] font-bold" : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-4 h-4" /> Emblems
              </button>
            </div>

            {/* Tab 1: Text Tool Controls */}
            {activeTab === "text" && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-2xs font-mono uppercase text-neutral-400 block mb-1">
                    {activeView === "front" ? "Front Custom Text" : "Back Custom Text"}
                  </label>
                  <input
                    type="text"
                    value={activeView === "front" ? frontText : backText}
                    onChange={(e) => activeView === "front" ? setFrontText(e.target.value) : setBackText(e.target.value)}
                    placeholder="Enter custom slogan, brand name, or typography..."
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl text-xs focus:border-[#C9A86A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-2xs font-mono uppercase text-neutral-400 block mb-1">Select Font Family</label>
                  <select
                    value={activeView === "front" ? frontFont : backFont}
                    onChange={(e) => activeView === "front" ? setFrontFont(e.target.value) : setBackFont(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2 rounded-xl text-xs focus:border-[#C9A86A]"
                  >
                    {FONTS.map((f, i) => (
                      <option key={i} value={f.family}>{f.name}</option>
                    ))}
                  </select>
                </div>

                {/* Font Color */}
                <div>
                  <label className="text-2xs font-mono uppercase text-neutral-400 block mb-1">Text Color</label>
                  <div className="flex items-center gap-2">
                    {["#C9A86A", "#F8F6F2", "#0D0D0D", "#B76E79", "#4A5240", "#2563EB"].map((col) => (
                      <button
                        key={col}
                        onClick={() => activeView === "front" ? setFrontTextColor(col) : setBackTextColor(col)}
                        style={{ backgroundColor: col }}
                        className={`w-6 h-6 rounded-full border ${
                          (activeView === "front" ? frontTextColor : backTextColor) === col ? "ring-2 ring-[#C9A86A]" : "border-neutral-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Font Size Slider */}
                <div>
                  <div className="flex items-center justify-between text-2xs font-mono text-neutral-400 mb-1">
                    <span>Font Size</span>
                    <span>{activeView === "front" ? frontTextSize : backTextSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="48"
                    value={activeView === "front" ? frontTextSize : backTextSize}
                    onChange={(e) => activeView === "front" ? setFrontTextSize(Number(e.target.value)) : setBackTextSize(Number(e.target.value))}
                    className="w-full accent-[#C9A86A]"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Upload Artwork */}
            {activeTab === "upload" && (
              <div className="space-y-4 text-xs">
                <p className="text-neutral-400 leading-relaxed">
                  Upload high-resolution transparent PNG, SVG, or JPG artwork for high-density Kornit DTG printing.
                </p>

                <label className="border-2 border-dashed border-[#333] hover:border-[#C9A86A] p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#161616]">
                  <Upload className="w-8 h-8 text-[#C9A86A] mb-2" />
                  <span className="font-semibold text-[#F8F6F2]">Click to upload logo or graphic</span>
                  <span className="text-2xs text-neutral-500 mt-1">PNG, JPG, SVG up to 10MB</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                {(activeView === "front" ? frontArtworkUrl : backArtworkUrl) && (
                  <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-xl border border-[#333]">
                    <span className="text-2xs text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Artwork Active on {activeView}
                    </span>
                    <button
                      onClick={() => activeView === "front" ? setFrontArtworkUrl(undefined) : setBackArtworkUrl(undefined)}
                      className="text-2xs text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Emblems */}
            {activeTab === "emblem" && (
              <div className="space-y-3 text-xs">
                <p className="text-neutral-400">Select an official ANIVA gold emblem or heritage crest:</p>
                <div className="grid grid-cols-3 gap-3">
                  {EMBLEMS.map((emb) => (
                    <button
                      key={emb.id}
                      onClick={() => {
                        setFrontEmblem(emb.url);
                        showToast(`Applied ${emb.name}`, "success");
                      }}
                      className="p-2 bg-[#1A1A1A] border border-[#333] hover:border-[#C9A86A] rounded-xl flex flex-col items-center gap-2 group transition-all"
                    >
                      <img src={emb.url} alt={emb.name} className="w-12 h-12 rounded-full object-cover" />
                      <span className="text-[10px] text-center text-neutral-300 group-hover:text-[#C9A86A] font-mono leading-tight">
                        {emb.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Breakdown & Add to Bag */}
            <div className="pt-6 border-t border-[#222222] space-y-4">
              <div className="space-y-1.5 font-mono text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Base Garment ({selectedFit}):</span>
                  <span>₹{basePrice}</span>
                </div>
                {frontPrintFee > 0 && (
                  <div className="flex justify-between text-[#C9A86A]">
                    <span>Front Custom Print:</span>
                    <span>+₹{frontPrintFee}</span>
                  </div>
                )}
                {backPrintFee > 0 && (
                  <div className="flex justify-between text-[#C9A86A]">
                    <span>Back Custom Print:</span>
                    <span>+₹{backPrintFee}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-[#F8F6F2] pt-2 border-t border-[#2A2A2A]">
                  <span>Total Bespoke Price:</span>
                  <span className="text-[#C9A86A]">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleAddToBag}
                className="w-full bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Custom Tee to Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
