import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { NewsCard } from "@/components/public/NewsCard";
import { ShareButtons } from "@/components/public/ShareButtons";
import { CATEGORY_LABELS, formatIndonesianDate } from "@/lib/format";
import { getPostBySlug, getRelatedPosts } from "@/lib/public-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "Berita Tidak Ditemukan" };
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: "article",
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

async function NewsDetailContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string }>;
}) {
  const { slug } = await paramsPromise;
  const [post, related] = await Promise.all([
    getPostBySlug(slug),
    getRelatedPosts(slug, 3),
  ]);

  if (!post) {
    notFound();
  }

  const paragraphs = post.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main className="mx-auto max-w-4xl space-y-10 px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/berita"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Berita
      </Link>

      <article className="space-y-6">
        <header className="space-y-3">
          <span className="inline-block rounded bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
            {CATEGORY_LABELS[post.category]}
          </span>
          <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>
              {formatIndonesianDate(post.published_at ?? post.created_at)}
            </span>
            {post.author_email && (
              <>
                <span>·</span>
                <span>Tim Redaksi KM-HSS</span>
              </>
            )}
          </div>
        </header>

        {post.cover_image_url && (
          <div className="flex justify-center overflow-hidden rounded-2xl border border-border bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="max-h-[560px] w-full object-contain"
            />
          </div>
        )}

        <div className="mx-auto max-w-[68ch] space-y-4 text-base leading-relaxed text-foreground sm:text-lg">
          {paragraphs.map((para, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {para}
            </p>
          ))}
        </div>

        <div className="border-t border-border pt-6">
          <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted">
            Bagikan Berita
          </p>
          <ShareButtons title={post.title} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="space-y-4 border-t border-border pt-8">
          <h2 className="border-l-4 border-accent pl-3 text-xl font-extrabold text-foreground">
            Berita Lainnya
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <NewsCard key={item.id} post={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-12 text-sm text-muted">
          Memuat berita...
        </div>
      }
    >
      <NewsDetailContent paramsPromise={params} />
    </Suspense>
  );
}
