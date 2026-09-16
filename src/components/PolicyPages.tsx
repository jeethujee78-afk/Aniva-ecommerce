import React from "react";
import { Shield, RefreshCw, FileText } from "lucide-react";

export const PrivacyPolicyPage: React.FC = () => (
  <div className="bg-[#0D0D0D] text-[#F8F6F2] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto space-y-6 bg-[#121212] border border-[#222] p-8 rounded-3xl shadow-2xl">
      <div className="flex items-center gap-3 border-b border-[#222] pb-4">
        <Shield className="w-8 h-8 text-[#C9A86A]" />
        <div>
          <span className="text-2xs font-mono text-[#C9A86A] uppercase">Legal & Compliance</span>
          <h1 className="font-serif text-2xl font-bold">Privacy Policy</h1>
        </div>
      </div>
      <div className="text-xs text-neutral-300 space-y-4 font-mono leading-relaxed">
        <p>Last updated: July 2026</p>
        <p>
          At ANIVA (ANIVA Fashion India Pvt. Ltd.), we take your privacy and data security seriously. This privacy policy outlines how we collect, store, and protect your personal information when using our platform.
        </p>

        <h3 className="font-bold text-[#C9A86A] uppercase">1. Information We Collect</h3>
        <p>
          When you place an order or create a custom tee in our Custom Print Studio, we collect your name, shipping address, mobile phone number, email address, and artwork uploads for processing and dispatching through BlueDart and Delhivery.
        </p>

        <h3 className="font-bold text-[#C9A86A] uppercase">2. Payment Security</h3>
        <p>
          We partner with Razorpay for secure 256-bit encrypted transactions. Your credit card details, debit card pins, or UPI passwords are never stored on ANIVA servers.
        </p>

        <h3 className="font-bold text-[#C9A86A] uppercase">3. Customer Rights</h3>
        <p>
          You have the right to inspect, update, or request the deletion of your personal account data at any time by emailing concierge@anivafashion.com.
        </p>
      </div>
    </div>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="bg-[#0D0D0D] text-[#F8F6F2] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto space-y-6 bg-[#121212] border border-[#222] p-8 rounded-3xl shadow-2xl">
      <div className="flex items-center gap-3 border-b border-[#222] pb-4">
        <FileText className="w-8 h-8 text-[#C9A86A]" />
        <div>
          <span className="text-2xs font-mono text-[#C9A86A] uppercase">Legal & Compliance</span>
          <h1 className="font-serif text-2xl font-bold">Terms of Service</h1>
        </div>
      </div>
      <div className="text-xs text-neutral-300 space-y-4 font-mono leading-relaxed">
        <p>Welcome to ANIVA. By accessing or making purchases on anivafashion.com, you agree to comply with the following terms:</p>
        <h3 className="font-bold text-[#C9A86A] uppercase">1. Pricing & Currency</h3>
        <p>All prices listed on ANIVA are in Indian Rupees (INR ₹) and include applicable GST taxes.</p>

        <h3 className="font-bold text-[#C9A86A] uppercase">2. Custom Print Orders</h3>
        <p>
          Custom printed t-shirts generated via our Custom Print Studio are manufactured according to customer artwork submissions. Please review design text and spelling before confirming orders.
        </p>
      </div>
    </div>
  </div>
);

export const RefundPolicyPage: React.FC = () => (
  <div className="bg-[#0D0D0D] text-[#F8F6F2] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto space-y-6 bg-[#121212] border border-[#222] p-8 rounded-3xl shadow-2xl">
      <div className="flex items-center gap-3 border-b border-[#222] pb-4">
        <RefreshCw className="w-8 h-8 text-[#C9A86A]" />
        <div>
          <span className="text-2xs font-mono text-[#C9A86A] uppercase">Customer Protection</span>
          <h1 className="font-serif text-2xl font-bold">Refund & Exchange Policy</h1>
        </div>
      </div>
      <div className="text-xs text-neutral-300 space-y-4 font-mono leading-relaxed">
        <h3 className="font-bold text-[#C9A86A] uppercase">1. Easy 15-Day Hassle-Free Returns</h3>
        <p>
          We offer a 15-day return and size swap window for all un-worn standard catalog items (Plain T-Shirts, Printed T-Shirts, Shoes, Accessories) across South India and Pan-India.
        </p>

        <h3 className="font-bold text-[#C9A86A] uppercase">2. Return Process</h3>
        <p>
          To initiate a exchange, tap WhatsApp support or email concierge@anivafashion.com. Our BlueDart courier will pick up the parcel from your doorstep free of charge.
        </p>

        <h3 className="font-bold text-[#C9A86A] uppercase">3. Refund Timeline</h3>
        <p>
          Once received and inspected at our Chennai fulfillment hub, refunds are credited back to your original payment method within 3–5 working days.
        </p>
      </div>
    </div>
  </div>
);
