import { InquiryPayload, InquiryStatus } from "../types/inquiry";
import { normalizeString } from "../utils/strings";

const validStatuses = new Set<InquiryStatus>(["new", "read", "replied", "archived"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInquiryPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { valid: false as const, error: "Inquiry payload is required." };
  }

  const body = payload as Record<string, unknown>;
  const inquiry: InquiryPayload = {
    name: normalizeString(body.name),
    email: normalizeString(body.email),
    phone: normalizeString(body.phone),
    message: normalizeString(body.message),
    status: normalizeString(body.status) as InquiryStatus,
    source: normalizeString(body.source) || "website",
    admin_note: normalizeString(body.admin_note),
    replied_at: normalizeString(body.replied_at) || null,
    resolved_at: normalizeString(body.resolved_at) || null,
  };

  if (inquiry.name.length < 2) return { valid: false as const, error: "Inquiry name must be at least 2 characters long." };
  if (!emailPattern.test(inquiry.email)) return { valid: false as const, error: "Inquiry email must be valid." };
  if (inquiry.message.length < 10) return { valid: false as const, error: "Inquiry message must be at least 10 characters long." };
  if (!validStatuses.has(inquiry.status)) return { valid: false as const, error: "Inquiry status is invalid." };
  if ((inquiry.source || "").length < 2) return { valid: false as const, error: "Inquiry source is required." };

  return { valid: true as const, data: inquiry };
}

