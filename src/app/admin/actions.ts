"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { loginSchema } from "@/lib/validations/schemas";

export interface AuthActionState {
  error?: string;
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Konfigurasi Supabase belum diisi. Lengkapi .env.local terlebih dahulu.",
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Input tidak valid.",
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  const isDev = process.env.NODE_ENV !== "production";
  const neutralError =
    "Email atau password salah, atau akun belum terdaftar sebagai admin.";

  if (error || !data.user?.email || !data.session?.access_token) {
    console.error("[signInAction] Auth error:", error?.message);
    if (isDev && error?.message.toLowerCase().includes("email not confirmed")) {
      return {
        error:
          "Email belum dikonfirmasi di Supabase Auth. Centang Auto Confirm User pada user tersebut.",
      };
    }
    return {
      error: isDev
        ? `Login gagal: ${error?.message ?? "Email atau password salah."}`
        : neutralError,
    };
  }

  const authedClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const { data: adminRow, error: adminError } = await authedClient
    .from("admins")
    .select("email")
    .eq("email", data.user.email.toLowerCase())
    .maybeSingle();

  if (adminError) {
    console.error("[signInAction] Admin check error:", adminError.message);
    await supabase.auth.signOut();
    return {
      error: isDev
        ? `Gagal memeriksa akses admin: ${adminError.message}`
        : neutralError,
    };
  }

  if (!adminRow) {
    await supabase.auth.signOut();
    return {
      error: isDev
        ? `Email ${data.user.email} belum terdaftar di tabel public.admins.`
        : neutralError,
    };
  }

  redirect("/admin");
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
