import { ContactPayload } from "../types/contact";
import { normalizeString } from "../utils/strings";

export function validateContactPayload(
  payload: unknown,
): { valid: true; data: ContactPayload } | { valid: false; error: string } {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "Contact payload is required." };
  }

  const data = payload as Record<string, unknown>;
  const contact: ContactPayload = {
    name: normalizeString(data.name),
    email: normalizeString(data.email),
    phone: normalizeString(data.phone),
    message: normalizeString(data.message),
  };

  if (contact.name.length < 2) {
    return { valid: false, error: "Name must be at least 2 characters long." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    return { valid: false, error: "A valid email is required." };
  }
  if (contact.message.length < 10) {
    return { valid: false, error: "Message must be at least 10 characters long." };
  }

  return { valid: true, data: contact };
}
