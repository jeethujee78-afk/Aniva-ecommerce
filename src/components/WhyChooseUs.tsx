import React from "react";
import { ShieldCheck, Truck, Lock, RefreshCw, MessageSquare } from "lucide-react";

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#C9A86A]" />,
      title: "Premium Everyday Quality",
      desc: "Thoughtfully crafted contemporary essentials designed for lasting comfort and everyday style."
    },
    {
      icon: <Truck className="w-8 h-8 text-[#C9A86A]" />,
      title: "24-48h South India Express",
      desc: "Fast air express dispatch across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh & Telangana."
    },
    {
      icon: <Lock className="w-8 h-8 text-[#C9A86A]" />,
      title: "Secure Razorpay & COD",
      desc: "Encrypted instant payments via UPI (GPay/PhonePe/Paytm), Cards, or Cash on Delivery upon arrival."
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-[#C9A86A]" />,
      title: "Easy 15-Day Exchange",
      desc: "Hassle-free size swaps and doorstep return pickup across India."
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-[#C9A86A]" />,
      title: "Instant WhatsApp Care",
      desc: "24/7 direct styling advice, sizing assistance, and live shipment updates from our Chennai team."
    }
  ];

  return (
    <section className="py-20 bg-[#080808] text-[#F8F6F2] border-t border-[#181818]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A]">
            The ANIVA Difference
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Why Choose ANIVA?
          </h2>
          <p className="text-xs text-neutral-400">
            We build clothing and accessories engineered to last, designed for the modern South Asian lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#111111] border border-[#222222] rounded-2xl space-y-3 hover:border-[#C9A86A] transition-all group shadow-lg"
            >
              <div className="p-3 bg-[#1A1A1A] rounded-xl w-fit group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-serif text-sm font-bold text-[#F8F6F2] group-hover:text-[#C9A86A] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
