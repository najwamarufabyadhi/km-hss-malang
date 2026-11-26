"use client";

import { useActionState, useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Period } from "@/types/database";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { StatusBanner } from "@/components/admin/StatusBanner";
import {
  deletePeriodAction,
  upsertPeriodAction,
  type PeriodActionState,
} from "@/app/admin/(panel)/periode/actions";

const initialState: PeriodActionState = {};

export function PeriodsManager({ periods }: { periods: Period[] }) {
  const [editing, setEditing] = useState<Period | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Period | null>(null);
  const [deleteResult, setDeleteResult] = useState<PeriodActionState>({});
  const [isDeleting, startDeleteTransition] = useTransition();

  const [state, formAction, isPending] = useActionState(
    upsertPeriodAction,
    initialState
  );

  const handleEdit = (period: Period) => {
    setEditing(period);
    setFormKey((k) => k + 1);
  };

  const handleReset = () => {
    setEditing(null);
    setFormKey((k) => k + 1);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    startDeleteTransition(async () => {
      const res = await deletePeriodAction(deleteTarget.id);
      setDeleteResult(res);
      setDeleteTarget(null);
      if (editing?.id === deleteTarget.id) {
        handleReset();
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <section className="rounded-xl border border-border bg-white p-6 lg:col-span-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            {editing ? "Edit Periode" : "Tambah Periode"}
          </h2>
          {editing && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Buat Baru
            </button>
          )}
        </div>

        <form key={formKey} action={formAction} className="space-y-4">
          <StatusBanner
            success={state.success ?? deleteResult.success}
            error={state.error ?? deleteResult.error}
          />

          <input type="hidden" name="id" value={editing?.id ?? ""} />

          <div>
            <label
              htmlFor="period-name"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Nama Periode
            </label>
            <input
              id="period-name"
              name="name"
              type="text"
              required
              defaultValue={editing?.name ?? ""}
              placeholder="Contoh: 2026/2027"
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={editing?.is_active ?? false}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            Jadikan Periode Aktif Saat Ini
          </label>

          <div>
            <label
              htmlFor="period-order"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Urutan Tampil
            </label>
            <input
              id="period-order"
              name="sort_order"
              type="number"
              min={0}
              defaultValue={editing?.sort_order ?? periods.length + 1}
              className="w-32 rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {isPending
                ? "Menyimpan..."
                : editing
                  ? "Simpan Perubahan"
                  : "Tambah Periode"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-border bg-white p-6 lg:col-span-7">
        <h2 className="mb-4 text-base font-semibold text-foreground">
          Daftar Periode ({periods.length})
        </h2>

        {periods.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
            Belum ada periode kepengurusan.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {periods.map((period) => (
              <div
                key={period.id}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-surface px-1.5 text-xs font-semibold text-muted">
                    #{period.sort_order}
                  </span>
                  <p className="font-semibold text-foreground">{period.name}</p>
                  {period.is_active && (
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      AKTIF
                    </span>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleEdit(period)}
                    aria-label={`Edit ${period.name}`}
                    className="rounded-lg border border-border p-2 text-muted transition hover:bg-surface hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(period)}
                    aria-label={`Hapus ${period.name}`}
                    className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Periode?"
        description={`Periode "${deleteTarget?.name ?? ""}" akan dihapus. Anggota pada periode ini tetap tersimpan tanpa label periode.`}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
