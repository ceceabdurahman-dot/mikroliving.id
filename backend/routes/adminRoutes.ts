import { Router } from "express";
import {
  createContactChannelHandler,
  createInsightHandler,
  createNavigationLinkHandler,
  createProjectHandler,
  createServiceHandler,
  createTestimonialHandler,
  deleteContactChannelHandler,
  deleteInsightHandler,
  deleteInquiryHandler,
  deleteNavigationLinkHandler,
  deleteProjectHandler,
  deleteServiceHandler,
  deleteTestimonialHandler,
  getAdminContentHandler,
  getAdminDashboardHandler,
  login,
  updateContactChannelHandler,
  updateInsightHandler,
  updateInquiryHandler,
  updateNavigationLinkHandler,
  updateProjectHandler,
  updateServiceHandler,
  updateSiteSettingsHandler,
  updateTestimonialHandler,
  uploadImage,
} from "../controllers/adminController";
import { asyncHandler } from "../middleware/asyncHandler";
import { RATE_LIMITS } from "../config/env";
import { authenticateToken } from "../middleware/auth";
import { createRateLimiter } from "../middleware/rateLimit";

export function createAdminRoutes() {
  const router = Router();
  const adminLoginLimiter = createRateLimiter(RATE_LIMITS.adminLogin);
  const adminWriteLimiter = createRateLimiter(RATE_LIMITS.adminWrite);
  const uploadLimiter = createRateLimiter(RATE_LIMITS.adminUpload);

  router.post("/login", adminLoginLimiter, asyncHandler(login));
  router.get("/dashboard", authenticateToken, asyncHandler(getAdminDashboardHandler));
  router.get("/content", authenticateToken, asyncHandler(getAdminContentHandler));
  router.post("/projects", authenticateToken, adminWriteLimiter, asyncHandler(createProjectHandler));
  router.put("/projects/:id", authenticateToken, adminWriteLimiter, asyncHandler(updateProjectHandler));
  router.delete("/projects/:id", authenticateToken, adminWriteLimiter, asyncHandler(deleteProjectHandler));
  router.post("/services", authenticateToken, adminWriteLimiter, asyncHandler(createServiceHandler));
  router.put("/services/:id", authenticateToken, adminWriteLimiter, asyncHandler(updateServiceHandler));
  router.delete("/services/:id", authenticateToken, adminWriteLimiter, asyncHandler(deleteServiceHandler));
  router.post("/insights", authenticateToken, adminWriteLimiter, asyncHandler(createInsightHandler));
  router.put("/insights/:id", authenticateToken, adminWriteLimiter, asyncHandler(updateInsightHandler));
  router.delete("/insights/:id", authenticateToken, adminWriteLimiter, asyncHandler(deleteInsightHandler));
  router.post("/testimonials", authenticateToken, adminWriteLimiter, asyncHandler(createTestimonialHandler));
  router.put("/testimonials/:id", authenticateToken, adminWriteLimiter, asyncHandler(updateTestimonialHandler));
  router.delete("/testimonials/:id", authenticateToken, adminWriteLimiter, asyncHandler(deleteTestimonialHandler));
  router.post("/navigation-links", authenticateToken, adminWriteLimiter, asyncHandler(createNavigationLinkHandler));
  router.put("/navigation-links/:id", authenticateToken, adminWriteLimiter, asyncHandler(updateNavigationLinkHandler));
  router.delete("/navigation-links/:id", authenticateToken, adminWriteLimiter, asyncHandler(deleteNavigationLinkHandler));
  router.post("/contact-channels", authenticateToken, adminWriteLimiter, asyncHandler(createContactChannelHandler));
  router.put("/contact-channels/:id", authenticateToken, adminWriteLimiter, asyncHandler(updateContactChannelHandler));
  router.delete("/contact-channels/:id", authenticateToken, adminWriteLimiter, asyncHandler(deleteContactChannelHandler));
  router.put("/site-settings", authenticateToken, adminWriteLimiter, asyncHandler(updateSiteSettingsHandler));
  router.put("/inquiries/:id", authenticateToken, adminWriteLimiter, asyncHandler(updateInquiryHandler));
  router.delete("/inquiries/:id", authenticateToken, adminWriteLimiter, asyncHandler(deleteInquiryHandler));
  router.post("/uploads/image", authenticateToken, uploadLimiter, asyncHandler(uploadImage));

  return router;
}
