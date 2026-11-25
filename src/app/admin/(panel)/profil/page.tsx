import { connection } from "next/server";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { OrganizationProfile } from "@/types/database";

const DEFAULT_PROFILE: OrganizationProfile = {
  id: "",
  name: "Kerukunan Mahasiswa Hulu Sungai Selatan wilayah Malang (KM-HSS)",
  logo_url: null,
  description: "",
  vision: "",
  mission: "",
  goals: "",
  main_focus: "",
  social_links: {},
  announcement_enabled: false,
  announcement_text: "",
  announcement_url: null,
  updated_at: "",
};

async function getOrganizationProfile(): Promise<OrganizationProfile> {
  await connection();
  if (!isSupabaseConfigured()) return DEFAULT_PROFILE;

  const supabase = await createClient();
  const { data } = await supabase
    .from("organization_profile")
    .select("*")
    .limit(1)
    .maybeSingle();

  return (data as OrganizationProfile | null) ?? DEFAULT_PROFILE;
}

export default async function AdminProfilePage() {
  const profile = await getOrganizationProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Profil Organisasi
        </h1>
        <p className="mt-1 text-sm text-muted">
          Kelola identitas, logo, visi misi, media sosial, dan banner
          pengumuman KM-HSS.
        </p>
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
}
