import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AUTH_COOKIE, JWT_SECRET } from "../config/env";
import { validateAuthenticatedUser } from "../services/authService";
import { AuthenticatedUser } from "../types/auth";
import { isUserRole, UserRole } from "../types/user";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthenticatedUser;
  }
}

function isAuthenticatedUser(value: unknown): value is AuthenticatedUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as Partial<AuthenticatedUser>;

  return Number.isInteger(user.id)
    && typeof user.username === "string"
    && isUserRole(user.role)
    && Number.isInteger(user.token_version);
}

function respondUnauthorized(res: Response) {
  return res.status(401).json({ error: "Unauthorized" });
}

function respondForbidden(res: Response) {
  return res.status(403).json({ error: "Forbidden" });
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1] || req.cookies?.[AUTH_COOKIE.name];

  if (!token) {
    return respondUnauthorized(res);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!isAuthenticatedUser(decoded)) {
      return respondUnauthorized(res);
    }

    const authenticatedUser = await validateAuthenticatedUser(decoded);

    if (!authenticatedUser) {
      return respondUnauthorized(res);
    }

    req.user = {
      ...authenticatedUser,
      iat: decoded.iat,
      exp: decoded.exp,
    };

    next();
  } catch {
    return respondUnauthorized(res);
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return respondUnauthorized(res);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return respondForbidden(res);
    }

    next();
  };
}

export const requireAdmin = requireRole("superadmin", "admin");
