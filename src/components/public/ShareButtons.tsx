"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Abaikan jika clipboard ditolak
    }
  };

  const handleWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${title} — KM-HSS Malang`);
    window.open(
      `https://wa.me/?text=${text}%20${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3.5 py-2 text-xs font-semibold text-foreground transition hover:bg-surface"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            Tautan Disalin
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" />
            Salin Tautan
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleWhatsApp}
        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
      >
        <Share2 className="h-3.5 w-3.5" />
        Bagikan ke WhatsApp
      </button>
    </div>
  );
}
