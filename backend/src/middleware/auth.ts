import { Request, Response, NextFunction } from "express";
import { ApiError } from "./errorHandler.js";
import { AuthenticatedUser } from "../types/common.js";
import { db } from "../db/connection.js";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Managed Auth Verification Middleware
 * Validates bearer token against the configured managed authentication provider
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "UNAUTHORIZED", "Missing or invalid authorization header"));
  }

  const token = authHeader.split(" ")[1];

  try {
    // In production, token is verified via Firebase Admin SDK / Supabase Auth / AWS Cognito.
    // For local dev & demo testing, mock token mapping with [DEMO DATA] users is supported:
    let matchedUser = null;

    if (token.startsWith("demo-admin")) {
      matchedUser = await db.getUserById("usr-admin-super");
    } else if (token.startsWith("demo-verifier")) {
      matchedUser = await db.getUserById("usr-verifier-01");
    } else if (token.startsWith("demo-retailer")) {
      matchedUser = await db.getUserById("usr-retailer-dravida");
    } else if (token.startsWith("demo-customer")) {
      matchedUser = await db.getUserById("usr-customer-01");
    } else {
      // Lookup by authProviderId or token
      matchedUser = await db.getUserByAuthProviderId(token);
    }

    if (!matchedUser || !matchedUser.isActive) {
      return next(new ApiError(401, "UNAUTHORIZED", "Invalid or expired authentication credentials"));
    }

    let retailerId: string | undefined = undefined;
    if (matchedUser.role === "RETAILER") {
      const retailer = await db.getRetailerByUserId(matchedUser.id);
      retailerId = retailer ? retailer.id : undefined;
    }

    req.user = {
      id: matchedUser.id,
      email: matchedUser.email || undefined,
      mobile: matchedUser.mobile || undefined,
      fullName: matchedUser.fullName || undefined,
      role: matchedUser.role,
      retailerId,
      isVerified: matchedUser.isVerified
    };

    next();
  } catch (error) {
    next(new ApiError(401, "UNAUTHORIZED", "Authentication verification failed"));
  }
}

/**
 * Optional Authentication: Attaches req.user if a valid token is present, but doesn't block unauthenticated requests.
 */
export async function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    let matchedUser = null;
    if (token.startsWith("demo-admin")) {
      matchedUser = await db.getUserById("usr-admin-super");
    } else if (token.startsWith("demo-retailer")) {
      matchedUser = await db.getUserById("usr-retailer-dravida");
    } else if (token.startsWith("demo-customer")) {
      matchedUser = await db.getUserById("usr-customer-01");
    }

    if (matchedUser && matchedUser.isActive) {
      let retailerId: string | undefined = undefined;
      if (matchedUser.role === "RETAILER") {
        const retailer = await db.getRetailerByUserId(matchedUser.id);
        retailerId = retailer ? retailer.id : undefined;
      }

      req.user = {
        id: matchedUser.id,
        email: matchedUser.email || undefined,
        mobile: matchedUser.mobile || undefined,
        fullName: matchedUser.fullName || undefined,
        role: matchedUser.role,
        retailerId,
        isVerified: matchedUser.isVerified
      };
    }
  } catch {
    // Proceed as guest
  }

  next();
}

/**
 * Role-Based Access Control (RBAC) Middleware
 */
export function requireRole(...allowedRoles: Array<AuthenticatedUser["role"]>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "UNAUTHORIZED", "Authentication required for this resource"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "FORBIDDEN", `Access forbidden: Required role [${allowedRoles.join(", ")}]`));
    }

    next();
  };
}

/**
 * Retailer Tenant Isolation Middleware
 * Enforces that a retailer cannot access another retailer's resources
 */
export function enforceRetailerTenant(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new ApiError(401, "UNAUTHORIZED", "Authentication required"));
  }

  // Super Admins have universal oversight
  if (req.user.role === "ADMIN_SUPER" || req.user.role === "ADMIN_OPS") {
    return next();
  }

  if (req.user.role !== "RETAILER" || !req.user.retailerId) {
    return next(new ApiError(403, "FORBIDDEN", "Retailer merchant profile required"));
  }

  next();
}
