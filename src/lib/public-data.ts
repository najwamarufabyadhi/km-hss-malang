import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type {
  Division,
  Member,
  OrganizationProfile,
  Period,
  Post,
  PostCategory,
} from "@/types/database";

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  kegiatan: "Kegiatan",
  pengumuman: "Pengumuman",
  prestasi: "Prestasi",
  divisi: "Kegiatan Divisi",
};

const SAMPLE_PROFILE: OrganizationProfile = {
  id: "sample-profile",
  name: "Kerukunan Mahasiswa Hulu Sungai Selatan wilayah Malang (KM-HSS)",
  logo_url: "/logo-km-hss.png",
  description:
    "Wadah silaturahmi, pengembangan potensi, dan kolaborasi mahasiswa asal Kabupaten Hulu Sungai Selatan yang sedang menempuh pendidikan di Malang dan sekitarnya.",
  vision:
    "Mewujudkan mahasiswa Hulu Sungai Selatan di Malang yang berintegritas, unggul secara akademik maupun organisasi, serta berkontribusi nyata bagi daerah asal.",
  mission:
    "1. Mempererat kekeluargaan antar-mahasiswa HSS di wilayah Malang.\n2. Mengembangkan kapasitas kepemimpinan, keilmuan, dan kreativitas anggota.\n3. Menjaga dan memperkenalkan budaya Banjar serta potensi Kabupaten Hulu Sungai Selatan.",
  goals:
    "Menjadi rumah bersama yang suportif bagi perantau mahasiswa HSS dalam beradaptasi, berprestasi, dan berkarya di Malang.",
  main_focus:
    "Kaderisasi & Keanggotaan, Pengabdian Masyarakat, Pengembangan Minat Bakat, serta Media & Komunikasi.",
  social_links: {
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  },
  announcement_enabled: true,
  announcement_text:
    "Selamat datang di portal resmi KM-HSS Malang — Open Recruitment Pengurus Baru segera dibuka!",
  announcement_url: "/tentang",
  updated_at: "2026-11-25T00:00:00Z",
};

