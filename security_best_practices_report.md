# Security Best Practices Report

## Executive Summary

This review found four meaningful security issues in the current MikroLiving codebase. The most serious problem is that a real `.env` file is tracked in Git, which exposes operational secrets to anyone with repository access and makes secret rotation urgent. The backend also falls back to a hard-coded JWT signing secret, which can allow forged admin tokens if the environment is ever misconfigured. On the frontend and CMS side, the admin session token is stored in `localStorage`, and CMS-managed links are not sufficiently validated before being rendered into public `href` attributes.

## Critical Findings

### SEC-001: Secrets are committed to the repository

- Severity: Critical
- Location: [.env](./.env):1, [.gitignore](./.gitignore):8
- Evidence:

```text
.env
.env.example
.gitignore
```

```text
8: .env*
9: !.env.example
```

- Impact: Any user, machine, backup, or CI system with repository access can recover live application secrets, which can lead to database compromise, third-party account abuse, and long-lived credential leakage even after branch cleanup.
- Fix: Remove `.env` from version control immediately, rotate every secret currently stored there, and ensure only `.env.example` remains tracked.
- Mitigation: Audit Git history, pull-request artifacts, deployment logs, and any external mirrors because secret removal from the latest commit alone does not revoke prior exposure.
- False positive notes: None. The file is tracked by Git despite `.gitignore` intending to exclude it.

## High Findings

### SEC-002: JWT signing falls back to a hard-coded secret

- Severity: High
- Location: [backend/config/env.ts](./backend/config/env.ts):6
- Evidence:

```ts
export const JWT_SECRET = process.env.JWT_SECRET || "mikroliving-secret-key-2026";
```

- Impact: If `JWT_SECRET` is missing in any environment, attackers who know or guess this fallback can mint valid admin bearer tokens and fully bypass authentication.
- Fix: Fail startup when `JWT_SECRET` is missing instead of using a default secret.
- Mitigation: Rotate the current JWT secret after removing the fallback, because deployments may already have issued tokens with the weak fallback.
- False positive notes: This remains a real risk even if production usually sets the environment variable, because operational drift and emergency deployments often trigger fallback paths.

## Medium Findings

### SEC-003: Admin bearer token is persisted in `localStorage`

- Severity: Medium
- Location: [src/services/api.ts](./src/services/api.ts):180, [src/services/api.ts](./src/services/api.ts):193, [src/services/api.ts](./src/services/api.ts):197
- Evidence:

```ts
const getAuthHeader = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};
```

```ts
if (response.data.token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, response.data.token);
}
```

- Impact: Any future XSS bug, malicious browser extension, or compromised client environment can exfiltrate the admin token and immediately take over the CMS until token expiry.
- Fix: Prefer an `HttpOnly` secure cookie session or a short-lived in-memory token with a refresh flow handled server-side.
- Mitigation: Shorten token lifetime, add token rotation/revocation support, and lock the admin surface behind a stricter CSP while migrating away from `localStorage`.
- False positive notes: This is more serious because the token grants full admin write access to content and uploads.

### SEC-004: CMS-managed links are not safely validated before being rendered into public anchors

- Severity: Medium
- Location: [backend/validators/cmsValidator.ts](./backend/validators/cmsValidator.ts):121, [backend/validators/cmsValidator.ts](./backend/validators/cmsValidator.ts):143, [src/components/Navbar.tsx](./src/components/Navbar.tsx):43, [src/components/Footer.tsx](./src/components/Footer.tsx):54, [src/components/Footer.tsx](./src/components/Footer.tsx):74
- Evidence:

```ts
const link: NavigationLinkPayload = {
  label: normalizeString(body.label),
  url: normalizeString(body.url),
  location,
  sort_order: parseSortOrder(body.sort_order),
  opens_new_tab: Boolean(body.opens_new_tab),
  is_active: body.is_active !== false,
};
```

```ts
const channel: ContactChannelPayload = {
  label: normalizeString(body.label),
  value_text: normalizeString(body.value_text),
  href: normalizeString(body.href),
  icon_key: normalizeString(body.icon_key),
  location_label: normalizeString(body.location_label),
  sort_order: parseSortOrder(body.sort_order),
  is_active: body.is_active !== false,
};
```

```tsx
<a key={link.id} href={link.url} className="text-stone-500 hover:text-primary transition-colors text-sm">
  {link.label}
</a>
```

```tsx
<a key={channel.id} href={channel.href ?? "#"} className="text-stone-500 hover:text-primary transition-colors text-sm">
  {channel.label}
</a>
```

- Impact: A compromised admin account or poisoned database row can publish attacker-controlled destinations to the public site, enabling phishing redirects and potentially script-bearing URI abuse depending on browser behavior.
- Fix: Only allow relative paths, hash anchors, `mailto:`, `tel:`, or a strict allowlist of trusted `https://` hosts; reject everything else at validation time.
- Mitigation: Normalize link rendering so external links always get explicit safeguards and dangerous schemes are blocked before render.
- False positive notes: React escapes text, so this is not the same as raw HTML XSS. The risk is unsafe navigation targets, not HTML injection.

## Low Findings

### SEC-005: Baseline Express hardening is missing

- Severity: Low
- Location: [backend/app.ts](./backend/app.ts):19
- Evidence:

```ts
export async function createApp() {
  const app = express();
  const productionRuntime = isProductionRuntime();

  app.use(cors());
  app.use("/api", requestId);
  app.use("/api", express.json({ limit: "10mb" }));
  app.use("/api", requestLogger, createApiRouter());
  app.use("/api", apiNotFoundHandler);
```

- Impact: The app currently lacks visible security-header middleware such as Helmet, keeps Express fingerprinting enabled by default, and allows fully permissive CORS, which weakens browser-side defenses and makes future mistakes easier to exploit.
- Fix: Add `helmet()` early, disable `x-powered-by`, and replace `cors()` with an explicit origin policy for the allowed frontend/admin origins.
- Mitigation: If these controls are enforced at a reverse proxy or CDN, document that clearly and verify the runtime headers externally.
- False positive notes: Some defenses may exist at the edge, but they are not visible in application code.
