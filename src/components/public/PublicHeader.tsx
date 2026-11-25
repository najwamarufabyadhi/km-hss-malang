"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Lock, Menu, Search, X } from "lucide-react";
import type { OrganizationProfile } from "@/types/database";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang" },
  { href: "/berita", label: "Berita" },
  { href: "/struktur", label: "Struktur" },
  { href: "/anggota", label: "Anggota" },
];

export function PublicHeader({ profile }: { profile: OrganizationProfile }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    setMobileOpen(false);
    router.push(trimmed ? `/berita?q=${encodeURIComponent(trimmed)}` : "/berita");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 min-w-0">
          {profile.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.logo_url}
              alt="Logo KM-HSS"
              className="h-10 w-10 shrink-0 rounded-lg object-contain"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-extrabold tracking-tight text-white">
              KM
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-primary sm:text-base">
              KM-HSS Malang
            </p>
            <p className="hidden truncate text-[11px] text-muted sm:block">
              Kerukunan Mahasiswa Hulu Sungai Selatan
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Navigasi Utama" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-surface hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Search & Admin */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative hidden lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari berita..."
              aria-label="Cari berita"
              className="w-48 rounded-lg border border-border bg-surface py-1.5 pl-9 pr-3 text-sm outline-none transition focus:w-56 focus:border-primary focus:bg-white"
            />
          </form>

          <Link
            href="/admin/login"
            title="Login Admin"
            aria-label="Login Admin"
            className="rounded-lg border border-border p-2 text-muted transition hover:bg-surface hover:text-primary"
          >
            <Lock className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            className="rounded-lg border border-border p-2 text-foreground hover:bg-surface md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-white px-4 py-4 md:hidden">
          <form onSubmit={handleSearch} className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari berita..."
              className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:bg-white"
            />
          </form>
          <nav aria-label="Menu Mobile" className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    active
                      ? "bg-primary text-white"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
