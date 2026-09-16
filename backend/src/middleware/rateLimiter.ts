import { Request, Response, NextFunction } from "express";
import { ENV } from "../config/env.js";
import { ApiError } from "./errorHandler.js";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipBuckets = new Map<string, RateLimitRecord>();

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "unknown_ip";
  const now = Date.now();
  const windowMs = ENV.RATE_LIMIT_WINDOW_MS;
  const maxRequests = ENV.RATE_LIMIT_MAX_REQUESTS;

  let record = ipBuckets.get(ip);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + windowMs
    };
    ipBuckets.set(ip, record);
  } else {
    record.count++;
  }

  res.setHeader("X-RateLimit-Limit", maxRequests.toString());
  res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - record.count).toString());
  res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000).toString());

  if (record.count > maxRequests) {
    return next(new ApiError(429, "RATE_LIMIT_EXCEEDED", "Too many requests. Please slow down and try again later."));
  }

  next();
}
