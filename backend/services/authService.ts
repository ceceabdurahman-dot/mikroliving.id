import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticatedUser } from "../types/auth";
import { JWT_SECRET } from "../config/env";
import {
  findUserAuthById,
  findUserByUsername,
  findUserSessionById,
  invalidateUserTokens,
  recordSuccessfulLogin,
  updateUserPasswordAndInvalidateTokens,
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

export async function changeAdminPassword(userId: number, currentPassword: string, newPassword: string) {
  const user = await findUserAuthById(userId);

  if (!user || !user.is_active) {
    return { status: "unauthorized" as const };
  }

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return { status: "invalid_current_password" as const };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await updateUserPasswordAndInvalidateTokens(userId, passwordHash);

  return { status: "success" as const };
}
