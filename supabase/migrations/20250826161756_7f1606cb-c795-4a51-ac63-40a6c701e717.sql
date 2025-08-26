-- Update RLS policies for page_content to be more permissive
-- Allow all authenticated users to insert and update page content
DROP POLICY IF EXISTS "Authenticated users can insert page content" ON page_content;
DROP POLICY IF EXISTS "Authenticated users can update page content" ON page_content;

-- More permissive policies for page content management
CREATE POLICY "Anyone can insert page content" ON page_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update page content" ON page_content FOR UPDATE USING (true);