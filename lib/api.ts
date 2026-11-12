import {
  Course,
  Lesson,
  UserProfile,
  UserRole,
  Worksheet,
  StudentProgress,
  CountrySignLanguageSupport,
  SignLanguageDialect,
  PaymentRecord,
  CourseEnrollment,
  PaymentMethod,
  PaymentStatus,
} from './types';
import { MOCK_CURRENT_USER, MOCK_TEACHER, MOCK_ADMIN, MOCK_COURSES, MOCK_LESSONS, MOCK_WORKSHEETS, DEFAULT_COUNTRY_SIGN_LANGUAGES } from './mock-data';
import { isSupabaseConfigured, supabase } from './supabase/client';
import { fetchPublishedCourses, fetchCourseById, fetchLessonById, fetchPublishedVocabulary } from './sanity/queries';

let inMemoryCourses: Course[] = [...MOCK_COURSES];
let inMemoryProgress: StudentProgress[] = [];
let inMemoryUsers: UserProfile[] = [];

export async function getCurrentUser(preferredRole?: UserRole): Promise<UserProfile> {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('deaflms_auth_user');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
  }
  return {
    id: 'user-guest',
    email: 'guest@deaflms.org',
    displayName: 'Guest Learner',
    role: preferredRole || 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    totalStars: 0,
    enrolledCourseIds: [],
  };
}

export async function getCourses(): Promise<Course[]> {
  // 1. Try Supabase PostgreSQL (Live Database)
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          gradeLevel: c.grade_level || c.gradeLevel,
          category: c.category,
          ageSegment: c.age_segment || c.ageSegment,
          minAge: c.min_age !== undefined ? c.min_age : c.minAge,
          maxAge: c.max_age !== undefined ? c.max_age : c.maxAge,
          thumbnailUrl: c.thumbnail_url || c.thumbnailUrl,
          teacherId: c.teacher_id || c.teacherId,
          teacherName: c.teacher_name || c.teacherName,
          isPublished: c.is_published ?? c.isPublished ?? true,
          isFreeTier: c.is_free_tier ?? c.isFreeTier ?? true,
          priceNgn: c.price_ngn !== undefined ? c.price_ngn : (c.priceNgn ?? 0),
          lessonsCount: c.lessons_count ?? c.lessonsCount ?? 1,
          modulesCount: c.modules_count ?? c.modulesCount ?? 1,
          durationMinutes: c.duration_minutes ?? c.durationMinutes ?? 30,
          iconName: c.icon_name || c.iconName || 'BookOpen',
          signLanguage: c.sign_language || c.signLanguage || 'NSL',
          country: c.country || 'Nigeria',
        })) as Course[];
      }
    } catch (e) {
      console.warn('Supabase courses query notice:', e);
    }
  }

  // 2. Try Sanity CMS
  try {
    const sanityCourses = await fetchPublishedCourses();
    if (sanityCourses && sanityCourses.length > 0) {
      return sanityCourses as Course[];
    }
  } catch (e) {
    console.warn('Sanity query error, checking fallbacks:', e);
  }

  // 3. Resilient baseline courses
  return inMemoryCourses;
}

