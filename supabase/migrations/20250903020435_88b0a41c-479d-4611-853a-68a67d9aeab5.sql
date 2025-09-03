-- Fix security vulnerability: Restrict page_content modifications to admin only
-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can insert page content" ON public.page_content;
DROP POLICY IF EXISTS "Anyone can update page content" ON public.page_content;

-- Create secure admin-only policies for INSERT and UPDATE
CREATE POLICY "Only admin can insert page content" 
ON public.page_content 
FOR INSERT 
WITH CHECK (((SELECT auth.jwt() AS jwt) ->> 'email'::text) = 'tomer@blee.pro'::text);

CREATE POLICY "Only admin can update page content" 
ON public.page_content 
FOR UPDATE 
USING (((SELECT auth.jwt() AS jwt) ->> 'email'::text) = 'tomer@blee.pro'::text)
WITH CHECK (((SELECT auth.jwt() AS jwt) ->> 'email'::text) = 'tomer@blee.pro'::text);

-- Keep public read access (SELECT policy remains unchanged)
-- Policy "Page content is publicly readable" already exists and is correct