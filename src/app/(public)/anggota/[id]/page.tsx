import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getMemberById } from "@/lib/public-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { member } = await getMemberById(id);
  if (!member) {
    return { title: "Anggota Tidak Ditemukan" };
  }

  return {
    title: `${member.full_name} — ${member.position}`,
    description:
      member.bio || `${member.full_name}, ${member.position} KM-HSS Malang.`,
  };
}

async function MemberDetailContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) {
  const { id } = await paramsPromise;
  const { member, division } = await getMemberById(id);

  if (!member) {
    notFound();
  }

  const initials = member.full_name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const socials = Object.entries(member.social_links ?? {}).filter(
    ([, url]) => Boolean(url && url.trim())
  );

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/anggota"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar Anggota
      </Link>

      <section className="overflow-hidden rounded-2xl border border-border bg-white p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="h-40 w-40 shrink-0 overflow-hidden rounded-2xl bg-surface">
            {member.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.photo_url}
                alt={member.full_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-gray-200 text-4xl font-extrabold text-primary">
                {initials || "KM"}
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {member.is_core && (
                <span className="rounded bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  Pengurus Inti
                </span>
              )}
              {division && (
                <span className="rounded bg-surface px-2.5 py-0.5 text-xs font-semibold text-muted">
                  {division.name}
                </span>
              )}
            </div>

            <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
              {member.full_name}
            </h1>
            <p className="mt-1 text-base font-semibold text-accent">
              {member.position}
            </p>

            {member.bio && (
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted sm:text-base">
                {member.bio}
              </p>
            )}

            {socials.length > 0 && (
              <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                {socials.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold capitalize text-foreground transition hover:bg-surface hover:text-primary"
                  >
                    <span>{platform}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-12 text-sm text-muted">
          Memuat profil anggota...
        </div>
      }
    >
      <MemberDetailContent paramsPromise={params} />
    </Suspense>
  );
}
