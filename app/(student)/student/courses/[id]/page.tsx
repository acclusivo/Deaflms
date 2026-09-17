'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { getCourseById, getLessonById } from '@/lib/api';
import { Course, Lesson } from '@/lib/types';
import { ArrowLeft, Play, BookOpen, CheckCircle2, Clock, Loader2 } from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!courseId) return;
      const data = await getCourseById(courseId);
      setCourse(data);
      setLoading(false);
    }
    load();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar currentRole="student" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-indigo-600 font-bold">
            <Loader2 className="w-6 h-6 animate-spin" />
            Loading Course...
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar currentRole="student" />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Course not found</h2>
          <Link href="/student/dashboard" className="text-sm font-bold text-indigo-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentRole="student" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        <Link
          href="/student/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>

        {/* Course Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 space-y-3">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-wider rounded-md">
              {course.category} • {course.gradeLevel}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {course.title}
            </h1>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              {course.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" />
                {course.durationMinutes} Minutes
              </span>
              <span>•</span>
              <span>Educator: {course.teacherName || 'Mr. Jordan Ellis'}</span>
            </div>
          </div>
        </div>

        {/* Plan Entitlement Notice */}
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800">
              Your Current Access: <strong>Basic 1 • 1 Module • 5 Lessons Included</strong>
            </span>
          </div>
          <Link href="/pricing" className="font-black text-indigo-700 hover:underline">
            View Supporter Plans →
          </Link>
        </div>

        {/* Lesson List with Server Entitlement Checks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Module Lessons &amp; Sign Videos</h2>
            <span className="text-xs font-bold text-slate-500">5 Lessons Available</span>
          </div>

          <div className="bg-white rounded-3xl border-2 border-slate-200 p-2 divide-y divide-slate-100 shadow-sm">
            {[
              {
                id: 'lesson-hardware-1',
                order: 1,
                title: 'Lesson 1: Computer Hardware Signs & Functions',
                desc: 'Monitor, Keyboard, Mouse, and Webcam signs with 0.5x slow-mo playback.',
                badge: 'Free Basic 1',
                href: '/student/worksheets/ws-hardware-match',
                unlocked: true,
              },
              {
                id: 'lesson-keyboard-1',
                order: 2,
                title: 'Lesson 2: Fingerspelling QWERTY Typing & Handshapes',
                desc: 'AnySign handshapes mapped to physical QWERTY keys.',
                badge: 'Free Basic 1',
                href: '/student/digital-literacy',
                unlocked: true,
              },
              {
                id: 'lesson-web-1',
                order: 3,
                title: 'Lesson 3: Web Browser Navigation & Safe Online Signs',
                desc: 'URL link icons, search buttons, and online sign safety rules.',
                badge: 'Free Basic 1',
                href: '/student/digital-literacy',
                unlocked: true,
              },
              {
                id: 'lesson-everyday-1',
                order: 4,
                title: 'Lesson 4: Everyday Signs for School & Home',
                desc: 'Greetings, family questions, and classroom visual vocabulary.',
                badge: 'Free Basic 1',
                href: '/student/worksheets/ws-hardware-match',
                unlocked: true,
              },
              {
                id: 'lesson-storybook-1',
                order: 5,
                title: 'Lesson 5: Dual-Pane Storybook: The Clever Fox',
                desc: 'Interactive dual-pane storybook with side-by-side sign video demonstration.',
                badge: 'Free Basic 1',
                href: '/student/storybook/lesson-storybook-1',
                unlocked: true,
              },
            ].map((item) => (
              <div key={item.id} className="py-4 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition rounded-2xl">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 mt-0.5 sm:mt-0">
                    {item.order}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">{item.title}</h3>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{item.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition shadow-sm interactive-target"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Start Lesson
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
