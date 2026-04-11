import { logger } from "../utils/logger";
import { ProjectPayload } from "../types/project";
import {
  deleteProjectById,
  findPublicProjects,
  insertProject,
  updateProjectById,
} from "./projectRepository";

export async function getProjects() {
  try {
    return await findPublicProjects();
  } catch (error) {
    logger.error("public_projects_fetch_failed", { error });
    throw error;
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