export async function getCourseById(id: string): Promise<Course | null> {
  // 1. Try Supabase PostgreSQL (Live Database)
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          gradeLevel: data.grade_level || data.gradeLevel,
          category: data.category,
          ageSegment: data.age_segment || data.ageSegment,
          minAge: data.min_age !== undefined ? data.min_age : data.minAge,
          maxAge: data.max_age !== undefined ? data.max_age : data.maxAge,
          thumbnailUrl: data.thumbnail_url || data.thumbnailUrl,
          teacherId: data.teacher_id || data.teacherId,
          teacherName: data.teacher_name || data.teacherName,
          isPublished: data.is_published ?? data.isPublished ?? true,
          isFreeTier: data.is_free_tier ?? data.isFreeTier ?? true,
          priceNgn: data.price_ngn !== undefined ? data.price_ngn : (data.priceNgn ?? 0),
          lessonsCount: data.lessons_count ?? data.lessonsCount ?? 1,
          modulesCount: data.modules_count ?? data.modulesCount ?? 1,
          durationMinutes: data.duration_minutes ?? data.durationMinutes ?? 30,
          iconName: data.icon_name || data.iconName || 'BookOpen',
          signLanguage: data.sign_language || data.signLanguage || 'NSL',
          country: data.country || 'Nigeria',
        } as Course;
      }
    } catch (e) {
      console.warn('Supabase course query error:', e);
    }
  }

  // 2. Try Sanity CMS
  try {
    const sanityCourse = await fetchCourseById(id);
    if (sanityCourse) return sanityCourse as Course;
  } catch (e) {
    console.warn('Sanity course query error, checking fallbacks:', e);
  }

  // 3. Check getCourses fallback chain
  const courses = await getCourses();
  return courses.find(c => c.id === id) || null;
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  // 1. Try Sanity CMS
  try {
    const sanityLesson = await fetchLessonById(id);
    if (sanityLesson) return sanityLesson as Lesson;
  } catch (e) {
    console.warn('Sanity lesson query error, checking fallbacks:', e);
  }

  // 2. Try Supabase PostgreSQL
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('lessons').select('*').eq('id', id).single();
      if (!error && data) return data as Lesson;
    } catch (e) {
      console.warn('Supabase lesson query failed, falling back to mock:', e);
    }
  }

  // 3. Resilient in-memory verified baseline
  return MOCK_LESSONS[id] || null;
}

/**
 * Updates an active lesson in-memory for instant reactivity across the learner platform.
 */
export function updateLessonInMemory(lessonUpdates: Partial<Lesson> & { id: string }): Lesson {
  const existing = MOCK_LESSONS[lessonUpdates.id] || {
    id: lessonUpdates.id,
    courseId: lessonUpdates.courseId || 'course-frontend-web-1',
    title: lessonUpdates.title || 'Untitled Lesson',
    lessonType: 'standard_lesson' as const,
    description: lessonUpdates.description || '',
    signVideoUrl: '',
    durationSeconds: 240,
    orderIndex: lessonUpdates.orderIndex || 1,
  };

  const updated: Lesson = {
    ...existing,
    ...lessonUpdates,
    title: lessonUpdates.title ?? existing.title,
    description: lessonUpdates.description ?? existing.description,
    muxPlaybackId: lessonUpdates.muxPlaybackId !== undefined ? lessonUpdates.muxPlaybackId : existing.muxPlaybackId,
    isFreeBasic1: lessonUpdates.isFreeBasic1 !== undefined ? lessonUpdates.isFreeBasic1 : existing.isFreeBasic1,
    orderIndex: lessonUpdates.orderIndex ?? existing.orderIndex,
  };

  MOCK_LESSONS[lessonUpdates.id] = updated;
  return updated;
}

export async function getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
  // 1. Try Supabase PostgreSQL if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');
      if (!error && data && data.length > 0) return data as Lesson[];
    } catch (e) {
      console.warn('Supabase lessons query failed, falling back to mock:', e);
    }
  }

  // 2. Query in-memory verified baseline
  const matched = Object.values(MOCK_LESSONS).filter((l) => l.courseId === courseId);
  if (matched.length > 0) {
    return matched.sort((a, b) => a.orderIndex - b.orderIndex);
  }

  // 3. Fallback: return baseline lessons
  return Object.values(MOCK_LESSONS).slice(0, 5);
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
  let studentCount = 0;
  let teacherCount = 0;
  let courseCount = inMemoryCourses.length;

  if (isSupabaseConfigured && supabase) {
    try {
      const { count: sCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');
      const { count: tCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'teacher');
      const { count: cCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      studentCount = sCount || 0;
      teacherCount = tCount || 0;
      if (cCount && cCount > 0) courseCount = cCount;
    } catch (e) {
      console.warn('Error fetching KPIs from Supabase:', e);
    }
  }

  // If local fallback, count registered accounts
  if (studentCount === 0 && typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('deaflms_registered_accounts');
      if (raw) {
        const accounts = JSON.parse(raw);
        if (Array.isArray(accounts)) {
          studentCount = accounts.filter((a: any) => a.profile?.role === 'student').length;
          teacherCount = accounts.filter((a: any) => a.profile?.role === 'teacher').length;
        }
      }
    } catch {}
  }

  return {
    totalStudents: Math.max(studentCount, 1),
    totalTeachers: Math.max(teacherCount, 1),
    publishedCourses: courseCount,
    signVideoHours: '7.5 hrs',
    storageUsedGb: 'Live Cloud Storage',
    weeklyActiveLearners: Math.max(studentCount, 1),
    averageAccuracyRate: '100%',
  };
}

