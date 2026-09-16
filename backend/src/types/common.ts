export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    [key: string]: any;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AuthenticatedUser {
  id: string;
  email?: string;
  mobile?: string;
  fullName?: string;
  role: 'CUSTOMER' | 'RETAILER' | 'ADMIN_SUPER' | 'ADMIN_OPS' | 'ADMIN_VERIFIER' | 'ADMIN_FINANCE';
  retailerId?: string; // Set only if role is RETAILER
  isVerified: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}
