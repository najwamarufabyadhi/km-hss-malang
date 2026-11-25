import Link from "next/link";
import { ArrowLeft, Newspaper } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-12 text-center">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-km-hss.png"
          alt="Logo KM-HSS Malang"
          className="mx-auto h-16 w-16 object-contain"
        />

        <p className="mt-4 text-xs font-extrabold uppercase tracking-widest text-accent">
          Error 404
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-foreground">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Maaf, halaman yang Anda cari mungkin sudah dipindahkan, dihapus, atau
          alamat URL tidak sesuai.
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/berita"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface"
          >
            <Newspaper className="h-4 w-4" />
            Lihat Berita
          </Link>
        </div>
      </div>
    </main>
  );
}
