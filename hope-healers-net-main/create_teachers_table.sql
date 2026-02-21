
-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    position TEXT NOT NULL,
    image_url TEXT,
    group_name TEXT NOT NULL,
    group_level INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up RLS for teachers
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read teachers" ON teachers
    FOR SELECT USING (true);

-- Allow authenticated users build access
CREATE POLICY "Allow authenticated full access teachers" ON teachers
    FOR ALL USING (auth.role() = 'authenticated');
