import Link from "next/link";
import { Megaphone, ArrowRight } from "lucide-react";
import type { OrganizationProfile } from "@/types/database";

export function AnnouncementBanner({
  profile,
}: {
  profile: OrganizationProfile;
}) {
  if (!profile.announcement_enabled || !profile.announcement_text.trim()) {
    return null;
  }

  return (
    <div className="bg-primary px-4 py-2 text-xs text-white sm:text-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 text-center">
        <Megaphone className="h-3.5 w-3.5 shrink-0" />
        <span className="font-medium">{profile.announcement_text}</span>
        {profile.announcement_url && (
          <Link
            href={profile.announcement_url}
            className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-white/80"
          >
            Selengkapnya
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
