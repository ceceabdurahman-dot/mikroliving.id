import { Router } from "express";
import {
  getHomepage,
  getImageUrl,
  getInsightBySlugHandler,
  getProjectByIdHandler,
  listInsights,
  listProjects,
  submitContact,
} from "../controllers/publicController";
import { asyncHandler } from "../middleware/asyncHandler";
import { RATE_LIMITS } from "../config/env";
import { createRateLimiter } from "../middleware/rateLimit";

export function createPublicRoutes() {
  const router = Router();
  const contactLimiter = createRateLimiter(RATE_LIMITS.contact);

  router.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });
  router.get("/projects", asyncHandler(listProjects));
  router.get("/projects/:id", asyncHandler(getProjectByIdHandler));
  router.get("/insights", asyncHandler(listInsights));
  router.get("/insights/:slug", asyncHandler(getInsightBySlugHandler));
  router.get("/homepage", asyncHandler(getHomepage));
  router.post("/contact", contactLimiter, asyncHandler(submitContact));
  router.get("/image-url", asyncHandler(getImageUrl));

  return router;
}
