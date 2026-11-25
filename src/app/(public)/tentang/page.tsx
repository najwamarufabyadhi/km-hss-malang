import type { Metadata } from "next";
import { getPublicProfile } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Tentang Organisasi",
  description:
    "Profil, visi, misi, tujuan, dan fokus utama Kerukunan Mahasiswa Hulu Sungai Selatan wilayah Malang (KM-HSS).",
};

export default async function AboutPage() {
  const profile = await getPublicProfile();

  const sections = [
    { title: "Visi", content: profile.vision },
    { title: "Misi", content: profile.mission },
    { title: "Tujuan Organisasi", content: profile.goals },
    { title: "Fokus Utama", content: profile.main_focus },
  ];

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
      <section className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {profile.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.logo_url}
              alt="Logo KM-HSS"
              className="h-20 w-20 shrink-0 rounded-2xl bg-white object-contain p-2 shadow-sm"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-extrabold text-white shadow-sm">
              KM
            </div>
          )}

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Profil Organisasi
            </span>
            <h1 className="mt-1 text-2xl font-extrabold text-foreground sm:text-3xl">
              {profile.name}
            </h1>
          </div>
        </div>

        <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-foreground">
          {profile.description || "Deskripsi organisasi belum diisi."}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sections.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-border bg-white p-6"
          >
            <h2 className="border-l-4 border-accent pl-3 text-lg font-extrabold text-foreground">
              {item.title}
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted sm:text-base">
              {item.content || "Informasi belum diisi."}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
