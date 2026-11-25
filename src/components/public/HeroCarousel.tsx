"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { Post } from "@/types/database";
import { CATEGORY_LABELS, formatIndonesianDate } from "@/lib/format";

export function HeroCarousel({
  featuredPosts,
  latestPosts,
}: {
  featuredPosts: Post[];
  latestPosts: Post[];
}) {
  const slides = featuredPosts.slice(0, 5);
  const sideList = latestPosts.slice(0, 4);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = slides.length;

  useEffect(() => {
    if (total <= 1 || isPaused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setActiveIndex((prev) => (prev + 1) % total);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [total, isPaused]);

  if (total === 0) {
    return (
      <section className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
        <p className="text-base font-semibold text-foreground">
          Belum ada kegiatan yang diterbitkan
        </p>
        <p className="mt-1 text-sm text-muted">
          Berita terbaru KM-HSS Malang akan tampil di sini.
        </p>
      </section>
    );
  }

  const current = slides[activeIndex] ?? slides[0];

  const goPrev = () => setActiveIndex((prev) => (prev - 1 + total) % total);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % total);

  return (
    <section
      aria-label="Berita Utama dan Terbaru"
      className="grid grid-cols-1 gap-6 lg:grid-cols-12"
    >
      {/* Hero Carousel (8 kolom) */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Sorotan Kegiatan KM-HSS"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
        className="relative overflow-hidden rounded-xl border border-border bg-primary lg:col-span-8"
      >
        <Link
          href={`/berita/${current.slug}`}
          className="group relative block aspect-video w-full overflow-hidden lg:h-[420px] lg:aspect-auto"
        >
          {current.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.cover_image_url}
              alt={current.title}
              className="h-full w-full object-cover object-[50%_30%] transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary via-[#164ea8] to-[#082c6c]">
              <span className="text-4xl font-extrabold tracking-widest text-white/15 sm:text-6xl">
                KM-HSS
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-5 pb-14 text-white sm:p-7 sm:pb-16">
            <span className="inline-block rounded bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              {CATEGORY_LABELS[current.category]}
            </span>
            <h1 className="mt-2.5 line-clamp-2 text-xl font-extrabold leading-snug sm:line-clamp-3 sm:text-3xl">
              {current.title}
            </h1>
            <div className="mt-2.5 flex items-center gap-4 text-xs text-white/85 sm:text-sm">
              <span>
                {formatIndonesianDate(current.published_at ?? current.created_at)}
              </span>
              <span className="font-semibold underline underline-offset-4">
                Baca Selengkapnya →
              </span>
            </div>
          </div>
        </Link>

        {/* Controls */}
        {total > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-5 sm:px-7">
            <div className="flex items-center gap-1.5">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Tampilkan berita ${idx + 1}`}
                  aria-current={idx === activeIndex ? "true" : undefined}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeIndex
                      ? "w-6 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? "Putar otomatis" : "Jeda otomatis"}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/75"
              >
                {isPaused ? (
                  <Play className="h-3.5 w-3.5" />
                ) : (
                  <Pause className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Berita sebelumnya"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/75"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Berita berikutnya"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/75"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Daftar Berita Terbaru Samping (4 kolom) */}
      <aside className="flex flex-col rounded-xl border border-border bg-white p-4 lg:col-span-4">
        <div className="mb-3 flex items-center justify-between border-b border-border pb-2.5">
          <h2 className="border-l-4 border-accent pl-2.5 text-sm font-extrabold uppercase tracking-wide text-foreground">
            Berita Terbaru
          </h2>
          <Link
            href="/berita"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Semua →
          </Link>
        </div>

        <div className="flex flex-1 flex-col divide-y divide-border">
          {sideList.map((item) => {
            const slideIdx = slides.findIndex((s) => s.id === item.id);
            const isCurrentSlide = slideIdx !== -1 && slideIdx === activeIndex;

            return (
              <div
                key={item.id}
                className={`flex items-start gap-3 py-3 first:pt-1 last:pb-1 ${
                  isCurrentSlide ? "rounded-lg bg-surface px-2 -mx-2" : ""
                }`}
              >
                <Link
                  href={`/berita/${item.slug}`}
                  className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-surface"
                >
                  {item.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-[10px] font-bold text-primary">
                      KM-HSS
                    </div>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                    {CATEGORY_LABELS[item.category]}
                  </span>
                  <Link
                    href={`/berita/${item.slug}`}
                    className="mt-0.5 line-clamp-2 block text-sm font-semibold leading-snug text-foreground hover:text-primary"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-1 text-[11px] text-muted">
                    {formatIndonesianDate(item.published_at ?? item.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </section>
  );
}