export async function getAllUsers(): Promise<UserProfile[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data && data.length > 0) {
        return data.map((p: any) => ({
          id: p.id,
          email: p.email,
          displayName: p.display_name || p.email.split('@')[0],
          role: p.role,
          avatarUrl: p.avatar_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
          gradeLevel: p.grade_level || 'Active Learner',
          totalStars: p.total_stars || 0,
        }));
      }
    } catch (e) {
      console.warn('Error querying users from Supabase:', e);
    }
  }

  // Local accounts
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('deaflms_registered_accounts');
      if (raw) {
        const accounts = JSON.parse(raw);
        if (Array.isArray(accounts) && accounts.length > 0) {
          return accounts.map((a: any) => a.profile);
        }
      }
    } catch {}
  }

  return inMemoryUsers;
}

export async function updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      if (!error) return true;
    } catch (e) {
      console.warn('Error updating role in Supabase:', e);
    }
  }

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

// ==============================================================================
// PHASE 2: DUAL PAYMENT ENGINE (SELAR INSTANT + MANUAL BANK TRANSFER FALLBACK)
// ==============================================================================

export const OFFICIAL_BANK_DETAILS = {
  bankName: 'Wema Bank Plc',
  accountNumber: '0259841103',
  accountName: 'Tech Inclusion Enterprise Ltd — DeafLMS',
  branch: 'Abuja Central, FCT, Nigeria',
  currency: 'NGN (₦)',
  supportContact: 'payments@acclusivo.com',
  transferInstruction: 'Please enter your unique Reference Code in your bank transfer narration/remarks so we can match it instantly.',
};

export function generatePaymentReference(): string {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `DLMS-PAY-${timestamp}${random}`;
}

const PAYMENTS_STORAGE_KEY = 'deaflms_payment_records';
const ENROLLMENTS_STORAGE_KEY = 'deaflms_course_enrollments';

let inMemoryPayments: PaymentRecord[] = [];
let inMemoryEnrollments: CourseEnrollment[] = [];

function getStoredPayments(): PaymentRecord[] {
  if (typeof window === 'undefined') return inMemoryPayments;
  try {
    const raw = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    if (!raw) return inMemoryPayments;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return inMemoryPayments;
    // Strip out any legacy sample/dummy test payment records
    const liveOnly = parsed.filter(
      (p: any) => p && p.id && !p.id.startsWith('pay-sample-')
    );
    return liveOnly;
  } catch {
    return inMemoryPayments;
  }
}

function saveStoredPayments(records: PaymentRecord[]) {
  inMemoryPayments = records;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(records));
    } catch {}
  }
}

function getStoredEnrollments(): CourseEnrollment[] {
  if (typeof window === 'undefined') return inMemoryEnrollments;
  try {
    const raw = localStorage.getItem(ENROLLMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(inMemoryEnrollments));
      return inMemoryEnrollments;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : inMemoryEnrollments;
  } catch {
    return inMemoryEnrollments;
  }
}

function saveStoredEnrollments(records: CourseEnrollment[]) {
  inMemoryEnrollments = records;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(records));
    } catch {}
  }
}

/**
 * Helper to map Supabase snake_case payments to camelCase PaymentRecord
 */
export function mapPaymentRecord(row: any): PaymentRecord {
  return {
    id: row.id || `pay-${Date.now()}`,
    userId: row.user_id || row.userId || '',
    userEmail: row.user_email || row.userEmail || '',
    userName: row.user_name || row.userName || 'Active Learner',
    courseId: row.course_id || row.courseId || '',
    courseTitle: row.course_title || row.courseTitle || 'DeafLMS Course',
    amountNgn: Number(row.amount_ngn !== undefined ? row.amount_ngn : (row.amountNgn || 0)),
    method: row.method || 'selar_instant',
    reference: row.reference || '',
    status: row.status || 'confirmed',
    selarTransactionId: row.selar_transaction_id || row.selarTransactionId,
    bankName: row.bank_name || row.bankName,
    senderName: row.sender_name || row.senderName,
    transferDate: row.transfer_date || row.transferDate,
    proofUrl: row.proof_url || row.proofUrl,
    adminNotes: row.admin_notes || row.adminNotes,
    reviewedBy: row.reviewed_by || row.reviewedBy,
    reviewedAt: row.reviewed_at || row.reviewedAt,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
  };
}