const SAMPLE_POSTS: Post[] = [
  {
    id: "sample-1",
    title: "Malam Keakraban & Penyambutan Mahasiswa Baru KM-HSS Malang 2026",
    slug: "malam-keakraban-mahasiswa-baru-km-hss-2026",
    category: "kegiatan",
    excerpt:
      "Rangkaian acara penyambutan mahasiswa baru asal Hulu Sungai Selatan di Malang berlangsung hangat dan penuh kekeluargaan.",
    content:
      "Kerukunan Mahasiswa Hulu Sungai Selatan wilayah Malang (KM-HSS) sukses menyelenggarakan Malam Keakraban (Makrab) bagi mahasiswa baru angkatan 2026.\n\nKegiatan ini dihadiri oleh puluhan mahasiswa dari berbagai perguruan tinggi di Malang Raya. Selain sesi perkenalan dan berbagi pengalaman hidup di perantauan, acara juga diisi dengan diskusi kelompok serta penampilan seni daerah.\n\nMelalui kegiatan ini, diharapkan mahasiswa baru dapat lebih cepat beradaptasi dengan lingkungan kampus di Malang dan merasa memiliki keluarga besar yang saling mendukung.",
    cover_image_url: null,
    is_featured: true,
    status: "published",
    published_at: "2026-11-20T09:00:00Z",
    created_at: "2026-11-20T09:00:00Z",
    updated_at: "2026-11-20T09:00:00Z",
    author_email: "admin@kmhss.org",
  },
  {
    id: "sample-2",
    title: "Informasi Pendataan Ulang Anggota Aktif KM-HSS Periode 2026/2027",
    slug: "pendataan-ulang-anggota-aktif-km-hss-2026",
    category: "pengumuman",
    excerpt:
      "Seluruh mahasiswa asal Kabupaten Hulu Sungai Selatan di Malang diimbau melengkapi data keanggotaan terbaru.",
    content:
      "Dalam rangka pemutakhiran basis data organisasi periode 2026/2027, Bidang Kesekretariatan KM-HSS membuka pendataan ulang bagi seluruh anggota aktif di Malang.\n\nPendataan ini bertujuan mempermudah koordinasi kegiatan, distribusi informasi beasiswa daerah, serta pembentukan program kerja tiap divisi.",
    cover_image_url: null,
    is_featured: true,
    status: "published",
    published_at: "2026-11-18T10:00:00Z",
    created_at: "2026-11-18T10:00:00Z",
    updated_at: "2026-11-18T10:00:00Z",
    author_email: "admin@kmhss.org",
  },
  {
    id: "sample-3",
    title: "Delegasi KM-HSS Raih Juara 1 Lomba Karya Tulis Ilmiah Nasional",
    slug: "delegasi-km-hss-juara-1-lkti-nasional",
    category: "prestasi",
    excerpt:
      "Tim mahasiswa asal Kandangan yang tergabung dalam KM-HSS berhasil mengharumkan nama daerah di ajang ilmiah tingkat nasional.",
    content:
      "Prestasi membanggakan kembali ditorehkan oleh anggota KM-HSS wilayah Malang. Tim yang beranggotakan tiga mahasiswa lintas kampus ini berhasil meraih Juara 1 pada kompetisi Karya Tulis Ilmiah Nasional dengan gagasan pemberdayaan ekonomi kreatif berbasis kearifan lokal.\n\nKeberhasilan ini menjadi bukti bahwa semangat kolaborasi di organisasi mampu mendorong pencapaian akademik yang gemilang.",
    cover_image_url: null,
    is_featured: true,
    status: "published",
    published_at: "2026-11-15T08:30:00Z",
    created_at: "2026-11-15T08:30:00Z",
    updated_at: "2026-11-15T08:30:00Z",
    author_email: "admin@kmhss.org",
  },
  {
    id: "sample-4",
    title: "Bakti Sosial & Penggalangan Dana oleh Divisi Sosial Masyarakat",
    slug: "bakti-sosial-divisi-sosmas-km-hss",
    category: "divisi",
    excerpt:
      "Divisi Sosial Masyarakat KM-HSS menyalurkan paket bantuan pendidikan untuk anak-anak di kawasan pinggiran Kota Malang.",
    content:
      "Divisi Sosial Masyarakat KM-HSS kembali menggelar agenda rutin bertajuk KM-HSS Peduli. Kegiatan kali ini difokuskan pada pembagian perlengkapan sekolah dan sesi belajar bersama.\n\nAntusiasme anggota dalam menyiapkan donasi menunjukkan kepedulian sosial yang kuat di tengah kesibukan perkuliahan.",
    cover_image_url: null,
    is_featured: false,
    status: "published",
    published_at: "2026-11-10T14:00:00Z",
    created_at: "2026-11-10T14:00:00Z",
    updated_at: "2026-11-10T14:00:00Z",
    author_email: "admin@kmhss.org",
  },
  {
    id: "sample-5",
    title: "Latihan Rutin Futsal & Badminton Akhir Pekan Bersama Anggota",
    slug: "latihan-rutin-olahraga-km-hss",
    category: "kegiatan",
    excerpt:
      "Menjaga kebugaran sekaligus mempererat keakraban antar-anggota melalui agenda olahraga rutin setiap Sabtu sore.",
    content:
      "Setiap akhir pekan, Divisi Minat dan Bakat mengundang seluruh warga KM-HSS untuk bergabung dalam agenda olahraga bersama.\n\nSelain menjaga kesehatan fisik, kegiatan ini menjadi ajang temu kangen santai bagi mahasiswa dari berbagai angkatan.",
    cover_image_url: null,
    is_featured: false,
    status: "published",
    published_at: "2026-11-05T16:00:00Z",
    created_at: "2026-11-05T16:00:00Z",
    updated_at: "2026-11-05T16:00:00Z",
    author_email: "admin@kmhss.org",
  },
];

