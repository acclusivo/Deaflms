import { Course, Lesson, UserProfile, UserRole, Worksheet, StudentProgress } from './types';
import { MOCK_CURRENT_USER, MOCK_TEACHER, MOCK_ADMIN, MOCK_COURSES, MOCK_LESSONS, MOCK_WORKSHEETS } from './mock-data';
import { isSupabaseConfigured, supabase } from './supabase/client';

let inMemoryCourses: Course[] = [...MOCK_COURSES];
let inMemoryProgress: StudentProgress[] = [
  {
    id: 'prog-1',
    studentId: 'user-student-1',
    lessonId: 'lesson-hardware-1',
    worksheetId: 'ws-hardware-match',
    completed: true,
    score: 40,
    starsEarned: 3,
    completedAt: '2026-09-15T10:30:00Z',
  },
];

let inMemoryUsers: UserProfile[] = [
  MOCK_CURRENT_USER,
  MOCK_TEACHER,
  MOCK_ADMIN,
  {
    id: 'user-student-2',
    email: 'alex.student@deafacademy.edu',
    displayName: 'Alex Chen',
    role: 'student',
    gradeLevel: 'Grade 4',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    totalStars: 19,
    badgesUnlocked: ['Keyboard Star'],
  },
  {
    id: 'user-teacher-2',
    email: 'claire.morales@deafacademy.edu',
    displayName: 'Ms. Claire Morales',
    role: 'teacher',
    gradeLevel: 'Middle School STEM',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
];

export async function getCurrentUser(preferredRole?: UserRole): Promise<UserProfile> {
  if (preferredRole === 'teacher') return MOCK_TEACHER;
  if (preferredRole === 'admin') return MOCK_ADMIN;
  return MOCK_CURRENT_USER;
}

export async function getCourses(): Promise<Course[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('courses').select('*');
      if (!error && data && data.length > 0) {
        return data as Course[];
      }
    } catch (e) {
      console.warn('Supabase query failed, falling back to mock data:', e);
    }
  }
  return inMemoryCourses;
}

export async function getCourseById(id: string): Promise<Course | null> {
  const courses = await getCourses();
  return courses.find(c => c.id === id) || null;
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('lessons').select('*').eq('id', id).single();
      if (!error && data) return data as Lesson;
    } catch (e) {
      console.warn('Supabase lesson query failed, falling back to mock:', e);
    }
  }
  return MOCK_LESSONS[id] || null;
}

export async function getWorksheetById(id: string): Promise<Worksheet | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('worksheets').select('*').eq('id', id).single();
      if (!error && data) return data as Worksheet;
    } catch (e) {
      console.warn('Supabase worksheet query failed, falling back to mock:', e);
    }
  }
  return MOCK_WORKSHEETS[id] || null;
}

export async function submitWorksheetProgress(
  worksheetId: string,
  lessonId: string,
  score: number,
  starsEarned: number
): Promise<StudentProgress> {
  const newProgress: StudentProgress = {
    id: `prog-${Date.now()}`,
    studentId: MOCK_CURRENT_USER.id,
    lessonId,
    worksheetId,
    completed: true,
    score,
    starsEarned,
    completedAt: new Date().toISOString(),
  };

  inMemoryProgress.push(newProgress);
  if (MOCK_CURRENT_USER.totalStars !== undefined) {
    MOCK_CURRENT_USER.totalStars += starsEarned;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('student_progress').insert([newProgress]);
    } catch (e) {
      console.warn('Supabase progress insert failed:', e);
    }
  }

  return newProgress;
}

export async function getStudentProgress(): Promise<StudentProgress[]> {
  return inMemoryProgress;
}

export async function getPlatformKPIs() {
  return {
    totalStudents: inMemoryUsers.filter(u => u.role === 'student').length + 120,
    totalTeachers: inMemoryUsers.filter(u => u.role === 'teacher').length + 14,
    publishedCourses: inMemoryCourses.length + 8,
    signVideoHours: '48.5 hrs',
    storageUsedGb: '14.2 GB / 50 GB',
    weeklyActiveLearners: 87,
    averageAccuracyRate: '92.4%',
  };
}

export async function getAllUsers(): Promise<UserProfile[]> {
  return inMemoryUsers;
}

export async function updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
  const user = inMemoryUsers.find(u => u.id === userId);
  if (user) {
    user.role = newRole;
    return true;
  }
  return false;
}

export async function createCourse(
  newCourse: Omit<Course, 'id' | 'lessonsCount' | 'isPublished'> & { videoUrl?: string }
): Promise<Course> {
  const course: Course = {
    ...newCourse,
    id: `course-${Date.now()}`,
    lessonsCount: 1,
    isPublished: true,
  };
  inMemoryCourses.unshift(course);

  if (newCourse.videoUrl) {
    const lessonId = `lesson-${Date.now()}`;
    MOCK_LESSONS[lessonId] = {
      id: lessonId,
      courseId: course.id,
      title: `${course.title}: Sign Demonstrations`,
      lessonType: 'standard_lesson',
      description: course.description,
      signVideoUrl: newCourse.videoUrl,
      durationSeconds: 180,
      orderIndex: 1,
      vocabularyItems: [],
    };
  }

  return course;
}
