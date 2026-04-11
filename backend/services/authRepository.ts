import { RowDataPacket } from "mysql2/promise";
import { getDb } from "../config/database";

type UserRow = RowDataPacket & {
  id: number;
  username: string;
  password: string;
  is_active: number;
  token_version: number;
};

type UserSessionRow = RowDataPacket & {
  id: number;
  username: string;
  is_active: number;
  token_version: number;
};

export async function findUserByUsername(username: string) {
  const db = getDb();
  const [rows] = await db.execute<UserRow[]>(
    "SELECT id, username, password, is_active, token_version FROM users WHERE username = ? LIMIT 1",
    [username],
  );

  return rows[0] ?? null;
}

export async function findUserSessionById(userId: number) {
  const db = getDb();
  const [rows] = await db.execute<UserSessionRow[]>(
    "SELECT id, username, is_active, token_version FROM users WHERE id = ? LIMIT 1",
    [userId],
  );

  return rows[0] ?? null;
}

export async function recordSuccessfulLogin(userId: number) {
  const db = getDb();
  await db.execute("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?", [userId]);
}

export async function invalidateUserTokens(userId: number) {
  const db = getDb();
  await db.execute("UPDATE users SET token_version = token_version + 1 WHERE id = ?", [userId]);
}
