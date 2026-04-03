export type InquiryStatus = "new" | "read" | "replied" | "archived";

export type InquiryRecord = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  status: InquiryStatus;
  source: string;
  admin_note?: string | null;
  replied_at?: string | null;
  resolved_at?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type InquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: InquiryStatus;
  source?: string;
  admin_note?: string;
  replied_at?: string | null;
  resolved_at?: string | null;
};

export type InquiryMeta = {
  source?: string;
  ip_address?: string | null;
  user_agent?: string | null;
};
