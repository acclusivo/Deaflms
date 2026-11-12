'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useAuth } from '@/lib/auth-context';
import { getLessonById, getCourseById, createLearnerHelpRequest } from '@/lib/api';
import { Lesson, Course } from '@/lib/types';
import { checkLessonAccess } from '@/lib/plans';
import { APPROVED_COMPUTER_WORDS } from '@/lib/approved-vocabulary';
import { AccessibleSignVideoPlayer } from '@/components/common/AccessibleSignVideoPlayer';
import { VisualCodeLab } from '@/components/student/VisualCodeLab';
import { openClarifyModal } from '@/components/student/SignyAITutorModal';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  RotateCcw,
  Check,
  HelpCircle,
  Eye,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Lock,
  Zap,
  Terminal,
  Copy,
  ExternalLink,
  Code,
  Laptop,
  Award,
  CreditCard,
  Building2,
  CheckCircle2,
} from 'lucide-react';

const OFFICIAL_BANK_DETAILS = {
  bankName: 'Zenith Bank PLC',
  accountName: 'Acclusivo Technologies Ltd (DeafLMS)',
  accountNumber: '1224567890',
};

const FRONTEND_LESSON_FLOW: Record<string, { order: number; nextId: string | null; nextTitle: string | null; exerciseIndex: number }> = {
  'lesson-frontend-1': {
    order: 1,
    nextId: 'lesson-frontend-2',
    nextTitle: 'Lesson 2: Setting up VS Code for Deaf Developers',
    exerciseIndex: 0,
  },
  'lesson-frontend-2': {
    order: 2,
    nextId: 'lesson-frontend-3',
    nextTitle: 'Lesson 3: Your First HTML Page & Boilerplate',
    exerciseIndex: 1,
  },
  'lesson-frontend-3': {
    order: 3,
    nextId: 'lesson-frontend-4',
    nextTitle: 'Lesson 4: HTML Headings & Document Hierarchy',
    exerciseIndex: 2,
  },
  'lesson-frontend-4': {
    order: 4,
    nextId: 'lesson-frontend-5',
    nextTitle: 'Lesson 5: HTML Paragraphs & Text Formatting',
    exerciseIndex: 3,
  },
  'lesson-frontend-5': {
    order: 5,
    nextId: 'lesson-frontend-6',
    nextTitle: 'Lesson 6: HTML Links & Web Navigation',
    exerciseIndex: 4,
  },
  'lesson-frontend-6': {
    order: 6,
    nextId: 'lesson-frontend-7',
    nextTitle: 'Lesson 7: Adding Images & Accessible Alt Attributes',
    exerciseIndex: 5,
  },
  'lesson-frontend-7': {
    order: 7,
    nextId: null,
    nextTitle: null,
    exerciseIndex: 6,
  },
};

