import { CORS_ALLOWED_ORIGINS } from "../config/env";

function normalizeOrigin(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

const trustedOrigins = CORS_ALLOWED_ORIGINS
  .map((origin) => normalizeOrigin(origin) ?? origin)
  .filter(Boolean);

export function getTrustedRequestOrigin(origin: string | undefined, referer: string | undefined) {
  if (origin) {
    return normalizeOrigin(origin) ?? undefined;
  }

  if (!referer) {
    return undefined;
  }

  try {
    return new URL(referer).origin;
  } catch {
    return undefined;
  }
}

export function isTrustedRequestOrigin(origin: string | undefined, host: string | undefined) {
  if (!origin) {
    return false;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) {
    return false;
  }

  try {
    const originUrl = new URL(normalizedOrigin);
    if (host && originUrl.host === host) {
      return true;
    }
  } catch {
    return false;
  }

  return trustedOrigins.includes(normalizedOrigin);
}
