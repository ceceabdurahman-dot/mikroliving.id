import { parseProjectId } from "./authValidator";
import {
  ContactChannelPayload,
  InsightPayload,
  NavigationLinkPayload,
  ServicePayload,
  SiteSettingPayload,
  TestimonialPayload,
} from "../types/cms";
import { isValidHttpUrl, normalizeString } from "../utils/strings";

function parseSortOrder(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
}

function optionalUrl(value: unknown) {
  const normalized = normalizeString(value);
  if (!normalized) {
    return "";
  }

  return isValidHttpUrl(normalized) ? normalized : null;
}

export function parseCmsEntityId(value: unknown, label = "content") {
  const result = parseProjectId(value);

  if (!result.valid) {
    return { valid: false as const, error: `Invalid ${label} id.` };
  }

  return result;
}

export function validateServicePayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { valid: false as const, error: "Service payload is required." };
  }

  const body = payload as Record<string, unknown>;
  const service: ServicePayload = {
    icon_key: normalizeString(body.icon_key),
    title: normalizeString(body.title),
    description: normalizeString(body.description),
    sort_order: parseSortOrder(body.sort_order),
    is_active: body.is_active !== false,
  };

  if (service.icon_key.length < 2) return { valid: false as const, error: "Service icon key is required." };
  if (service.title.length < 3) return { valid: false as const, error: "Service title must be at least 3 characters long." };
  if (service.description.length < 10 || service.description.length > 255) return { valid: false as const, error: "Service description must be between 10 and 255 characters." };

  return { valid: true as const, data: service };
}

export function validateInsightPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { valid: false as const, error: "Insight payload is required." };
  }

  const body = payload as Record<string, unknown>;
  const imageUrl = optionalUrl(body.image_url);
  if (imageUrl === null) return { valid: false as const, error: "Insight image URL must be a valid http or https address." };

  const insight: InsightPayload = {
    tag: normalizeString(body.tag),
    title: normalizeString(body.title),
    excerpt: normalizeString(body.excerpt),
    content: normalizeString(body.content),
    image_url: imageUrl,
    image_public_id: normalizeString(body.image_public_id),
    author_name: normalizeString(body.author_name),
    is_published: body.is_published !== false,
    sort_order: parseSortOrder(body.sort_order),
    published_at: normalizeString(body.published_at) || null,
  };

  if (insight.tag.length < 2) return { valid: false as const, error: "Insight tag must be at least 2 characters long." };
  if (insight.title.length < 6) return { valid: false as const, error: "Insight title must be at least 6 characters long." };
  if (insight.excerpt.length < 20 || insight.excerpt.length > 255) return { valid: false as const, error: "Insight excerpt must be between 20 and 255 characters." };

  return { valid: true as const, data: insight };
}

export function validateTestimonialPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { valid: false as const, error: "Testimonial payload is required." };
  }

  const body = payload as Record<string, unknown>;
  const imageUrl = optionalUrl(body.image_url);
  if (imageUrl === null) return { valid: false as const, error: "Testimonial image URL must be a valid http or https address." };

  const rating = Number(body.rating);
  const testimonial: TestimonialPayload = {
    client_name: normalizeString(body.client_name),
    client_label: normalizeString(body.client_label),
    quote: normalizeString(body.quote),
    image_url: imageUrl,
    image_public_id: normalizeString(body.image_public_id),
    rating: Number.isFinite(rating) ? Math.max(1, Math.min(5, Math.round(rating))) : 5,
    is_featured: body.is_featured !== false,
    sort_order: parseSortOrder(body.sort_order),
    is_active: body.is_active !== false,
  };

  if (testimonial.client_name.length < 2) return { valid: false as const, error: "Client name must be at least 2 characters long." };
  if (testimonial.quote.length < 20 || testimonial.quote.length > 1000) return { valid: false as const, error: "Testimonial quote must be between 20 and 1000 characters." };

  return { valid: true as const, data: testimonial };
}

