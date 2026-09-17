'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { SignyAITutorModal } from '@/components/student/SignyAITutorModal';
import { getCourses, getCurrentUser } from '@/lib/api';
import { Course, UserProfile } from '@/lib/types';
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
} from 'lucide-react';

export default function StudentDashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser('student');
      setUser(u);
      const c = await getCourses();
      setCourses(c);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentRole="student" stars={user?.totalStars || 24} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Welcome & Gamified Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 relative z-10 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-emerald-100 inline-flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                5 Day Learning Streak!
              </span>
              <span className="text-xs font-extrabold text-emerald-200 uppercase tracking-wider">
                {user?.gradeLevel || 'Grade 3'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Hello, {user?.displayName || 'Maya'}! 👋
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base font-medium">
              Ready to learn new signs and computer skills today? You have 2 lessons ready to explore.
            </p>
          </div>

          {/* Gamified Star Counter & Badges */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shrink-0">
            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1.5 text-3xl font-black text-amber-300">
                <Star className="w-7 h-7 fill-amber-300 animate-star-pop" />
                {user?.totalStars || 24}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/80">Stars Collected</span>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1.5 text-3xl font-black text-white">
                <Trophy className="w-7 h-7 text-amber-300" />
                {user?.badgesUnlocked?.length || 4}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/80">Badges Unlocked</span>
            </div>
          </div>
        </div>

        {/* Featured Digital Literacy Action Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <Laptop className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                Featured Tech Unit
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Computer Hardware Explorer & Typing Trainer
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
                Identify Monitor, Keyboard, Mouse, and Webcam in sign language and practice QWERTY typing.
              </p>
            </div>
          </div>

          <Link
            href="/student/digital-literacy"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-200 transition interactive-target shrink-0"
          >
            Play Tech Game <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Active Learning Courses Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Your Learning Tracks</h2>
            <span className="text-xs font-bold text-slate-400">All courses include sign video & visual worksheets</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm hover:border-indigo-400 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 bg-slate-100 relative overflow-hidden">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-950/70 text-white backdrop-blur-sm">
                      {course.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {course.id === 'course-reading-storybook-1' ? (
                    <Link
                      href="/student/storybook/lesson-storybook-1"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition interactive-target"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Open Visual Storybook
                    </Link>
                  ) : course.id === 'course-digital-literacy-1' ? (
                    <Link
                      href="/student/digital-literacy"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition interactive-target"
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      Open Tech Skills
                    </Link>
                  ) : (
                    <Link
                      href="/student/worksheets/ws-hardware-match"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition interactive-target"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Start Visual Worksheet
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Badge Showcase / Trophy Room */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Your Trophy Case & Badges
            </h2>
            <span className="text-xs font-bold text-slate-400">Earn more by completing sign worksheets</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xl font-black">
                🌟
              </div>
              <div className="font-black text-xs text-amber-900">Digital Navigator</div>
              <p className="text-[10px] text-amber-700">Mastered computer parts</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-black">
                🦊
              </div>
              <div className="font-black text-xs text-emerald-900">Story Explorer</div>
              <p className="text-[10px] text-emerald-700">Read &apos;The Clever Fox&apos;</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-black">
                ⌨️
              </div>
              <div className="font-black text-xs text-indigo-900">Keyboard Star</div>
              <p className="text-[10px] text-indigo-700">Fingerspell typed 10 words</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-xl font-black">
                📹
              </div>
              <div className="font-black text-xs text-rose-900">Webcam Pro</div>
              <p className="text-[10px] text-rose-700">Learned sign call etiquette</p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Signy Visual AI Tutor Assistant */}
      <SignyAITutorModal />
    </div>
  );
}
