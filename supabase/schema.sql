-- ==========================================
-- SUPABASE SCHEMA FOR YAKOO EVENTS WEBSITE
-- ==========================================

-- 1. EXTENSION
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLES
-- ==========================================

-- 2. PROFILES (Extends auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')), -- Role for Admins
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- DYNAMIC WEBSITE CONTENT TABLES (FOR ADMIN PANEL)
-- ==========================================

-- 3. SITE CONTENT (General Key-Value text pairs for the whole site)
-- E.g. key='hero_title_1', value='VIVEZ' / key='hero_subtitle', value='Stage Adrénaline' / key='contact_phone', value='+216 71 790 501'
CREATE TABLE site_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key_name TEXT UNIQUE NOT NULL,
    content_value TEXT NOT NULL,
    description TEXT, -- To help the admin understand what this changes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. STATISTICS (The numbers shown on the hero/about page)
-- E.g. target=500, suffix='+', label='Groupes accueillis'
CREATE TABLE statistics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    target_value INTEGER NOT NULL,
    suffix TEXT,
    label TEXT NOT NULL,
    icon_name TEXT, -- Optional, if you want an icon
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ABOUT PILLARS (The 4 cards: Sécurité absolue, En pleine nature, etc.)
CREATE TABLE about_pillars (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL, -- e.g., 'Shield', 'Trees', 'Leaf', 'Zap'
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- CORE BUSINESS TABLES
-- ==========================================

-- 6. ACTIVITIES
CREATE TABLE activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    min_age TEXT,
    max_people INTEGER,
    image_url TEXT,
    highlights TEXT[], -- Array of strings for included items
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PACKS
CREATE TABLE packs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tier TEXT NOT NULL UNIQUE, -- BRONZE, SILVER, GOLD
    tagline TEXT,
    games_count INTEGER,
    description TEXT,
    price NUMERIC,
    features JSONB, -- Storing features array as JSON
    badge TEXT, -- E.g., 'Le plus populaire'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. RESERVATIONS
CREATE TABLE reservations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    activity_id UUID REFERENCES activities(id) ON DELETE SET NULL, -- Optional
    pack_id UUID REFERENCES packs(id) ON DELETE SET NULL, -- Optional
    reservation_date DATE NOT NULL,
    reservation_time TIME,
    group_size INTEGER NOT NULL CHECK (group_size > 0),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. CONTACT MESSAGES
CREATE TABLE contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 10. REVIEWS (Avis clients)
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    job TEXT,
    review TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    status TEXT DEFAULT 'En attente' CHECK (status IN ('En attente', 'Publié')),
    date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id OR is_admin());

-- Content Tables (Everyone views, Admins manage)
CREATE POLICY "Content viewable by everyone" ON site_content FOR SELECT USING (true);
CREATE POLICY "Admins manage content" ON site_content FOR ALL USING (is_admin());

CREATE POLICY "Stats viewable by everyone" ON statistics FOR SELECT USING (true);
CREATE POLICY "Admins manage stats" ON statistics FOR ALL USING (is_admin());

CREATE POLICY "Pillars viewable by everyone" ON about_pillars FOR SELECT USING (true);
CREATE POLICY "Admins manage pillars" ON about_pillars FOR ALL USING (is_admin());

CREATE POLICY "Activities viewable by everyone" ON activities FOR SELECT USING (true);
CREATE POLICY "Admins manage activities" ON activities FOR ALL USING (is_admin());

CREATE POLICY "Packs viewable by everyone" ON packs FOR SELECT USING (true);
CREATE POLICY "Admins manage packs" ON packs FOR ALL USING (is_admin());

-- Reservations & Contacts
CREATE POLICY "Users can view own reservations" ON reservations FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can insert own reservations" ON reservations FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can update own reservations" ON reservations FOR UPDATE USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admins can manage all reservations" ON reservations FOR ALL USING (is_admin());

CREATE POLICY "Anyone can submit contact" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage contacts" ON contacts FOR ALL USING (is_admin());


ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Admins manage reviews" ON reviews FOR ALL USING (is_admin());

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_statistics_updated_at BEFORE UPDATE ON statistics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_pillars_updated_at BEFORE UPDATE ON about_pillars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_packs_updated_at BEFORE UPDATE ON packs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 11. TRANSACTIONS (Finances)
-- ==========================================
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('recette', 'depense')),
    category TEXT NOT NULL,
    label TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    date TEXT NOT NULL,
    status TEXT DEFAULT 'Payé' CHECK (status IN ('Payé', 'En attente', 'Annulé')),
    ref TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage transactions" ON transactions FOR ALL USING (is_admin());

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 12. MATERIELS (Equipment Inventory)
-- ==========================================
CREATE TABLE materiels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    description TEXT,
    total_qty INTEGER NOT NULL DEFAULT 1,
    available_qty INTEGER NOT NULL DEFAULT 1,
    rental_price_per_day NUMERIC DEFAULT 0,
    purchase_price NUMERIC,
    condition TEXT DEFAULT 'Bon' CHECK (condition IN ('Excellent', 'Bon', 'Usagé', 'En réparation')),
    serial_number TEXT,
    purchase_date TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE materiels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read materiels" ON materiels FOR SELECT USING (true);
CREATE POLICY "Admins manage materiels" ON materiels FOR ALL USING (is_admin());
CREATE TRIGGER update_materiels_updated_at BEFORE UPDATE ON materiels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 13. MATERIEL ASSIGNMENTS
-- ==========================================
CREATE TABLE materiel_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    materiel_id UUID REFERENCES materiels(id) ON DELETE CASCADE NOT NULL,
    person TEXT NOT NULL,
    qty INTEGER NOT NULL DEFAULT 1,
    since TEXT NOT NULL,
    return_date TEXT,
    returned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE materiel_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage assignments" ON materiel_assignments FOR ALL USING (is_admin());

-- ==========================================
-- 14. EVENTS (Calendar Events)
-- ==========================================
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,           -- 'YYYY-MM-DD' format
    type TEXT NOT NULL DEFAULT 'event' CHECK (type IN ('reservation', 'task', 'event', 'reminder')),
    color TEXT DEFAULT '#3B82F6',
    time TEXT,                    -- 'HH:MM' format
    persons INTEGER,
    location TEXT,
    status TEXT DEFAULT 'Confirmé' CHECK (status IN ('En attente', 'Confirmé', 'Annulé')),
    assigned_materials JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Anyone can insert events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update events" ON events FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete events" ON events FOR DELETE USING (true);

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
