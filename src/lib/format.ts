import type { PostCategory } from "@/types/database";

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  kegiatan: "Kegiatan",
  pengumuman: "Pengumuman",
  prestasi: "Prestasi",
  divisi: "Kegiatan Divisi",
};

export function formatIndonesianDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
