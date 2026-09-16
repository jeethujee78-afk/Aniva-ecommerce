import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { requestLogger } from "./middleware/requestLogger.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, ApiError } from "./middleware/errorHandler.js";
import v1Routes from "./routes/v1.routes.js";
import { ENV } from "./config/env.js";

export function createApp(): Express {
  const app = express();

  // 1. Security Headers & CORS
  app.use(
    helmet({
      contentSecurityPolicy: false, // Vite SPA handles frontend assets in dev/preview
      crossOriginEmbedderPolicy: false
    })
  );

  app.use(
    cors({
      origin: ENV.CORS_ORIGIN === "*" ? true : ENV.CORS_ORIGIN.split(","),
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-RateLimit-Limit"]
    })
  );

  // 2. Request Parsers
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // 3. Request Telemetry & Rate Limiting
  app.use(requestLogger);
  app.use("/api/", rateLimiter);

  // 4. API Versioning Mount (/api/v1)
  app.use("/api/v1", v1Routes);

  // 5. Root Health Check
  app.get("/health", (req, res) => {
    res.json({ status: "ok", app: "ANIVA Backend", time: new Date().toISOString() });
  });

  return app;
}

export default createApp;
