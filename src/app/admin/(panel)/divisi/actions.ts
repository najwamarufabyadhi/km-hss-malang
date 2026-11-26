"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient, getAuthenticatedAdmin } from "@/lib/supabase/server";
import { divisionSchema } from "@/lib/validations/schemas";

export interface DivisionActionState {
  success?: string;
  error?: string;
}

export async function upsertDivisionAction(
  _prevState: DivisionActionState,
  formData: FormData
): Promise<DivisionActionState> {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return { error: "Sesi admin tidak valid." };
  }

  const id = String(formData.get("id") ?? "").trim();
  const parsed = divisionSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    sort_order: Number(formData.get("sort_order") ?? 0),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data divisi tidak valid.",
    };
  }

  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("divisions").update(parsed.data).eq("id", id)
    : await supabase.from("divisions").insert(parsed.data);

  if (error) {
    return { error: `Gagal menyimpan divisi: ${error.message}` };
  }

  updateTag("structure");
  revalidatePath("/");
  revalidatePath("/struktur");
  revalidatePath("/anggota");
  revalidatePath("/admin/divisi");
  revalidatePath("/admin/anggota");

  return {
    success: id ? "Divisi berhasil diperbarui." : "Divisi berhasil ditambahkan.",
  };
}

export async function deleteDivisionAction(
  id: string
): Promise<DivisionActionState> {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return { error: "Sesi admin tidak valid." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("divisions").delete().eq("id", id);

  if (error) {
    return { error: `Gagal menghapus divisi: ${error.message}` };
  }

  updateTag("structure");
  revalidatePath("/");
  revalidatePath("/struktur");
  revalidatePath("/anggota");
  revalidatePath("/admin/divisi");
  revalidatePath("/admin/anggota");

  return { success: "Divisi berhasil dihapus." };
}
