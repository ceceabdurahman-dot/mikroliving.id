import bcrypt from "bcryptjs";
import { CreateUserPayload, ResetUserPasswordPayload, UpdateUserPayload } from "../types/user";
import {
  countActiveAdmins,
  findAllUsers,
  findUserById,
  insertUser,
  resetUserPasswordById,
  updateUserById,
} from "./userRepository";

type UserMutationResult =
  | { status: "success"; id?: number }
  | { status: "not_found" }
  | { status: "duplicate_username" }
  | { status: "duplicate_email" }
  | { status: "cannot_deactivate_self" }
  | { status: "cannot_change_own_role" }
  | { status: "cannot_reset_self" }
  | { status: "last_active_admin" };

function mapUserMutationError(error: unknown): UserMutationResult {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "ER_DUP_ENTRY"
  ) {
    const message = String((error as { message?: string }).message ?? "").toLowerCase();
    if (message.includes("username")) {
      return { status: "duplicate_username" };
    }

    if (message.includes("email")) {
      return { status: "duplicate_email" };
    }
  }

  throw error;
}

export async function getAdminUsers() {
  return findAllUsers();
}

export async function createAdminUser(payload: CreateUserPayload): Promise<UserMutationResult> {
  const passwordHash = await bcrypt.hash(payload.password, 12);

  try {
    const id = await insertUser(payload, passwordHash);
    return { status: "success", id };
  } catch (error) {
    return mapUserMutationError(error);
  }
}

export async function updateAdminUser(
  actorUserId: number,
  userId: number,
  payload: UpdateUserPayload,
): Promise<UserMutationResult> {
  const existingUser = await findUserById(userId);

  if (!existingUser) {
    return { status: "not_found" };
  }

  if (actorUserId === userId && !payload.is_active) {
    return { status: "cannot_deactivate_self" };
  }

  if (actorUserId === userId && payload.role !== existingUser.role) {
    return { status: "cannot_change_own_role" };
  }

  const removesAdminAccess =
    existingUser.role === "admin" &&
    Boolean(existingUser.is_active) &&
    (!payload.is_active || payload.role !== "admin");

  if (removesAdminAccess) {
    const activeAdminCount = await countActiveAdmins();
    if (activeAdminCount <= 1) {
      return { status: "last_active_admin" };
    }
  }

  try {
    const affectedRows = await updateUserById(userId, payload);
    return affectedRows === 0 ? { status: "not_found" } : { status: "success" };
  } catch (error) {
    return mapUserMutationError(error);
  }
}

export async function resetAdminUserPassword(
  actorUserId: number,
  userId: number,
  payload: ResetUserPasswordPayload,
): Promise<UserMutationResult> {
  const existingUser = await findUserById(userId);

  if (!existingUser) {
    return { status: "not_found" };
  }

  if (actorUserId === userId) {
    return { status: "cannot_reset_self" };
  }

  const passwordHash = await bcrypt.hash(payload.newPassword, 12);
  const affectedRows = await resetUserPasswordById(userId, passwordHash);
  return affectedRows === 0 ? { status: "not_found" } : { status: "success" };
}
