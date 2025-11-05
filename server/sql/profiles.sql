-- 1) Profiles table (one row per auth user)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('student','tutor')) not null,
  name text not null,
  school text,
  major text,
  grade text,                  -- e.g., "K-12", "Freshman", "Sophomore"
  hourly_rate numeric,         -- tutors only
  subjects text[] default '{}',-- array of subjects
  photo_url text,              -- public URL
  bio text,
  created_at timestamp with time zone default now()
);

-- 2) Helpful index for filtering
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_hourly_rate on public.profiles(hourly_rate);
create index if not exists idx_profiles_subjects on public.profiles using gin (subjects);

-- 3) Enable RLS
alter table public.profiles enable row level security;

-- 4) Policies
-- a) Anyone can read tutor profiles (marketplace browsing)
create policy "read_tutors_public"
on public.profiles
for select
to public
using (role = 'tutor');

-- b) Users can read their own profile
create policy "read_own_profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- c) Users can insert their own profile (first time)
create policy "insert_own_profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

-- d) Users can update their own profile
create policy "update_own_profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
