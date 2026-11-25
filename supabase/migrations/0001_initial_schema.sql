-- KM-HSS Initial Schema & RLS Policies
-- Jalankan di Supabase SQL Editor atau melalui Supabase CLI

create extension if not exists "pgcrypto";

-- ============================================================
-- 1. TABEL
-- ============================================================

create table if not exists public.admins (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

create table if not exists public.organization_profile (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Kerukunan Mahasiswa Hulu Sungai Selatan wilayah Malang (KM-HSS)',
  logo_url text,
  description text not null default '',
  vision text not null default '',
  mission text not null default '',
  goals text not null default '',
  main_focus text not null default '',
  social_links jsonb not null default '{}'::jsonb,
  announcement_enabled boolean not null default false,
  announcement_text text not null default '',
  announcement_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'kegiatan' check (category in ('kegiatan', 'pengumuman', 'prestasi', 'divisi')),
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_email text
);

create index if not exists posts_status_published_at_idx on public.posts (status, published_at desc);
create index if not exists posts_category_idx on public.posts (category);
create index if not exists posts_featured_idx on public.posts (is_featured) where is_featured = true;

create table if not exists public.divisions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  sort_order integer not null default 0
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  position text not null,
  is_core boolean not null default false,
  division_id uuid references public.divisions(id) on delete set null,
  photo_url text,
  bio text not null default '',
  social_links jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists members_division_sort_idx on public.members (division_id, sort_order);
create index if not exists members_core_sort_idx on public.members (is_core, sort_order);

-- ============================================================
-- 2. TRIGGER UPDATED_AT
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_organization_profile_updated_at on public.organization_profile;
create trigger set_organization_profile_updated_at
  before update on public.organization_profile
  for each row execute function public.handle_updated_at();

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
  before update on public.posts
  for each row execute function public.handle_updated_at();

drop trigger if exists set_members_updated_at on public.members;
create trigger set_members_updated_at
  before update on public.members
  for each row execute function public.handle_updated_at();

-- ============================================================
-- 3. HELPER RLS ADMIN
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS) & GRANTS
-- ============================================================

grant usage on schema public to anon, authenticated;
grant select on public.organization_profile, public.posts, public.divisions, public.members to anon, authenticated;
grant insert, update, delete on public.organization_profile, public.posts, public.divisions, public.members to authenticated;
grant select, insert, delete on public.admins to authenticated;

alter table public.admins enable row level security;
alter table public.organization_profile enable row level security;
alter table public.posts enable row level security;
alter table public.divisions enable row level security;
alter table public.members enable row level security;

-- admins: hanya admin yang boleh baca/kelola
drop policy if exists "Admins can view admins" on public.admins;
create policy "Admins can view admins"
  on public.admins for select
  using (public.is_admin());

drop policy if exists "Admins can insert admins" on public.admins;
create policy "Admins can insert admins"
  on public.admins for insert
  with check (public.is_admin());

drop policy if exists "Admins can delete admins" on public.admins;
create policy "Admins can delete admins"
  on public.admins for delete
  using (public.is_admin());

-- organization_profile: publik baca, admin tulis
drop policy if exists "Public can view organization profile" on public.organization_profile;
create policy "Public can view organization profile"
  on public.organization_profile for select
  using (true);

drop policy if exists "Admins can insert organization profile" on public.organization_profile;
create policy "Admins can insert organization profile"
  on public.organization_profile for insert
  with check (public.is_admin());

drop policy if exists "Admins can update organization profile" on public.organization_profile;
create policy "Admins can update organization profile"
  on public.organization_profile for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete organization profile" on public.organization_profile;
create policy "Admins can delete organization profile"
  on public.organization_profile for delete
  using (public.is_admin());

-- posts: publik hanya baca yang published, admin penuh
drop policy if exists "Public can view published posts" on public.posts;
create policy "Public can view published posts"
  on public.posts for select
  using (status = 'published' or public.is_admin());

drop policy if exists "Admins can insert posts" on public.posts;
create policy "Admins can insert posts"
  on public.posts for insert
  with check (public.is_admin());

drop policy if exists "Admins can update posts" on public.posts;
create policy "Admins can update posts"
  on public.posts for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete posts" on public.posts;
create policy "Admins can delete posts"
  on public.posts for delete
  using (public.is_admin());

-- divisions: publik baca, admin tulis
drop policy if exists "Public can view divisions" on public.divisions;
create policy "Public can view divisions"
  on public.divisions for select
  using (true);

drop policy if exists "Admins can insert divisions" on public.divisions;
create policy "Admins can insert divisions"
  on public.divisions for insert
  with check (public.is_admin());

drop policy if exists "Admins can update divisions" on public.divisions;
create policy "Admins can update divisions"
  on public.divisions for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete divisions" on public.divisions;
create policy "Admins can delete divisions"
  on public.divisions for delete
  using (public.is_admin());

-- members: publik hanya baca yang aktif, admin penuh
drop policy if exists "Public can view active members" on public.members;
create policy "Public can view active members"
  on public.members for select
  using (is_active = true or public.is_admin());

drop policy if exists "Admins can insert members" on public.members;
create policy "Admins can insert members"
  on public.members for insert
  with check (public.is_admin());

drop policy if exists "Admins can update members" on public.members;
create policy "Admins can update members"
  on public.members for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete members" on public.members;
create policy "Admins can delete members"
  on public.members for delete
  using (public.is_admin());

-- ============================================================
-- 5. STORAGE BUCKET & KEBIJAKAN
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view media" on storage.objects;
create policy "Public can view media"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "Admins can upload media" on storage.objects;
create policy "Admins can upload media"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins can update media" on storage.objects;
create policy "Admins can update media"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins can delete media" on storage.objects;
create policy "Admins can delete media"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());

-- ============================================================
-- 6. SEED AWAL PROFIL ORGANISASI
-- ============================================================

insert into public.organization_profile (name, description)
select
  'Kerukunan Mahasiswa Hulu Sungai Selatan wilayah Malang (KM-HSS)',
  'Wadah silaturahmi, pengembangan potensi, dan kolaborasi mahasiswa asal Kabupaten Hulu Sungai Selatan di Malang.'
where not exists (select 1 from public.organization_profile);
