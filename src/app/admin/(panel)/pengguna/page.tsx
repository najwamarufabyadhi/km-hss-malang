import { connection } from "next/server";
import { AdminsManager } from "@/components/admin/AdminsManager";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient, getAuthenticatedAdmin } from "@/lib/supabase/server";
import type { AdminUser } from "@/types/database";

async function getAdmins(): Promise<AdminUser[]> {
  await connection();
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("admins")
    .select("*")
    .order("created_at", { ascending: true });

  return (data as AdminUser[] | null) ?? [];
}

export default async function AdminUsersPage() {
  await connection();
  const [admins, currentAdmin] = await Promise.all([
    getAdmins(),
    getAuthenticatedAdmin(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Kelola Admin</h1>
        <p className="mt-1 text-sm text-muted">
          Tambahkan atau cabut akses email pengurus yang diizinkan mengelola
          control panel.
        </p>
      </div>

      <AdminsManager
        admins={admins}
        currentUserEmail={currentAdmin?.email ?? ""}
      />
    </div>
  );
}
