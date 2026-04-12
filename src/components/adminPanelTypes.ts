export type TabKey = "dashboard" | "projects" | "services" | "insights" | "testimonials" | "users" | "settings" | "inquiries";
export type UserRole = "admin" | "editor";

export type ProjectForm = {
  title: string;
  category: string;
  location: string;
  size: string;
  image_url: string;
  description: string;
  is_featured: boolean;
};

export type ServiceForm = {
  icon_key: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
};

export type InsightForm = {
  tag: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  image_public_id: string;
  author_name: string;
  is_published: boolean;
  sort_order: number;
  published_at: string;
};

export type TestimonialForm = {
  client_name: string;
  client_label: string;
  quote: string;
  image_url: string;
  image_public_id: string;
  rating: number;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
};

export type InquiryForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  source: string;
  admin_note: string;
  replied_at: string;
  resolved_at: string;
};

export type UserForm = {
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string;
  is_active: boolean;
  password: string;
  confirmPassword: string;
};

export type UserResetPasswordForm = {
  newPassword: string;
  confirmPassword: string;
};

export type ToastItem = { id: number; message: string; tone: "success" | "error" };
export type RestoredDraftState = Partial<Record<TabKey, boolean>>;
export type DraftTimestampState = Partial<Record<TabKey, string | null>>;
export type DraftEnvelope<T> = { value: T; updatedAt: string };
export type FilenameFormat = "short" | "full";
export type LoginForm = { username: string; password: string };
export type LoginMessageTone = "error" | "success";
export type PasswordChangeForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
export type PendingQueueItem = {
  key: TabKey;
  label: TabKey;
  tone: "restored" | "new";
};

export type BusyState = "idle" | "loading" | "saving" | "uploading" | "deleting";

export const categories = ["Apartment", "Residential", "Kitchen", "Bedroom"];
export const serviceIcons = ["Layout", "Building2", "Sofa", "Hammer"];
export const inquiryStatuses: InquiryForm["status"][] = ["new", "read", "replied", "archived"];
export const settingKeys = [
  "brand_name",
  "hero_headline",
  "hero_subheadline",
  "hero_primary_cta_label",
  "hero_secondary_cta_label",
  "hero_image_url",
  "hero_stats",
  "footer_tagline",
  "footer_copyright",
  "contact_intro",
] as const;

export const emptyProjectForm: ProjectForm = {
  title: "",
  category: "Apartment",
  location: "",
  size: "",
  image_url: "",
  description: "",
  is_featured: false,
};

export const emptyServiceForm: ServiceForm = {
  icon_key: "Layout",
  title: "",
  description: "",
  sort_order: 0,
  is_active: true,
};

export const emptyInsightForm: InsightForm = {
  tag: "",
  title: "",
  excerpt: "",
  content: "",
  image_url: "",
  image_public_id: "",
  author_name: "MikroLiving Studio",
  is_published: true,
  sort_order: 0,
  published_at: "",
};

export const emptyTestimonialForm: TestimonialForm = {
  client_name: "",
  client_label: "",
  quote: "",
  image_url: "",
  image_public_id: "",
  rating: 5,
  is_featured: true,
  sort_order: 0,
  is_active: true,
};

export const emptyInquiryForm: InquiryForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
  status: "new",
  source: "website",
  admin_note: "",
  replied_at: "",
  resolved_at: "",
};

export const emptyPasswordChangeForm: PasswordChangeForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const emptyUserForm: UserForm = {
  username: "",
  email: "",
  full_name: "",
  role: "editor",
  avatar_url: "",
  is_active: true,
  password: "",
  confirmPassword: "",
};

export const emptyUserResetPasswordForm: UserResetPasswordForm = {
  newPassword: "",
  confirmPassword: "",
};