/**
 * Helper to map Supabase snake_case course_enrollments to camelCase CourseEnrollment
 */
export function mapEnrollmentRecord(row: any): CourseEnrollment {
  return {
    id: row.id || `enr-${Date.now()}`,
    userId: row.user_id || row.userId || '',
    courseId: row.course_id || row.courseId || '',
    courseTitle: row.course_title || row.courseTitle || 'DeafLMS Course',
    enrolledAt: row.enrolled_at || row.enrolledAt || new Date().toISOString(),
    status: row.status || 'active',
    paymentId: row.payment_id || row.paymentId,
    activatedVia: row.activated_via || row.activatedVia || 'selar_instant',
  };
}

/**
 * Safely resolves a UUID profile id if present in Supabase profiles, or null
 */
async function resolveProfileUuid(userId?: string, userEmail?: string): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const isValidUuid = typeof userId === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);

    if (isValidUuid) {
      const { data: p } = await supabase.from('profiles').select('id').eq('id', userId).maybeSingle();
      if (p?.id) return p.id;
    }

    if (userEmail) {
      const { data: p } = await supabase.from('profiles').select('id').eq('email', userEmail.trim().toLowerCase()).maybeSingle();
      if (p?.id) return p.id;
    }
  } catch {}
  return null;
}

/**
 * Submit manual bank transfer payment proof.
 * Sets status to 'pending' — does NOT auto-activate enrolment until admin review.
 */
export async function submitManualPaymentProof(params: {
  userId: string;
  userEmail: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  amountNgn: number;
  reference: string;
  bankName: string;
  senderName: string;
  transferDate: string;
  proofUrl?: string;
}): Promise<PaymentRecord> {
  const newPayment: PaymentRecord = {
    id: `pay-${Date.now()}`,
    userId: params.userId,
    userEmail: params.userEmail,
    userName: params.userName,
    courseId: params.courseId,
    courseTitle: params.courseTitle,
    amountNgn: params.amountNgn,
    method: 'manual_bank_transfer',
    reference: params.reference,
    status: 'pending',
    bankName: params.bankName,
    senderName: params.senderName,
    transferDate: params.transferDate,
    proofUrl: params.proofUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const current = getStoredPayments();
  const updated = [newPayment, ...current];
  saveStoredPayments(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      const profileUuid = await resolveProfileUuid(params.userId, params.userEmail);
      await supabase.from('payments').insert([{
        id: newPayment.id,
        user_id: profileUuid,
        user_email: params.userEmail,
        user_name: params.userName,
        course_id: params.courseId,
        course_title: params.courseTitle,
        amount_ngn: params.amountNgn,
        method: 'manual_bank_transfer',
        reference: params.reference,
        status: 'pending',
        bank_name: params.bankName,
        sender_name: params.senderName,
        transfer_date: params.transferDate,
        proof_url: params.proofUrl,
      }]);
    } catch (e) {
      console.warn('Supabase manual payment insert failed, saved to local cache:', e);
    }
  }

  return newPayment;
}

/**
 * Process Selar instant payment webhook / callback.
 * Automatically activates enrollment immediately upon verified Selar transaction.
 */
