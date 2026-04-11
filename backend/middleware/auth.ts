import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { validateAuthenticatedUser } from "../services/authService";
import { AuthenticatedUser } from "../types/auth";

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
    && Number.isInteger(user.token_version);
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!isAuthenticatedUser(decoded)) {
      return res.sendStatus(403);
    }

    const authenticatedUser = await validateAuthenticatedUser(decoded);

    if (!authenticatedUser) {
      return res.sendStatus(403);
    }

    req.user = {
      ...authenticatedUser,
      iat: decoded.iat,
      exp: decoded.exp,
    };

    next();
  } catch {
    return res.sendStatus(403);
  }
}
