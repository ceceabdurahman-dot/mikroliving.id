import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDb } from "../config/database";
import {
  ContactChannelPayload,
  ContactChannelRecord,
  InsightPayload,
  InsightRecord,
  NavigationLinkPayload,
  NavigationLinkRecord,
  ServicePayload,
  ServiceRecord,
  SiteSettingPayload,
  SiteSettingRecord,
  TestimonialPayload,
  TestimonialRecord,
} from "../types/cms";

export async function findPublicServices() {
  const db = getDb();
  const [rows] = await db.execute<(RowDataPacket & ServiceRecord)[]>("SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC, id ASC");
  return rows;
}

export async function findAllServices() {
  const db = getDb();
  const [rows] = await db.execute<(RowDataPacket & ServiceRecord)[]>("SELECT * FROM services ORDER BY sort_order ASC, id ASC");
  return rows;
}

export async function insertService(payload: ServicePayload) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("INSERT INTO services (icon_key, title, description, sort_order, is_active) VALUES (?, ?, ?, ?, ?)", [payload.icon_key, payload.title, payload.description, payload.sort_order ?? 0, payload.is_active ? 1 : 0]);
  return result.insertId;
}

export async function updateServiceById(serviceId: number, payload: ServicePayload) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("UPDATE services SET icon_key = ?, title = ?, description = ?, sort_order = ?, is_active = ? WHERE id = ?", [payload.icon_key, payload.title, payload.description, payload.sort_order ?? 0, payload.is_active ? 1 : 0, serviceId]);
  return result.affectedRows;
}

export async function deleteServiceById(serviceId: number) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("DELETE FROM services WHERE id = ?", [serviceId]);
  return result.affectedRows;
}

export async function findPublicInsights() {
  const db = getDb();
  const [rows] = await db.execute<(RowDataPacket & InsightRecord)[]>("SELECT * FROM insights WHERE is_published = 1 ORDER BY sort_order ASC, published_at DESC, id DESC LIMIT 6");
  return rows;
}

export async function findAllInsights() {
  const db = getDb();
  const [rows] = await db.execute<(RowDataPacket & InsightRecord)[]>("SELECT * FROM insights ORDER BY sort_order ASC, published_at DESC, id DESC");
  return rows;
}

export async function insertInsight(payload: InsightPayload & { slug: string }) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("INSERT INTO insights (tag, slug, title, excerpt, content, image_url, image_public_id, author_name, is_published, sort_order, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [payload.tag, payload.slug, payload.title, payload.excerpt, payload.content || null, payload.image_url || null, payload.image_public_id || null, payload.author_name || null, payload.is_published ? 1 : 0, payload.sort_order ?? 0, payload.published_at || null]);
  return result.insertId;
}

export async function updateInsightById(insightId: number, payload: InsightPayload & { slug: string }) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("UPDATE insights SET tag = ?, slug = ?, title = ?, excerpt = ?, content = ?, image_url = ?, image_public_id = ?, author_name = ?, is_published = ?, sort_order = ?, published_at = ? WHERE id = ?", [payload.tag, payload.slug, payload.title, payload.excerpt, payload.content || null, payload.image_url || null, payload.image_public_id || null, payload.author_name || null, payload.is_published ? 1 : 0, payload.sort_order ?? 0, payload.published_at || null, insightId]);
  return result.affectedRows;
}

export async function deleteInsightById(insightId: number) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("DELETE FROM insights WHERE id = ?", [insightId]);
  return result.affectedRows;
}

export async function findFeaturedTestimonial() {
  const db = getDb();
  const [rows] = await db.execute<(RowDataPacket & TestimonialRecord)[]>("SELECT * FROM testimonials WHERE is_active = 1 ORDER BY is_featured DESC, sort_order ASC, id ASC LIMIT 1");
  return rows[0] ?? null;
}

export async function findAllTestimonials() {
  const db = getDb();
  const [rows] = await db.execute<(RowDataPacket & TestimonialRecord)[]>("SELECT * FROM testimonials ORDER BY is_featured DESC, sort_order ASC, id ASC");
  return rows;
}

export async function insertTestimonial(payload: TestimonialPayload) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("INSERT INTO testimonials (client_name, client_label, quote, image_url, image_public_id, rating, is_featured, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [payload.client_name, payload.client_label || null, payload.quote, payload.image_url || null, payload.image_public_id || null, payload.rating ?? 5, payload.is_featured ? 1 : 0, payload.sort_order ?? 0, payload.is_active ? 1 : 0]);
  return result.insertId;
}

