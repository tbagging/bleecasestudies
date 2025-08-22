-- Add visibility field to case_studies table
ALTER TABLE public.case_studies 
ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;

-- Update RLS policy to ensure public users only see visible case studies
DROP POLICY IF EXISTS "Public can view case studies" ON public.case_studies;

CREATE POLICY "Public can view visible case studies"
ON public.case_studies
FOR SELECT
USING (is_visible = true);