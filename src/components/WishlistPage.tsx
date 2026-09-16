import React from "react";
import { useShop } from "../context/ShopContext";
import { ProductCard } from "./ProductCard";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";

export const WishlistPage: React.FC = () => {
  const { products, wishlist, setActivePage } = useShop();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-[#0D0D0D] text-[#F8F6F2] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-[#222222] pb-6 flex items-center justify-between">
          <div>
            <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A]">Personal Wardrobe</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold flex items-center gap-3">
              Saved Wishlist <Heart className="w-6 h-6 text-[#C9A86A] fill-current" />
            </h1>
          </div>
          <span className="text-xs font-mono text-neutral-400">{savedProducts.length} Saved Items</span>
        </div>

        {savedProducts.length === 0 ? (
          <div className="py-20 text-center bg-[#121212] border border-[#222222] rounded-3xl space-y-4 max-w-lg mx-auto">
            <Heart className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#F8F6F2]">Your wishlist is currently empty</h3>
            <p className="text-xs text-neutral-400">
              Browse our catalog and tap the heart icon on any plain tee, Italian shoe, or gold cufflink to save it for later.
            </p>
            <button
              onClick={() => setActivePage("shop")}
              className="bg-[#C9A86A] text-[#0D0D0D] font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider inline-flex items-center gap-2"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
