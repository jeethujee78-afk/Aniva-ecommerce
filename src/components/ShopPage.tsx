import React, { useState, useMemo } from "react";
import { useShop } from "../context/ShopContext";
import { ProductCard } from "./ProductCard";
import { CATEGORIES, BRANDS } from "../data/initialData";
import { CategoryType } from "../types";
import { Filter, X, SlidersHorizontal, ArrowUpDown, RotateCcw, Search } from "lucide-react";

export const ShopPage: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, filterState, setFilterState, resetFilters, searchQuery, setSearchQuery } = useShop();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available Sizes & Colors for filters
  const allSizes = ["S", "M", "L", "XL", "XXL", "3XL", "7 UK", "8 UK", "9 UK", "10 UK", "11 UK"];
  const colorOptions = [
    { name: "Matte Black", hex: "#0D0D0D" },
    { name: "Ivory White", hex: "#F8F6F2" },
    { name: "Antique Gold", hex: "#C9A86A" },
    { name: "Sand Beige", hex: "#C8B9A6" },
    { name: "Olive Drab", hex: "#4A5240" },
    { name: "Deep Navy", hex: "#1A2530" },
    { name: "Charcoal Grey", hex: "#2C2C2C" }
  ];

  // Sync selectedCategory into filter state if set from Header
  React.useEffect(() => {
    if (selectedCategory !== "All") {
      setFilterState((prev) => ({ ...prev, category: selectedCategory }));
    }
  }, [selectedCategory, setFilterState]);

  // Apply Multi-Attribute Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category Filter
      if (filterState.category !== "All" && p.category.toLowerCase() !== filterState.category.toLowerCase()) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesBrand && !matchesCategory) {
          return false;
        }
      }

      // Price Range
      if (p.price < filterState.minPrice || p.price > filterState.maxPrice) {
        return false;
      }

      // Size Filter
      if (filterState.sizes.length > 0) {
        const hasSize = p.sizes.some((sz) => filterState.sizes.includes(sz));
        if (!hasSize) return false;
      }

      // Color Filter
      if (filterState.colors.length > 0) {
        const hasColor = p.colors.some((col) => filterState.colors.includes(col.name));
        if (!hasColor) return false;
      }

      // Brand Filter
      if (filterState.brands.length > 0 && !filterState.brands.includes(p.brand)) {
        return false;
      }

      // Rating Filter
      if (filterState.minRating > 0 && p.rating < filterState.minRating) {
        return false;
      }

      // In Stock Only
      if (filterState.inStockOnly && !p.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filterState.sortBy) {
        case "newest":
          return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        case "best_selling":
          return b.reviewCount - a.reviewCount;
        case "price_low_high":
          return a.price - b.price;
        case "price_high_low":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [products, filterState, searchQuery]);

  const toggleSizeFilter = (sz: string) => {
    setFilterState((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(sz) ? prev.sizes.filter((s) => s !== sz) : [...prev.sizes, sz]
    }));
  };

  const toggleColorFilter = (colorName: string) => {
    setFilterState((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorName) ? prev.colors.filter((c) => c !== colorName) : [...prev.colors, colorName]
    }));
  };

  const toggleBrandFilter = (brandName: string) => {
    setFilterState((prev) => ({
      ...prev,
      brands: prev.brands.includes(brandName) ? prev.brands.filter((b) => b !== brandName) : [...prev.brands, brandName]
    }));
  };

  return (
    <div className="bg-[#0D0D0D] text-[#F8F6F2] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="border-b border-[#222222] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#C9A86A]">
              ANIVA Catalog
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F8F6F2] mt-1">
              {filterState.category === "All" ? "Complete Luxury Collection" : filterState.category}
            </h1>
          </div>

          <p className="text-xs text-neutral-400 font-light max-w-md">
            Showing {filteredProducts.length} curated pieces crafted for South India & Pan-India fashion connoisseurs.
          </p>
        </div>

        {/* Search & Mobile Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121212] p-4 rounded-2xl border border-[#222222]">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              placeholder="Filter by name, color, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#333] text-xs text-[#F8F6F2] pl-9 pr-3 py-2 rounded-xl focus:border-[#C9A86A] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden bg-[#1A1A1A] border border-[#333] text-xs font-mono px-4 py-2 rounded-xl flex items-center gap-2 hover:border-[#C9A86A]"
            >
              <Filter className="w-4 h-4 text-[#C9A86A]" /> Filters
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <ArrowUpDown className="w-4 h-4 text-[#C9A86A]" />
              <select
                value={filterState.sortBy}
                onChange={(e) => setFilterState((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className="bg-[#1A1A1A] border border-[#333] text-xs text-[#F8F6F2] p-2 rounded-xl focus:border-[#C9A86A] focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="newest">New Arrivals</option>
                <option value="best_selling">Best Sellers</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters (1 col) */}
          <aside className="hidden lg:block space-y-6 bg-[#121212] border border-[#222222] p-6 rounded-3xl h-fit sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#C9A86A] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Smart Filters
              </h3>
              <button
                onClick={resetFilters}
                className="text-2xs font-mono text-neutral-400 hover:text-[#C9A86A] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-2xs font-mono uppercase tracking-wider text-neutral-400 block">Category</label>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setFilterState((prev) => ({ ...prev, category: "All" }));
                  }}
                  className={`w-full text-left py-1 px-2 rounded-lg transition-colors ${
                    filterState.category === "All" ? "bg-[#C9A86A] text-[#0D0D0D] font-bold" : "text-neutral-300 hover:text-white"
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedCategory(c.name);
                      setFilterState((prev) => ({ ...prev, category: c.name }));
                    }}
                    className={`w-full text-left py-1 px-2 rounded-lg transition-colors ${
                      filterState.category === c.name ? "bg-[#C9A86A] text-[#0D0D0D] font-bold" : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-2 pt-4 border-t border-[#222222]">
              <div className="flex justify-between text-2xs font-mono text-neutral-400">
                <span>Max Price:</span>
                <span className="text-[#C9A86A] font-bold">₹{filterState.maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={filterState.maxPrice}
                onChange={(e) => setFilterState((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full accent-[#C9A86A]"
              />
            </div>

            {/* Size Filter */}
            <div className="space-y-2 pt-4 border-t border-[#222222]">
              <label className="text-2xs font-mono uppercase tracking-wider text-neutral-400 block">Sizes</label>
              <div className="flex flex-wrap gap-1.5">
                {allSizes.map((sz) => {
                  const isSelected = filterState.sizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      onClick={() => toggleSizeFilter(sz)}
                      className={`px-2.5 py-1 rounded-md text-2xs font-mono border transition-all ${
                        isSelected
                          ? "bg-[#C9A86A] text-[#0D0D0D] border-[#C9A86A] font-bold"
                          : "bg-[#181818] border-[#333] text-neutral-400 hover:border-neutral-500"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Filter */}
            <div className="space-y-2 pt-4 border-t border-[#222222]">
              <label className="text-2xs font-mono uppercase tracking-wider text-neutral-400 block">Colors</label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((c) => {
                  const isSelected = filterState.colors.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      onClick={() => toggleColorFilter(c.name)}
                      style={{ backgroundColor: c.hex }}
                      className={`w-6 h-6 rounded-full border ${
                        isSelected ? "ring-2 ring-[#C9A86A] scale-110" : "border-neutral-600"
                      }`}
                      title={c.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2 pt-4 border-t border-[#222222]">
              <label className="text-2xs font-mono uppercase tracking-wider text-neutral-400 block">Brands</label>
              <div className="space-y-1.5 text-xs">
                {BRANDS.map((b) => {
                  const isChecked = filterState.brands.includes(b);
                  return (
                    <label key={b} className="flex items-center gap-2 cursor-pointer text-neutral-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleBrandFilter(b)}
                        className="accent-[#C9A86A]"
                      />
                      <span>{b}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Product Cards Grid (3 cols) */}
          <main className="lg:col-span-3 space-y-6">
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-[#121212] border border-[#222222] rounded-3xl space-y-4">
                <p className="text-neutral-400 text-sm">No products matched your exact filter combination.</p>
                <button
                  onClick={resetFilters}
                  className="bg-[#C9A86A] text-[#0D0D0D] font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Drawer Filter */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex justify-end">
          <div className="bg-[#121212] text-[#F8F6F2] w-full max-w-xs h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[#222222] pb-4">
              <h3 className="font-serif text-lg font-bold text-[#C9A86A]">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => {
                resetFilters();
                setIsMobileFilterOpen(false);
              }}
              className="w-full bg-[#C9A86A] text-[#0D0D0D] font-bold py-2 rounded-xl text-xs uppercase"
            >
              Reset Filters & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
