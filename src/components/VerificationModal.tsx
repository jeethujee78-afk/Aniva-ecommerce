import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { VerificationCertificate } from "../types";
import { CONDITION_GRADES } from "../data/initialData";
import { ShieldCheck, CheckCircle2, QrCode, X, Search, Award, FileText, Clock, ExternalLink } from "lucide-react";

export const VerificationModal: React.FC = () => {
  const { activeCertificate, setActiveCertificate, lookupCertificate, showToast } = useShop();
  const [searchId, setSearchId] = useState("");
  const [searchedCert, setSearchedCert] = useState<VerificationCertificate | null>(null);

  if (!activeCertificate) return null;

  const currentCert = searchedCert || activeCertificate;
  const gradeInfo = CONDITION_GRADES[currentCert.conditionGrade] || CONDITION_GRADES["S"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const found = lookupCertificate(searchId);
    if (found) {
      setSearchedCert(found);
      showToast(`Verified Record found for ID #${found.verificationId}`, "success");
    } else {
      showToast(`No verified record found for ID "${searchId}". Please check ID formatting.`, "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#121212] border-2 border-[#C9A86A]/60 rounded-3xl p-6 sm:p-8 text-[#F8F6F2] shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => {
            setActiveCertificate(null);
            setSearchedCert(null);
          }}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white bg-[#1F1F1F] p-2 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Header Banner */}
        <div className="text-center space-y-2 pb-6 border-b border-[#2A2A2A]">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C9A86A]/10 border border-[#C9A86A]/40 rounded-full text-[#C9A86A] text-2xs font-mono tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5" /> ANIVA Provenance & Verification Record [DEMO DATA]
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <span>Certificate of Authenticity</span>
          </h2>
          <p className="text-xs text-neutral-400 font-light">
            Official multi-point inspection certificate issued for verified pre-owned pieces.
          </p>
        </div>

        {/* Certificate Record Card */}
        <div className="my-6 bg-gradient-to-b from-[#181818] to-[#141414] border border-[#C9A86A]/30 rounded-2xl p-6 space-y-6 relative overflow-hidden shadow-inner">
          {/* Watermark Insignia Background */}
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <Award className="w-72 h-72 text-[#C9A86A]" />
          </div>

          {/* Top Credentials Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">Verification Certificate ID</span>
              <span className="font-mono text-base sm:text-lg font-bold text-[#C9A86A] tracking-wider">
                {currentCert.verificationId}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider border ${gradeInfo.badgeColor}`}>
                Grade {currentCert.conditionGrade} — {gradeInfo.title}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ANIVA Verified
              </span>
            </div>
          </div>

          {/* Product Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div className="space-y-1 bg-[#1A1A1A] p-3.5 rounded-xl border border-[#2A2A2A]">
              <span className="text-2xs text-neutral-400 uppercase font-mono block">Product Item</span>
              <p className="font-bold text-white text-sm">{currentCert.productName}</p>
            </div>
            <div className="space-y-1 bg-[#1A1A1A] p-3.5 rounded-xl border border-[#2A2A2A]">
              <span className="text-2xs text-neutral-400 uppercase font-mono block">Brand & Model</span>
              <p className="font-semibold text-neutral-200">{currentCert.brand} • {currentCert.model}</p>
            </div>
            <div className="space-y-1 bg-[#1A1A1A] p-3.5 rounded-xl border border-[#2A2A2A]">
              <span className="text-2xs text-neutral-400 uppercase font-mono block">Serial / Reference Num</span>
              <p className="font-mono text-[#C9A86A]">{currentCert.serialNumber || "Verified Factory Index"}</p>
            </div>
            <div className="space-y-1 bg-[#1A1A1A] p-3.5 rounded-xl border border-[#2A2A2A]">
              <span className="text-2xs text-neutral-400 uppercase font-mono block">Inspection Date</span>
              <p className="font-mono text-neutral-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#C9A86A]" /> {currentCert.verifiedDate}
              </p>
            </div>
          </div>

          {/* Multi-Point Inspection Checks */}
          <div className="space-y-2">
            <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A] block">
              Inspection Checklist Passed:
            </span>
            <div className="space-y-2 bg-[#121212] p-4 rounded-xl border border-[#2A2A2A]">
              {currentCert.inspectionPassed.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Authenticator Signature & QR Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#262626] bg-[#121212]/50 p-4 rounded-xl">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-2xs font-mono uppercase tracking-widest text-neutral-400 block">Verification Sign-off</span>
              <p className="font-serif italic text-base text-[#C9A86A]">{currentCert.authenticatorName}</p>
              <p className="text-2xs text-neutral-400 font-mono">{currentCert.authenticatorRole}</p>
            </div>

            {/* QR Code Representation */}
            <div className="flex items-center gap-3 bg-[#1A1A1A] px-4 py-2.5 rounded-xl border border-[#C9A86A]/40">
              <QrCode className="w-10 h-10 text-[#C9A86A]" />
              <div className="text-left text-2xs font-mono">
                <span className="text-white font-bold block">Public QR Verification</span>
                <span className="text-neutral-400">/verify/{currentCert.verificationId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Lookup Search Tool */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-[#C9A86A]" />
            Verify another ANIVA Certificate ID:
          </label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. ANV-VER-2026-000842"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C9A86A] font-mono"
            />
            <button
              type="submit"
              className="bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-mono cursor-pointer transition-colors"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
