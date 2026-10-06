create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password text not null,
  token text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  number text not null,
  owner_id uuid not null references users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contacts_owner_id_idx on contacts (owner_id);

-- Supabase exposes the public schema through its REST API (anon key).
-- RLS without policies closes that path; this backend connects as the
-- postgres role, which bypasses RLS.
alter table users enable row level security;
alter table contacts enable row level security;
