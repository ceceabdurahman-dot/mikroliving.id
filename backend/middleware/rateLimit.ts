import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  windowMs: number;
  max: number;
  keyPrefix: string;
  message: string;
};

export function createRateLimiter(options: RateLimitOptions) {
  const entries = new Map<string, RateLimitEntry>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const key = `${options.keyPrefix}:${ip}`;
    const existing = entries.get(key);

    if (!existing || existing.resetAt <= now) {
      entries.set(key, {
        count: 1,
        resetAt: now + options.windowMs,
      });
      return next();
    }

    if (existing.count >= options.max) {
      const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
      logger.warn("rate_limit_exceeded", {
        request_id: req.requestId || "unknown",
        key: options.keyPrefix,
        ip,
        method: req.method,
        path: req.path,
        retry_after_seconds: retryAfterSeconds,
      });
      res.setHeader("Retry-After", retryAfterSeconds.toString());
      return res.status(429).json({ error: options.message });
    }

    existing.count += 1;
    entries.set(key, existing);
    next();
  };
}
