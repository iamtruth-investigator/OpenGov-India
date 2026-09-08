-- OpenGov India production-oriented civic data schema.
-- Applied to Supabase project xtlunrelrirjmwrvqlhz.
-- Demo project records are explicitly marked is_demo=true.

create table if not exists public.opengov_projects (
  id text primary key,
  type text not null,
  title text not null,
  place text not null,
  budget numeric(14,2) not null default 0,
  approved numeric(14,2) not null default 0,
  released numeric(14,2) not null default 0,
  utilized numeric(14,2) not null default 0,
  progress integer not null default 0 check (progress between 0 and 100),
  status text not null,
  department text not null,
  contractor text,
  start_date date,
  end_date date,
  is_demo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.opengov_reports (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  project_id text references public.opengov_projects(id) on delete set null,
  location text not null,
  category text not null,
  title text not null,
  description text not null,
  evidence_reference text,
  evidence_url text,
  status text not null default 'Submitted',
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.opengov_ai_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  project_id text references public.opengov_projects(id) on delete set null,
  prompt text not null,
  response text,
  model text,
  source_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.opengov_user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'citizen' check (role in ('citizen','reviewer','officer','admin')),
  department text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.opengov_projects enable row level security;
alter table public.opengov_reports enable row level security;
alter table public.opengov_ai_runs enable row level security;
alter table public.opengov_user_roles enable row level security;

-- Public project register is read-only from the browser.
create policy "public can read opengov projects" on public.opengov_projects
  for select to anon, authenticated using (true);

-- Reports are private to authenticated users/reviewers in this prototype.
create policy "users can read reports" on public.opengov_reports
  for select to authenticated using (true);
create policy "users can submit reports" on public.opengov_reports
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- AI audit records are private to their owner.
create policy "users can read own ai runs" on public.opengov_ai_runs
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "users can insert own ai runs" on public.opengov_ai_runs
  for insert to authenticated with check ((select auth.uid()) = user_id);

-- A new account may create only its own citizen role. Reviewer/officer/admin roles
-- must be assigned out-of-band by an administrator.
create policy "users can read own role" on public.opengov_user_roles
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "users can create own citizen role" on public.opengov_user_roles
  for insert to authenticated with check ((select auth.uid()) = user_id and role='citizen');

-- Private evidence bucket. Object paths must start with the uploader's user id.
-- Bucket: opengov-evidence
