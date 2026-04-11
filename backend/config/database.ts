import mysql from "mysql2/promise";
import { DB_CONFIG } from "./env";

let pool: mysql.Pool | null = null;

export function getDb() {
  if (!pool) {
    pool = mysql.createPool(DB_CONFIG);
  }

  return pool;
}
