-- =====================================================
-- CLEAN OLD TABLES
-- =====================================================

DROP TABLE IF EXISTS public.site_config CASCADE;
DROP TABLE IF EXISTS public.departments CASCADE;
DROP TABLE IF EXISTS public.opd_doctors CASCADE;
DROP TABLE IF EXISTS public.health_packages CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.clinic_documents CASCADE;
DROP TABLE IF EXISTS public.media CASCADE;
DROP TABLE IF EXISTS public.message_logs CASCADE;
DROP TABLE IF EXISTS public.staff_accounts CASCADE;
DROP TABLE IF EXISTS public.templates CASCADE;

-- =====================================================
-- ENABLE UUID EXTENSION
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- SITE CONFIG
-- =====================================================

CREATE TABLE public.site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_data JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- DEPARTMENTS
-- =====================================================

CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  head_of_department TEXT,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- OPD DOCTORS
-- =====================================================

CREATE TABLE public.opd_doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT,
  qualifications TEXT,
  experience TEXT,
  visiting_date TEXT,
  available_days TEXT[],
  availability_type TEXT DEFAULT 'visiting',
  location TEXT,
  is_available BOOLEAN DEFAULT true,
  fee NUMERIC DEFAULT 600,
  consultation_time TEXT DEFAULT '10:00 AM - 02:00 PM',
  photo TEXT,
  expiry_date TEXT,
  department_id UUID,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- HEALTH PACKAGES
-- =====================================================

CREATE TABLE public.health_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  actual_price NUMERIC,
  offer_price NUMERIC,
  total_tests INTEGER,
  tests TEXT[],
  discount_badge TEXT,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- APPOINTMENTS
-- =====================================================

CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_whatsapp TEXT,
  patient_address TEXT,
  doctor_id UUID,
  date TEXT,
  time TEXT,
  status TEXT DEFAULT 'pending',
  type TEXT,
  is_home_collection BOOLEAN DEFAULT false,
  claim_offer BOOLEAN DEFAULT false,
  final_price NUMERIC,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TESTIMONIALS
-- =====================================================

CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  review TEXT,
  photo TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- CLINIC DOCUMENTS
-- =====================================================

CREATE TABLE public.clinic_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  upload_date TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- MEDIA (UPLOADS & POSTERS)
-- =====================================================

CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- MESSAGE LOGS (MESSAGES)
-- =====================================================

CREATE TABLE public.message_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'sent',
  template_type TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- STAFF ACCOUNTS
-- =====================================================

CREATE TABLE public.staff_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'staff',
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TEMPLATES
-- =====================================================

CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'whatsapp',
  placeholder_keys TEXT[],
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- ENABLE RLS
-- =====================================================

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opd_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- DROP OLD POLICIES
-- =====================================================

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
  )
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.%I',
      r.policyname,
      r.tablename
    );
  END LOOP;
END $$;

-- =====================================================
-- GRANTS
-- =====================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT
SELECT,
INSERT,
UPDATE,
DELETE
ON ALL TABLES IN SCHEMA public
TO anon, authenticated;

-- =====================================================
-- SITE CONFIG POLICIES
-- =====================================================

DROP POLICY IF EXISTS "site_config_select" ON public.site_config;
DROP POLICY IF EXISTS "site_config_insert" ON public.site_config;
DROP POLICY IF EXISTS "site_config_update" ON public.site_config;
DROP POLICY IF EXISTS "site_config_delete" ON public.site_config;
DROP POLICY IF EXISTS "site_config_select_policy" ON public.site_config;
DROP POLICY IF EXISTS "site_config_insert_policy" ON public.site_config;
DROP POLICY IF EXISTS "site_config_update_policy" ON public.site_config;
DROP POLICY IF EXISTS "site_config_delete_policy" ON public.site_config;

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_config_select_policy"
ON public.site_config
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "site_config_insert_policy"
ON public.site_config
FOR INSERT
TO anon, authenticated
WITH CHECK (id IS NOT NULL);

CREATE POLICY "site_config_update_policy"
ON public.site_config
FOR UPDATE
TO anon, authenticated
USING (id IS NOT NULL)
WITH CHECK (id IS NOT NULL);

CREATE POLICY "site_config_delete_policy"
ON public.site_config
FOR DELETE
TO anon, authenticated
USING (id IS NOT NULL);

-- =====================================================
-- DEPARTMENTS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "departments_select" ON public.departments;
DROP POLICY IF EXISTS "departments_insert" ON public.departments;
DROP POLICY IF EXISTS "departments_update" ON public.departments;
DROP POLICY IF EXISTS "departments_delete" ON public.departments;

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "departments_select"
ON public.departments
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "departments_insert"
ON public.departments
FOR INSERT
TO anon, authenticated
WITH CHECK (name IS NOT NULL);

