import axios from "axios";

const API_BASE_URL = "/api";
const ADMIN_SESSION_HINT_COOKIE_NAME = "ml_admin_session_hint";

export interface Project {
  id: number;
  title: string;
  location: string;
  size: string;
  image_url: string;
  category: string;
  description?: string;
  is_featured?: boolean;
}

export interface ServiceItem {
  id: number;
  icon_key: string;
  title: string;
  description: string;
  sort_order: number;
  is_active?: boolean;
}

export interface InsightItem {
  id: number;
  tag: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string | null;
  image_url?: string | null;
  image_public_id?: string | null;
  author_name?: string | null;
  is_published?: boolean;
  sort_order: number;
  published_at?: string | null;
}

export interface TestimonialItem {
  id: number;
  client_name: string;
  client_label?: string | null;
  quote: string;
  image_url?: string | null;
  image_public_id?: string | null;
  rating?: number | null;
  is_featured?: boolean;
  sort_order: number;
  is_active?: boolean;
}

export interface SiteSetting {
  id: number;
  setting_group: string;
  setting_key: string;
  label: string;
  value_type: "text" | "textarea" | "url" | "json";
  setting_value: string | null;
  is_public?: boolean;
}

export interface NavigationLink {
  id: number;
  label: string;
  url: string;
  location: "header" | "footer" | "legal";
  sort_order: number;
  opens_new_tab?: boolean;
  is_active?: boolean;
}

export interface ContactChannel {
  id: number;
  label: string;
  value_text: string;
  href?: string | null;
  icon_key?: string | null;
  location_label?: string | null;
  sort_order: number;
  is_active?: boolean;
}

