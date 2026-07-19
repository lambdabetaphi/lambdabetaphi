-- =================================================================
-- LAMBDA BETA PHI - SOVEREIGN PRIVATE PORTAL NEW SUPABASE SCHEMA
-- =================================================================
-- Run this complete script in your Supabase SQL Editor to provision
-- all tables, indexes, and permissive RLS policies.

-- Enable UUID-OSSP extension (optional but useful)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to ensure a clean slate
DROP TABLE IF EXISTS public.chapters CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.post_images CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.members CASCADE;

-- 1. Create Chapters Table
CREATE TABLE public.chapters (
    id TEXT PRIMARY KEY,
    chapter_name TEXT NOT NULL,
    province TEXT,
    city TEXT
);

-- Enable Row Level Security
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

-- 2. Create Members Table
CREATE TABLE public.members (
    id TEXT PRIMARY KEY, -- Auth UUID or custom unique key
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    chapter TEXT,
    batch TEXT,
    position TEXT,
    role TEXT NOT NULL DEFAULT 'Member', -- Admin, Officer, Member
    status TEXT NOT NULL DEFAULT 'Pending', -- Pending, Approved, Suspended
    avatar_url TEXT,
    phone TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 3. Create Posts Table
CREATE TABLE public.posts (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 4. Create PostImages Table
CREATE TABLE public.post_images (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.post_images ENABLE ROW LEVEL SECURITY;

-- 5. Create Comments Table
CREATE TABLE public.comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 6. Create Likes Table
CREATE TABLE public.likes (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_post_member_like UNIQUE (post_id, member_id)
);

-- Enable Row Level Security
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- 7. Create Announcements Table
CREATE TABLE public.announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- 8. Create Events Table
CREATE TABLE public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    event_date TEXT NOT NULL,
    created_by TEXT REFERENCES public.members(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 9. Create Notifications Table
CREATE TABLE public.notifications (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;


-- =================================================================
-- ROW LEVEL SECURITY POLICIES (RLS) - PERMISSIVE PUBLIC POLICIES
-- =================================================================

-- Chapters Policies
CREATE POLICY "Allow public read of chapters" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Allow public insert of chapters" ON public.chapters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of chapters" ON public.chapters FOR UPDATE USING (true);
CREATE POLICY "Allow public delete of chapters" ON public.chapters FOR DELETE USING (true);

-- Members Policies
CREATE POLICY "Allow public read of members" ON public.members FOR SELECT USING (true);
CREATE POLICY "Allow public insert of members" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of members" ON public.members FOR UPDATE USING (true);
CREATE POLICY "Allow public delete of members" ON public.members FOR DELETE USING (true);

-- Posts Policies
CREATE POLICY "Allow public read of posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert of posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of posts" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete of posts" ON public.posts FOR DELETE USING (true);

-- PostImages Policies
CREATE POLICY "Allow public read of post_images" ON public.post_images FOR SELECT USING (true);
CREATE POLICY "Allow public insert of post_images" ON public.post_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of post_images" ON public.post_images FOR UPDATE USING (true);
CREATE POLICY "Allow public delete of post_images" ON public.post_images FOR DELETE USING (true);

-- Comments Policies
CREATE POLICY "Allow public read of comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert of comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of comments" ON public.comments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete of comments" ON public.comments FOR DELETE USING (true);

-- Likes Policies
CREATE POLICY "Allow public read of likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Allow public insert of likes" ON public.likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of likes" ON public.likes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete of likes" ON public.likes FOR DELETE USING (true);

-- Announcements Policies
CREATE POLICY "Allow public read of announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Allow public insert of announcements" ON public.announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of announcements" ON public.announcements FOR UPDATE USING (true);
CREATE POLICY "Allow public delete of announcements" ON public.announcements FOR DELETE USING (true);

-- Events Policies
CREATE POLICY "Allow public read of events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow public insert of events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Allow public delete of events" ON public.events FOR DELETE USING (true);

-- Notifications Policies
CREATE POLICY "Allow public read of notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert of notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of notifications" ON public.notifications FOR UPDATE USING (true);
CREATE POLICY "Allow public delete of notifications" ON public.notifications FOR DELETE USING (true);
