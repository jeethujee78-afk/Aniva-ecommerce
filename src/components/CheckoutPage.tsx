import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { OrderItem, ShippingAddress, Order } from "../types";
import { ShieldCheck, Truck, CreditCard, CheckCircle2, ArrowRight, Lock, MapPin, AlertCircle, RefreshCw } from "lucide-react";
import { CommerceApi } from "../services/apiClient";

export const CheckoutPage: React.FC = () => {
  const { cart, appliedCoupon, addOrder, clearCart, setActivePage, showToast } = useShop();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "Jeethu Jeevan",
    phone: "+91 98401 98765",
    email: "jeethujee78@gmail.com",
    addressLine: "Flat 4B, Emerald Residency, Nungambakkam High Rd",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600034",
    landmark: "Near Taj Coromandel"
  });

  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NET_BANKING" | "COD">("UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<string>("");
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.customDesign ? item.customDesign.calculatedPrice : item.product.price) * item.quantity,
    0
  );
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingFee = subtotal >= 1999 || cart.length === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAddress({ ...address, state: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Inventory Reservation
      setCheckoutStep("Reserving real-time inventory...");
      let reservationToken: string | undefined;
      try {
        const resResponse = await CommerceApi.reserveCheckout();
        if (resResponse.success && resResponse.data?.reservationToken) {
          reservationToken = resResponse.data.reservationToken;
        }
      } catch {
        // Continue if guest session reservation falls back to transactional commit
      }

      // 2. Prepare items for backend validation
      const itemsPayload = cart.map((item) => {
        // Find variant ID or generate deterministic fallback
        const variantId = (item.product.variants && item.product.variants[0]?.id) || `${item.product.id}-var-${item.selectedSize.toLowerCase()}`;
        return {
          productId: item.product.id,
          variantId,
          quantity: item.quantity,
          customDesign: item.customDesign
        };
      });

      const idempotencyKey = `chk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      // 3. Create Unified Parent Order & Split Multi-Seller Child Orders
      setCheckoutStep("Generating multi-seller order & price verification...");
      const orderRes = await CommerceApi.checkout({
        items: itemsPayload,
        shippingAddress: address,
        paymentMethod,
        couponCode: appliedCoupon?.code,
        idempotencyKey,
        reservationToken
      });

      if (!orderRes.success || !orderRes.data?.order) {
        throw new Error(orderRes.error?.message || "Failed to process checkout with commerce engine");
      }

      const createdParentOrder = orderRes.data.order;
      const childSellerOrders = orderRes.data.sellerOrders || [];

      // 4. Initiate Payment via Gateway Abstraction Layer
      setCheckoutStep("Connecting to payment gateway adapter...");
      const payRes = await CommerceApi.initiatePayment(createdParentOrder.id, paymentMethod);

      if (!payRes.success || !payRes.data) {
        throw new Error(payRes.error?.message || "Failed to initialize payment session");
      }

      const { payment, session } = payRes.data;

      // 5. Verify Payment (using DEMO payment adapter for development)
      setCheckoutStep("Verifying payment ledger & authorizing...");
      const verifyRes = await CommerceApi.verifyPayment(
        createdParentOrder.id,
        session.transactionId,
        session.gatewayOrderId
      );

      if (!verifyRes.success) {
        throw new Error(verifyRes.error?.message || "Payment verification failed");
      }

      // 6. Map to frontend state & clear bag
      const clientOrder: Order = {
        id: createdParentOrder.orderNumber || createdParentOrder.id,
        createdAt: createdParentOrder.createdAt,
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.customDesign ? item.customDesign.calculatedPrice : item.product.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor.name,
          image: item.product.images[0],
          customDesign: item.customDesign
        })),
        shippingAddress: address,
        subtotal: createdParentOrder.subtotal,
        discount: createdParentOrder.discount,
        shippingFee: createdParentOrder.shippingFee,
        total: createdParentOrder.total,
        paymentMethod: paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod === "UPI" ? "UPI Direct" : "Card / Net Banking",
        paymentStatus: paymentMethod === "COD" ? "COD Confirmed" : "Paid",
        orderStatus: "Placed",
        trackingNumber: childSellerOrders[0]?.trackingNumber || "BD-TN-" + Math.floor(1000000 + Math.random() * 9000000),
        estimatedDelivery: childSellerOrders[0]?.estimatedDelivery || new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
        courierPartner: childSellerOrders[0]?.courierPartner || "South Express Logistics"
      };

      addOrder(clientOrder);
      setCompletedOrder({
        parentOrder: createdParentOrder,
        sellerOrders: childSellerOrders,
        clientOrder
      });
      clearCart();
      showToast("Order confirmed and authorized successfully!", "success");
    } catch (err: any) {
      setErrorMessage(err.message || "Checkout error occurred");
      showToast(err.message || "Checkout could not be completed", "error");
    } finally {
      setIsSubmitting(false);
      setCheckoutStep("");
    }
  };

  // If order is completed, display Order Confirmation View with Multi-Seller Fulfillment
  if (completedOrder) {
    const { parentOrder, sellerOrders, clientOrder } = completedOrder;

    return (
      <div className="bg-[#0D0D0D] text-[#F8F6F2] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-[#121212] border border-[#222] rounded-3xl p-8 space-y-6 text-center shadow-2xl">
          <div className="w-16 h-16 bg-[#C9A86A]/20 text-[#C9A86A] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A]">
              Order Confirmed & Payment Authorized
            </span>
            <h1 className="font-serif text-3xl font-bold">Thank You For Your Order!</h1>
            <p className="text-xs text-neutral-400">
              Order No: <strong className="text-white font-mono">{parentOrder.orderNumber}</strong> | Order ID: <strong className="text-neutral-300 font-mono">{parentOrder.id}</strong>
            </p>
          </div>

          {/* Multi-Seller Fulfillment Breakdown */}
          <div className="space-y-3 text-left">
            <h3 className="text-2xs font-mono uppercase tracking-widest text-neutral-400">
              Fulfillment Packages ({sellerOrders.length} Shipments)
            </h3>
            {sellerOrders.map((so: any, idx: number) => (
              <div key={so.id} className="p-4 bg-[#181818] rounded-2xl border border-[#262626] text-xs space-y-1.5 font-mono">
                <div className="flex justify-between items-center border-b border-[#2B2B2B] pb-2">
                  <span className="text-[#C9A86A] font-bold">Package {idx + 1}: {so.productSource === "ANIVA_STORE" ? "ANIVA Direct" : "Verified Retailer Partner"}</span>
                  <span className="text-emerald-400 text-2xs px-2 py-0.5 bg-emerald-950/40 rounded border border-emerald-800/40">{so.orderStatus}</span>
                </div>
                <div className="flex justify-between text-2xs text-neutral-400 pt-1">
                  <span>Tracking Number:</span>
                  <span className="text-white">{so.trackingNumber}</span>
                </div>
                <div className="flex justify-between text-2xs text-neutral-400">
                  <span>Courier Partner:</span>
                  <span className="text-white">{so.courierPartner}</span>
                </div>
                <div className="flex justify-between text-2xs text-neutral-400">
                  <span>Estimated Delivery:</span>
                  <span className="text-emerald-400 font-bold">{so.estimatedDelivery}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#181818] rounded-2xl border border-[#262626] text-left text-xs space-y-2 font-mono">
            <div className="flex justify-between border-b border-[#2B2B2B] pb-2">
              <span className="text-neutral-400">Delivery Address:</span>
              <span className="text-neutral-200 text-right">{clientOrder.shippingAddress.fullName}, {clientOrder.shippingAddress.city}, {clientOrder.shippingAddress.state}</span>
            </div>
            <div className="flex justify-between pt-1 font-bold text-sm">
              <span>Total Paid ({parentOrder.paymentMethod}):</span>
              <span className="text-[#C9A86A]">₹{parentOrder.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => setActivePage("track-order")}
              className="flex-1 bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold py-3.5 rounded-xl text-xs uppercase font-mono transition-all cursor-pointer"
            >
              Track Order Live
            </button>
            <button
              onClick={() => setActivePage("shop")}
              className="flex-1 bg-[#1A1A1A] hover:bg-[#252525] text-[#F8F6F2] border border-[#333] font-bold py-3.5 rounded-xl text-xs uppercase font-mono transition-all cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0D0D] text-[#F8F6F2] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="border-b border-[#222222] pb-6 flex items-center justify-between">
          <div>
            <span className="text-2xs font-mono uppercase tracking-widest text-[#C9A86A]">ANIVA Commerce Engine (5.6 - 5.9)</span>
            <h1 className="font-serif text-3xl font-bold">Secure Order Checkout</h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
            <Lock className="w-4 h-4 text-[#C9A86A]" /> 256-Bit SSL Encrypted
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-950/40 border border-red-800/60 p-4 rounded-2xl flex items-center gap-3 text-xs text-red-200">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Shipping & Payment Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Shipping Address */}
            <div className="bg-[#121212] border border-[#222222] rounded-3xl p-6 space-y-4 shadow-xl">
              <h2 className="font-serif text-lg font-bold text-[#C9A86A] flex items-center gap-2">
                <MapPin className="w-5 h-5" /> 1. Shipping Address (South India & Pan-India)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-2xs font-mono uppercase text-neutral-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-2xs font-mono uppercase text-neutral-400 block mb-1">Mobile Phone (For Dispatch Alerts)</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-2xs font-mono uppercase text-neutral-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-2xs font-mono uppercase text-neutral-400 block mb-1">Flat / Building / Street Address</label>
                  <input
                    type="text"
                    required
                    value={address.addressLine}
                    onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-2xs font-mono uppercase text-neutral-400 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-2xs font-mono uppercase text-neutral-400 block mb-1">State</label>
                  <select
                    value={address.state}
                    onChange={handleStateChange}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A]"
                  >
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi / NCR</option>
                    <option value="Rest of India">Other State / UT</option>
                  </select>
                </div>

                <div>
                  <label className="text-2xs font-mono uppercase text-neutral-400 block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-2xs font-mono uppercase text-neutral-400 block mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={address.landmark}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F8F6F2] p-2.5 rounded-xl focus:border-[#C9A86A] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Options Selection */}
            <div className="bg-[#121212] border border-[#222222] rounded-3xl p-6 space-y-4 shadow-xl">
              <h2 className="font-serif text-lg font-bold text-[#C9A86A] flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> 2. Payment Options (India Supported)
              </h2>

              <div className="space-y-3 text-xs">
                {/* Option 1: Instant UPI */}
                <label
                  onClick={() => setPaymentMethod("UPI")}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === "UPI" ? "bg-[#1C1810] border-[#C9A86A]" : "bg-[#181818] border-[#2B2B2B]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={paymentMethod === "UPI"} onChange={() => {}} className="accent-[#C9A86A]" />
                    <div>
                      <h4 className="font-bold text-[#F8F6F2]">Instant UPI Payment (GPay / PhonePe / Paytm / BHIM)</h4>
                      <p className="text-2xs text-neutral-400">Secure gateway adapter session (Demo / Test Simulation)</p>
                    </div>
                  </div>
                  <span className="text-2xs text-[#C9A86A] font-mono font-bold bg-[#C9A86A]/10 px-2.5 py-1 rounded-full">
                    Fastest
                  </span>
                </label>

                {/* Option 2: Card / Net Banking */}
                <label
                  onClick={() => setPaymentMethod("CARD")}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === "CARD" ? "bg-[#1C1810] border-[#C9A86A]" : "bg-[#181818] border-[#2B2B2B]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={paymentMethod === "CARD"} onChange={() => {}} className="accent-[#C9A86A]" />
                    <div>
                      <h4 className="font-bold text-[#F8F6F2]">Credit / Debit Cards & Net Banking</h4>
                      <p className="text-2xs text-neutral-400">Visa, Mastercard, RuPay, Maestro & Net Banking</p>
                    </div>
                  </div>
                </label>

                {/* Option 3: Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === "COD" ? "bg-[#1C1810] border-[#C9A86A]" : "bg-[#181818] border-[#2B2B2B]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={paymentMethod === "COD"} onChange={() => {}} className="accent-[#C9A86A]" />
                    <div>
                      <h4 className="font-bold text-[#F8F6F2]">Cash on Delivery (COD)</h4>
                      <p className="text-2xs text-neutral-400">Pay upon doorstep delivery (Subject to pincode eligibility)</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 bg-[#121212] border border-[#222222] rounded-3xl p-6 space-y-6 h-fit sticky top-28 shadow-xl">
            <h2 className="font-serif text-lg font-bold text-[#C9A86A]">Order Summary ({cart.length} Items)</h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 divide-y divide-[#222222]">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <img src={item.product.images[0]} alt="" className="w-12 h-14 object-cover rounded-lg bg-[#181818]" />
                    <div>
                      <p className="font-bold text-[#F8F6F2] line-clamp-1">{item.product.name}</p>
                      <p className="text-2xs text-neutral-400">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                      <p className="text-2xs text-[#C9A86A]">{item.sellerId && item.sellerId.includes("RET") ? "Verified Retailer Partner" : "ANIVA Direct"}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#F8F6F2]">
                    ₹{((item.customDesign ? item.customDesign.calculatedPrice : item.product.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#222222] space-y-2 text-xs font-mono text-neutral-400">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Applied Coupon Discount:</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Courier Shipping:</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#F8F6F2] pt-3 border-t border-[#2A2A2A]">
                <span>Total Amount Due:</span>
                <span className="text-[#C9A86A]">₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold py-4 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{checkoutStep || "Processing Commerce Transaction..."}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm & Authorize ₹{finalTotal.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
