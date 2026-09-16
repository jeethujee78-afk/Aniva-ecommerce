import { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const logPrefix = statusCode >= 400 ? "WARN" : "INFO";
    console.log(`[${new Date().toISOString()}] [${logPrefix}] ${method} ${originalUrl} ${statusCode} - ${duration}ms (${ip})`);
  });

  next();
}
