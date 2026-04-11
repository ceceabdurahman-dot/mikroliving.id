import { Request, Response } from "express";
import { HttpError } from "../errors/httpError";
import { loginAdmin, logoutAdmin } from "../services/authService";
import { getAdminDashboardData } from "../services/adminDashboardService";
import {
  createContactChannel,
  createInsight,
  createNavigationLink,
  createService,
  createTestimonial,
  deleteContactChannel,
  deleteInsight,
  deleteNavigationLink,
  deleteService,
  deleteTestimonial,
  getAdminContent,
  saveSiteSettings,
  updateContactChannel,
  updateInsight,
  updateNavigationLink,
  updateService,
  updateTestimonial,
} from "../services/cmsService";
import { deleteInquiry, updateInquiry } from "../services/inquiryService";
import { createProject, deleteProject, updateProject } from "../services/projectService";
import { uploadProjectImage } from "../services/mediaService";
import { parseProjectId, validateImageUploadPayload, validateLoginPayload } from "../validators/authValidator";
import {
  parseCmsEntityId,
  validateContactChannelPayload,
  validateInsightPayload,
  validateNavigationLinkPayload,
  validateServicePayload,
  validateSiteSettingsPayload,
  validateTestimonialPayload,
} from "../validators/cmsValidator";
import { validateInquiryPayload } from "../validators/inquiryValidator";
import { validateProjectPayload } from "../validators/projectValidator";

export async function login(req: Request, res: Response) {
  const validation = validateLoginPayload(req.body);
  if (!validation.valid) throw new HttpError(400, validation.error);
  const result = await loginAdmin(validation.data.username, validation.data.password);
  if (!result) throw new HttpError(401, "Invalid credentials");
  return res.json(result);
}

export async function logout(req: Request, res: Response) {
  if (!req.user) {
    throw new HttpError(401, "Unauthorized");
  }

  await logoutAdmin(req.user.id);
  return res.json({ success: true });
}

export async function getAdminDashboardHandler(req: Request, res: Response) {
  return res.json(await getAdminDashboardData());
}

export async function getAdminContentHandler(req: Request, res: Response) {
  return res.json(await getAdminContent());
}

export async function createProjectHandler(req: Request, res: Response) {
  const validation = validateProjectPayload(req.body);
  if (!validation.valid) throw new HttpError(400, validation.error);
  return res.json({ success: true, id: await createProject(validation.data) });
}

export async function updateProjectHandler(req: Request, res: Response) {
  const idValidation = parseProjectId(req.params.id);
  if (!idValidation.valid) throw new HttpError(400, idValidation.error);
  const payloadValidation = validateProjectPayload(req.body);
  if (!payloadValidation.valid) throw new HttpError(400, payloadValidation.error);
  const affectedRows = await updateProject(idValidation.data, payloadValidation.data);
  if (affectedRows === 0) throw new HttpError(404, "Project not found.");
  return res.json({ success: true });
}

export async function deleteProjectHandler(req: Request, res: Response) {
  const idValidation = parseProjectId(req.params.id);
  if (!idValidation.valid) throw new HttpError(400, idValidation.error);
  const affectedRows = await deleteProject(idValidation.data);
  if (affectedRows === 0) throw new HttpError(404, "Project not found.");
  return res.json({ success: true });
}

export async function createServiceHandler(req: Request, res: Response) {
  const validation = validateServicePayload(req.body);
  if (!validation.valid) throw new HttpError(400, validation.error);
  return res.json({ success: true, id: await createService(validation.data) });
}

export async function updateServiceHandler(req: Request, res: Response) {
  const idValidation = parseCmsEntityId(req.params.id, "service");
  if (!idValidation.valid) throw new HttpError(400, idValidation.error);
  const validation = validateServicePayload(req.body);
  if (!validation.valid) throw new HttpError(400, validation.error);
  const affectedRows = await updateService(idValidation.data, validation.data);
  if (affectedRows === 0) throw new HttpError(404, "Service not found.");
  return res.json({ success: true });
}

export async function deleteServiceHandler(req: Request, res: Response) {
  const idValidation = parseCmsEntityId(req.params.id, "service");
  if (!idValidation.valid) throw new HttpError(400, idValidation.error);
  const affectedRows = await deleteService(idValidation.data);
  if (affectedRows === 0) throw new HttpError(404, "Service not found.");
  return res.json({ success: true });
}

export async function createInsightHandler(req: Request, res: Response) {
  const validation = validateInsightPayload(req.body);
  if (!validation.valid) throw new HttpError(400, validation.error);
  return res.json({ success: true, id: await createInsight(validation.data) });
}

export async function updateInsightHandler(req: Request, res: Response) {
  const idValidation = parseCmsEntityId(req.params.id, "insight");
  if (!idValidation.valid) throw new HttpError(400, idValidation.error);
  const validation = validateInsightPayload(req.body);
  if (!validation.valid) throw new HttpError(400, validation.error);
  const affectedRows = await updateInsight(idValidation.data, validation.data);
  if (affectedRows === 0) throw new HttpError(404, "Insight not found.");
  return res.json({ success: true });
}

