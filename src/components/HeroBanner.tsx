import React from "react";
import { useShop } from "../context/ShopContext";
import { ArrowRight, Sparkles, Shield, Truck, Zap } from "lucide-react";

export const HeroBanner: React.FC = () => {
  const { setActivePage, setSelectedCategory } = useShop();

  return (
    <section className="relative bg-[#0D0D0D] text-[#F8F6F2] overflow-hidden min-h-[85vh] flex items-center">
      {/* Background Hero Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/aniva_hero_banner_1784879760561.jpg"
          alt="ANIVA Luxury Fashion"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-60 scale-105 transition-transform duration-10000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-[#0D0D0D]/40"></div>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
        <div className="max-w-2xl space-y-6">
          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A86A]/15 border border-[#C9A86A]/30 backdrop-blur-md text-[#C9A86A] text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>South India's Premier Multi-Brand Fashion Atelier</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F8F6F2] leading-[1.08]">
            Wear the Trend. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A86A] via-[#E5C98B] to-[#C9A86A]">
              Own the Style.
            </span>
          </h1>

          {/* Paragraph */}
          <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-xl">
            Redefining contemporary elegance for Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana & Pan-India. Discover premium everyday essentials, South Asian urban graphics, custom print studio, and curated footwear.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                setSelectedCategory("All");
                setActivePage("shop");
              }}
              className="bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest flex items-center gap-3 transition-all duration-300 shadow-2xl hover:gap-4 group cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => setActivePage("custom-studio")}
              className="bg-transparent hover:bg-[#F8F6F2]/10 text-[#F8F6F2] border-2 border-[#C9A86A]/80 font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-300 backdrop-blur-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C9A86A]" />
              <span>Custom Print Studio</span>
            </button>
          </div>

          {/* Hero Feature Highlights */}
          <div className="pt-10 grid grid-cols-3 gap-4 border-t border-[#333333]/60 max-w-xl">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Zap className="w-4 h-4 text-[#C9A86A] shrink-0" />
              <span>Premium Everyday Essentials</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Truck className="w-4 h-4 text-[#C9A86A] shrink-0" />
              <span>24h South India Dispatch</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Shield className="w-4 h-4 text-[#C9A86A] shrink-0" />
              <span>Italian Leather Welt</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
