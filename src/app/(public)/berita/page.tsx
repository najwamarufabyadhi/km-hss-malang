import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { CategoryBar } from "@/components/public/CategoryBar";
import { NewsCard } from "@/components/public/NewsCard";
import { CATEGORY_LABELS } from "@/lib/format";
import { getPublishedPosts } from "@/lib/public-data";
import type { PostCategory } from "@/types/database";

export const metadata: Metadata = {
  title: "Berita & Kegiatan",
  description:
    "Kumpulan berita kegiatan, pengumuman, dan prestasi Kerukunan Mahasiswa Hulu Sungai Selatan wilayah Malang (KM-HSS).",
};

const PAGE_SIZE = 9;

async function NewsListContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{
    category?: string;
    q?: string;
    page?: string;
  }>;
}) {
  const params = await searchParamsPromise;
  const category = params.category ?? "all";
  const query = params.q?.trim() ?? "";
  const page = Math.max(1, Number(params.page ?? 1) || 1);

  const { posts, total } = await getPublishedPosts({
    category,
    query,
    page,
    limit: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const categoryTitle =
    category !== "all" && category in CATEGORY_LABELS
      ? CATEGORY_LABELS[category as PostCategory]
      : "Semua Berita";

  const buildPageUrl = (targetPage: number) => {
    const sp = new URLSearchParams();
    if (category !== "all") sp.set("category", category);
    if (query) sp.set("q", query);
    if (targetPage > 1) sp.set("page", String(targetPage));
    const qs = sp.toString();
    return qs ? `/berita?${qs}` : "/berita";
  };

  return (
    <>
      <CategoryBar activeCategory={category} />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h1 className="border-l-4 border-accent pl-3 text-2xl font-extrabold text-foreground sm:text-3xl">
              {categoryTitle}
            </h1>
            {query && (
              <p className="mt-2 text-sm text-muted">
                Menampilkan hasil pencarian untuk{" "}
                <span className="font-semibold text-foreground">
                  &ldquo;{query}&rdquo;
                </span>{" "}
                ({total} berita)
              </p>
            )}
          </div>

          {query && (
            <Link
              href={category !== "all" ? `/berita?category=${category}` : "/berita"}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Reset pencarian
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface p-12 text-center">
            <p className="text-base font-semibold text-foreground">
              Tidak ditemukan berita yang sesuai
            </p>
            <p className="mt-1 text-sm text-muted">
              Coba kata kunci lain atau pilih kategori &ldquo;Semua&rdquo;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Navigasi halaman berita"
            className="flex items-center justify-center gap-2 pt-4"
          >
            {page > 1 && (
              <Link
                href={buildPageUrl(page - 1)}
                className="rounded-lg border border-border px-3.5 py-2 text-sm font-medium hover:bg-surface"
              >
                Sebelumnya
              </Link>
            )}
            <span className="px-3 text-sm text-muted">
              Halaman {page} dari {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={buildPageUrl(page + 1)}
                className="rounded-lg border border-border px-3.5 py-2 text-sm font-medium hover:bg-surface"
              >
                Berikutnya
              </Link>
            )}
          </nav>
        )}
      </main>
    </>
  );
}

export default function NewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-muted">
          Memuat daftar berita...
        </div>
      }
    >
      <NewsListContent searchParamsPromise={searchParams} />
    </Suspense>
  );
}
