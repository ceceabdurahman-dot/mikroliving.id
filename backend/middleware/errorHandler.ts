import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/httpError";
import { logger } from "../utils/logger";

type ParserError = Error & {
  status?: number;
  type?: string;
};

export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction) {
  void next;

  const requestId = req.requestId || "unknown";

  if (error instanceof HttpError) {
    logger.warn("http_error", {
      request_id: requestId,
      method: req.method,
      path: req.originalUrl,
      status: error.statusCode,
      error: error.message,
      body: req.body,
      query: req.query,
    });

    return res.status(error.statusCode).json({
      error: error.message,
      requestId,
    });
  }

  const parserError = error as ParserError;
  if (parserError?.status === 400 || parserError?.type === "entity.parse.failed") {
    logger.warn("invalid_json_body", {
      request_id: requestId,
      method: req.method,
      path: req.originalUrl,
      status: 400,
      error: "Invalid JSON body.",
    });

    return res.status(400).json({ error: "Invalid JSON body.", requestId });
  }

  logger.error("unhandled_error", {
    request_id: requestId,
    method: req.method,
    path: req.originalUrl,
    body: req.body,
    query: req.query,
    error,
  });

  return res.status(500).json({ error: "Internal server error.", requestId });
}
