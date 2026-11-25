import { connection } from "next/server";
import { MembersManager } from "@/components/admin/MembersManager";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Division, Member } from "@/types/database";

async function getMembersAndDivisions(): Promise<{
  members: Member[];
  divisions: Division[];
}> {
  await connection();
  if (!isSupabaseConfigured()) {
    return { members: [], divisions: [] };
  }

  const supabase = await createClient();
  const [membersRes, divisionsRes] = await Promise.all([
    supabase
      .from("members")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("full_name", { ascending: true }),
    supabase
      .from("divisions")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  return {
    members: (membersRes.data as Member[] | null) ?? [],
    divisions: (divisionsRes.data as Division[] | null) ?? [],
  };
}

export default async function AdminMembersPage() {
  const { members, divisions } = await getMembersAndDivisions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Anggota</h1>
        <p className="mt-1 text-sm text-muted">
          Kelola data pengurus inti dan anggota divisi beserta foto dan
          biodatanya.
        </p>
      </div>

      <MembersManager members={members} divisions={divisions} />
    </div>
  );
}
