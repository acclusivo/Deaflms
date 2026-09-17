'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  HandMetal,
  Globe,
  GraduationCap,
  Users,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Flame,
  Clock,
  Award,
  VolumeX,
  Compass,
  Lock,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { SignLanguageDialect } from '@/lib/types';

interface DialectOption {
  code: SignLanguageDialect;
  name: string;
  nativeName?: string;
  flag: string;
  region: string;
  description: string;
  isAvailable: boolean;
  priorityBadge?: string;
  comingSoonText?: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  // Selected Preferences State — Default to Priority 1: Nigeria (NSL)
  const [selectedDialect, setSelectedDialect] = useState<SignLanguageDialect>('NSL');
  const [personaGoal, setPersonaGoal] = useState<string>('child');
  const [experienceLevel, setExperienceLevel] = useState<string>('beginner');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(10);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  // Active Priority Launch Countries (Nigeria & Korea)
  const priorityDialects: DialectOption[] = [
    {
      code: 'NSL',
      name: 'Nigerian Sign Language (NSL)',
      flag: '🇳🇬',
      region: 'Nigeria & West Africa',
      description: 'Aligned with Nigerian National Special Needs curriculum (NERDC) and indigenous Nigerian sign concepts.',
      isAvailable: true,
      priorityBadge: '🟢 Priority Launch 1 • Active Now',
    },
    {
      code: 'KRSL',
      name: 'Korean Sign Language (KRSL)',
      nativeName: '한국수어 (韓國手語)',
      flag: '🇰🇷',
      region: 'South Korea (대한민국)',
      description: 'Official national language of South Korea under the Korean Sign Language Act (한국수어법) with hangul fingerspelling.',
      isAvailable: true,
      priorityBadge: '🟢 Priority Launch 2 • Active Now',
    },
  ];

  // Locked Countries (Coming Soon for Future Rollout)
  const lockedDialects: DialectOption[] = [
    {
      code: 'KSL',
      name: 'Kenyan Sign Language (KSL)',
      flag: '🇰🇪',
      region: 'Kenya & East Africa',
      description: 'Used extensively in Kenya and East African inclusive schools.',
      isAvailable: false,
      comingSoonText: 'Coming Soon • Q2 Future Rollout',
    },
    {
      code: 'SASL',
      name: 'South African Sign Language (SASL)',
      flag: '🇿🇦',
      region: 'South Africa',
      description: 'South Africa’s 12th official language for inclusive education.',
      isAvailable: false,
      comingSoonText: 'Coming Soon • Q2 Future Rollout',
    },
    {
      code: 'GSL',
      name: 'Ghanaian Sign Language (GSL)',
      flag: '🇬🇭',
      region: 'Ghana',
      description: 'Primary visual language across Ghanaian deaf institutions.',
      isAvailable: false,
      comingSoonText: 'Coming Soon • Q3 Future Rollout',
    },
    {
      code: 'ASL',
      name: 'American Sign Language (Global ASL)',
      flag: '🌐',
      region: 'Global / International Standard',
      description: 'Widely used in the Americas and international deaf conferences.',
      isAvailable: false,
      comingSoonText: 'Coming Soon • Q3 Future Rollout',
    },
    {
      code: 'BSL',
      name: 'British Sign Language (BSL)',
      flag: '🇬🇧',
      region: 'United Kingdom & Commonwealth',
      description: 'Two-handed fingerspelling system used in the UK.',
      isAvailable: false,
      comingSoonText: 'Coming Soon • Q4 Future Rollout',
    },
    {
      code: 'IS',
      name: 'International Sign (IS)',
      flag: '🌍',
      region: 'Cross-Border Conferences',
      description: 'Universal contact communication for global symposiums.',
      isAvailable: false,
      comingSoonText: 'Coming Soon • Global Expansion',
    },
  ];

  const handleDialectClick = (dialect: DialectOption) => {
    if (dialect.isAvailable) {
      setSelectedDialect(dialect.code);
      setLockedNotice(null);
    } else {
      setLockedNotice(
        `🔒 ${dialect.name} is reserved for future expansion! Nigeria 🇳🇬 and South Korea 🇰🇷 are the active priority launch systems right now.`
      );
      setTimeout(() => setLockedNotice(null), 4500);
    }
  };

