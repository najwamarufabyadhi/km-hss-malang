"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

export function StatusBanner({
  success,
  error,
}: {
  success?: string;
  error?: string;
}) {
  if (!success && !error) return null;

  if (error) {
    return (
      <div
        role="alert"
        className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
    >
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      <span>{success}</span>
    </div>
  );
}
