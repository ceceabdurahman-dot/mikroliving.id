import { ContactPayload } from "../types/contact";
import { InquiryMeta, InquiryPayload } from "../types/inquiry";
import {
  deleteInquiryById,
  findAllInquiries,
  insertInquiry,
  updateInquiryById,
} from "./inquiryRepository";

export async function createInquiry(contact: ContactPayload, meta?: InquiryMeta) {
  await insertInquiry(contact, meta);
}

export async function getAdminInquiries() {
  return findAllInquiries();
}

export async function updateInquiry(inquiryId: number, payload: InquiryPayload) {
  return updateInquiryById(inquiryId, payload);
}

export async function deleteInquiry(inquiryId: number) {
  return deleteInquiryById(inquiryId);
}
