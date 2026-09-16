import React, { useState } from "react";
import { Product } from "../types";
import { useShop } from "../context/ShopContext";
import { CONDITION_GRADES } from "../data/initialData";
import { Heart, Star, ShoppingBag, Eye, Check, ShieldCheck, QrCode } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { wishlist, toggleWishlist, setSelectedProduct, addToCart, lookupCertificate, setActiveCertificate } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const isWishlisted = wishlist.includes(product.id);
  const selectedColor = product.colors[selectedColorIndex] || product.colors[0];
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || "M";
    addToCart(product, defaultSize, selectedColor, 1);
  };

  const handleOpenCertificate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.verificationId) {
      const cert = lookupCertificate(product.verificationId);
      if (cert) {
        setActiveCertificate(cert);
      }
    }
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const conditionInfo = product.conditionGrade ? CONDITION_GRADES[product.conditionGrade] : null;

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-[#121212] rounded-2xl overflow-hidden border border-[#222222] hover:border-[#C9A86A]/60 transition-all duration-300 flex flex-col justify-between shadow-lg cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-4/5 w-full bg-[#181818] overflow-hidden">
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isPreOwned && conditionInfo && (
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border shadow backdrop-blur-md ${conditionInfo.badgeColor}`}>
              Grade {product.conditionGrade} • {conditionInfo.title}
            </span>
          )}
          {product.isVerified && (
            <span className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> ANIVA Verified
            </span>
          )}
          {product.isNewArrival && !product.isPreOwned && (
            <span className="bg-[#C9A86A] text-[#0D0D0D] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
              New
            </span>
          )}
          {discountPercent > 0 && !product.isPreOwned && (
            <span className="bg-red-950/90 border border-red-500/50 text-red-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
            isWishlisted
              ? "bg-red-600 text-white"
              : "bg-[#0D0D0D]/60 text-neutral-300 hover:text-[#C9A86A] hover:bg-[#0D0D0D]"
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          {product.verificationId ? (
            <button
              onClick={handleOpenCertificate}
              className="flex-1 bg-[#1A1A1A] hover:bg-[#252525] border border-[#C9A86A]/60 text-[#C9A86A] font-mono font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xl transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>View Passport</span>
            </button>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="flex-1 bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xl transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Quick Bag</span>
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="p-2.5 bg-[#0D0D0D]/90 hover:bg-[#0D0D0D] text-[#F8F6F2] border border-[#333] rounded-xl text-xs flex items-center justify-center backdrop-blur-md transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between text-[#F8F6F2]">
        <div>
          <div className="flex items-center justify-between text-2xs text-neutral-400 font-mono tracking-wider">
            <span>{product.brand}</span>
            <div className="flex items-center gap-1 text-[#C9A86A]">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating} ({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-serif text-sm font-semibold tracking-wide text-[#F8F6F2] group-hover:text-[#C9A86A] transition-colors mt-1 line-clamp-1">
            {product.name}
          </h3>

          {/* Seller / Provenance Line */}
          {product.sellerName && (
            <div className="text-[11px] text-neutral-400 font-mono pt-1">
              Source: <span className="text-neutral-200">{product.sellerName}</span>
            </div>
          )}
        </div>

        {/* Color Swatches */}
        {product.colors.length > 0 && !product.isPreOwned && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.map((c, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIndex(i);
                }}
                style={{ backgroundColor: c.hex }}
                className={`w-3.5 h-3.5 rounded-full border ${
                  selectedColorIndex === i ? "border-[#C9A86A] ring-2 ring-[#C9A86A]/40" : "border-neutral-600"
                }`}
                title={c.name}
              />
            ))}
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-baseline justify-between pt-2 border-t border-[#222222]">
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-sm font-bold text-[#F8F6F2]">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-2xs text-neutral-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1">
            <Check className="w-3 h-3" /> {product.isPreOwned ? "Vault Unit" : "In Stock"}
          </span>
        </div>
      </div>
    </div>
  );
};
