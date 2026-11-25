import Link from "next/link";
import { connection } from "next/server";
import { FileEdit, Layers, Newspaper, Plus, Users } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

async function getDashboardStats() {
  await connection();
  if (!isSupabaseConfigured()) {
    return {
      publishedPosts: 0,
      draftPosts: 0,
      activeMembers: 0,
      divisions: 0,
    };
  }

  const supabase = await createClient();

  const [publishedRes, draftRes, membersRes, divisionsRes] = await Promise.all([
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase
      .from("members")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("divisions").select("id", { count: "exact", head: true }),
  ]);

  return {
    publishedPosts: publishedRes.count ?? 0,
    draftPosts: draftRes.count ?? 0,
    activeMembers: membersRes.count ?? 0,
    divisions: divisionsRes.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    {
      label: "Berita Terbit",
      value: stats.publishedPosts,
      icon: Newspaper,
      href: "/admin/berita",
    },
    {
      label: "Draft Berita",
      value: stats.draftPosts,
      icon: FileEdit,
      href: "/admin/berita",
    },
    {
      label: "Anggota Aktif",
      value: stats.activeMembers,
      icon: Users,
      href: "/admin/anggota",
    },
    {
      label: "Divisi",
      value: stats.divisions,
      icon: Layers,
      href: "/admin/divisi",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            Ringkasan konten Kerukunan Mahasiswa Hulu Sungai Selatan wilayah
            Malang (KM-HSS).
          </p>
        </div>

        <Link
          href="/admin/berita"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Tulis Berita
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-xl border border-border bg-white p-5 transition hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted">
                  {card.label}
                </span>
                <div className="rounded-lg bg-surface p-2 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-foreground">
                {card.value}
              </p>
            </Link>
          );
        })}
      </div>

      <section className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-foreground">
          Pintasan Pengelolaan
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/profil"
            className="rounded-lg border border-border p-4 transition hover:bg-surface"
          >
            <p className="text-sm font-semibold text-foreground">
              Profil Organisasi
            </p>
            <p className="mt-1 text-xs text-muted">
              Perbarui visi, misi, logo, sosmed, dan banner pengumuman.
            </p>
          </Link>
          <Link
            href="/admin/anggota"
            className="rounded-lg border border-border p-4 transition hover:bg-surface"
          >
            <p className="text-sm font-semibold text-foreground">
              Kelola Anggota & Pengurus
            </p>
            <p className="mt-1 text-xs text-muted">
              Tambah anggota baru, atur pengurus inti, dan divisi.
            </p>
          </Link>
          <Link
            href="/admin/pengguna"
            className="rounded-lg border border-border p-4 transition hover:bg-surface"
          >
            <p className="text-sm font-semibold text-foreground">
              Akses Admin
            </p>
            <p className="mt-1 text-xs text-muted">
              Tambah atau cabut email pengurus yang punya akses panel.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
