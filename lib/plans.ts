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
    name: 'Family & Ally Supporter',
    badge: 'Recommended for Families',
    tagline: 'Complete access to K-12 STEM signs, storybooks, and home vocabulary drills.',
    highlighted: true,
    price: {
      amountUsd: 8,
      amountNgn: 5000,
      formatted: '₦5,000 / $8',
      billingInterval: 'per month • cancel anytime',
    },
    features: [
      { label: 'Everything in Free Basic 1', included: true },
      { label: 'Complete K-12 Curriculum (All 24+ Modules)', included: true },
      { label: 'Full Interactive Storybook Library', included: true },
      { label: 'STEM & Solar System Sign Modules', included: true },
      { label: 'Signy AI Visual Tutor (50 requests / day)', included: true },
      { label: 'Priority Nigerian Sign Language (NSL) Video Streaming', included: true },
      { label: 'Synchronized Family Progress Tracker', included: true },
      { label: 'Institutional School Roster Admin', included: false, note: 'School Tier' },
    ],
    moduleAllowance: {
      courseId: '*',
      moduleId: '*',
      lessonIds: [],
      isFullAccess: true,
    },
    aiAllowanceDaily: 50,
    isPaid: true,
    ctaText: 'Upgrade to Family Supporter',
  },
  school_institutional: {
    id: 'school_institutional',
    name: 'School & Special Ed Academy',
    badge: 'Institutional License',
    tagline: 'District-wide inclusive education platform for special education schools and deaf academies.',
    price: {
      amountUsd: 49,
      amountNgn: 45000,
      formatted: 'Custom Institutional',
      billingInterval: 'Annual district licensing',
    },
    features: [
      { label: 'Everything in Family Supporter', included: true },
      { label: 'Unlimited Certified Educator Seats', included: true },
      { label: 'Facilitator Studio & AI Lesson Generator', included: true },
      { label: 'Student Cohort Gradebooks & IEP Progress Reports', included: true },
      { label: 'School Custom Handshape Photo Hubs', included: true },
      { label: 'NERDC Special Needs Curriculum Mapping', included: true },
      { label: 'Dedicated Accessibility Technical Onboarding', included: true },
      { label: 'Audit-Ready WCAG 2.2 AAA Compliance Logs', included: true },
    ],
    moduleAllowance: {
      courseId: '*',
      moduleId: '*',
      lessonIds: [],
      isFullAccess: true,
    },
    aiAllowanceDaily: 500,
    isPaid: true,
    ctaText: 'Contact for School Pilot',
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
