-- =====================================================
-- MIGRATION: Add events table for CalendarPage
-- Run this in your Supabase SQL Editor
-- =====================================================

CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'event'
        CHECK (type IN ('reservation', 'task', 'event', 'reminder')),
    color TEXT DEFAULT '#3B82F6',
    time TEXT,
    persons INTEGER,
    location TEXT,
    status TEXT DEFAULT 'Confirmé'
        CHECK (status IN ('En attente', 'Confirmé', 'Annulé')),
    assigned_materials JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Open policies (adjust once you have auth set up)
DROP POLICY IF EXISTS "Public read events" ON events;
DROP POLICY IF EXISTS "Anyone can insert events" ON events;
DROP POLICY IF EXISTS "Anyone can update events" ON events;
DROP POLICY IF EXISTS "Anyone can delete events" ON events;

CREATE POLICY "Public read events"      ON events FOR SELECT USING (true);
CREATE POLICY "Anyone can insert events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update events" ON events FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete events" ON events FOR DELETE USING (true);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
