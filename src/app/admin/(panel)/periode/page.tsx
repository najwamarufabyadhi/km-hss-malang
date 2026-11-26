import { connection } from "next/server";
import { PeriodsManager } from "@/components/admin/PeriodsManager";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Period } from "@/types/database";

async function getPeriods(): Promise<Period[]> {
  await connection();
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("periods")
    .select("*")
    .order("sort_order", { ascending: true });

  return (data as Period[] | null) ?? [];
}

export default async function AdminPeriodsPage() {
  const periods = await getPeriods();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Periode Kepengurusan
        </h1>
        <p className="mt-1 text-sm text-muted">
          Kelola riwayat periode kepengurusan KM-HSS dan tentukan periode yang
          sedang aktif.
        </p>
      </div>

      <PeriodsManager periods={periods} />
    </div>
  );
}
