export type ServiceRecord = {
  id: number;
  icon_key: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: number | boolean;
  created_at?: string;
  updated_at?: string;
};

export type ServicePayload = {
  icon_key: string;
  title: string;
  description: string;
  sort_order?: number;
  is_active?: boolean;
};

export type InsightRecord = {
  id: number;
  tag: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string | null;
  image_url?: string | null;
  image_public_id?: string | null;
  author_name?: string | null;
  is_published: number | boolean;
  sort_order: number;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type InsightPayload = {
  tag: string;
  title: string;
  excerpt: string;
  content?: string;
  image_url?: string;
  image_public_id?: string;
  author_name?: string;
  is_published?: boolean;
  sort_order?: number;
  published_at?: string | null;
};

export type TestimonialRecord = {
  id: number;
  client_name: string;
  client_label?: string | null;
  quote: string;
  image_url?: string | null;
  image_public_id?: string | null;
  rating?: number | null;
  is_featured: number | boolean;
  sort_order: number;
  is_active: number | boolean;
  created_at?: string;
  updated_at?: string;
};

export type TestimonialPayload = {
  client_name: string;
  client_label?: string;
  quote: string;
  image_url?: string;
  image_public_id?: string;
  rating?: number;
  is_featured?: boolean;
  sort_order?: number;
  is_active?: boolean;
};

export type SiteSettingRecord = {
  id: number;
  setting_group: string;
  setting_key: string;
  label: string;
  value_type: "text" | "textarea" | "url" | "json";
  setting_value: string | null;
  is_public: number | boolean;
  created_at?: string;
  updated_at?: string;
};

export type SiteSettingPayload = {
  setting_key: string;
  setting_value: string;
};

export type NavigationLinkRecord = {
  id: number;
  label: string;
  url: string;
  location: "header" | "footer" | "legal";
  sort_order: number;
  opens_new_tab: number | boolean;
  is_active: number | boolean;
};

export type NavigationLinkPayload = {
  label: string;
  url: string;
  location: "header" | "footer" | "legal";
  sort_order?: number;
  opens_new_tab?: boolean;
  is_active?: boolean;
};

export type ContactChannelRecord = {
  id: number;
  label: string;
  value_text: string;
  href?: string | null;
  icon_key?: string | null;
  location_label?: string | null;
  sort_order: number;
  is_active: number | boolean;
};

export type ContactChannelPayload = {
  label: string;
  value_text: string;
  href?: string;
  icon_key?: string;
  location_label?: string;
  sort_order?: number;
  is_active?: boolean;
};

export type HomepageContent = {
  services: ServiceRecord[];
  insights: InsightRecord[];
  testimonial: TestimonialRecord | null;
  settings: Record<string, string>;
  navigation_links: NavigationLinkRecord[];
  contact_channels: ContactChannelRecord[];
};
