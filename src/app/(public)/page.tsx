import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryBar } from "@/components/public/CategoryBar";
import { HeroCarousel } from "@/components/public/HeroCarousel";
import { MemberCard } from "@/components/public/MemberCard";
import { NewsCard } from "@/components/public/NewsCard";
import {
  getDivisionsAndMembers,
  getFeaturedPosts,
  getPublicProfile,
  getPublishedPosts,
} from "@/lib/public-data";

export default async function HomePage() {
  const [profile, featuredPosts, latestRes, structure] = await Promise.all([
    getPublicProfile(),
    getFeaturedPosts(),
    getPublishedPosts({ page: 1, limit: 6 }),
    getDivisionsAndMembers(),
  ]);

  const activePeriod =
    structure.periods.find((p) => p.is_active) ?? structure.periods[0];
  const coreMembers = structure.members
    .filter(
      (m) =>
        m.is_core &&
        (!activePeriod || !m.period_id || m.period_id === activePeriod.id)
    )
    .slice(0, 4);

  return (
    <>
      <CategoryBar activeCategory="all" />

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-6 sm:px-6 sm:py-8">
        {/* Hero Carousel & Berita Terbaru Samping */}
        <HeroCarousel
          featuredPosts={featuredPosts}
          latestPosts={latestRes.posts}
        />

        {/* Grid Berita Terbaru */}
        <section aria-labelledby="heading-berita-terbaru" className="space-y-5">
          <div className="flex items-center justify-between">
            <h2
              id="heading-berita-terbaru"
              className="border-l-4 border-accent pl-3 text-xl font-extrabold text-foreground sm:text-2xl"
            >
              Berita Terbaru
            </h2>
            <Link
              href="/berita"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Lihat Semua Berita
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {latestRes.posts.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
              Belum ada berita yang diterbitkan.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestRes.posts.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* Profil Singkat Organisasi */}
        <section
          aria-labelledby="heading-profil-singkat"
          className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2
                id="heading-profil-singkat"
                className="border-l-4 border-primary pl-3 text-xl font-extrabold text-foreground sm:text-2xl"
              >
                Tentang KM-HSS Malang
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
                {profile.description}
              </p>
            </div>
            <Link
              href="/tentang"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Selengkapnya
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
                Visi
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {profile.vision || "Belum diisi."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
                Tujuan
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {profile.goals || "Belum diisi."}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
                Fokus Utama
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {profile.main_focus || "Belum diisi."}
              </p>
            </div>
          </div>
        </section>

        {/* Struktur Singkat (Pengurus Inti) */}
        <section aria-labelledby="heading-struktur-singkat" className="space-y-5">
          <div className="flex items-center justify-between">
            <h2
              id="heading-struktur-singkat"
              className="border-l-4 border-primary pl-3 text-xl font-extrabold text-foreground sm:text-2xl"
            >
              Pengurus Inti
            </h2>
            <Link
              href="/struktur"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Lihat Struktur Lengkap
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {coreMembers.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
              Data pengurus inti belum tersedia.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {coreMembers.map((member) => (
                <MemberCard key={member.id} member={member} large />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
