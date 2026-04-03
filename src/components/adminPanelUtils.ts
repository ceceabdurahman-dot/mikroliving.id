import { InsightItem, Project, ServiceItem, SiteSetting, TestimonialItem } from "../services/api";
import {
  DraftEnvelope,
  InsightForm,
  ProjectForm,
  ServiceForm,
  TestimonialForm,
} from "./adminPanelTypes";

export const draftKeys = {
  project: "mikroliving.admin.draft.project",
  service: "mikroliving.admin.draft.service",
  insight: "mikroliving.admin.draft.insight",
  testimonial: "mikroliving.admin.draft.testimonial",
  settings: "mikroliving.admin.draft.settings",
  navigation: "mikroliving.admin.draft.navigation-link",
  contact: "mikroliving.admin.draft.contact-channel",
} as const;

const filenameFormatPreferenceKey = "mikroliving.admin.pending-summary.filename-format";

export function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: { data?: unknown } }).response?.data &&
    typeof (error as { response?: { data?: { error?: unknown } } }).response?.data?.error === "string"
  ) {
    return (error as { response: { data: { error: string } } }).response.data.error;
  }
  return fallback;
}

export function toSettingsMap(settings: SiteSetting[]) {
  return settings.reduce<Record<string, string>>((acc, item) => {
    acc[item.setting_key] = item.setting_value ?? "";
    return acc;
  }, {});
}

export function toProjectForm(project: Project): ProjectForm {
  return {
    title: project.title,
    category: project.category,
    location: project.location,
    size: project.size,
    image_url: project.image_url,
    description: project.description || "",
    is_featured: Boolean(project.is_featured),
  };
}

export function toServiceForm(service: ServiceItem): ServiceForm {
  return {
    icon_key: service.icon_key,
    title: service.title,
    description: service.description,
    sort_order: service.sort_order,
    is_active: Boolean(service.is_active),
  };
}

export function toInsightForm(insight: InsightItem): InsightForm {
  return {
    tag: insight.tag,
    title: insight.title,
    excerpt: insight.excerpt,
    content: insight.content || "",
    image_url: insight.image_url || "",
    image_public_id: insight.image_public_id || "",
    author_name: insight.author_name || "",
    is_published: Boolean(insight.is_published),
    sort_order: insight.sort_order,
    published_at: insight.published_at ? insight.published_at.slice(0, 16) : "",
  };
}

export function toTestimonialForm(testimonial: TestimonialItem): TestimonialForm {
  return {
    client_name: testimonial.client_name,
    client_label: testimonial.client_label || "",
    quote: testimonial.quote,
    image_url: testimonial.image_url || "",
    image_public_id: testimonial.image_public_id || "",
    rating: testimonial.rating || 5,
    is_featured: Boolean(testimonial.is_featured),
    sort_order: testimonial.sort_order,
    is_active: Boolean(testimonial.is_active),
  };
}

export function readDraft<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as T | DraftEnvelope<T>;
    if (typeof parsed === "object" && parsed !== null && "value" in parsed) {
      return (parsed as DraftEnvelope<T>).value;
    }

    return parsed as T;
  } catch {
    return fallback;
  }
}

export function readStoredFilenameFormat(): "short" | "full" {
  if (typeof window === "undefined") {
    return "full";
  }

  const stored = window.localStorage.getItem(filenameFormatPreferenceKey);
  return stored === "short" || stored === "full" ? stored : "full";
}

export function writeStoredFilenameFormat(value: "short" | "full") {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(filenameFormatPreferenceKey, value);
}

export function clearStoredFilenameFormat() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(filenameFormatPreferenceKey);
}

export function readDraftUpdatedAt(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as { updatedAt?: unknown };
    return typeof parsed?.updatedAt === "string" ? parsed.updatedAt : null;
  } catch {
    return null;
  }
}

export function writeDraft<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return null;
  }

  const updatedAt = new Date().toISOString();
  const payload: DraftEnvelope<T> = { value, updatedAt };
  window.localStorage.setItem(key, JSON.stringify(payload));
  return updatedAt;
}

export function clearDraft(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}

export function formatDraftTimestamp(value: string | null) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

export function formatPendingSummaryFilename(pendingCount: number, date = new Date()) {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  ) as Record<string, string>;

  const itemLabel = pendingCount === 1 ? "1-item" : `${pendingCount}-items`;
  return `pending-review-summary-${itemLabel}-jakarta-${values.year}-${values.month}-${values.day}_${values.hour}-${values.minute}.txt`;
}

export function formatPendingSummaryShortFilename(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  ) as Record<string, string>;

  return `pending-summary-${values.year}-${values.month}-${values.day}.txt`;
}
