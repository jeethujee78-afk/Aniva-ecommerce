import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck, Sparkles, Check } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    isCartOpen,
    setIsCartOpen,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActivePage
  } = useShop();

  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.customDesign ? item.customDesign.calculatedPrice : item.product.price) * item.quantity,
    0
  );

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const freeShippingThreshold = 1999;
  const shippingFee = subtotal >= freeShippingThreshold || cart.length === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      setIsApplying(true);
      await applyCoupon(couponCode);
      setIsApplying(false);
      setCouponCode("");
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setActivePage("checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="bg-[#111111] text-[#F8F6F2] border-l border-[#262626] w-full max-w-md h-full flex flex-col justify-between shadow-2xl">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C9A86A]" />
            <h2 className="font-serif text-lg font-bold tracking-wide">Your Shopping Bag ({cart.length})</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-[#222] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#181818] px-5 py-3 border-b border-[#222222] space-y-1.5">
          <div className="flex items-center justify-between text-2xs font-mono text-neutral-300">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#C9A86A]" />
              {subtotal >= freeShippingThreshold ? (
                <strong className="text-emerald-400">Unlocked Free Express South India Delivery!</strong>
              ) : (
                <span>Add ₹{(freeShippingThreshold - subtotal).toLocaleString()} more for Free Express Delivery</span>
              )}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#262626] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C9A86A] to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-[#222222]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-neutral-400">
              <ShoppingBag className="w-12 h-12 text-neutral-600" />
              <p className="text-xs font-mono">Your shopping bag is currently empty.</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActivePage("shop");
                }}
                className="bg-[#C9A86A] text-[#0D0D0D] font-bold px-6 py-2.5 rounded-full text-xs uppercase"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const itemPrice = item.customDesign ? item.customDesign.calculatedPrice : item.product.price;

              return (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover rounded-xl bg-[#181818] border border-[#2B2B2B] shrink-0"
                  />

                  <div className="flex-1 space-y-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-xs font-bold text-[#F8F6F2] line-clamp-1">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-500 hover:text-red-400 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Specifications */}
                      <div className="text-[11px] text-neutral-400 font-mono space-y-0.5">
                        <p>Size: <strong className="text-neutral-200">{item.selectedSize}</strong> | Color: <strong className="text-neutral-200">{item.selectedColor.name}</strong></p>
                        {item.customDesign && (
                          <span className="text-2xs text-[#C9A86A] font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Custom Print Specs Included
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#2B2B2B] rounded-lg bg-[#181818]">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-[#F8F6F2]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono text-xs font-bold text-[#F8F6F2]">
                        ₹{(itemPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-5 bg-[#141414] border-t border-[#262626] space-y-4">
            {/* Coupon Code Input */}
            {appliedCoupon ? (
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                <span className="flex items-center gap-1 font-mono font-bold">
                  <Check className="w-4 h-4" /> Coupon '{appliedCoupon.code}' Applied (-{appliedCoupon.discountPercentage}%)
                </span>
                <button onClick={removeCoupon} className="text-2xs text-red-400 underline">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleCouponSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Coupon Code (e.g. ANIVA10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-xs text-[#F8F6F2] pl-8 pr-3 py-2 rounded-xl focus:border-[#C9A86A] uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="bg-[#262626] hover:bg-[#C9A86A] hover:text-[#0D0D0D] text-[#F8F6F2] font-bold px-4 py-2 rounded-xl text-xs uppercase font-mono transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs font-mono text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount:</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express South India Shipping:</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#F8F6F2] pt-2 border-t border-[#222222]">
                <span>Total Amount:</span>
                <span className="text-[#C9A86A]">₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleProceedCheckout}
              className="w-full bg-[#C9A86A] hover:bg-[#b89558] text-[#0D0D0D] font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
