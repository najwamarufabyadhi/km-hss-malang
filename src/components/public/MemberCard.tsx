import Link from "next/link";
import type { Member } from "@/types/database";

export function MemberCard({
  member,
  divisionName,
  large = false,
}: {
  member: Member;
  divisionName?: string | null;
  large?: boolean;
}) {
  const initials = member.full_name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/anggota/${member.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white transition hover:border-primary/40 hover:shadow-sm"
    >
      <div className="aspect-square w-full overflow-hidden bg-surface">
        {member.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photo_url}
            alt={member.full_name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-gray-200">
            <span
              className={`font-extrabold text-primary ${
                large ? "text-3xl" : "text-2xl"
              }`}
            >
              {initials || "KM"}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="line-clamp-1 text-sm font-bold text-foreground group-hover:text-primary sm:text-base">
          {member.full_name}
        </p>
        <p className="mt-0.5 line-clamp-1 text-xs font-semibold text-accent sm:text-sm">
          {member.position}
        </p>
        {divisionName && (
          <p className="mt-1 line-clamp-1 text-xs text-muted">{divisionName}</p>
        )}
      </div>
    </Link>
  );
}
