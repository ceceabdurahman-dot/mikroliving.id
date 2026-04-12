import { NextFunction, Request, Response } from "express";
import { AUTH_COOKIE } from "../config/env";
import { getTrustedRequestOrigin, isTrustedRequestOrigin } from "../security/requestOrigin";

type RequireTrustedOriginOptions = {
  allowBearerWithoutOrigin?: boolean;
  requireWithoutSessionCookie?: boolean;
};

function hasBearerAuthorization(req: Request) {
  return Boolean(req.headers.authorization?.trim());
}

export function requireTrustedOrigin(options: RequireTrustedOriginOptions = {}) {
  const {
    allowBearerWithoutOrigin = true,
    requireWithoutSessionCookie = false,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
      next();
      return;
    }

    const hasSessionCookie = Boolean(req.cookies?.[AUTH_COOKIE.name]);
    const shouldEnforceOrigin =
      requireWithoutSessionCookie
      || hasSessionCookie
      || !allowBearerWithoutOrigin
      || !hasBearerAuthorization(req);

    if (!shouldEnforceOrigin) {
      next();
      return;
    }

    const requestOrigin = getTrustedRequestOrigin(req.headers.origin, req.headers.referer);

    if (isTrustedRequestOrigin(requestOrigin, req.headers.host)) {
      next();
      return;
    }

    res.status(403).json({ error: "Untrusted request origin." });
  };
}
