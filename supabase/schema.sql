-- Supabase schema for The Last Stronghold download tracking.
-- Run this SQL in the Supabase SQL Editor to create the downloads table.

create table if not exists public.downloads (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  dob date not null,
  created_at timestamptz not null default timezone('utc', now())
);

-- Helpful indexes for reviewing signups by email or newest download submissions.
create index if not exists downloads_created_at_idx
  on public.downloads (created_at desc);

create index if not exists downloads_email_idx
  on public.downloads (lower(email));

create index if not exists downloads_email_created_at_idx
  on public.downloads (lower(email), created_at desc);

-- Turn on Row Level Security for good database hygiene.
alter table public.downloads enable row level security;

-- Guidance:
-- 1. Do NOT add a public INSERT policy for this table.
-- 2. Your frontend never writes directly to Supabase.
-- 3. The Cloudflare Pages Function uses the service role key on the server only.
-- 4. Service role requests bypass RLS, so no extra policy is required for the backend insert flow.

-- Optional read policy example for authenticated dashboard users later:
-- create policy "Allow authenticated reads for project admins"
-- on public.downloads
-- for select
-- to authenticated
-- using (true);
