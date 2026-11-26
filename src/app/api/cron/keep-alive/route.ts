import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "Supabase not configured",
    });
  }

  const { error } = await supabase
    .from("organization_profile")
    .select("id")
    .limit(1);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
  });
}
