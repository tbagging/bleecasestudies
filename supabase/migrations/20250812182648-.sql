-- Create case_studies table for persistent storage
-- Stores full case study content previously kept in localStorage

-- Helper function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Main table
CREATE TABLE IF NOT EXISTS public.case_studies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  image TEXT,
  logo TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  company TEXT NOT NULL,
  industry TEXT NOT NULL,
  file_name TEXT,
  content JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS update_case_studies_updated_at ON public.case_studies;
CREATE TRIGGER update_case_studies_updated_at
BEFORE UPDATE ON public.case_studies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Policies
-- Public (anon + authenticated) can read
DROP POLICY IF EXISTS "Public can view case studies" ON public.case_studies;
CREATE POLICY "Public can view case studies"
ON public.case_studies
FOR SELECT
TO public
USING (true);

-- Only the admin (by email) can insert/update/delete
DROP POLICY IF EXISTS "Only admin can insert case studies" ON public.case_studies;
CREATE POLICY "Only admin can insert case studies"
ON public.case_studies
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() ->> 'email') = 'tomer@blee.pro');

DROP POLICY IF EXISTS "Only admin can update case studies" ON public.case_studies;
CREATE POLICY "Only admin can update case studies"
ON public.case_studies
FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'tomer@blee.pro')
WITH CHECK ((auth.jwt() ->> 'email') = 'tomer@blee.pro');

DROP POLICY IF EXISTS "Only admin can delete case studies" ON public.case_studies;
CREATE POLICY "Only admin can delete case studies"
ON public.case_studies
FOR DELETE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'tomer@blee.pro');