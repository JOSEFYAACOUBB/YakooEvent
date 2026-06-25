-- ================================================================
-- COMPLETE SUPABASE MIGRATION — ALL MISSING TABLES
-- Run this in your Supabase SQL Editor
-- Project: Yakoo Events
-- ================================================================

-- ──────────────────────────────────────────────────────────────────
-- HELPER: make sure updated_at trigger function exists
-- ──────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ──────────────────────────────────────────────────────────────────
-- 1. OPEN site_content FOR PUBLIC READ/WRITE
--    (table already exists, just fix RLS)
-- ──────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Content viewable by everyone" ON site_content;
DROP POLICY IF EXISTS "Admins manage content" ON site_content;

CREATE POLICY "Anyone read site_content"   ON site_content FOR SELECT USING (true);
CREATE POLICY "Anyone write site_content"  ON site_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update site_content" ON site_content FOR UPDATE USING (true);
CREATE POLICY "Anyone delete site_content" ON site_content FOR DELETE USING (true);

-- Seed default site_content keys (ignore conflict if already exist)
INSERT INTO site_content (key_name, content_value, description) VALUES
  ('hero_title',      'VIVEZ SAUVAGE ET LIBRE',      'Titre principal du Hero'),
  ('hero_subtitle',   'STAGE ADRÉNALINE !',           'Sous-titre du Hero'),
  ('hero_overlay',    '60',                           'Opacité overlay (0–80)'),
  ('hero_cta1_text',  'Réserver maintenant',          'Bouton CTA 1 texte'),
  ('hero_cta1_url',   '#reservation',                 'Bouton CTA 1 lien'),
  ('hero_cta2_text',  'Voir nos activités',           'Bouton CTA 2 texte'),
  ('hero_cta2_url',   '#activites',                   'Bouton CTA 2 lien'),
  ('about_mission',   'Yakoo Events est une agence événementielle spécialisée dans les activités de plein air, le team building et les aventures en nature.', 'Mission principale'),
  ('about_vision',    '"Créer des expériences qui transcendent le quotidien et forgent des liens durables."', 'Citation vision'),
  ('footer_tagline',  'Vivez l''aventure, forgez les souvenirs.', 'Tagline footer'),
  ('footer_phone',    '+216 71 790 501',              'Téléphone footer'),
  ('footer_email',    'promoscout.contact@gmail.com', 'Email footer'),
  ('footer_address',  'Avenue Jugurtha, Tunis, Tunisie', 'Adresse footer'),
  ('footer_facebook', 'facebook.com/yakooevents',     'URL Facebook'),
  ('footer_instagram','instagram.com/yakooevents',    'URL Instagram'),
  ('footer_youtube',  'youtube.com/@yakooevents',     'URL YouTube'),
  ('seo_title',       'Yakoo Events — Agence Événementielle Aventure Tunisie', 'Titre SEO'),
  ('seo_description', 'Vivez des aventures inoubliables avec Yakoo Events. Accrobranche, kayak, paintball, team building et hébergement en Tunisie. Réservez dès maintenant !', 'Meta description SEO')
