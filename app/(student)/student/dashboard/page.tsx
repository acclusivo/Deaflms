'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { getCourses } from '@/lib/api';
import { Course } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import {
  Play,
  BookOpen,
  Laptop,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Award,
  Sparkles,
} from 'lucide-react';
import { openClarifyModal } from '@/components/student/SignyAITutorModal';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function load() {
      const c = await getCourses();
      setCourses(c);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar currentRole="student" stars={user?.totalStars || 25} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">

        {/* Welcome Banner — Calm, Picture-First, Deaf-First */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            {/* <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-md border border-teal-200 inline-block">
              Nigerian Sign Language (NSL) • Primary Track
            </span> */}
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Welcome, {user?.displayName || 'Learner'}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
              Visual lessons with pictures, signed explanations and practice.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/student/lessons/lesson-hardware-1"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-md shadow-teal-700/20 transition interactive-target flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start learning</span>
            </Link>

            <button
              type="button"
              onClick={() => openClarifyModal('webcam')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm border-2 border-slate-300 transition interactive-target flex items-center justify-center gap-2"
              title="Open Safe AI Clarification"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Clarify a word</span>
            </button>
          </div>
        </div>

        {/* 4 Focused Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Card 1: Current Lesson */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-black border border-teal-200">
                <BookOpen className="w-5 h-5 text-teal-700" />
              </div>
              <h2 className="text-lg font-black text-slate-900">Current Lesson</h2>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Computer Hardware Basics: See the webcam, watch the sign, and understand the meaning.
              </p>
            </div>
            <Link
              href="/student/lessons/lesson-hardware-1"
              className="py-3 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs transition border border-teal-200 text-center interactive-target"
            >
              Resume lesson →
            </Link>
          </div>

          {/* Card 2: Practice & Typing */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-black border border-slate-200">
                <Laptop className="w-5 h-5 text-slate-700" />
              </div>
              <h2 className="text-lg font-black text-slate-900">Keyboard Practice</h2>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Match fingerspelling handshapes to tactile keyboard letters.
              </p>
            </div>
            <Link
              href="/keyboard-trainer"
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition text-center interactive-target"
            >
              Open Keyboard Trainer →
            </Link>
          </div>

          {/* Card 3: AI Clarification */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-black border border-teal-200">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-lg font-black text-slate-900">AI Clarification</h2>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Look up approved NSL signs or test boundary safeguards safely.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openClarifyModal()}
              className="py-3 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs transition border border-teal-200 text-center interactive-target flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>Clarify a word →</span>
            </button>
          </div>

          {/* Card 4: Human Help */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-black border border-amber-200">
                <HelpCircle className="w-5 h-5 text-amber-700" />
              </div>
              <h2 className="text-lg font-black text-slate-900">Need Help?</h2>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Connect with a verified Deaf facilitator with parent approval.
              </p>
            </div>
            <Link
              href="/support"
              className="py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs transition border border-amber-200 text-center interactive-target"
            >
              Ask a facilitator →
            </Link>
          </div>
        </div>

        {/* Lessons Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Visual Lessons
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Structured by Deaf educators in Abuja, Nigeria.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-xs hover:border-teal-500 transition flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full bg-slate-100 relative overflow-hidden border-b border-slate-200">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-slate-900/80 text-[10px] font-black uppercase text-white backdrop-blur-xs">
                      {course.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-2">
                    <h3 className="font-black text-slate-900 text-lg">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/student/courses/${course.id}`}
                    className="w-full py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 interactive-target"
                  >
                    <span>Start learning</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