const SAMPLE_DIVISIONS: Division[] = [
  {
    id: "div-humas",
    name: "Divisi Humas & Media",
    description:
      "Mengelola publikasi kegiatan, media sosial, serta menjalin relasi eksternal organisasi.",
    sort_order: 1,
  },
  {
    id: "div-kaderisasi",
    name: "Divisi Kaderisasi & Keanggotaan",
    description:
      "Membina keakraban, penyambutan mahasiswa baru, dan pengembangan kapasitas anggota.",
    sort_order: 2,
  },
  {
    id: "div-sosmas",
    name: "Divisi Sosial & Pengabdian",
    description:
      "Menggerakkan aksi sosial, tanggap bencana, dan program pengabdian masyarakat.",
    sort_order: 3,
  },
];

const SAMPLE_PERIODS: Period[] = [
  {
    id: "period-2026",
    name: "2026/2027",
    is_active: true,
    sort_order: 1,
    created_at: "2026-11-01T00:00:00Z",
  },
];

const SAMPLE_MEMBERS: Member[] = [
  {
    id: "mem-1",
    full_name: "Muhammad Rizky Pratama",
    position: "Ketua Umum",
    is_core: true,
    division_id: null,
    period_id: "period-2026",
    photo_url: null,
    bio: "Mahasiswa Teknik Informatika di Malang asal Kandangan, Hulu Sungai Selatan.",
    social_links: {},
    sort_order: 1,
    is_active: true,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
  },
  {
    id: "mem-2",
    full_name: "Aulia Rahmah",
    position: "Wakil Ketua Umum",
    is_core: true,
    division_id: null,
    period_id: "period-2026",
    photo_url: null,
    bio: "Mahasiswa Ilmu Komunikasi yang aktif menggerakkan kolaborasi antar-organisasi daerah.",
    social_links: {},
    sort_order: 2,
    is_active: true,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
  },
  {
    id: "mem-3",
    full_name: "Nadia Safitri",
    position: "Sekretaris Umum",
    is_core: true,
    division_id: null,
    period_id: "period-2026",
    photo_url: null,
    bio: "Bertanggung jawab atas administrasi, surat-menyurat, dan pendataan anggota.",
    social_links: {},
    sort_order: 3,
    is_active: true,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
  },
  {
    id: "mem-4",
    full_name: "Ahmad Fauzan",
    position: "Bendahara Umum",
    is_core: true,
    division_id: null,
    period_id: "period-2026",
    photo_url: null,
    bio: "Mengelola transparansi keuangan dan program kemandirian dana organisasi.",
    social_links: {},
    sort_order: 4,
    is_active: true,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
  },
  {
    id: "mem-5",
    full_name: "Hafizh Ramadhan",
    position: "Koordinator Divisi",
    is_core: false,
    division_id: "div-humas",
    period_id: "period-2026",
    photo_url: null,
    bio: "Fokus pada desain visual, dokumentasi acara, dan pengelolaan portal berita.",
    social_links: {},
    sort_order: 5,
    is_active: true,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
  },
  {
    id: "mem-6",
    full_name: "Siti Norhaliza",
    position: "Koordinator Divisi",
    is_core: false,
    division_id: "div-kaderisasi",
    period_id: "period-2026",
    photo_url: null,
    bio: "Mendampingi adaptasi mahasiswa baru HSS dan merancang program kaderisasi.",
    social_links: {},
    sort_order: 6,
    is_active: true,
    created_at: "2026-11-01T00:00:00Z",
    updated_at: "2026-11-01T00:00:00Z",
  },
];

export async function getPublicProfile(): Promise<OrganizationProfile> {
  "use cache";
  cacheLife("minutes");
  cacheTag("profile");

  const supabase = createPublicClient();
  if (!supabase) return SAMPLE_PROFILE;

  const { data } = await supabase
    .from("organization_profile")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (!data) return SAMPLE_PROFILE;

  const profile = data as OrganizationProfile;
  return {
    ...profile,
    logo_url: profile.logo_url ?? "/logo-km-hss.png",
  };
}

