'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  DEMO_WORDS_STEPS,
  APPROVED_COMPUTER_WORDS,
  DemoStepItem,
  AI_ROLE_BOUNDARY_STATEMENT,
} from '@/lib/approved-vocabulary';
import { AccessibleSignVideoPlayer } from '@/components/common/AccessibleSignVideoPlayer';
import { createLearnerHelpRequest } from '@/lib/api';
import { SignyAITutorModal, openClarifyModal } from '@/components/student/SignyAITutorModal';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Laptop,
  Eye,
  Camera,
  Hand,
  BookOpen,
  CheckSquare,
  Trophy,
  Lock,
  Clock,
  Sparkles,
  HelpCircle,
  Video,
  Calendar,
  PhoneCall,
  UserCheck,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Award,
  X,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type FlowStep = 1 | 2 | 3 | 4 | 5 | 6;

const LESSON_ORDER = ['webcam', 'keyboard', 'mouse', 'monitor'];

function DemoContent() {
  const searchParams = useSearchParams();
  const isPitchParam = searchParams.get('pitch') === 'true';

  const [isPitchMode, setIsPitchMode] = useState<boolean>(isPitchParam);
  const [selectedWordKey, setSelectedWordKey] = useState<string>('webcam');
  const activeWord: DemoStepItem = DEMO_WORDS_STEPS[selectedWordKey] || DEMO_WORDS_STEPS.webcam;

  // Learner Flow: 6 Discrete Steps (Picture -> Word Sign -> Meaning Sign -> Show Me -> Practice -> Human Help)
  const [currentStep, setCurrentStep] = useState<FlowStep>(1);

  // Step 4 (Show Me Visually) Story Stepper (3 frames)
  const [activeStoryFrameIndex, setActiveStoryFrameIndex] = useState<number>(0);

  // Step 6: Practice & Retry tracking
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<string | null>(null);
  const [practiceAnswerState, setPracticeAnswerState] = useState<'correct' | 'incorrect' | null>(null);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [retryOccurred, setRetryOccurred] = useState<boolean>(false);

  // Step 7: Supervised Human Support State
  const [selectedHelpReason, setSelectedHelpReason] = useState<string>('I do not understand the meaning.');
  const [selectedSupportType, setSelectedSupportType] = useState<'video_call' | 'video_question' | 'session'>('video_call');
  const [approvalGranted, setApprovalGranted] = useState<boolean>(true); // Parent approved by default for pitch demo
  const [helpRequestSubmitted, setHelpRequestSubmitted] = useState<boolean>(false);

  // Timer & Pitch Pace State
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [unlockedWords, setUnlockedWords] = useState<string[]>(['webcam']);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [showTestimonialModal, setShowTestimonialModal] = useState<boolean>(false);

  // Start timer automatically when pitch mode is enabled
  useEffect(() => {
    if (isPitchMode) {
      setIsTimerRunning(true);
    }
  }, [isPitchMode]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Restart Entire Demo
  const handleRestartDemo = (wordKey = 'webcam') => {
    setSelectedWordKey(wordKey);
    setCurrentStep(1);
    setActiveStoryFrameIndex(0);
    setSelectedPracticeOption(null);
    setPracticeAnswerState(null);
    setAttemptCount(0);
    setRetryOccurred(false);
    setHelpRequestSubmitted(false);
    setSecondsElapsed(0);
    setIsTimerRunning(true);
  };

  // Practice Option Handler with Supportive Retry
  const handleSelectPracticeOption = (optionId: string, isCorrect: boolean) => {
    setSelectedPracticeOption(optionId);
    setAttemptCount((prev) => prev + 1);

    if (isCorrect) {
      setPracticeAnswerState('correct');
      setCompletedWords((prev) => Array.from(new Set([...prev, selectedWordKey])));
      const currentIndex = LESSON_ORDER.indexOf(selectedWordKey);
      if (currentIndex >= 0 && currentIndex < LESSON_ORDER.length - 1) {
        setUnlockedWords((prev) => Array.from(new Set([...prev, LESSON_ORDER[currentIndex + 1]])));
      }
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}
    } else {
      setPracticeAnswerState('incorrect');
      setRetryOccurred(true);
    }
  };

  // Submit Supervised Help Request (Pitch demo specification)
  const handleSubmitHelpRequest = async () => {
    await createLearnerHelpRequest({
      learnerId: 'user-student-1',
      learnerName: 'Demo Learner (Amina)',
      lessonTitle: 'Computer Basics',
      word: activeWord.word,
      difficultyStage: 'meaning',
      difficultyDescription: selectedHelpReason,
      attemptsCount: Math.max(1, attemptCount),
      showMeViewed: true,
      preferredSupport: 'short_video_call',
      approvalStatus: approvalGranted ? 'parent_approved' : 'pending',
      approvalContact: 'Parent / Teacher Confirmed',
    });
    setHelpRequestSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-700 selection:text-white">
      {/* ========================================================================= */}
      {/* TOP PITCH BAR & TIMER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition interactive-target"
              aria-label="Back to Homepage"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900">
                  Deaf<span className="text-teal-700">LMS</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-teal-50 text-teal-800 rounded-md border border-teal-200">
                  {isPitchMode ? '60-Second Pitch Mode' : 'Learner Journey'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold hidden sm:block">
                Picture → Sign → Signed Meaning → Practice → Retry → Supervised Support
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* 60-Second Pitch Timer with gentle 50s cue */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition ${
                secondsElapsed >= 60
                  ? 'bg-slate-100 text-slate-800 border-slate-300'
                  : secondsElapsed >= 50
                  ? 'bg-amber-100 text-amber-950 border-amber-300 animate-pulse'
                  : 'bg-teal-50 text-teal-900 border-teal-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              <span>
                {secondsElapsed}s / 60s
              </span>
              {secondsElapsed >= 50 && secondsElapsed < 60 && (
                <span className="hidden md:inline text-[10px] uppercase font-black text-amber-800 ml-1">
                  (10s left)
                </span>
              )}
            </div>

            {/* Real Learners Video Button for Pitch Day */}
            <button
              type="button"
              onClick={() => setShowTestimonialModal(true)}
              className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 font-extrabold text-xs transition flex items-center gap-1.5 interactive-target shadow-2xs"
              aria-label="Watch Real Learners Video"
            >
              <Play className="w-3.5 h-3.5 fill-teal-800 text-teal-800" />
              <span className="hidden sm:inline">Learners Testimonial (2m)</span>
            </button>

            {/* Restart Demo Button */}
            <button
              onClick={() => handleRestartDemo(selectedWordKey)}
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition flex items-center gap-1.5 interactive-target"
              aria-label="Restart Demo from Step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restart Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* 50-Second Gentle Cue Banner (Non-blocking) */}
      {secondsElapsed >= 50 && secondsElapsed <= 65 && (
        <div className="bg-amber-500 text-slate-950 py-1 px-4 text-center text-xs font-black flex items-center justify-center gap-2 animate-fade-in shadow-xs">
          <AlertCircle className="w-4 h-4 text-slate-950 shrink-0" />
          <span>
            10 seconds remaining — Concluding journey: Picture. Sign. Visual Meaning. Practice. Human Support.
          </span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Pitch Navigation Header & Word Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              Active Lesson:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900">{activeWord.word}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-teal-100 text-teal-800">
                Lesson {LESSON_ORDER.indexOf(selectedWordKey) + 1} of 4 • Computer Basics
              </span>
            </div>
          </div>

          {/* Word Switcher (Disabled in strict pitch mode to prevent accidental exit, clickable otherwise) */}
          {!isPitchMode ? (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {LESSON_ORDER.map((wKey, idx) => {
                const isCurrent = selectedWordKey === wKey;
                return (
                  <button
                    key={wKey}
                    onClick={() => handleRestartDemo(wKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition interactive-target flex items-center gap-1 ${
                      isCurrent
                        ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-400'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{wKey}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-right">
              <span className="text-xs font-black text-teal-800 uppercase block">
                Standard Pitch Journey
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                Single Focused Flow (Webcam)
              </span>
            </div>
          )}
        </div>

        {/* 6-Step Visual Sequence Progress Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-black text-slate-700 gap-1">
            <span className="text-teal-800">
              Step {currentStep} of 6:
            </span>
            <span className="text-slate-900 font-bold">
              {currentStep === 1 && '1. Look at Picture (Real Object Anchor)'}
              {currentStep === 2 && '2. Watch Vocabulary Sign Video (Word Gesture)'}
              {currentStep === 3 && '3. Watch Signed Meaning Video (Facilitator Explanation)'}
              {currentStep === 4 && '4. Show Me Visually (3-Frame Real Story)'}
              {currentStep === 5 && '5. Practice & Supportive Retry'}
              {currentStep === 6 && '6. Supervised Human Support'}
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`flex-1 h-full transition-all duration-300 ${
                  s < currentStep
                    ? 'bg-teal-700 border-r border-white/40'
                    : s === currentStep
                    ? 'bg-amber-500 border-r border-white/40 animate-pulse'
                    : 'bg-slate-200 border-r border-white/40'
                }`}
              />
            ))}
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 pt-1 text-center">
            {[
              { num: 1, label: 'Picture' },
              { num: 2, label: 'Word Sign' },
              { num: 3, label: 'Meaning Sign' },
              { num: 4, label: 'Show Me' },
              { num: 5, label: 'Practice' },
              { num: 6, label: 'Human Help' },
            ].map((st) => (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num as FlowStep)}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-black uppercase transition ${
                  currentStep === st.num
                    ? 'bg-teal-100 text-teal-900 ring-1 ring-teal-400'
                    : currentStep > st.num
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {st.num}. {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: SEE (0–7 SECONDS) */}
        {/* Large familiar picture anchor; "What do you think this is?" */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-teal-700" />
                Step 1: See
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Look at the picture.
              </h2>
              <p className="text-sm font-bold text-slate-600">
                What do you think this is?
              </p>
            </div>

            {/* Single Large Focused Physical Object Photo */}
            <div className="relative rounded-2xl border-2 border-teal-300 bg-slate-950 overflow-hidden shadow-md">
              <div className="aspect-16/10 sm:aspect-2/1 w-full bg-slate-950 flex items-center justify-center p-4 relative">
                <img
                  src={activeWord.pictureUrl}
                  alt={`Real physical ${activeWord.word} device`}
                  className="w-72 h-72 object-contain rounded-xl"
                />

                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1 rounded-full bg-teal-800/90 text-white font-black text-xs uppercase tracking-wider backdrop-blur-sm border border-teal-500/50 flex items-center gap-1.5 shadow-sm">
                    <Laptop className="w-3.5 h-3.5" />
                    Physical Computer Device
                  </span>
                </div>
              </div>

              <div className="bg-slate-900 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold">
                  Notice the lens and how it sits on top of the computer.
                </span>
                <span className="text-teal-400 font-bold hidden sm:inline">
                  Step 1 of 7
                </span>
              </div>
            </div>

            {/* Advance without typing */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-7 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-md shadow-teal-200 transition interactive-target flex items-center gap-2"
              >
                <span>Next: Watch the Sign</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: VOCABULARY SIGN VIDEO (7–15 SECONDS) */}
        {/* Demonstrates how to sign one individual word */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <Hand className="w-4 h-4 text-teal-700" />
                Step 2: Vocabulary Sign Video
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Watch the sign for {activeWord.word}.
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                This demonstrates how to sign the single word in Nigerian Sign Language.
              </p>
            </div>

            {/* Approved Vocabulary Sign Video Player */}
            <AccessibleSignVideoPlayer
              source={{
                provider: 'local',
                src: '/videos/webcam-sign.mp4',
                fallbackSrc: activeWord.vocabularySignVideoUrl,
                posterUrl: activeWord.vocabularySignPosterUrl,
                title: `Vocabulary Sign Demonstration: ${activeWord.word}`,
                signLanguage: activeWord.regionalVariant,
                durationSeconds: 12,
                reviewedBy: activeWord.reviewedBy,
                reviewStatus: 'approved',
              }}
              onStartDemoClick={() => setCurrentStep(3)}
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition interactive-target"
              >
                ← Look at Picture Again
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-7 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-md shadow-teal-200 transition interactive-target flex items-center gap-2"
              >
                <span>Next: Watch Signed Meaning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: SIGNED MEANING VIDEO (15–29 SECONDS) */}
        {/* Deaf facilitator explains the concept using familiar local signs, pointing, real object */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-teal-700" />
                Step 3: Signed Meaning Video
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                What does {activeWord.word} mean?
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Instruction: Watch the explanation.
              </p>
            </div>

            {/* Separate Facilitator Meaning Video Player */}
            <AccessibleSignVideoPlayer
              source={{
                provider: 'local',
                src: '/videos/webcam-meaning.mp4',
                fallbackSrc: activeWord.signedMeaningVideoUrl,
                posterUrl: activeWord.signedMeaningPosterUrl,
                title: `Facilitator Signed Meaning: ${activeWord.word}`,
                signLanguage: activeWord.regionalVariant,
                durationSeconds: 24,
                reviewedBy: activeWord.reviewedBy,
                reviewStatus: 'approved',
              }}
              onStartDemoClick={() => setCurrentStep(4)}
            />

            {/* Facilitator Communicated Signed Meaning Quote */}
            <div className="p-4 rounded-2xl bg-teal-50 border-2 border-teal-200 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <span className="font-black uppercase tracking-wider text-teal-900 block">
                  Facilitator Communicated Meaning:
                </span>
                <p className="text-teal-950 font-semibold leading-relaxed">
                  &ldquo;{activeWord.signedMeaningText}&rdquo;
                </p>
              </div>
            </div>

            {/* Step 3 Action Controls: Show Me, I Still Need Help, Next */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition interactive-target"
              >
                ← Watch Sign Again
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => openClarifyModal(activeWord.word)}
                  className="px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-300 hover:bg-teal-100 text-teal-900 font-bold text-xs transition interactive-target flex items-center gap-1.5"
                  title="Clarify Word with Safe AI"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                  <span>AI Clarification</span>
                </button>

                <button
                  onClick={() => setCurrentStep(6)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition interactive-target flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>I Still Need Help</span>
                </button>

                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-md shadow-teal-200 transition interactive-target flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Next: Show Me Visually</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: SHOW ME VISUALLY (3-FRAME REAL STORY) (29–39 SECONDS) */}
        {/* 1: "I sit near webcam" -> 2: "Webcam shows me online" -> 3: "Facilitator sees me" */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-teal-700" />
                  Step 4: Show Me Visually
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Reviewed 3-Frame Visual Story
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-black uppercase">
                Frame {activeStoryFrameIndex + 1} of {activeWord.visualStoryFrames.length}
              </span>
            </div>

            {/* Active Story Frame Display */}
            {activeWord.visualStoryFrames[activeStoryFrameIndex] && (() => {
              const frame = activeWord.visualStoryFrames[activeStoryFrameIndex];
              return (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-slate-800 shadow-lg bg-slate-950 aspect-video flex items-center justify-center">
                    <img
                      src={frame.imageUrl}
                      alt={frame.altText}
                      className="w-full h-full object-cover"
                    />

                    {/* Frame Caption Badge */}
                    <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700 text-white flex items-center justify-between gap-3 shadow-xl">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block">
                          Story Frame {frame.order}:
                        </span>
                        <p className="text-base sm:text-lg font-black text-white">
                          &ldquo;{frame.caption}&rdquo;
                        </p>
                      </div>
                      <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {frame.order}
                      </span>
                    </div>
                  </div>

                  {/* Frame Navigation Buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setActiveStoryFrameIndex((prev) => Math.max(0, prev - 1))}
                      disabled={activeStoryFrameIndex === 0}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-bold text-xs transition interactive-target flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous Frame</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {activeWord.visualStoryFrames.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveStoryFrameIndex(idx)}
                          className={`w-3 h-3 rounded-full transition ${
                            activeStoryFrameIndex === idx
                              ? 'bg-teal-700 scale-125'
                              : 'bg-slate-300 hover:bg-slate-400'
                          }`}
                          aria-label={`Jump to Frame ${idx + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        setActiveStoryFrameIndex((prev) =>
                          Math.min(activeWord.visualStoryFrames.length - 1, prev + 1)
                        )
                      }
                      disabled={activeStoryFrameIndex === activeWord.visualStoryFrames.length - 1}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-bold text-xs transition interactive-target flex items-center gap-1.5"
                    >
                      <span>Next Frame</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 3-Frame Preview Strip for Projector & Desktop */}
            <div className="hidden md:grid grid-cols-3 gap-3 pt-2">
              {activeWord.visualStoryFrames.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => setActiveStoryFrameIndex(i)}
                  className={`p-2.5 rounded-2xl border-2 text-left transition flex flex-col gap-2 ${
                    activeStoryFrameIndex === i
                      ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-300'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
                    <img src={f.imageUrl} alt={f.altText} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-black text-slate-900 truncate">
                    {i + 1}. {f.caption}
                  </span>
                </button>
              ))}
            </div>

            {/* Story Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition interactive-target flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Watch Sign Again</span>
                </button>

                <button
                  onClick={() => setCurrentStep(6)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition interactive-target"
                >
                  I Still Need Help
                </button>
              </div>

              <button
                onClick={() => setCurrentStep(5)}
                className="px-7 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-md shadow-teal-200 transition interactive-target flex items-center gap-2"
              >
                <span>Check My Understanding (Practice)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: PRACTICE & RETRY (39–50 SECONDS) */}
        {/* Question: "What helps the facilitator see the child?" */}
        {/* 3 cards: Webcam, Keyboard, Mouse. Entire card clickable. */}
        {/* Wrong response: "Not yet. Look for the small camera." (Immediate retry) */}
        {/* Correct response: "Yes! The webcam helps them see each other." */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-teal-700" />
                Step 5: Practice &amp; Retry
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {activeWord.meaningQuestion.questionText}
              </h2>
              <p className="text-xs text-teal-900 font-black uppercase tracking-wide">
                Instruction: Tap one picture.
              </p>
            </div>

            {/* Picture Choice Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activeWord.meaningQuestion.options.map((opt) => {
                const isSelected = selectedPracticeOption === opt.id;
                const isCorrectChoice = opt.isCorrect;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectPracticeOption(opt.id, opt.isCorrect)}
                    className={`p-4 rounded-3xl border-3 text-left transition flex flex-col justify-between gap-3 interactive-target ${
                      isSelected
                        ? isCorrectChoice
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-4 ring-emerald-200 shadow-md'
                          : 'bg-rose-50 border-rose-500 text-rose-950 ring-4 ring-rose-200 shadow-md'
                        : 'bg-slate-50 border-slate-200 hover:border-teal-400 hover:bg-slate-100 text-slate-900 shadow-xs'
                    }`}
                    aria-label={`Select ${opt.label}`}
                  >
                    {opt.imageUrl && (
                      <div className="w-full aspect-4/3 rounded-2xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-2">
                        <img
                          src={opt.imageUrl}
                          alt={opt.label}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="w-full flex items-center justify-between gap-2 pt-1">
                      <span className="text-lg font-black">{opt.label}</span>
                      {isSelected && (
                        <span
                          className={`text-xs uppercase font-black px-2.5 py-1 rounded-lg ${
                            isCorrectChoice
                              ? 'bg-emerald-200 text-emerald-900'
                              : 'bg-rose-200 text-rose-900'
                          }`}
                        >
                          {isCorrectChoice ? '✓ Correct' : '✕ Try Again'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Supportive Feedback Area */}
            {practiceAnswerState === 'incorrect' && (
              <div className="p-4 sm:p-5 bg-rose-50 border-2 border-rose-200 rounded-2xl text-rose-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black shrink-0">
                    ✕
                  </div>
                  <div>
                    <h4 className="text-sm font-black">
                      {activeWord.meaningQuestion.wrongFeedback}
                    </h4>
                    <p className="text-xs text-rose-800 font-medium">
                      Immediate retry without shame or penalty. Look closely at the picture on the camera.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPracticeOption(null);
                    setPracticeAnswerState(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shrink-0 interactive-target flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Now</span>
                </button>
              </div>
            )}

            {practiceAnswerState === 'correct' && (
              <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-950 space-y-2 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-base font-black">
                      {activeWord.meaningQuestion.correctFeedback}
                    </h4>
                    <p className="text-xs text-emerald-800 font-medium">
                      You connected the physical webcam with the online facilitator call!
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-200">
                  <span className="text-xs font-bold text-emerald-800">
                    Attempts taken: {attemptCount} {retryOccurred && '(Supported Retry Logged)'}
                  </span>

                  <button
                    onClick={() => setCurrentStep(6)}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition interactive-target flex items-center gap-2"
                  >
                    <span>Continue to Step 6: Support &amp; Facilitator Help</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition interactive-target"
              >
                ← Back to Visual Story
              </button>

              <button
                onClick={() => setCurrentStep(6)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition interactive-target flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>I Still Need Help</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: SUPERVISED HUMAN SUPPORT (50–60 SECONDS) */}
        {/* 5 Difficulty Reasons, Parent/Teacher Approval, Simulated Functional Request */}
        {/* "You are not alone. Ask your parent or teacher to help you connect." */}
        {/* ========================================================================= */}
        {currentStep === 6 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-teal-700" />
                Step 6: Supervised Human Help
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                You are not alone.
              </h2>
              <p className="text-sm font-bold text-teal-900">
                Ask your parent or teacher to help you connect safely.
              </p>
            </div>

            {!helpRequestSubmitted ? (
              <div className="space-y-5">
                {/* 5 Difficulty Options */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                    What was difficult for you?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      'I do not understand the sign.',
                      'I do not understand the word.',
                      'I do not understand the meaning.',
                      'I do not know where to tap.',
                      'I want help from a facilitator.',
                    ].map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setSelectedHelpReason(reason)}
                        className={`p-3 rounded-2xl border-2 text-left text-xs font-extrabold transition interactive-target flex items-center justify-between ${
                          selectedHelpReason === reason
                            ? 'border-teal-700 bg-teal-50 text-teal-950 ring-2 ring-teal-300'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <span>{reason}</span>
                        {selectedHelpReason === reason && (
                          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3 Safe Support Session Modalities */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                    Choose Support Format:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedSupportType('video_call')}
                      className={`p-4 rounded-2xl border-2 text-left transition flex flex-col gap-2 ${
                        selectedSupportType === 'video_call'
                          ? 'border-teal-700 bg-teal-50 ring-2 ring-teal-300'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <PhoneCall className="w-5 h-5 text-teal-700" />
                      <span className="text-xs font-black text-slate-900">
                        Join a secure guest call
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Short 5-minute supervised video check-in
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedSupportType('video_question')}
                      className={`p-4 rounded-2xl border-2 text-left transition flex flex-col gap-2 ${
                        selectedSupportType === 'video_question'
                          ? 'border-teal-700 bg-teal-50 ring-2 ring-teal-300'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <Video className="w-5 h-5 text-teal-700" />
                      <span className="text-xs font-black text-slate-900">
                        Send a signed video question
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Deaf educator reviews and responds asynchronously
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedSupportType('session')}
                      className={`p-4 rounded-2xl border-2 text-left transition flex flex-col gap-2 ${
                        selectedSupportType === 'session'
                          ? 'border-teal-700 bg-teal-50 ring-2 ring-teal-300'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <Calendar className="w-5 h-5 text-teal-700" />
                      <span className="text-xs font-black text-slate-900">
                        Book a short support session
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Schedule with parent or school teacher
                      </span>
                    </button>
                  </div>
                </div>

                {/* Safeguarding & Child Protection Mandate: Parent Approval Required */}
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Child Safeguarding Guardrail:</span>
                  </div>
                  <p className="text-xs text-amber-950 font-medium leading-relaxed">
                    Zero unmoderated adult-child chat. No permanent public call links. No automatic recording of children. Adult approval is mandatory before any live interaction.
                  </p>

                  <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={approvalGranted}
                      onChange={(e) => setApprovalGranted(e.target.checked)}
                      className="w-4 h-4 rounded text-teal-700 border-slate-300 focus:ring-teal-500"
                    />
                    <span className="text-xs font-black text-slate-900">
                      Parent approved / Teacher approved on this device
                    </span>
                  </label>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSubmitHelpRequest}
                    disabled={!approvalGranted}
                    className="px-7 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-black text-sm shadow-md shadow-teal-200 transition interactive-target flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Send Request to Facilitator Help Queue</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Pitch Request Confirmed State */
              <div className="space-y-5 animate-fade-in">
                <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-3xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-emerald-950">
                        Help Request Sent to Certified Facilitator!
                      </h3>
                      <p className="text-xs text-emerald-800 font-medium">
                        Your request has been routed to the Deaf educator queue. An adult will supervise your video support session.
                      </p>
                    </div>
                  </div>

                  {/* Summary Card as mandated by Pitch specification */}
                  <div className="p-4 bg-white rounded-2xl border border-emerald-200 text-xs space-y-2">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-bold text-slate-500">Learner:</span>
                      <span className="font-black text-slate-900">Demo Learner</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-bold text-slate-500">Lesson:</span>
                      <span className="font-black text-slate-900">Computer Basics</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-bold text-slate-500">Word:</span>
                      <span className="font-black text-slate-900">{activeWord.word}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-bold text-slate-500">Difficulty:</span>
                      <span className="font-black text-slate-900">Meaning</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-bold text-slate-500">Attempts:</span>
                      <span className="font-black text-slate-900">{Math.max(2, attemptCount)}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-bold text-slate-500">Preferred Support:</span>
                      <span className="font-black text-slate-900">Short supervised video call</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-bold text-slate-500">Approval:</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-black">
                        Parent approved
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-500">Status:</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-black">
                        Waiting for facilitator
                      </span>
                    </div>
                  </div>
                </div>

                {/* Final Pitch Presenter Climax Banner */}
                <div className="p-6 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-3xl border-2 border-teal-500/40 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
                    <Award className="w-4 h-4" />
                    <span>DeafLMS Pitch Journey Complete</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Picture. Sign. Visual Meaning. Practice. Human Support.
                  </h3>
                  <p className="text-xs text-teal-100 font-medium leading-relaxed max-w-2xl">
                    Deaf learners do not fail because they lack ability; they struggle when forced to decode auditory text alone. By separating word signs from signed meanings and providing reviewed visual stories, DeafLMS enables independent learning with safe educator backup.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setCurrentStep(5)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition interactive-target"
              >
                ← Back to Practice
              </button>

              <button
                onClick={() => handleRestartDemo('webcam')}
                className="px-6 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-xs transition interactive-target flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart 60-Second Demo</span>
              </button>
            </div>
          </div>
        )}

        {/* Safe AI Clarification Modal & Floating Launcher */}
        <SignyAITutorModal initialWord={activeWord.word} />

        {/* Real Learners Video Modal (Pitch Day Spotlight) */}
        {showTestimonialModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="testimonial-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in"
          >
            <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-2xl w-full border-2 border-teal-600/30 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-xs">
                    TIDI
                  </div>
                  <div>
                    <h3 id="testimonial-modal-title" className="text-base font-black text-slate-900">
                      Deaf Kids Tech Bootcamp Testimonial
                    </h3>
                    <span className="text-[11px] font-bold text-slate-500">
                      Tech Inclusion for the Deaf Initiative • Abuja, Nigeria
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTestimonialModal(false)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
                  aria-label="Close testimonial modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Video Player */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[9/16] sm:aspect-video max-h-[380px] flex items-center justify-center shadow-inner">
                <video
                  poster="/images/posters/tidi-testimonial-poster.jpg"
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                >
                  <source src="/videos/tidi-deaf-learners-testimonial.mp4" type="video/mp4" />
                  <source src="https://dms.licdn.com/playlist/vid/v2/D4E05AQHE-DwmElfzPw/mp4-720p-30fp-crf28/B4EaCfBigKI0B8-/0/1789374396319?e=2147483647&v=beta&t=6viYlTcnF4DEz8c5Wv4tU095e72wtKiCtR1CXyDGjkw" type="video/mp4" />
                </video>
              </div>

              {/* Quote & Social Proof */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <p className="text-slate-700 font-semibold leading-relaxed italic">
                  &ldquo;For us, this bootcamp was not just about teaching Deaf children how to use a computer. It was about giving them the space to learn in a way they understand, try things for themselves and grow in confidence.&rdquo;
                </p>
                <p className="text-teal-950 font-bold leading-relaxed">
                  &ldquo;In Nigerian Sign Language, our learners share what they enjoyed, what they learned and what they want to explore next.&rdquo;
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <a
                  href="https://www.linkedin.com/posts/techinclusiondeaf_tidi-deafkidstechbootcamp-deafchildrenintech-activity-7505180214138740736-Xv_1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-700 hover:text-teal-900 font-black inline-flex items-center gap-1 hover:underline"
                >
                  <span>View original post on LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setShowTestimonialModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition"
                >
                  Back to Demo
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Corporate Legal Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs font-medium text-slate-500 space-y-2 mt-auto">
        <p className="text-slate-600 font-semibold">
          DeafLMS is a product of Acclusivo, owned by Tech Inclusion Enterprise Ltd, Abuja, Nigeria.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
          <span>&copy; 2026 Tech Inclusion Enterprise Ltd. All rights reserved.</span>
          <span>•</span>
          <Link href="/privacy" className="hover:text-teal-700 transition">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-teal-700 transition">Terms of Service</Link>
          <span>•</span>
          <Link href="/accessibility" className="hover:text-teal-700 transition">Accessibility</Link>
          <span>•</span>
          <Link href="/support" className="hover:text-teal-700 transition">Support</Link>
        </div>
      </footer>
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center font-bold text-slate-700">
            Loading DeafLMS Demo...
          </div>
        </div>
      }
    >
      <DemoContent />
    </Suspense>
  );
}
