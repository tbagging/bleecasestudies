-- Add order column to case_studies table for drag-and-drop reordering
ALTER TABLE public.case_studies 
ADD COLUMN display_order INTEGER;

-- Set initial order values using a DO block
DO $$
DECLARE
    rec RECORD;
    i INTEGER := 0;
BEGIN
    FOR rec IN SELECT id FROM public.case_studies ORDER BY created_at DESC LOOP
        i := i + 1;
        UPDATE public.case_studies SET display_order = i WHERE id = rec.id;
    END LOOP;
END $$;

-- Add constraint to ensure display_order is not null for new records
ALTER TABLE public.case_studies 
ALTER COLUMN display_order SET NOT NULL;