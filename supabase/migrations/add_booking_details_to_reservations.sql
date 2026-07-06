-- ─── Add booking_details column to reservations table ──────────────────────────────────────
-- Run this in: Supabase Dashboard → SQL Editor → New Query

ALTER TABLE reservations ADD COLUMN IF NOT EXISTS booking_details JSONB;
