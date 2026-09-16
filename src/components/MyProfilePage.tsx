import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { User, MapPin, Phone, Mail, Shield, Save, Check } from "lucide-react";

export const MyProfilePage: React.FC = () => {
  const { showToast } = useShop();

  const [profile, setProfile] = useState({
    fullName: "Jeethu Jeevan",
    email: "jeethujee78@gmail.com",
    phone: "+91 98401 98765",
    preferredCity: "Chennai",
    state: "Tamil Nadu",
    pincode: "600034",
    addressLine: "Flat 4B, Emerald Residency, Nungambakkam High Rd"
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    showToast("Profile and default shipping address updated", "success");
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-[#0D0D0D] text-[#F8F6F2] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="border-b border-[#222222] pb-6 flex items-center justify-between">
          <div>
            <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A]">ANIVA Account</span>
            <h1 className="font-serif text-3xl font-bold flex items-center gap-2">
              <User className="w-7 h-7 text-[#C9A86A]" /> Client Profile
            </h1>
          </div>
          <span className="text-2xs font-mono text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full bg-emerald-950/40">
            Verified Privé Member
          </span>
        </div>

        <form onSubmit={handleSave} className="bg-[#121212] border border-[#222222] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <h3 className="font-serif text-lg font-bold text-[#C9A86A]">Personal Information & Preferred Shipping Address</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-2xs text-neutral-400 uppercase block mb-1">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A]"
              />
            </div>

            <div>
              <label className="text-2xs text-neutral-400 uppercase block mb-1">Mobile Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-2xs text-neutral-400 uppercase block mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-2xs text-neutral-400 uppercase block mb-1">Default Address Line</label>
              <input
                type="text"
                value={profile.addressLine}
                onChange={(e) => setProfile({ ...profile, addressLine: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A]"
              />
            </div>

            <div>
              <label className="text-2xs text-neutral-400 uppercase block mb-1">City</label>
              <input
                type="text"
                value={profile.preferredCity}
                onChange={(e) => setProfile({ ...profile, preferredCity: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A]"
              />
            </div>

            <div>
              <label className="text-2xs text-neutral-400 uppercase block mb-1">State</label>
              <select
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A]"
              >
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Kerala">Kerala</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Rest of India">Rest of India</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? "Saved Successfully" : "Update Profile"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
