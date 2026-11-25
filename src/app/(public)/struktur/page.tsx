import type { Metadata } from "next";
import { MemberCard } from "@/components/public/MemberCard";
import { getDivisionsAndMembers } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Struktur Keanggotaan",
  description:
    "Susunan pengurus inti dan divisi Kerukunan Mahasiswa Hulu Sungai Selatan wilayah Malang (KM-HSS).",
};

export default async function StructurePage() {
  const { divisions, members } = await getDivisionsAndMembers();

  const coreMembers = members.filter((m) => m.is_core);
  const divisionGroups = divisions.map((div) => ({
    division: div,
    members: members.filter((m) => m.division_id === div.id),
  }));

  return (
    <main className="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:px-6 sm:py-10">
      <header>
        <h1 className="border-l-4 border-accent pl-3 text-2xl font-extrabold text-foreground sm:text-3xl">
          Struktur Keanggotaan
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">
          Susunan pengurus inti dan divisi aktif Kerukunan Mahasiswa Hulu Sungai
          Selatan wilayah Malang (KM-HSS).
        </p>
      </header>

      {/* Pengurus Inti */}
      <section aria-labelledby="heading-inti" className="space-y-5">
        <h2
          id="heading-inti"
          className="border-l-4 border-primary pl-3 text-xl font-extrabold text-foreground"
        >
          Pengurus Inti
        </h2>
        {coreMembers.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface p-6 text-sm text-muted">
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

      {/* Per Divisi */}
      {divisionGroups.map(({ division, members: divMembers }) => (
        <section
          key={division.id}
          aria-labelledby={`div-${division.id}`}
          className="space-y-4 border-t border-border pt-8"
        >
          <div>
            <h2
              id={`div-${division.id}`}
              className="border-l-4 border-accent pl-3 text-xl font-extrabold text-foreground"
            >
              {division.name}
            </h2>
            {division.description && (
              <p className="mt-1.5 text-sm text-muted">
                {division.description}
              </p>
            )}
          </div>

          {divMembers.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-surface p-6 text-sm text-muted">
              Belum ada anggota di divisi ini.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {divMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  divisionName={division.name}
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </main>
  );
}
