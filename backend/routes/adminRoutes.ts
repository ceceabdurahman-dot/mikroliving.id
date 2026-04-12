import { Router } from "express";
import {
  createContactChannelHandler,
  createInsightHandler,
  createNavigationLinkHandler,
  createProjectHandler,
  createServiceHandler,
  createTestimonialHandler,
  createAdminUserHandler,
  changePassword,
  deleteContactChannelHandler,
  deleteInsightHandler,
  deleteInquiryHandler,
  deleteNavigationLinkHandler,
  deleteProjectHandler,
  deleteServiceHandler,
  deleteTestimonialHandler,
  getAdminContentHandler,
  getAdminDashboardHandler,
  getAdminUsersHandler,
  login,
  logout,
  resetAdminUserPasswordHandler,
  updateContactChannelHandler,
  updateInsightHandler,
  updateInquiryHandler,
  updateNavigationLinkHandler,
  updateProjectHandler,
  updateServiceHandler,
  updateSiteSettingsHandler,
  updateTestimonialHandler,
  updateAdminUserHandler,
  uploadImage,
} from "../controllers/adminController";
import { asyncHandler } from "../middleware/asyncHandler";
import { RATE_LIMITS } from "../config/env";
import { authenticateToken, requireAdmin } from "../middleware/auth";
import { createRateLimiter } from "../middleware/rateLimit";
import { requireTrustedOrigin } from "../middleware/trustedOrigin";

export function createAdminRoutes() {
  const router = Router();
  const adminLoginLimiter = createRateLimiter(RATE_LIMITS.adminLogin);
  const adminWriteLimiter = createRateLimiter(RATE_LIMITS.adminWrite);
  const uploadLimiter = createRateLimiter(RATE_LIMITS.adminUpload);
  const trustedAdminWriteOrigin = requireTrustedOrigin();
  const trustedAdminLoginOrigin = requireTrustedOrigin({
    allowBearerWithoutOrigin: false,
    requireWithoutSessionCookie: true,
  });

  router.post("/login", trustedAdminLoginOrigin, adminLoginLimiter, asyncHandler(login));
  router.post("/logout", authenticateToken, trustedAdminWriteOrigin, asyncHandler(logout));
  router.post("/change-password", authenticateToken, trustedAdminWriteOrigin, adminWriteLimiter, asyncHandler(changePassword));
  router.get("/dashboard", authenticateToken, asyncHandler(getAdminDashboardHandler));
  router.get("/content", authenticateToken, asyncHandler(getAdminContentHandler));
  router.get("/users", authenticateToken, requireAdmin, asyncHandler(getAdminUsersHandler));
  router.post("/users", authenticateToken, trustedAdminWriteOrigin, requireAdmin, adminWriteLimiter, asyncHandler(createAdminUserHandler));
  router.put("/users/:id", authenticateToken, trustedAdminWriteOrigin, requireAdmin, adminWriteLimiter, asyncHandler(updateAdminUserHandler));
  router.post("/users/:id/reset-password", authenticateToken, trustedAdminWriteOrigin, requireAdmin, adminWriteLimiter, asyncHandler(resetAdminUserPasswordHandler));
  router.post("/projects", authenticateToken, trustedAdminWriteOrigin, adminWriteLimiter, asyncHandler(createProjectHandler));
  router.put("/projects/:id", authenticateToken, trustedAdminWriteOrigin, adminWriteLimiter, asyncHandler(updateProjectHandler));
  router.delete("/projects/:id", authenticateToken, trustedAdminWriteOrigin, adminWriteLimiter, asyncHandler(deleteProjectHandler));
  router.post("/services", authenticateToken, trustedAdminWriteOrigin, adminWriteLimiter, asyncHandler(createServiceHandler));
  router.put("/services/:id", authenticateToken, trustedAdminWriteOrigin, adminWriteLimiter, asyncHandler(updateServiceHandler));
  router.delete("/services/:id", authenticateToken, trustedAdminWriteOrigin, adminWriteLimiter, asyncHandler(deleteServiceHandler));
  router.post("/insights", authenticateToken, trustedAdminWriteOrigin, adminWriteLimiter, asyncHandler(createInsightHandler));
  router.put("/insights/:id", authenticateToken, trustedAdminWriteOrigin, adminWriteLimiter, asyncHandler(updateInsightHandler));
  router.delete("/insights/:id", authenticateToken, trustedAdminWriteOrigin, adminWriteLimiter, asyncHandler(deleteInsightHandler));
  router.post("/testimonials", authenticateToken, trustedAdminWriteOrigin, adminWriteLimiter, asyncHandler(createTestimonialHandler));
  router.put("/testimonials/:id", authenticateToken, trustedAdminWriteOrigin, adminWriteLimiter, asyncHandler(updateTestimonialHandler));
  router.delete("/testimonials/:id", authenticateToken, trustedAdminWriteOrigin, adminWriteLimiter, asyncHandler(deleteTestimonialHandler));
  router.post("/navigation-links", authenticateToken, trustedAdminWriteOrigin, requireAdmin, adminWriteLimiter, asyncHandler(createNavigationLinkHandler));
  router.put("/navigation-links/:id", authenticateToken, trustedAdminWriteOrigin, requireAdmin, adminWriteLimiter, asyncHandler(updateNavigationLinkHandler));
  router.delete("/navigation-links/:id", authenticateToken, trustedAdminWriteOrigin, requireAdmin, adminWriteLimiter, asyncHandler(deleteNavigationLinkHandler));
  router.post("/contact-channels", authenticateToken, trustedAdminWriteOrigin, requireAdmin, adminWriteLimiter, asyncHandler(createContactChannelHandler));
  router.put("/contact-channels/:id", authenticateToken, trustedAdminWriteOrigin, requireAdmin, adminWriteLimiter, asyncHandler(updateContactChannelHandler));
  router.delete("/contact-channels/:id", authenticateToken, trustedAdminWriteOrigin, requireAdmin, adminWriteLimiter, asyncHandler(deleteContactChannelHandler));
  router.put("/site-settings", authenticateToken, trustedAdminWriteOrigin, requireAdmin, adminWriteLimiter, asyncHandler(updateSiteSettingsHandler));
  router.put("/inquiries/:id", authenticateToken, trustedAdminWriteOrigin, adminWriteLimiter, asyncHandler(updateInquiryHandler));
  router.delete("/inquiries/:id", authenticateToken, trustedAdminWriteOrigin, adminWriteLimiter, asyncHandler(deleteInquiryHandler));
  router.post("/uploads/image", authenticateToken, adminWriteLimiter, trustedAdminWriteOrigin, uploadLimiter, asyncHandler(uploadImage));

  return router;
}
