export type UserRole = 'student' | 'teacher' | 'admin';

export type SignLanguageDialect =
  | 'NSL'     // Nigerian Sign Language (Active Priority 1)
  | 'KRSL'    // Korean Sign Language / 한국수어 (Active Priority 2)
  | 'ASL'     // American Sign Language (Coming Soon)
  | 'KSL'     // Kenyan Sign Language (Coming Soon)
  | 'SASL'    // South African Sign Language (Coming Soon)
  | 'GSL'     // Ghanaian Sign Language (Coming Soon)
  | 'BSL'     // British Sign Language (Coming Soon)
  | 'IS';     // International Sign (Coming Soon)

export interface CountrySignLanguageSupport {
  code: SignLanguageDialect;
  name: string;
  country: string;
  flag: string;
  region: string;
  status: 'active' | 'pilot' | 'in_review' | 'planned';
  statusLabel: string;
  reviewerTeam: string;
  regionalVariants: string[];
  learnerCount: number;
  approvedVocabularyCount: number;
  isPriority: boolean;
  isLocked?: boolean;
  notes: string;
}

export type MembershipTier = 'free_basic_1' | 'family_supporter' | 'school_institutional';

export interface UserSubscription {
  tier: MembershipTier;
  status: 'active' | 'canceling' | 'expired' | 'pending';
  billingPeriod?: 'monthly' | 'annual';
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  gradeLevel?: string;
  avatarUrl: string;
  totalStars?: number;
  badgesUnlocked?: string[];
  signLanguage?: SignLanguageDialect | string;
  dailyGoalMinutes?: number;
  personaGoal?: string;
  experienceLevel?: string;
  membershipTier?: MembershipTier;
  subscription?: UserSubscription;
}

export type CourseCategory = 
  | 'Reading & Literacy'
  | 'Digital Literacy'
  | 'STEM'
  | 'Everyday Signs';

export interface Course {
  id: string;
  title: string;
  description: string;
  gradeLevel: string; // e.g. "K-2", "3-5", "6-8"
  category: CourseCategory;
  thumbnailUrl: string;
  teacherId?: string;
  teacherName?: string;
  isPublished: boolean;
  lessonsCount: number;
  durationMinutes: number;
  iconName: string;
  signLanguage?: SignLanguageDialect | string;
  country?: string;
}

export type LessonType = 'standard_lesson' | 'interactive_storybook' | 'digital_simulation';

export interface StoryPage {
  pageNumber: number;
  illustrationUrl: string;
  textContent: string;
  signVideoTimestamp?: number;
  highlightWords?: { word: string; signUrl: string }[];
}

export type SignReviewStatus = 'draft' | 'reviewed' | 'approved';
export type SignLanguageCode = 'NSL' | 'ASL' | 'Other';

export interface ApprovedVocabularyItem {
  id: string;
  word: string;
  simpleMeaning: string;
  exampleSentence: string;
  imageUrl: string;
  signVideoUrl?: string;
  vocabularySignVideoUrl?: string;
  signedMeaningVideoUrl?: string;
  signedMeaningPosterUrl?: string;
  signedMeaningExplanation?: string;
  visualStoryFrames?: VisualStoryFrame[];
  signStillUrl?: string;
  signLanguage: SignLanguageCode;
  regionalVariant?: string;
  reviewStatus: SignReviewStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
  fingerspell: string;
}

export interface VocabularyItem {
  id: string;
  lessonId?: string;
  textWord: string;
  pictureUrl: string;
  signVideoUrl: string;
  fingerspellText: string;
  category: string;
  descriptionTips?: string;
  reviewStatus?: SignReviewStatus;
  signLanguage?: SignLanguageCode;
  reviewedBy?: string;
}

export type ActivityType = 
  | 'picture_to_sign'
  | 'sign_to_text'
  | 'fingerspell_builder'
  | 'visual_choice'
  | 'computer_hotspot_matching'
  | 'keyboard_trainer';

export interface MatchingPair {
  id: string;
  leftLabel: string;
  leftMediaUrl: string; // Picture or diagram
  rightLabel: string;
  rightMediaUrl: string; // Sign video or clip
  signHint?: string;
}

export interface HotspotItem {
  id: string;
  name: string;
  xPercent: number; // 0-100 position on image/canvas
  yPercent: number;
  signPromptUrl: string;
  signHint: string;
}

