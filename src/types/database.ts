export type PostCategory = "kegiatan" | "pengumuman" | "prestasi" | "divisi";
export type PostStatus = "draft" | "published";

export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  facebook?: string;
  linkedin?: string;
  website?: string;
}

export interface OrganizationProfile {
  id: string;
  name: string;
  logo_url: string | null;
  description: string;
  vision: string;
  mission: string;
  goals: string;
  main_focus: string;
  social_links: SocialLinks;
  announcement_enabled: boolean;
  announcement_text: string;
  announcement_url: string | null;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  category: PostCategory;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  is_featured: boolean;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_email: string | null;
}

export interface Division {
  id: string;
  name: string;
  description: string;
  sort_order: number;
}

export interface Member {
  id: string;
  full_name: string;
  position: string;
  is_core: boolean;
  division_id: string | null;
  photo_url: string | null;
  bio: string;
  social_links: SocialLinks;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  email: string;
  created_at: string;
}
