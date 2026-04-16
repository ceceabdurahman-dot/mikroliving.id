export type PublicRoute =
  | { kind: "home" }
  | { kind: "projects" }
  | { kind: "project-detail"; id: number }
  | { kind: "insights" }
  | { kind: "insight-detail"; slug: string }
  | { kind: "privacy-policy" }
  | { kind: "terms-of-service" }
  | { kind: "not-found" };

function normalizePathname(pathname: string) {
  const trimmed = pathname.trim();

  if (!trimmed || trimmed === "/") {
    return "/";
  }

  return trimmed.replace(/\/+$/, "") || "/";
}

export function getPublicRoute(pathname: string): PublicRoute {
  const normalized = normalizePathname(pathname);

  if (normalized === "/") {
    return { kind: "home" };
  }

  if (normalized === "/projects") {
    return { kind: "projects" };
  }

  if (normalized.startsWith("/projects/")) {
    const id = Number(normalized.slice("/projects/".length));
    if (Number.isInteger(id) && id > 0) {
      return { kind: "project-detail", id };
    }
  }

  if (normalized === "/insights") {
    return { kind: "insights" };
  }

  if (normalized.startsWith("/insights/")) {
    const slug = decodeURIComponent(normalized.slice("/insights/".length));
    if (slug) {
      return { kind: "insight-detail", slug };
    }
  }

  if (normalized === "/privacy-policy") {
    return { kind: "privacy-policy" };
  }

  if (normalized === "/terms-of-service") {
    return { kind: "terms-of-service" };
  }

  return { kind: "not-found" };
}

export function resolveBrandHref(currentPath: string) {
  return normalizePathname(currentPath) === "/" ? "#home" : "/";
}

export function resolveContactHref(currentPath: string) {
  return normalizePathname(currentPath) === "/" ? "#contact" : "/#contact";
}

export function resolveNavigationHref(url: string | undefined, label: string | undefined, currentPath: string) {
  const normalizedPath = normalizePathname(currentPath);
  const normalizedUrl = (url ?? "").trim();
  const lowerLabel = (label ?? "").trim().toLowerCase();
  const lowerUrl = normalizedUrl.toLowerCase();

  if (lowerUrl === "/privacy-policy" || lowerLabel.includes("privacy")) {
    return "/privacy-policy";
  }

  if (lowerUrl === "/terms-of-service" || lowerLabel.includes("terms")) {
    return "/terms-of-service";
  }

  if (
    lowerUrl === "/projects"
    || lowerUrl.startsWith("/projects/")
    || lowerUrl === "#portfolio"
    || lowerLabel === "portfolio"
    || lowerLabel === "projects"
  ) {
    return "/projects";
  }

  if (
    lowerUrl === "/insights"
    || lowerUrl.startsWith("/insights/")
    || lowerUrl === "#insights"
    || lowerLabel === "insights"
  ) {
    return "/insights";
  }

  if (lowerUrl === "#contact") {
    return resolveContactHref(normalizedPath);
  }

  if (lowerUrl.startsWith("#")) {
    return normalizedPath === "/" ? normalizedUrl : `/${normalizedUrl}`;
  }

  return normalizedUrl || "/";
}

export function formatPublicDate(value?: string | null) {
  if (!value) {
    return "13 April 2026";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
