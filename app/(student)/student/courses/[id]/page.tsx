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

        {/* Lesson List */}
        <div className="space-y-3">
          <h2 className="text-xl font-black text-slate-900">Lessons in this Course</h2>

          <div className="bg-white rounded-3xl border-2 border-slate-200 p-4 divide-y divide-slate-100 shadow-sm">
            <div className="py-4 px-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                  1
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Lesson 1: Hardware & Vocabulary</h3>
                  <p className="text-xs text-slate-500">Teacher sign video with slow-motion controls</p>
                </div>
              </div>
              <Link
                href="/student/worksheets/ws-hardware-match"
                className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold transition shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start
              </Link>
            </div>

            <div className="py-4 px-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                  2
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Interactive Tech Diagram</h3>
                  <p className="text-xs text-slate-500">Computer hotspot matching game</p>
                </div>
              </div>
              <Link
                href="/student/digital-literacy"
                className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold transition shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
