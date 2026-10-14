'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  AlertCircle,
  Eye,
  RotateCcw,
  Sparkles,
  BookOpen,
  Camera,
  Hand,
  CheckSquare,
  HelpCircle,
  Keyboard,
  LogIn,
  ShieldCheck,
  Check,
} from 'lucide-react';
import {
  APPROVED_COMPUTER_WORDS,
  ONBOARDING_VIDEO_SOURCE,
  ONBOARDING_SIGNED_MESSAGE,
  AI_ROLE_BOUNDARY_STATEMENT,
} from '@/lib/approved-vocabulary';
import { AccessibleSignVideoPlayer } from '@/components/common/AccessibleSignVideoPlayer';
import { SignyAITutorModal, openClarifyModal } from '@/components/student/SignyAITutorModal';

export default function LandingPage() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [showWatchModal, setShowWatchModal] = useState<boolean>(false);
  const [onboardingFinished, setOnboardingFinished] = useState<boolean>(false);
  const onboardingCardRef = useRef<HTMLDivElement>(null);

  // Check returning learner preference from device storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('deaflms_onboarding_completed');
      if (stored === 'true') {
        setHasCompletedOnboarding(true);
      }
    } catch {
      // Graceful fallback if localStorage is disabled
    }
  }, []);

  const handleVideoCompleted = () => {
    setOnboardingFinished(true);
    setHasCompletedOnboarding(true);
    try {
      localStorage.setItem('deaflms_onboarding_completed', 'true');
    } catch { }
  };

  const handleSkipGuide = () => {
    setOnboardingFinished(true);
    setHasCompletedOnboarding(true);
    try {
      localStorage.setItem('deaflms_onboarding_completed', 'true');
    } catch { }
  };

  const handleReplayGuide = () => {
    setOnboardingFinished(false);
  };

  const scrollToVideoCard = () => {
    if (onboardingCardRef.current) {
      onboardingCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-700 selection:text-white">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Status Tag */}
          <Link href="/" className="flex items-center gap-3 interactive-target">

            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-900">
                Deaf<span className="text-teal-700">LMS</span>
              </span>
            </div>
          </Link>

          {/* Action Links & Demo CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/keyboard-trainer"
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-slate-700 hover:text-teal-800 hover:bg-slate-100 font-bold text-xs transition interactive-target items-center gap-1.5"
            >
              <Keyboard className="w-3.5 h-3.5 text-teal-700" />
              <span>Keyboard Trainer</span>
            </Link>
            <Link
              href="/login"
              className="px-4 py-2.5 rounded-xl text-slate-700 hover:text-teal-800 hover:bg-slate-100 font-bold text-xs transition flex items-center gap-1.5 interactive-target border border-slate-200"
            >
              <LogIn className="w-4 h-4 text-teal-700" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/demo?pitch=true"
              className="px-5 py-2.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs sm:text-sm shadow-md shadow-teal-100 transition interactive-target flex items-center gap-2 ring-2 ring-teal-400"
            >
              <span>Try a lesson</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* P0 HERO SECTION: SIGNED ONBOARDING AS HOMEPAGE ENTRY POINT */}
        {/* Two-column on large screens, linear heading -> video -> demo on mobile */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 border-b border-slate-200 bg-gradient-to-b from-white via-teal-50/20 to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left Column (Copy & Primary / Secondary CTAs) */}
              <div className="lg:col-span-6 space-y-6 text-left order-1">
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                    Learn through pictures, signs and practice.
                  </h1>
                  <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                    Visual STEM lessons for Deaf and hard-of-hearing learners.
                  </p>
                </div>

                {/* Primary & Secondary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                  <Link
                    href="/demo?pitch=true"
                    className="px-7 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-base shadow-lg shadow-teal-700/20 transition interactive-target flex items-center justify-center gap-2"
                  >
                    <span>Try a lesson</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <button
                    onClick={scrollToVideoCard}
                    className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-black text-base border-2 border-slate-300 transition interactive-target flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-slate-800 text-slate-800" />
                    <span>See how it works</span>
                  </button>
                </div>

                {/* Returning Learner Saved Preference Status */}
                {/* {hasCompletedOnboarding && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs font-bold text-emerald-900">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>You previously watched the signed guide. Ready to jump straight to lessons!</span>
                    </div>
                    <Link
                      href="/demo?pitch=true"
                      className="text-teal-800 font-black underline hover:text-teal-950 shrink-0 ml-2"
                    >
                      Open Demo →
                    </Link>
                  </div>
                )} */}

                {/* AI Boundary & Philosophy Callout */}
                <div className="pt-2 p-4 bg-slate-100/80 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-700 font-extrabold uppercase text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>Verified Educator Safeguard:</span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {AI_ROLE_BOUNDARY_STATEMENT}
                  </p>
                  <div className="pt-1 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => openClarifyModal('webcam')}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs border border-teal-200 transition flex items-center gap-1.5 interactive-target"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Test Safe AI Clarification</span>
                    </button>
                    <span className="text-[10px] text-slate-500 font-semibold">Strict safety boundary</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Focused Sign-Language Onboarding Video Card */}
              <div ref={onboardingCardRef} className="lg:col-span-6 order-2">
                <div className="space-y-4">
                  {/* Reusable AccessibleSignVideoPlayer for Homepage Onboarding */}
                  <AccessibleSignVideoPlayer
                    source={ONBOARDING_VIDEO_SOURCE}
                    showSkip={true}
                    onSkip={handleSkipGuide}
                    onEnded={handleVideoCompleted}
                    onStartDemoClick={() => {
                      window.location.href = '/demo?pitch=true';
                    }}
                  />

                  {/* Completion State Card: "You are ready" */}
                  {onboardingFinished ? (
                    <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-3xl space-y-3 animate-fade-in text-left">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">

                        </div>

                      </div>


                    </div>
                  ) : (
                    /* 7 Short Visual Step Indicators */
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-slate-800 uppercase tracking-wide">
                          7 Visual Learning Steps:
                        </span>
                        <span className="text-[11px] text-teal-800 font-bold">
                          100% Visual • Zero Sound Required
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 text-center">
                        {ONBOARDING_SIGNED_MESSAGE.visualSteps.map((step) => (
                          <div
                            key={step.number}
                            className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-1"
                          >
                            <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-black text-[10px] flex items-center justify-center">
                              {step.number}
                            </span>
                            <span className="text-[10px] font-black uppercase text-slate-900 leading-tight">
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 1. CORE LEARNING MODEL: THE SEVEN-STEP VISUAL SEQUENCE */}
        {/* ========================================================================= */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-teal-800">
              Pedagogical Foundation
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              The Seven-Step Visual Learning Model
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Tested with a Deaf Primary 4 learner: recognizing a word sign is not the same as understanding its concept. We separate the vocabulary sign from a Deaf facilitator&apos;s signed explanation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black">
                1
              </div>
              <h3 className="text-lg font-black text-slate-900">Vocabulary Sign Video</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Demonstrates how to sign one individual word in Nigerian Sign Language with clear handshape and spatial grammar.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">Signed Meaning Video</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                A Deaf facilitator explains the concept using familiar local signs, visual pointing, a real object and a relatable everyday example.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900">Visual Story &amp; Supervised Help</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                A reviewed 3-frame story provides contextual reinforcement. When a child needs guidance, parent-approved facilitator help is one tap away.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. THE 4 COMPUTER WORDS PREVIEW */}
        {/* ========================================================================= */}
        <section className="py-16 bg-slate-100/70 border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-black uppercase tracking-wider text-teal-800">
                  Approved Foundation Catalog
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  The Four Approved Computer Words
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Reviewed by Deaf educators in Abuja, Nigeria for clear signing space and chest visibility.
                </p>
              </div>

              <Link
                href="/demo?pitch=true"
                className="px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition flex items-center gap-2 self-start md:self-auto interactive-target shadow-sm"
              >
                <span>Launch 60-Second Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.values(APPROVED_COMPUTER_WORDS).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-xs hover:border-teal-500 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video bg-slate-100 overflow-hidden border-b border-slate-200 relative">
                      <img
                        src={item.imageUrl}
                        alt={item.word}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-black uppercase backdrop-blur-sm">
                        {item.word}
                      </span>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900">{item.word}</h3>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {item.signLanguage} Approved
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium line-clamp-3 leading-relaxed">
                        {item.simpleMeaning}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-100 mt-2">
                    <span className="text-[11px] text-slate-400 font-semibold block pt-2">
                      Spelling: {item.fingerspell}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safe AI Clarification Modal & Floating Launcher */}
        <SignyAITutorModal />
      </main>


      {/* Corporate Legal Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs font-medium text-slate-500 space-y-2">
        <p className="text-slate-700 font-semibold">
          DeafLMS is a product of Acclusivo, owned by Tech Inclusion Enterprise Ltd, Abuja, Nigeria.
        </p>
        <p className="text-slate-500">
          &copy; 2026 Tech Inclusion Enterprise Ltd. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
