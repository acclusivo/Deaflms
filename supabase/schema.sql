-- Deaf LMS Supabase PostgreSQL Schema
-- Generated: 2026-09-16
-- Zero Auditory Dependency / K-12 DHH Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    grade_level TEXT,
    avatar_url TEXT,
    total_stars INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    grade_level TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Reading & Literacy', 'Digital Literacy', 'STEM', 'Everyday Signs')),
    thumbnail_url TEXT,
    teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT FALSE,
    duration_minutes INTEGER DEFAULT 30,
    icon_name TEXT DEFAULT 'BookOpen',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    lesson_type TEXT NOT NULL CHECK (lesson_type IN ('standard_lesson', 'interactive_storybook', 'digital_simulation')),
    description TEXT,
    sign_video_url TEXT,
    duration_seconds INTEGER DEFAULT 180,
    story_pages JSONB DEFAULT '[]'::jsonb,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Vocabulary Bank
CREATE TABLE IF NOT EXISTS vocabulary_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    text_word TEXT NOT NULL,
    picture_url TEXT NOT NULL,
    sign_video_url TEXT NOT NULL,
    fingerspell_text TEXT,
    category TEXT,
    description_tips TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Worksheets Table
CREATE TABLE IF NOT EXISTS worksheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'picture_to_sign',
        'sign_to_text',
        'fingerspell_builder',
        'visual_choice',
        'computer_hotspot_matching',
        'keyboard_trainer'
    )),
    instructions TEXT,
    items_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    total_points INTEGER DEFAULT 30,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Student Progress Table
CREATE TABLE IF NOT EXISTS student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    worksheet_id UUID REFERENCES worksheets(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    score INTEGER DEFAULT 0,
    stars_earned INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 1,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self update
CREATE POLICY "Profiles readable by authenticated users" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Courses: Published courses readable by everyone, teachers can create/update their own
CREATE POLICY "Public courses viewable by all" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "Teachers can insert courses" ON courses FOR INSERT WITH CHECK (auth.uid() = teacher_id);
CREATE POLICY "Teachers can update own courses" ON courses FOR UPDATE USING (auth.uid() = teacher_id);

-- Progress: Students can view and insert their own progress, teachers can view all
CREATE POLICY "Students view own progress" ON student_progress FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students record progress" ON student_progress FOR INSERT WITH CHECK (auth.uid() = student_id);
