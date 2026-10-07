'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  DEMO_WORDS_STEPS,
  APPROVED_COMPUTER_WORDS,
  DemoStepItem,
  extractYouTubeId,
} from '@/lib/approved-vocabulary';
import {
  Play,
  Pause,
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
  Unlock,
  Lock,
  Clock,
  RefreshCw,
  GraduationCap,
  Award,
  Sparkles,
  UserCheck,
  FileText,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type StepNumber = 1 | 2 | 3 | 4 | 5;

const LESSON_ORDER = ['webcam', 'keyboard', 'mouse', 'monitor'];

export default function DemoPage() {
  const [selectedWordKey, setSelectedWordKey] = useState<string>('webcam');
  const activeWord: DemoStepItem = DEMO_WORDS_STEPS[selectedWordKey] || DEMO_WORDS_STEPS.webcam;

  // Duolingo-Style Lesson Progression State
  const [unlockedWords, setUnlockedWords] = useState<string[]>(['webcam']);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [showSubscriptionDemo, setShowSubscriptionDemo] = useState<boolean>(false);

  // Flow State (5 Visual Steps)
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [videoError, setVideoError] = useState<boolean>(false);

  // Step 4: Visual Quiz (Check Understanding)
  const [selectedMeaningOption, setSelectedMeaningOption] = useState<string | null>(null);
  const [meaningAnsweredCorrectly, setMeaningAnsweredCorrectly] = useState<boolean | null>(null);

  // 90-second Demo Timer for Pitch Competition
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Track elapsed demo time
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Video Controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Step 4: Visual Quiz (Unlocks Next Lesson when correct - Duolingo style)
  const handleSelectMeaningOption = (optionId: string, isCorrect: boolean) => {
    setSelectedMeaningOption(optionId);
    setMeaningAnsweredCorrectly(isCorrect);

    if (isCorrect) {
      setCompletedWords((prev) => Array.from(new Set([...prev, selectedWordKey])));
      const currentIndex = LESSON_ORDER.indexOf(selectedWordKey);
      if (currentIndex >= 0 && currentIndex < LESSON_ORDER.length - 1) {
        const nextWord = LESSON_ORDER[currentIndex + 1];
        setUnlockedWords((prev) => Array.from(new Set([...prev, nextWord])));
      }
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // graceful fallback
      }
    }
  };

  // Full Restart Demo
  const handleRestartDemo = (wordKey = 'webcam') => {
    setSelectedWordKey(wordKey);
    setCurrentStep(1);
    setIsPlaying(false);
    setPlaybackSpeed(1.0);
    setVideoError(false);
    setSelectedMeaningOption(null);
    setMeaningAnsweredCorrectly(null);
    setSecondsElapsed(0);
    setShowSubscriptionDemo(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-700 selection:text-white">
      {/* Top Demo Bar */}
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
                  Competition Demo MVP
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold block">
                90-Second Learner Journey • 4 Computer Lessons
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 90-Second Timer Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              <span>Time: {secondsElapsed}s / 90s</span>
            </div>

            {/* Restart Demo Button */}
            <button
              onClick={() => handleRestartDemo(selectedWordKey)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition flex items-center gap-1.5 interactive-target"
              aria-label="Restart Demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Word Switcher & Duolingo-Style Lesson Progression */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              Active Vocabulary Lesson:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900">{activeWord.word}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-teal-100 text-teal-800">
                Lesson {LESSON_ORDER.indexOf(selectedWordKey) + 1} of 4
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {LESSON_ORDER.map((wKey, idx) => {
              const isUnlocked = unlockedWords.includes(wKey);
              const isCompleted = completedWords.includes(wKey);
              const isCurrent = selectedWordKey === wKey;

              return (
                <button
                  key={wKey}
                  onClick={() => {
                    if (isUnlocked) {
                      handleRestartDemo(wKey);
                      setLockedNotice(null);
                    } else {
                      setLockedNotice(`Complete Lesson ${idx}: ${LESSON_ORDER[idx - 1].toUpperCase()} first to unlock ${wKey.toUpperCase()}!`);
                      setTimeout(() => setLockedNotice(null), 3500);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition interactive-target flex items-center gap-1.5 ${isCurrent
                    ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-400'
                    : isCompleted
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                      : isUnlocked
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-slate-100 text-slate-400 border border-dashed border-slate-300 opacity-60 cursor-not-allowed'
                    }`}
                  aria-label={`Lesson ${idx + 1}: ${wKey}${!isUnlocked ? ' (Locked)' : ''}`}
                >
                  <span>{wKey}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : !isUnlocked ? (
                    <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                  ) : null}
                </button>
              );
            })}

            {/* Parent Pro & Certificate Milestone Tab (For Parents & Pitch Investors) */}
            <button
              onClick={() => {
                setShowSubscriptionDemo(true);
                setCurrentStep(5);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition interactive-target flex items-center gap-1.5 ${
                showSubscriptionDemo
                  ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-300'
                  : 'bg-gradient-to-r from-amber-50 to-teal-50 hover:from-amber-100 hover:to-teal-100 text-slate-800 border border-amber-300'
              }`}
              aria-label="View Parent Subscription and Certificate Demo"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Parent Pro Tier 👑</span>
            </button>
          </div>
        </div>

        {/* Locked Notice Notification */}
        {lockedNotice && (
          <div className="p-3 bg-amber-50 border border-amber-300 text-amber-950 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{lockedNotice}</span>
          </div>
        )}

        {/* Eye-First Visual Orientation Guide (Mandated for Deaf children navigation without sound) */}
        {/* <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-teal-200 shadow-xs space-y-3"> */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center font-black">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 tracking-tight block">
                  Eye-First Visual Navigation Guide
                </span>
                <span className="text-[10px] text-teal-800 font-bold block">
                  100% Visual • Zero Sound Required • Independent Child Navigation
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-black text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              <span>Orienting Eyes:</span>
              <span className="text-teal-700 uppercase">Look at Picture → Watch Sign Video → Understand Meaning → Visual Quiz → Unlock Next Lesson</span>
            </div>
          </div> */}

        {/* 5 Visual Stage Indicators */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
            {[
              { num: 1, label: 'Picture First', desc: 'Real Object Anchor', icon: Camera },
              { num: 2, label: 'NSL Sign', desc: 'Local Sign Video', icon: Hand },
              { num: 3, label: 'Meaning', desc: 'Simple Everyday Use', icon: BookOpen },
              { num: 4, label: 'Visual Quiz', desc: 'Eye Comprehension', icon: CheckSquare },
              { num: 5, label: 'Result & Unlock', desc: 'Duolingo Progression', icon: Trophy },
            ].map((st) => {
              const IconComp = st.icon;
              const isActive = currentStep === st.num;
              const isPassed = currentStep > st.num;

              return (
                <button
                  key={st.num}
                  onClick={() => setCurrentStep(st.num as StepNumber)}
                  className={`p-2.5 rounded-xl border-2 transition text-left flex flex-col items-center justify-center gap-1.5 interactive-target ${
                    isActive
                      ? 'border-teal-700 bg-teal-50 ring-2 ring-teal-200 shadow-xs'
                      : isPassed
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                      : 'border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100'
                  }`}
                  aria-label={`Jump to Step ${st.num}: ${st.label}`}
                >
                  <IconComp className={`w-5 h-5 shrink-0 ${isActive ? 'text-teal-700' : isPassed ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span className="text-xs font-black leading-tight truncate w-full text-center">
                    {st.label}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-500 hidden sm:block">
                    {st.desc}
                  </span>
                </button>
              );
            })}
          </div> */}
        {/* </div> */}

        {/* 5-Step Progress Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-black text-slate-700 mb-2">
            <span>Step {currentStep} of 5</span>
            <span className="text-teal-800">
              {currentStep === 1 && '1. Look at Picture First (Real Object Anchor)'}
              {currentStep === 2 && '2. Watch Local Sign Video (NSL)'}
              {currentStep === 3 && '3. Learn Simple Meaning & Example'}
              {currentStep === 4 && '4. Visual Quiz (Check Understanding)'}
              {currentStep === 5 && '5. Visual Result & Next Lesson Unlocked'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex-1 h-full transition-all duration-300 ${s < currentStep
                  ? 'bg-teal-700 border-r border-white/40'
                  : s === currentStep
                    ? 'bg-amber-500 border-r border-white/40 animate-pulse'
                    : 'bg-slate-200 border-r border-white/40'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: PICTURE FIRST (Real Physical Device Anchor) */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                {/* <Camera className="w-4 h-4 text-teal-700" /> */}
                Step 1: Look at the Picture First
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                What does a {activeWord.word.toLowerCase()} look like in real life?
              </h2>
              {/* <p className="text-xs text-slate-600 font-medium">
                Deaf learners anchor new concepts with their eyes. Look closely at the real physical computer hardware below before watching how it is signed.
              </p> */}
            </div>

            {/* Single Focused Physical Object Photo */}
            <div className="relative rounded-2xl border-2 border-teal-300 bg-slate-950 overflow-hidden shadow-md">
              <div className="aspect-16/10 sm:aspect-2/1 w-full bg-slate-950 flex items-center justify-center p-4 relative">
                <img
                  src={activeWord.pictureUrl}
                  alt={`Real physical ${activeWord.word} device`}
                  className="w-64 h-64 object-contain rounded-xl"
                />

                {/* Overlaid Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-teal-800/90 text-white font-black text-xs tracking-wider uppercase backdrop-blur-sm border border-teal-500/50 flex items-center gap-1.5 shadow-sm">
                    <Laptop className="w-3.5 h-3.5" />
                    Physical Hardware: {activeWord.word}
                  </span>
                </div>

                {/* <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-900/80 text-emerald-400 font-bold text-[11px] backdrop-blur-sm border border-slate-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Visual Reality Anchor
                  </span>
                </div> */}
              </div>

              {/* Caption Bar */}
              <div className="bg-slate-900 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                {/* <span className="font-semibold">
                  Look with your eyes: This physical computer part is called a {activeWord.word}.
                </span> */}
                <span className="text-teal-400 font-bold hidden sm:inline">
                  Step 1 of 5
                </span>
              </div>
            </div>

            {/* Real Object Guidance Card */}
            {/* <div className="p-4 rounded-2xl border-2 bg-teal-50 border-teal-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-teal-900 block">
                  Eye-First Orientation for Deaf Children
                </span>
                <p className="text-xs font-medium text-teal-900 leading-relaxed">
                  Now that your eyes recognize the physical <strong>{activeWord.word.toLowerCase()}</strong>, next we will watch how human Deaf educators sign its name in Nigerian Sign Language.
                </p>
              </div>
            </div> */}

            {/* Advance to Step 2 */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-7 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-md shadow-teal-200 transition interactive-target flex items-center gap-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: WATCH LOCAL SIGN LANGUAGE VIDEO (NSL) */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="space-y-1">
              {/* <span className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <Hand className="w-4 h-4 text-teal-700" />
                Step 2: Watch Approved Local Sign (NSL)
              </span> */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                This is how we sign the picture you saw: &ldquo;{activeWord.word}&rdquo;
              </h2>
              {/* <p className="text-xs text-slate-600 font-medium">
                Deaf educators sign the physical {activeWord.word.toLowerCase()} you looked at in Step 1. Notice the hands, signing space, and facial expression.
              </p> */}
            </div>

            {/* Direct Visual Connection to Previous Picture */}
            <div className="p-3 bg-teal-50/80 border border-teal-200 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-teal-300 shrink-0">
                  <img
                    src={activeWord.pictureUrl}
                    alt={`Previous picture of ${activeWord.word}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-900 block">
                    Connecting to Previous Picture:
                  </span>
                  <p className="text-xs font-black text-teal-950">
                    Real Device: {activeWord.word} ➔ Human Sign Video
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="px-3 py-1.5 rounded-xl bg-white border border-teal-300 text-teal-800 text-xs font-bold hover:bg-teal-100 transition shrink-0 hidden sm:inline-block"
              >
                Look at Picture Again
              </button>
            </div>

            {/* Video Player Box */}
            <div className="bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 relative">
              {/* Reviewed Review Status Banner */}
              {/* <div className="bg-slate-900/90 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs"> */}
              {/* <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Status: Approved • Nigerian Sign Language (NSL)
                </span> */}
              {/* <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Acclusivo Deaf Review Team (Abuja, Nigeria)
                </span> */}
              {/* </div> */}

              {/* Video Element with YouTube Embed or Native Fallback */}
              <div className="aspect-video bg-black flex items-center justify-center relative">
                {(() => {
                  const youtubeId = extractYouTubeId(activeWord.signVideoUrl);

                  if (youtubeId) {
                    return (
                      <iframe
                        key={youtubeId}
                        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`}
                        // title={`Nigerian Sign Language - ${activeWord.word}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    );
                  }

                  if (videoError) {
                    return (
                      <div className="p-6 text-center space-y-3 max-w-md">
                        <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                        <p className="text-sm font-bold text-white">
                          This video is not available right now. Read the approved meaning or ask your facilitator for help.
                        </p>
                        <button
                          onClick={() => setVideoError(false)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-xl"
                        >
                          Retry Video Load
                        </button>
                      </div>
                    );
                  }

                  return (
                    <>
                      <video
                        ref={videoRef}
                        src={activeWord.signVideoUrl}
                        playsInline
                        onError={() => setVideoError(true)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        className="w-full h-full object-contain cursor-pointer"
                        onClick={togglePlay}
                      />

                      {!isPlaying && (
                        <button
                          onClick={togglePlay}
                          className="absolute w-16 h-16 rounded-2xl bg-teal-700 hover:bg-teal-600 text-white flex items-center justify-center shadow-2xl transition transform hover:scale-105 interactive-target"
                          aria-label="Play Sign Video"
                        >
                          <Play className="w-8 h-8 fill-current translate-x-0.5" />
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Controls Bar */}
              {(() => {
                const youtubeId = extractYouTubeId(activeWord.signVideoUrl);
                if (youtubeId) {
                  return (
                    <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      {/* <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white font-black">
                          {activeWord.word} • Nigerian Sign Language (NSL) Video
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-teal-800/80 text-teal-200 font-bold text-[11px] flex items-center gap-1 border border-teal-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Verified Human Deaf Signer
                      </span> */}
                    </div>
                  );
                }

                return (
                  <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-xl bg-teal-700 hover:bg-teal-600 text-white flex items-center justify-center font-bold transition interactive-target"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                      </button>
                      <button
                        onClick={handleReplay}
                        className="h-10 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition interactive-target"
                        aria-label="Replay sign"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Replay</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
                      {[0.5, 0.75, 1.0].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedChange(s)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition interactive-target ${playbackSpeed === s
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'text-slate-300 hover:text-white'
                            }`}
                          aria-label={`Playback speed ${s}x`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Advance to Step 3 */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition interactive-target"
              >
                ← Look at Picture Again
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-md shadow-teal-200 transition interactive-target flex items-center gap-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: LEARN SIMPLE MEANING */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                {/* <BookOpen className="w-4 h-4 text-teal-700" /> */}
                Step 3: Understand the Meaning
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                What does a {activeWord.word.toLowerCase()} do?
              </h2>
              {/* <p className="text-xs text-slate-600 font-medium">
                Short sentences and clear everyday examples without auditory jargon.
              </p> */}
            </div>

            {/* Approved Definition Card */}
            <div className="p-6 bg-slate-50 border-2 border-slate-300 rounded-3xl space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-black">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{activeWord.word}</h3>
                  <span className="text-xs text-teal-800 font-bold">Approved Learning Definition</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                  Simple Meaning:
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                  {activeWord.simpleMeaning}
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 block">
                  Familiar Example:
                </span>
                <p className="text-sm font-semibold text-slate-700 italic">
                  &ldquo;{activeWord.exampleSentence}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition interactive-target"
              >
                ← Watch Sign Again
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-md shadow-teal-200 transition interactive-target flex items-center gap-2"
              >
                <span>Next: Check Understanding (Visual Quiz)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: CHECK UNDERSTANDING (Visual Quiz) */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-teal-700" />
                Step 4: Check Understanding (Visual Quiz)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {activeWord.meaningQuestion.questionText}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Select the correct computer part based on the picture and meaning you learned.
              </p>
            </div>

            {/* Options with Visual Picture Thumbnails for Deaf Children */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeWord.meaningQuestion.options.map((opt) => {
                const isSelected = selectedMeaningOption === opt.id;
                const wordKey = opt.id.replace('opt-', '');
                const optImage = APPROVED_COMPUTER_WORDS[wordKey]?.imageUrl;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectMeaningOption(opt.id, opt.isCorrect)}
                    className={`p-4 rounded-2xl border-3 text-left transition flex flex-col justify-between gap-3 interactive-target ${isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-300'
                        : 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-200'
                      : 'bg-slate-50 border-slate-200 hover:border-teal-400 hover:bg-slate-100 text-slate-900'
                      }`}
                  >
                    {optImage && (
                      <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-2">
                        <img
                          src={optImage}
                          alt={opt.label}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="w-full flex items-center justify-between gap-2 pt-1">
                      <span className="text-base font-black">{opt.label}</span>
                      {isSelected && (
                        <span
                          className={`text-[11px] uppercase font-black px-2 py-0.5 rounded-md ${opt.isCorrect
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-rose-200 text-rose-900'
                            }`}
                        >
                          {opt.isCorrect ? '✓ Correct' : '✕ Try Again'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition interactive-target"
              >
                ← Back to Meaning
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                disabled={!selectedMeaningOption}
                className="px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-black text-sm shadow-md shadow-teal-200 transition interactive-target flex items-center gap-2"
              >
                <span>View Result &amp; Unlock Next Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: SHOW RESULT & DUOLINGO-STYLE LESSON UNLOCK */}
        {/* ========================================================================= */}
        {currentStep === 5 && (() => {
          const currentIndex = LESSON_ORDER.indexOf(selectedWordKey);
          const nextWordKey = currentIndex >= 0 && currentIndex < LESSON_ORDER.length - 1 ? LESSON_ORDER[currentIndex + 1] : null;

          return (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-teal-700" />
                  Step 5: Visual Result &amp; Lesson Progression
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Visual Comprehension Result
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Immediate visual feedback and milestone unlocking with zero auditory reliance.
                </p>
              </div>

              {meaningAnsweredCorrectly ? (
                <div className="space-y-4">
                  {/* Success Card */}
                  <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-3xl space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-emerald-950">
                          Correct! You connected the picture, sign, and meaning.
                        </h3>
                        <p className="text-xs text-emerald-800 font-medium">
                          All foundational learning stages for {activeWord.word} were completed successfully with zero auditory reliance.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Duolingo-Style Lesson Unlock Card */}
                  {nextWordKey ? (
                    <div className="p-6 bg-gradient-to-r from-teal-900 to-emerald-900 text-white rounded-3xl shadow-lg border-2 border-teal-500/30 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-[11px] uppercase tracking-wider inline-flex items-center gap-1.5">
                            <Unlock className="w-3.5 h-3.5" />
                            Next Lesson Unlocked!
                          </span>
                          <h4 className="text-xl sm:text-2xl font-black text-white pt-1">
                            Lesson {currentIndex + 2}: {nextWordKey.toUpperCase()}
                          </h4>
                          <p className="text-xs text-teal-100 font-medium max-w-xl">
                            You unlocked the next computer hardware lesson on your learning journey. Continue building your visual computer literacy!
                          </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-emerald-300 shrink-0">
                          <Trophy className="w-7 h-7" />
                        </div>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                          onClick={() => handleRestartDemo(nextWordKey)}
                          className="px-7 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-400/20 transition transform hover:scale-[1.02] interactive-target flex items-center justify-center gap-2"
                        >
                          <span>Proceed to Unlocked Lesson: {nextWordKey.toUpperCase()}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* 1. Free Starter Tier Completion Banner */}
                      <div className="p-6 bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl border-2 border-teal-500/40 shadow-xl space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-[11px] uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Free Starter Tier Completed!
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-white pt-1">
                              All 4 Foundation Lessons Mastered
                            </h3>
                            <p className="text-xs text-teal-100 font-medium max-w-xl">
                              Your learner independently mastered physical hardware recognition, Nigerian Sign Language vocabulary, and visual comprehension with 100% autonomy.
                            </p>
                          </div>
                          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-amber-300 shrink-0">
                            <Trophy className="w-8 h-8" />
                          </div>
                        </div>

                        {/* 4 Completed Lessons Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-teal-800/60 text-xs">
                          {LESSON_ORDER.map((itemKey) => (
                            <div key={itemKey} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span className="font-extrabold uppercase tracking-wide text-[11px]">{itemKey}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2. Parent / Guardian / Individual Subscription Card (The Core Monetization Funnel) */}
                      <div className="p-6 sm:p-8 bg-white border-2 border-teal-300 rounded-3xl shadow-lg space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black uppercase tracking-wider">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              Parent &amp; Guardian Next Step • Premium Pro
                            </div>
                            <h4 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                              Ready to Subscribe to Premium Pro?
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
                              Deaf learners absorb computer skills rapidly when guided eye-first. Give your child full access to our accredited K-12 digital curriculum, verified completion certificate, and specialized Deaf educator support.
                            </p>
                          </div>

                          <div className="px-4 py-2 rounded-2xl bg-teal-50 border border-teal-200 text-center shrink-0">
                            <span className="text-[10px] font-black uppercase text-teal-800 block">Subscription Price</span>
                            <span className="text-xl font-black text-slate-900">₦5,000 / $8</span>
                            <span className="text-[10px] text-slate-500 font-semibold block">per month</span>
                          </div>
                        </div>

                        {/* What Premium Pro Unlocks (Key Value Drivers) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0">
                              <GraduationCap className="w-5 h-5" />
                            </div>
                            <div>
                              <strong className="text-slate-900 font-black block">Official Accredited Certificate</strong>
                              <span className="text-slate-600 font-medium leading-relaxed">
                                Verified Digital Literacy Certificate of Completion with your child&apos;s name and certified achievement seal for school records.
                              </span>
                            </div>
                          </div>

                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0">
                              <Laptop className="w-5 h-5" />
                            </div>
                            <div>
                              <strong className="text-slate-900 font-black block">50+ Advanced STEM &amp; Typing Modules</strong>
                              <span className="text-slate-600 font-medium leading-relaxed">
                                Full elementary &amp; secondary modules: touch typing, internet safety, coding concepts, and mathematics in Nigerian Sign Language.
                              </span>
                            </div>
                          </div>

                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0">
                              <UserCheck className="w-5 h-5" />
                            </div>
                            <div>
                              <strong className="text-slate-900 font-black block">Deaf Teacher Support &amp; Insights</strong>
                              <span className="text-slate-600 font-medium leading-relaxed">
                                Human Deaf educator reviews, weekly progress reports sent directly to parents, and custom practice advice.
                              </span>
                            </div>
                          </div>

                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <strong className="text-slate-900 font-black block">Printable Offline Activity Packs</strong>
                              <span className="text-slate-600 font-medium leading-relaxed">
                                Downloadable visual worksheets, flashcards, and homework sheets for offline home and classroom practice.
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Sign-Up Action Buttons for Parents & Students */}
                        <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-3">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                            Choose How to Register &amp; Subscribe:
                          </span>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            {/* Primary Button: Parent Sign-Up */}
                            <Link
                              href="/signup?role=parent_guardian&plan=pro"
                              className="flex-1 px-6 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-lg shadow-teal-200 transition transform hover:scale-[1.02] interactive-target flex items-center justify-center gap-2 text-center"
                            >
                              <GraduationCap className="w-4 h-4" />
                              <span>Sign Up as Parent / Guardian → Subscribe Premium Pro</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>

                            {/* Secondary Button: Student Sign-Up */}
                            <Link
                              href="/signup?role=learner"
                              className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-black text-sm border-2 border-slate-300 transition interactive-target flex items-center justify-center gap-2 text-center"
                            >
                              <UserCheck className="w-4 h-4 text-teal-700" />
                              <span>Sign Up as Student (Free)</span>
                            </Link>
                          </div>

                          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 px-1">
                            <span>Zero card required for student free tier • Cancel subscription anytime</span>
                            <Link href="/pricing" className="text-teal-700 font-extrabold hover:underline">
                              View School Pilot &amp; Institutional Plans →
                            </Link>
                          </div>
                        </div>

                        {/* 3. Investor Spotlight (Attracting Investor's Attention) */}
                        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900">
                            <Award className="w-4 h-4 text-amber-700" />
                            <span>Investor Demo Insight: Product-Led Growth (PLG) Monetization Engine</span>
                          </div>
                          <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
                            <strong>1. Zero-CAC Acquisition:</strong> The 4-lesson starter tier removes all friction (no credit cards, pure visual loop). Deaf children experience rapid success in under 90 seconds.
                            <br />
                            <strong>2. High-Intent Conversion:</strong> Parents witness their child&apos;s autonomy firsthand, directly motivating subscription for official certification and advanced modules (₦5,000 / $8/mo).
                            <br />
                            <strong>3. B2B Expansion:</strong> Special education schools and state education boards license annual institutional seats (₦45,000 / $49/yr).
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-3xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black shrink-0">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-amber-950">
                        Let us watch the sign and meaning again.
                      </h3>
                      <p className="text-xs text-amber-800 font-medium">
                        Reviewing the connection strengthens visual memory and spatial signing comprehension.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Revision / Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs transition interactive-target flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Watch Sign Again</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedMeaningOption(null);
                      setMeaningAnsweredCorrectly(null);
                      setCurrentStep(4);
                    }}
                    className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs transition interactive-target flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Quiz Again</span>
                  </button>
                </div>

                <button
                  onClick={() => handleRestartDemo('webcam')}
                  className="px-5 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-xs transition interactive-target flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restart Demo from Beginning</span>
                </button>
              </div>
            </div>
          );
        })()}
      </main>

      {/* Footer with Mandatory Legal Info */}
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
