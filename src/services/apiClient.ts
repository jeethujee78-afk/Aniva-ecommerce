// ============================================================================
// ANIVA FRONTEND API CLIENT & COMMERCE ENDPOINTS
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

class ApiClient {
  private baseUrl = "/api/v1";

  public getSessionId(): string {
    let sid = localStorage.getItem("aniva_session_id");
    if (!sid) {
      sid = `ses-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("aniva_session_id", sid);
    }
    return sid;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("aniva_auth_token");
    const sessionId = this.getSessionId();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Session-Id": sessionId
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  public async get<T>(endpoint: string, queryParams?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = `${this.baseUrl}${endpoint}`;
    if (queryParams) {
      const cleanParams: Record<string, string> = {};
      Object.entries(queryParams).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          cleanParams[key] = String(val);
        }
      });
      const queryString = new URLSearchParams(cleanParams).toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeaders()
    });

    return response.json();
  }

  public async post<T>(endpoint: string, body?: any, customHeaders?: Record<string, string>): Promise<ApiResponse<T>> {
    const headers = { ...this.getAuthHeaders(), ...(customHeaders || {}) };
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    return response.json();
  }

  public async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined
    });

    return response.json();
  }

  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: this.getAuthHeaders()
    });

    return response.json();
  }
}

export const apiClient = new ApiClient();

// ============================================================================
// COMMERCE API HELPERS (5.6 - 5.9)
// ============================================================================

export const CommerceApi = {
  // 5.6 Cart
  async getCart() {
    return apiClient.get<any>("/cart");
  },
  async addToCart(payload: { productId: string; variantId: string; quantity: number; customDesign?: any }) {
    return apiClient.post<any>("/cart/items", payload);
  },
  async updateCartQuantity(itemId: string, quantity: number) {
    return apiClient.patch<any>(`/cart/items/${itemId}`, { quantity });
  },
  async removeFromCart(itemId: string) {
    return apiClient.delete<any>(`/cart/items/${itemId}`);
  },
  async clearCart() {
    return apiClient.delete<any>("/cart");
  },
  async reserveCheckout() {
    return apiClient.post<any>("/cart/reserve");
  },

  // 5.7 Orders & Checkout
  async checkout(payload: {
    items: Array<{ productId: string; variantId: string; quantity: number; customDesign?: any }>;
    shippingAddress: any;
    paymentMethod: string;
    couponCode?: string;
    idempotencyKey?: string;
    reservationToken?: string;
  }) {
    const headers: Record<string, string> = {};
    if (payload.idempotencyKey) {
      headers["X-Idempotency-Key"] = payload.idempotencyKey;
    }
    return apiClient.post<any>("/orders/checkout", payload, headers);
  },
  async getOrder(orderId: string) {
    return apiClient.get<any>(`/orders/${orderId}`);
  },
  async getMyOrders() {
    return apiClient.get<any>("/orders/my");
  },
  async trackOrder(query: string) {
    return apiClient.get<any>(`/orders/track/${encodeURIComponent(query)}`);
  },

  // 5.8 Payments
  async initiatePayment(parentOrderId: string, paymentMethod: string) {
    return apiClient.post<any>("/payments/initiate", { parentOrderId, paymentMethod });
  },
  async verifyPayment(parentOrderId: string, transactionId: string, gatewayOrderId?: string) {
    return apiClient.post<any>("/payments/verify", { parentOrderId, transactionId, gatewayOrderId });
  },
  async getPaymentStatus(orderId: string) {
    return apiClient.get<any>(`/payments/status/${orderId}`);
  },

  // 5.9 Returns & Refunds
  async checkReturnEligibility(parentOrderId: string, orderItemId: string) {
    return apiClient.get<any>(`/returns/eligibility/${parentOrderId}/${orderItemId}`);
  },
  async requestReturn(payload: {
    parentOrderId: string;
    orderItemId: string;
    reason: string;
    customerNotes?: string;
    images?: string[];
  }) {
    return apiClient.post<any>("/returns/request", payload);
  },
  async getMyReturns() {
    return apiClient.get<any>("/returns/my");
  }
};
