"use server";

import { revalidatePath } from "next/cache";
import {
  createClient,
  createServiceRoleClient,
  getAuthenticatedAdmin,
} from "@/lib/supabase/server";
import { adminSchema } from "@/lib/validations/schemas";

export interface AdminUsersActionState {
  success?: string;
  error?: string;
}

export async function addAdminAction(
  _prevState: AdminUsersActionState,
  formData: FormData
): Promise<AdminUsersActionState> {
  const currentAdmin = await getAuthenticatedAdmin();
  if (!currentAdmin) {
    return { error: "Sesi admin tidak valid." };
  }

  const rawPassword = String(formData.get("password") ?? "").trim();
  const parsed = adminSchema.safeParse({
    email: formData.get("email"),
    password: rawPassword || undefined,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data admin tidak valid.",
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { error: insertError } = await supabase
    .from("admins")
    .insert({ email });

  if (insertError) {
    if (insertError.code === "23505") {
      return { error: "Email tersebut sudah terdaftar sebagai admin." };
    }
    return { error: `Gagal menambahkan admin: ${insertError.message}` };
  }

  if (password && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const serviceClient = createServiceRoleClient();
      const { error: authError } = await serviceClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (authError && !authError.message.toLowerCase().includes("already")) {
        return {
          success: `Email ${email} ditambahkan ke whitelist admin, tetapi pembuatan akun Auth gagal: ${authError.message}`,
        };
      }
    } catch {
      // Abaikan jika service role belum diset; admin tetap masuk whitelist
    }
  }

  revalidatePath("/admin/pengguna");
  return { success: `Akses admin untuk ${email} berhasil ditambahkan.` };
}

export async function removeAdminAction(
  email: string
): Promise<AdminUsersActionState> {
  const currentAdmin = await getAuthenticatedAdmin();
  if (!currentAdmin) {
    return { error: "Sesi admin tidak valid." };
  }

  if (currentAdmin.email?.toLowerCase() === email.toLowerCase()) {
    return { error: "Anda tidak dapat menghapus akses akun Anda sendiri." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("admins")
    .delete()
    .eq("email", email.toLowerCase());

  if (error) {
    return { error: `Gagal menghapus admin: ${error.message}` };
  }

  revalidatePath("/admin/pengguna");
  return { success: `Akses admin untuk ${email} berhasil dicabut.` };
}
