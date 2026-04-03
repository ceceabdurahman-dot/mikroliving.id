import { ProjectPayload } from "../types/project";
import { isValidHttpUrl, normalizeString } from "../utils/strings";

const validProjectCategories = new Set(["Apartment", "Residential", "Kitchen", "Bedroom"]);

export function validateProjectPayload(
  payload: unknown,
): { valid: true; data: ProjectPayload } | { valid: false; error: string } {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "Project payload is required." };
  }

  const data = payload as Record<string, unknown>;
  const project: ProjectPayload = {
    title: normalizeString(data.title),
    category: normalizeString(data.category),
    location: normalizeString(data.location),
    size: normalizeString(data.size),
    image_url: normalizeString(data.image_url),
    description: normalizeString(data.description),
    is_featured: Boolean(data.is_featured),
  };

  if (project.title.length < 3) {
    return { valid: false, error: "Title must be at least 3 characters long." };
  }
  if (!validProjectCategories.has(project.category)) {
    return { valid: false, error: "Invalid project category." };
  }
  if (project.location.length < 2) {
    return { valid: false, error: "Location must be at least 2 characters long." };
  }
  if (project.size.length < 2) {
    return { valid: false, error: "Size is required." };
  }
  if (!isValidHttpUrl(project.image_url)) {
    return { valid: false, error: "Image URL must be a valid http or https address." };
  }
  if (project.description.length < 20 || project.description.length > 500) {
    return { valid: false, error: "Description must be between 20 and 500 characters." };
  }

  return { valid: true, data: project };
}
