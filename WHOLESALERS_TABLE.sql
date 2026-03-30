-- ============================================================
-- WHOLESALERS TABLE — Run in Supabase SQL Editor
-- ============================================================

-- ── 1. CREATE TABLE ──────────────────────────────────────────
create table if not exists public.wholesalers (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null unique references auth.users(id) on delete cascade,
  email                 text,
  full_name             text,
  aadhar_number         text,
  business_name         text,
  state                 text,
  city                  text,
  aadhaar_front_url     text,
  aadhaar_back_url      text,
  pan_card_url          text,
  gst_certificate_url   text,
  business_logo_url     text,
  verification_status   text default 'pending' check (
    verification_status in ('pending', 'verified', 'rejected', 'on_hold', 'resubmission_required', 'banned')
  ),
  rejection_reason      text,
  rejected_documents    text[] default '{}',
  admin_notes           text,
  notification_message  text,
  notified              boolean default false,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ── 2. ENABLE RLS ────────────────────────────────────────────
alter table public.wholesalers enable row level security;

-- ── 3. POLICIES ──────────────────────────────────────────────
-- Users can read their own wholesaler record
drop policy if exists "Users can view own wholesaler record" on public.wholesalers;
create policy "Users can view own wholesaler record"
  on wholesalers for select using (auth.uid() = user_id);

-- Users can insert their own record
drop policy if exists "Users can insert own wholesaler record" on public.wholesalers;
create policy "Users can insert own wholesaler record"
  on wholesalers for insert with check (auth.uid() = user_id);

-- Users can update their own record
drop policy if exists "Users can update own wholesaler record" on public.wholesalers;
create policy "Users can update own wholesaler record"
  on wholesalers for update using (auth.uid() = user_id);

-- ── 4. STORAGE BUCKETS ──────────────────────────────────────
-- Run these only if buckets don't exist yet:
-- insert into storage.buckets (id, name, public) values ('aadhaar-documents', 'aadhaar-documents', true) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('pan-documents', 'pan-documents', true) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('gst-documents', 'gst-documents', true) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('business-logos', 'business-logos', true) on conflict do nothing;

-- ── 5. STORAGE POLICIES (run per bucket) ────────────────────
-- Allow authenticated users to upload to their own folder:
-- create policy "Users can upload own docs" on storage.objects for insert with check (auth.uid()::text = (storage.foldername(name))[1]);
-- create policy "Users can read own docs" on storage.objects for select using (auth.uid()::text = (storage.foldername(name))[1]);
-- create policy "Public read" on storage.objects for select using (bucket_id in ('aadhaar-documents','pan-documents','gst-documents','business-logos'));

-- ── 6. VERIFY ────────────────────────────────────────────────
-- select * from wholesalers;
