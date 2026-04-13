import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/httpError";
import { logger } from "../utils/logger";

type ParserError = Error & {
  status?: number;
  type?: string;
};

function getSafePath(req: Request) {
  return req.path || req.originalUrl.split("?")[0] || req.originalUrl;
}

function summarizeKeys(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const keys = Object.keys(value as Record<string, unknown>).slice(0, 20);
  return keys.length > 0 ? keys : undefined;
}

export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction) {
  void next;

  const requestId = req.requestId || "unknown";
  const bodyKeys = summarizeKeys(req.body);
  const queryKeys = summarizeKeys(req.query);
  const requestMeta = {
    request_id: requestId,
    method: req.method,
    path: getSafePath(req),
    ...(bodyKeys ? { body_keys: bodyKeys } : {}),
    ...(queryKeys ? { query_keys: queryKeys } : {}),
  };

  if (error instanceof HttpError) {
    logger.warn("http_error", {
      ...requestMeta,
      status: error.statusCode,
      error: error.message,
    });

    return res.status(error.statusCode).json({
      error: error.message,
      requestId,
    });
  }

  const parserError = error as ParserError;
  if (parserError?.status === 400 || parserError?.type === "entity.parse.failed") {
    logger.warn("invalid_json_body", {
      ...requestMeta,
      status: 400,
      error: "Invalid JSON body.",
    });

    return res.status(400).json({ error: "Invalid JSON body.", requestId });
  }

  logger.error("unhandled_error", {
    ...requestMeta,
    error,
  });

  return res.status(500).json({ error: "Internal server error.", requestId });
}
