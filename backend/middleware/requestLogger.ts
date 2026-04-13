import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

function getSafePath(req: Request) {
  return req.path || req.originalUrl.split("?")[0] || req.originalUrl;
}

function getQueryKeys(req: Request) {
  return Object.keys(req.query ?? {}).slice(0, 20);
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;
    const queryKeys = getQueryKeys(req);

    logger.info("request_completed", {
      type: "request",
      request_id: req.requestId || "unknown",
      method: req.method,
      path: getSafePath(req),
      status: res.statusCode,
      duration_ms: Number(durationMs.toFixed(2)),
      ip: req.ip || req.socket.remoteAddress || "unknown",
      user_agent: req.get("user-agent") || "unknown",
      ...(queryKeys.length > 0 ? { query_keys: queryKeys } : {}),
    });
  });

  next();
}
