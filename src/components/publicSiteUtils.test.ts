import assert from "node:assert/strict";
import test from "node:test";
import { getPublicRoute, resolveNavigationHref } from "./publicSiteUtils";

test("resolveNavigationHref rewrites portfolio and legal links to public pages", () => {
  assert.equal(resolveNavigationHref("#portfolio", "Portfolio", "/"), "/projects");
  assert.equal(resolveNavigationHref("#", "Privacy Policy", "/"), "/privacy-policy");
  assert.equal(resolveNavigationHref("#", "Terms of Service", "/"), "/terms-of-service");
});

test("resolveNavigationHref prefixes homepage anchors from nested pages", () => {
  assert.equal(resolveNavigationHref("#studio", "Studio", "/projects"), "/#studio");
  assert.equal(resolveNavigationHref("#contact", "Contact", "/insights"), "/#contact");
});

test("getPublicRoute parses page and detail routes", () => {
  assert.deepEqual(getPublicRoute("/projects"), { kind: "projects" });
  assert.deepEqual(getPublicRoute("/projects/12"), { kind: "project-detail", id: 12 });
  assert.deepEqual(getPublicRoute("/insights/maximizing-space"), { kind: "insight-detail", slug: "maximizing-space" });
  assert.deepEqual(getPublicRoute("/privacy-policy"), { kind: "privacy-policy" });
});
