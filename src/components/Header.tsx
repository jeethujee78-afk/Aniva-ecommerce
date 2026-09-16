import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { CategoryType, PageView } from "../types";
import { Search, ShoppingBag, Heart, User, Menu, X, Sparkles, ShieldAlert, Truck, Tag } from "lucide-react";

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    setSelectedCategory,
    cart,
    wishlist,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    isAdmin,
    setIsAdmin,
    showToast
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, item) => acc + (item.customDesign ? item.customDesign.calculatedPrice : item.product.price) * item.quantity,
    0
  );

  const navCategories: { name: string; category?: CategoryType; page?: PageView; isCustom?: boolean; isPreOwned?: boolean; isRetailer?: boolean }[] = [
    { name: "Home", page: "home" },
    { name: "Shop", page: "shop" },
    { name: "ANIVA Pre-Owned", page: "pre-owned", isPreOwned: true },
    { name: "Custom Studio", page: "custom-studio", isCustom: true },
    { name: "Plain T-Shirts", category: "Plain T-Shirts" },
    { name: "Printed T-Shirts", category: "Printed T-Shirts" },
    { name: "Shoes", category: "Shoes" },
    { name: "Accessories", category: "Men's Accessories" },
    { name: "Partner Portal", page: "retailer-portal", isRetailer: true },
    { name: "Track Order", page: "track-order" }
  ];

  const handleNavClick = (nav: { name: string; category?: CategoryType; page?: PageView }) => {
    if (nav.page) {
      setActivePage(nav.page);
      if (nav.page === "shop") {
        setSelectedCategory("All");
      }
    } else if (nav.category) {
      setSelectedCategory(nav.category);
      setActivePage("shop");
    }
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage("shop");
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0D0D0D] text-[#F8F6F2] border-b border-[#2A2A2A]/80 shadow-xl transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#161616] border-b border-[#262626] py-1.5 px-4 text-xs font-medium tracking-wider text-neutral-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#C9A86A] text-2xs md:text-xs">
            <Truck className="w-3.5 h-3.5" />
            <span>Free Express Delivery Across South India & Pan-India on Orders Above ₹1,999</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-neutral-400">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#C9A86A]" /> Use Code: <strong className="text-[#C9A86A]">ANIVA10</strong> for 10% OFF
            </span>
            <span className="text-neutral-600">|</span>
            <button
              onClick={() => {
                setIsAdmin(!isAdmin);
                showToast(isAdmin ? "Switched to Client View" : "Switched to Admin Portal", "info");
              }}
              className="hover:text-[#C9A86A] transition-colors flex items-center gap-1 font-mono text-[11px] underline underline-offset-2"
            >
              <ShieldAlert className="w-3 h-3 text-[#C9A86A]" />
              {isAdmin ? "Exit Admin" : "Admin Portal"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-neutral-300 hover:text-[#C9A86A] transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo & Tagline */}
        <div
          onClick={() => {
            setActivePage("home");
            setSelectedCategory("All");
          }}
          className="cursor-pointer group flex flex-col items-center lg:items-start"
        >
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-bold text-[#F8F6F2] group-hover:text-[#C9A86A] transition-colors">
              ANIVA
            </span>
            <span className="w-2 h-2 rounded-full bg-[#C9A86A] inline-block animate-pulse"></span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#C9A86A]/80 font-medium hidden sm:block">
            Wear the Trend. Own the Style.
          </span>
        </div>

        {/* Desktop Navbar Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs uppercase tracking-widest font-medium">
          {navCategories.map((nav, idx) => {
            const isActive =
              (nav.page && activePage === nav.page) ||
              (nav.category && activePage === "shop" && nav.category === nav.category);

            return (
              <button
                key={idx}
                onClick={() => handleNavClick(nav)}
                className={`relative py-1 transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "text-[#C9A86A] font-semibold"
                    : "text-neutral-300 hover:text-[#F8F6F2]"
                } ${nav.isCustom || nav.isPreOwned ? "flex items-center gap-1 text-[#C9A86A] font-bold" : ""}`}
              >
                {nav.isCustom && <Sparkles className="w-3 h-3 text-[#C9A86A] animate-spin-slow" />}
                {nav.name}
                {nav.isPreOwned && (
                  <span className="text-[8px] bg-[#C9A86A]/20 text-[#C9A86A] px-1.5 py-0.5 rounded-full border border-[#C9A86A]/30">
                    Pre-Owned
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A86A] rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions Header */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Bar / Button */}
          <div className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search t-shirts, shoes, gold cufflinks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-48 sm:w-64 bg-[#181818] border border-[#C9A86A] text-[#F8F6F2] text-xs rounded-full py-2 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-[#C9A86A]"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-2 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-neutral-300 hover:text-[#C9A86A] transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Wishlist Icon */}
          <button
            onClick={() => setActivePage("wishlist")}
            className="p-2 text-neutral-300 hover:text-[#C9A86A] transition-colors relative"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#C9A86A] text-[#0D0D0D] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* User Profile / Orders Shortcut */}
          <button
            onClick={() => setActivePage("my-orders")}
            className="hidden sm:flex items-center gap-1 p-2 text-neutral-300 hover:text-[#C9A86A] transition-colors"
            title="My Account & Orders"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold px-3 py-2 rounded-full flex items-center gap-2 transition-all shadow-lg text-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-[#0D0D0D] text-[#F8F6F2] px-1.5 py-0.5 rounded-full text-[10px]">
              {cartCount}
            </span>
            {cartTotal > 0 && (
              <span className="hidden md:inline font-mono border-l border-[#0D0D0D]/20 pl-2">
                ₹{cartTotal.toLocaleString()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#121212] border-b border-[#2A2A2A] px-4 pt-3 pb-6 animate-slide-down">
          <div className="flex flex-col gap-3 text-sm font-medium tracking-wider uppercase divide-y divide-[#222]">
            {navCategories.map((nav, idx) => (
              <button
                key={idx}
                onClick={() => handleNavClick(nav)}
                className="py-2.5 text-left text-neutral-200 hover:text-[#C9A86A] flex items-center justify-between"
              >
                <span className={nav.isCustom ? "text-[#C9A86A] font-bold flex items-center gap-2" : ""}>
                  {nav.isCustom && <Sparkles className="w-4 h-4 text-[#C9A86A]" />}
                  {nav.name}
                </span>
                <span className="text-neutral-600 text-xs">→</span>
              </button>
            ))}

            <div className="pt-4 flex flex-col gap-2 text-xs normal-case text-neutral-400">
              <button
                onClick={() => {
                  setActivePage("my-orders");
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 text-left text-[#C9A86A] font-medium flex items-center gap-2"
              >
                <User className="w-4 h-4" /> My Orders & Profile
              </button>

              <button
                onClick={() => {
                  setIsAdmin(!isAdmin);
                  setIsMobileMenuOpen(false);
                  showToast(isAdmin ? "Switched to Client View" : "Switched to Admin Portal", "info");
                }}
                className="py-2 text-left text-neutral-300 font-mono flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-[#C9A86A]" />
                {isAdmin ? "Exit Admin Mode" : "Switch to Store Admin Portal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
