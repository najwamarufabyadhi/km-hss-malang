"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import type { Division, Member } from "@/types/database";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { StatusBanner } from "@/components/admin/StatusBanner";
import {
  deleteMemberAction,
  upsertMemberAction,
  type MemberActionState,
} from "@/app/admin/(panel)/anggota/actions";

const initialState: MemberActionState = {};

export function MembersManager({
  members,
  divisions,
}: {
  members: Member[];
  divisions: Division[];
}) {
  const [editing, setEditing] = useState<Member | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [search, setSearch] = useState("");
  const [filterDivision, setFilterDivision] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [deleteResult, setDeleteResult] = useState<MemberActionState>({});
  const [isDeleting, startDeleteTransition] = useTransition();

  const [state, formAction, isPending] = useActionState(
    upsertMemberAction,
    initialState
  );

  const divisionMap = useMemo(() => {
    const map = new Map<string, string>();
    divisions.forEach((d) => map.set(d.id, d.name));
    return map;
  }, [divisions]);

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      const matchesQuery =
        !q ||
        m.full_name.toLowerCase().includes(q) ||
        m.position.toLowerCase().includes(q);
      const matchesDivision =
        filterDivision === "all" ||
        (filterDivision === "core" && m.is_core) ||
        m.division_id === filterDivision;
      return matchesQuery && matchesDivision;
    });
  }, [members, search, filterDivision]);

  const handleEdit = (member: Member) => {
    setEditing(member);
    setFormKey((k) => k + 1);
  };

  const handleReset = () => {
    setEditing(null);
    setFormKey((k) => k + 1);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    startDeleteTransition(async () => {
      const res = await deleteMemberAction(deleteTarget.id);
      setDeleteResult(res);
      setDeleteTarget(null);
      if (editing?.id === deleteTarget.id) {
        handleReset();
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      {/* Form Tambah / Edit */}
      <section className="rounded-xl border border-border bg-white p-6 xl:col-span-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            {editing ? "Edit Anggota" : "Tambah Anggota"}
          </h2>
          {editing && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Baru
            </button>
          )}
        </div>

        <form key={formKey} action={formAction} className="space-y-4">
          <StatusBanner
            success={state.success ?? deleteResult.success}
            error={state.error ?? deleteResult.error}
          />

          <input type="hidden" name="id" value={editing?.id ?? ""} />

          <ImageUploadField
            name="photo_file"
            label="Foto Anggota"
            currentUrl={editing?.photo_url ?? null}
            aspectClass="h-24 w-24"
          />

          <div>
            <label
              htmlFor="mem-name"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Nama Lengkap
            </label>
            <input
              id="mem-name"
              name="full_name"
              type="text"
              required
              defaultValue={editing?.full_name ?? ""}
              placeholder="Nama lengkap anggota"
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="mem-position"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Jabatan
              </label>
              <input
                id="mem-position"
                name="position"
                type="text"
                required
                defaultValue={editing?.position ?? ""}
                placeholder="Ketua Umum / Staff"
                className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label
                htmlFor="mem-division"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Divisi
              </label>
              <select
                id="mem-division"
                name="division_id"
                defaultValue={editing?.division_id ?? ""}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Tanpa Divisi (Inti)</option>
                {divisions.map((div) => (
                  <option key={div.id} value={div.id}>
                    {div.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 pt-1">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="is_core"
                defaultChecked={editing?.is_core ?? false}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              Pengurus Inti
            </label>

            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={editing?.is_active ?? true}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              Aktif (Tampil Publik)
            </label>
          </div>

          <div>
            <label
              htmlFor="mem-bio"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Bio Singkat
            </label>
            <textarea
              id="mem-bio"
              name="bio"
              rows={3}
              defaultValue={editing?.bio ?? ""}
              placeholder="Asal kampus, jurusan, atau deskripsi singkat..."
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="mem-ig"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Instagram (Opsional)
              </label>
              <input
                id="mem-ig"
                name="social_instagram"
                type="url"
                placeholder="https://instagram.com/..."
                defaultValue={editing?.social_links?.instagram ?? ""}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label
                htmlFor="mem-li"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                LinkedIn (Opsional)
              </label>
              <input
                id="mem-li"
                name="social_linkedin"
                type="url"
                placeholder="https://linkedin.com/in/..."
                defaultValue={editing?.social_links?.linkedin ?? ""}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="mem-order"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Urutan Tampil
            </label>
            <input
              id="mem-order"
              name="sort_order"
              type="number"
              min={0}
              defaultValue={editing?.sort_order ?? members.length + 1}
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
                  : "Tambah Anggota"}
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

      {/* Daftar Anggota */}
      <section className="rounded-xl border border-border bg-white p-6 xl:col-span-7">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Daftar Anggota ({filteredMembers.length})
          </h2>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau jabatan..."
                className="w-full rounded-lg border border-border py-1.5 pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-48"
              />
            </div>

            <select
              value={filterDivision}
              onChange={(e) => setFilterDivision(e.target.value)}
              aria-label="Filter divisi"
              className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm outline-none focus:border-primary"
            >
              <option value="all">Semua Divisi</option>
              <option value="core">Pengurus Inti</option>
              {divisions.map((div) => (
                <option key={div.id} value={div.id}>
                  {div.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredMembers.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
            Tidak ada anggota yang sesuai.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {filteredMembers.map((member) => {
              const initials = member.full_name
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase();
              const divisionName = member.division_id
                ? divisionMap.get(member.division_id)
                : null;

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 py-3.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {member.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.photo_url}
                        alt={member.full_name}
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-primary">
                        {initials || "KM"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {member.full_name}
                        </p>
                        {member.is_core && (
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                            INTI
                          </span>
                        )}
                        {!member.is_active && (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-muted">
                            NONAKTIF
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted">
                        {member.position}
                        {divisionName ? ` · ${divisionName}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEdit(member)}
                      aria-label={`Edit ${member.full_name}`}
                      className="rounded-lg border border-border p-2 text-muted transition hover:bg-surface hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(member)}
                      aria-label={`Hapus ${member.full_name}`}
                      className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Anggota?"
        description={`Data "${deleteTarget?.full_name ?? ""}" beserta fotonya akan dihapus permanen.`}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
