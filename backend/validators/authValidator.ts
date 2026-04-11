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
