import { Router } from "express";
import { createAdminRoutes } from "./adminRoutes";
import { createPublicRoutes } from "./publicRoutes";

export function createApiRouter() {
  const router = Router();

  router.use(createPublicRoutes());
  router.use("/admin", createAdminRoutes());

  return router;
}
