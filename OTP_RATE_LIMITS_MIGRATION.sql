-- =========================================================
-- OTP Rate Limits Table
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- =========================================================

-- Stores OTP resend rate limit state per identity (email/phone).
-- This persists across page refreshes so users can't bypass the
-- 5-resend limit by simply reloading the page.

CREATE TABLE IF NOT EXISTS public.otp_rate_limits (
  identity        TEXT PRIMARY KEY,          -- email or phone (normalized lowercase)
  resend_count    INTEGER NOT NULL DEFAULT 0, -- how many OTPs have been sent so far
  first_sent_at   TIMESTAMPTZ DEFAULT NOW(),  -- when the first OTP was sent (for auditing)
  last_sent_at    TIMESTAMPTZ,               -- when the most recent OTP was sent
  locked_until    TIMESTAMPTZ                -- if set, all OTP requests are blocked until this time
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_otp_rate_limits_identity ON public.otp_rate_limits (identity);

-- Enable Row Level Security (block direct client access — only API routes use admin client)
ALTER TABLE public.otp_rate_limits ENABLE ROW LEVEL SECURITY;

-- No public access — all access goes through service role (API routes)
-- This means no RLS policies are needed here; the admin client bypasses RLS.

-- =========================================================
-- Optional: auto-cleanup after 25 hours using pg_cron
-- (uncomment if you have pg_cron extension enabled)
-- =========================================================
-- SELECT cron.schedule(
--   'cleanup-otp-rate-limits',
--   '0 * * * *',  -- every hour
--   $$DELETE FROM public.otp_rate_limits WHERE locked_until IS NOT NULL AND locked_until < NOW() - INTERVAL '1 hour'$$
-- );
