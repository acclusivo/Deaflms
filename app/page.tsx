'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Laptop,
  BookOpen,
  VolumeX,
  ShieldCheck,
  Eye,
  RotateCcw,
  Check,
  Building,
  HeartHandshake,
  UserCheck,
  LogIn,
  Keyboard,
  Hand,
  Camera,
  Layers,
} from 'lucide-react';
import { APPROVED_COMPUTER_WORDS } from '@/lib/approved-vocabulary';
import { SignyAITutorModal } from '@/components/student/SignyAITutorModal';

export default function LandingPage() {
  const [isHeroPlaying, setIsHeroPlaying] = useState<boolean>(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const toggleHeroPlay = () => {
    if (!heroVideoRef.current) return;
    if (heroVideoRef.current.paused) {
      heroVideoRef.current.play();
      setIsHeroPlaying(true);
    } else {
      heroVideoRef.current.pause();
      setIsHeroPlaying(false);
    }
  };

  const handleHeroReplay = () => {
    if (!heroVideoRef.current) return;
    heroVideoRef.current.currentTime = 0;
    heroVideoRef.current.play();
    setIsHeroPlaying(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-700 selection:text-white">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Prototype Tag */}
          <Link href="/" className="flex items-center gap-3 interactive-target">
            {/* <div className="w-12 h-12 rounded-2xl bg-teal-700 flex items-center justify-center text-white shadow-lg shadow-teal-100">
              <Laptop className="w-6 h-6" />
            </div> */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Deaf<span className="text-teal-700">LMS</span>
                </span>
                {/* <span className="px-2 py-0.5 text-[11px] font-black uppercase bg-teal-50 text-teal-800 rounded-md border border-teal-200">
                  Acclusivo MVP
                </span> */}
              </div>
              {/* <span className="text-xs text-slate-500 font-bold block">
                Visual Literacy &amp; Intelligent Diagnostic Platform
              </span> */}
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

            {/* <Link
              href="/facilitator-results"
              className="hidden md:inline-flex px-3.5 py-2 rounded-xl text-slate-700 hover:text-teal-800 hover:bg-slate-100 font-bold text-xs transition interactive-target"
            >
              Facilitator Results
            </Link>

            <Link
              href="/user-testing"
              className="hidden lg:inline-flex px-3.5 py-2 rounded-xl text-slate-700 hover:text-teal-800 hover:bg-slate-100 font-bold text-xs transition interactive-target"
            >
              User Testing Evidence
            </Link> */}

            <Link
              href="/login"
              className="px-4 py-2.5 rounded-xl text-slate-700 hover:text-teal-800 hover:bg-slate-100 font-bold text-xs transition flex items-center gap-1.5 interactive-target border border-slate-200"
            >
              <LogIn className="w-4 h-4 text-teal-700" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/demo"
              className="px-5 py-2.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs sm:text-sm shadow-md shadow-teal-100 transition interactive-target flex items-center gap-2"
            >
              <span>Try Lesson Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION (2-Column: Left Copy & CTAs, Right NSL Sign Video) */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 border-b border-slate-200 bg-gradient-to-b from-white via-teal-50/20 to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left Column (Copy & Actions) */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Eye-First Visual Learning Badge */}
                {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-black uppercase tracking-wider shadow-xs">
                  <Eye className="w-4 h-4 text-teal-700" />
                  <span>Eye-First Visual Literacy &amp; Diagnostic Platform</span>
                </div> */}

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                  From Sign to Meaning—<span className="text-teal-700">One Clear Step</span> at a Time
                </h1>

                {/* Supporting Description */}
                <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl">
                  DeafLMS empowers Deaf children to learn independently without sound. We connect real hardware pictures, human-reviewed Nigerian Sign Language, tactile typing, and visual quizzes—giving educators precise diagnostic insight into every learning stage.
                </p>

                {/* Start Learning & Demo CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                  <Link
                    href="/signup"
                    className="px-7 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-base shadow-xl shadow-teal-700/20 transition transform hover:-translate-y-0.5 interactive-target flex items-center justify-center gap-2"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    href="/demo"
                    className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-black text-base border-2 border-slate-300 shadow-xs transition interactive-target flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 text-teal-700 fill-teal-700" />
                    <span>Try Demo</span>
                  </Link>
                </div>

                {/* Trust Badges */}
                {/* <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <VolumeX className="w-4 h-4 text-rose-500" />
                    <span>Zero Auditory Reliance</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-700" />
                    <span>Designed toward WCAG 2.2 AA</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Human-Reviewed NSL</span>
                  </div>
                </div> */}
              </div>

              {/* Right Column (Sign Language Video Player Card - Introduction NSL Video) */}
              <div className="lg:col-span-5">
                <div className="bg-slate-950 rounded-3xl p-3 sm:p-4 border-2 border-slate-800 shadow-2xl relative overflow-hidden space-y-3">
                  {/* Top Review Header */}
                  <div className="flex items-center justify-between text-xs px-2 pt-1 text-slate-300">
                    {/* <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Approved • Nigerian Sign Language (NSL)
                    </span> */}
                    <span className="text-[11px] text-teal-300 font-semibold">
                      Welcome Introduction
                    </span>
                  </div>

                  {/* Video Container (YouTube Intro Sign Video: By5O5IGPNBU) */}
                  <div className="aspect-video bg-black rounded-2xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
                    <iframe
                      src="https://www.youtube-nocookie.com/embed/By5O5IGPNBU?rel=0&modestbranding=1&playsinline=1"
                      title="Nigerian Sign Language Introduction (NSL)"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>

                  {/* Video Caption & Status */}
                  {/* <div className="bg-slate-900 rounded-2xl p-3 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="text-white font-extrabold text-xs">
                        Introduction to Sign Language Learning (NSL)
                      </span>
                    </div>
                    <span className="text-[11px] text-teal-400 font-bold shrink-0">
                      Abuja Deaf Review Team
                    </span>
                  </div> */}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 1. THE LEARNER PROBLEM (Section 3: Grounded Early Evidence) */}
        {/* ========================================================================= */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-teal-800">
              The Validated Learning Challenge
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Where Deaf Learners Often Struggle
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Early discovery observations with a 16-year-old Deaf learner showed an enthusiasm for laptops and typing, but resistance to paper exercise books. He could recognize computer icons, but struggled with spelling and confusing vocabulary definitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                1
              </div>
              <h3 className="text-lg font-black text-slate-900">Sign to Picture Gap</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                A learner may know the sign for an object, but hesitate when matching it to a real photograph or diagram without clear visual feedback.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">Picture to Written Word Gap</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Recognizing a picture does not automatically translate to understanding the English written word or mastering its exact letter spelling.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900">Word to Meaning Gap</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Traditional definitions use complex auditory and linguistic jargon that confuse learners. We use short sentences and concrete everyday examples.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. THE FIVE-STEP SOLUTION */}
        {/* ========================================================================= */}
        <section className="py-16 bg-slate-100/70 border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800">
                The Core Educational Engine
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                The Five-Step Visual Literacy Journey
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                Each vocabulary item connects five sequential stages to build solid understanding.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
                <span className="text-xs font-black text-teal-800 uppercase block">Stage 1</span>
                <h4 className="text-base font-black text-slate-900">Watch Sign</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Clear video of human signer with chest signing space and facial expressions visible.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
                <span className="text-xs font-black text-teal-800 uppercase block">Stage 2</span>
                <h4 className="text-base font-black text-slate-900">Select Picture</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Match the sign to the real physical object. Written text is hidden before choice.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
                <span className="text-xs font-black text-teal-800 uppercase block">Stage 3</span>
                <h4 className="text-base font-black text-slate-900">Learn Word</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Inspect the written English word and tap individual letters to see fingerspelling.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
                <span className="text-xs font-black text-teal-800 uppercase block">Stage 4</span>
                <h4 className="text-base font-black text-slate-900">Simple Meaning</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Understand what the item does through short sentences and familiar examples.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
                <span className="text-xs font-black text-teal-800 uppercase block">Stage 5</span>
                <h4 className="text-base font-black text-slate-900">Type Spelling</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Practise spelling on physical laptop keys or on-screen visual keyboard with zero audio cues.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. THE 4 COMPUTER WORDS DEMO PREVIEW */}
        {/* ========================================================================= */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800">
                Focused MVP Scope (Section 7)
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                The Four Foundational Computer Words
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                We focus on four essential digital literacy words before expanding the curriculum.
              </p>
            </div>

            <Link
              href="/demo"
              className="px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition flex items-center gap-2 self-start md:self-auto interactive-target shadow-sm"
            >
              <span>Launch 90-Second Demo</span>
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
                  <div className="aspect-video bg-slate-100 overflow-hidden border-b border-slate-200">
                    <img
                      src={item.imageUrl}
                      alt={item.word}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
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
        </section>

        {/* ========================================================================= */}
        {/* NEW INNOVATION: ATTACHED COLOURFUL HAND VIRTUAL KEYBOARD TRAINER */}
        {/* ========================================================================= */}
        {/* <section className="py-16 bg-gradient-to-b from-teal-900 via-slate-900 to-slate-950 text-white border-y border-teal-800/40 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <span className="px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                  <Keyboard className="w-3.5 h-3.5" />
                  Tactile Touch Typing Innovation
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Attached Colourful Hand Virtual Keyboard Trainer
                </h2>
                <p className="text-sm sm:text-base text-teal-100 font-medium leading-relaxed">
                  To improve Deaf learners&apos; typing fluency without audio cues, our virtual keyboard attaches color-coded hands that light up in real-time, teaching progressive home row placement from ASDF to JKL; and center reach keys GH.
                </p>
              </div>

              <Link
                href="/keyboard-trainer"
                className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm transition flex items-center gap-2 self-start md:self-auto interactive-target shadow-lg shadow-teal-500/20"
              >
                <Keyboard className="w-4 h-4" />
                <span>Launch Keyboard Trainer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Feature Cards Grid */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-900/90 border border-teal-700/50 rounded-3xl p-5 space-y-3 hover:border-teal-400 transition">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-black">
                  <Hand className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="text-base font-black text-white">Left Hand: A S D F</h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Pinky (A), Ring (S), Middle (D), Index (F). Anchors the non-dominant or left hand with immediate visual confirmation.
                </p>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block pt-1">
                  Rose · Orange · Green · Sky
                </span>
              </div>

              <div className="bg-slate-900/90 border border-teal-700/50 rounded-3xl p-5 space-y-3 hover:border-teal-400 transition">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black">
                  <Hand className="w-5 h-5 text-blue-400 scale-x-[-1]" />
                </div>
                <h3 className="text-base font-black text-white">Right Hand: J K L ;</h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Index (J), Middle (K), Ring (L), Pinky (;). Mirrors left hand posture to build bilateral coordination and rhythm.
                </p>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block pt-1">
                  Blue · Teal · Amber · Pink
                </span>
              </div>

              <div className="bg-slate-900/90 border border-teal-700/50 rounded-3xl p-5 space-y-3 hover:border-teal-400 transition">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black">
                  <Layers className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-base font-black text-white">Center Reach: G &amp; H</h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Trains the index fingers to reach into the center column and return smoothly to their home anchor positions.
                </p>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block pt-1">
                  Index Extension Agility
                </span>
              </div>

              <div className="bg-slate-900/90 border border-teal-700/50 rounded-3xl p-5 space-y-3 hover:border-teal-400 transition">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-black">
                  <Camera className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="text-base font-black text-white">Sign Photos on Keys</h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Keys feature authentic high-contrast handshape photographs, connecting fingerspelling recognition with laptop keys.
                </p>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block pt-1">
                  AnySign ASL + NSL Upload
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. FACILITATOR RESULT PREVIEW */}
        {/* ========================================================================= */}
        {/* <section className="py-16 bg-slate-900 text-white"> */}
        {/* <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-400">
                    Actionable Educator Insights
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    Facilitators See Where Learners Need Support
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
                    Rather than giving broad test scores, DeafLMS diagnoses whether difficulty occurred at the sign, picture, spelling, or meaning stage, recommending the exact next review step.
                  </p>
                </div> */}

        {/* Teaser Preview Box */}
        {/* <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-3">
                    <span className="text-slate-200 font-black">Learner: Amina (Demo Learner, Age 16)</span>
                    <span className="text-amber-400">Sample Demonstration Data</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] font-bold">WEBCAM:</span>
                      <span className="text-amber-400 font-bold">Repeat meaning activity</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] font-bold">KEYBOARD:</span>
                      <span className="text-emerald-400 font-bold">Continue</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] font-bold">MOUSE:</span>
                      <span className="text-amber-400 font-bold">Replay sign</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] font-bold">MONITOR:</span>
                      <span className="text-amber-400 font-bold">Review simple meaning</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic">
                    Note: This dashboard shows learning activity, not a medical or cognitive diagnosis.
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/facilitator-results"
                    className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm transition inline-flex items-center gap-2 interactive-target shadow-lg"
                  >
                    <span>View Full Sample Facilitator Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div> */}
        {/* </section> */}

        {/* ========================================================================= */}
        {/* 5. PROPOSED CUSTOMER & PILOT INVITATION (Section 17) */}
        {/* ========================================================================= */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="p-8 sm:p-10 bg-white rounded-3xl border-2 border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800">
                Business Model Linkage &amp; Customers
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Learners Use DeafLMS. Schools &amp; Sponsors Support Access.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
                Learners use DeafLMS. Schools, NGOs, sponsors or families may pay for access. We do not claim existing district contracts or locked pricing; all figures are proposed prices currently being tested with customers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs font-black text-slate-900 block">Annual School Licences</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Designed for special education centres and inclusive academies. (Proposed model).
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs font-black text-slate-900 block">Sponsored Cohorts</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Funded by inclusive NGOs and foundation grants for underserved Deaf learners.
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs font-black text-slate-900 block">Future Family Access</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Proposed monthly subscription for families supporting signing learners at home.
                </span>
              </div>
            </div>

            {/* Pilot Partner Invitation (Mandated by Section 17) */}
            <div className="p-5 bg-teal-50 border-2 border-teal-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-teal-900 block">
                  Join Our Testing Cohort:
                </span>
                <p className="text-sm font-bold text-teal-950">
                  We are seeking schools and organisations to test the prototype with Deaf learners.
                </p>
              </div>
              <a
                href="mailto:pilots@acclusivo.com?subject=DeafLMS%20School%20Pilot%20Inquiry"
                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition text-center shrink-0 interactive-target"
              >
                Inquire About Pilots
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. COMPANY AND PRODUCT IDENTITY (Section 1) */}
        {/* ========================================================================= */}
        {/* <section className="py-12 bg-slate-100/80 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4 text-center">
            <h3 className="text-base font-black text-slate-900">
              Company &amp; Governance Structure
            </h3>
            <p className="text-xs text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              DeafLMS is developed by <strong>Acclusivo</strong>, a Deaf-led inclusive-technology startup owned by <strong>Tech Inclusion Enterprise Ltd</strong> (Abuja, Nigeria). Tech Inclusion for the Deaf Initiative (TIDI) is an independent nonprofit and possible pilot partner; TIDI does not own Acclusivo or DeafLMS.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-500 pt-2">
              <Link href="/user-testing" className="hover:text-teal-800 underline">
                Observed User Testing Evidence
              </Link>
              <span>•</span>
              <Link href="/accessibility" className="hover:text-teal-800 underline">
                Accessibility Statement
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-teal-800 underline">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-teal-800 underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </section> */}
      </main>

      {/* Floating Clarify This Word Modal (AI Safety Feature) */}
      <SignyAITutorModal />

      {/* ========================================================================= */}
      {/* MANDATORY FOOTER (Section 1: Exact Legal Text) */}
      {/* ========================================================================= */}
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
