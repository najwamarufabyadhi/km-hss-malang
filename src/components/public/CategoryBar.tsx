import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/format";
import type { PostCategory } from "@/types/database";

const CATEGORIES: { key: "all" | PostCategory; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "kegiatan", label: CATEGORY_LABELS.kegiatan },
  { key: "pengumuman", label: CATEGORY_LABELS.pengumuman },
  { key: "prestasi", label: CATEGORY_LABELS.prestasi },
  { key: "divisi", label: CATEGORY_LABELS.divisi },
];

export function CategoryBar({
  activeCategory = "all",
}: {
  activeCategory?: string;
}) {
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.key;
          const href =
            cat.key === "all" ? "/berita" : `/berita?category=${cat.key}`;
          return (
            <Link
              key={cat.key}
              href={href}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-white text-foreground ring-1 ring-border hover:text-primary"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
