import React, { useState } from "react";
import { Order } from "../types";
import { Search, Truck, CheckCircle2, Package, Clock, ShieldCheck, MapPin, Layers } from "lucide-react";
import { CommerceApi } from "../services/apiClient";

export const TrackOrderPage: React.FC = () => {
  const [query, setQuery] = useState("ANV-89420");
  const [trackedOrders, setTrackedOrders] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await CommerceApi.trackOrder(query.trim());
      if (res.success && res.data && res.data.length > 0) {
        setTrackedOrders(res.data);
      } else {
        // Fallback to local saved orders
        const savedOrders: Order[] = JSON.parse(localStorage.getItem("aniva_orders") || "[]");
        const found = savedOrders.filter(
          (o) =>
            o.id.toLowerCase() === query.trim().toLowerCase() ||
            o.trackingNumber.toLowerCase() === query.trim().toLowerCase() ||
            o.shippingAddress.phone.includes(query)
        );

        if (found.length > 0) {
          setTrackedOrders(found.map(o => ({ order: o, sellerOrders: [], items: o.items })));
        } else {
          setTrackedOrders(null);
          setErrorMsg("No order found matching this Order ID or phone number. Try 'ANV-89420'");
        }
      }
    } catch {
      // Local search fallback
      const savedOrders: Order[] = JSON.parse(localStorage.getItem("aniva_orders") || "[]");
      const found = savedOrders.filter(
        (o) =>
          o.id.toLowerCase() === query.trim().toLowerCase() ||
          o.trackingNumber.toLowerCase() === query.trim().toLowerCase() ||
          o.shippingAddress.phone.includes(query)
      );

      if (found.length > 0) {
        setTrackedOrders(found.map(o => ({ order: o, sellerOrders: [], items: o.items })));
      } else {
        setErrorMsg("Order not found. Please try searching with ID 'ANV-89420'");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStepProgress = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("deliv")) return 5;
    if (s.includes("out") || s.includes("reach")) return 4;
    if (s.includes("dispatch") || s.includes("transit") || s.includes("ship")) return 3;
    if (s.includes("process")) return 2;
    return 1;
  };

  return (
    <div className="bg-[#0D0D0D] text-[#F8F6F2] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A]">Live Order Status [DEMO DATA]</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">Track Your ANIVA Order</h1>
          <p className="text-xs text-neutral-400 max-w-lg mx-auto">
            Enter your Order ID (e.g. <strong className="text-[#C9A86A] font-mono">ANV-89420</strong>) or registered phone number to check live dispatch, multi-seller packages, and fulfillment status.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleTrack} className="max-w-xl mx-auto flex gap-2 bg-[#121212] p-2 rounded-2xl border border-[#222]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Order ID (ANV-89420) or Phone Number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              className="w-full bg-transparent text-xs text-[#F8F6F2] pl-9 pr-3 py-3 focus:outline-none uppercase font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold px-6 rounded-xl text-xs uppercase font-mono transition-all cursor-pointer"
          >
            {isLoading ? "Locating..." : "Track Order"}
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-200 text-xs font-mono text-center rounded-xl max-w-xl mx-auto">
            {errorMsg}
          </div>
        )}

        {/* Display Tracked Orders */}
        {trackedOrders && trackedOrders.map((entry, i) => {
          const order = entry.order || entry;
          const sellerOrders = entry.sellerOrders || [];
          const items = entry.items || order.items || [];
          const currentStep = getStepProgress(order.orderStatus);

          return (
            <div key={order.id || i} className="bg-[#121212] border border-[#222] rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-6">
                <div>
                  <span className="text-2xs font-mono text-[#C9A86A] uppercase tracking-wider block">Order Reference</span>
                  <h2 className="font-serif text-xl font-bold text-white">{order.orderNumber || order.id}</h2>
                  <p className="text-2xs text-neutral-400 font-mono mt-0.5">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="sm:text-right font-mono text-xs">
                  <span className="text-2xs text-neutral-400 block">Overall Status</span>
                  <span className="text-emerald-400 font-bold text-sm uppercase">{order.orderStatus}</span>
                  <p className="text-2xs text-[#C9A86A] mt-0.5">Payment: {order.paymentStatus || "Paid"}</p>
                </div>
              </div>

              {/* Visual Shipment Timeline */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase text-[#C9A86A]">Shipment Journey Progress</h3>

                <div className="grid grid-cols-5 gap-2 text-center text-2xs font-mono">
                  {["Placed", "Processing", "Dispatched", "Out for Delivery", "Delivered"].map((step, idx) => {
                    const stepNum = idx + 1;
                    const isPassed = stepNum <= currentStep;
                    const isCurrent = stepNum === currentStep;

                    return (
                      <div key={step} className="flex flex-col items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
                            isCurrent
                              ? "bg-[#C9A86A] text-[#0D0D0D] ring-4 ring-[#C9A86A]/30 scale-110"
                              : isPassed
                              ? "bg-emerald-500 text-[#0D0D0D]"
                              : "bg-[#1F1F1F] text-neutral-500"
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                        </div>
                        <span className={isPassed ? "text-neutral-200 font-bold" : "text-neutral-500"}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Multi-Seller Shipments if available */}
              {sellerOrders.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-2xs font-mono uppercase text-[#C9A86A] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Seller Fulfillment Packages ({sellerOrders.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sellerOrders.map((so: any, sIdx: number) => (
                      <div key={so.id || sIdx} className="p-3.5 bg-[#161616] rounded-2xl border border-[#262626] font-mono text-2xs space-y-1.5">
                        <div className="flex justify-between font-bold text-neutral-200">
                          <span>{so.productSource === "ANIVA_STORE" ? "ANIVA Direct" : "Verified Retailer"}</span>
                          <span className="text-emerald-400">{so.orderStatus}</span>
                        </div>
                        <div className="text-neutral-400">Tracking: <span className="text-white">{so.trackingNumber}</span></div>
                        <div className="text-neutral-400">Carrier: {so.courierPartner}</div>
                        <div className="text-neutral-400">Est. Delivery: <span className="text-emerald-400 font-bold">{so.estimatedDelivery}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Details & Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#222] text-xs font-mono">
                <div>
                  <h4 className="text-2xs uppercase text-[#C9A86A] mb-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Destination Address
                  </h4>
                  <p className="text-neutral-300 font-bold">{order.shippingAddress?.fullName}</p>
                  <p className="text-neutral-400">{order.shippingAddress?.addressLine}</p>
                  <p className="text-neutral-400">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                  <p className="text-neutral-400">Phone: {order.shippingAddress?.phone}</p>
                </div>

                <div>
                  <h4 className="text-2xs uppercase text-[#C9A86A] mb-2 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" /> Items in Order ({items.length})
                  </h4>
                  <div className="space-y-2">
                    {items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-neutral-300 border-b border-[#222] pb-1">
                        <span>{item.titleSnapshot || item.productName} ({item.sizeSnapshot || item.selectedSize}) x {item.quantity}</span>
                        <span className="font-bold text-[#F8F6F2]">₹{((item.unitPriceSnapshot || item.price) * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
