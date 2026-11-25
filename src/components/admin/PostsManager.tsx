"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import { Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import type { Post, PostCategory } from "@/types/database";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { StatusBanner } from "@/components/admin/StatusBanner";
import {
  deletePostAction,
  upsertPostAction,
  type PostActionState,
} from "@/app/admin/(panel)/berita/actions";

const CATEGORY_LABELS: Record<PostCategory, string> = {
  kegiatan: "Kegiatan",
  pengumuman: "Pengumuman",
  prestasi: "Prestasi",
  divisi: "Kegiatan Divisi",
};

const initialState: PostActionState = {};

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function PostsManager({ posts }: { posts: Post[] }) {
  const [editing, setEditing] = useState<Post | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [slugValue, setSlugValue] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | PostCategory>("all");

  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [deleteResult, setDeleteResult] = useState<PostActionState>({});
  const [isDeleting, startDeleteTransition] = useTransition();

  const [state, formAction, isPending] = useActionState(
    upsertPostAction,
    initialState
  );

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesQuery = !q || post.title.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || post.category === categoryFilter;
      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [posts, search, statusFilter, categoryFilter]);

  const handleEdit = (post: Post) => {
    setEditing(post);
    setSlugValue(post.slug);
    setSlugTouched(true);
    setFormKey((k) => k + 1);
  };

  const handleReset = () => {
    setEditing(null);
    setSlugValue("");
    setSlugTouched(false);
    setFormKey((k) => k + 1);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!slugTouched) {
      setSlugValue(toSlug(e.target.value));
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    startDeleteTransition(async () => {
      const res = await deletePostAction(deleteTarget.id);
      setDeleteResult(res);
      setDeleteTarget(null);
      if (editing?.id === deleteTarget.id) {
        handleReset();
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      {/* Form Buat / Edit Berita */}
      <section className="rounded-xl border border-border bg-white p-6 xl:col-span-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            {editing ? "Edit Berita" : "Tulis Berita Baru"}
          </h2>
          {editing && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Tulis Baru
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
            name="cover_file"
            label="Gambar Sampul"
            currentUrl={editing?.cover_image_url ?? null}
            aspectClass="h-28 w-44"
            hint="Disarankan foto mendatar (16:9) agar optimal di carousel dan kartu."
          />

          <div>
            <label
              htmlFor="post-title"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Judul Berita
            </label>
            <input
              id="post-title"
              name="title"
              type="text"
              required
              defaultValue={editing?.title ?? ""}
              onChange={handleTitleChange}
              placeholder="Contoh: Malam Keakraban Mahasiswa Baru KM-HSS 2026"
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="post-slug"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Slug URL
              </label>
              <input
                id="post-slug"
                name="slug"
                type="text"
                required
                value={slugValue}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlugValue(e.target.value);
                }}
                placeholder="malam-keakraban-km-hss-2026"
                className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label
                htmlFor="post-category"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Kategori
              </label>
              <select
                id="post-category"
                name="category"
                defaultValue={editing?.category ?? "kegiatan"}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={editing?.is_featured ?? false}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <Star className="h-4 w-4 text-amber-500" />
            Jadikan Sorotan (tampil di Carousel Beranda)
          </label>

          <div>
            <label
              htmlFor="post-excerpt"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Ringkasan Singkat (Opsional)
            </label>
            <textarea
              id="post-excerpt"
              name="excerpt"
              rows={2}
              maxLength={400}
              defaultValue={editing?.excerpt ?? ""}
              placeholder="Otomatis diambil dari awal isi berita jika dikosongkan..."
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="post-content"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Isi Berita
            </label>
            <textarea
              id="post-content"
              name="content"
              rows={8}
              required
              defaultValue={editing?.content ?? ""}
              placeholder="Tulis isi berita kegiatan KM-HSS di sini. Pisahkan paragraf dengan baris kosong."
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              type="submit"
              name="intent"
              value="published"
              disabled={isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {isPending ? "Menyimpan..." : "Terbitkan"}
            </button>
            <button
              type="submit"
              name="intent"
              value="draft"
              disabled={isPending}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-gray-200 disabled:opacity-60"
            >
              Simpan Draft
            </button>
            {editing && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Daftar Berita */}
      <section className="rounded-xl border border-border bg-white p-6 xl:col-span-6">
        <div className="mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Daftar Berita ({filteredPosts.length})
            </h2>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul berita..."
                className="w-full rounded-lg border border-border py-1.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "published" | "draft")
              }
              aria-label="Filter status"
              className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm outline-none focus:border-primary"
            >
              <option value="all">Semua Status</option>
              <option value="published">Terbit</option>
              <option value="draft">Draft</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as "all" | PostCategory)
              }
              aria-label="Filter kategori"
              className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm outline-none focus:border-primary"
            >
              <option value="all">Semua Kategori</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
            Belum ada berita yang sesuai.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-start justify-between gap-3 py-3.5"
              >
                <div className="flex min-w-0 items-start gap-3">
                  {post.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="h-14 w-20 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-surface text-xs font-semibold text-muted">
                      KM-HSS
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                          post.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {post.status === "published" ? "Terbit" : "Draft"}
                      </span>
                      <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted">
                        {CATEGORY_LABELS[post.category]}
                      </span>
                      {post.is_featured && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                          <Star className="h-2.5 w-2.5 fill-current" />
                          Sorotan
                        </span>
                      )}
                    </div>

                    <p className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">
                      {post.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {new Date(
                        post.published_at ?? post.created_at
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleEdit(post)}
                    aria-label={`Edit ${post.title}`}
                    className="rounded-lg border border-border p-2 text-muted transition hover:bg-surface hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(post)}
                    aria-label={`Hapus ${post.title}`}
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
        title="Hapus Berita?"
        description={`Berita "${deleteTarget?.title ?? ""}" beserta gambar sampulnya akan dihapus permanen.`}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
