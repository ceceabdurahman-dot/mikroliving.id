import { Request, Response } from "express";
import { HttpError } from "../errors/httpError";
import { createInquiry } from "../services/inquiryService";
import { getOptimizedImageUrl } from "../services/mediaService";
import { getHomepageContent, getPublishedInsightBySlug, getPublishedInsights } from "../services/cmsService";
import { getProjectById, getProjects } from "../services/projectService";
import { validateContactPayload } from "../validators/contactValidator";

export async function listProjects(req: Request, res: Response) {
  const projects = await getProjects();
  return res.json(projects);
}

export async function getProjectByIdHandler(req: Request, res: Response) {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    throw new HttpError(400, "A valid project id is required.");
  }

  const project = await getProjectById(projectId);

  if (!project) {
    throw new HttpError(404, "Project not found.");
  }

  return res.json(project);
}

export async function listInsights(req: Request, res: Response) {
  const insights = await getPublishedInsights();
  return res.json(insights);
}

export async function getInsightBySlugHandler(req: Request, res: Response) {
  const slug = typeof req.params.slug === "string" ? req.params.slug.trim() : "";

  if (!slug) {
    throw new HttpError(400, "A valid insight slug is required.");
  }

  const insight = await getPublishedInsightBySlug(slug);

  if (!insight) {
    throw new HttpError(404, "Insight not found.");
  }

  return res.json(insight);
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
