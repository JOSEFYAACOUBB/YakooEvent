-- ─── Add booking_options table to manage booking form choices ─────────────────
-- Run this in: Supabase Dashboard → SQL Editor → New Query

CREATE TABLE IF NOT EXISTS booking_options (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category TEXT NOT NULL, -- 'Activités & Loisirs', 'Location de Matériels', 'Organisation d''Événements'
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE booking_options ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "booking_options viewable by everyone" ON booking_options;
CREATE POLICY "booking_options viewable by everyone" ON booking_options FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage booking_options" ON booking_options;
CREATE POLICY "Admins manage booking_options" ON booking_options FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Prepopulate with default values
INSERT INTO booking_options (category, name) VALUES
  ('Activités & Loisirs', 'Accrobranche'),
  ('Activités & Loisirs', 'Kayak'),
  ('Activités & Loisirs', 'Paintball'),
  ('Activités & Loisirs', 'Tyrolienne'),
  ('Activités & Loisirs', 'Mur d''escalade'),
  ('Activités & Loisirs', 'Geo-searching'),
  ('Activités & Loisirs', 'Tir à l''arc'),
  ('Activités & Loisirs', 'Jeu d''entonnoire'),
  ('Activités & Loisirs', 'Billards Japonais'),
  ('Activités & Loisirs', 'Twister Géant'),
  ('Activités & Loisirs', 'Jeu d''équilibre'),
  ('Activités & Loisirs', 'Atelier Robotique'),
  ('Activités & Loisirs', 'Jeu d''écrou'),
  ('Activités & Loisirs', 'Jeux des fléchettes'),
  ('Activités & Loisirs', 'Jeux de labyrinthe'),
  ('Location de Matériels', 'Tentes Scoutes'),
  ('Location de Matériels', 'Lit pliable'),
  ('Location de Matériels', 'Dortoire'),
  ('Location de Matériels', 'Matériel de sécurité / Baudrier'),
  ('Location de Matériels', 'Équipements de Paintball'),
  ('Location de Matériels', 'Gilets de sauvetage & Kayaks'),
  ('Organisation d''Événements', 'Séminaire d''entreprise'),
  ('Organisation d''Événements', 'Team Building personnalisé'),
  ('Organisation d''Événements', 'Anniversaires & Fêtes'),
  ('Organisation d''Événements', 'Conférence / Espace Nature'),
  ('Organisation d''Événements', 'Sortie Scolaire / Club')
ON CONFLICT (name) DO NOTHING;
