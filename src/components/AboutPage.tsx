import React from "react";
import { Sparkles, ShieldCheck, Heart, Award } from "lucide-react";

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#0D0D0D] text-[#F8F6F2] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* About Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A]">The Brand Story</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight">
            Crafting Timeless Luxury <br />
            <span className="text-[#C9A86A]">For South India & Beyond</span>
          </h1>
          <p className="text-sm text-neutral-300 font-light leading-relaxed">
            ANIVA is inspired by the timeless idea of elegance, adornment, and confidence. We combine modern fashion with refined aesthetics, offering premium clothing, footwear, and accessories for discerning individuals across South India and Pan-India.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#121212] border border-[#222222] rounded-3xl p-8 shadow-2xl">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#C9A86A]">Our Design Philosophy</h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Every ANIVA piece is created with a focus on contemporary style and everyday comfort for South India and across India. We offer curated selections across clothing, footwear, and accessories for discerning individuals.
            </p>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Designed for everyday style and versatility, each item in our 6 core categories brings together clean aesthetics and modern silhouettes.
            </p>
          </div>

          <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-[#222]">
            <img
              src="/src/assets/images/aniva_custom_studio_1784879774954.jpg"
              alt="ANIVA Craftsmanship"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-[#121212] border border-[#222] rounded-2xl space-y-2">
            <Award className="w-6 h-6 text-[#C9A86A]" />
            <h3 className="font-serif text-base font-bold text-white">Everyday Essentials</h3>
            <p className="text-2xs text-neutral-400">Contemporary everyday wear designed for style and comfort.</p>
          </div>

          <div className="p-6 bg-[#121212] border border-[#222] rounded-2xl space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#C9A86A]" />
            <h3 className="font-serif text-base font-bold text-white">Italian Leather</h3>
            <p className="text-2xs text-neutral-400">Hand-burnished calfskin loafers and Goodyear welted soles.</p>
          </div>

          <div className="p-6 bg-[#121212] border border-[#222] rounded-2xl space-y-2">
            <Sparkles className="w-6 h-6 text-[#C9A86A]" />
            <h3 className="font-serif text-base font-bold text-white">Interactive Studio</h3>
            <p className="text-2xs text-neutral-400">Bespoke custom DTG printing with live real-time canvas preview.</p>
          </div>

          <div className="p-6 bg-[#121212] border border-[#222] rounded-2xl space-y-2">
            <Heart className="w-6 h-6 text-[#C9A86A]" />
            <h3 className="font-serif text-base font-bold text-white">South India Express</h3>
            <p className="text-2xs text-neutral-400">24-48 hour delivery to TN, Kerala, Karnataka, AP & Telangana.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
