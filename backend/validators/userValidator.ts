import { isValidHttpUrl, normalizeString } from "../utils/strings";
import { isUserRole, UserRole } from "../types/user";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_.-]{3,50}$/;

function parseUserRole(value: unknown): UserRole | null {
  return isUserRole(value) ? value : null;
}

function parseIsActive(value: unknown, defaultValue = true) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") return true;
    if (normalized === "false" || normalized === "0") return false;
  }

  return defaultValue;
}

function validateUserIdentityFields(payload: unknown) {
  const body = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const username = normalizeString(body.username);
  const email = normalizeString(body.email).toLowerCase();
  const full_name = normalizeString(body.full_name) || null;
  const role = parseUserRole(body.role);
  const avatar_url = normalizeString(body.avatar_url) || null;
  const is_active = parseIsActive(body.is_active, true);

  if (!username || !email || !role) {
    return { valid: false as const, error: "Username, email, and role are required." };
  }

  if (!usernamePattern.test(username)) {
    return {
      valid: false as const,
      error: "Username must be 3-50 characters and only use letters, numbers, dot, dash, or underscore.",
    };
  }

  if (!emailPattern.test(email)) {
    return { valid: false as const, error: "A valid email address is required." };
  }

  if (avatar_url && !isValidHttpUrl(avatar_url)) {
    return { valid: false as const, error: "Avatar URL must start with http:// or https://." };
  }

  return {
    valid: true as const,
    data: {
      username,
      email,
      full_name,
      role,
      avatar_url,
      is_active,
    },
  };
}

export function validateCreateUserPayload(payload: unknown) {
  const baseValidation = validateUserIdentityFields(payload);
  if (!baseValidation.valid) {
    return baseValidation;
  }

  const body = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const password = normalizeString(body.password);
  const confirmPassword = normalizeString(body.confirmPassword);

  if (!password || !confirmPassword) {
    return { valid: false as const, error: "Password and password confirmation are required." };
  }

  if (password.length < 8) {
    return { valid: false as const, error: "Password must be at least 8 characters long." };
  }

  if (password !== confirmPassword) {
    return { valid: false as const, error: "Password confirmation does not match." };
  }

  return {
    valid: true as const,
    data: {
      ...baseValidation.data,
      password,
    },
  };
}

export function validateUpdateUserPayload(payload: unknown) {
  return validateUserIdentityFields(payload);
}

export function validateResetUserPasswordPayload(payload: unknown) {
  const body = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const newPassword = normalizeString(body.newPassword);
  const confirmPassword = normalizeString(body.confirmPassword);

  if (!newPassword || !confirmPassword) {
    return { valid: false as const, error: "New password and confirmation are required." };
  }

  if (newPassword.length < 8) {
    return { valid: false as const, error: "New password must be at least 8 characters long." };
  }

  if (newPassword !== confirmPassword) {
    return { valid: false as const, error: "Password confirmation does not match." };
  }

  return {
    valid: true as const,
    data: { newPassword },
  };
}

export function parseUserId(value: unknown) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return { valid: false as const, error: "A valid user id is required." };
  }

  return { valid: true as const, data: id };
}
