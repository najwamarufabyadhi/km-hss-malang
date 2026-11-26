"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Division, Member, Period } from "@/types/database";
import { MemberCard } from "@/components/public/MemberCard";

export function MembersDirectory({
  members,
  divisions,
  periods = [],
}: {
  members: Member[];
  divisions: Division[];
  periods?: Period[];
}) {
  const activePeriod = periods.find((p) => p.is_active) ?? periods[0];
  const [query, setQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState(
    activePeriod?.id ?? "all"
  );

  const divisionMap = useMemo(() => {
    const map = new Map<string, string>();
    divisions.forEach((d) => map.set(d.id, d.name));
    return map;
  }, [divisions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      const matchesQuery =
        !q ||
        m.full_name.toLowerCase().includes(q) ||
        m.position.toLowerCase().includes(q);
      const matchesDivision =
        selectedDivision === "all" ||
        (selectedDivision === "core" && m.is_core) ||
        m.division_id === selectedDivision;
      const matchesPeriod =
        selectedPeriod === "all" ||
        !m.period_id ||
        m.period_id === selectedPeriod;
      return matchesQuery && matchesDivision && matchesPeriod;
    });
  }, [members, query, selectedDivision, selectedPeriod]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau jabatan..."
            aria-label="Cari anggota"
            className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {periods.length > 0 && (
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              aria-label="Filter periode"
              className="rounded-lg border border-border bg-white px-3.5 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="all">Semua Periode</option>
              {periods.map((per) => (
                <option key={per.id} value={per.id}>
                  Periode {per.name} {per.is_active ? "(Aktif)" : ""}
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            aria-label="Filter divisi"
            className="rounded-lg border border-border bg-white px-3.5 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">Semua Divisi ({members.length})</option>
            <option value="core">Pengurus Inti</option>
            {divisions.map((div) => (
              <option key={div.id} value={div.id}>
                {div.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
          <p className="text-base font-semibold text-foreground">
            Anggota tidak ditemukan
          </p>
          <p className="mt-1 text-sm text-muted">
            Coba ubah kata kunci pencarian atau pilih divisi/periode lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              divisionName={
                member.division_id
                  ? divisionMap.get(member.division_id)
                  : member.is_core
                    ? "Pengurus Inti"
                    : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
