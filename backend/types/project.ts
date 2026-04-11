export type ProjectPayload = {
  title: string;
  category: string;
  location: string;
  size: string;
  image_url: string;
  description: string;
  is_featured?: boolean;
};

export type ProjectRecord = {
  id: number;
  title: string;
  category: string;
  location: string;
  size: string;
  image_url: string;
  description: string;
  is_featured: number | boolean;
  created_at?: string;
  updated_at?: string;
};
