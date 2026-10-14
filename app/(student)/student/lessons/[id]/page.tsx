'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { useAuth } from '@/lib/auth-context';
import { getLessonById, getCourseById, createLearnerHelpRequest } from '@/lib/api';
import { Lesson, Course } from '@/lib/types';
import { checkLessonAccess } from '@/lib/plans';
import { APPROVED_COMPUTER_WORDS } from '@/lib/approved-vocabulary';
import { AccessibleSignVideoPlayer } from '@/components/common/AccessibleSignVideoPlayer';
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
} from 'lucide-react';

export default function LessonVideoPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const lessonId = params?.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Single Predictable Sequence: Step 1 to 4 (Picture -> Sign -> Practice -> Question)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;

  // Selected Vocabulary Item for this lesson
  const vocabItem = APPROVED_COMPUTER_WORDS['webcam'];

  // Step 2 Supporting controls
  const [showVisualStory, setShowVisualStory] = useState<boolean>(false);
  const [visualStoryIndex, setVisualStoryIndex] = useState<number>(0);

  // Step 4: Practice state
  const [practiceLetters, setPracticeLetters] = useState<string[]>([]);
  const targetLetters = ['W', 'E', 'B', 'C', 'A', 'M'];

  // Step 5: Visual Question State
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Supervised Help Modal State
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar currentRole="student" stars={user?.totalStars || 25} />
        <div className="flex-1 flex items-center justify-center p-8">
          <p className="text-slate-700 text-sm font-bold">Loading visual lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar currentRole="student" stars={user?.totalStars || 25} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-black text-slate-900 mb-2">Lesson Not Found</h1>
          <p className="text-slate-600 text-sm max-w-md mb-6">
            We could not find this visual lesson. Check your lessons list.
          </p>
          <Link
            href="/student/dashboard"
            className="px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition"
          >
            Back to Lessons
          </Link>
        </div>
      </div>
    );
  }

  // Access check
  const entitlement = checkLessonAccess(user, lesson.id);
  if (!entitlement.allowed) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar currentRole="student" stars={user?.totalStars || 25} />
        <div className="flex-1 max-w-xl mx-auto px-4 py-16 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">{lesson.title}</h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            {entitlement.reason || 'This lesson requires an active subscription.'}
          </p>
          <Link
            href="/student/dashboard"
            className="px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition"
          >
            Back to Free Lessons
          </Link>
        </div>
      </div>
    );
  }

  // Practice Letter Tap
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

  // Question Answer Selection
  const handleAnswerClick = (choiceId: string) => {
    setSelectedAnswer(choiceId);
    setAttempts((prev) => prev + 1);
    if (choiceId === 'webcam') {
      setIsAnswerCorrect(true);
    } else {
      setIsAnswerCorrect(false);
    }
  };

  // Submit Supervised Help Request
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
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar currentRole="student" stars={user?.totalStars || 25} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        
        {/* Top Breadcrumb & Step Progress Indicator */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <Link
            href={course ? `/student/courses/${course.id}` : '/student/dashboard'}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition interactive-target"
          >
            <ArrowLeft className="w-4 h-4 text-teal-700" />
            <span>Back to Lessons</span>
          </Link>

          {/* Simple, clear progress indicator: "Step X of 5" */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-teal-900 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: SEE THE PICTURE */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-sm space-y-6 text-center">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800">
                Step 1 of 4 • Look at the picture
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                What do you think this is?
              </h1>
              <p className="text-sm text-slate-600 font-medium">
                Look closely at the object near the computer.
              </p>
            </div>

            <div className="max-w-md mx-auto aspect-video rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-xs">
              <img
                src={vocabItem.imageUrl}
                alt={vocabItem.word}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-8 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-base shadow-md shadow-teal-700/20 transition interactive-target flex items-center gap-2"
              >
                <span>Watch the sign</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: WATCH THE APPROVED SIGNED MEANING */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800">
                Step 2 of 4 • Signed Meaning
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                What does WEBCAM mean?
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Watch the Deaf facilitator explain the concept.
              </p>
            </div>

            {/* Accessible Player with verified Nigerian Deaf educator */}
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

            {/* When a child does not understand: Watch again, See another example, AI Clarification, Ask a facilitator */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    // Triggers player reload or replay
                    setCurrentStep(2);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold hover:bg-slate-100 transition flex items-center gap-1.5 interactive-target"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-700" />
                  <span>Watch again</span>
                </button>

                <button
                  onClick={() => setShowVisualStory(!showVisualStory)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold hover:bg-slate-100 transition flex items-center gap-1.5 interactive-target"
                >
                  <Eye className="w-3.5 h-3.5 text-teal-700" />
                  <span>See another example</span>
                </button>

                <button
                  onClick={() => openClarifyModal(vocabItem.word)}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-300 text-teal-900 font-bold hover:bg-teal-100 transition flex items-center gap-1.5 interactive-target"
                  title="Open Safe AI Clarification"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                  <span>AI Clarification</span>
                </button>
              </div>

              <button
                onClick={() => setShowHelpModal(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-bold hover:bg-amber-100 transition flex items-center gap-1.5 interactive-target"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-800" />
                <span>Ask a facilitator</span>
              </button>
            </div>

            {/* Optional 3-Frame Visual Story if requested */}
            {showVisualStory && (
              <div className="p-5 bg-teal-50 border border-teal-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-teal-900">
                    Visual Example (Frame {visualStoryIndex + 1} of 3)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setVisualStoryIndex((prev) => Math.max(0, prev - 1))}
                      disabled={visualStoryIndex === 0}
                      className="px-2.5 py-1 rounded bg-white border text-xs font-bold disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setVisualStoryIndex((prev) => Math.min(2, prev + 1))}
                      disabled={visualStoryIndex === 2}
                      className="px-2.5 py-1 rounded bg-white border text-xs font-bold disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>

                {vocabItem.visualStoryFrames && vocabItem.visualStoryFrames[visualStoryIndex] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="aspect-video bg-white rounded-xl overflow-hidden border border-teal-200">
                      <img
                        src={vocabItem.visualStoryFrames[visualStoryIndex].imageUrl}
                        alt={vocabItem.visualStoryFrames[visualStoryIndex].altText}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-bold text-teal-950">
                      &ldquo;{vocabItem.visualStoryFrames[visualStoryIndex].caption}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition interactive-target"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-8 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-base shadow-md shadow-teal-700/20 transition interactive-target flex items-center gap-2"
              >
                <span>Try it</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: PRACTISE FINGERSPELLING OR MATCHING */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-sm space-y-8 text-center">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800">
                Step 3 of 4 • Practice
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Spell the word: WEBCAM
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Tap each letter in order.
              </p>
            </div>

            {/* Answer Display Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 py-2">
              {targetLetters.map((expectedLetter, index) => {
                const filled = practiceLetters[index];
                return (
                  <div
                    key={index}
                    className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center font-mono font-black text-xl transition ${
                      filled
                        ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
                        : 'bg-slate-50 border-dashed border-slate-300 text-slate-300'
                    }`}
                  >
                    {filled || '_'}
                  </div>
                );
              })}
            </div>

            {/* Tappable Letter Bank */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {['A', 'B', 'C', 'E', 'M', 'W'].map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterTap(letter)}
                  disabled={practiceLetters.length === targetLetters.length}
                  className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-teal-50 border-2 border-slate-300 hover:border-teal-400 font-mono font-black text-lg text-slate-900 transition interactive-target"
                >
                  {letter}
                </button>
              ))}
            </div>

            {practiceLetters.length === targetLetters.length ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-black text-emerald-900 max-w-sm mx-auto flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Great practice! You spelled WEBCAM.</span>
              </div>
            ) : (
              <button
                onClick={handleResetPractice}
                className="text-xs text-slate-500 font-bold underline hover:text-slate-800"
              >
                Reset letters
              </button>
            )}

            <div className="pt-4 flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition interactive-target"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-8 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-base shadow-md shadow-teal-700/20 transition interactive-target flex items-center gap-2"
              >
                <span>Answer question</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: ANSWER ONE VISUAL QUESTION WITH SUPPORTIVE RETRY */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-sm space-y-8">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800">
                Step 4 of 4 • Visual Question
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                What helps the facilitator see the child?
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Tap one picture.
              </p>
            </div>

            {/* 3 Large Picture Cards */}
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
                    className={`p-3 rounded-2xl border-2 text-center transition flex flex-col justify-between gap-3 interactive-target ${
                      isSelected
                        ? isAnswerCorrect
                          ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200'
                          : 'border-red-500 bg-red-50 ring-2 ring-red-100'
                        : 'border-slate-200 bg-white hover:border-slate-400'
                    }`}
                  >
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={card.img} alt={card.label} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-black text-base text-slate-900">{card.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Supportive feedback — no penalty, immediate retry allowed */}
            {isAnswerCorrect === false && (
              <div className="p-4 bg-red-50 border border-red-300 rounded-2xl text-xs font-bold text-red-900 flex items-center justify-between gap-3">
                <span>Not yet. Look for the small camera.</span>
                <button
                  onClick={() => {
                    setSelectedAnswer(null);
                    setIsAnswerCorrect(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-red-300 text-red-800 text-xs font-black hover:bg-red-100 transition interactive-target"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Correct feedback */}
            {isAnswerCorrect === true && (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-xs font-bold text-emerald-950 space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-700" />
                  <span className="text-sm font-black">Yes! The webcam helps them see each other.</span>
                </div>
                <p className="text-emerald-800 font-medium">
                  You completed all 4 steps of this visual lesson.
                </p>
              </div>
            )}

            <div className="pt-4 flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition interactive-target"
              >
                Back
              </button>

              {isAnswerCorrect === true ? (
                <button
                  onClick={() => router.push('/student/dashboard')}
                  className="px-8 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-base shadow-md shadow-teal-700/20 transition interactive-target flex items-center gap-2"
                >
                  <span>You finished this lesson</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition interactive-target"
                >
                  Ask a facilitator
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* SUPERVISED HUMAN HELP MODAL */}
      {/* Requires Parent / Teacher approval check. Child safeguarding compliant. */}
      {/* ========================================================================= */}
      {showHelpModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-slate-300 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Ask a facilitator</h3>
                  <span className="text-[11px] text-slate-500 font-bold block">
                    Supervised Human Support
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-2 text-slate-400 hover:text-slate-800 rounded-xl"
              >
                ✕
              </button>
            </div>

            {helpSubmitted ? (
              <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-3">
                <Check className="w-8 h-8 text-emerald-700 mx-auto" />
                <h4 className="font-black text-emerald-950 text-base">Request Sent</h4>
                <p className="text-xs text-emerald-800 font-medium">
                  Your facilitator has received your request. A supervised session link will be sent to your parent or teacher.
                </p>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-teal-700 text-white font-bold text-xs"
                >
                  Return to lesson
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 font-medium">
                  You are not alone. Ask your parent or teacher to help you connect safely with a Deaf educator.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    What would you like help with?
                  </label>
                  <select
                    value={helpReason}
                    onChange={(e) => setHelpReason(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="sign">I do not understand the sign.</option>
                    <option value="word">I do not understand the word.</option>
                    <option value="meaning">I do not understand the meaning.</option>
                    <option value="ui">I do not know where to tap.</option>
                    <option value="facilitator">I want help from a facilitator.</option>
                  </select>
                </div>

                {/* Safeguarding approval checkbox */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                    <ShieldCheck className="w-4 h-4 text-amber-800" />
                    <span>Parent or Teacher Approval Required</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={approvalGranted}
                      onChange={(e) => setApprovalGranted(e.target.checked)}
                      className="w-4 h-4 rounded text-teal-700 focus:ring-teal-700"
                    />
                    <span>My parent or teacher is here and approves this support request.</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitHelp}
                    disabled={!approvalGranted}
                    className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white font-black text-xs transition"
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
