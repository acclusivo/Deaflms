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

-- Helper function: Securely read role from profiles
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = user_uuid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 1. Profiles Table Policies
-- Any authenticated user can view basic profile cards
CREATE POLICY "Profiles viewable by authenticated users" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (true);

-- Users can only update their own profile; role cannot be altered by non-admins
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    (role = (SELECT role FROM profiles WHERE id = auth.uid()) OR get_user_role(auth.uid()) = 'admin')
  );

-- Admins can update any profile (role verification, roster assignment)
CREATE POLICY "Admins have full profile update authority" 
  ON profiles FOR ALL 
  TO authenticated 
  USING (get_user_role(auth.uid()) = 'admin');

-- 2. Courses Table Policies
-- Published courses readable by everyone; unapproved drafts only by author or admin
CREATE POLICY "Published courses viewable by all" 
  ON courses FOR SELECT 
  USING (is_published = true OR auth.uid() = teacher_id OR get_user_role(auth.uid()) = 'admin');

-- Only teachers and admins can create courses
CREATE POLICY "Teachers can insert courses" 
  ON courses FOR INSERT 
  TO authenticated 
  WITH CHECK (
    (get_user_role(auth.uid()) = 'teacher' AND auth.uid() = teacher_id) OR
    get_user_role(auth.uid()) = 'admin'
  );

-- Teachers can only update their own courses; Admins can moderate any course
CREATE POLICY "Teachers update own courses, Admins moderate all" 
  ON courses FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = teacher_id OR get_user_role(auth.uid()) = 'admin');

-- 3. Student Progress & Submissions Table Policies
-- Students can ONLY view their own records (Anti-IDOR)
CREATE POLICY "Students view only own progress" 
  ON student_progress FOR SELECT 
  TO authenticated 
  USING (
    auth.uid() = student_id OR 
    get_user_role(auth.uid()) = 'teacher' OR 
    get_user_role(auth.uid()) = 'admin'
  );

-- Students can only insert progress records with their own authenticated ID
CREATE POLICY "Students record only own progress" 
  ON student_progress FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = student_id AND get_user_role(auth.uid()) = 'student');

-- Teachers and Admins cannot alter student star achievements fraudulently
CREATE POLICY "Students update own quiz progress" 
  ON student_progress FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = student_id);
