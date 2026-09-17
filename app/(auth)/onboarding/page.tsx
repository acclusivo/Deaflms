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
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { SignLanguageDialect } from '@/lib/types';

interface DialectOption {
  code: SignLanguageDialect;
  name: string;
  flag: string;
  region: string;
  description: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  // Selected Preferences State
  const [selectedDialect, setSelectedDialect] = useState<SignLanguageDialect>('ASL');
  const [personaGoal, setPersonaGoal] = useState<string>('child');
  const [experienceLevel, setExperienceLevel] = useState<string>('beginner');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(10);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);

  const dialectOptions: DialectOption[] = [
    {
      code: 'ASL',
      name: 'American Sign Language (Global)',
      flag: '🌐',
      region: 'Global / International Standard',
      description: 'The most widely recognized sign language across the Americas, international deaf schools, and global communities.',
    },
    {
      code: 'NSL',
      name: 'Nigerian Sign Language (NSL)',
      flag: '🇳🇬',
      region: 'Nigeria & West Africa',
      description: 'Grounded in ASL with rich indigenous Nigerian sign concepts, tailored for West African deaf education.',
    },
    {
      code: 'KSL',
      name: 'Kenyan Sign Language (KSL)',
      flag: '🇰🇪',
      region: 'Kenya & East Africa',
      description: 'Used extensively in Kenya and East African schools, officially recognized by the Kenyan Constitution.',
    },
    {
      code: 'SASL',
      name: 'South African Sign Language (SASL)',
      flag: '🇿🇦',
      region: 'South Africa',
      description: 'South Africa’s 12th official language, widely utilized in national inclusive educational institutions.',
    },
    {
      code: 'GSL',
      name: 'Ghanaian Sign Language (GSL)',
      flag: '🇬🇭',
      region: 'Ghana',
      description: 'Primary sign language in Ghanaian deaf education with strong community literacy roots.',
    },
    {
      code: 'BSL',
      name: 'British Sign Language (BSL)',
      flag: '🇬🇧',
      region: 'United Kingdom & Commonwealth',
      description: 'Two-handed fingerspelling system with distinct grammar used in the UK and partner institutions.',
    },
    {
      code: 'IS',
      name: 'International Sign (IS)',
      flag: '🌍',
      region: 'Cross-Border Conferences',
      description: 'Universal contact sign language used at the World Federation of the Deaf and international summits.',
    },
  ];

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

    // Fire Duolingo-style celebration confetti!
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
        
        {/* STEP 1: CHOOSE REGIONAL SIGN LANGUAGE (GLOBAL & PAN-AFRICAN) */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" />
                <span>Pan-African &amp; Global Scalability</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Which Sign Language Would You Like to Learn?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Deaf LMS is built for global reach. Select your regional dialect to customize sign videos, vocabulary, and handshapes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              {dialectOptions.map((dialect) => {
                const isSelected = selectedDialect === dialect.code;
                return (
                  <button
                    key={dialect.code}
                    onClick={() => setSelectedDialect(dialect.code)}
                    className={`p-4 rounded-3xl border-2 text-left transition-all transform interactive-target flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-white border-indigo-600 shadow-lg shadow-indigo-100 scale-[1.02]'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{dialect.flag}</span>
                        <div>
                          <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                            {dialect.code}
                          </span>
                          <span className="text-[10px] text-indigo-600 font-bold block">
                            {dialect.region}
                          </span>
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-indigo-50" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {dialect.description}
                    </p>
                  </button>
                );
              })}
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
                We customize your course content, vocabulary, and interactive exercises to fit your everyday life.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {personaOptions.map((persona) => {
                const isSelected = personaGoal === persona.id;
                return (
                  <button
                    key={persona.id}
                    onClick={() => setPersonaGoal(persona.id)}
                    className={`p-5 rounded-3xl border-2 text-left transition-all interactive-target flex items-start gap-4 ${
                      isSelected
                        ? `${persona.activeBorder} shadow-lg shadow-slate-200 scale-[1.01]`
                        : `bg-white border-slate-200 ${persona.border} hover:bg-slate-50`
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                      {persona.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-black text-slate-900">{persona.title}</h2>
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-indigo-50 shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-indigo-600">{persona.subtitle}</p>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed pt-1">
                        {persona.detail}
                      </p>
                    </div>
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Skill Calibration</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                What Is Your Current Sign Language Level?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Don&apos;t worry if you have never signed before! We have gentle starter packs with slow-mo replay.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {experienceOptions.map((exp) => {
                const isSelected = experienceLevel === exp.id;
                return (
                  <button
                    key={exp.id}
                    onClick={() => setExperienceLevel(exp.id)}
                    className={`p-6 rounded-3xl border-2 text-left transition-all interactive-target flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'bg-white border-emerald-500 shadow-xl shadow-emerald-100 scale-[1.02]'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {exp.stars}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                        )}
                      </div>
                      <h2 className="text-lg font-black text-slate-900 pt-1">{exp.title}</h2>
                      <p className="text-[11px] text-slate-400 font-bold">{exp.subtitle}</p>
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {exp.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: DAILY COMMITMENT GOAL (DUOLINGO STYLE) */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-800 text-xs font-black uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                <span>Daily Practice Habit</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Pick Your Daily Sign Language Goal
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Consistency is key. Even 5 minutes a day builds lasting visual communication confidence. You can adjust this anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {dailyGoalOptions.map((goal) => {
                const isSelected = dailyGoalMinutes === goal.minutes;
                return (
                  <button
                    key={goal.minutes}
                    onClick={() => setDailyGoalMinutes(goal.minutes)}
                    className={`p-6 rounded-3xl border-2 text-left transition-all interactive-target flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100 scale-[1.02]'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                          {goal.icon}
                        </div>
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-indigo-50" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                        )}
                      </div>
                      <div>
                        <span className="text-xl font-black text-slate-900 block">{goal.pace}</span>
                        <span className="text-xs font-extrabold text-indigo-600 block">{goal.label}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {goal.desc}
                    </p>
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
                    You will receive <strong>+15 Visual Star Points</strong> to kick off your streak!
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
            Selected: <strong className="text-slate-800">{selectedDialect}</strong> • <strong className="text-slate-800">{dailyGoalMinutes} min/day</strong>
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
