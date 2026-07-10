-- Create page_visits table for analytics tracking
CREATE TABLE IF NOT EXISTS public.page_visits (
  date DATE PRIMARY KEY,
  visits INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Set up RLS Policies to allow tracking and displaying analytics
CREATE POLICY "Anyone can view page visits" 
ON public.page_visits FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert page visits" 
ON public.page_visits FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update page visits" 
ON public.page_visits FOR UPDATE 
USING (true) 
WITH CHECK (true);
