import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDb } from "../config/database";
import { ContactPayload } from "../types/contact";
import { InquiryMeta, InquiryPayload, InquiryRecord } from "../types/inquiry";

export async function insertInquiry(contact: ContactPayload, meta?: InquiryMeta) {
  const db = getDb();
  await db.execute(
    "INSERT INTO inquiries (name, email, phone, message, source, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      contact.name,
      contact.email,
      contact.phone,
      contact.message,
      meta?.source || "website",
      meta?.ip_address || null,
      meta?.user_agent || null,
    ],
  );
}

export async function findAllInquiries() {
  const db = getDb();
  const [rows] = await db.execute<(RowDataPacket & InquiryRecord)[]>(
    "SELECT * FROM inquiries ORDER BY created_at DESC, id DESC",
  );
  return rows;
}

export async function updateInquiryById(inquiryId: number, payload: InquiryPayload) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>(
    "UPDATE inquiries SET name = ?, email = ?, phone = ?, message = ?, status = ?, source = ?, admin_note = ?, replied_at = ?, resolved_at = ? WHERE id = ?",
    [
      payload.name,
      payload.email,
      payload.phone || null,
      payload.message,
      payload.status,
      payload.source || "website",
      payload.admin_note || null,
      payload.replied_at || null,
      payload.resolved_at || null,
      inquiryId,
    ],
  );
  return result.affectedRows;
}

export async function deleteInquiryById(inquiryId: number) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("DELETE FROM inquiries WHERE id = ?", [inquiryId]);
  return result.affectedRows;
}