export async function deleteInsightHandler(req: Request, res: Response) {
  const idValidation = parseCmsEntityId(req.params.id, "insight");
  if (!idValidation.valid) throw new HttpError(400, idValidation.error);
  const affectedRows = await deleteInsight(idValidation.data);
  if (affectedRows === 0) throw new HttpError(404, "Insight not found.");
  return res.json({ success: true });
}

export async function createTestimonialHandler(req: Request, res: Response) {
  const validation = validateTestimonialPayload(req.body);
  if (!validation.valid) throw new HttpError(400, validation.error);
  return res.json({ success: true, id: await createTestimonial(validation.data) });
}

export async function updateTestimonialHandler(req: Request, res: Response) {
  const idValidation = parseCmsEntityId(req.params.id, "testimonial");
  if (!idValidation.valid) throw new HttpError(400, idValidation.error);
  const validation = validateTestimonialPayload(req.body);
  if (!validation.valid) throw new HttpError(400, validation.error);
  const affectedRows = await updateTestimonial(idValidation.data, validation.data);
  if (affectedRows === 0) throw new HttpError(404, "Testimonial not found.");
  return res.json({ success: true });
}

export async function deleteTestimonialHandler(req: Request, res: Response) {
  const idValidation = parseCmsEntityId(req.params.id, "testimonial");
  if (!idValidation.valid) throw new HttpError(400, idValidation.error);
  const affectedRows = await deleteTestimonial(idValidation.data);
  if (affectedRows === 0) throw new HttpError(404, "Testimonial not found.");
  return res.json({ success: true });
}

export async function createNavigationLinkHandler(req: Request, res: Response) {
  const validation = validateNavigationLinkPayload(req.body);
  if (!validation.valid) throw new HttpError(400, validation.error);
  return res.json({ success: true, id: await createNavigationLink(validation.data) });
}

export async function updateNavigationLinkHandler(req: Request, res: Response) {
  const idValidation = parseCmsEntityId(req.params.id, "navigation link");
  if (!idValidation.valid) throw new HttpError(400, idValidation.error);
  const validation = validateNavigationLinkPayload(req.body);
  if (!validation.valid) throw new HttpError(400, validation.error);
  const affectedRows = await updateNavigationLink(idValidation.data, validation.data);
  if (affectedRows === 0) throw new HttpError(404, "Navigation link not found.");
  return res.json({ success: true });
}

export async function deleteNavigationLinkHandler(req: Request, res: Response) {
  const idValidation = parseCmsEntityId(req.params.id, "navigation link");
  if (!idValidation.valid) throw new HttpError(400, idValidation.error);
  const affectedRows = await deleteNavigationLink(idValidation.data);
  if (affectedRows === 0) throw new HttpError(404, "Navigation link not found.");
  return res.json({ success: true });
}

export async function createContactChannelHandler(req: Request, res: Response) {
  const validation = validateContactChannelPayload(req.body);
  if (!validation.valid) throw new HttpError(400, validation.error);
  return res.json({ success: true, id: await createContactChannel(validation.data) });
}

export async function updateContactChannelHandler(req: Request, res: Response) {
  const idValidation = parseCmsEntityId(req.params.id, "contact channel");
  if (!idValidation.valid) throw new HttpError(400, idValidation.error);
  const validation = validateContactChannelPayload(req.body);
  if (!validation.valid) throw new HttpError(400, validation.error);
  const affectedRows = await updateContactChannel(idValidation.data, validation.data);
  if (affectedRows === 0) throw new HttpError(404, "Contact channel not found.");
  return res.json({ success: true });
}

export async function deleteContactChannelHandler(req: Request, res: Response) {
  const idValidation = parseCmsEntityId(req.params.id, "contact channel");
  if (!idValidation.valid) throw new HttpError(400, idValidation.error);
  const affectedRows = await deleteContactChannel(idValidation.data);
  if (affectedRows === 0) throw new HttpError(404, "Contact channel not found.");
  return res.json({ success: true });
}

export async function updateSiteSettingsHandler(req: Request, res: Response) {
  const validation = validateSiteSettingsPayload(req.body);
  if (!validation.valid) throw new HttpError(400, validation.error);
  await saveSiteSettings(validation.data);
  return res.json({ success: true });
}

export async function updateInquiryHandler(req: Request, res: Response) {
  const idValidation = parseCmsEntityId(req.params.id, "inquiry");
  if (!idValidation.valid) throw new HttpError(400, idValidation.error);
  const validation = validateInquiryPayload(req.body);
  if (!validation.valid) throw new HttpError(400, validation.error);
  const affectedRows = await updateInquiry(idValidation.data, validation.data);
  if (affectedRows === 0) throw new HttpError(404, "Inquiry not found.");
  return res.json({ success: true });
}

export async function deleteInquiryHandler(req: Request, res: Response) {
  const idValidation = parseCmsEntityId(req.params.id, "inquiry");
  if (!idValidation.valid) throw new HttpError(400, idValidation.error);
  const affectedRows = await deleteInquiry(idValidation.data);
  if (affectedRows === 0) throw new HttpError(404, "Inquiry not found.");
  return res.json({ success: true });
}

export async function uploadImage(req: Request, res: Response) {
  const validation = validateImageUploadPayload(req.body);
  if (!validation.valid) throw new HttpError(400, validation.error);
  return res.json(await uploadProjectImage(validation.data.fileName, validation.data.dataUrl));
}
