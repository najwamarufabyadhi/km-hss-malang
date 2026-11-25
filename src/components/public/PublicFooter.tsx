import Link from "next/link";
import type { OrganizationProfile } from "@/types/database";

export function PublicFooter({ profile }: { profile: OrganizationProfile }) {
  const socials = Object.entries(profile.social_links ?? {}).filter(
    ([, url]) => Boolean(url && url.trim())
  );

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            {profile.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.logo_url}
                alt="Logo KM-HSS"
                className="h-9 w-9 rounded-lg object-contain"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-xs font-extrabold text-white">
                KM
              </div>
            )}
            <p className="text-sm font-extrabold text-primary">
              KM-HSS Malang
            </p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {profile.name}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Tautan Cepat
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/tentang" className="hover:text-primary">
                Tentang Organisasi
              </Link>
            </li>
            <li>
              <Link href="/berita" className="hover:text-primary">
                Berita & Kegiatan
              </Link>
            </li>
            <li>
              <Link href="/struktur" className="hover:text-primary">
                Struktur Keanggotaan
              </Link>
            </li>
            <li>
              <Link href="/anggota" className="hover:text-primary">
                Direktori Anggota
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Media Sosial
          </h3>
          {socials.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {socials.map(([platform, url]) => (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="capitalize hover:text-primary"
                  >
                    {platform}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">
              Belum ada tautan media sosial.
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © 2026 {profile.name}.
      </div>
    </footer>
  );
}
