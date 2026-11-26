"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient, getAuthenticatedAdmin } from "@/lib/supabase/server";
import { periodSchema } from "@/lib/validations/schemas";

export interface PeriodActionState {
  success?: string;
  error?: string;
}

export async function upsertPeriodAction(
  _prevState: PeriodActionState,
  formData: FormData
): Promise<PeriodActionState> {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return { error: "Sesi admin tidak valid." };
  }

  const id = String(formData.get("id") ?? "").trim();
  const parsed = periodSchema.safeParse({
    name: formData.get("name"),
    is_active: formData.get("is_active") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data periode tidak valid.",
    };
  }

  const supabase = await createClient();

  if (parsed.data.is_active) {
    await supabase
      .from("periods")
      .update({ is_active: false })
      .neq("id", id || "00000000-0000-0000-0000-000000000000");
  }

  const { error } = id
    ? await supabase.from("periods").update(parsed.data).eq("id", id)
    : await supabase.from("periods").insert(parsed.data);

  if (error) {
    return { error: `Gagal menyimpan periode: ${error.message}` };
  }

  updateTag("structure");
  revalidatePath("/");
  revalidatePath("/struktur");
  revalidatePath("/anggota");
  revalidatePath("/admin/periode");
  revalidatePath("/admin/anggota");

  return {
    success: id ? "Periode berhasil diperbarui." : "Periode berhasil ditambahkan.",
  };
}

export async function deletePeriodAction(
  id: string
): Promise<PeriodActionState> {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return { error: "Sesi admin tidak valid." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("periods").delete().eq("id", id);

  if (error) {
    return { error: `Gagal menghapus periode: ${error.message}` };
  }

  updateTag("structure");
  revalidatePath("/");
  revalidatePath("/struktur");
  revalidatePath("/anggota");
  revalidatePath("/admin/periode");
  revalidatePath("/admin/anggota");

  return { success: "Periode berhasil dihapus." };
}
