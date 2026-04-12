import axios from "axios";

const API_BASE_URL = "/api";
const ADMIN_TOKEN_KEY = "admin_token";

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

export type AdminUserRole = "admin" | "editor";

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
  editor_users: number;
}

export interface AdminDashboardData {
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

const getAuthHeader = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

type ApiError = Error & { status?: number };

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

export const api = {
  getHomepage: async (): Promise<HomepageContent> => (await axios.get(`${API_BASE_URL}/homepage`)).data,
  getProjects: async (): Promise<Project[]> => (await axios.get(`${API_BASE_URL}/projects`)).data,
  submitInquiry: async (data: { name: string; email: string; phone?: string; message: string }) =>
    (await axios.post(`${API_BASE_URL}/contact`, data)).data,
  login: async (credentials: { username: string; password: string }) => {
    const response = await withApiError<{ token?: string } & Record<string, unknown>>(
      axios.post(`${API_BASE_URL}/admin/login`, credentials),
    );
    if (response.token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, response.token);
    }
    return response;
  },
  hasAdminSession: () => Boolean(localStorage.getItem(ADMIN_TOKEN_KEY)),
  logout: async () => {
    const headers = getAuthHeader();

    try {
      if (headers.Authorization) {
        await withApiError(axios.post(`${API_BASE_URL}/admin/logout`, null, { headers }));
      }
    } finally {
      clearAdminSession();
    }
  },
  clearAdminSession,
  changePassword: async (payload: ChangePasswordPayload) =>
    withApiError(axios.post(`${API_BASE_URL}/admin/change-password`, payload, { headers: getAuthHeader() })),
  getAdminDashboard: async (): Promise<AdminDashboardData> => {
    try {
      return await withApiError(axios.get<AdminDashboardData>(`${API_BASE_URL}/admin/dashboard`, { headers: getAuthHeader() }));
    } catch (error) {
      if (!error || typeof error !== "object" || (error as ApiError).status !== 404) {
        throw error;
      }

      const [projects, content] = await Promise.all([
        axios.get<Project[]>(`${API_BASE_URL}/projects`),
        axios.get<AdminContent>(`${API_BASE_URL}/admin/content`, { headers: getAuthHeader() }),
      ]);

      return buildFallbackDashboardData(projects.data, content.data);
    }
  },
  getAdminContent: async (): Promise<AdminContent> =>
    (await axios.get(`${API_BASE_URL}/admin/content`, { headers: getAuthHeader() })).data,
  getAdminUsers: async (): Promise<AdminUser[]> =>
    withApiError(axios.get<AdminUser[]>(`${API_BASE_URL}/admin/users`, { headers: getAuthHeader() })),
  createAdminUser: async (payload: AdminUserCreatePayload) =>
    withApiError(axios.post(`${API_BASE_URL}/admin/users`, payload, { headers: getAuthHeader() })),
  updateAdminUser: async (id: number, payload: AdminUserUpdatePayload) =>
    withApiError(axios.put(`${API_BASE_URL}/admin/users/${id}`, payload, { headers: getAuthHeader() })),
  resetAdminUserPassword: async (id: number, payload: AdminUserResetPasswordPayload) =>
    withApiError(
      axios.post(`${API_BASE_URL}/admin/users/${id}/reset-password`, payload, { headers: getAuthHeader() }),
    ),
  createProject: async (payload: Omit<Project, "id">) =>
    (await axios.post(`${API_BASE_URL}/admin/projects`, payload, { headers: getAuthHeader() })).data,
  updateProject: async (id: number, payload: Partial<Project>) =>
    (await axios.put(`${API_BASE_URL}/admin/projects/${id}`, payload, { headers: getAuthHeader() })).data,
  deleteProject: async (id: number) =>
    (await axios.delete(`${API_BASE_URL}/admin/projects/${id}`, { headers: getAuthHeader() })).data,
  createService: async (payload: Omit<ServiceItem, "id">) =>
    (await axios.post(`${API_BASE_URL}/admin/services`, payload, { headers: getAuthHeader() })).data,
  updateService: async (id: number, payload: Omit<ServiceItem, "id">) =>
    (await axios.put(`${API_BASE_URL}/admin/services/${id}`, payload, { headers: getAuthHeader() })).data,
  deleteService: async (id: number) =>
    (await axios.delete(`${API_BASE_URL}/admin/services/${id}`, { headers: getAuthHeader() })).data,
  createInsight: async (payload: Omit<InsightItem, "id" | "slug">) =>
    (await axios.post(`${API_BASE_URL}/admin/insights`, payload, { headers: getAuthHeader() })).data,
  updateInsight: async (id: number, payload: Omit<InsightItem, "id" | "slug">) =>
    (await axios.put(`${API_BASE_URL}/admin/insights/${id}`, payload, { headers: getAuthHeader() })).data,
  deleteInsight: async (id: number) =>
    (await axios.delete(`${API_BASE_URL}/admin/insights/${id}`, { headers: getAuthHeader() })).data,
  createTestimonial: async (payload: Omit<TestimonialItem, "id">) =>
    (await axios.post(`${API_BASE_URL}/admin/testimonials`, payload, { headers: getAuthHeader() })).data,
  updateTestimonial: async (id: number, payload: Omit<TestimonialItem, "id">) =>
    (await axios.put(`${API_BASE_URL}/admin/testimonials/${id}`, payload, { headers: getAuthHeader() })).data,
  deleteTestimonial: async (id: number) =>
    (await axios.delete(`${API_BASE_URL}/admin/testimonials/${id}`, { headers: getAuthHeader() })).data,
  createNavigationLink: async (payload: Omit<NavigationLink, "id">) =>
    (await axios.post(`${API_BASE_URL}/admin/navigation-links`, payload, { headers: getAuthHeader() })).data,
  updateNavigationLink: async (id: number, payload: Omit<NavigationLink, "id">) =>
    (await axios.put(`${API_BASE_URL}/admin/navigation-links/${id}`, payload, { headers: getAuthHeader() })).data,
  deleteNavigationLink: async (id: number) =>
    (await axios.delete(`${API_BASE_URL}/admin/navigation-links/${id}`, { headers: getAuthHeader() })).data,
  createContactChannel: async (payload: Omit<ContactChannel, "id">) =>
    (await axios.post(`${API_BASE_URL}/admin/contact-channels`, payload, { headers: getAuthHeader() })).data,
  updateContactChannel: async (id: number, payload: Omit<ContactChannel, "id">) =>
    (await axios.put(`${API_BASE_URL}/admin/contact-channels/${id}`, payload, { headers: getAuthHeader() })).data,
  deleteContactChannel: async (id: number) =>
    (await axios.delete(`${API_BASE_URL}/admin/contact-channels/${id}`, { headers: getAuthHeader() })).data,
  updateSiteSettings: async (payload: Array<{ setting_key: string; setting_value: string }>) =>
    (await axios.put(`${API_BASE_URL}/admin/site-settings`, payload, { headers: getAuthHeader() })).data,
  updateInquiry: async (id: number, payload: Omit<InquiryItem, "id" | "created_at" | "updated_at" | "ip_address" | "user_agent">) =>
    (await axios.put(`${API_BASE_URL}/admin/inquiries/${id}`, payload, { headers: getAuthHeader() })).data,
  deleteInquiry: async (id: number) =>
    (await axios.delete(`${API_BASE_URL}/admin/inquiries/${id}`, { headers: getAuthHeader() })).data,
  uploadAdminImage: async (payload: { fileName: string; dataUrl: string }) =>
    (await axios.post(`${API_BASE_URL}/admin/uploads/image`, payload, { headers: getAuthHeader() })).data as {
      success: boolean;
      imageUrl: string;
      publicId: string;
    },
  getOptimizedImageUrl: async (publicId: string, width = 800, height = 500) =>
    (await axios.get(`${API_BASE_URL}/image-url`, { params: { publicId, width, height } })).data.url,
};
