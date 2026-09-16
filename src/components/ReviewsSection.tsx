import React from "react";
import { useShop } from "../context/ShopContext";
import { Star, CheckCircle2, Quote } from "lucide-react";

export const ReviewsSection: React.FC = () => {
  const { reviews } = useShop();

  return (
    <section className="py-20 bg-[#0D0D0D] text-[#F8F6F2] border-t border-[#1F1F1F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A]">
              Verified Client Feedback
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#F8F6F2]">
              Loved Across South India & Pan-India
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C9A86A] bg-[#181818] px-4 py-2 rounded-full border border-[#2B2B2B]">
            <Star className="w-4 h-4 fill-current" />
            <span>4.9 / 5.0 Average Rating (1,200+ Reviews)</span>
          </div>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 4).map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-[#121212] border border-[#222222] rounded-3xl space-y-4 flex flex-col justify-between shadow-xl relative"
            >
              <Quote className="w-8 h-8 text-[#C9A86A]/20 absolute top-4 right-4" />

              <div className="space-y-3">
                <div className="flex text-[#C9A86A]">
                  {"★".repeat(rev.rating)}
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed italic font-light">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#222222] flex items-center justify-between text-2xs font-mono">
                <div>
                  <h4 className="font-bold text-[#F8F6F2]">{rev.userName}</h4>
                  <span className="text-neutral-500">{rev.location}</span>
                </div>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
