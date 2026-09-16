import React from "react";
import { useShop } from "../context/ShopContext";
import { CATEGORIES } from "../data/initialData";
import { CategoryType } from "../types";
import { ArrowUpRight, Sparkles } from "lucide-react";

export const CategoryGrid: React.FC = () => {
  const { setSelectedCategory, setActivePage } = useShop();

  const handleCategorySelect = (categoryName: CategoryType) => {
    if (categoryName === "Custom Printed T-Shirts") {
      setActivePage("custom-studio");
    } else {
      setSelectedCategory(categoryName);
      setActivePage("shop");
    }
  };

  return (
    <section className="py-20 bg-[#0D0D0D] text-[#F8F6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono text-[#C9A86A] uppercase tracking-widest block mb-2">
              Curated Essentials
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#F8F6F2]">
              Shop by Category
            </h2>
          </div>
          <p className="text-xs text-neutral-400 max-w-md">
            Selected collections crafted for versatile styling across seasons. From everyday essentials to curated footwear.
          </p>
        </div>

        {/* 6 Category Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const isCustom = cat.name === "Custom Printed T-Shirts";

            return (
              <div
                key={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-[#222222] hover:border-[#C9A86A] transition-all duration-500 shadow-xl"
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Badge if Custom Print */}
                {isCustom && (
                  <div className="absolute top-4 left-4 z-10 bg-[#C9A86A] text-[#0D0D0D] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    <span>Interactive Studio</span>
                  </div>
                )}

                {/* Card Info Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F8F6F2] group-hover:text-[#C9A86A] transition-colors">
                      {cat.name}
                    </h3>
                    <div className="w-9 h-9 rounded-full bg-[#F8F6F2]/10 group-hover:bg-[#C9A86A] group-hover:text-[#0D0D0D] text-[#F8F6F2] flex items-center justify-center transition-all duration-300 shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 mt-2 line-clamp-2 font-light">
                    {cat.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-700/50 flex items-center justify-between text-2xs font-mono text-[#C9A86A]">
                    <span>EXPLORE COLLECTION</span>
                    <span>{cat.count} PIECES</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
