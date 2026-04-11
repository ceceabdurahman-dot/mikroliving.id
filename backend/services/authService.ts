import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticatedUser } from "../types/auth";
import { JWT_SECRET } from "../config/env";
import {
  findUserByUsername,
  findUserSessionById,
  invalidateUserTokens,
  recordSuccessfulLogin,
} from "./authRepository";

export async function loginAdmin(username: string, password: string) {
  const user = await findUserByUsername(username);

  if (!user || !user.is_active || !(await bcrypt.compare(password, user.password))) {
    return null;
  }

  await recordSuccessfulLogin(user.id);

  const payload: AuthenticatedUser = {
    id: user.id,
    username: user.username,
    token_version: user.token_version,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  return { success: true, token };
}

export async function validateAuthenticatedUser(user: AuthenticatedUser) {
  const currentUser = await findUserSessionById(user.id);

  if (!currentUser || !currentUser.is_active) {
    return null;
  }

  if (currentUser.token_version !== user.token_version) {
    return null;
  }

  return {
    id: currentUser.id,
    username: currentUser.username,
    token_version: currentUser.token_version,
  } satisfies AuthenticatedUser;
}

export async function logoutAdmin(userId: number) {
  await invalidateUserTokens(userId);
}
