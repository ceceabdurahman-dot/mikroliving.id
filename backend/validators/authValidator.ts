import { normalizeString } from "../utils/strings";

export function validateLoginPayload(payload: unknown) {
  const body = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const username = normalizeString(body.username);
  const password = normalizeString(body.password);

  if (!username || !password) {
    return { valid: false as const, error: "Username and password are required." };
  }

  return {
    valid: true as const,
    data: { username, password },
  };
}

export function validateChangePasswordPayload(payload: unknown) {
  const body = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const currentPassword = normalizeString(body.currentPassword);
  const newPassword = normalizeString(body.newPassword);
  const confirmPassword = normalizeString(body.confirmPassword);

  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      valid: false as const,
      error: "Current password, new password, and confirmation are required.",
    };
  }

  if (newPassword.length < 8) {
    return {
      valid: false as const,
      error: "New password must be at least 8 characters long.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      valid: false as const,
      error: "New password and confirmation do not match.",
    };
  }

  if (newPassword === currentPassword) {
    return {
      valid: false as const,
      error: "New password must be different from the current password.",
    };
  }

  return {
    valid: true as const,
    data: { currentPassword, newPassword },
  };
}

export function parseProjectId(value: unknown) {
  const projectId = Number(value);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return { valid: false as const, error: "Invalid project id." };
  }

  return { valid: true as const, data: projectId };
}

export function validateImageUploadPayload(payload: unknown) {
  const body = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const fileName = body.fileName;
  const dataUrl = body.dataUrl;

  if (!fileName || typeof fileName !== "string" || !dataUrl || typeof dataUrl !== "string") {
    return { valid: false as const, error: "Image payload is required." };
  }

  if (!dataUrl.startsWith("data:image/")) {
    return { valid: false as const, error: "Only image uploads are supported." };
  }

  return {
    valid: true as const,
    data: { fileName, dataUrl },
  };
}
