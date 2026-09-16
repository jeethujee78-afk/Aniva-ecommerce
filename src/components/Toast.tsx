import React from "react";
import { useShop } from "../context/ShopContext";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border backdrop-blur-md transition-all duration-300 animate-slide-up ${
            toast.type === "success"
              ? "bg-[#0D0D0D]/95 border-[#C9A86A] text-[#F8F6F2]"
              : toast.type === "error"
              ? "bg-red-950/90 border-red-500/50 text-red-100"
              : "bg-[#1A1A1A]/95 border-neutral-700 text-[#F8F6F2]"
          }`}
        >
          {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-[#C9A86A] shrink-0" />}
          {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
          {toast.type === "info" && <Info className="w-5 h-5 text-neutral-400 shrink-0" />}
          <span className="text-sm font-medium tracking-wide">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export const Toast = ToastContainer;
