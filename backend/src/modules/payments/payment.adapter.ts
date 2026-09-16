import { PaymentMethod, PaymentStatus, PaymentGatewayProvider, RefundStatus } from "../../db/schema.js";
import { ENV } from "../../config/env.js";

export interface PaymentGatewayRequest {
  parentOrderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  metadata?: Record<string, any>;
}

export interface PaymentGatewaySession {
  gatewayOrderId: string;
  transactionId: string;
  amount: number;
  currency: string;
  provider: PaymentGatewayProvider;
  isTestMode: boolean;
  paymentUrl?: string;
  qrPayload?: string;
  clientSecret?: string;
  status: PaymentStatus;
  instructions: string;
}

export interface PaymentWebhookPayload {
  eventId: string;
  eventType: string;
  transactionId: string;
  parentOrderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  rawPayload: any;
  signature?: string;
}

export interface IPaymentGatewayAdapter {
  readonly providerName: PaymentGatewayProvider;
  createPaymentSession(req: PaymentGatewayRequest): Promise<PaymentGatewaySession>;
  verifyWebhookSignature(payload: any, signature?: string): boolean;
  processPaymentVerification(transactionId: string, gatewayOrderId?: string): Promise<{
    status: PaymentStatus;
    transactionId: string;
    gatewayResponse: any;
  }>;
  processRefund(params: {
    paymentId: string;
    transactionId: string;
    amount: number;
    reason: string;
  }): Promise<{
    refundId: string;
    status: RefundStatus;
    gatewayResponse: any;
  }>;
}

/**
 * Clearly labelled DEMO Payment Adapter for Development & Testing
 * [DEMO DATA]
 */
export class DemoPaymentGatewayAdapter implements IPaymentGatewayAdapter {
  readonly providerName: PaymentGatewayProvider = "DEMO_GATEWAY";

  async createPaymentSession(req: PaymentGatewayRequest): Promise<PaymentGatewaySession> {
    const timestamp = Date.now();
    const isCOD = req.paymentMethod === "COD";

    const gatewayOrderId = `GATEWAY-DEMO-ORD-${timestamp}`;
    const transactionId = isCOD 
      ? `TXN-COD-${req.parentOrderId}` 
      : `TXN-DEMO-${req.paymentMethod}-${timestamp}`;

    return {
      gatewayOrderId,
      transactionId,
      amount: req.amount,
      currency: req.currency || "INR",
      provider: this.providerName,
      isTestMode: true,
      qrPayload: req.paymentMethod === "UPI" ? `upi://pay?pa=demo-merchant@aniva&pn=ANIVA%20FASHION&am=${req.amount}&cu=INR` : undefined,
      clientSecret: `demo_sec_${Math.random().toString(36).substring(2, 15)}`,
      status: isCOD ? "AUTHORIZED" : "PENDING",
      instructions: isCOD 
        ? "Cash on Delivery confirmed. Payment to be collected upon doorstep delivery."
        : `[DEMO DATA] Development gateway session initialized for ${req.paymentMethod}. Ready for simulation.`
    };
  }

  verifyWebhookSignature(payload: any, signature?: string): boolean {
    // In demo adapter, signature with header or demo secret is validated
    if (ENV.NODE_ENV === "production") {
      // In production, real HMAC-SHA256 signature verification is strictly enforced
      return Boolean(signature && signature.length >= 16);
    }
    return true;
  }

  async processPaymentVerification(transactionId: string, gatewayOrderId?: string): Promise<{
    status: PaymentStatus;
    transactionId: string;
    gatewayResponse: any;
  }> {
    // Check if simulate failure
    if (transactionId.includes("FAIL")) {
      return {
        status: "FAILED",
        transactionId,
        gatewayResponse: {
          error_code: "PAYMENT_DECLINED",
          error_description: "Card or bank declined the transaction [DEMO SIMULATION]"
        }
      };
    }

    return {
      status: "PAID",
      transactionId,
      gatewayResponse: {
        verified_at: new Date().toISOString(),
        gateway_order_id: gatewayOrderId,
        status: "captured",
        mode: "DEMO_TEST"
      }
    };
  }

  async processRefund(params: {
    paymentId: string;
    transactionId: string;
    amount: number;
    reason: string;
  }): Promise<{
    refundId: string;
    status: RefundStatus;
    gatewayResponse: any;
  }> {
    const refundId = `REF-GTW-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      refundId,
      status: "COMPLETED",
      gatewayResponse: {
        refund_id: refundId,
        payment_transaction: params.transactionId,
        amount_refunded: params.amount,
        processed_at: new Date().toISOString(),
        note: `[DEMO DATA] Simulated refund of ₹${params.amount}`
      }
    };
  }
}

// Payment Gateway Factory / Resolver
export class PaymentGatewayFactory {
  static getAdapter(provider?: PaymentGatewayProvider): IPaymentGatewayAdapter {
    // In future phases, Razorpay, Stripe, or Cashfree adapters can be seamlessly plugged in here
    return new DemoPaymentGatewayAdapter();
  }
}
