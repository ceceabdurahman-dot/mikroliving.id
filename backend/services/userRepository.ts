import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDb } from "../config/database";
import { CreateUserPayload, UpdateUserPayload, UserRecord } from "../types/user";

type UserRow = RowDataPacket & UserRecord;
type CountRow = RowDataPacket & { total: number };

export async function findAllUsers() {
  const db = getDb();
  const [rows] = await db.execute<UserRow[]>(
    `SELECT id, username, email, full_name, role, avatar_url, is_active, last_login_at, created_at, updated_at
     FROM users
     ORDER BY CASE role
       WHEN 'superadmin' THEN 2
       WHEN 'admin' THEN 1
       ELSE 0
     END DESC, is_active DESC, username ASC`,
  );

  return rows;
}

export async function findUserById(userId: number) {
  const db = getDb();
  const [rows] = await db.execute<UserRow[]>(
    `SELECT id, username, email, full_name, role, avatar_url, is_active, last_login_at, created_at, updated_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [userId],
  );

  return rows[0] ?? null;
}

export async function countActivePrivilegedUsers() {
  const db = getDb();
  const [rows] = await db.execute<CountRow[]>(
    "SELECT COUNT(*) AS total FROM users WHERE role IN ('superadmin', 'admin') AND is_active = 1",
  );

  return Number(rows[0]?.total ?? 0);
}

export async function insertUser(payload: CreateUserPayload, passwordHash: string) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO users (username, password, email, full_name, role, avatar_url, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.username,
      passwordHash,
      payload.email,
      payload.full_name,
      payload.role,
      payload.avatar_url,
      payload.is_active ? 1 : 0,
    ],
  );

  return result.insertId;
}

export async function updateUserById(userId: number, payload: UpdateUserPayload) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>(
    `UPDATE users
     SET username = ?, email = ?, full_name = ?, role = ?, avatar_url = ?, is_active = ?
     WHERE id = ?`,
    [
      payload.username,
      payload.email,
      payload.full_name,
      payload.role,
      payload.avatar_url,
      payload.is_active ? 1 : 0,
      userId,
    ],
  );

  return result.affectedRows;
}

export async function resetUserPasswordById(userId: number, passwordHash: string) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>(
    "UPDATE users SET password = ?, token_version = token_version + 1 WHERE id = ?",
    [passwordHash, userId],
  );

  return result.affectedRows;
}
