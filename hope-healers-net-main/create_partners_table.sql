
-- SQL for creating partners table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Create policies (modify as needed)
CREATE POLICY "Allow public read access" ON public.partners
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full access" ON public.partners
    FOR ALL USING (auth.role() = 'authenticated');

-- Optional: Add to admin_sidebar_items if it exists
-- INSERT INTO admin_sidebar_items (label, href, icon_name, sort_order)
-- VALUES ('พันธมิตร & MOU', '/admin/partners', 'Handshake', 10);
