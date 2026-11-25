import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Login Admin",
  robots: { index: false, follow: false },
};

async function LoginContent() {
  await connection();
  const admin = await getAuthenticatedAdmin();
  if (admin) {
    redirect("/admin");
  }

  return <LoginForm supabaseConfigured={isSupabaseConfigured()} />;
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <Suspense
        fallback={
          <div className="h-96 w-full max-w-md animate-pulse rounded-xl border border-border bg-white p-8" />
        }
      >
        <LoginContent />
      </Suspense>
    </main>
  );
}
