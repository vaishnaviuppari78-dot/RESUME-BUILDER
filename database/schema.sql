-- Create profiles table linked to users
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    job_title VARCHAR(100),
    phone VARCHAR(20),
    website VARCHAR(255),
    summary TEXT,
    skills TEXT, -- Comma separated values
    education TEXT, -- Structured text layout
    experience TEXT, -- Structured text layout
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for fast lookups by email identifier
CREATE INDEX IF NOT EXISTS idx_resumes_user_email ON public.resumes(user_email);
