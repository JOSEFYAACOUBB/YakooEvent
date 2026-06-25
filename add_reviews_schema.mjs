import fs from 'fs';
let content = fs.readFileSync('supabase/schema.sql', 'utf-8');

const reviewsTableSql = `
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
`;

const reviewsRlsSql = `
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Admins manage reviews" ON reviews FOR ALL USING (is_admin());
`;

const reviewsTriggerSql = `
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

// Insert table before RLS
if (!content.includes('CREATE TABLE reviews')) {
  content = content.replace('-- ==========================================\n-- ROW LEVEL SECURITY (RLS) POLICIES', reviewsTableSql + '\n-- ==========================================\n-- ROW LEVEL SECURITY (RLS) POLICIES');
  
  // Insert RLS before triggers
  content = content.replace('-- ==========================================\n-- FUNCTIONS & TRIGGERS', reviewsRlsSql + '\n-- ==========================================\n-- FUNCTIONS & TRIGGERS');
  
  // Insert trigger at the end
  content += reviewsTriggerSql;
  
  fs.writeFileSync('supabase/schema.sql', content);
  console.log("Updated schema.sql");
} else {
  console.log("Already updated");
}
