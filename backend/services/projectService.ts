import { logger } from "../utils/logger";
import { ProjectPayload, ProjectRecord } from "../types/project";
import {
  deleteProjectById,
  findAllProjects,
  insertProject,
  updateProjectById,
} from "./projectRepository";

const mockProjects: ProjectRecord[] = [
  {
    id: 1,
    title: "Studio Apartment",
    location: "Bandung",
    size: "24 m2",
    image_url: "https://picsum.photos/seed/studio/800/500",
    category: "Apartment",
    description: "A compact yet elegant studio apartment designed for modern urban living.",
    is_featured: 0,
  },
  {
    id: 2,
    title: "Modern Residence",
    location: "Jakarta",
    size: "120 m2",
    image_url: "https://picsum.photos/seed/residence/800/500",
    category: "Residential",
    description: "A spacious residence featuring clean lines and organic materials.",
    is_featured: 0,
  },
];

export async function getProjects() {
  try {
    const rows = await findAllProjects();

    if (rows.length === 0) {
      return mockProjects;
    }

    return rows;
  } catch (error) {
    logger.error("projects_fetch_failed_fallback_mock", { error });
    return mockProjects;
  }
}

export async function createProject(project: ProjectPayload) {
  return insertProject(project);
}

export async function updateProject(projectId: number, project: ProjectPayload) {
  return updateProjectById(projectId, project);
}

export async function deleteProject(projectId: number) {
  return deleteProjectById(projectId);
}
