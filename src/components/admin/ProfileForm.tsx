"use client";

import { useActionState } from "react";
import type { OrganizationProfile } from "@/types/database";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { StatusBanner } from "@/components/admin/StatusBanner";
import {
  updateProfileAction,
  type ProfileActionState,
} from "@/app/admin/(panel)/profil/actions";

const initialState: ProfileActionState = {};

export function ProfileForm({ profile }: { profile: OrganizationProfile }) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      <StatusBanner success={state.success} error={state.error} />

      <section className="space-y-5 rounded-xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-foreground">
          Identitas Organisasi
        </h2>

        <ImageUploadField
          name="logo_file"
          label="Logo Organisasi"
          currentUrl={profile.logo_url}
          aspectClass="h-24 w-24"
        />

        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Nama Organisasi
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={profile.name}
            className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Deskripsi Singkat
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={profile.description}
            className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="vision"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Visi
            </label>
            <textarea
              id="vision"
              name="vision"
              rows={4}
              defaultValue={profile.vision}
              className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="mission"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Misi
            </label>
            <textarea
              id="mission"
              name="mission"
              rows={4}
              defaultValue={profile.mission}
              className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="goals"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Tujuan Organisasi
            </label>
            <textarea
              id="goals"
              name="goals"
              rows={4}
              defaultValue={profile.goals}
              className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="main_focus"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Fokus Utama
            </label>
            <textarea
              id="main_focus"
              name="main_focus"
              rows={4}
              defaultValue={profile.main_focus}
              className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-foreground">
          Media Sosial Organisasi
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="social_instagram"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Instagram
            </label>
            <input
              id="social_instagram"
              name="social_instagram"
              type="url"
              placeholder="https://instagram.com/..."
              defaultValue={profile.social_links?.instagram ?? ""}
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label
              htmlFor="social_tiktok"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              TikTok
            </label>
            <input
              id="social_tiktok"
              name="social_tiktok"
              type="url"
              placeholder="https://tiktok.com/@..."
              defaultValue={profile.social_links?.tiktok ?? ""}
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label
              htmlFor="social_youtube"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              YouTube
            </label>
            <input
              id="social_youtube"
              name="social_youtube"
              type="url"
              placeholder="https://youtube.com/@..."
              defaultValue={profile.social_links?.youtube ?? ""}
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label
              htmlFor="social_facebook"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Facebook
            </label>
            <input
              id="social_facebook"
              name="social_facebook"
              type="url"
              placeholder="https://facebook.com/..."
              defaultValue={profile.social_links?.facebook ?? ""}
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label
              htmlFor="social_website"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Website Lainnya
            </label>
            <input
              id="social_website"
              name="social_website"
              type="url"
              placeholder="https://..."
              defaultValue={profile.social_links?.website ?? ""}
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Banner Pengumuman
            </h2>
            <p className="text-xs text-muted">
              Tampil di bagian atas situs publik (mis. Open Recruitment atau
              info penting).
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              name="announcement_enabled"
              defaultChecked={profile.announcement_enabled}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            Aktifkan Banner
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="announcement_text"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Teks Pengumuman
            </label>
            <input
              id="announcement_text"
              name="announcement_text"
              type="text"
              maxLength={300}
              placeholder="Pendaftaran Pengurus Baru KM-HSS Periode 2026/2027 dibuka!"
              defaultValue={profile.announcement_text}
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label
              htmlFor="announcement_url"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Tautan Pengumuman (Opsional)
            </label>
            <input
              id="announcement_url"
              name="announcement_url"
              type="url"
              placeholder="https://..."
              defaultValue={profile.announcement_url ?? ""}
              className="w-full rounded-lg border border-border px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
        >
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
