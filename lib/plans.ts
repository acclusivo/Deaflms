import { MembershipTier, UserProfile } from './types';

export interface PlanDefinition {
  id: MembershipTier;
  name: string;
  badge: string;
  tagline: string;
  price: {
    amountUsd: number;
    amountNgn: number;
    formatted: string;
    billingInterval: string;
  };
  highlighted?: boolean;
  features: { label: string; included: boolean; note?: string }[];
  moduleAllowance: {
    courseId: string;
    moduleId: string;
    lessonIds: string[];
    isFullAccess: boolean;
  };
  aiAllowanceDaily: number;
  isPaid: boolean;
  ctaText: string;
}

/**
 * Designated Free Basic 1 Content Assignment
 * Enforced at the server/API layer with stable identifiers.
 */
export const FREE_BASIC_1_COURSE_ID = 'course-digital-literacy-1';
export const FREE_BASIC_1_MODULE_ID = 'module-basic-1';
export const FREE_BASIC_1_LESSON_IDS = [
  'lesson-hardware-1',
  'lesson-keyboard-1',
  'lesson-web-1',
  'lesson-everyday-1',
  'lesson-storybook-1',
] as const;

export const PLANS_CATALOG: Record<MembershipTier, PlanDefinition> = {
  free_basic_1: {
    id: 'free_basic_1',
    name: 'Free Basic 1',
    badge: '100% Free Forever',
    tagline: 'Foundational visual signs and computer touch-typing for every deaf child and family.',
    price: {
      amountUsd: 0,
      amountNgn: 0,
      formatted: 'Free',
      billingInterval: 'No card required',
    },
    features: [
      { label: 'Basic 1 Module (5 Core Lessons)', included: true },
      { label: 'AnySign Fingerspelling Keyboard Trainer', included: true },
      { label: 'Dual-Pane Illustrated Storybook (Sample)', included: true },
      { label: 'Offline Printable Worksheet PDFs', included: true },
      { label: '0.5x & 0.75x Slow-Motion Video Controls', included: true },
      { label: 'Advanced STEM & Science Sign Modules', included: false, note: 'Supporter Tier' },
      { label: 'Gemini AI Visual Lesson Co-Pilot', included: false, note: 'Supporter Tier' },
      { label: 'Classroom Teacher Roster Tools', included: false, note: 'School Tier' },
    ],
    moduleAllowance: {
      courseId: FREE_BASIC_1_COURSE_ID,
      moduleId: FREE_BASIC_1_MODULE_ID,
      lessonIds: [...FREE_BASIC_1_LESSON_IDS],
      isFullAccess: false,
    },
    aiAllowanceDaily: 0,
    isPaid: false,
    ctaText: 'Start Free Basic 1',
  },
  family_supporter: {
    id: 'family_supporter',
    name: 'Future Family Supporter',
    badge: 'Proposed Future Tier',
    tagline: 'Proposed access for families supporting Deaf learners at home.',
    highlighted: true,
    price: {
      amountUsd: 8,
      amountNgn: 5000,
      formatted: '₦5,000 / $8 (Proposed)',
      billingInterval: 'Proposed price—still being tested with customers',
    },
    features: [
      { label: 'Everything in Free Basic 1', included: true },
      { label: 'Foundational Computer & Literacy Modules', included: true },
      { label: 'Interactive Storybook Library', included: true },
      { label: 'Clarify This Word (Reviewed Content)', included: true },
      { label: 'Human-Reviewed Sign Language Videos', included: true },
      { label: 'Synchronized Family Progress Tracker', included: true },
      { label: 'Institutional School Facilitator Tools', included: false, note: 'School Tier' },
    ],
    moduleAllowance: {
      courseId: '*',
      moduleId: '*',
      lessonIds: [],
      isFullAccess: true,
    },
    aiAllowanceDaily: 50,
    isPaid: true,
    ctaText: 'Join Future Supporter Waitlist',
  },
  school_institutional: {
    id: 'school_institutional',
    name: 'School & Learning Centre Pilot',
    badge: 'Pilot Partner Offer',
    tagline: 'Annual pilot licensing for schools, NGOs, and special education centres.',
    price: {
      amountUsd: 49,
      amountNgn: 45000,
      formatted: 'Annual School Pilot',
      billingInterval: 'Proposed price—still being tested with customers',
    },
    features: [
      { label: 'Everything in Family Supporter', included: true },
      { label: 'Facilitator Accounts with Progress Review', included: true },
      { label: 'Learner Diagnostic Activity Tracking', included: true },
      { label: 'Proposed future curriculum alignment', included: true },
      { label: 'Designed toward WCAG 2.2 AA accessibility', included: true },
      { label: 'Dedicated Onboarding & Deaf Review Guidance', included: true },
    ],
    moduleAllowance: {
      courseId: '*',
      moduleId: '*',
      lessonIds: [],
      isFullAccess: true,
    },
    aiAllowanceDaily: 500,
    isPaid: true,
    ctaText: 'Request School Pilot Partnership',
  },
};

/**
 * Server-Side Content Entitlement Check
 * Validates whether a given user has entitlement to a specific lesson.
 * Fails closed if lesson is not found in designated assignments.
 */
export function checkLessonAccess(
  user: UserProfile | null,
  lessonId: string
): {
  allowed: boolean;
  tier: MembershipTier;
  isDesignatedFreeLesson: boolean;
  reason?: string;
} {
  const isFreeDesignated = (FREE_BASIC_1_LESSON_IDS as readonly string[]).includes(lessonId);

  // If user has an active paid subscription, grant full access
  const isPaidActive =
    user?.subscription?.status === 'active' &&
    (user.subscription.tier === 'family_supporter' || user.subscription.tier === 'school_institutional');

  if (isPaidActive) {
    return {
      allowed: true,
      tier: user!.subscription!.tier,
      isDesignatedFreeLesson: isFreeDesignated,
    };
  }

  // Free Tier check: strictly designated 5 lessons
  if (isFreeDesignated) {
    return {
      allowed: true,
      tier: 'free_basic_1',
      isDesignatedFreeLesson: true,
    };
  }

  // Lesson is outside Basic 1 Free allowance
  return {
    allowed: false,
    tier: 'free_basic_1',
    isDesignatedFreeLesson: false,
    reason:
      'This lesson is part of the Intermediate & Advanced Curriculum. Your Free Basic 1 plan includes the 5 core foundational lessons.',
  };
}
