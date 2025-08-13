-- Add order column to case_studies table for drag-and-drop reordering
ALTER TABLE public.case_studies 
ADD COLUMN display_order INTEGER;

-- Set initial order based on current created_at order
UPDATE public.case_studies 
SET display_order = row_number() OVER (ORDER BY created_at DESC);

-- Add constraint to ensure display_order is not null for new records
ALTER TABLE public.case_studies 
ALTER COLUMN display_order SET NOT NULL;