export async function getFeaturedPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("posts");
  cacheTag("posts");

  const supabase = createPublicClient();
  if (!supabase) {
    const featured = SAMPLE_POSTS.filter((p) => p.is_featured);
    return featured.length > 0 ? featured.slice(0, 5) : SAMPLE_POSTS.slice(0, 5);
  }

  const { data: featured } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(5);

  if (featured && featured.length > 0) {
    return featured as Post[];
  }

  const { data: latest } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(5);

  return (latest as Post[] | null) ?? [];
}

export async function getPublishedPosts(options?: {
  category?: string;
  query?: string;
  page?: number;
  limit?: number;
}): Promise<{ posts: Post[]; total: number }> {
  "use cache";
  cacheLife("minutes");
  cacheTag("posts");

  const page = Math.max(1, options?.page ?? 1);
  const limit = options?.limit ?? 9;
  const category = options?.category?.trim();
  const query = options?.query?.trim().toLowerCase();

  const supabase = createPublicClient();
  if (!supabase) {
    let items = [...SAMPLE_POSTS];
    if (category && category !== "all") {
      items = items.filter((p) => p.category === category);
    }
    if (query) {
      items = items.filter((p) => p.title.toLowerCase().includes(query));
    }
    const start = (page - 1) * limit;
    return {
      posts: items.slice(start, start + limit),
      total: items.length,
    };
  }

  let builder = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (category && category !== "all") {
    builder = builder.eq("category", category);
  }
  if (query) {
    builder = builder.ilike("title", `%${query}%`);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const { data, count } = await builder.range(from, to);

  return {
    posts: (data as Post[] | null) ?? [],
    total: count ?? 0,
  };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("posts");

  const supabase = createPublicClient();
  if (!supabase) {
    return SAMPLE_POSTS.find((p) => p.slug === slug) ?? null;
  }

  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  return (data as Post | null) ?? null;
}

export async function getRelatedPosts(
  excludeSlug: string,
  limit = 3
): Promise<Post[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("posts");

  const supabase = createPublicClient();
  if (!supabase) {
    return SAMPLE_POSTS.filter((p) => p.slug !== excludeSlug).slice(0, limit);
  }

  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .neq("slug", excludeSlug)
    .order("published_at", { ascending: false })
    .limit(limit);

  return (data as Post[] | null) ?? [];
}

export async function getDivisionsAndMembers(): Promise<{
  divisions: Division[];
  members: Member[];
  periods: Period[];
}> {
  "use cache";
  cacheLife("minutes");
  cacheTag("structure");

  const supabase = createPublicClient();
  if (!supabase) {
    return {
      divisions: SAMPLE_DIVISIONS,
      members: SAMPLE_MEMBERS,
      periods: SAMPLE_PERIODS,
    };
  }

  const [divRes, memRes, perRes] = await Promise.all([
    supabase.from("divisions").select("*").order("sort_order", { ascending: true }),
    supabase
      .from("members")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("full_name", { ascending: true }),
    supabase.from("periods").select("*").order("sort_order", { ascending: true }),
  ]);

  return {
    divisions: (divRes.data as Division[] | null) ?? [],
    members: (memRes.data as Member[] | null) ?? [],
    periods: (perRes.data as Period[] | null) ?? [],
  };
}

export async function getMemberById(
  id: string
): Promise<{ member: Member | null; division: Division | null }> {
  "use cache";
  cacheLife("minutes");
  cacheTag("structure");

  const supabase = createPublicClient();
  if (!supabase) {
    const member = SAMPLE_MEMBERS.find((m) => m.id === id) ?? null;
    const division = member?.division_id
      ? (SAMPLE_DIVISIONS.find((d) => d.id === member.division_id) ?? null)
      : null;
    return { member, division };
  }

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (!member) return { member: null, division: null };

  let division: Division | null = null;
  if (member.division_id) {
    const { data: div } = await supabase
      .from("divisions")
      .select("*")
      .eq("id", member.division_id)
      .maybeSingle();
    division = (div as Division | null) ?? null;
  }

  return { member: member as Member, division };
}

export function formatIndonesianDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