  const personaOptions = [
    {
      id: 'child',
      title: 'Deaf or Hard-of-Hearing Learner',
      subtitle: 'For myself or a deaf child',
      icon: <GraduationCap className="w-6 h-6 text-emerald-600" />,
      detail: 'Visual games, storybooks, fingerspell typing, and star achievements.',
      border: 'hover:border-emerald-500',
      activeBorder: 'border-emerald-500 bg-emerald-50/50',
    },
    {
      id: 'parent',
      title: 'Hearing Parent / Family Member',
      subtitle: 'Learning to communicate at home',
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      detail: 'Learn signs with your child through slow-mo video and home vocabulary.',
      border: 'hover:border-indigo-500',
      activeBorder: 'border-indigo-500 bg-indigo-50/50',
    },
    {
      id: 'facilitator',
      title: 'Facilitator / Educator / Teacher',
      subtitle: 'For classroom & school curriculum',
      icon: <BookOpen className="w-6 h-6 text-amber-700" />,
      detail: 'Upload video modules, generate AI worksheets, and manage student rosters.',
      border: 'hover:border-amber-500',
      activeBorder: 'border-amber-600 bg-amber-50/50',
    },
    {
      id: 'professional',
      title: 'Professional Ally / Adult Learner',
      subtitle: 'Inclusive workplace & public service',
      icon: <Briefcase className="w-6 h-6 text-purple-600" />,
      detail: 'Medical, legal, tech, and service sign communication skills.',
      border: 'hover:border-purple-500',
      activeBorder: 'border-purple-500 bg-purple-50/50',
    },
  ];

  const experienceOptions = [
    {
      id: 'beginner',
      title: 'Brand New to Sign Language',
      subtitle: 'Level 1: Basic Foundations',
      description: 'I am starting from scratch. I want to learn the alphabet, fingerspelling, and basic everyday signs.',
      stars: '⭐ Starter Pack',
    },
    {
      id: 'elementary',
      title: 'Know a Few Signs or Alphabet',
      subtitle: 'Level 2: Building Sentences',
      description: 'I can fingerspell my name and know simple greetings, but want to build speed and sentence structure.',
      stars: '⭐⭐ Skill Builder',
    },
    {
      id: 'intermediate',
      title: 'Comfortable Signing',
      subtitle: 'Level 3: Fluency & Digital Skills',
      description: 'I sign regularly and want dual-pane visual storybooks, fingerspell QWERTY typing, and STEM terminology.',
      stars: '⭐⭐⭐ Fluency Master',
    },
  ];

