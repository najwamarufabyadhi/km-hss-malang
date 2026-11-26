-- KM-HSS Migration 0002: Riwayat Periode Kepengurusan
-- Jalankan di Supabase SQL Editor

create table if not exists public.periods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.members
  add column if not exists period_id uuid references public.periods(id) on delete set null;

create index if not exists members_period_id_idx on public.members (period_id);

-- Grants & RLS
grant select on public.periods to anon, authenticated;
grant insert, update, delete on public.periods to authenticated;

alter table public.periods enable row level security;

drop policy if exists "Public can view periods" on public.periods;
create policy "Public can view periods"
  on public.periods for select
  using (true);

drop policy if exists "Admins can insert periods" on public.periods;
create policy "Admins can insert periods"
  on public.periods for insert
  with check (public.is_admin());

drop policy if exists "Admins can update periods" on public.periods;
create policy "Admins can update periods"
  on public.periods for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete periods" on public.periods;
create policy "Admins can delete periods"
  on public.periods for delete
  using (public.is_admin());

-- Seed periode awal jika belum ada, dan tautkan anggota yang belum punya periode
insert into public.periods (name, is_active, sort_order)
select '2026/2027', true, 1
where not exists (select 1 from public.periods);

update public.members
set period_id = (
  select id from public.periods where is_active = true order by sort_order asc limit 1
)
where period_id is null;
