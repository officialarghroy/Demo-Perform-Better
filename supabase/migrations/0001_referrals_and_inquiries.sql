-- Perform Better Fitness Center
-- Migration: referrals + trial inquiries
--
-- Apply via the Supabase SQL editor, or with the Supabase CLI:
--   supabase db push
--
-- Both tables are written to exclusively through server-side API routes
-- using the service-role key (see lib/supabase-admin.ts). Row Level
-- Security is enabled with NO policies defined, which means the anon/
-- authenticated roles (used by the public NEXT_PUBLIC_SUPABASE_ANON_KEY
-- client in lib/supabase.ts) cannot read or write these tables at all —
-- only the service role (which bypasses RLS) can. This keeps referral
-- and inquiry data from being readable or forgeable directly from the
-- browser.

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ---------------------------------------------------------------------
-- referrals
-- ---------------------------------------------------------------------
-- Links an existing member (the referrer) to a new signup they referred,
-- and tracks that referral through to the "1 month free" reward payout
-- described on the Pricing page's promo banner.
--
-- referrer_member_id is stored as free text because this project does
-- not yet have a `members` table (no member accounts/auth exist yet).
-- Once member accounts exist, add:
--   alter table public.referrals
--     add constraint referrals_referrer_member_id_fkey
--     foreign key (referrer_member_id) references public.members(id);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),

  -- Who gets the reward.
  referrer_member_id text not null,
  referrer_name text,

  -- Who they referred.
  new_member_name text not null,
  new_member_phone text not null,
  new_member_email text,
  plan_interest text check (plan_interest in ('gym_only', 'gym_f50')),

  -- Reward lifecycle:
  --   pending        -> referral submitted, unverified
  --   verified       -> staff confirmed the new member signed up
  --   reward_issued  -> the referrer's 1 free month has been applied
  --   rejected       -> did not qualify (e.g. duplicate, no signup)
  status text not null default 'pending'
    check (status in ('pending', 'verified', 'reward_issued', 'rejected')),
  reward_type text not null default 'f50_group_classes_1_month_free',

  notes text,

  created_at timestamptz not null default now(),
  verified_at timestamptz,
  reward_issued_at timestamptz
);

create index if not exists referrals_referrer_member_id_idx
  on public.referrals (referrer_member_id);

create index if not exists referrals_status_idx
  on public.referrals (status);

-- Cheap duplicate/spam guard: the API route checks for an existing
-- referral with the same referrer + new-member phone before inserting,
-- but this index makes that lookup fast either way.
create index if not exists referrals_new_member_phone_idx
  on public.referrals (new_member_phone);

alter table public.referrals enable row level security;
-- No policies: only the service role (server-side only) may read/write.

-- ---------------------------------------------------------------------
-- trial_inquiries
-- ---------------------------------------------------------------------
-- Captures "2-Day FREE Trial" inquiries phoned in through the Vapi AI
-- receptionist (see app/api/vapi/route.ts), whether structured via a
-- tool call during the live call or reconstructed from the end-of-call
-- transcript/summary afterward.

create table if not exists public.trial_inquiries (
  id uuid primary key default gen_random_uuid(),

  -- 'vapi_tool_call'   — captured live, mid-call, via a Vapi tool
  -- 'vapi_call_summary'— reconstructed from the end-of-call report
  source text not null check (source in ('vapi_tool_call', 'vapi_call_summary')),

  vapi_call_id text,
  caller_name text,
  caller_phone text,
  preferred_class text,
  notes text,

  transcript text,
  summary text,

  -- Full webhook payload, kept for debugging / re-processing.
  raw_payload jsonb,

  status text not null default 'new'
    check (status in ('new', 'contacted', 'converted', 'closed')),

  created_at timestamptz not null default now()
);

create index if not exists trial_inquiries_vapi_call_id_idx
  on public.trial_inquiries (vapi_call_id);

create index if not exists trial_inquiries_status_idx
  on public.trial_inquiries (status);

alter table public.trial_inquiries enable row level security;
-- No policies: only the service role (server-side only) may read/write.