CREATE POLICY "departments_update"
ON public.departments
FOR UPDATE
TO anon, authenticated
USING (id IS NOT NULL)
WITH CHECK (name IS NOT NULL);

CREATE POLICY "departments_delete"
ON public.departments
FOR DELETE
TO anon, authenticated
USING (id IS NOT NULL);

-- =====================================================
-- OPD DOCTORS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "opd_doctors_select" ON public.opd_doctors;
DROP POLICY IF EXISTS "opd_doctors_insert" ON public.opd_doctors;
DROP POLICY IF EXISTS "opd_doctors_update" ON public.opd_doctors;
DROP POLICY IF EXISTS "opd_doctors_delete" ON public.opd_doctors;

ALTER TABLE public.opd_doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "opd_doctors_select"
ON public.opd_doctors
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "opd_doctors_insert"
ON public.opd_doctors
FOR INSERT
TO anon, authenticated
WITH CHECK (name IS NOT NULL);

CREATE POLICY "opd_doctors_update"
ON public.opd_doctors
FOR UPDATE
TO anon, authenticated
USING (id IS NOT NULL)
WITH CHECK (name IS NOT NULL);

CREATE POLICY "opd_doctors_delete"
ON public.opd_doctors
FOR DELETE
TO anon, authenticated
USING (id IS NOT NULL);

-- =====================================================
-- HEALTH PACKAGES POLICIES
-- =====================================================

DROP POLICY IF EXISTS "health_packages_select" ON public.health_packages;
DROP POLICY IF EXISTS "health_packages_insert" ON public.health_packages;
DROP POLICY IF EXISTS "health_packages_update" ON public.health_packages;
DROP POLICY IF EXISTS "health_packages_delete" ON public.health_packages;

ALTER TABLE public.health_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "health_packages_select"
ON public.health_packages
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "health_packages_insert"
ON public.health_packages
FOR INSERT
TO anon, authenticated
WITH CHECK (name IS NOT NULL);

CREATE POLICY "health_packages_update"
ON public.health_packages
FOR UPDATE
TO anon, authenticated
USING (id IS NOT NULL)
WITH CHECK (name IS NOT NULL);

CREATE POLICY "health_packages_delete"
ON public.health_packages
FOR DELETE
TO anon, authenticated
USING (id IS NOT NULL);

-- =====================================================
-- APPOINTMENTS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "appointments_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_insert" ON public.appointments;
DROP POLICY IF EXISTS "appointments_update" ON public.appointments;
DROP POLICY IF EXISTS "appointments_delete" ON public.appointments;

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "appointments_select"
ON public.appointments
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "appointments_insert"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (patient_name IS NOT NULL AND patient_phone IS NOT NULL);

CREATE POLICY "appointments_update"
ON public.appointments
FOR UPDATE
TO anon, authenticated
USING (id IS NOT NULL)
WITH CHECK (id IS NOT NULL);

CREATE POLICY "appointments_delete"
ON public.appointments
FOR DELETE
TO anon, authenticated
USING (id IS NOT NULL);

-- =====================================================
-- TESTIMONIALS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "testimonials_select" ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_insert" ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_update" ON public.testimonials;
DROP POLICY IF EXISTS "testimonials_delete" ON public.testimonials;

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "testimonials_select"
ON public.testimonials
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "testimonials_insert"
ON public.testimonials
FOR INSERT
TO anon, authenticated
WITH CHECK (name IS NOT NULL);

CREATE POLICY "testimonials_update"
ON public.testimonials
FOR UPDATE
TO anon, authenticated
USING (id IS NOT NULL)
WITH CHECK (name IS NOT NULL);

CREATE POLICY "testimonials_delete"
ON public.testimonials
FOR DELETE
TO anon, authenticated
USING (id IS NOT NULL);

-- =====================================================
-- CLINIC DOCUMENTS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "clinic_documents_select" ON public.clinic_documents;
DROP POLICY IF EXISTS "clinic_documents_insert" ON public.clinic_documents;
DROP POLICY IF EXISTS "clinic_documents_update" ON public.clinic_documents;
DROP POLICY IF EXISTS "clinic_documents_delete" ON public.clinic_documents;

ALTER TABLE public.clinic_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinic_documents_select"
ON public.clinic_documents
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "clinic_documents_insert"
ON public.clinic_documents
FOR INSERT
TO anon, authenticated
WITH CHECK (name IS NOT NULL);

CREATE POLICY "clinic_documents_update"
ON public.clinic_documents
FOR UPDATE
TO anon, authenticated
USING (id IS NOT NULL)
WITH CHECK (name IS NOT NULL);

CREATE POLICY "clinic_documents_delete"
ON public.clinic_documents
FOR DELETE
TO anon, authenticated
USING (id IS NOT NULL);

-- =====================================================
-- MEDIA POLICIES
-- =====================================================

