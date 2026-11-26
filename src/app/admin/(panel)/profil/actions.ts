"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient, getAuthenticatedAdmin } from "@/lib/supabase/server";
import {
  deleteImageFromMedia,
  uploadImageToMedia,
} from "@/lib/supabase/storage";
import { organizationProfileSchema } from "@/lib/validations/schemas";

export interface ProfileActionState {
  success?: string;
  error?: string;
}

export async function updateProfileAction(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return { error: "Sesi admin tidak valid. Silakan login ulang." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("organization_profile")
    .select("id, logo_url")
    .limit(1)
    .maybeSingle();

  let logoUrl: string | null = existing?.logo_url ?? null;
  const logoFile = formData.get("logo_file");
  const removeLogo = formData.get("logo_file_remove") === "true";

  if (logoFile instanceof File && logoFile.size > 0) {
    const uploaded = await uploadImageToMedia(logoFile, "logos");
    if (uploaded.error) {
      return { error: uploaded.error };
    }
    if (existing?.logo_url) {
      await deleteImageFromMedia(existing.logo_url);
    }
    logoUrl = uploaded.url ?? null;
  } else if (removeLogo) {
    if (existing?.logo_url) {
      await deleteImageFromMedia(existing.logo_url);
    }
    logoUrl = null;
  }

  const rawAnnouncementUrl = String(formData.get("announcement_url") ?? "").trim();

  const parsed = organizationProfileSchema.safeParse({
    name: formData.get("name"),
    logo_url: logoUrl,
    description: formData.get("description") ?? "",
    vision: formData.get("vision") ?? "",
    mission: formData.get("mission") ?? "",
    goals: formData.get("goals") ?? "",
    main_focus: formData.get("main_focus") ?? "",
    social_links: {
      instagram: String(formData.get("social_instagram") ?? ""),
      tiktok: String(formData.get("social_tiktok") ?? ""),
      youtube: String(formData.get("social_youtube") ?? ""),
      facebook: String(formData.get("social_facebook") ?? ""),
      website: String(formData.get("social_website") ?? ""),
    },
    announcement_enabled: formData.get("announcement_enabled") === "on",
    announcement_text: String(formData.get("announcement_text") ?? ""),
    announcement_url: rawAnnouncementUrl || null,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data profil tidak valid.",
    };
  }

  const payload = {
    ...parsed.data,
    announcement_url: parsed.data.announcement_url || null,
  };

  const { error } = existing?.id
    ? await supabase
        .from("organization_profile")
        .update(payload)
        .eq("id", existing.id)
    : await supabase.from("organization_profile").insert(payload);

  if (error) {
    return { error: `Gagal menyimpan profil: ${error.message}` };
  }

  updateTag("profile");
  revalidatePath("/");
  revalidatePath("/tentang");
  revalidatePath("/admin/profil");

  return { success: "Profil organisasi berhasil diperbarui." };
}
