"use client";

import { useActionState, useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Division } from "@/types/database";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { StatusBanner } from "@/components/admin/StatusBanner";
import {
  deleteDivisionAction,
  upsertDivisionAction,
  type DivisionActionState,
} from "@/app/admin/(panel)/divisi/actions";

const initialState: DivisionActionState = {};

export function DivisionsManager({ divisions }: { divisions: Division[] }) {
  const [editing, setEditing] = useState<Division | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Division | null>(null);
  const [deleteResult, setDeleteResult] = useState<DivisionActionState>({});
  const [isDeleting, startDeleteTransition] = useTransition();

  const [state, formAction, isPending] = useActionState(
    upsertDivisionAction,
    initialState
  );

  const handleEdit = (division: Division) => {
    setEditing(division);
    setFormKey((k) => k + 1);
  };

  const handleReset = () => {
    setEditing(null);
    setFormKey((k) => k + 1);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    startDeleteTransition(async () => {
      const res = await deleteDivisionAction(deleteTarget.id);
      setDeleteResult(res);
      setDeleteTarget(null);
      if (editing?.id === deleteTarget.id) {
        handleReset();
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Form Tambah/Edit */}
      <section className="rounded-xl border border-border bg-white p-6 lg:col-span-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            {editing ? "Edit Divisi" : "Tambah Divisi"}
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
              htmlFor="div-name"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Nama Divisi
            </label>
            <input
              id="div-name"
              name="name"
              type="text"
              required
              defaultValue={editing?.name ?? ""}
              placeholder="Contoh: Divisi Humas & Media"
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="div-desc"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Deskripsi
            </label>
            <textarea
              id="div-desc"
              name="description"
              rows={3}
              defaultValue={editing?.description ?? ""}
              placeholder="Tugas dan fokus divisi..."
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="div-order"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Urutan Tampil
            </label>
            <input
              id="div-order"
              name="sort_order"
              type="number"
              min={0}
              defaultValue={editing?.sort_order ?? divisions.length + 1}
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
                  : "Tambah Divisi"}
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

      {/* Daftar Divisi */}
      <section className="rounded-xl border border-border bg-white p-6 lg:col-span-7">
        <h2 className="mb-4 text-base font-semibold text-foreground">
          Daftar Divisi ({divisions.length})
        </h2>

        {divisions.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
            Belum ada divisi. Tambahkan divisi pertama melalui formulir di
            samping.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {divisions.map((div) => (
              <div
                key={div.id}
                className="flex items-start justify-between gap-4 py-3.5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-surface px-1.5 text-xs font-semibold text-muted">
                      #{div.sort_order}
                    </span>
                    <p className="font-semibold text-foreground">{div.name}</p>
                  </div>
                  {div.description && (
                    <p className="mt-1 text-xs text-muted">{div.description}</p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleEdit(div)}
                    aria-label={`Edit ${div.name}`}
                    className="rounded-lg border border-border p-2 text-muted transition hover:bg-surface hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(div)}
                    aria-label={`Hapus ${div.name}`}
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
        title="Hapus Divisi?"
        description={`Divisi "${deleteTarget?.name ?? ""}" akan dihapus. Anggota di divisi ini tetap tersimpan tanpa divisi.`}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
