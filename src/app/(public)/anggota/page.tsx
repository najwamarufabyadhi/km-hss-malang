import type { Metadata } from "next";
import { MembersDirectory } from "@/components/public/MembersDirectory";
import { getDivisionsAndMembers } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Anggota",
  description:
    "Direktori pengurus dan anggota aktif Kerukunan Mahasiswa Hulu Sungai Selatan wilayah Malang (KM-HSS).",
};

export default async function MembersPage() {
  const { members, divisions, periods } = await getDivisionsAndMembers();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <header>
        <h1 className="border-l-4 border-accent pl-3 text-2xl font-extrabold text-foreground sm:text-3xl">
          Direktori Anggota
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">
          Pengurus dan anggota aktif KM-HSS Malang.
        </p>
      </header>

      <MembersDirectory
        members={members}
        divisions={divisions}
        periods={periods}
      />
    </main>
  );
}
