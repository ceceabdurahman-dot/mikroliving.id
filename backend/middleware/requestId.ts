import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";

declare module "express-serve-static-core" {
  interface Request {
    requestId?: string;
  }
}

const REQUEST_ID_PATTERN = /^[A-Za-z0-9._:-]{8,128}$/;

function getSafeIncomingRequestId(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed || !REQUEST_ID_PATTERN.test(trimmed)) {
    return null;
  }

  return trimmed;
}

export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = getSafeIncomingRequestId(req.get("x-request-id")) ?? randomUUID();

  req.requestId = id;
  res.setHeader("X-Request-Id", id);
  next();
}
