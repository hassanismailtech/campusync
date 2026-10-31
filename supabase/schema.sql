-- CampusSync data model. Apply through the Supabase migration workflow after a
-- dedicated CampusSync project has been selected. Never run this in an unknown project.
create extension if not exists pgcrypto;

create type public.app_role as enum ('admin', 'moderator', 'org_rep');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  college text,
  campus text,
  department text,
  level text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  type text not null,
  contact_email text,
  contact_phone text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  organization_id uuid references public.organizations(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, role, organization_id)
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  author_id uuid not null references auth.users(id) on delete restrict,
  title text not null check (char_length(title) between 3 and 180),
  body text not null check (char_length(body) between 3 and 10000),
  category text not null,
  urgency text not null default 'Info',
  tags text[] not null default '{}',
  pinned boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.exam_schedules (
  id uuid primary key default gen_random_uuid(),
  course text not null,
  department text,
  level text,
  exam_type text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep authorization checks outside public schema to avoid recursive RLS lookups.
create schema if not exists private;
revoke all on schema private from public;

create or replace function private.has_role(required_role public.app_role)
returns boolean language sql stable security definer set search_path = public, private as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = required_role
  );
$$;

create or replace function private.has_org_role(target_organization uuid)
returns boolean language sql stable security definer set search_path = public, private as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and role = 'org_rep'
      and organization_id = target_organization
  );
$$;

revoke all on function private.has_role(public.app_role) from public;
revoke all on function private.has_org_role(uuid) from public;
grant usage on schema private to authenticated;
grant execute on function private.has_role(public.app_role) to authenticated;
grant execute on function private.has_org_role(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.user_roles enable row level security;
alter table public.announcements enable row level security;
alter table public.exam_schedules enable row level security;

create policy "profiles read own" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles create own" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles update own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "organizations public read" on public.organizations for select using (true);
create policy "organizations admins manage" on public.organizations for all to authenticated using (private.has_role('admin')) with check (private.has_role('admin'));
create policy "roles admins manage" on public.user_roles for all to authenticated using (private.has_role('admin')) with check (private.has_role('admin'));
create policy "roles read own" on public.user_roles for select to authenticated using (user_id = auth.uid() or private.has_role('admin'));
create policy "announcements public read published" on public.announcements for select using (published_at is not null or author_id = auth.uid() or private.has_role('admin') or private.has_role('moderator'));
create policy "announcements staff create" on public.announcements for insert to authenticated with check (private.has_role('admin') or private.has_role('moderator') or private.has_org_role(organization_id));
create policy "announcements owners update" on public.announcements for update to authenticated using (private.has_role('admin') or private.has_role('moderator') or (author_id = auth.uid() and private.has_org_role(organization_id))) with check (private.has_role('admin') or private.has_role('moderator') or (author_id = auth.uid() and private.has_org_role(organization_id)));
create policy "announcements staff delete" on public.announcements for delete to authenticated using (private.has_role('admin') or private.has_role('moderator') or (author_id = auth.uid() and private.has_org_role(organization_id)));
create policy "exams public read" on public.exam_schedules for select using (true);
create policy "exams staff manage" on public.exam_schedules for all to authenticated using (private.has_role('admin') or private.has_role('moderator')) with check (private.has_role('admin') or private.has_role('moderator'));