  const dailyGoalOptions = [
    {
      minutes: 5,
      label: 'Casual',
      pace: '5 mins / day',
      desc: '1 quick visual sign lesson per day. Perfect for busy parents.',
      icon: <Clock className="w-5 h-5 text-indigo-600" />,
    },
    {
      minutes: 10,
      label: 'Regular (Recommended)',
      pace: '10 mins / day',
      desc: '2 lessons + 1 interactive storybook or typing game.',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      recommended: true,
    },
    {
      minutes: 20,
      label: 'Serious',
      pace: '20 mins / day',
      desc: 'Fast-track sign acquisition, full vocabulary mastery & AI practice.',
      icon: <Flame className="w-5 h-5 text-rose-500" />,
    },
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((s) => s + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const handleComplete = () => {
    setIsFinishing(true);

    // Save customized onboarding preferences to user profile
    updateProfile({
      signLanguage: selectedDialect,
      dailyGoalMinutes,
      personaGoal,
      experienceLevel,
      totalStars: (user?.totalStars || 10) + 15, // Bonus onboarding stars!
    });

    // Fire celebration confetti!
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }

    setTimeout(() => {
      if (user?.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else if (user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    }, 1800);
  };

  const progressPercent = Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Header: Progress Bar & Exit */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className={`p-2 rounded-xl transition ${
              step > 1
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            aria-label="Previous step"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Animated Duolingo-style Progress Bar */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              <span>Step {step} of {totalSteps}</span>
              <span className="text-emerald-600">{progressPercent}% Ready</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-600 transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <VolumeX className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">Zero Audio</span>
          </div>
        </div>
      </header>

      {/* Main Content Card Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col justify-center">
        
        {/* STEP 1: CHOOSE REGIONAL SIGN LANGUAGE (PRIORITIZING NIGERIA & KOREA) */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Priority Launch: Nigeria 🇳🇬 &amp; South Korea 🇰🇷</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Which Sign Language Would You Like to Learn?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Deaf LMS is launching priority education tracks in <strong>Nigeria</strong> and <strong>South Korea</strong>. Select your active track below to customize your sign lessons.
              </p>
            </div>

            {/* Locked Dialect Notification Toast */}
            {lockedNotice && (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-3 animate-bounce shadow-md">
                <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{lockedNotice}</span>
              </div>
            )}

            {/* Section 1: ACTIVE PRIORITY LAUNCH TRACKS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Active Priority Launch Tracks (Available Now):
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  2 Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {priorityDialects.map((dialect) => {
                  const isSelected = selectedDialect === dialect.code;
                  return (
                    <button
                      key={dialect.code}
                      onClick={() => handleDialectClick(dialect)}
                      className={`p-5 rounded-3xl border-3 text-left transition-all transform interactive-target flex flex-col justify-between space-y-4 relative ${
                        isSelected
                          ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100 scale-[1.02] ring-4 ring-indigo-100'
                          : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl filter drop-shadow-sm">{dialect.flag}</span>
                          <div>
                            <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                              {dialect.code}
                            </span>
                            <span className="text-sm font-black text-indigo-700 block">
                              {dialect.name}
                            </span>
                            {dialect.nativeName && (
                              <span className="text-xs font-bold text-slate-500 block">
                                {dialect.nativeName}
                              </span>
                            )}
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-slate-300 shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {dialect.description}
                      </p>

                      <div className="pt-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 border border-emerald-200">
                          {dialect.priorityBadge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: LOCKED FUTURE EXPANSION COUNTRIES */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Upcoming Global Expansion (Locked for Future):
                </span>
                <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  6 Coming Soon
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {lockedDialects.map((dialect) => (
                  <button
                    key={dialect.code}
                    onClick={() => handleDialectClick(dialect)}
                    className="p-4 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-100/70 text-left transition hover:border-slate-400 flex flex-col justify-between space-y-3 opacity-75 cursor-pointer interactive-target group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl filter grayscale-[40%] group-hover:grayscale-0 transition">
                          {dialect.flag}
                        </span>
                        <div>
                          <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                            {dialect.code}
                          </span>
                          <span className="text-[11px] text-slate-500 font-bold block">
                            {dialect.region}
                          </span>
                        </div>
                      </div>

                      <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                      {dialect.description}
                    </p>

                    <div className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md self-start border border-amber-200">
                      {dialect.comingSoonText}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: WHO ARE YOU LEARNING FOR? */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>Personalized Learning Path</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Who Are You Learning Sign Language For?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                We calibrate your lesson pacing, visual player, and storybooks based on your role.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {personaOptions.map((opt) => {
                const isSelected = personaGoal === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setPersonaGoal(opt.id)}
                    className={`p-5 rounded-3xl border-2 text-left transition-all transform interactive-target flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100 scale-[1.02] ring-4 ring-indigo-100'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                          {opt.icon}
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 text-sm sm:text-base">
                            {opt.title}
                          </h3>
                          <span className="text-xs font-bold text-slate-400">
                            {opt.subtitle}
                          </span>
                        </div>
                      </div>

                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-indigo-50 shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {opt.detail}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: EXPERIENCE LEVEL */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-black uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Skill Calibration</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                How Much Sign Language Do You Know?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Don&apos;t worry if you&apos;re a total beginner. We will start with fun fingerspelling and everyday signs.
              </p>
            </div>

            <div className="space-y-3 pt-2 max-w-2xl mx-auto">
              {experienceOptions.map((lvl) => {
                const isSelected = experienceLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => setExperienceLevel(lvl.id)}
                    className={`w-full p-5 rounded-3xl border-2 text-left transition-all interactive-target flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100 scale-[1.01] ring-4 ring-indigo-100'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900 text-sm sm:text-base">
                          {lvl.title}
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {lvl.subtitle}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {lvl.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-xs font-black text-amber-600 block">
                        {lvl.stars}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: DAILY COMMITMENT PACE */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-800 text-xs font-black uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                <span>Build A Consistent Visual Habit</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Set Your Daily Learning Goal
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Research shows that 10 minutes of visual signing every day builds fluent fingerspelling recognition faster than long weekend cramming.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {dailyGoalOptions.map((goal) => {
                const isSelected = dailyGoalMinutes === goal.minutes;
                return (
                  <button
                    key={goal.minutes}
                    onClick={() => setDailyGoalMinutes(goal.minutes)}
                    className={`w-full p-5 rounded-3xl border-2 text-left transition-all interactive-target flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100 scale-[1.01] ring-4 ring-indigo-100'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                        {goal.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-slate-900 text-sm sm:text-base">
                            {goal.label}
                          </h3>
                          {goal.recommended && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              Most Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {goal.desc}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-indigo-700 block">
                        {goal.pace}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Completion Ready Summary */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-indigo-50 border border-indigo-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-slate-900">Onboarding Completion Bonus</h2>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Selected Track: <strong>{selectedDialect === 'NSL' ? 'Nigeria (NSL) 🇳🇬' : 'South Korea (KRSL) 🇰🇷'}</strong> • +15 Visual Stars!
                  </p>
                </div>
              </div>

              <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                ⭐ +15 Stars Ready
              </span>
            </div>
          </div>
        )}

      </main>

      {/* Bottom Sticky Action Controls */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 sticky bottom-0 z-30 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Priority Selection: <strong className="text-indigo-700">{selectedDialect === 'NSL' ? '🇳🇬 Nigeria (NSL)' : '🇰🇷 South Korea (KRSL)'}</strong> • <strong className="text-slate-800">{dailyGoalMinutes} min/day</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {step > 1 && (
              <button
                onClick={handlePrev}
                className="px-5 py-3 rounded-2xl border-2 border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition interactive-target"
              >
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={isFinishing}
              className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-200 hover:scale-105 transition interactive-target flex items-center justify-center gap-2"
            >
              {isFinishing ? (
                'Setting Up Your Dashboard...'
              ) : step === totalSteps ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Launch My Customized Dashboard!
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
