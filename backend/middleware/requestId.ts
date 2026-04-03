import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";

declare module "express-serve-static-core" {
  interface Request {
    requestId?: string;
  }
}

export function requestId(req: Request, res: Response, next: NextFunction) {
  const incomingRequestId = req.get("x-request-id");
  const id = incomingRequestId && incomingRequestId.trim() ? incomingRequestId.trim() : randomUUID();

  req.requestId = id;
  res.setHeader("X-Request-Id", id);
  next();
}
