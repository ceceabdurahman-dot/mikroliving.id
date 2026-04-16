import { NextFunction, Request, Response } from "express";
import { AUTH_COOKIE } from "../config/env";
import { getTrustedRequestOrigin, isTrustedRequestOrigin } from "../security/requestOrigin";

type RequireTrustedOriginOptions = {
  allowBearerWithoutOrigin?: boolean;
  requireWithoutSessionCookie?: boolean;
  requireRequestedWith?: boolean;
};

function hasBearerAuthorization(req: Request) {
  return Boolean(req.headers.authorization?.trim());
}

function hasTrustedAjaxHeader(req: Request) {
  return req.get("x-requested-with")?.trim().toLowerCase() === "xmlhttprequest";
}

function isExplicitCrossSiteBrowserRequest(req: Request) {
  return req.get("sec-fetch-site")?.trim().toLowerCase() === "cross-site";
}

export function requireTrustedOrigin(options: RequireTrustedOriginOptions = {}) {
  const {
    allowBearerWithoutOrigin = true,
    requireWithoutSessionCookie = false,
    requireRequestedWith = false,
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

    if (isExplicitCrossSiteBrowserRequest(req)) {
      res.status(403).json({ error: "Cross-site browser request blocked." });
      return;
    }

    if (requireRequestedWith && !hasTrustedAjaxHeader(req)) {
      res.status(403).json({ error: "Missing trusted request header." });
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
