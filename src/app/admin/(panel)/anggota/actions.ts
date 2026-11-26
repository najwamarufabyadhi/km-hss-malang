"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient, getAuthenticatedAdmin } from "@/lib/supabase/server";
import {
  deleteImageFromMedia,
  uploadImageToMedia,
} from "@/lib/supabase/storage";
import { memberSchema } from "@/lib/validations/schemas";

export interface MemberActionState {
  success?: string;
  error?: string;
}

export async function upsertMemberAction(
  _prevState: MemberActionState,
  formData: FormData
): Promise<MemberActionState> {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return { error: "Sesi admin tidak valid." };
  }

  const supabase = await createClient();
  const id = String(formData.get("id") ?? "").trim();

  let existingPhotoUrl: string | null = null;
  if (id) {
    const { data: existing } = await supabase
      .from("members")
      .select("photo_url")
      .eq("id", id)
      .maybeSingle();
    existingPhotoUrl = existing?.photo_url ?? null;
  }

  let photoUrl: string | null = existingPhotoUrl;
  const photoFile = formData.get("photo_file");
  const removePhoto = formData.get("photo_file_remove") === "true";

  if (photoFile instanceof File && photoFile.size > 0) {
    const uploaded = await uploadImageToMedia(photoFile, "members");
    if (uploaded.error) {
      return { error: uploaded.error };
    }
    if (existingPhotoUrl) {
      await deleteImageFromMedia(existingPhotoUrl);
    }
    photoUrl = uploaded.url ?? null;
  } else if (removePhoto) {
    if (existingPhotoUrl) {
      await deleteImageFromMedia(existingPhotoUrl);
    }
    photoUrl = null;
  }

  const rawDivisionId = String(formData.get("division_id") ?? "").trim();
  const rawPeriodId = String(formData.get("period_id") ?? "").trim();

  const parsed = memberSchema.safeParse({
    full_name: formData.get("full_name"),
    position: formData.get("position"),
    is_core: formData.get("is_core") === "on",
    division_id: rawDivisionId || null,
    period_id: rawPeriodId || null,
    photo_url: photoUrl,
    bio: formData.get("bio") ?? "",
    social_links: {
      instagram: String(formData.get("social_instagram") ?? ""),
      linkedin: String(formData.get("social_linkedin") ?? ""),
    },
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data anggota tidak valid.",
    };
  }

  const { error } = id
    ? await supabase.from("members").update(parsed.data).eq("id", id)
    : await supabase.from("members").insert(parsed.data);

  if (error) {
    return { error: `Gagal menyimpan anggota: ${error.message}` };
  }

  updateTag("structure");
  revalidatePath("/");
  revalidatePath("/struktur");
  revalidatePath("/anggota");
  revalidatePath("/admin");
  revalidatePath("/admin/anggota");

  return {
    success: id ? "Data anggota berhasil diperbarui." : "Anggota berhasil ditambahkan.",
  };
}

export async function deleteMemberAction(
  id: string
): Promise<MemberActionState> {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return { error: "Sesi admin tidak valid." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("members")
    .select("photo_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("members").delete().eq("id", id);

  if (error) {
    return { error: `Gagal menghapus anggota: ${error.message}` };
  }

  if (existing?.photo_url) {
    await deleteImageFromMedia(existing.photo_url);
  }

  updateTag("structure");
  revalidatePath("/");
  revalidatePath("/struktur");
  revalidatePath("/anggota");
  revalidatePath("/admin");
  revalidatePath("/admin/anggota");

  return { success: "Anggota berhasil dihapus." };
}
