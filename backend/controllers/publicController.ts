import { Request, Response } from "express";
import { HttpError } from "../errors/httpError";
import { createInquiry } from "../services/inquiryService";
import { getOptimizedImageUrl } from "../services/mediaService";
import { getHomepageContent } from "../services/cmsService";
import { getProjects } from "../services/projectService";
import { validateContactPayload } from "../validators/contactValidator";

export async function listProjects(req: Request, res: Response) {
  const projects = await getProjects();
  return res.json(projects);
}

export async function getHomepage(req: Request, res: Response) {
  const homepage = await getHomepageContent();
  return res.json(homepage);
}

export async function submitContact(req: Request, res: Response) {
  const validation = validateContactPayload(req.body);
  if (!validation.valid) {
    throw new HttpError(400, validation.error);
  }

  await createInquiry(validation.data, {
    source: "website",
    ip_address: req.ip,
    user_agent: req.get("user-agent") || null,
  });
  return res.json({ success: true, message: "Inquiry sent successfully" });
}

export function getImageUrl(req: Request, res: Response) {
  const publicId = typeof req.query.publicId === "string" ? req.query.publicId : "";
  if (!publicId) {
    throw new HttpError(400, "Public ID required");
  }

  return res.json(getOptimizedImageUrl(publicId, req.query.width, req.query.height));
}
