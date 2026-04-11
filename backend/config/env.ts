import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;

function requireEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} environment variable is required.`);
  }

  return value;
}

export const JWT_SECRET = requireEnv("JWT_SECRET");

export const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mikroliving",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

function getEnvNumber(name: string, fallback: number) {
  const raw = process.env[name];
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const RATE_LIMITS = {
  adminLogin: {
    windowMs: getEnvNumber("RATE_LIMIT_ADMIN_LOGIN_WINDOW_MS", 15 * 60 * 1000),
    max: getEnvNumber("RATE_LIMIT_ADMIN_LOGIN_MAX", 5),
    keyPrefix: "admin-login",
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
  adminWrite: {
    windowMs: getEnvNumber("RATE_LIMIT_ADMIN_WRITE_WINDOW_MS", 5 * 60 * 1000),
    max: getEnvNumber("RATE_LIMIT_ADMIN_WRITE_MAX", 30),
    keyPrefix: "admin-write",
    message: "Too many admin write requests. Please slow down and try again shortly.",
  },
  adminUpload: {
    windowMs: getEnvNumber("RATE_LIMIT_ADMIN_UPLOAD_WINDOW_MS", 10 * 60 * 1000),
    max: getEnvNumber("RATE_LIMIT_ADMIN_UPLOAD_MAX", 10),
    keyPrefix: "admin-upload",
    message: "Too many image uploads. Please wait a bit before uploading again.",
  },
  contact: {
    windowMs: getEnvNumber("RATE_LIMIT_CONTACT_WINDOW_MS", 10 * 60 * 1000),
    max: getEnvNumber("RATE_LIMIT_CONTACT_MAX", 5),
    keyPrefix: "contact-submit",
    message: "Too many inquiry submissions. Please try again in a few minutes.",
  },
};

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};
