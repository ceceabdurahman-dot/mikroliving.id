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
  keyGenerator?: (req: Request) => string;
  maxEntries?: number;
  cleanupIntervalMs?: number;
};

const DEFAULT_MAX_ENTRIES = 10_000;
const DEFAULT_CLEANUP_INTERVAL_MS = 60_000;

function normalizeKeyPart(value: string) {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9_.:@-]+/gi, "_");
  return normalized.slice(0, 160) || "unknown";
}

function getClientIp(req: Request) {
  return normalizeKeyPart(req.ip || req.socket.remoteAddress || "unknown");
}

export function createRateLimiter(options: RateLimitOptions) {
  const entries = new Map<string, RateLimitEntry>();
  let lastCleanupAt = 0;

  function cleanupEntries(now: number) {
    const cleanupIntervalMs = options.cleanupIntervalMs ?? DEFAULT_CLEANUP_INTERVAL_MS;
    const maxEntries = options.maxEntries ?? DEFAULT_MAX_ENTRIES;

    if (now - lastCleanupAt < cleanupIntervalMs && entries.size < maxEntries) {
      return;
    }

    for (const [key, entry] of entries.entries()) {
      if (entry.resetAt <= now) {
        entries.delete(key);
      }
    }

    lastCleanupAt = now;

    while (entries.size >= maxEntries) {
      const oldestKey = entries.keys().next().value;

      if (!oldestKey) {
        break;
      }

      entries.delete(oldestKey);
    }
  }

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    cleanupEntries(now);

    const keySuffix = options.keyGenerator
      ? normalizeKeyPart(options.keyGenerator(req))
      : getClientIp(req);
    const ip = getClientIp(req);
    const key = `${options.keyPrefix}:${keySuffix}`;
    const existing = entries.get(key);

    if (!existing || existing.resetAt <= now) {
      const nextEntry = {
        count: 1,
        resetAt: now + options.windowMs,
      };
      entries.set(key, nextEntry);
      res.setHeader("X-RateLimit-Limit", options.max.toString());
      res.setHeader("X-RateLimit-Remaining", Math.max(0, options.max - nextEntry.count).toString());
      res.setHeader("X-RateLimit-Reset", Math.ceil(nextEntry.resetAt / 1000).toString());
      return next();
    }

    if (existing.count >= options.max) {
      const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
      res.setHeader("X-RateLimit-Limit", options.max.toString());
      res.setHeader("X-RateLimit-Remaining", "0");
      res.setHeader("X-RateLimit-Reset", Math.ceil(existing.resetAt / 1000).toString());
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
    res.setHeader("X-RateLimit-Limit", options.max.toString());
    res.setHeader("X-RateLimit-Remaining", Math.max(0, options.max - existing.count).toString());
    res.setHeader("X-RateLimit-Reset", Math.ceil(existing.resetAt / 1000).toString());
    next();
  };
}
