-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Public photos are viewable by everyone" 
ON photos FOR SELECT 
USING (true);

-- Create policy to allow authenticated users to insert their own photos
CREATE POLICY "Users can insert their own photos" 
ON photos FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own photos
CREATE POLICY "Users can update their own photos" 
ON photos FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own photos
CREATE POLICY "Users can delete their own photos" 
ON photos FOR DELETE 
USING (auth.uid() = user_id); 