export default function LessonVideoPage() {
  const params = useParams();
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const lessonId = params?.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Paywall Modal State for advancing from Lesson 1 to Lesson 2
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);
  const [confirmingPayment, setConfirmingPayment] = useState<boolean>(false);

  // Kids hardware lesson state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalKidsSteps = 4;
  const vocabItem = APPROVED_COMPUTER_WORDS['webcam'];
  const [showVisualStory, setShowVisualStory] = useState<boolean>(false);
  const [visualStoryIndex, setVisualStoryIndex] = useState<number>(0);
  const [practiceLetters, setPracticeLetters] = useState<string[]>([]);
  const targetLetters = ['W', 'E', 'B', 'C', 'A', 'M'];
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [helpReason, setHelpReason] = useState<string>('meaning');
  const [approvalGranted, setApprovalGranted] = useState<boolean>(false);
  const [helpSubmitted, setHelpSubmitted] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      if (!lessonId) return;
      setLoading(true);
      const l = await getLessonById(lessonId);
      setLesson(l);

      if (l?.courseId) {
        const c = await getCourseById(l.courseId);
        setCourse(c);
      }
      setLoading(false);
    }
    loadData();
  }, [lessonId]);

  const isEnrolledInFrontend = Boolean(user?.enrolledCourseIds?.includes('course-frontend-web-1'));

  // Copy to clipboard helper
  const handleCopy = (text: string, field: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedBankField(field);
      setTimeout(() => setCopiedBankField(null), 2500);
    } catch {
      console.warn('Clipboard write error');
    }
  };

  // Instant Payment Confirmation (Unlocks course in user profile & records confirmed payment in Supabase)
  const handleConfirmPayment = async () => {
    setConfirmingPayment(true);

    try {
      // Trigger Selar webhook to record confirmed transaction in Supabase
      const res = await fetch('/api/billing/selar/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `selar_${Date.now()}`,
          reference: `SELAR-UPGRADE-${Date.now()}`,
          amount: 5000,
          user_id: user?.id || 'demo-learner-1',
          email: user?.email || 'student@deaflms.org',
          name: user?.displayName || 'Learner',
          course_id: lesson?.courseId || 'course-frontend-web-1',
        }),
      });

      const data = await res.json();
      console.log('Selar upgrade webhook confirmed:', data);
    } catch (e) {
      console.warn('Webhook trigger error:', e);
    }

    const currentEnrolled = user?.enrolledCourseIds || [];
    const updated = Array.from(new Set([...currentEnrolled, 'course-frontend-web-1']));

    updateProfile({
      enrolledCourseIds: updated,
    });

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0f766e', '#10b981', '#f59e0b', '#3b82f6'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }

    setTimeout(() => {
      setConfirmingPayment(false);
      setShowUpgradeModal(false);
      // Navigate to Lesson 2!
      router.push('/student/lessons/lesson-frontend-2');
    }, 1200);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <p className="text-slate-700 text-sm font-bold">Loading visual sign lesson...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-black text-slate-900 mb-2">Lesson Not Found</h1>
        <p className="text-slate-600 text-sm max-w-md mb-6">
          We could not find this visual lesson. Check your syllabus.
        </p>
        <Link
          href="/student/tracks/deaf-adult"
          className="px-6 py-3 rounded-2xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-bold text-sm transition"
        >
          Back to Syllabus
        </Link>
      </div>
    );
  }

  const isFrontendLesson =
    lesson.courseId === 'course-frontend-web-1' ||
    lesson.id.startsWith('lesson-frontend-');

  const frontendFlowInfo = FRONTEND_LESSON_FLOW[lesson.id] || {
    order: lesson.orderIndex || 1,
    nextId: null,
    nextTitle: null,
    exerciseIndex: 0,
  };

  // Check access entitlement
  const entitlement = checkLessonAccess(user, lesson.id, lesson.courseId);

  // =========================================================================
  // FRONTEND PAYWALL GATE (When visiting lesson-frontend-2 through 7 without enrollment)
  // =========================================================================
  if (isFrontendLesson && !entitlement.allowed) {
    return (
      <div className="w-full">
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
          <Link
            href="/student/tracks/deaf-adult"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#64748B] hover:text-[#1F2937] bg-white border border-[#E5EAF3] px-3.5 py-2 rounded-xl transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#1B4EA7]" />
            <span>Back to Syllabus</span>
          </Link>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5EAF3] shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF7E8] text-[#8F6010] flex items-center justify-center font-black shrink-0 border border-[#F4B942]/40">
                <Lock className="w-6 h-6 text-[#8F6010]" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#8F6010] bg-[#FEF7E8] px-2.5 py-0.5 rounded-md border border-[#F4B942]/40">
                  Full Course Enrolment Required
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[#00177D] mt-1">
                  {lesson.title}
                </h1>
              </div>
            </div>

            <p className="text-sm text-[#64748B] font-medium leading-relaxed">
              Lesson 1 (Introduction to HTML) is 100% free. To advance to <strong>{lesson.title}</strong> and unlock all 7 Frontend Web Development modules in Nigerian Sign Language, upgrade to full course access.
            </p>

            {/* Pricing Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#00177D] via-[#1B4EA7] to-[#00177D] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider block">
                  One-Time Lifetime Access
                </span>
                <div className="text-3xl font-black text-white mt-0.5">
                  ₦5,000 <span className="text-sm font-bold text-[#ABB8D7]">($8 USD)</span>
                </div>
                <p className="text-xs text-sky-100 mt-1">
                  Includes all 7 NSL video lessons, live browser coding lab, and certificate.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Link
                  href="/checkout?course=course-frontend-web-1"
                  className="px-6 py-3.5 rounded-2xl bg-[#F4B942] hover:bg-[#e0a838] text-[#1F2937] font-black text-xs shadow-md transition flex items-center justify-center gap-2 interactive-target"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay via Selar (Card / Transfer)</span>
                </Link>

                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={confirmingPayment}
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F5F7FC] text-[#00177D] font-black text-xs shadow-md transition flex items-center justify-center gap-2 interactive-target"
                >
                  <Zap className="w-4 h-4 text-[#F4B942]" />
                  <span>{confirmingPayment ? 'Unlocking...' : 'Confirm & Unlock Now'}</span>
                </button>
              </div>
            </div>

            {/* Bank Transfer Details Fallback */}
            <div className="p-5 bg-[#F5F7FC] rounded-2xl border border-[#E5EAF3] space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#1B4EA7]" />
                <span className="text-xs font-black text-[#1F2937]">
                  Official Acclusivo Nigerian Bank Account (Alternative to Selar):
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#E5EAF3]">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase block">Bank Name</span>
                  <span className="font-extrabold text-[#1F2937]">{OFFICIAL_BANK_DETAILS.bankName}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E5EAF3]">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase block">Account Name</span>
                  <span className="font-extrabold text-[#1F2937]">{OFFICIAL_BANK_DETAILS.accountName}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E5EAF3] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase block">Account Number</span>
                    <span className="font-mono font-black text-[#00177D]">{OFFICIAL_BANK_DETAILS.accountNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.accountNumber, 'acc')}
                    className="p-1.5 rounded-lg bg-[#F5F7FC] hover:bg-[#E5EAF3] text-[#1F2937] text-xs font-bold transition flex items-center gap-1"
                  >
                    {copiedBankField === 'acc' ? <Check className="w-3.5 h-3.5 text-[#15803D]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBankField === 'acc' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <Link
                href="/student/lessons/lesson-frontend-1"
                className="text-[#1B4EA7] font-bold hover:underline"
              >
                ← Return to Free Lesson 1 (HTML Basics)
              </Link>
              <Link
                href="/student/tracks/deaf-adult"
                className="text-[#64748B] font-bold hover:text-[#1F2937]"
              >
                View Full Syllabus
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // FRONTEND WEB DEVELOPMENT LESSON INTERFACE
  // =========================================================================
  if (isFrontendLesson) {
    const isLesson1 = lesson.id === 'lesson-frontend-1';

    const handleProceedToNext = () => {
      // If advancing from Lesson 1 to Lesson 2 and user is NOT yet enrolled:
      if (isLesson1 && !isEnrolledInFrontend) {
        setShowUpgradeModal(true);
        return;
      }

      // If already enrolled or if next lesson is available:
      if (frontendFlowInfo.nextId) {
        router.push(`/student/lessons/${frontendFlowInfo.nextId}`);
      } else {
        // Last lesson completed!
        try {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
          });
        } catch { }
        router.push('/student/tracks/deaf-adult');
      }
    };

    return (
      <div className="w-full">
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
                 {/* Top Breadcrumb & Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5EAF3] pb-4">
            <Link
              href="/student/tracks/deaf-adult"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#64748B] hover:text-[#1F2937] bg-white border border-[#E5EAF3] px-3.5 py-2 rounded-xl transition interactive-target shadow-xs self-start"
            >
              <ArrowLeft className="w-4 h-4 text-[#1B4EA7]" />
              <span>Back to Course Syllabus</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase text-[#065A63] bg-[#E6F4F6] px-3 py-1 rounded-lg border border-[#CCEEF1]">
                Lesson {frontendFlowInfo.order} of 7 • Nigerian Sign Language
              </span>

              {isLesson1 ? (
                <span className="text-xs font-black uppercase tracking-wider text-[#15803D] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  100% Free Lesson
                </span>
              ) : isEnrolledInFrontend ? (
                <span className="text-xs font-black uppercase tracking-wider text-[#065A63] bg-[#E6F4F6] px-3 py-1 rounded-lg border border-[#CCEEF1]">
                  Full Course Unlocked
                </span>
              ) : (
                <span className="text-xs font-black uppercase tracking-wider text-[#8F6010] bg-[#FEF7E8] px-3 py-1 rounded-lg border border-[#F4B942]/40">
                  Preview
                </span>
              )}
            </div>
          </div>

          {/* Lesson Header Title */}
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-[#1B4EA7]">
              Frontend Web Development in Nigerian Sign Language
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#00177D] tracking-tight">
              {lesson.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] font-medium leading-relaxed max-w-3xl">
              {lesson.description}
            </p>
          </div>

          {/* Main Content Grid: Video Player + Code Lab */}
          <div className="space-y-8">
            
            {/* 1. Mux Video Player */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E5EAF3] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[#1F2937] flex items-center gap-1.5">
                  <Play className="w-4 h-4 text-[#1B4EA7] fill-current" />
                  <span>NSL Visual Video Instruction</span>
                </span>
                <span className="text-[11px] font-bold text-[#64748B]">
                  Mux High-Resolution Streaming • Slow-Mo Supported
                </span>
              </div>

              <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-md">
                <AccessibleSignVideoPlayer
                  source={{
                    provider: 'mux',
                    src: lesson.signVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                    fallbackSrc: '/videos/frontend-nsl-lesson-1.mp4',
                    muxPlaybackId: lesson.muxPlaybackId || 'rsjNCUwsOkAlOqacIFB4DSueCNQD9gew00lzy2x101uTI',
                    posterUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop&q=80',
                    title: lesson.title,
                    signLanguage: 'Nigerian Sign Language (NSL)',
                    durationSeconds: lesson.durationSeconds || 240,
                    reviewedBy: 'Acclusivo Deaf Review Team (Abuja, Nigeria)',
                    reviewStatus: 'approved',
                  }}
                  showTitle={false}
                />
              </div>

              {/* Technical Glossary Cards */}
              {lesson.vocabularyItems && lesson.vocabularyItems.length > 0 && (
                <div className="pt-2 border-t border-[#E5EAF3]">
                  <span className="text-xs font-black uppercase tracking-wider text-[#1F2937] block mb-2">
                    Key Technical Signs in this Lesson:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lesson.vocabularyItems.map((v) => (
                      <div key={v.id} className="p-3 bg-[#F5F7FC] rounded-2xl border border-[#E5EAF3] flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#E6F4F6] text-[#087F8C] font-black text-xs flex items-center justify-center shrink-0">
                          {v.textWord.charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-[#1F2937] text-xs sm:text-sm">{v.textWord}</span>
                            {v.fingerspellText && (
                              <span className="font-mono text-[10px] font-bold text-[#087F8C] bg-white px-1.5 py-0.5 rounded border border-[#E5EAF3]">
                                {v.fingerspellText}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#64748B] leading-snug">{v.descriptionTips}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Hands-On Visual Code Lab */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase text-[#1B4EA7] tracking-wider">
                    Hands-On Practice
                  </span>
                  <h2 className="text-xl font-black text-[#00177D]">
                    Live Browser Code Sandbox
                  </h2>
                </div>
                <span className="text-xs font-bold text-[#64748B] hidden sm:block">
                  Live code execution • 100% Client-Side Safe
                </span>
              </div>

              <VisualCodeLab
                initialExerciseIndex={frontendFlowInfo.exerciseIndex}
                hideExerciseSelector={false}
              />
            </div>

            {/* 3. Bottom Advancement Bar */}
            <div className="p-6 bg-white rounded-3xl border border-[#E5EAF3] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-xs font-bold text-[#64748B]">Lesson Progression</span>
                <h3 className="font-black text-[#1F2937] text-base">
                  {frontendFlowInfo.nextTitle
                    ? `Up Next: ${frontendFlowInfo.nextTitle}`
                    : '🎉 You have completed all 7 lessons!'}
                </h3>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/student/tracks/deaf-adult"
                  className="px-5 py-3 rounded-2xl bg-[#F5F7FC] hover:bg-[#E5EAF3] text-[#1F2937] font-bold text-xs border border-[#E5EAF3] transition"
                >
                  Syllabus
                </Link>

                <button
                  type="button"
                  onClick={handleProceedToNext}
                  className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-black text-sm shadow-md transition interactive-target flex items-center justify-center gap-2"
                >
                  <span>
                    {isLesson1 && !isEnrolledInFrontend
                      ? 'Proceed to Lesson 2 (Upgrade ₦5,000) →'
                      : frontendFlowInfo.nextId
                      ? 'Proceed to Next Lesson →'
                      : 'Claim Certificate 🎉'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* UPGRADE PAYWALL MODAL (Shown when advancing from Lesson 1 without enrolling)*/}
          {/* ========================================================================= */}
          {showUpgradeModal && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#E5EAF3] shadow-2xl space-y-6">
                
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-[#E5EAF3] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FEF7E8] text-[#8F6010] border border-[#F4B942]/40 flex items-center justify-center font-black shrink-0">
                      <Sparkles className="w-6 h-6 text-[#F4B942]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Lesson 1 Completed!
                      </span>
                      <h2 className="text-xl font-black text-[#00177D] mt-1">
                        Advance to Lesson 2: VS Code Setup
                      </h2>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="p-2 text-[#64748B] hover:text-[#1F2937] rounded-xl"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-[#64748B] font-medium leading-relaxed">
                  Congratulations on finishing your free preview of HTML Fundamentals! To proceed to <strong>Lesson 2: Setting up VS Code for Deaf Developers</strong> and unlock all 7 modules + certification, upgrade to full course access.
                </p>

                {/* Price Display Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#00177D] via-[#1B4EA7] to-[#00177D] text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#F4B942] uppercase tracking-wider block">
                      Lifetime Enrolment
                    </span>
                    <span className="text-3xl font-black text-white">₦5,000</span>
                    <span className="text-xs font-bold text-[#ABB8D7] ml-1.5">($8 USD)</span>
                  </div>
                  <span className="text-[11px] font-bold text-white bg-white/20 px-2.5 py-1 rounded-lg border border-white/25">
                    All 7 Modules Included
                  </span>
                </div>

                {/* Payment Option Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/checkout?course=course-frontend-web-1"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#F4B942] hover:bg-[#e0a838] text-[#1F2937] font-black text-xs shadow-md transition flex items-center justify-center gap-2 interactive-target"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₦5,000 via Selar (Instant Card / USSD / Bank)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={confirmingPayment}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#00177D] hover:bg-[#1B4EA7] text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 interactive-target"
                  >
                    <Zap className="w-4 h-4 text-[#F4B942]" />
                    <span>{confirmingPayment ? 'Confirming Payment...' : 'Confirm Payment & Proceed to Lesson 2'}</span>
                  </button>
                </div>

                {/* Direct Nigerian Bank Transfer Details */}
                <div className="p-4 bg-[#F5F7FC] rounded-2xl border border-[#E5EAF3] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#1F2937]">
                    <Building2 className="w-4 h-4 text-[#1B4EA7]" />
                    <span>Direct Nigerian Bank Transfer Account:</span>
                  </div>
                  <div className="text-xs text-[#64748B] flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div>
                      <strong className="text-[#1F2937]">{OFFICIAL_BANK_DETAILS.bankName}</strong> • {OFFICIAL_BANK_DETAILS.accountName}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-[#00177D] text-sm">
                        {OFFICIAL_BANK_DETAILS.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.accountNumber, 'modal_acc')}
                        className="px-2 py-1 bg-white border border-[#E5EAF3] rounded text-[11px] font-bold text-[#1F2937] hover:bg-[#F5F7FC] flex items-center gap-1"
                      >
                        {copiedBankField === 'modal_acc' ? <Check className="w-3 h-3 text-[#15803D]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedBankField === 'modal_acc' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => setShowUpgradeModal(false)}
                    className="text-[#64748B] font-bold hover:text-[#1F2937]"
                  >
                    Stay on Lesson 1
                  </button>
                  <Link
                    href="/student/tracks/deaf-adult"
                    className="text-[#1B4EA7] font-bold hover:underline"
                  >
                    Review Course Syllabus →
                  </Link>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    );
  }

  // =========================================================================
  // DEFAULT KIDS DIGITAL LITERACY & HARDWARE LESSON (Webcam / Touch Typing)
  // Preserves existing kids track functionality with no regression!
  // =========================================================================

  const handleLetterTap = (letter: string) => {
    if (practiceLetters.length < targetLetters.length) {
      const nextIndex = practiceLetters.length;
      if (targetLetters[nextIndex] === letter) {
        setPracticeLetters([...practiceLetters, letter]);
      }
    }
  };

  const handleResetPractice = () => {
    setPracticeLetters([]);
  };

  const handleAnswerClick = (choiceId: string) => {
    setSelectedAnswer(choiceId);
    setAttempts((prev) => prev + 1);
    if (choiceId === 'webcam') {
      setIsAnswerCorrect(true);
    } else {
      setIsAnswerCorrect(false);
    }
  };

  const handleSubmitHelp = async () => {
    if (!approvalGranted) return;
    await createLearnerHelpRequest({
      learnerId: user?.id || 'demo-learner',
      learnerName: user?.displayName || 'Demo Learner',
      lessonTitle: lesson.title,
      word: vocabItem.word,
      difficultyStage: (helpReason as any) || 'meaning',
      difficultyDescription: `Learner requested assistance with ${helpReason} during ${lesson.title}`,
      attemptsCount: attempts || 1,
      showMeViewed: showVisualStory,
      preferredSupport: 'short_video_call',
      approvalStatus: 'parent_approved',
    });
    setHelpSubmitted(true);
  };

  return (
    <div className="w-full">
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        
        {/* Top Breadcrumb & Step Progress */}
        <div className="flex items-center justify-between gap-4 border-b border-[#E5EAF3] pb-4">
          <Link
            href={course ? `/student/courses/${course.id}` : '/student/dashboard'}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#64748B] hover:text-[#1F2937] bg-white border border-[#E5EAF3] px-3.5 py-2 rounded-xl transition interactive-target shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#1B4EA7]" />
            <span>Back to Lessons</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-[#065A63] bg-[#E6F4F6] px-3 py-1 rounded-lg border border-[#CCEEF1]">
              Step {currentStep} of {totalKidsSteps}
            </span>
          </div>
        </div>

        {/* STEP 1: SEE THE PICTURE */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5EAF3] shadow-sm space-y-6 text-center">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#1B4EA7]">
                Step 1 of 4 • Look at the picture
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#00177D]">
                What do you think this is?
              </h1>
              <p className="text-sm text-[#64748B] font-medium">
                Look closely at the object near the computer.
              </p>
            </div>

            <div className="max-w-md mx-auto aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-[#E5EAF3] shadow-xs">
              <img
                src={vocabItem.imageUrl}
                alt={vocabItem.word}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-8 py-4 rounded-2xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-black text-base shadow-md transition interactive-target flex items-center gap-2"
              >
                <span>Watch the sign</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: WATCH SIGNED MEANING */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5EAF3] shadow-sm space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-[#1B4EA7]">
                Step 2 of 4 • Signed Meaning
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#00177D]">
                What does WEBCAM mean?
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium">
                Watch the Deaf facilitator explain the concept.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <AccessibleSignVideoPlayer
                source={{
                  provider: 'local',
                  src: '/videos/signed-meaning-webcam.mp4',
                  fallbackSrc: vocabItem.signedMeaningVideoUrl,
                  posterUrl: vocabItem.signedMeaningPosterUrl || '/images/posters/signed-meaning-webcam.jpg',
                  title: 'What does WEBCAM mean? — Signed Explanation',
                  signLanguage: 'Nigerian Sign Language (NSL)',
                  durationSeconds: 28,
                  reviewedBy: 'Acclusivo Deaf Review Team (Abuja)',
                  reviewStatus: 'approved',
                }}
              />
            </div>

            <div className="p-4 bg-[#F5F7FC] rounded-2xl border border-[#E5EAF3] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#E5EAF3] text-[#1F2937] font-bold hover:bg-[#F5F7FC] transition flex items-center gap-1.5 interactive-target"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Watch again</span>
                </button>

                <button
                  onClick={() => setShowVisualStory(!showVisualStory)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#E5EAF3] text-[#1F2937] font-bold hover:bg-[#F5F7FC] transition flex items-center gap-1.5 interactive-target"
                >
                  <Eye className="w-3.5 h-3.5 text-[#1B4EA7]" />
                  <span>See another example</span>
                </button>

                <button
                  onClick={() => openClarifyModal(vocabItem.word)}
                  className="px-3.5 py-2 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] text-[#3847AF] font-bold hover:bg-[#E0E7FF] transition flex items-center gap-1.5 interactive-target"
                  title="Open Ayo AI Tutor Clarification"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#3847AF]" />
                  <span>AI Clarification</span>
                </button>
              </div>

              <button
                onClick={() => setShowHelpModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#FEF7E8] border border-[#F4B942]/40 text-[#8F6010] font-bold hover:bg-[#FDEFD3] transition flex items-center gap-1.5 interactive-target"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#8F6010]" />
                <span>Ask a facilitator</span>
              </button>
            </div>

            {showVisualStory && (
              <div className="p-5 bg-[#E6F4F6] border border-[#CCEEF1] rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-[#065A63]">
                    Visual Example (Frame {visualStoryIndex + 1} of 3)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setVisualStoryIndex((prev) => Math.max(0, prev - 1))}
                      disabled={visualStoryIndex === 0}
                      className="px-2.5 py-1 rounded bg-white border border-[#CCEEF1] text-xs font-bold text-[#065A63] disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setVisualStoryIndex((prev) => Math.min(2, prev + 1))}
                      disabled={visualStoryIndex === 2}
                      className="px-2.5 py-1 rounded bg-white border border-[#CCEEF1] text-xs font-bold text-[#065A63] disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>

                {vocabItem.visualStoryFrames && vocabItem.visualStoryFrames[visualStoryIndex] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="aspect-video bg-white rounded-xl overflow-hidden border border-[#CCEEF1]">
                      <img
                        src={vocabItem.visualStoryFrames[visualStoryIndex].imageUrl}
                        alt={vocabItem.visualStoryFrames[visualStoryIndex].altText}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-bold text-[#065A63]">
                      &ldquo;{vocabItem.visualStoryFrames[visualStoryIndex].caption}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-3 rounded-2xl bg-[#F5F7FC] text-[#1F2937] font-bold text-sm hover:bg-[#E5EAF3] border border-[#E5EAF3] transition interactive-target"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-8 py-4 rounded-2xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-black text-base shadow-md transition interactive-target flex items-center gap-2"
              >
                <span>Try it</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PRACTISE FINGERSPELLING */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5EAF3] shadow-sm space-y-8 text-center">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#1B4EA7]">
                Step 3 of 4 • Practice
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#00177D]">
                Spell the word: WEBCAM
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium">
                Tap each letter in order.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 py-2">
              {targetLetters.map((expectedLetter, index) => {
                const filled = practiceLetters[index];
                return (
                  <div
                    key={index}
                    className={`w-12 h-14 rounded-2xl border flex items-center justify-center font-mono font-black text-xl transition ${
                      filled
                        ? 'bg-[#087F8C] text-white border-[#065A63] shadow-sm'
                        : 'bg-[#F5F7FC] border-dashed border-[#ABB8D7] text-[#64748B]'
                    }`}
                  >
                    {filled || '_'}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {['A', 'B', 'C', 'E', 'M', 'W'].map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterTap(letter)}
                  disabled={practiceLetters.length === targetLetters.length}
                  className="w-12 h-12 rounded-xl bg-[#F5F7FC] hover:bg-[#E6F4F6] border border-[#E5EAF3] hover:border-[#087F8C] font-mono font-black text-lg text-[#1F2937] transition interactive-target"
                >
                  {letter}
                </button>
              ))}
            </div>

            {practiceLetters.length === targetLetters.length ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-black text-[#15803D] max-w-sm mx-auto flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-[#15803D]" />
                <span>Great practice! You spelled WEBCAM.</span>
              </div>
            ) : (
              <button
                onClick={handleResetPractice}
                className="text-xs text-[#64748B] font-bold underline hover:text-[#1F2937]"
              >
                Reset letters
              </button>
            )}

            <div className="pt-4 flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-3 rounded-2xl bg-[#F5F7FC] text-[#1F2937] font-bold text-sm hover:bg-[#E5EAF3] border border-[#E5EAF3] transition interactive-target"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-8 py-4 rounded-2xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-black text-base shadow-md transition interactive-target flex items-center gap-2"
              >
                <span>Answer question</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ANSWER ONE VISUAL QUESTION */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5EAF3] shadow-sm space-y-8">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-[#1B4EA7]">
                Step 4 of 4 • Visual Question
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#00177D]">
                What helps the facilitator see the child?
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium">
                Tap one picture.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'webcam', label: 'Webcam', img: '/images/hardware/webcam.jpg' },
                { id: 'keyboard', label: 'Keyboard', img: '/images/hardware/keyboard.jpg' },
                { id: 'mouse', label: 'Mouse', img: '/images/hardware/mouse.jpg' },
              ].map((card) => {
                const isSelected = selectedAnswer === card.id;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleAnswerClick(card.id)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col justify-between gap-3 interactive-target ${
                      isSelected
                        ? isAnswerCorrect
                          ? 'border-[#15803D] bg-emerald-50 ring-2 ring-emerald-200'
                          : 'border-[#B91C1C] bg-red-50 ring-2 ring-red-100'
                        : 'border-[#E5EAF3] bg-white hover:border-[#1B4EA7]'
                    }`}
                  >
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-[#E5EAF3]">
                      <img src={card.img} alt={card.label} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-black text-base text-[#1F2937]">{card.label}</span>
                  </button>
                );
              })}
            </div>

            {isAnswerCorrect === false && (
              <div className="p-4 bg-red-50 border border-red-300 rounded-2xl text-xs font-bold text-[#B91C1C] flex items-center justify-between gap-3">
                <span>Not yet. Look for the small camera.</span>
                <button
                  onClick={() => {
                    setSelectedAnswer(null);
                    setIsAnswerCorrect(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-red-300 text-[#B91C1C] text-xs font-black hover:bg-red-100 transition interactive-target"
                >
                  Try again
                </button>
              </div>
            )}

            {isAnswerCorrect === true && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-[#15803D] space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#15803D]" />
                  <span className="text-sm font-black">Yes! The webcam helps them see each other.</span>
                </div>
                <p className="text-[#15803D] font-medium">
                  You completed all 4 steps of this visual lesson.
                </p>
              </div>
            )}

            <div className="pt-4 flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-3 rounded-2xl bg-[#F5F7FC] text-[#1F2937] font-bold text-sm hover:bg-[#E5EAF3] border border-[#E5EAF3] transition interactive-target"
              >
                Back
              </button>

              {isAnswerCorrect === true ? (
                <button
                  onClick={() => router.push('/student/dashboard')}
                  className="px-8 py-4 rounded-2xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-black text-base shadow-md transition interactive-target flex items-center gap-2"
                >
                  <span>You finished this lesson</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#F5F7FC] hover:bg-[#E5EAF3] text-[#1F2937] font-bold text-xs border border-[#E5EAF3] transition interactive-target"
                >
                  Ask a facilitator
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* SUPERVISED HELP MODAL */}
      {showHelpModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E5EAF3] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5EAF3] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#FEF7E8] text-[#8F6010] border border-[#F4B942]/40 flex items-center justify-center font-black">
                  <HelpCircle className="w-5 h-5 text-[#8F6010]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#00177D]">Ask a facilitator</h3>
                  <span className="text-[11px] text-[#64748B] font-bold block">
                    Supervised Human Support
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-2 text-[#64748B] hover:text-[#1F2937] rounded-xl"
              >
                ✕
              </button>
            </div>

            {helpSubmitted ? (
              <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-3">
                <Check className="w-8 h-8 text-[#15803D] mx-auto" />
                <h4 className="font-black text-[#15803D] text-base">Request Sent</h4>
                <p className="text-xs text-[#15803D] font-medium">
                  Your facilitator has received your request. A supervised session link will be sent to your parent or teacher.
                </p>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#1B4EA7] text-white font-bold text-xs"
                >
                  Return to lesson
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#64748B] font-medium">
                  You are not alone. Ask your parent or teacher to help you connect safely with a Deaf educator.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1F2937] block">
                    What would you like help with?
                  </label>
                  <select
                    value={helpReason}
                    onChange={(e) => setHelpReason(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E5EAF3] text-xs font-semibold text-[#1F2937]"
                  >
                    <option value="sign">I do not understand the sign.</option>
                    <option value="word">I do not understand the word.</option>
                    <option value="meaning">I do not understand the meaning.</option>
                    <option value="ui">I do not know where to tap.</option>
                    <option value="facilitator">I want help from a facilitator.</option>
                  </select>
                </div>

                <div className="p-3 bg-[#FEF7E8] border border-[#F4B942]/40 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-[#8F6010]">
                    <ShieldCheck className="w-4 h-4 text-[#8F6010]" />
                    <span>Parent or Teacher Approval Required</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-medium text-[#1F2937] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={approvalGranted}
                      onChange={(e) => setApprovalGranted(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1B4EA7] focus:ring-[#1B4EA7]"
                    />
                    <span>My parent or teacher is here and approves this support request.</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#F5F7FC] text-[#64748B] font-bold text-xs border border-[#E5EAF3]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitHelp}
                    disabled={!approvalGranted}
                    className="px-6 py-2.5 rounded-xl bg-[#1B4EA7] hover:bg-[#00177D] disabled:opacity-40 text-white font-black text-xs transition"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
