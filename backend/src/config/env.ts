import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: isProduction,
  PORT: parseInt(process.env.PORT || "3000", 10),

  // Database Configuration (Development default: In-memory repository with SEED data)
  DATABASE_URL: process.env.DATABASE_URL || "",
  HAS_EXTERNAL_DB: Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0),

  // Redis / Caching Configuration (Development default: In-memory sliding window cache)
  REDIS_URL: process.env.REDIS_URL || "",
  HAS_EXTERNAL_REDIS: Boolean(process.env.REDIS_URL && process.env.REDIS_URL.trim().length > 0),

  // Managed Auth Configuration ('firebase' | 'supabase' | 'cognito' | 'demo')
  AUTH_PROVIDER: process.env.AUTH_PROVIDER || "demo",
  AUTH_PROJECT_ID: process.env.AUTH_PROJECT_ID || "",
  HAS_MANAGED_AUTH: Boolean(process.env.AUTH_PROJECT_ID && process.env.AUTH_PROJECT_ID.trim().length > 0),

  // Security & Rate Limiting
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10), // 1 minute
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "120", 10),

  // Regional Architecture Targets (South India / Mumbai ap-south-1)
  APP_NAME: "ANIVA",
  API_VERSION: "v1",
  PRIMARY_REGION: "ap-south-1",

  // Commerce Engine Configurable Policies [Configurable Business Rules]
  INVENTORY_RESERVATION_TTL_MINUTES: parseInt(process.env.INVENTORY_RESERVATION_TTL_MINUTES || "15", 10),
  FREE_SHIPPING_THRESHOLD: parseInt(process.env.FREE_SHIPPING_THRESHOLD || "1999", 10),
  DEFAULT_SHIPPING_FEE: parseInt(process.env.DEFAULT_SHIPPING_FEE || "99", 10),
  DEFAULT_COMMISSION_RATE: parseInt(process.env.DEFAULT_COMMISSION_RATE || "15", 10)
};

/**
 * Print development environment diagnostic on bootstrap
 */
export function logEnvironmentDiagnostics() {
  const dbStatus = ENV.HAS_EXTERNAL_DB 
    ? "Connected via DATABASE_URL" 
    : "Development In-Memory Adapter (Seed Datasets Active)";
  
  const redisStatus = ENV.HAS_EXTERNAL_REDIS 
    ? "Connected via REDIS_URL" 
    : "Development In-Memory Cache & Rate Limiter Active";

  const authStatus = ENV.HAS_MANAGED_AUTH 
    ? `Managed Auth (${ENV.AUTH_PROVIDER}) [Project: ${ENV.AUTH_PROJECT_ID}]`
    : `Development Mode (${ENV.AUTH_PROVIDER}) - Demo Tokens Supported`;

  console.log(`[ANIVA Backend Config] Environment: ${ENV.NODE_ENV}`);
  console.log(`[ANIVA Backend Config] Database: ${dbStatus}`);
  console.log(`[ANIVA Backend Config] Caching/Redis: ${redisStatus}`);
  console.log(`[ANIVA Backend Config] Auth Provider: ${authStatus}`);
}
