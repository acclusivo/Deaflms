import { Course, Lesson, UserProfile, UserRole, Worksheet, StudentProgress, CountrySignLanguageSupport, SignLanguageDialect } from './types';
import { MOCK_CURRENT_USER, MOCK_TEACHER, MOCK_ADMIN, MOCK_COURSES, MOCK_LESSONS, MOCK_WORKSHEETS, DEFAULT_COUNTRY_SIGN_LANGUAGES } from './mock-data';
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
    signLanguage: 'KRSL',
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
    signLanguage: 'KSL',
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

import {
  getHelpRequests,
  submitHelpRequest,
  updateHelpRequestStatus,
  APPROVED_COMPUTER_WORDS,
} from './approved-vocabulary';
import { LearnerHelpRequest, VocabularyContent } from './types';

export async function getLearnerHelpRequests(): Promise<LearnerHelpRequest[]> {
  return getHelpRequests();
}

export async function createLearnerHelpRequest(
  request: Omit<LearnerHelpRequest, 'id' | 'requestedAt' | 'status'>
): Promise<LearnerHelpRequest> {
  return submitHelpRequest(request);
}

export async function resolveLearnerHelpRequest(
  id: string,
  notes?: string
): Promise<boolean> {
  return updateHelpRequestStatus(id, 'resolved', notes);
}

let inMemoryVocabularyContent: VocabularyContent[] = [
  {
    id: 'vocab-content-webcam',
    word: 'Webcam',
    slug: 'webcam',
    courseId: 'course-digital-literacy-1',
    moduleId: 'mod-1',
    lessonId: 'lesson-hardware-1',
    pictureUrl: '/images/hardware/webcam.jpg',
    pictureAlt: 'Physical webcam hardware device',
    vocabularySignVideoUrl: 'https://www.youtube.com/watch?v=GZvX_Q9si5M',
    signedMeaningVideoUrl: 'https://www.youtube.com/watch?v=By5O5IGPNBU',
    writtenMeaning: 'A webcam is a small camera used with a computer.',
    exampleSentence: 'I use the webcam for my online class.',
    fingerspelling: 'W - E - B - C - A - M',
    signLanguage: 'Nigerian Sign Language (NSL)',
    country: 'Nigeria',
    region: 'Abuja Federal Capital Territory',
    localVariant: 'Abuja school and community variant',
    visualExplanation: APPROVED_COMPUTER_WORDS.webcam.visualStoryFrames,
    ageMin: 8,
    ageMax: 16,
    difficultyLevel: 'beginner',
    status: 'published',
    version: 1,
    createdBy: 'Facilitator — Sample Account',
    reviewedBy: ['Deaf Reviewer (Abuja)', 'Curriculum Lead (Nigeria)'],
    approvedBy: 'Acclusivo Deaf Review Team (Abuja, Nigeria)',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z',
    publishedAt: '2026-03-01T08:00:00Z',
  },
];

export async function getVocabularyContentList(): Promise<VocabularyContent[]> {
  return inMemoryVocabularyContent;
}

export async function createOrUpdateVocabularyContent(
  content: Omit<VocabularyContent, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<VocabularyContent> {
  const existingIdx = inMemoryVocabularyContent.findIndex((c) => c.slug === content.slug);
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    const existing = inMemoryVocabularyContent[existingIdx];
    const newVersion: VocabularyContent = {
      ...existing,
      ...content,
      id: existing.id,
      version: existing.version + 1,
      updatedAt: now,
      status: content.status || 'needs_review',
    };
    inMemoryVocabularyContent[existingIdx] = newVersion;
    return newVersion;
  }

  const created: VocabularyContent = {
    ...content,
    id: content.id || `vocab-content-${Date.now()}`,
    version: 1,
    createdAt: now,
    updatedAt: now,
    status: content.status || 'draft',
  };
  inMemoryVocabularyContent.unshift(created);
  return created;
}

/**
 * Retrieve the multinational country sign languages supported by DeafLMS.
 * Enforces policy: Nigerian Sign Language (NSL) is the sole active launch track; all other countries are locked.
 */
export async function getCountrySignLanguages(): Promise<CountrySignLanguageSupport[]> {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('deaflms_country_sign_languages');
      if (stored) {
        const parsed = JSON.parse(stored) as CountrySignLanguageSupport[];
        // Enforce lock rule: only Nigeria (NSL) is unlocked/active; all others are strictly locked
        return parsed.map((item) => {
          const isNigeria = item.code === 'NSL' || item.country.toLowerCase() === 'nigeria';
          if (isNigeria) {
            return {
              ...item,
              status: 'active',
              isPriority: true,
              isLocked: false,
              statusLabel: '🟢 Priority 1 • Sole Active Launch Track',
            };
          }
          return {
            ...item,
            status: 'planned',
            isPriority: false,
            isLocked: true,
            statusLabel: '🔒 Locked • Pitch Focus',
          };
        });
      }
    }
  } catch {}
  return [...DEFAULT_COUNTRY_SIGN_LANGUAGES];
}

/**
 * Administrator update for country sign language status (e.g. active, pilot, in_review, planned).
 * Safeguard: Non-Nigeria dialects are locked for the current release.
 */
export async function updateCountrySignLanguageStatus(
  code: SignLanguageDialect,
  status: 'active' | 'pilot' | 'in_review' | 'planned'
): Promise<CountrySignLanguageSupport[]> {
  // If attempting to alter a non-Nigeria language while locked, prevent unlocking
  if (code !== 'NSL') {
    return await getCountrySignLanguages();
  }

  const current = await getCountrySignLanguages();
  const statusLabels: Record<string, string> = {
    active: 'Priority 1 • Active Standard',
    pilot: 'Priority 2 • Pilot Track',
    in_review: 'Curriculum Moderation',
    planned: 'Planned Expansion',
  };

  const updated = current.map((item) => {
    if (item.code === code) {
      return {
        ...item,
        status,
        statusLabel: statusLabels[status] || status,
        isPriority: status === 'active' || status === 'pilot',
        isLocked: false,
      };
    }
    return item;
  });

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('deaflms_country_sign_languages', JSON.stringify(updated));
    }
  } catch {}
  return updated;
}

/**
 * Administrator update for user's assigned country sign language.
 */
export async function updateUserSignLanguage(
  userId: string,
  signLanguage: SignLanguageDialect | string
): Promise<UserProfile[]> {
  inMemoryUsers = inMemoryUsers.map((u) => {
    if (u.id === userId) {
      return { ...u, signLanguage };
    }
    return u;
  });
  return [...inMemoryUsers];
}

