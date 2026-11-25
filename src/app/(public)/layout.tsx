import { Suspense } from "react";
import { AnnouncementBanner } from "@/components/public/AnnouncementBanner";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicHeader } from "@/components/public/PublicHeader";
import { getPublicProfile } from "@/lib/public-data";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getPublicProfile();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AnnouncementBanner profile={profile} />
      <Suspense fallback={<div className="h-16 border-b border-border bg-white" />}>
        <PublicHeader profile={profile} />
      </Suspense>
      <div className="flex-1">{children}</div>
      <PublicFooter profile={profile} />
    </div>
  );
}
