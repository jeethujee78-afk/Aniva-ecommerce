import React from "react";
import { ShopProvider, useShop } from "./context/ShopContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HeroBanner } from "./components/HeroBanner";
import { CategoryGrid } from "./components/CategoryGrid";
import { ProductCard } from "./components/ProductCard";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { CustomPrintStudio } from "./components/CustomPrintStudio";
import { ShopPage } from "./components/ShopPage";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutPage } from "./components/CheckoutPage";
import { TrackOrderPage } from "./components/TrackOrderPage";
import { WishlistPage } from "./components/WishlistPage";
import { MyOrdersPage } from "./components/MyOrdersPage";
import { MyProfilePage } from "./components/MyProfilePage";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";
import { PrivacyPolicyPage, TermsPage, RefundPolicyPage } from "./components/PolicyPages";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { ReviewsSection } from "./components/ReviewsSection";
import { AdminPanel } from "./components/AdminPanel";
import { PreOwnedPage } from "./components/PreOwnedPage";
import { RetailerPortal } from "./components/RetailerPortal";
import { SellItemModal } from "./components/SellItemModal";
import { VerificationModal } from "./components/VerificationModal";
import { Toast } from "./components/Toast";
import { Sparkles, ArrowRight } from "lucide-react";

const MainContent: React.FC = () => {
  const { activePage, setActivePage, products, setSelectedCategory, isAdmin } = useShop();

  // Highlight featured collections on Home page
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  // If Admin view is active
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#F8F6F2] font-sans">
        <Header />
        <AdminPanel />
        <Footer />
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F8F6F2] font-sans selection:bg-[#C9A86A] selection:text-[#0D0D0D] flex flex-col justify-between">
      <Header />

      <main className="flex-1">
        {activePage === "home" && (
          <div className="space-y-16 pb-16">
            <HeroBanner />
            <CategoryGrid />

            {/* Custom Print Studio Showcase Callout Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-[#181510] via-[#1F1910] to-[#121212] border border-[#C9A86A]/40 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-xl z-10">
                  <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A] bg-[#C9A86A]/10 px-3 py-1 rounded-full border border-[#C9A86A]/20 flex items-center gap-1.5 w-fit">
                    <Sparkles className="w-3.5 h-3.5" /> Interactive Design Engine
                  </span>
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
                    ANIVA Studio <br />
                    <span className="text-[#C9A86A]">Custom Print Studio</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                    Personalize your garment with custom graphics, curated typography, and instant live preview. Crafted for modern expression.
                  </p>

                  <button
                    onClick={() => setActivePage("custom-studio")}
                    className="bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest inline-flex items-center gap-2 shadow-xl transition-all cursor-pointer"
                  >
                    <span>Launch Custom Print Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative w-full lg:w-96 aspect-square rounded-2xl overflow-hidden border border-[#C9A86A]/30 shrink-0 shadow-2xl">
                  <img
                    src="/src/assets/images/aniva_custom_studio_1784879774954.jpg"
                    alt="Custom Print Studio"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>

            {/* New Arrivals Showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex items-end justify-between border-b border-[#222222] pb-4">
                <div>
                  <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A]">
                    Just Dropped
                  </span>
                  <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
                    New Arrivals Collection
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setActivePage("shop");
                  }}
                  className="text-xs font-mono text-[#C9A86A] hover:underline flex items-center gap-1"
                >
                  View All ({products.length}) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newArrivals.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>

            {/* Best Sellers Showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex items-end justify-between border-b border-[#222222] pb-4">
                <div>
                  <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A]">
                    Curated Selections
                  </span>
                  <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
                    Trending Across South India
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setActivePage("shop");
                  }}
                  className="text-xs font-mono text-[#C9A86A] hover:underline flex items-center gap-1"
                >
                  Explore Catalog <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestSellers.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>

            <WhyChooseUs />
            <ReviewsSection />
          </div>
        )}

        {activePage === "shop" && <ShopPage />}
        {activePage === "pre-owned" && <PreOwnedPage />}
        {activePage === "retailer-portal" && <RetailerPortal />}
        {activePage === "custom-studio" && <CustomPrintStudio />}
        {activePage === "checkout" && <CheckoutPage />}
        {activePage === "track-order" && <TrackOrderPage />}
        {activePage === "wishlist" && <WishlistPage />}
        {activePage === "my-orders" && <MyOrdersPage />}
        {activePage === "my-profile" && <MyProfilePage />}
        {activePage === "about" && <AboutPage />}
        {activePage === "contact" && <ContactPage />}
        {activePage === "privacy" && <PrivacyPolicyPage />}
        {activePage === "terms" && <TermsPage />}
        {activePage === "refund" && <RefundPolicyPage />}
      </main>

      <Footer />
      <ProductDetailModal />
      <SellItemModal />
      <VerificationModal />
      <CartDrawer />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
