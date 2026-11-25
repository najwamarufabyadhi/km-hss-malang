"use client";

import { useActionState, useState, useTransition } from "react";
import { ShieldCheck, Trash2, UserPlus } from "lucide-react";
import type { AdminUser } from "@/types/database";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { StatusBanner } from "@/components/admin/StatusBanner";
import {
  addAdminAction,
  removeAdminAction,
  type AdminUsersActionState,
} from "@/app/admin/(panel)/pengguna/actions";

const initialState: AdminUsersActionState = {};

export function AdminsManager({
  admins,
  currentUserEmail,
}: {
  admins: AdminUser[];
  currentUserEmail: string;
}) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteResult, setDeleteResult] = useState<AdminUsersActionState>({});
  const [isDeleting, startDeleteTransition] = useTransition();

  const [state, formAction, isPending] = useActionState(
    addAdminAction,
    initialState
  );

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    startDeleteTransition(async () => {
      const res = await removeAdminAction(deleteTarget);
      setDeleteResult(res);
      setDeleteTarget(null);
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <section className="rounded-xl border border-border bg-white p-6 lg:col-span-5">
        <div className="mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            Tambah Admin Baru
          </h2>
        </div>

        <form action={formAction} className="space-y-4">
          <StatusBanner
            success={state.success ?? deleteResult.success}
            error={state.error ?? deleteResult.error}
          />

          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Email Pengurus
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              required
              placeholder="pengurus@kmhss.org"
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Password Awal (Opsional)
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              minLength={8}
              placeholder="Minimal 8 karakter"
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-xs text-muted">
              Jika diisi (dan <code>SUPABASE_SERVICE_ROLE_KEY</code> aktif),
              akun login otomatis dibuat di Supabase Auth.
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
          >
            {isPending ? "Menambahkan..." : "Tambah Admin"}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-border bg-white p-6 lg:col-span-7">
        <h2 className="mb-4 text-base font-semibold text-foreground">
          Daftar Email Admin ({admins.length})
        </h2>

        {admins.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
            Belum ada data admin yang dimuat.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {admins.map((admin) => {
              const isSelf =
                admin.email.toLowerCase() === currentUserEmail.toLowerCase();

              return (
                <div
                  key={admin.email}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-primary">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-foreground">
                          {admin.email}
                        </p>
                        {isSelf && (
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                            ANDA
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted">
                        Terdaftar{" "}
                        {new Date(admin.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isSelf}
                    onClick={() => setDeleteTarget(admin.email)}
                    aria-label={`Cabut akses ${admin.email}`}
                    title={
                      isSelf
                        ? "Tidak dapat menghapus akun sendiri"
                        : "Cabut akses admin"
                    }
                    className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Cabut Akses Admin?"
        description={`Email "${deleteTarget ?? ""}" tidak akan bisa lagi mengakses control panel /admin.`}
        confirmLabel="Ya, Cabut Akses"
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
