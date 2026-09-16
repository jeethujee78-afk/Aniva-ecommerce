import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { CategoryType, PageView } from "../types";
import { MapPin, Phone, Mail, Send, ShieldCheck, HeartHandshake, RefreshCw, MessageSquare } from "lucide-react";

export const Footer: React.FC = () => {
  const { setActivePage, setSelectedCategory, showToast } = useShop();
  const [email, setEmail] = useState("");

  const handleCategoryClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setActivePage("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageClick = (page: PageView) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast("Thank you for subscribing! Check your email for code ANIVA10", "success");
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#080808] text-[#F8F6F2] border-t border-[#1F1F1F] pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Perks Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#111111] border border-[#222222]">
            <div className="p-3 bg-[#C9A86A]/10 text-[#C9A86A] rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide uppercase">Premium Everyday Essentials</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Designed for everyday style and comfort</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#111111] border border-[#222222]">
            <div className="p-3 bg-[#C9A86A]/10 text-[#C9A86A] rounded-lg">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide uppercase">24-48h South India Express</h4>
              <p className="text-xs text-neutral-400 mt-0.5">TN, Kerala, Karnataka, AP & Telangana</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#111111] border border-[#222222]">
            <div className="p-3 bg-[#C9A86A]/10 text-[#C9A86A] rounded-lg">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide uppercase">Easy 15-Day Exchange</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Hassle-free size swaps & refunds</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#111111] border border-[#222222]">
            <div className="p-3 bg-[#C9A86A]/10 text-[#C9A86A] rounded-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide uppercase">Instant WhatsApp Care</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Direct chat styling & order help</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-3xl font-bold tracking-[0.25em] text-[#F8F6F2]">ANIVA</span>
              <span className="w-2 h-2 rounded-full bg-[#C9A86A]"></span>
            </div>
            <p className="text-xs text-[#C9A86A] uppercase font-mono tracking-widest">
              Wear the Trend. Own the Style.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
              ANIVA brings contemporary everyday wear to South India and across India. Designed for everyday style, versatility, and timeless sophistication.
            </p>

            <div className="pt-2 text-xs text-neutral-400 space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C9A86A]" />
                <span>Flagship Atelier: Khader Nawaz Khan Rd, Nungambakkam, Chennai, Tamil Nadu 600034</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C9A86A]" />
                <span>+91 98401 23456 (WhatsApp Support Available)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C9A86A]" />
                <span>concierge@anivafashion.com</span>
              </p>
            </div>
          </div>

          {/* Column 2: Exclusive Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#C9A86A]">Categories</h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button onClick={() => handleCategoryClick("Plain T-Shirts")} className="hover:text-[#C9A86A] transition-colors">
                  Plain T-Shirts
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick("Printed T-Shirts")} className="hover:text-[#C9A86A] transition-colors">
                  Printed T-Shirts
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick("custom-studio")} className="hover:text-[#C9A86A] transition-colors flex items-center gap-1 text-[#C9A86A] font-semibold">
                  Custom Print Studio
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick("Shoes")} className="hover:text-[#C9A86A] transition-colors">
                  Shoes
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick("Men's Accessories")} className="hover:text-[#C9A86A] transition-colors">
                  Men's Accessories
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick("Women's Accessories")} className="hover:text-[#C9A86A] transition-colors">
                  Women's Accessories
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick("pre-owned")} className="hover:text-[#C9A86A] transition-colors text-[#C9A86A]">
                  ANIVA Pre-Owned
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#C9A86A]">Customer Care</h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button onClick={() => handlePageClick("track-order")} className="hover:text-[#C9A86A] transition-colors">
                  Track Order Status
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick("my-orders")} className="hover:text-[#C9A86A] transition-colors">
                  My Orders & Invoice
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick("about")} className="hover:text-[#C9A86A] transition-colors">
                  About ANIVA Heritage
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick("contact")} className="hover:text-[#C9A86A] transition-colors">
                  Contact & WhatsApp
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick("privacy")} className="hover:text-[#C9A86A] transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick("terms")} className="hover:text-[#C9A86A] transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick("refund")} className="hover:text-[#C9A86A] transition-colors">
                  Refund & Return Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#C9A86A]">ANIVA Privé</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Subscribe to unlock private drop access, limited capsule releases, and 10% off your first luxury order.
            </p>

            <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#C9A86A] text-xs text-[#F8F6F2] py-2.5 px-3 rounded-lg focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold px-3 rounded-md text-xs flex items-center justify-center transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="pt-2 text-2xs text-neutral-500">
              South India Flagships: Chennai • Bengaluru • Hyderabad • Kochi
            </div>
          </div>
        </div>

        {/* Bottom Bar & Payment Methods */}
        <div className="pt-8 border-t border-[#181818] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 ANIVA Fashion India Pvt. Ltd. All rights reserved. Registered trademark in India.</p>

          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Supported Payments (India):</span>
            <span className="px-2 py-1 bg-[#141414] rounded border border-[#2B2B2B] text-[10px] text-neutral-300 font-bold">UPI</span>
            <span className="px-2 py-1 bg-[#141414] rounded border border-[#2B2B2B] text-[10px] text-neutral-300 font-bold">Cards</span>
            <span className="px-2 py-1 bg-[#141414] rounded border border-[#2B2B2B] text-[10px] text-neutral-300 font-bold">Net Banking</span>
            <span className="px-2 py-1 bg-[#141414] rounded border border-[#2B2B2B] text-[10px] text-[#C9A86A] font-bold">COD Eligible</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
