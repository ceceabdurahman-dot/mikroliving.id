# Security Auth & User Management Report

Date: 2026-04-12

## Executive Summary

The change-password flow and session invalidation logic are functionally working, but the authorization model around the admin/CMS area is not safe yet. The most serious issue is that an `editor` account can perform privileged admin-only actions, including creating a new `admin` account and updating site settings. This turns the user-management module into a privilege-escalation path.

## Functional Verification

- `GET /admin` returned `200` and rendered the `MikroLiving` page title on a fresh local server.
- Admin login succeeded.
- A temporary `editor` user was created successfully.
- That editor successfully changed their own password.
- The old editor token was rejected with `403` after the password change.
- Logging in with the old password failed with `401`.
- Logging in with the new password succeeded.
- Cleanup completed and the database returned to a single active `admin` user.

## Critical Findings

### AUTHZ-001: Missing role-based authorization on admin/CMS routes

Severity: Critical

Location:
- [backend/routes/adminRoutes.ts](E:\xampp\htdocs\mikro_living\.github-review\mikroliving.id\backend\routes\adminRoutes.ts):46-76
- [backend/middleware/auth.ts](E:\xampp\htdocs\mikro_living\.github-review\mikroliving.id\backend\middleware\auth.ts):20-22
- [backend/middleware/auth.ts](E:\xampp\htdocs\mikro_living\.github-review\mikroliving.id\backend\middleware\auth.ts):40-50
- [backend/types/auth.ts](E:\xampp\htdocs\mikro_living\.github-review\mikroliving.id\backend\types\auth.ts):1-6
- [backend/services/authService.ts](E:\xampp\htdocs\mikro_living\.github-review\mikroliving.id\backend\services\authService.ts):23-29
- [backend/services/userService.ts](E:\xampp\htdocs\mikro_living\.github-review\mikroliving.id\backend\services\userService.ts):46-49
- [backend/services/userService.ts](E:\xampp\htdocs\mikro_living\.github-review\mikroliving.id\backend\services\userService.ts):57-109
- [backend/controllers/adminController.ts](E:\xampp\htdocs\mikro_living\.github-review\mikroliving.id\backend\controllers\adminController.ts):145-187

Evidence:
- All admin/CMS routes rely on `authenticateToken`, but none of them enforce `admin` vs `editor` permissions.
- `AuthenticatedUser` only carries `id`, `username`, and `token_version`; it does not include `role`.
- `loginAdmin()` signs a JWT without a role claim, and `validateAuthenticatedUser()` restores a session without loading a role.
- `createAdminUser()` does not receive the actor role at all, and the controller handlers only verify that `req.user` exists.

Runtime proof:
- A temporary `editor` account successfully:
  - read `GET /api/admin/users`
  - changed their own password
  - created a brand-new `admin` user via `POST /api/admin/users`
  - updated site settings via `PUT /api/admin/site-settings`

Impact:
- Any authenticated editor can escalate privileges to full admin.
- Editors can reset other users' passwords, create or modify admin users, and alter privileged CMS state.

Fix:
- Add `role` to the authenticated session model and JWT validation path.
- Load role from the database during authentication.
- Add explicit authorization middleware, for example `requireRole("admin")`, on sensitive routes such as:
  - `/api/admin/users*`
  - `/api/admin/site-settings`
  - content writes that should not be available to editors
- Define a clear permissions matrix for `admin` vs `editor`.

## High Findings

### AUTH-002: Admin bearer token is stored in `localStorage`

Severity: High

Location:
- [src/services/api.ts](E:\xampp\htdocs\mikro_living\.github-review\mikroliving.id\src\services\api.ts):4
- [src/services/api.ts](E:\xampp\htdocs\mikro_living\.github-review\mikroliving.id\src\services\api.ts):237-242
- [src/services/api.ts](E:\xampp\htdocs\mikro_living\.github-review\mikroliving.id\src\services\api.ts):283-287

Evidence:
- The admin token is read from, written to, and deleted from `localStorage`.

Impact:
- Any successful XSS or hostile browser extension can steal the admin token and replay it for up to the token lifetime.
- Because the app uses bearer tokens instead of HttpOnly cookies, the browser cannot protect the token from JavaScript access.

Fix:
- Move auth to `HttpOnly` cookies where feasible.
- If cookies are not practical yet, use shorter-lived in-memory access tokens plus a safer refresh strategy.
- Add CSP and other XSS hardening as defense-in-depth.

## Medium Findings

### PLATFORM-003: Express hardening baseline is incomplete

Severity: Medium

Location:
- [backend/app.ts](E:\xampp\htdocs\mikro_living\.github-review\mikroliving.id\backend\app.ts):24-27
- [backend/app.ts](E:\xampp\htdocs\mikro_living\.github-review\mikroliving.id\backend\app.ts):20-63

Evidence:
- The app enables `cors()` with default permissive behavior.
- There is no visible `helmet()` middleware.
- There is no visible `app.disable("x-powered-by")`.
- Runtime check on `/admin` returned `X-Powered-By: Express`.
- Runtime check on a protected route returned `Access-Control-Allow-Origin: *`.

Impact:
- The app exposes avoidable framework fingerprinting.
- CORS is broader than necessary for an admin API.
- If an attacker gains access to a bearer token, permissive CORS makes cross-origin API use easier.

Fix:
- Restrict CORS to the real frontend/admin origins.
- Add `helmet()` with a realistic baseline policy.
- Disable `x-powered-by`.
- Verify whether additional security headers are set at the reverse proxy or CDN.

## Low Findings

### AUTH-004: Password policy is minimal

Severity: Low

Location:
- [backend/validators/authValidator.ts](E:\xampp\htdocs\mikro_living\.github-review\mikroliving.id\backend\validators\authValidator.ts):31-45
- [backend/validators/userValidator.ts](E:\xampp\htdocs\mikro_living\.github-review\mikroliving.id\backend\validators\userValidator.ts):84-88
- [backend/validators/userValidator.ts](E:\xampp\htdocs\mikro_living\.github-review\mikroliving.id\backend\validators\userValidator.ts):114-118

Evidence:
- New passwords are only required to be at least 8 characters and match confirmation.

Impact:
- Weak but valid passwords remain possible for admin/editor accounts.

Fix:
- Consider requiring stronger password quality checks or passphrase-oriented guidance.
- Consider adding breached-password screening if this system will be used on the public internet.
