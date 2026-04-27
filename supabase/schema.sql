-- Supabase schema for The Last Stronghold waitlist tracking.
-- Run this SQL in the Supabase SQL Editor to create the waitlist_signups table.

create table if not exists public.waitlist_signups (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

-- Helpful indexes for reviewing signups by email or newest submissions.
create index if not exists waitlist_signups_created_at_idx
  on public.waitlist_signups (created_at desc);

create index if not exists waitlist_signups_email_idx
  on public.waitlist_signups (lower(email));

create index if not exists waitlist_signups_email_created_at_idx
  on public.waitlist_signups (lower(email), created_at desc);

-- Turn on Row Level Security for good database hygiene.
alter table public.waitlist_signups enable row level security;

-- Guidance:
-- 1. Do NOT add a public INSERT policy for this table.
-- 2. Your frontend never writes directly to Supabase.
-- 3. The Cloudflare Pages Function uses the service role key on the server only.
-- 4. Service role requests bypass RLS, so no extra policy is required for the backend insert flow.

-- Optional read policy example for authenticated dashboard users later:
-- create policy "Allow authenticated reads for project admins"
-- on public.waitlist_signups
-- for select
-- to authenticated
-- using (true);
