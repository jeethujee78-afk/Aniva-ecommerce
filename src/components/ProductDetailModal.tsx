import React, { useState } from "react";
import { Product } from "../types";
import { useShop } from "../context/ShopContext";
import { CONDITION_GRADES } from "../data/initialData";
import { X, Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Check, Ruler, MessageSquare, QrCode, FileText, Box } from "lucide-react";

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    reviews, 
    addReview,
    lookupCertificate,
    setActiveCertificate
  } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "reviews" | "provenance">("details");

  // New review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewCity, setReviewCity] = useState("Chennai, Tamil Nadu");

  if (!selectedProduct) return null;

  const product = selectedProduct;
  const isWishlisted = wishlist.includes(product.id);
  const selectedSize = product.sizes[selectedSizeIndex] || product.sizes[0] || "M";
  const selectedColor = product.colors[selectedColorIndex] || product.colors[0];

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const conditionInfo = product.conditionGrade ? CONDITION_GRADES[product.conditionGrade] : null;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleOpenCertificate = () => {
    if (product.verificationId) {
      const cert = lookupCertificate(product.verificationId);
      if (cert) {
        setActiveCertificate(cert);
      }
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewComment.trim() && reviewName.trim()) {
      await addReview(product.id, reviewRating, reviewComment, reviewName, reviewCity);
      setReviewComment("");
      setReviewName("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="relative bg-[#111111] border border-[#2B2B2B] text-[#F8F6F2] rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#C9A86A] text-[#F8F6F2] hover:text-[#0D0D0D] transition-colors shadow-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Photo Gallery */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 bg-[#0B0B0B] flex flex-col gap-4">
          <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-[#161616] border border-[#222]">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {product.isPreOwned && conditionInfo && (
              <span className={`absolute top-4 left-4 text-xs font-mono font-bold px-3 py-1 rounded-md uppercase tracking-wider border shadow backdrop-blur-md ${conditionInfo.badgeColor}`}>
                Grade {product.conditionGrade} • {conditionInfo.title}
              </span>
            )}
            {product.isNewArrival && !product.isPreOwned && (
              <span className="absolute top-4 left-4 bg-[#C9A86A] text-[#0D0D0D] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                New Arrival
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx ? "border-[#C9A86A]" : "border-[#222] opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details & Actions */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C9A86A]">
                {product.brand} • {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#C9A86A] font-mono">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating} ({product.reviewCount} Reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F8F6F2]">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 font-mono">
              <span className="text-2xl font-bold text-[#F8F6F2]">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-neutral-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Save ₹{(product.originalPrice - product.price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Seller attribution pill */}
            {product.sellerName && (
              <div className="text-xs font-mono text-neutral-400 bg-[#161616] p-2.5 rounded-xl border border-[#262626] flex items-center justify-between">
                <span>Sold & Consigned by: <strong className="text-white">{product.sellerName}</strong></span>
                <span className="text-emerald-400 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Direct In-Hub Escrow</span>
              </div>
            )}

            {/* Tabs: Overview vs Provenance vs Reviews */}
            <div className="flex border-b border-[#2B2B2B] pt-2 text-xs font-mono uppercase tracking-widest gap-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-2 transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "details"
                    ? "border-[#C9A86A] text-[#C9A86A] font-bold"
                    : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                Product Details
              </button>
              {product.isPreOwned && (
                <button
                  onClick={() => setActiveTab("provenance")}
                  className={`pb-2 transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "provenance"
                      ? "border-[#C9A86A] text-[#C9A86A] font-bold"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  Provenance & Passport
                </button>
              )}
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-2 transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "reviews"
                    ? "border-[#C9A86A] text-[#C9A86A] font-bold"
                    : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                Client Reviews ({productReviews.length})
              </button>
            </div>

            {/* Tab 1: Details */}
            {activeTab === "details" && (
              <div className="space-y-4 text-xs text-neutral-300">
                <p className="leading-relaxed">{product.description}</p>

                {/* Color Selector */}
                {!product.isPreOwned && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-neutral-400 font-mono block">
                      Color: <strong className="text-[#F8F6F2]">{selectedColor.name}</strong>
                    </label>
                    <div className="flex items-center gap-3">
                      {product.colors.map((c, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedColorIndex(idx)}
                          style={{ backgroundColor: c.hex }}
                          className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                            selectedColorIndex === idx
                              ? "border-[#C9A86A] ring-2 ring-[#C9A86A]/50 scale-110"
                              : "border-neutral-600"
                          }`}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider text-neutral-400 font-mono">
                      {product.isPreOwned ? "Item Size / Specification:" : "Select Size:"}
                    </label>
                    {!product.isPreOwned && (
                      <button
                        onClick={() => setShowSizeGuide(true)}
                        className="text-xs text-[#C9A86A] hover:underline flex items-center gap-1 font-mono cursor-pointer"
                      >
                        <Ruler className="w-3.5 h-3.5" /> Size Guide
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSizeIndex(idx)}
                        className={`px-4 py-2 rounded-xl font-mono text-xs border transition-all cursor-pointer ${
                          selectedSizeIndex === idx
                            ? "bg-[#C9A86A] text-[#0D0D0D] border-[#C9A86A] font-bold shadow-lg"
                            : "bg-[#181818] border-[#2B2B2B] text-neutral-300 hover:border-neutral-500"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Details list */}
                {product.details && product.details.length > 0 && (
                  <div className="pt-2 space-y-1">
                    <h4 className="font-mono text-2xs uppercase text-[#C9A86A]">Craft & Material Specifications:</h4>
                    <ul className="list-disc list-inside space-y-1 text-neutral-400 text-xs">
                      {product.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Provenance & Passport (For Pre-Owned) */}
            {activeTab === "provenance" && product.isPreOwned && (
              <div className="space-y-4 text-xs animate-fadeIn">
                {/* Condition Box */}
                {conditionInfo && (
                  <div className="bg-[#181818] border border-[#2A2A2A] rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded text-2xs font-mono font-bold uppercase border ${conditionInfo.badgeColor}`}>
                        Grade {product.conditionGrade} — {conditionInfo.title}
                      </span>
                      <span className="text-2xs font-mono text-neutral-400">Verified Inspection</span>
                    </div>
                    <p className="text-xs text-neutral-300">{conditionInfo.description}</p>
                  </div>
                )}

                {/* Accompaniments Checklist */}
                <div className="grid grid-cols-3 gap-2 text-center text-2xs font-mono">
                  <div className={`p-2.5 rounded-xl border ${product.hasBox ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-[#181818] border-[#2A2A2A] text-neutral-500"}`}>
                    <Box className="w-4 h-4 mx-auto mb-1" />
                    <span>Box: {product.hasBox ? "Included" : "None"}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${product.hasPapers ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-[#181818] border-[#2A2A2A] text-neutral-500"}`}>
                    <FileText className="w-4 h-4 mx-auto mb-1" />
                    <span>Papers: {product.hasPapers ? "Included" : "None"}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${product.hasInvoice ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-[#181818] border-[#2A2A2A] text-neutral-500"}`}>
                    <Check className="w-4 h-4 mx-auto mb-1" />
                    <span>Receipt: {product.hasInvoice ? "Verified" : "None"}</span>
                  </div>
                </div>

                {/* Certificate Passport Action */}
                {product.verificationId && (
                  <div className="bg-[#1C1812] border border-[#C9A86A]/50 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xs font-mono uppercase text-neutral-400 block">Certificate ID</span>
                        <span className="font-mono text-sm font-bold text-[#C9A86A]">{product.verificationId}</span>
                      </div>
                      <button
                        onClick={handleOpenCertificate}
                        className="bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold font-mono text-xs uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 shadow cursor-pointer transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>View Certificate</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Reviews */}
            {activeTab === "reviews" && (
              <div className="space-y-6 max-h-80 overflow-y-auto pr-2">
                {/* Submit New Review Form */}
                <form onSubmit={handleReviewSubmit} className="p-4 bg-[#161616] border border-[#2A2A2A] rounded-2xl space-y-3">
                  <h4 className="text-xs font-mono uppercase text-[#C9A86A] font-bold">Write a Verified Review</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      required
                      className="bg-[#0D0D0D] border border-[#333] text-xs p-2 rounded focus:border-[#C9A86A]"
                    />
                    <input
                      type="text"
                      placeholder="City e.g. Chennai / Bengaluru"
                      value={reviewCity}
                      onChange={(e) => setReviewCity(e.target.value)}
                      required
                      className="bg-[#0D0D0D] border border-[#333] text-xs p-2 rounded focus:border-[#C9A86A]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400">Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`text-sm cursor-pointer ${star <= reviewRating ? "text-[#C9A86A]" : "text-neutral-600"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="Share your experience with the fabric, fit, and delivery..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={2}
                    required
                    className="w-full bg-[#0D0D0D] border border-[#333] text-xs p-2 rounded focus:border-[#C9A86A]"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold py-2 rounded text-xs uppercase cursor-pointer"
                  >
                    Post Review
                  </button>
                </form>

                {/* Review List */}
                <div className="space-y-3">
                  {productReviews.length === 0 ? (
                    <p className="text-xs text-neutral-500 italic">No reviews yet. Be the first to review this piece!</p>
                  ) : (
                    productReviews.map((rev) => (
                      <div key={rev.id} className="p-3 bg-[#181818] border border-[#252525] rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#F8F6F2]">{rev.userName} <span className="text-neutral-500 text-2xs">({rev.location})</span></span>
                          <div className="flex text-[#C9A86A]">
                            {"★".repeat(rev.rating)}
                          </div>
                        </div>
                        <p className="text-xs text-neutral-300 leading-normal">{rev.comment}</p>
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                          <Check className="w-3 h-3" /> Verified Purchase • {rev.date}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#2B2B2B] space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity Changer */}
              {!product.isPreOwned && (
                <div className="flex items-center border border-[#2B2B2B] rounded-xl bg-[#161616]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2.5 text-xs text-neutral-300 hover:text-white cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-2.5 text-xs font-mono font-bold text-[#F8F6F2]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2.5 text-xs text-neutral-300 hover:text-white cursor-pointer"
                  >
                    +
                  </button>
                </div>
              )}

              {/* Add to Bag CTA */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag • ₹{(product.price * quantity).toLocaleString()}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                  isWishlisted
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-[#161616] border-[#2B2B2B] text-neutral-300 hover:text-[#C9A86A]"
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Guarantees row */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400 font-mono pt-2">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#C9A86A]" /> Delivery across India
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A86A]" /> {product.isPreOwned ? "ANIVA Verification [DEMO DATA]" : "Standard Exchange Policy"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal Popup */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#333] text-[#F8F6F2] p-6 rounded-2xl max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#C9A86A]">ANIVA Garment Size Guide (Inches)</h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <table className="w-full text-xs text-left border-collapse border border-[#2B2B2B]">
              <thead>
                <tr className="bg-[#1A1A1A] text-[#C9A86A] font-mono">
                  <th className="p-2 border border-[#2B2B2B]">Size</th>
                  <th className="p-2 border border-[#2B2B2B]">Chest</th>
                  <th className="p-2 border border-[#2B2B2B]">Shoulder</th>
                  <th className="p-2 border border-[#2B2B2B]">Length</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300 font-mono">
                <tr><td className="p-2 border border-[#2B2B2B] font-bold text-[#C9A86A]">S</td><td className="p-2 border border-[#2B2B2B]">38"</td><td className="p-2 border border-[#2B2B2B]">18"</td><td className="p-2 border border-[#2B2B2B]">27"</td></tr>
                <tr><td className="p-2 border border-[#2B2B2B] font-bold text-[#C9A86A]">M</td><td className="p-2 border border-[#2B2B2B]">40"</td><td className="p-2 border border-[#2B2B2B]">19"</td><td className="p-2 border border-[#2B2B2B]">28"</td></tr>
                <tr><td className="p-2 border border-[#2B2B2B] font-bold text-[#C9A86A]">L</td><td className="p-2 border border-[#2B2B2B]">42"</td><td className="p-2 border border-[#2B2B2B]">20"</td><td className="p-2 border border-[#2B2B2B]">29"</td></tr>
                <tr><td className="p-2 border border-[#2B2B2B] font-bold text-[#C9A86A]">XL</td><td className="p-2 border border-[#2B2B2B]">44"</td><td className="p-2 border border-[#2B2B2B]">21"</td><td className="p-2 border border-[#2B2B2B]">30"</td></tr>
                <tr><td className="p-2 border border-[#2B2B2B] font-bold text-[#C9A86A]">XXL</td><td className="p-2 border border-[#2B2B2B]">46"</td><td className="p-2 border border-[#2B2B2B]">22"</td><td className="p-2 border border-[#2B2B2B]">31"</td></tr>
              </tbody>
            </table>
            <p className="text-[11px] text-neutral-400 italic">
              Note: For our Oversized Drop-Shoulder fit, we recommend ordering your standard size for the intended relaxed fit.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
