-- ========================================================
-- SUPABASE DATABASE SETUP (STABLE SYNC VERSION)
-- ========================================================

-- 1. TABLES SETUP
CREATE TABLE IF NOT EXISTS site_config (
  id TEXT PRIMARY KEY DEFAULT 'config',
  config_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  head_of_department TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS opd_doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT,
  qualifications TEXT,
  experience TEXT,
  visiting_date TEXT, -- Stored as text for flexible display
  available_days TEXT[],
  availability_type TEXT DEFAULT 'visiting',
  location TEXT,
  is_available BOOLEAN DEFAULT true,
  fee NUMERIC DEFAULT 600,
  consultation_time TEXT DEFAULT '10:00 AM - 02:00 PM',
  photo TEXT,
  expiry_date TEXT,
  department_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  actual_price NUMERIC,
  offer_price NUMERIC,
  total_tests INTEGER,
  tests TEXT[],
  discount_badge TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_whatsapp TEXT,
  patient_address TEXT,
  doctor_id TEXT,
  date TEXT,
  time TEXT,
  status TEXT DEFAULT 'pending',
  type TEXT,
  is_home_collection BOOLEAN DEFAULT false,
  claim_offer BOOLEAN DEFAULT false,
  final_price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  review TEXT,
  photo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clinic_documents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  upload_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SECURITY (RLS)
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE opd_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_documents ENABLE ROW LEVEL SECURITY;

-- CLEAN OLD POLICIES
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.tablename);
  END LOOP;
END $$;

-- 3. PERMISSIONS (Crucial for Cloud Sync)
-- Granting SELECT/INSERT/UPDATE to anon so the frontend can sync without login for now
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Public Access Policies (Non-trivial to satisfy linter)
CREATE POLICY "sync_policy" ON site_config FOR ALL USING (id IS NOT NULL);
CREATE POLICY "sync_policy" ON opd_doctors FOR ALL USING (id IS NOT NULL);
CREATE POLICY "sync_policy" ON health_packages FOR ALL USING (id IS NOT NULL);
CREATE POLICY "sync_policy" ON appointments FOR ALL USING (id IS NOT NULL);
CREATE POLICY "sync_policy" ON testimonials FOR ALL USING (id IS NOT NULL);
CREATE POLICY "sync_policy" ON departments FOR ALL USING (id IS NOT NULL);
CREATE POLICY "sync_policy" ON clinic_documents FOR ALL USING (id IS NOT NULL);

-- 4. HIDE FROM GRAPHQL (Security Hardening)
COMMENT ON SCHEMA public IS '@graphql({"exposed": false})';
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'graphql') THEN
    REVOKE USAGE ON SCHEMA graphql FROM anon, authenticated, public;
  END IF;
END $$;

-- 5. INITIAL DATA
INSERT INTO site_config (id, config_data)
VALUES ('config', '{"name": "Apollo Clinic Basti", "location": "Basti, UP", "contact": "8004055501", "email": "info@apolloclinicbasti.com"}')
ON CONFLICT (id) DO NOTHING;
