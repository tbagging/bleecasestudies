-- Create page_content table for storing website content
CREATE TABLE public.page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key TEXT NOT NULL UNIQUE,
  content_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is website content)
CREATE POLICY "Page content is publicly readable" 
ON public.page_content 
FOR SELECT 
USING (true);

-- Create policies for authenticated users to manage content
CREATE POLICY "Authenticated users can insert page content" 
ON public.page_content 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update page content" 
ON public.page_content 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_page_content_updated_at
BEFORE UPDATE ON public.page_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content
INSERT INTO public.page_content (content_key, content_data) VALUES 
('hero', '{
  "title": "Strategic transformation from within",
  "subtitle": "Real change, sparked by your employees"
}'::jsonb),
('about', '{
  "heading": "Change from within the system",
  "description": "We are not consultants. We are not facilitators. We embed inside organizations to activate clarity, ownership, and momentum that drives action.",
  "secondaryDescription": "Our approach transforms internal complexity into executable results. Through focused engagement, we help teams move from paralysis to progress, within 24 hours.",
  "clarityTitle": "Clarity",
  "clarityDescription": "Structured communication that cuts through complexity and drives aligned understanding.",
  "engagementTitle": "Engagement", 
  "engagementDescription": "Activating people within the system to own solutions and drive change forward.",
  "momentumTitle": "Momentum",
  "momentumDescription": "Creating urgency and direction that leads to immediate execution and results.",
  "buttonText": "Start Your Transformation"
}'::jsonb),
('cta', '{
  "primary": "Let''s talk",
  "secondary": "Request full case studies"
}'::jsonb),
('footer', '{
  "description": "BLEE is here to help your organization unlock its potential and drive meaningful change from within. Let''s make 2025 the year of strategic transformation.",
  "buttonText": "Start Your Transformation",
  "copyright": "© 2025 BLEE. Empowering organizations to transform from within."
}'::jsonb);