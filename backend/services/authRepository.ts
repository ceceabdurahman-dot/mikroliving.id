import { RowDataPacket } from "mysql2/promise";
import { getDb } from "../config/database";

type UserRow = RowDataPacket & {
  id: number;
  username: string;
  password: string;
};

export async function findUserByUsername(username: string) {
  const db = getDb();
  const [rows] = await db.execute<UserRow[]>("SELECT * FROM users WHERE username = ?", [username]);
  return rows[0] ?? null;
}
