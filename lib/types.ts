export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  gradeLevel?: string;
  avatarUrl: string;
  totalStars?: number;
  badgesUnlocked?: string[];
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
}

export type LessonType = 'standard_lesson' | 'interactive_storybook' | 'digital_simulation';

export interface StoryPage {
  pageNumber: number;
  illustrationUrl: string;
  textContent: string;
  signVideoTimestamp?: number;
  highlightWords?: { word: string; signUrl: string }[];
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
  simplifiedDefinition: string;
  visualAnalogy: string;
  fingerspell: string;
  signGuide: {
    handshape: string;
    location: string;
    movement: string;
    facialExpression: string;
  };
  visualPromptSuggestion: string;
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
