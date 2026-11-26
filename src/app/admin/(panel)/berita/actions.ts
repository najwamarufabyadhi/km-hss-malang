"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient, getAuthenticatedAdmin } from "@/lib/supabase/server";
import {
  deleteImageFromMedia,
  uploadImageToMedia,
} from "@/lib/supabase/storage";
import { postSchema } from "@/lib/validations/schemas";

export interface PostActionState {
  success?: string;
  error?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function upsertPostAction(
  _prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return { error: "Sesi admin tidak valid." };
  }

  const supabase = await createClient();
  const id = String(formData.get("id") ?? "").trim();

  let existingCoverUrl: string | null = null;
  let existingPublishedAt: string | null = null;
  let existingSlug: string | null = null;

  if (id) {
    const { data: existing } = await supabase
      .from("posts")
      .select("cover_image_url, published_at, slug")
      .eq("id", id)
      .maybeSingle();
    existingCoverUrl = existing?.cover_image_url ?? null;
    existingPublishedAt = existing?.published_at ?? null;
    existingSlug = existing?.slug ?? null;
  }

  let coverImageUrl: string | null = existingCoverUrl;
  const coverFile = formData.get("cover_file");
  const removeCover = formData.get("cover_file_remove") === "true";

  if (coverFile instanceof File && coverFile.size > 0) {
    const uploaded = await uploadImageToMedia(coverFile, "posts");
    if (uploaded.error) {
      return { error: uploaded.error };
    }
    if (existingCoverUrl) {
      await deleteImageFromMedia(existingCoverUrl);
    }
    coverImageUrl = uploaded.url ?? null;
  } else if (removeCover) {
    if (existingCoverUrl) {
      await deleteImageFromMedia(existingCoverUrl);
    }
    coverImageUrl = null;
  }

  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const normalizedSlug = slugify(rawSlug || title);
  const content = String(formData.get("content") ?? "").trim();
  const rawExcerpt = String(formData.get("excerpt") ?? "").trim();
  const autoExcerpt =
    rawExcerpt ||
    (content.length > 160 ? `${content.slice(0, 157)}...` : content);

  const intent = String(formData.get("intent") ?? "draft");
  const status = intent === "published" ? "published" : "draft";

  const parsed = postSchema.safeParse({
    title,
    slug: normalizedSlug,
    category: formData.get("category") ?? "kegiatan",
    excerpt: autoExcerpt,
    content,
    cover_image_url: coverImageUrl,
    is_featured: formData.get("is_featured") === "on",
    status,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data berita tidak valid.",
    };
  }

  const publishedAt =
    status === "published"
      ? (existingPublishedAt ?? new Date().toISOString())
      : existingPublishedAt;

  const payload = {
    ...parsed.data,
    published_at: publishedAt,
    author_email: admin.email ?? null,
  };

  const { error } = id
    ? await supabase.from("posts").update(payload).eq("id", id)
    : await supabase.from("posts").insert(payload);

  if (error) {
    if (error.code === "23505") {
      return {
        error: "Slug sudah digunakan berita lain. Silakan ubah slug.",
      };
    }
    return { error: `Gagal menyimpan berita: ${error.message}` };
  }

  updateTag("posts");
  revalidatePath("/");
  revalidatePath("/berita");
  revalidatePath(`/berita/${parsed.data.slug}`);
  if (existingSlug && existingSlug !== parsed.data.slug) {
    revalidatePath(`/berita/${existingSlug}`);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/berita");

  return {
    success:
      status === "published"
        ? "Berita berhasil diterbitkan."
        : "Berita berhasil disimpan sebagai draft.",
  };
}

export async function deletePostAction(id: string): Promise<PostActionState> {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return { error: "Sesi admin tidak valid." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("posts")
    .select("cover_image_url, slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    return { error: `Gagal menghapus berita: ${error.message}` };
  }

  if (existing?.cover_image_url) {
    await deleteImageFromMedia(existing.cover_image_url);
  }

  updateTag("posts");
  revalidatePath("/");
  revalidatePath("/berita");
  if (existing?.slug) {
    revalidatePath(`/berita/${existing.slug}`);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/berita");

  return { success: "Berita berhasil dihapus." };
}
