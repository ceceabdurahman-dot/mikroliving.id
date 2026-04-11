import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;

    logger.info("request_completed", {
      type: "request",
      request_id: req.requestId || "unknown",
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration_ms: Number(durationMs.toFixed(2)),
      ip: req.ip || req.socket.remoteAddress || "unknown",
      user_agent: req.get("user-agent") || "unknown",
    });
  });

  next();
}
