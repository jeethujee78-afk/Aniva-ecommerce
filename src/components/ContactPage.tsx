import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export const ContactPage: React.FC = () => {
  const { showToast } = useShop();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Custom Order Inquiry",
    message: ""
  });

  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    showToast("Message sent to ANIVA Concierge team!", "success");
    setForm({ name: "", email: "", phone: "", subject: "Custom Order Inquiry", message: "" });
  };

  return (
    <div className="bg-[#0D0D0D] text-[#F8F6F2] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A]">Concierge Service</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">Contact ANIVA Concierge</h1>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Have a query about custom print orders, sizing, or express delivery across South India? We are at your service 24/7.
          </p>
        </div>

        {/* WhatsApp Direct Action Banner */}
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-emerald-300">Instant WhatsApp Support</h3>
              <p className="text-xs text-neutral-300">Chat directly with an ANIVA stylist in Chennai / Bengaluru for size guidance & order help.</p>
            </div>
          </div>

          <a
            href="https://wa.me/919840123456"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-[#0D0D0D] font-bold px-6 py-3.5 rounded-2xl text-xs uppercase font-mono tracking-wider flex items-center gap-2 shrink-0 shadow-lg"
          >
            <span>Open WhatsApp Chat</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#121212] border border-[#222222] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="font-serif text-xl font-bold text-[#C9A86A]">Send Us a Message</h2>

            {isSent && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4" /> Thank you! Our client advisor will reply within 2 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-2xs text-neutral-400 uppercase block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Anand Ramachandran"
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-2xs text-neutral-400 uppercase block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="anand@example.com"
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-2xs text-neutral-400 uppercase block mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98400 11223"
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-2xs text-neutral-400 uppercase block mb-1">Inquiry Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A]"
                >
                  <option value="Custom Order Inquiry">Custom Print Studio Inquiry</option>
                  <option value="Order & Dispatch Tracking">Order & Dispatch Tracking</option>
                  <option value="Size & Fit Advisory">Size & Fit Advisory</option>
                  <option value="Boutique Appointment">Boutique Appointment (Chennai / Bengaluru)</option>
                </select>
              </div>

              <div>
                <label className="text-2xs text-neutral-400 uppercase block mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we assist your fashion journey today?"
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>

          {/* Boutique Locations (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#121212] border border-[#222222] rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="font-serif text-lg font-bold text-[#C9A86A]">Flagship South India Boutiques</h3>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-3 bg-[#181818] rounded-2xl border border-[#2B2B2B]">
                  <h4 className="font-bold text-white text-sm">Chennai Atelier & Flagship</h4>
                  <p className="text-neutral-400 text-2xs mt-1">Khader Nawaz Khan Rd, Nungambakkam, Chennai, Tamil Nadu 600034</p>
                  <p className="text-[#C9A86A] text-2xs mt-1">Open 10:30 AM – 9:00 PM Daily</p>
                </div>

                <div className="p-3 bg-[#181818] rounded-2xl border border-[#2B2B2B]">
                  <h4 className="font-bold text-white text-sm">Bengaluru Boutique</h4>
                  <p className="text-neutral-400 text-2xs mt-1">100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038</p>
                  <p className="text-[#C9A86A] text-2xs mt-1">Open 10:30 AM – 9:00 PM Daily</p>
                </div>
              </div>
            </div>

            <div className="bg-[#121212] border border-[#222222] rounded-3xl p-6 space-y-2 text-xs font-mono">
              <p className="flex items-center gap-2 text-neutral-300">
                <Phone className="w-4 h-4 text-[#C9A86A]" /> Phone Hotline: +91 98401 23456
              </p>
              <p className="flex items-center gap-2 text-neutral-300">
                <Mail className="w-4 h-4 text-[#C9A86A]" /> Concierge: concierge@anivafashion.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
