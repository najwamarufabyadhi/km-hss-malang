import { connection } from "next/server";
import { DivisionsManager } from "@/components/admin/DivisionsManager";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Division } from "@/types/database";

async function getDivisions(): Promise<Division[]> {
  await connection();
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("divisions")
    .select("*")
    .order("sort_order", { ascending: true });

  return (data as Division[] | null) ?? [];
}

export default async function AdminDivisionsPage() {
  const divisions = await getDivisions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Divisi</h1>
        <p className="mt-1 text-sm text-muted">
          Atur daftar divisi organisasi dan urutan tampilnya di halaman
          struktur.
        </p>
      </div>

      <DivisionsManager divisions={divisions} />
    </div>
  );
}