export async function updateTestimonialById(testimonialId: number, payload: TestimonialPayload) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("UPDATE testimonials SET client_name = ?, client_label = ?, quote = ?, image_url = ?, image_public_id = ?, rating = ?, is_featured = ?, sort_order = ?, is_active = ? WHERE id = ?", [payload.client_name, payload.client_label || null, payload.quote, payload.image_url || null, payload.image_public_id || null, payload.rating ?? 5, payload.is_featured ? 1 : 0, payload.sort_order ?? 0, payload.is_active ? 1 : 0, testimonialId]);
  return result.affectedRows;
}

export async function deleteTestimonialById(testimonialId: number) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("DELETE FROM testimonials WHERE id = ?", [testimonialId]);
  return result.affectedRows;
}

export async function findPublicSiteSettings() {
  const db = getDb();
  const [rows] = await db.execute<(RowDataPacket & SiteSettingRecord)[]>("SELECT * FROM site_settings WHERE is_public = 1 ORDER BY setting_group ASC, id ASC");
  return rows;
}

export async function findSiteSettingsByGroups(groups: string[]) {
  const db = getDb();
  const placeholders = groups.map(() => "?").join(", ");
  const [rows] = await db.execute<(RowDataPacket & SiteSettingRecord)[]>(`SELECT * FROM site_settings WHERE setting_group IN (${placeholders}) ORDER BY setting_group ASC, id ASC`, groups);
  return rows;
}

export async function upsertSiteSettings(settings: SiteSettingPayload[]) {
  const db = getDb();
  for (const setting of settings) {
    await db.execute("UPDATE site_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?", [setting.setting_value, setting.setting_key]);
  }
}

export async function findPublicNavigationLinks() {
  const db = getDb();
  const [rows] = await db.execute<(RowDataPacket & NavigationLinkRecord)[]>("SELECT * FROM navigation_links WHERE is_active = 1 ORDER BY location ASC, sort_order ASC, id ASC");
  return rows;
}

export async function findAllNavigationLinks() {
  const db = getDb();
  const [rows] = await db.execute<(RowDataPacket & NavigationLinkRecord)[]>("SELECT * FROM navigation_links ORDER BY location ASC, sort_order ASC, id ASC");
  return rows;
}

export async function insertNavigationLink(payload: NavigationLinkPayload) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("INSERT INTO navigation_links (label, url, location, sort_order, opens_new_tab, is_active) VALUES (?, ?, ?, ?, ?, ?)", [payload.label, payload.url, payload.location, payload.sort_order ?? 0, payload.opens_new_tab ? 1 : 0, payload.is_active ? 1 : 0]);
  return result.insertId;
}

export async function updateNavigationLinkById(linkId: number, payload: NavigationLinkPayload) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("UPDATE navigation_links SET label = ?, url = ?, location = ?, sort_order = ?, opens_new_tab = ?, is_active = ? WHERE id = ?", [payload.label, payload.url, payload.location, payload.sort_order ?? 0, payload.opens_new_tab ? 1 : 0, payload.is_active ? 1 : 0, linkId]);
  return result.affectedRows;
}

export async function deleteNavigationLinkById(linkId: number) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("DELETE FROM navigation_links WHERE id = ?", [linkId]);
  return result.affectedRows;
}

export async function findPublicContactChannels() {
  const db = getDb();
  const [rows] = await db.execute<(RowDataPacket & ContactChannelRecord)[]>("SELECT * FROM contact_channels WHERE is_active = 1 ORDER BY sort_order ASC, id ASC");
  return rows;
}

export async function findAllContactChannels() {
  const db = getDb();
  const [rows] = await db.execute<(RowDataPacket & ContactChannelRecord)[]>("SELECT * FROM contact_channels ORDER BY sort_order ASC, id ASC");
  return rows;
}

export async function insertContactChannel(payload: ContactChannelPayload) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("INSERT INTO contact_channels (label, value_text, href, icon_key, location_label, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)", [payload.label, payload.value_text, payload.href || null, payload.icon_key || null, payload.location_label || null, payload.sort_order ?? 0, payload.is_active ? 1 : 0]);
  return result.insertId;
}

export async function updateContactChannelById(channelId: number, payload: ContactChannelPayload) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("UPDATE contact_channels SET label = ?, value_text = ?, href = ?, icon_key = ?, location_label = ?, sort_order = ?, is_active = ? WHERE id = ?", [payload.label, payload.value_text, payload.href || null, payload.icon_key || null, payload.location_label || null, payload.sort_order ?? 0, payload.is_active ? 1 : 0, channelId]);
  return result.affectedRows;
}

export async function deleteContactChannelById(channelId: number) {
  const db = getDb();
  const [result] = await db.execute<ResultSetHeader>("DELETE FROM contact_channels WHERE id = ?", [channelId]);
  return result.affectedRows;
}
