-- Drop existing RLS policies
DROP POLICY IF EXISTS "Only admin can delete case studies" ON public.case_studies;
DROP POLICY IF EXISTS "Only admin can insert case studies" ON public.case_studies;
DROP POLICY IF EXISTS "Only admin can update case studies" ON public.case_studies;
DROP POLICY IF EXISTS "Public can view case studies" ON public.case_studies;

-- Create optimized RLS policies using subqueries
CREATE POLICY "Public can view case studies" 
ON public.case_studies 
FOR SELECT 
USING (true);

CREATE POLICY "Only admin can insert case studies" 
ON public.case_studies 
FOR INSERT 
WITH CHECK (((select auth.jwt()) ->> 'email'::text) = 'tomer@blee.pro'::text);

CREATE POLICY "Only admin can update case studies" 
ON public.case_studies 
FOR UPDATE 
USING (((select auth.jwt()) ->> 'email'::text) = 'tomer@blee.pro'::text)
WITH CHECK (((select auth.jwt()) ->> 'email'::text) = 'tomer@blee.pro'::text);

CREATE POLICY "Only admin can delete case studies" 
ON public.case_studies 
FOR DELETE 
USING (((select auth.jwt()) ->> 'email'::text) = 'tomer@blee.pro'::text);