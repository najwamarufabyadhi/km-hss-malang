import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";

export const instant = false;

export const metadata: Metadata = {
  title: "Control Panel Admin",
  robots: { index: false, follow: false },
};

async function AuthenticatedAdminWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminShell userEmail={admin.email ?? ""}>{children}</AdminShell>;
}

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-muted">
          Memuat control panel...
        </div>
      }
    >
      <AuthenticatedAdminWrapper>{children}</AuthenticatedAdminWrapper>
    </Suspense>
  );
}