export async function processSelarInstantPayment(params: {
  userId: string;
  userEmail: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  amountNgn: number;
  selarTransactionId: string;
  reference: string;
}): Promise<{ payment: PaymentRecord; enrollment: CourseEnrollment }> {
  const now = new Date().toISOString();
  const paymentId = `pay-selar-${Date.now()}`;
  const enrollmentId = `enr-selar-${Date.now()}`;

  const payment: PaymentRecord = {
    id: paymentId,
    userId: params.userId,
    userEmail: params.userEmail,
    userName: params.userName,
    courseId: params.courseId,
    courseTitle: params.courseTitle,
    amountNgn: params.amountNgn,
    method: 'selar_instant',
    reference: params.reference,
    status: 'confirmed',
    selarTransactionId: params.selarTransactionId,
    createdAt: now,
    updatedAt: now,
  };

  const enrollment: CourseEnrollment = {
    id: enrollmentId,
    userId: params.userId,
    courseId: params.courseId,
    courseTitle: params.courseTitle,
    enrolledAt: now,
    status: 'active',
    paymentId: payment.id,
    activatedVia: 'selar_instant',
  };

  const payments = [payment, ...getStoredPayments().filter(p => p.reference !== params.reference)];
  saveStoredPayments(payments);

  const enrollments = [enrollment, ...getStoredEnrollments().filter(e => !(e.userId === params.userId && e.courseId === params.courseId))];
  saveStoredEnrollments(enrollments);

  if (isSupabaseConfigured && supabase) {
    try {
      const profileUuid = await resolveProfileUuid(params.userId, params.userEmail);

      // 1. Insert into Supabase payments table
      await supabase.from('payments').insert([{
        id: payment.id,
        user_id: profileUuid,
        user_email: params.userEmail,
        user_name: params.userName,
        course_id: params.courseId,
        course_title: params.courseTitle,
        amount_ngn: params.amountNgn,
        method: 'selar_instant',
        reference: params.reference,
        status: 'confirmed',
        selar_transaction_id: params.selarTransactionId,
        created_at: now,
        updated_at: now,
      }]);

      // 2. Insert into Supabase course_enrollments table
      await supabase.from('course_enrollments').insert([{
        id: enrollment.id,
        user_id: profileUuid,
        course_id: params.courseId,
        course_title: params.courseTitle,
        status: 'active',
        payment_id: payment.id,
        activated_via: 'selar_instant',
        enrolled_at: now,
      }]);
    } catch (e) {
      console.warn('Supabase Selar transaction insert failed, saved to local cache:', e);
    }
  }

  return { payment, enrollment };
}

/**
 * Administrator verifies or rejects a manual bank transfer payment.
 * When confirmed, automatically creates an active course enrollment.
 */
export async function verifyManualPayment(
  paymentId: string,
  action: 'confirm' | 'reject',
  adminNotes?: string,
  reviewerName: string = 'Administrator'
): Promise<PaymentRecord | null> {
  const currentPayments = getStoredPayments();
  const paymentIndex = currentPayments.findIndex(p => p.id === paymentId);

  if (paymentIndex === -1) return null;

  const payment = currentPayments[paymentIndex];
  const now = new Date().toISOString();

  const updatedPayment: PaymentRecord = {
    ...payment,
    status: action === 'confirm' ? 'confirmed' : 'rejected',
    adminNotes: adminNotes || payment.adminNotes,
    reviewedBy: reviewerName,
    reviewedAt: now,
    updatedAt: now,
  };

  currentPayments[paymentIndex] = updatedPayment;
  saveStoredPayments([...currentPayments]);

  if (action === 'confirm') {
    const newEnrollment: CourseEnrollment = {
      id: `enr-${Date.now()}`,
      userId: payment.userId,
      courseId: payment.courseId,
      courseTitle: payment.courseTitle,
      enrolledAt: now,
      status: 'active',
      paymentId: payment.id,
      activatedVia: 'manual_admin_approval',
    };

    const currentEnrollments = getStoredEnrollments();
    const filtered = currentEnrollments.filter(e => !(e.userId === payment.userId && e.courseId === payment.courseId));
    saveStoredEnrollments([newEnrollment, ...filtered]);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('payments').update({
        status: action === 'confirm' ? 'confirmed' : 'rejected',
        admin_notes: adminNotes,
        reviewed_by: reviewerName,
        reviewed_at: now,
        updated_at: now,
      }).eq('id', paymentId);

      if (action === 'confirm') {
        const profileUuid = await resolveProfileUuid(payment.userId, payment.userEmail);
        await supabase.from('course_enrollments').insert([{
          id: `enr-${Date.now()}`,
          user_id: profileUuid,
          course_id: payment.courseId,
          course_title: payment.courseTitle,
          status: 'active',
          payment_id: payment.id,
          activated_via: 'manual_admin_approval',
          enrolled_at: now,
        }]);
      }
    } catch (e) {
      console.warn('Supabase payment verification update failed:', e);
    }
  }

  return updatedPayment;
}

