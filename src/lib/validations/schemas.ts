import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Email tidak valid").toLowerCase(),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const socialLinksSchema = z.object({
  instagram: z.string().trim().url("URL Instagram tidak valid").or(z.literal("")).optional(),
  tiktok: z.string().trim().url("URL TikTok tidak valid").or(z.literal("")).optional(),
  youtube: z.string().trim().url("URL YouTube tidak valid").or(z.literal("")).optional(),
  facebook: z.string().trim().url("URL Facebook tidak valid").or(z.literal("")).optional(),
  linkedin: z.string().trim().url("URL LinkedIn tidak valid").or(z.literal("")).optional(),
  website: z.string().trim().url("URL Website tidak valid").or(z.literal("")).optional(),
});

export const organizationProfileSchema = z.object({
  name: z.string().trim().min(3, "Nama organisasi minimal 3 karakter").max(200),
  logo_url: z.string().trim().url().nullable().optional(),
  description: z.string().trim().max(5000),
  vision: z.string().trim().max(2000),
  mission: z.string().trim().max(5000),
  goals: z.string().trim().max(3000),
  main_focus: z.string().trim().max(3000),
  social_links: socialLinksSchema.optional(),
  announcement_enabled: z.boolean(),
  announcement_text: z.string().trim().max(300),
  announcement_url: z.string().trim().url("URL pengumuman tidak valid").nullable().or(z.literal("")).optional(),
});

export const postSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(200),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  category: z.enum(["kegiatan", "pengumuman", "prestasi", "divisi"]),
  excerpt: z.string().trim().max(400),
  content: z.string().trim().min(10, "Isi berita minimal 10 karakter"),
  cover_image_url: z.string().trim().url().nullable().optional(),
  is_featured: z.boolean(),
  status: z.enum(["draft", "published"]),
});

export const divisionSchema = z.object({
  name: z.string().trim().min(2, "Nama divisi minimal 2 karakter").max(120),
  description: z.string().trim().max(1000),
  sort_order: z.number().int().min(0),
});

export const memberSchema = z.object({
  full_name: z.string().trim().min(2, "Nama lengkap minimal 2 karakter").max(150),
  position: z.string().trim().min(2, "Jabatan minimal 2 karakter").max(120),
  is_core: z.boolean(),
  division_id: z.string().uuid().nullable().optional(),
  photo_url: z.string().trim().url().nullable().optional(),
  bio: z.string().trim().max(1000),
  social_links: socialLinksSchema.optional(),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
});

export const adminSchema = z.object({
  email: z.string().trim().email("Email tidak valid").toLowerCase(),
  password: z.string().min(8, "Password minimal 8 karakter").optional(),
});