DROP POLICY IF EXISTS "media_select" ON public.media;
DROP POLICY IF EXISTS "media_insert" ON public.media;
DROP POLICY IF EXISTS "media_update" ON public.media;
DROP POLICY IF EXISTS "media_delete" ON public.media;

CREATE POLICY "media_select"
ON public.media
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "media_insert"
ON public.media
FOR INSERT
TO anon, authenticated
WITH CHECK (name IS NOT NULL);

CREATE POLICY "media_update"
ON public.media
FOR UPDATE
TO anon, authenticated
USING (id IS NOT NULL)
WITH CHECK (name IS NOT NULL);

CREATE POLICY "media_delete"
ON public.media
FOR DELETE
TO anon, authenticated
USING (id IS NOT NULL);

-- =====================================================
-- MESSAGE LOGS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "message_logs_select" ON public.message_logs;
DROP POLICY IF EXISTS "message_logs_insert" ON public.message_logs;
DROP POLICY IF EXISTS "message_logs_update" ON public.message_logs;
DROP POLICY IF EXISTS "message_logs_delete" ON public.message_logs;

CREATE POLICY "message_logs_select"
ON public.message_logs
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "message_logs_insert"
ON public.message_logs
FOR INSERT
TO anon, authenticated
WITH CHECK (recipient IS NOT NULL AND message IS NOT NULL);

CREATE POLICY "message_logs_update"
ON public.message_logs
FOR UPDATE
TO anon, authenticated
USING (id IS NOT NULL)
WITH CHECK (id IS NOT NULL);

CREATE POLICY "message_logs_delete"
ON public.message_logs
FOR DELETE
TO anon, authenticated
USING (id IS NOT NULL);

-- =====================================================
-- STAFF ACCOUNTS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "staff_accounts_select" ON public.staff_accounts;
DROP POLICY IF EXISTS "staff_accounts_insert" ON public.staff_accounts;
DROP POLICY IF EXISTS "staff_accounts_update" ON public.staff_accounts;
DROP POLICY IF EXISTS "staff_accounts_delete" ON public.staff_accounts;

CREATE POLICY "staff_accounts_select"
ON public.staff_accounts
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "staff_accounts_insert"
ON public.staff_accounts
FOR INSERT
TO anon, authenticated
WITH CHECK (name IS NOT NULL AND email IS NOT NULL);

CREATE POLICY "staff_accounts_update"
ON public.staff_accounts
FOR UPDATE
TO anon, authenticated
USING (id IS NOT NULL)
WITH CHECK (name IS NOT NULL AND email IS NOT NULL);

CREATE POLICY "staff_accounts_delete"
ON public.staff_accounts
FOR DELETE
TO anon, authenticated
USING (id IS NOT NULL);

-- =====================================================
-- TEMPLATES POLICIES
-- =====================================================

DROP POLICY IF EXISTS "templates_select" ON public.templates;
DROP POLICY IF EXISTS "templates_insert" ON public.templates;
DROP POLICY IF EXISTS "templates_update" ON public.templates;
DROP POLICY IF EXISTS "templates_delete" ON public.templates;

CREATE POLICY "templates_select"
ON public.templates
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "templates_insert"
ON public.templates
FOR INSERT
TO anon, authenticated
WITH CHECK (name IS NOT NULL AND content IS NOT NULL);

CREATE POLICY "templates_update"
ON public.templates
FOR UPDATE
TO anon, authenticated
USING (id IS NOT NULL)
WITH CHECK (name IS NOT NULL AND content IS NOT NULL);

CREATE POLICY "templates_delete"
ON public.templates
FOR DELETE
TO anon, authenticated
USING (id IS NOT NULL);

-- =====================================================
-- REALTIME
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.site_config;
ALTER PUBLICATION supabase_realtime ADD TABLE public.departments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.opd_doctors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.health_packages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
ALTER PUBLICATION supabase_realtime ADD TABLE public.clinic_documents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.media;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.staff_accounts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.templates;

-- =====================================================
-- REPLICA IDENTITY
-- =====================================================

ALTER TABLE public.site_config REPLICA IDENTITY FULL;
ALTER TABLE public.departments REPLICA IDENTITY FULL;
ALTER TABLE public.opd_doctors REPLICA IDENTITY FULL;
ALTER TABLE public.health_packages REPLICA IDENTITY FULL;
ALTER TABLE public.appointments REPLICA IDENTITY FULL;
ALTER TABLE public.testimonials REPLICA IDENTITY FULL;
ALTER TABLE public.clinic_documents REPLICA IDENTITY FULL;
ALTER TABLE public.media REPLICA IDENTITY FULL;
ALTER TABLE public.message_logs REPLICA IDENTITY FULL;
ALTER TABLE public.staff_accounts REPLICA IDENTITY FULL;
ALTER TABLE public.templates REPLICA IDENTITY FULL;

-- End of database setup. All tables fully configured.