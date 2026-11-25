"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";
import { signInAction, type AuthActionState } from "@/app/admin/actions";

const initialState: AuthActionState = {};

export function LoginForm({
  supabaseConfigured,
}: {
  supabaseConfigured: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex flex-col items-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-km-hss.png"
          alt="Logo KM-HSS Malang"
          className="mb-3 h-14 w-14 object-contain"
        />
        <h1 className="text-xl font-bold text-foreground">
          Control Panel Admin
        </h1>
        <p className="mt-1 text-sm text-muted">
          Kerukunan Mahasiswa Hulu Sungai Selatan wilayah Malang
        </p>
      </div>

      {!supabaseConfigured && (
        <div
          role="status"
          className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800"
        >
          Konfigurasi Supabase belum aktif. Anda tetap bisa melihat tampilan
          ini, namun login baru berfungsi setelah <code>.env.local</code>{" "}
          diisi.
        </div>
      )}

      {state.error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Email Admin
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="pengurus@kmhss.org"
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Memproses..." : "Masuk ke Control Panel"}
        </button>
      </form>

      <div className="mt-6 border-t border-border pt-4 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