export interface InquiryItem {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  source: string;
  admin_note?: string | null;
  replied_at?: string | null;
  resolved_at?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type AdminUserRole = "superadmin" | "admin" | "editor";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name?: string | null;
  role: AdminUserRole;
  avatar_url?: string | null;
  is_active: number | boolean;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface HomepageContent {
  services: ServiceItem[];
  insights: InsightItem[];
  testimonial: TestimonialItem | null;
  settings: Record<string, string>;
  navigation_links: NavigationLink[];
  contact_channels: ContactChannel[];
}

export interface AdminContent {
  services: ServiceItem[];
  insights: InsightItem[];
  testimonials: TestimonialItem[];
  settings: SiteSetting[];
  navigation_links: NavigationLink[];
  contact_channels: ContactChannel[];
}

export interface AdminDashboardSummary {
  projects_total: number;
  featured_projects: number;
  services_total: number;
  active_services: number;
  insights_total: number;
  published_insights: number;
  testimonials_total: number;
  active_testimonials: number;
  navigation_links_total: number;
  contact_channels_total: number;
  inquiries_total: number;
  new_inquiries: number;
  replied_inquiries: number;
  archived_inquiries: number;
  latest_inquiry_at?: string | null;
  users_total: number;
  active_users: number;
  admin_users: number;
  superadmin_users: number;
  editor_users: number;
}

export interface AdminDashboardCurrentUser {
  id: number;
  username: string;
  role: AdminUserRole;
}

export interface AdminDashboardData {
  current_user?: AdminDashboardCurrentUser;
  summary: AdminDashboardSummary;
  projects: Project[];
  services: ServiceItem[];
  insights: InsightItem[];
  testimonials: TestimonialItem[];
  settings: SiteSetting[];
  navigation_links: NavigationLink[];
  contact_channels: ContactChannel[];
  inquiries: InquiryItem[];
  users: AdminUser[];
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AdminLoginResponse {
  success: boolean;
  user: {
    id: number;
    username: string;
    role: AdminUserRole;
  };
}

export interface AdminUserCreatePayload {
  username: string;
  email: string;
  full_name: string;
  role: AdminUserRole;
  avatar_url: string;
  is_active: boolean;
  password: string;
  confirmPassword: string;
}

export interface AdminUserUpdatePayload {
  username: string;
  email: string;
  full_name: string;
  role: AdminUserRole;
  avatar_url: string;
  is_active: boolean;
}

export interface AdminUserResetPasswordPayload {
  newPassword: string;
  confirmPassword: string;
}

function buildFallbackDashboardData(projects: Project[], content: AdminContent): AdminDashboardData {
  return {
    current_user: undefined,
    summary: {
      projects_total: projects.length,
      featured_projects: projects.filter((item) => Boolean(item.is_featured)).length,
      services_total: content.services.length,
      active_services: content.services.filter((item) => Boolean(item.is_active)).length,
      insights_total: content.insights.length,
      published_insights: content.insights.filter((item) => Boolean(item.is_published)).length,
      testimonials_total: content.testimonials.length,
      active_testimonials: content.testimonials.filter((item) => Boolean(item.is_active)).length,
      navigation_links_total: content.navigation_links.length,
      contact_channels_total: content.contact_channels.length,
      inquiries_total: 0,
      new_inquiries: 0,
      replied_inquiries: 0,
      archived_inquiries: 0,
      latest_inquiry_at: null,
      users_total: 0,
      active_users: 0,
      admin_users: 0,
      superadmin_users: 0,
      editor_users: 0,
    },
    projects,
    services: content.services,
    insights: content.insights,
    testimonials: content.testimonials,
    settings: content.settings,
    navigation_links: content.navigation_links,
    contact_channels: content.contact_channels,
    inquiries: [],
    users: [],
  };
}

type ApiError = Error & { status?: number };

function getSessionHintCookie() {
  if (typeof document === "undefined") {
    return "";
  }

  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_SESSION_HINT_COOKIE_NAME}=`));

  return cookie?.split("=")[1] ?? "";
}

function clearAdminSession() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${ADMIN_SESSION_HINT_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function extractApiError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : "Request failed.";
  }

  const payload = error.response?.data;
  if (payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string") {
    return payload.error;
  }

  return error.message || "Request failed.";
}

async function withApiError<T>(request: Promise<{ data: T }>): Promise<T> {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    const apiError = new Error(extractApiError(error)) as ApiError;
    if (axios.isAxiosError(error)) {
      apiError.status = error.response?.status;
    }
    throw apiError;
  }
}

const adminRequestConfig = { withCredentials: true };

export function isApiSessionError(error: unknown) {
  return Boolean(
    error
    && typeof error === "object"
    && "status" in error
    && (error as ApiError).status === 401,
  );
}

export const api = {
  getHomepage: async (): Promise<HomepageContent> => (await axios.get(`${API_BASE_URL}/homepage`)).data,
  getProjects: async (): Promise<Project[]> => (await axios.get(`${API_BASE_URL}/projects`)).data,
  submitInquiry: async (data: { name: string; email: string; phone?: string; message: string }) =>
    (await axios.post(`${API_BASE_URL}/contact`, data)).data,
  login: async (credentials: { username: string; password: string }) =>
    withApiError<AdminLoginResponse>(axios.post(`${API_BASE_URL}/admin/login`, credentials, adminRequestConfig)),
  hasAdminSession: () => getSessionHintCookie() === "1",
  logout: async () => {
    try {
      await withApiError(axios.post(`${API_BASE_URL}/admin/logout`, null, adminRequestConfig));
    } finally {
      clearAdminSession();
    }
  },
  clearAdminSession,
  changePassword: async (payload: ChangePasswordPayload) =>
    withApiError(axios.post(`${API_BASE_URL}/admin/change-password`, payload, adminRequestConfig)),
  getAdminDashboard: async (): Promise<AdminDashboardData> => {
    try {
      return await withApiError(axios.get<AdminDashboardData>(`${API_BASE_URL}/admin/dashboard`, adminRequestConfig));
    } catch (error) {
      if (!error || typeof error !== "object" || (error as ApiError).status !== 404) {
        throw error;
      }

      const [projects, content] = await Promise.all([
        axios.get<Project[]>(`${API_BASE_URL}/projects`),
        axios.get<AdminContent>(`${API_BASE_URL}/admin/content`, adminRequestConfig),
      ]);

      return buildFallbackDashboardData(projects.data, content.data);
    }
  },
  getAdminContent: async (): Promise<AdminContent> =>
    (await axios.get(`${API_BASE_URL}/admin/content`, adminRequestConfig)).data,
  getAdminUsers: async (): Promise<AdminUser[]> =>
    withApiError(axios.get<AdminUser[]>(`${API_BASE_URL}/admin/users`, adminRequestConfig)),
  createAdminUser: async (payload: AdminUserCreatePayload) =>
    withApiError(axios.post(`${API_BASE_URL}/admin/users`, payload, adminRequestConfig)),
  updateAdminUser: async (id: number, payload: AdminUserUpdatePayload) =>
    withApiError(axios.put(`${API_BASE_URL}/admin/users/${id}`, payload, adminRequestConfig)),
  resetAdminUserPassword: async (id: number, payload: AdminUserResetPasswordPayload) =>
    withApiError(
      axios.post(`${API_BASE_URL}/admin/users/${id}/reset-password`, payload, adminRequestConfig),
    ),
  createProject: async (payload: Omit<Project, "id">) =>
    (await axios.post(`${API_BASE_URL}/admin/projects`, payload, adminRequestConfig)).data,
  updateProject: async (id: number, payload: Partial<Project>) =>
    (await axios.put(`${API_BASE_URL}/admin/projects/${id}`, payload, adminRequestConfig)).data,
  deleteProject: async (id: number) =>
    (await axios.delete(`${API_BASE_URL}/admin/projects/${id}`, adminRequestConfig)).data,
  createService: async (payload: Omit<ServiceItem, "id">) =>
    (await axios.post(`${API_BASE_URL}/admin/services`, payload, adminRequestConfig)).data,
  updateService: async (id: number, payload: Omit<ServiceItem, "id">) =>
    (await axios.put(`${API_BASE_URL}/admin/services/${id}`, payload, adminRequestConfig)).data,
  deleteService: async (id: number) =>
    (await axios.delete(`${API_BASE_URL}/admin/services/${id}`, adminRequestConfig)).data,
  createInsight: async (payload: Omit<InsightItem, "id" | "slug">) =>
    (await axios.post(`${API_BASE_URL}/admin/insights`, payload, adminRequestConfig)).data,
  updateInsight: async (id: number, payload: Omit<InsightItem, "id" | "slug">) =>
    (await axios.put(`${API_BASE_URL}/admin/insights/${id}`, payload, adminRequestConfig)).data,
  deleteInsight: async (id: number) =>
    (await axios.delete(`${API_BASE_URL}/admin/insights/${id}`, adminRequestConfig)).data,
  createTestimonial: async (payload: Omit<TestimonialItem, "id">) =>
    (await axios.post(`${API_BASE_URL}/admin/testimonials`, payload, adminRequestConfig)).data,
  updateTestimonial: async (id: number, payload: Omit<TestimonialItem, "id">) =>
    (await axios.put(`${API_BASE_URL}/admin/testimonials/${id}`, payload, adminRequestConfig)).data,
  deleteTestimonial: async (id: number) =>
    (await axios.delete(`${API_BASE_URL}/admin/testimonials/${id}`, adminRequestConfig)).data,
  createNavigationLink: async (payload: Omit<NavigationLink, "id">) =>
    (await axios.post(`${API_BASE_URL}/admin/navigation-links`, payload, adminRequestConfig)).data,
  updateNavigationLink: async (id: number, payload: Omit<NavigationLink, "id">) =>
    (await axios.put(`${API_BASE_URL}/admin/navigation-links/${id}`, payload, adminRequestConfig)).data,
  deleteNavigationLink: async (id: number) =>
    (await axios.delete(`${API_BASE_URL}/admin/navigation-links/${id}`, adminRequestConfig)).data,
  createContactChannel: async (payload: Omit<ContactChannel, "id">) =>
    (await axios.post(`${API_BASE_URL}/admin/contact-channels`, payload, adminRequestConfig)).data,
  updateContactChannel: async (id: number, payload: Omit<ContactChannel, "id">) =>
    (await axios.put(`${API_BASE_URL}/admin/contact-channels/${id}`, payload, adminRequestConfig)).data,
  deleteContactChannel: async (id: number) =>
    (await axios.delete(`${API_BASE_URL}/admin/contact-channels/${id}`, adminRequestConfig)).data,
  updateSiteSettings: async (payload: Array<{ setting_key: string; setting_value: string }>) =>
    (await axios.put(`${API_BASE_URL}/admin/site-settings`, payload, adminRequestConfig)).data,
  updateInquiry: async (id: number, payload: Omit<InquiryItem, "id" | "created_at" | "updated_at" | "ip_address" | "user_agent">) =>
    (await axios.put(`${API_BASE_URL}/admin/inquiries/${id}`, payload, adminRequestConfig)).data,
  deleteInquiry: async (id: number) =>
    (await axios.delete(`${API_BASE_URL}/admin/inquiries/${id}`, adminRequestConfig)).data,
  uploadAdminImage: async (payload: { fileName: string; dataUrl: string }) =>
    (await axios.post(`${API_BASE_URL}/admin/uploads/image`, payload, adminRequestConfig)).data as {
      success: boolean;
      imageUrl: string;
      publicId: string;
    },
  getOptimizedImageUrl: async (publicId: string, width = 800, height = 500) =>
    (await axios.get(`${API_BASE_URL}/image-url`, { params: { publicId, width, height } })).data.url,
};
