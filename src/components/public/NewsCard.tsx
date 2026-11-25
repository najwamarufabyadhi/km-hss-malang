import Link from "next/link";
import type { Post } from "@/types/database";
import { CATEGORY_LABELS, formatIndonesianDate } from "@/lib/format";

export function NewsCard({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white transition hover:border-primary/40 hover:shadow-sm">
      <Link
        href={`/berita/${post.slug}`}
        className="relative aspect-video w-full overflow-hidden bg-surface"
      >
        {post.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="h-full w-full object-cover object-[50%_30%] transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/90 to-primary text-lg font-extrabold tracking-widest text-white/30">
            KM-HSS
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
          {CATEGORY_LABELS[post.category]}
        </span>

        <h3 className="mt-1.5 line-clamp-2 text-base font-bold leading-snug text-foreground group-hover:text-primary">
          <Link href={`/berita/${post.slug}`}>{post.title}</Link>
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
        )}

        <p className="mt-auto pt-3 text-xs text-muted">
          {formatIndonesianDate(post.published_at ?? post.created_at)}
        </p>
      </div>
    </article>
  );
}