/**
 * Get all payment records for a specific learner by userId or userEmail.
 */
export async function getUserPayments(userId: string, userEmail?: string): Promise<PaymentRecord[]> {
  const local = getStoredPayments().filter(
    (p) => p.userId === userId || (userEmail && p.userEmail.toLowerCase() === userEmail.toLowerCase())
  );

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('payments').select('*');
      if (userEmail) {
        query = query.or(`user_id.eq.${userId},user_email.eq.${userEmail.toLowerCase()}`);
      } else {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map(mapPaymentRecord);
      }
    } catch (e) {}
  }
  return local;
}

/**
 * Get all payments for administrator verification console.
 * Strictly fetches confirmed, pending, and rejected payments from Supabase PostgREST.
 */
export async function getAllPayments(): Promise<PaymentRecord[]> {
  const local = getStoredPayments();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const mappedSupabase = data.map(mapPaymentRecord);
        // Include any recently submitted local payments not yet synced
        const knownRefs = new Set(mappedSupabase.map((p) => p.reference));
        const unsyncedLocal = local.filter((p) => p && p.reference && !knownRefs.has(p.reference));
        return [...mappedSupabase, ...unsyncedLocal];
      }
    } catch (e) {
      console.warn('Supabase getAllPayments notice:', e);
    }
  }
  return local;
}

/**
 * Get user course enrollments with live Supabase query and payment reconciliation.
 */
export async function getUserEnrollments(userId: string, userEmail?: string): Promise<CourseEnrollment[]> {
  const local = getStoredEnrollments().filter(
    (e) => (e.userId === userId || !userId) && e.status === 'active'
  );

  let enrollments: CourseEnrollment[] = [...local];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('status', 'active');

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = data.map(mapEnrollmentRecord);
        // Filter by user if possible
        const userMatched = mapped.filter((e) => !e.userId || e.userId === userId);
        enrollments = [...userMatched, ...enrollments];
      }
    } catch (e) {}
  }

  // Double check confirmed payments to ensure paid user always gets full course access
  try {
    const allPayments = await getAllPayments();
    const confirmedUserPayments = allPayments.filter(
      (p) =>
        p.status === 'confirmed' &&
        ((userEmail && p.userEmail.toLowerCase() === userEmail.toLowerCase()) ||
          p.userId === userId)
    );

    for (const p of confirmedUserPayments) {
      if (!enrollments.some((e) => e.courseId === p.courseId)) {
        enrollments.push({
          id: `enr-from-pay-${p.id}`,
          userId: userId,
          courseId: p.courseId,
          courseTitle: p.courseTitle,
          status: 'active',
          paymentId: p.id,
          activatedVia: p.method === 'manual_bank_transfer' ? 'manual_admin_approval' : 'selar_instant',
          enrolledAt: p.createdAt,
        });
      }
    }
  } catch {}

  // Deduplicate by courseId
  const uniqueMap = new Map<string, CourseEnrollment>();
  for (const enr of enrollments) {
    if (!uniqueMap.has(enr.courseId)) {
      uniqueMap.set(enr.courseId, enr);
    }
  }

  return Array.from(uniqueMap.values());
}

/**
 * Check if a learner has access to a specific course (Free tier or active enrollment).
 */
export async function checkCourseAccess(
  userId: string,
  courseId: string,
  userEmail?: string
): Promise<{ hasAccess: boolean; reason?: string }> {
  const course = await getCourseById(courseId);
  if (course && course.isFreeTier) {
    return { hasAccess: true, reason: 'Free Basic Tier' };
  }

  const enrollments = await getUserEnrollments(userId, userEmail);
  const isEnrolled = enrollments.some((e) => e.courseId === courseId && e.status === 'active');
  if (isEnrolled) {
    return { hasAccess: true, reason: 'Active Confirmed Enrollment' };
  }

  return { hasAccess: false, reason: 'Requires Course Enrollment' };
}


