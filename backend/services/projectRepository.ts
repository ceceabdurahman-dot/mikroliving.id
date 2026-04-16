import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDb } from "../config/database";
import { ProjectPayload, ProjectRecord } from "../types/project";

const PUBLIC_PROJECT_FIELDS = [
  "id",
  "title",
  "category",
  "location",
  "size",
  "image_url",
  "description",
  "is_featured",
  "created_at",
  "updated_at",
].join(", ");

export async function findAllProjects() {
  const db = getDb();
  const [rows] = await db.execute<(RowDataPacket & ProjectRecord)[]>(
    "SELECT * FROM projects ORDER BY created_at DESC",
  );

  return rows;
}

export async function findPublicProjects() {
  const db = getDb();
  const [rows] = await db.execute<(RowDataPacket & ProjectRecord)[]>(
    `SELECT ${PUBLIC_PROJECT_FIELDS} FROM projects WHERE status = ? ORDER BY is_featured DESC, sort_order ASC, created_at DESC`,
    ["published"],
  );

  return rows;
}

export async function findPublicProjectById(projectId: number) {
  const db = getDb();
  const [rows] = await db.execute<(RowDataPacket & ProjectRecord)[]>(
    `SELECT ${PUBLIC_PROJECT_FIELDS} FROM projects WHERE id = ? AND status = ? LIMIT 1`,
    [projectId, "published"],
  );

  return rows[0] ?? null;
}

export async function insertProject(project: ProjectPayload) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>(
    "INSERT INTO projects (title, category, location, size, image_url, description, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      project.title,
      project.category,
      project.location,
      project.size,
      project.image_url,
      project.description,
      project.is_featured ? 1 : 0,
    ],
  );

  return result.insertId;
}

export async function updateProjectById(projectId: number, project: ProjectPayload) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>(
    "UPDATE projects SET title=?, category=?, location=?, size=?, image_url=?, description=?, is_featured=? WHERE id=?",
    [
      project.title,
      project.category,
      project.location,
      project.size,
      project.image_url,
      project.description,
      project.is_featured ? 1 : 0,
      projectId,
    ],
  );

  return result.affectedRows;
}

export async function deleteProjectById(projectId: number) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("DELETE FROM projects WHERE id = ?", [projectId]);
  return result.affectedRows;
}
