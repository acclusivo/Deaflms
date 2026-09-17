'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HandMetal,
  GraduationCap,
  BookOpen,
  Laptop,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Video,
  Eye,
  HeartHandshake,
  Play,
  CheckCircle2,
  Globe,
  Award,
  BookMarked,
  VolumeX,
  Users,
  Smile,
  Youtube,
  Gauge,
} from 'lucide-react';
import { SignExplainerCard } from '@/components/common/SignExplainerCard';

interface FeatureSignGuide {
  id: string;
  tabLabel: string;
  icon: React.ReactNode;
  title: string;
  signTitle: string;
  conceptWord: string;
  fingerspell: string;
  description: string;
  videoUrl: string;
  posterUrl: string;
  accentColor: 'indigo' | 'emerald' | 'amber' | 'purple';
  signGuide: {
    handshape: string;
    movement: string;
    facialExpression: string;
  };
  tags: string[];
}

export default function LandingPage() {
  const [activeGuideTab, setActiveGuideTab] = useState<string>('welcome');

  // Hero YouTube video selector state (curated sign language introductory videos)
  const [heroYoutubeId, setHeroYoutubeId] = useState<string>('v1desDduz5M');
  const [heroVideoTitle, setHeroVideoTitle] = useState<string>('Basic Signs for Kids & Parents');

  const heroVideoOptions = [
    {
      id: 'v1desDduz5M',
      label: 'Family & First Signs',
      title: 'Introductory Sign Language for Parents & Kids',
      badge: 'Parent & Child',
    },
    {
      id: '0FcwzMq4iWg',
      label: 'Alphabet & Fingerspell',
      title: 'Fingerspelling & Alphabet Handshapes',
      badge: 'Literacy Foundation',
    },
    {
      id: 'ianCxd71nM4',
      label: 'Everyday Words',
      title: 'Everyday Communication Signs in the Home',
      badge: 'Home & School',
    },
  ];

  const signGuides: Record<string, FeatureSignGuide> = {
    welcome: {
      id: 'welcome',
      tabLabel: 'Welcome to DeafLMS',
      icon: <HandMetal className="w-4 h-4" />,
      title: 'Welcome to Deaf LMS (K-12 Visual Learning)',
      signTitle: 'Sign: WELCOME (NSL / ASL)',
      conceptWord: 'WELCOME',
      fingerspell: 'W E L C O M E',
      description:
        'In Nigerian Sign Language (NSL) and ASL, this welcoming sign invites students and parents into our visual classroom. No sound is needed—watch the open hands glide gently toward the body to say "You are warmly welcome here".',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
      accentColor: 'indigo',
      signGuide: {
        handshape: 'Open 5-handshape with palms angled upward and fingers relaxed.',
        movement: 'Start out in front at waist level and sweep smoothly inward toward your torso.',
        facialExpression: 'Warm, open smile with soft eye contact to show hospitality and encouragement.',
      },
      tags: ['Greeting', 'Zero Audio', 'Nigerian Sign Friendly', 'Orientation'],
    },
    student: {
      id: 'student',
      tabLabel: 'Student Learning',
      icon: <GraduationCap className="w-4 h-4" />,
      title: 'Student Visual Learning & Matching Games',
      signTitle: 'Sign: LEARN / STUDENT',
      conceptWord: 'LEARN',
      fingerspell: 'L E A R N',
      description:
        'Demonstrates how Deaf children take knowledge from the visual book or screen and absorb it into their mind. Students match real-life pictures with sign videos and written English words.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      accentColor: 'emerald',
      signGuide: {
        handshape: 'Non-dominant hand flat like an open book; dominant hand grabs upward.',
        movement: 'Dominant fingertips touch the flat palm, then close into a cluster touching the forehead.',
        facialExpression: 'Alert, curious expression with raised eyebrows representing mental focus.',
      },
      tags: ['Literacy', 'Tri-Directional Match', 'Star Rewards', 'Self-Paced'],
    },
    tech: {
      id: 'tech',
      tabLabel: 'Computer & Typing',
      icon: <Laptop className="w-4 h-4" />,
      title: 'Digital Literacy & Fingerspell Keyboarding',
      signTitle: 'Sign: COMPUTER / TYPE',
      conceptWord: 'COMPUTER',
      fingerspell: 'C O M P U T E R',
      description:
        'Teaches Deaf children computer parts (webcam, monitor, keyboard) and touch-typing using our visual QWERTY keyboard with handshapes mapping to keys.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      accentColor: 'amber',
      signGuide: {
        handshape: 'Form a curved "C" handshape with your dominant hand.',
        movement: 'Bounce the "C" handshape smoothly along the forearm of your non-dominant arm.',
        facialExpression: 'Forward nod with concentrated gaze demonstrating digital work.',
      },
      tags: ['Hardware', 'Fingerspell QWERTY', 'Webcam Etiquette', 'Tech Career'],
    },
    storybook: {
      id: 'storybook',
      tabLabel: 'Visual Storybook',
      icon: <BookOpen className="w-4 h-4" />,
      title: 'Dual-Pane Interactive Storybooks with Sign Video',
      signTitle: 'Sign: STORY / BOOK',
      conceptWord: 'STORY',
      fingerspell: 'S T O R Y',
      description:
        'Bilingual reading that places beautifully illustrated story pages directly alongside continuous teacher sign demonstration. Tap any word to see its individual sign instantly.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
      accentColor: 'purple',
      signGuide: {
        handshape: 'Both hands in curved "F" or pinched "O" shapes touching at fingertips.',
        movement: 'Gently pull hands apart in rhythmic weaving waves to represent telling a narrative.',
        facialExpression: 'Expressive and animated, changing with the character and emotion of the story.',
      },
      tags: ['Storytelling', 'Bilingual Literacy', 'Synchronized Video', 'Word Popups'],
    },
  };

  const currentGuide = signGuides[activeGuideTab] || signGuides.welcome;

  const scrollToGuide = (tabKey: string) => {
    setActiveGuideTab(tabKey);
    const element = document.getElementById('sign-language-guide');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <HandMetal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Deaf<span className="text-indigo-600">LMS</span>
                </span>
                <span className="px-2 py-0.5 text-[11px] font-black uppercase bg-indigo-100 text-indigo-700 rounded-md">
                  K-12 Platform
                </span>
              </div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                Visual Sign &amp; Digital Literacy • Nigerian &amp; Global DHH
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => scrollToGuide('welcome')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition interactive-target"
            >
              <Video className="w-3.5 h-3.5 text-indigo-600" />
              Watch Sign Guide
            </button>

            <Link
              href="/student/dashboard"
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-200 transition interactive-target"
            >
              Launch Platform
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-20">
        
        {/* HERO SECTION: 2-COLUMN SPLIT (Left: Parent & Learner Content + Start Button | Right: YouTube Sign Video) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2 sm:pt-4">
          
          {/* Left Column: Short, Impactful Content & Start Button */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-wider shadow-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>🇳🇬 Nigerian Sign Language (NSL) &amp; ASL Ready</span>
              <span className="text-emerald-400">•</span>
              <span className="flex items-center gap-1">
                <VolumeX className="w-3.5 h-3.5 text-rose-500" /> Zero Audio Needed
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Where Signs, Pictures &amp; Digital Skills{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">
                  Come Together
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
                Over 90% of deaf children are born to hearing parents. In Nigeria and across the world, Deaf LMS bridges the communication gap by introducing reading, writing, and computer skills through natural <strong>sign language video demonstrations</strong>.
              </p>
            </div>

            {/* Quick Benefits for Parents & Deaf Learners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-slate-900 text-xs uppercase tracking-wide">For Parents &amp; Families</h2>
                  <p className="text-slate-600 text-xs font-medium mt-0.5 leading-snug">
                    Learn signs alongside your child with slow-mo YouTube videos and handshape guides.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-slate-900 text-xs uppercase tracking-wide">For Deaf Learners</h2>
                  <p className="text-slate-600 text-xs font-medium mt-0.5 leading-snug">
                    Audio-free quizzes, visual storybooks, fingerspell typing, and star achievements.
                  </p>
                </div>
              </div>
            </div>

            {/* Primary Action Button & Secondary Triggers */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/student/dashboard"
                className="px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-xl shadow-indigo-200 hover:scale-105 transition interactive-target flex items-center gap-2.5"
              >
                <GraduationCap className="w-5 h-5" />
                Start Learning in Sign Language
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => scrollToGuide('welcome')}
                className="px-5 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm border-2 border-slate-300 shadow-sm transition interactive-target flex items-center gap-2"
              >
                <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                Explore Sign Curriculum
              </button>
            </div>

            {/* Micro-Badges Trust Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Visual Sign Affirmations
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> K-12 Literacy Engine
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Works On Mobile &amp; Tablet
              </span>
            </div>
          </div>

          {/* Right Column: YouTube Sign Language Player Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 rounded-3xl overflow-hidden border-4 border-indigo-500/40 shadow-2xl relative flex flex-col group">
              {/* Header Bar */}
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black text-white tracking-wide truncate">
                    {heroVideoTitle}
                  </span>
                </div>

                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                  <Youtube className="w-3 h-3 fill-rose-500 text-rose-500" />
                  YouTube Video
                </span>
              </div>

              {/* Responsive 16:9 Video Embed */}
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <iframe
                  src={`https://www.youtube.com/embed/${heroYoutubeId}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1`}
                  title={heroVideoTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Video Selector Options for Parents & Kids */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold px-1">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" /> Watch Sign Video Topics:
                  </span>
                  <span className="text-slate-400">Tap to Switch</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {heroVideoOptions.map((opt) => {
                    const isCurrent = heroYoutubeId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setHeroYoutubeId(opt.id);
                          setHeroVideoTitle(opt.title);
                        }}
                        className={`py-2 px-1.5 rounded-xl text-[11px] font-black text-center transition flex flex-col items-center justify-center interactive-target ${
                          isCurrent
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                        }`}
                      >
                        <span className="truncate w-full">{opt.label}</span>
                        <span className={`text-[9px] font-bold ${isCurrent ? 'text-indigo-200' : 'text-slate-500'}`}>
                          {opt.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Parent & Child Guidance Helper */}
                <div className="bg-slate-900/90 rounded-2xl p-2.5 border border-slate-800/80 flex items-start gap-2 text-slate-300 text-[11px] font-medium leading-relaxed">
                  <Gauge className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-white">Tip for Parents:</strong> Tap the video gear icon <strong className="text-amber-400">⚙️ Settings</strong> to set playback speed to <strong className="text-amber-400">0.5x Slow-Mo</strong> so you and your child can observe every hand movement clearly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED SIGN LANGUAGE PLAYER CARD (Reusable Core Section) */}
        <section id="sign-language-guide" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Visual Sign Player for Deaf Children
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Watch How Each Feature Works in Sign Language
              </h2>
              <p className="text-sm text-slate-600 font-medium mt-1">
                Deaf children learn best when seeing the teacher&apos;s hands, facial expressions, and fingerspelling. Tap any category below to switch videos.
              </p>
            </div>

            {/* Quick Speed Tip Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-900 px-3.5 py-1.5 rounded-xl text-xs font-bold self-start md:self-end">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Use <strong>0.5x / 0.75x Slow-Mo</strong> &amp; <strong>Loop</strong> to practice signing</span>
            </div>
          </div>

          {/* Interactive Tab Selector for Sign Topics */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-300">
            {Object.values(signGuides).map((guide) => {
              const isActive = activeGuideTab === guide.id;
              return (
                <button
                  key={guide.id}
                  onClick={() => setActiveGuideTab(guide.id)}
                  className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 interactive-target ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-md border border-slate-200 scale-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                    {guide.icon}
                  </span>
                  <span>{guide.tabLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Render Reusable Sign Language Player Card */}
          <SignExplainerCard
            id={`sign-card-${currentGuide.id}`}
            title={currentGuide.title}
            signTitle={currentGuide.signTitle}
            conceptWord={currentGuide.conceptWord}
            fingerspell={currentGuide.fingerspell}
            description={currentGuide.description}
            videoUrl={currentGuide.videoUrl}
            posterUrl={currentGuide.posterUrl}
            signGuide={currentGuide.signGuide}
            accentColor={currentGuide.accentColor}
            tags={currentGuide.tags}
            badgeText="🇳🇬 Nigerian Sign Language (NSL) &amp; ASL Guide"
            showPracticeButton={true}
          />
        </section>

        {/* 3 Portal Selection Cards (with Sign Watcher Triggers) */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Tri-Portal Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Select an Experience to Explore
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Every portal contains dedicated visual sign instructions for zero-confusion onboarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Portal Card */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border-4 border-emerald-400/40 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition group flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <button
                    onClick={() => scrollToGuide('student')}
                    className="text-[11px] font-black uppercase text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 transition interactive-target"
                    title="Watch Student Sign Explanation"
                  >
                    <Video className="w-3 h-3" />
                    Sign Video
                  </button>
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                    Student Portal
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">Enter as Student</h3>
                  <p className="text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                    Slow-mo sign demonstrations, picture-to-sign quizzes, visual storybooks, and tap-to-type fingerspell keyboarding.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/student/dashboard"
                  className="inline-flex items-center gap-2 text-emerald-600 font-black text-sm group-hover:translate-x-1 transition interactive-target"
                >
                  Start Learning Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Teacher Studio Card */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border-4 border-indigo-400/40 hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition group flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <button
                    onClick={() => scrollToGuide('welcome')}
                    className="text-[11px] font-black uppercase text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 flex items-center gap-1 transition interactive-target"
                    title="Watch Teacher Studio Sign Guide"
                  >
                    <Video className="w-3 h-3" />
                    Sign Video
                  </button>
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    Teacher Studio
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">Enter as Educator</h3>
                  <p className="text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                    Upload sign video demonstrations, auto-generate DHH worksheets with Gemini AI, and inspect student star gradebooks.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/teacher/dashboard"
                  className="inline-flex items-center gap-2 text-indigo-600 font-black text-sm group-hover:translate-x-1 transition interactive-target"
                >
                  Open Teacher Studio <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Admin Hub Card */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border-4 border-amber-400/40 hover:border-amber-500 hover:shadow-xl hover:-translate-y-1 transition group flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <button
                    onClick={() => scrollToGuide('welcome')}
                    className="text-[11px] font-black uppercase text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1 transition interactive-target"
                    title="Watch Admin Overview Sign Guide"
                  >
                    <Video className="w-3 h-3" />
                    Sign Video
                  </button>
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md">
                    Admin Oversight
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">Enter as Principal</h3>
                  <p className="text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                    Review school-wide learning KPIs, moderate published sign curriculum, manage user accounts, and audit storage quotas.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-2 text-amber-800 font-black text-sm group-hover:translate-x-1 transition interactive-target"
                >
                  Open Admin Hub <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Special Spotlight: Why Sign Video Instruction is Essential in Nigeria */}
        <section className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border-2 border-indigo-700/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              Special Education in Nigeria &amp; West Africa
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Why Reusable Sign Language Video Players Accelerate Deaf Learning in Nigeria
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="font-extrabold text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Sign-First Cognitive Bridge
                </div>
                <p>
                  Most Deaf children in Nigeria do not have early access to written English phonetics. Introducing each concept through a video sign demonstration establishes direct cognitive understanding before written reading begins.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="font-extrabold text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Slow-Mo Fingerspelling Inspection
                </div>
                <p>
                  Delicate fingerspelling sequences require slow playback (0.5x, 0.75x) so young children can inspect every finger angle, handshape, and palm orientation without frustration.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="font-extrabold text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Zero Auditory Frustration
                </div>
                <p>
                  Standard software buzzers and auditory dings alienate deaf students. Deaf LMS provides visual confetti bursts, glowing borders, and star meters for every success.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="font-extrabold text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Teacher Time Multiplier
                </div>
                <p>
                  Special educators in Nigerian schools can record a single sign demonstration once, and our reusable player embeds it across student dashboards, worksheets, and storybooks seamlessly.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => scrollToGuide('storybook')}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition interactive-target inline-flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Explore Bilingual Storybook Video Signs
              </button>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Built for Deaf &amp; Hard-of-Hearing Success
            </h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Pedagogically proven bilingual-bicultural (Bi-Bi) learning tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Sign Video Player with Slow-Mo</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Instant 0.5x, 0.75x, and 1.0x playback speeds with A-B continuous looping, designed for inspecting delicate fingerspelling and handshapes.
              </p>
              <button
                onClick={() => scrollToGuide('welcome')}
                className="text-xs font-black text-indigo-600 hover:underline flex items-center gap-1 pt-1"
              >
                Watch Demonstration →
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Digital &amp; Computer Literacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Hardware diagram matching, QWERTY fingerspell typing trainer, and video call sign etiquette for independent digital communication.
              </p>
              <button
                onClick={() => scrollToGuide('tech')}
                className="text-xs font-black text-emerald-600 hover:underline flex items-center gap-1 pt-1"
              >
                Watch Computer Signs →
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Gemini AI Visual Tutor</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                &quot;Signy&quot; transforms difficult terminology into visual analogies, sign guidelines, and fingerspelling sequences with zero audio dependency.
              </p>
              <button
                onClick={() => scrollToGuide('student')}
                className="text-xs font-black text-amber-700 hover:underline flex items-center gap-1 pt-1"
              >
                Watch Student Signs →
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Sign Guide Shortcut for Deaf Learners */}
      <aside className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => scrollToGuide('welcome')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3.5 sm:px-5 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 font-black text-xs sm:text-sm border-2 border-white transform hover:scale-105 transition interactive-target"
          title="Open Nigerian Sign Language Video Guide"
        >
          <HandMetal className="w-5 h-5 animate-bounce" />
          <span className="hidden sm:inline">🇳🇬 Watch Sign Guide</span>
        </button>
      </aside>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs font-bold text-slate-400">
        Deaf LMS — Built for Deaf &amp; Hard-of-Hearing K-12 Learners in Nigeria and Worldwide
      </footer>
    </div>
  );
}