export function validateNavigationLinkPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { valid: false as const, error: "Navigation link payload is required." };
  }

  const body = payload as Record<string, unknown>;
  const location = normalizeString(body.location) as NavigationLinkPayload["location"];
  const link: NavigationLinkPayload = {
    label: normalizeString(body.label),
    url: normalizeString(body.url),
    location,
    sort_order: parseSortOrder(body.sort_order),
    opens_new_tab: Boolean(body.opens_new_tab),
    is_active: body.is_active !== false,
  };

  if (link.label.length < 2) return { valid: false as const, error: "Navigation label must be at least 2 characters long." };
  if (!link.url) return { valid: false as const, error: "Navigation URL is required." };
  if (!["header", "footer", "legal"].includes(link.location)) return { valid: false as const, error: "Navigation location must be header, footer, or legal." };

  return { valid: true as const, data: link };
}

export function validateContactChannelPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { valid: false as const, error: "Contact channel payload is required." };
  }

  const body = payload as Record<string, unknown>;
  const href = optionalUrl(body.href);
  if (href === null && normalizeString(body.href).startsWith("http")) {
    return { valid: false as const, error: "Contact channel URL must be a valid http or https address." };
  }

  const channel: ContactChannelPayload = {
    label: normalizeString(body.label),
    value_text: normalizeString(body.value_text),
    href: normalizeString(body.href),
    icon_key: normalizeString(body.icon_key),
    location_label: normalizeString(body.location_label),
    sort_order: parseSortOrder(body.sort_order),
    is_active: body.is_active !== false,
  };

  if (channel.label.length < 2) return { valid: false as const, error: "Contact label must be at least 2 characters long." };
  if (channel.value_text.length < 2) return { valid: false as const, error: "Contact value is required." };

  return { valid: true as const, data: channel };
}

export function validateSiteSettingsPayload(payload: unknown) {
  if (!Array.isArray(payload)) {
    return { valid: false as const, error: "Settings payload must be an array." };
  }

  const allowedKeys = new Set([
    "brand_name",
    "hero_headline",
    "hero_subheadline",
    "hero_primary_cta_label",
    "hero_secondary_cta_label",
    "hero_image_url",
    "hero_stats",
    "footer_tagline",
    "footer_copyright",
    "contact_intro",
  ]);

  const settings: SiteSettingPayload[] = [];
  for (const item of payload) {
    if (!item || typeof item !== "object") {
      return { valid: false as const, error: "Each setting must be an object." };
    }

    const record = item as Record<string, unknown>;
    const setting_key = normalizeString(record.setting_key);
    const setting_value = typeof record.setting_value === "string" ? record.setting_value.trim() : "";

    if (!setting_key) return { valid: false as const, error: "Setting key is required." };
    if (!allowedKeys.has(setting_key)) return { valid: false as const, error: `Unsupported setting key: ${setting_key}.` };
    if (setting_key === "hero_image_url" && setting_value && !isValidHttpUrl(setting_value)) return { valid: false as const, error: "Hero image URL must be a valid http or https address." };
    if (setting_key === "hero_primary_cta_label" && setting_value.length < 2) return { valid: false as const, error: "Primary CTA label must be at least 2 characters long." };
    if (setting_key === "hero_secondary_cta_label" && setting_value.length < 2) return { valid: false as const, error: "Secondary CTA label must be at least 2 characters long." };
    if (setting_key === "hero_stats" && setting_value) {
      try {
        const parsed = JSON.parse(setting_value) as unknown;
        if (!Array.isArray(parsed)) return { valid: false as const, error: "Hero stats must be a JSON array." };
        const invalidEntry = parsed.some((entry) => typeof entry !== "object" || entry === null || typeof (entry as { label?: unknown }).label !== "string" || typeof (entry as { value?: unknown }).value !== "string");
        if (invalidEntry) return { valid: false as const, error: 'Each hero stat must include string "label" and "value" fields.' };
      } catch {
        return { valid: false as const, error: "Hero stats must be valid JSON." };
      }
    }

    settings.push({ setting_key, setting_value });
  }

  return { valid: true as const, data: settings };
}