export interface Worksheet {
  id: string;
  lessonId: string;
  title: string;
  activityType: ActivityType;
  instructions: string;
  pairs?: MatchingPair[];
  hotspots?: HotspotItem[];
  multipleChoice?: {
    id: string;
    promptSignUrl: string;
    questionText: string;
    options: { id: string; label: string; imageUrl?: string; isCorrect: boolean }[];
  }[];
  targetFingerspellWord?: string;
  availableLetterTiles?: string[];
  totalPoints: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  lessonType: LessonType;
  description: string;
  signVideoUrl: string;
  durationSeconds: number;
  storyPages?: StoryPage[];
  vocabularyItems?: VocabularyItem[];
  worksheets?: Worksheet[];
  orderIndex: number;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  lessonId: string;
  worksheetId?: string;
  completed: boolean;
  score: number;
  starsEarned: number;
  completedAt: string;
}

export interface SignyExplanation {
  term: string;
  isApprovedWord: boolean;
  simplifiedDefinition: string;
  exampleSentence?: string;
  visualAnalogy?: string;
  fingerspell: string;
  signVideoUrl?: string;
  reviewStatus?: SignReviewStatus;
  reviewedBy?: string;
  signLanguage?: SignLanguageCode;
  boundaryNotice?: string;
  signGuide?: {
    handshape: string;
    location: string;
    movement: string;
    facialExpression: string;
  } | null;
  visualPromptSuggestion?: string;
}

export interface AILessonGeneration {
  lessonTitle: string;
  description: string;
  gradeLevel: string;
  category: CourseCategory;
  vocabulary: {
    word: string;
    category: string;
    signDescription: string;
    visualIcon: string;
  }[];
  worksheet: {
    title: string;
    activityType: ActivityType;
    pairs: {
      id: string;
      label: string;
      pictureIcon: string;
      signHint: string;
      matchId: string;
    }[];
  };
}

export type VideoProvider = 'mux' | 'supabase' | 'local' | 'youtube';

export interface AccessibleVideoSource {
  provider: VideoProvider;
  playbackId?: string;
  src?: string;
  fallbackSrc?: string;
  posterUrl: string;
  title: string;
  signLanguage: string;
  regionalVariant?: string;
  durationSeconds?: number;
  reviewedBy: string;
  reviewStatus: 'draft' | 'approved';
}

export interface VisualStoryFrame {
  id: string;
  order: number;
  imageUrl: string;
  caption: string;
  altText: string;
}

export interface VisualExplanation {
  id: string;
  word: string;
  originalSentence: string;
  simpleMeaning: string;
  conceptTags: string[];
  frames: VisualStoryFrame[];
  approvedSignVideoUrl?: string;
  signedMeaningVideoUrl: string;
  language: string;
  reviewStatus: 'draft' | 'reviewed' | 'approved';
  reviewedBy: string;
  offlineAvailable: boolean;
}

export type ContentReviewStatus =
  | 'draft'
  | 'needs_review'
  | 'changes_requested'
  | 'approved'
  | 'published'
  | 'archived';

export interface VocabularyContent {
  id: string;
  word: string;
  slug: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  pictureUrl: string;
  pictureAlt: string;
  vocabularySignVideoUrl: string;
  signedMeaningVideoUrl: string;
  signedExampleVideoUrl?: string;
  writtenMeaning?: string;
  exampleSentence?: string;
  fingerspelling: string;
  signLanguage: string;
  country: string;
  region?: string;
  localVariant?: string;
  visualExplanation?: VisualStoryFrame[];
  ageMin: number;
  ageMax: number;
  difficultyLevel: 'beginner' | 'developing' | 'independent';
  status: ContentReviewStatus;
  version: number;
  createdBy: string;
  reviewedBy?: string[];
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  updateReason?: string;
}

export type HelpDifficultyStage = 'sign' | 'word' | 'meaning' | 'ui' | 'facilitator';

export interface LearnerHelpRequest {
  id: string;
  learnerId: string;
  learnerName: string;
  lessonTitle: string;
  word: string;
  difficultyStage: HelpDifficultyStage;
  difficultyDescription: string;
  attemptsCount: number;
  showMeViewed: boolean;
  preferredSupport: 'short_video_call' | 'video_question' | 'message';
  approvalStatus: 'parent_approved' | 'teacher_approved' | 'pending';
  approvalContact?: string;
  status: 'waiting_for_facilitator' | 'in_progress' | 'resolved';
  requestedAt: string;
  resolvedAt?: string;
  facilitatorNotes?: string;
}

