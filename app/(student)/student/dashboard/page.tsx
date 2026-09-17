'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { SignyAITutorModal } from '@/components/student/SignyAITutorModal';
import { getCourses } from '@/lib/api';
import { Course, SignLanguageDialect } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import {
  Star,
  Sparkles,
  Trophy,
  Play,
  BookOpen,
  Laptop,
  Flame,
  ArrowRight,
  HandMetal,
  CheckCircle2,
  Clock,
  Globe,
  Heart,
  Compass,
  Keyboard as KeyboardIcon,
  Award,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user, updateProfile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [dailyMinutesLogged, setDailyMinutesLogged] = useState<number>(7);
  const [streakDays, setStreakDays] = useState<number>(5);
  const [showGoalSuccess, setShowGoalSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      const c = await getCourses();
      setCourses(c);
    }
    load();
  }, []);

  const dialectFlags: Record<string, { flag: string; name: string }> = {
    ASL: { flag: '🌐', name: 'American Sign Language (Global)' },
    NSL: { flag: '🇳🇬', name: 'Nigerian Sign Language (NSL)' },
    KSL: { flag: '🇰🇪', name: 'Kenyan Sign Language (KSL)' },
    SASL: { flag: '🇿🇦', name: 'South African Sign Language (SASL)' },
    GSL: { flag: '🇬🇭', name: 'Ghanaian Sign Language (GSL)' },
    BSL: { flag: '🇬🇧', name: 'British Sign Language (BSL)' },
    IS: { flag: '🌍', name: 'International Sign (IS)' },
  };

  const currentDialect = (user?.signLanguage as string) || 'ASL';
  const dialectInfo = dialectFlags[currentDialect] || dialectFlags['ASL'];
  const dailyTarget = user?.dailyGoalMinutes || 10;
  const progressPct = Math.min(100, Math.round((dailyMinutesLogged / dailyTarget) * 100));

  const handleLogProgress = () => {
    const newLogged = dailyMinutesLogged + 5;
    setDailyMinutesLogged(newLogged);
    if (newLogged >= dailyTarget && !showGoalSuccess) {
      setShowGoalSuccess(true);
      if (user) {
        updateProfile({ totalStars: (user.totalStars || 25) + 5 });
      }
      setTimeout(() => setShowGoalSuccess(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentRole="student" stars={user?.totalStars || 25} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Welcome & Personalized Gamified Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 relative z-10 max-w-xl">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-emerald-100 inline-flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                {streakDays} Day Learning Streak!
              </span>

              {/* User Selected Dialect Badge */}
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black tracking-wide text-white inline-flex items-center gap-1.5">
                <span>{dialectInfo.flag}</span>
                <span>{dialectInfo.name}</span>
              </span>

              {/* Persona Tag */}
              {user?.personaGoal === 'parent' && (
                <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full inline-flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-slate-950" />
                  Parent &amp; Child Track
                </span>
              )}
              {user?.personaGoal === 'professional' && (
                <span className="px-3 py-1 bg-purple-200 text-purple-900 font-black text-xs rounded-full">
                  Inclusion Ally Track
                </span>
              )}
            </div>

            {/* Personalized Name Greeting */}
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Hello, {user?.displayName || 'Scholar'}! 👋
            </h1>

            <p className="text-emerald-100 text-sm sm:text-base font-medium leading-relaxed">
              {user?.personaGoal === 'parent'
                ? `Personalized lessons for you to practice with your child in ${dialectInfo.name}. Ready for today’s fingerspelling?`
                : `Your visual learning dashboard is customized for ${dialectInfo.name} (${user?.experienceLevel || 'Beginner'} Level). Let's earn new stars today!`}
            </p>
          </div>

          {/* Gamified Star Counter & Badges */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shrink-0">
            <div className="text-center px-3">
              <div className="flex items-center justify-center gap-1.5 text-3xl font-black text-amber-300">
                <Star className="w-7 h-7 fill-amber-300 animate-star-pop" />
                {user?.totalStars || 25}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/80">
                Stars Collected
              </span>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center px-3">
              <div className="flex items-center justify-center gap-1.5 text-3xl font-black text-white">
                <Trophy className="w-7 h-7 text-amber-300" />
                {user?.badgesUnlocked?.length || 4}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/80">
                Badges Unlocked
              </span>
            </div>
          </div>
        </div>

        {/* Personalized Daily Goal & Parent Tip Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Daily Goal Pace Tracker */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Personal Daily Goal</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Selected during onboarding</p>
                </div>
              </div>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                {dailyTarget} min / day
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>{dailyMinutesLogged} mins logged today</span>
                <span>{progressPct}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {showGoalSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Goal Reached! +5 Bonus Stars awarded!
              </div>
            )}

            <button
              onClick={handleLogProgress}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition interactive-target flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Log +5 Mins Practice Today
            </button>
          </div>

          {/* Dialect Customization Card */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm">Active Sign Dialect</h3>
                <p className="text-[11px] text-slate-500 font-medium">Pan-African &amp; Global Access</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <span className="text-3xl">{dialectInfo.flag}</span>
              <div>
                <div className="font-black text-slate-900 text-sm">{dialectInfo.name}</div>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Handshapes and fingerspelling keyboard are mapped to this dialect.
                </p>
              </div>
            </div>

            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-800 transition pt-1"
            >
              Change dialect or learning goal →
            </Link>
          </div>

          {/* Quick Shortcuts to Interactive Tools */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl border-2 border-indigo-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <KeyboardIcon className="w-5 h-5" />
                </div>
                <h3 className="font-black text-slate-900 text-sm">Fingerspelling Trainer</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Practice typing computer vocabulary with enlarged, authentic sign handshapes!
              </p>
            </div>

            <Link
              href="/student/digital-literacy"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md interactive-target"
            >
              <KeyboardIcon className="w-4 h-4" />
              Launch Keyboard Trainer
            </Link>
          </div>
        </div>

        {/* Featured Course Units */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Recommended for You ({user?.experienceLevel || 'Beginner'} Level)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Tailored visual lessons with embedded sign language video &amp; interactive quizzes
              </p>
            </div>
            <Link
              href="/courses"
              className="text-xs font-black text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1"
            >
              View All Courses <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-300 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-black uppercase text-amber-300">
                      {course.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                      <span>Grade {course.gradeLevel}</span>
                      <span>•</span>
                      <span>{course.durationMinutes} mins</span>
                    </div>
                    <h3 className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/courses/${course.id}`}
                    className="w-full py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-black text-xs transition flex items-center justify-center gap-1.5 border border-indigo-200"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Start Lesson
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tutor Floating Modal Shortcut */}
        <SignyAITutorModal />
      </main>
    </div>
  );
}