ON CONFLICT (key_name) DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- 2. FAQ TABLE (public site FAQ + admin FAQ editor)
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faq (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    emoji TEXT DEFAULT '❓',
    tag TEXT DEFAULT '',
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read faq"   ON faq FOR SELECT USING (true);
CREATE POLICY "Anyone insert faq" ON faq FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update faq" ON faq FOR UPDATE USING (true);
CREATE POLICY "Anyone delete faq" ON faq FOR DELETE USING (true);

DROP TRIGGER IF EXISTS update_faq_updated_at ON faq;
CREATE TRIGGER update_faq_updated_at BEFORE UPDATE ON faq
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO faq (question, answer, emoji, tag, display_order) VALUES
  ('Quelles sont les heures d''ouvertures ?', 'Yakoo Events est ouvert du mardi au dimanche de 8h00 à 18h00. Les réservations de groupes peuvent être organisées en dehors de ces horaires sur demande. Nous sommes fermés le lundi pour maintenance.', '🕗', 'Horaires', 1),
  ('Y a-t-il une buvette à Yakoo Events ?', 'Oui, notre buvette est ouverte tous les jours d''exploitation. Elle propose des boissons fraîches et chaudes, des snacks et des repas légers. Pour les groupes importants, un service traiteur peut être organisé sur réservation.', '🍹', 'Restauration', 2),
  ('Comment effectuer votre réservation ?', 'Vous pouvez réserver directement via notre formulaire en ligne, par téléphone au +216 71 790 501, ou par email à promoscout.contact@gmail.com. Un acompte de 30% est requis pour confirmer la réservation.', '📅', 'Réservation', 3),
  ('Que dois-je prévoir comme vêtements ?', 'Nous recommandons des vêtements confortables et adaptés aux activités de plein air : pantalon long, t-shirt à manches longues, et chaussures fermées et robustes. Évitez les sandales et les vêtements trop larges pour les activités en hauteur.', '👕', 'Équipement', 4),
  ('À partir de quel âge peut-on participer ?', 'La plupart de nos activités sont accessibles dès 6 ans avec encadrement parental. Certaines activités comme le paintball sont réservées aux 12 ans et plus. Contactez-nous pour adapter le programme à votre groupe.', '👨‍👩‍👧', 'Âge & Accès', 5),
  ('Y a-t-il un parking sur place ?', 'Oui, Yakoo Events dispose d''un grand parking gratuit pouvant accueillir cars et véhicules individuels. Le parc est situé Avenue Jugurtha, Tunis, facilement accessible depuis le centre-ville.', '🚗', 'Accès', 6)
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- 3. SPONSORS TABLE
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sponsors (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT DEFAULT '🏢',
    tier TEXT DEFAULT 'Partenaire' CHECK (tier IN ('Or','Argent','Bronze','Partenaire')),
    website TEXT DEFAULT '',
    description TEXT DEFAULT '',
    active BOOLEAN DEFAULT true,
    since TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sponsors"   ON sponsors FOR SELECT USING (true);
CREATE POLICY "Anyone insert sponsors" ON sponsors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update sponsors" ON sponsors FOR UPDATE USING (true);
CREATE POLICY "Anyone delete sponsors" ON sponsors FOR DELETE USING (true);

DROP TRIGGER IF EXISTS update_sponsors_updated_at ON sponsors;
CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON sponsors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO sponsors (name, logo, tier, website, description, active, since) VALUES
  ('Tunisie Telecom', '🏢', 'Or', 'tunisietelecom.tn', 'Sponsor principal et partenaire télécom officiel depuis 2023.', true, 'Jan 2023'),
  ('BIAT Bank', '🏦', 'Or', 'biat.com.tn', 'Partenaire financier, accompagne nos événements corporate.', true, 'Mar 2023'),
  ('OutdoorPro TN', '⛺', 'Argent', 'outdoorpro.tn', 'Fournisseur officiel d''équipements outdoor.', true, 'Jun 2023'),
  ('Aventura Voyages', '✈️', 'Partenaire', 'aventura.tn', 'Partenariat pour l''envoi de groupes touristiques.', true, 'Sep 2023'),
  ('MediaPro TN', '📸', 'Bronze', 'mediapro.tn', 'Studio photo et vidéo officiel des événements Yakoo.', false, 'Déc 2023')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- 4. TASKS TABLE (Kanban)
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT DEFAULT 'À faire' CHECK (status IN ('À faire','En cours','Terminé','Annulé')),
    priority TEXT DEFAULT 'Moyenne' CHECK (priority IN ('Haute','Moyenne','Basse')),
    assigned_to TEXT DEFAULT '',
    due_date TEXT DEFAULT '',
    category TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tasks"   ON tasks FOR SELECT USING (true);
CREATE POLICY "Anyone insert tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update tasks" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Anyone delete tasks" ON tasks FOR DELETE USING (true);

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO tasks (title, description, status, priority, assigned_to, due_date, category) VALUES
  ('Vérifier équipements accrobranche', 'Inspection complète des harnais et mousquetons avant saison estivale.', 'À faire', 'Haute', 'Amine Trabelsi', '2025-06-18', 'Maintenance'),
  ('Mettre à jour les tarifs été', 'Réviser les prix des packs pour la haute saison.', 'En cours', 'Moyenne', 'Sarra Ben Salah', '2025-06-20', 'Gestion'),
  ('Appeler fournisseur paintball', '', 'À faire', 'Basse', 'Admin Yakoo', '2025-06-25', 'Achats'),
  ('Répondre aux avis clients en attente', '', 'En cours', 'Haute', 'Lina Mansouri', '2025-06-16', 'Service client'),
  ('Mettre à jour photos activités', '', 'Terminé', 'Moyenne', 'Amine Trabelsi', '2025-06-15', 'Marketing'),
  ('Réunion équipe moniteurs', '', 'Terminé', 'Haute', 'Admin Yakoo', '2025-06-14', 'RH')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- 5. SUPPORT TICKETS TABLE
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS support_tickets (
    id TEXT PRIMARY KEY,  -- e.g. "TKT-001"
    subject TEXT NOT NULL,
    client TEXT NOT NULL,
    email TEXT NOT NULL,
    category TEXT DEFAULT 'Information',
    priority TEXT DEFAULT 'Moyenne' CHECK (priority IN ('Haute','Moyenne','Basse')),
    status TEXT DEFAULT 'Ouvert' CHECK (status IN ('Ouvert','En cours','Résolu','Fermé')),
    description TEXT DEFAULT '',
    assigned_to TEXT DEFAULT '',
    messages JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tickets"   ON support_tickets FOR SELECT USING (true);
CREATE POLICY "Anyone insert tickets" ON support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update tickets" ON support_tickets FOR UPDATE USING (true);
CREATE POLICY "Anyone delete tickets" ON support_tickets FOR DELETE USING (true);

DROP TRIGGER IF EXISTS update_tickets_updated_at ON support_tickets;
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO support_tickets (id, subject, client, email, category, priority, status, description, assigned_to, messages) VALUES
  ('TKT-001','Problème confirmation réservation R-0041','Sonia Mrad','sonia@email.com','Réservation','Haute','Ouvert','Je n''ai pas reçu de confirmation par email pour ma réservation kayak.','Lina Mansouri','[{"from":"Sonia Mrad","text":"Bonjour, ma réservation R-0041 n''a pas été confirmée.","time":"14 Jun 09:15","isAdmin":false},{"from":"Lina Mansouri","text":"Bonjour Sonia, nous vérifions cela immédiatement.","time":"14 Jun 10:30","isAdmin":true}]'),
  ('TKT-002','Demande de remboursement','Leila Zouari','leila@email.com','Paiement','Haute','En cours','Suite à l''annulation de ma réservation R-0039, je souhaite être remboursée.','','[]'),
  ('TKT-003','Question sur les packs disponibles','Youssef Ben Amor','youssef@email.com','Information','Basse','Résolu','Quelles activités sont incluses dans le pack Bronze?','Admin Yakoo','[]'),
  ('TKT-004','Site inaccessible sur mobile','Rachid Melliti','rachid@email.com','Technique','Moyenne','En cours','Le site ne s''affiche pas correctement sur iPhone Safari.','Amine Trabelsi','[]'),
  ('TKT-005','Modification date réservation','Fatma Ben Youssef','fatma@email.com','Réservation','Moyenne','Fermé','Je voudrais changer la date de ma réservation pour la semaine suivante.','','[]')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- 6. LOYALTY CLIENTS TABLE
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS loyalty_clients (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    points INTEGER DEFAULT 0,
    total_spent NUMERIC DEFAULT 0,
    reservations INTEGER DEFAULT 0,
    last_activity TEXT DEFAULT '',
    joined TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE loyalty_clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read loyalty"   ON loyalty_clients FOR SELECT USING (true);
CREATE POLICY "Anyone insert loyalty" ON loyalty_clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update loyalty" ON loyalty_clients FOR UPDATE USING (true);
CREATE POLICY "Anyone delete loyalty" ON loyalty_clients FOR DELETE USING (true);

DROP TRIGGER IF EXISTS update_loyalty_updated_at ON loyalty_clients;
CREATE TRIGGER update_loyalty_updated_at BEFORE UPDATE ON loyalty_clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ──────────────────────────────────────────────────────────────────
-- 7. SERVICES TABLE
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT DEFAULT '🎯',
    category TEXT DEFAULT 'Aventure',
    description TEXT DEFAULT '',
    price_from NUMERIC DEFAULT 0,
    price_to NUMERIC,
    duration TEXT DEFAULT '',
    min_group INTEGER DEFAULT 1,
    max_group INTEGER,
    active BOOLEAN DEFAULT true,
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services"   ON services FOR SELECT USING (true);
CREATE POLICY "Anyone insert services" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update services" ON services FOR UPDATE USING (true);
CREATE POLICY "Anyone delete services" ON services FOR DELETE USING (true);

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO services (name, icon, category, description, price_from, price_to, duration, min_group, max_group, active, tags) VALUES
  ('Accrobranche & Escalade','🌲','Aventure','Parcours acrobatiques certifiés CE dans un cadre naturel. Moniteurs diplômés, équipements fournis, niveaux débutant à expert.',25,45,'2h–4h',5,40,true,'["Famille","Enfants","Adrénaline"]'),
  ('Kayak & Sports Nautiques','🚣','Aventure','Descente en kayak solo et double, canoë, activités nautiques encadrées. Gilets et pagaies fournis.',35,60,'2h–Journée',4,null,true,'["Eau","Nature"]'),
  ('Paintball Combat','🎯','Combat & Jeux','Terrain de paintball professionnel homologué. Masques, gilets et billes inclus. Scenarios variés.',40,80,'2h–4h',8,30,true,'["Groupe","Fun","Combat"]'),
  ('Team Building Corporate','🤝','Entreprise','Activités de cohésion d''équipe sur-mesure pour entreprises. Devis personnalisé selon vos objectifs RH.',150,null,'Journée complète',15,100,true,'["RH","Corporate","Sur-mesure"]'),
  ('Tyrolienne & Zip-line','🪂','Aventure','Glissade sur câble à 200m de hauteur avec vue panoramique. Système de freinage magnétique automatique.',30,45,'1h–2h',3,25,true,'["Sensations","Altitude"]'),
  ('Hébergement & Camping','⛺','Hébergement','Nuitées en tentes équipées ou bungalows. Repas inclus, feu de camp, animations nocturnes.',80,150,'1–3 nuits',4,null,true,'["Nuit","Nature","Famille"]'),
  ('Anniversaires & Célébrations','🎂','Événements','Packages anniversaire clé en main : activités, décoration, gâteau, animation. Formules enfants et adultes.',45,120,'3h–5h',10,50,true,'["Fête","Famille","Sur-mesure"]'),
  ('Formation & Séminaires','📚','Entreprise','Salles de formation équipées, espaces outdoor pour ateliers pratiques. Hébergement disponible.',200,null,'1–3 jours',10,null,false,'["Formation","Corporate"]')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- 8. ADMIN USERS TABLE (internal staff)
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT DEFAULT '',
    role TEXT DEFAULT 'Lecteur' CHECK (role IN ('Super Admin','Admin','Éditeur','Modérateur','Lecteur')),
    status TEXT DEFAULT 'Actif' CHECK (status IN ('Actif','Inactif','Suspendu')),
    last_login TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read admin_users"   ON admin_users FOR SELECT USING (true);
CREATE POLICY "Anyone insert admin_users" ON admin_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update admin_users" ON admin_users FOR UPDATE USING (true);
CREATE POLICY "Anyone delete admin_users" ON admin_users FOR DELETE USING (true);

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO admin_users (name, email, phone, role, status, last_login) VALUES
  ('Admin Yakoo','admin@yakoo.tn','+216 71 234 567','Super Admin','Actif','Aujourd''hui, 09:14'),
  ('Sarra Ben Salah','sarra@yakoo.tn','+216 55 234 567','Admin','Actif','Hier, 14:32'),
  ('Amine Trabelsi','amine@yakoo.tn','+216 22 987 654','Éditeur','Actif','12 Jun 2025'),
  ('Lina Mansouri','lina@yakoo.tn','+216 98 765 432','Modérateur','Actif','10 Jun 2025'),
  ('Khalil Ben Romdhane','khalil@yakoo.tn','+216 71 543 210','Éditeur','Suspendu','01 Jun 2025'),
  ('Yasmine Chaabane','yasmine@yakoo.tn','+216 29 876 543','Lecteur','Inactif','22 Mai 2025')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- 9. CONTACTS TABLE (admin contact list — staff/clients/suppliers)
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_contacts (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    type TEXT DEFAULT 'Client' CHECK (type IN ('Client','Fournisseur','Moniteur','Staff','Partenaire')),
    company TEXT DEFAULT '',
    role TEXT DEFAULT '',
    address TEXT DEFAULT '',
    tags JSONB DEFAULT '[]',
    whatsapp TEXT DEFAULT '',
    website TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    last_contact TEXT DEFAULT '',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE admin_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read admin_contacts"   ON admin_contacts FOR SELECT USING (true);
CREATE POLICY "Anyone insert admin_contacts" ON admin_contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update admin_contacts" ON admin_contacts FOR UPDATE USING (true);
CREATE POLICY "Anyone delete admin_contacts" ON admin_contacts FOR DELETE USING (true);

DROP TRIGGER IF EXISTS update_admin_contacts_updated_at ON admin_contacts;
CREATE TRIGGER update_admin_contacts_updated_at BEFORE UPDATE ON admin_contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO admin_contacts (name, email, phone, type, company, role, last_contact, tags, address, whatsapp, notes) VALUES
  ('Karim Benali', 'karim.benali@gmail.com', '+216 22 345 678', 'Client', 'TechCorp SA', 'Directeur RH', '15 Jun 2025', '["VIP", "Récurrent"]', 'Av. Habib Bourguiba, Tunis', '+216 22 345 678', 'Client fidèle, commande régulièrement des team buildings.'),
  ('Sonia Mrad', 'sonia.mrad@outlook.com', '+216 55 987 654', 'Client', '', '', '14 Jun 2025', '["Nouveau"]', 'Sousse, Tunisie', '', ''),
  ('Mohamed Ferjani', 'm.ferjani@equipsport.tn', '+216 71 456 789', 'Fournisseur', 'EquipSport TN', 'Commercial', '10 Jun 2025', '["Matériels"]', '', '', 'Fournisseur principal pour les équipements paintball et accrobranche.'),
  ('Yasmine Gafsi', 'ygafsi@aventura.tn', '+216 98 654 321', 'Partenaire', 'Aventura Voyages', 'Directrice', '08 Jun 2025', '["Tourisme"]', '', '', 'Partenariat pour les groupes touristiques, commission 10%'),
  ('Amine Trabelsi', 'amine.tr@yakoo.tn', '+216 22 987 654', 'Moniteur', '', 'Moniteur Accrobranche', '15 Jun 2025', '["Certifié", "Temps plein"]', 'La Marsa, Tunis', '', ''),
  ('Lina Mansouri', 'lina.m@yakoo.tn', '+216 98 765 432', 'Staff', '', 'Chargée de réservations', '15 Jun 2025', '["Admin"]', '', '', '')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- 10. ABOUT PILLARS (public site About section cards)
--     (table already exists in schema, open RLS + seed)
-- ──────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Pillars viewable by everyone" ON about_pillars;
DROP POLICY IF EXISTS "Admins manage pillars" ON about_pillars;

CREATE POLICY "Anyone read pillars"   ON about_pillars FOR SELECT USING (true);
CREATE POLICY "Anyone insert pillars" ON about_pillars FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update pillars" ON about_pillars FOR UPDATE USING (true);
CREATE POLICY "Anyone delete pillars" ON about_pillars FOR DELETE USING (true);

INSERT INTO about_pillars (title, description, icon_name, display_order) VALUES
  ('Sécurité absolue', 'Tous nos encadrants sont certifiés. Équipements homologués et contrôlés avant chaque session.', 'Shield', 1),
  ('En pleine nature', '3 hectares de parc forestier préservé. Un cadre naturel unique à seulement quelques minutes de Tunis.', 'Trees', 2),
  ('Éco-responsable', 'Engagement fort pour la préservation de l''environnement naturel et des espèces locales.', 'Leaf', 3),
  ('Adrénaline garantie', '22 activités conçues pour dépasser vos limites et créer des souvenirs inoubliables.', 'Zap', 4)
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- 11. STATISTICS (public site hero stats)
--     (table already exists, open RLS + seed)
-- ──────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Stats viewable by everyone" ON statistics;
DROP POLICY IF EXISTS "Admins manage stats" ON statistics;

CREATE POLICY "Anyone read stats"   ON statistics FOR SELECT USING (true);
CREATE POLICY "Anyone insert stats" ON statistics FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update stats" ON statistics FOR UPDATE USING (true);
CREATE POLICY "Anyone delete stats" ON statistics FOR DELETE USING (true);

INSERT INTO statistics (target_value, suffix, label) VALUES
  (500, '+', 'Groupes accueillis'),
  (22,  '',  'Activités & Animations'),
  (3,   'ha','Parc naturel préservé'),
  (98,  '%', 'Clients satisfaits')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- 12. TESTIMONIALS (public site reviews carousel)
--     NB: "reviews" table already exists — map TESTIMONIALS to it
-- ──────────────────────────────────────────────────────────────────
-- Add extra columns to reviews if they don't exist
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS company TEXT DEFAULT '';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS activity TEXT DEFAULT '';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS img TEXT DEFAULT '';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#F5A623';

-- Open reviews table RLS for public
DROP POLICY IF EXISTS "Reviews viewable by everyone" ON reviews;
DROP POLICY IF EXISTS "Admins manage reviews" ON reviews;

CREATE POLICY "Anyone read reviews"   ON reviews FOR SELECT USING (true);
CREATE POLICY "Anyone insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Anyone delete reviews" ON reviews FOR DELETE USING (true);

-- ──────────────────────────────────────────────────────────────────
-- 13. SOCIAL MEDIA SETTINGS (SocialPage tokens/config)
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS social_settings (
    id BIGSERIAL PRIMARY KEY,
    platform TEXT UNIQUE NOT NULL,  -- 'instagram', 'facebook', etc.
    token TEXT DEFAULT '',
    page_id TEXT DEFAULT '',
    enabled BOOLEAN DEFAULT true,
    auto_post BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE social_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read social"   ON social_settings FOR SELECT USING (true);
CREATE POLICY "Anyone insert social" ON social_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update social" ON social_settings FOR UPDATE USING (true);
CREATE POLICY "Anyone delete social" ON social_settings FOR DELETE USING (true);

DROP TRIGGER IF EXISTS update_social_updated_at ON social_settings;
CREATE TRIGGER update_social_updated_at BEFORE UPDATE ON social_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO social_settings (platform, token, page_id, enabled, auto_post) VALUES
  ('instagram', 'IGQWRPxxxxxxxxxxx', '', true, true),
  ('facebook',  'EAAxxxxxxxxxx',     'yakooevents', true, false)
ON CONFLICT (platform) DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- DONE — All tables created and seeded
-- ──────────────────────────────────────────────────────────────────
