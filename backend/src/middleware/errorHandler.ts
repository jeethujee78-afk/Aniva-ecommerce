import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/common.js";
import { ZodError } from "zod";

export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(statusCode: number, code: string, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const timestamp = new Date().toISOString();

  // Zod Validation Errors
  if (err instanceof ZodError) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload parameters",
        details: err.issues.map(e => ({
          field: e.path.join("."),
          message: e.message
        }))
      }
    };
    return res.status(400).json(response);
  }

  // Known ApiError instances
  if (err instanceof ApiError) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    };
    return res.status(err.statusCode).json(response);
  }

  // Unhandled / Internal Errors
  console.error(`[${timestamp}] [INTERNAL_ERROR]`, err);
  const response: ApiResponse = {
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected server error occurred. Please try again."
    }
  };
  return res.status(500).json(response);
}
