'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getCourseById, getLessonsByCourseId } from '@/lib/api';
import { Course, Lesson } from '@/lib/types';
import { checkLessonAccess } from '@/lib/plans';
import {
  ArrowLeft,
  Play,
  BookOpen,
  CheckCircle2,
  Clock,
  Loader2,
  Zap,
  Lock,
  Terminal,
  Video,
} from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const courseId = params?.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!courseId) return;
      try {
        const [cData, lData] = await Promise.all([
          getCourseById(courseId),
          getLessonsByCourseId(courseId),
        ]);
        setCourse(cData);
        setLessons(lData);
      } catch (e) {
        console.error('Failed to load course detail data:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex items-center gap-3 text-teal-700 font-bold">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading Course...
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Course not found</h2>
        <Link href="/student/dashboard" className="text-sm font-bold text-teal-700 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isEnrolled = course.isFreeTier || (user?.enrolledCourseIds && user.enrolledCourseIds.includes(course.id));

  return (
    <div className="w-full">
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
            <span className="px-3 py-1 bg-teal-50 text-teal-800 text-xs font-black uppercase tracking-wider rounded-md border border-teal-200">
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
              <span>Educator: {course.teacherName || 'Certified NSL Educator'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Enrolment / Checkout Banner */}
        {!course.isFreeTier && (course.priceNgn || 0) > 0 && !isEnrolled ? (
          <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                  Career Track Enrolment
                </span>
                <span className="text-base font-black text-slate-900">
                  ₦{(course.priceNgn || 5000).toLocaleString()} One-Time Access
                </span>
              </div>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                Unlock instant access in 5 seconds via Selar (Debit Card, USSD, Apple Pay) or Direct Wema Bank Transfer.
              </p>
            </div>
            <Link
              href={`/checkout?course=${course.id}`}
              className="py-3 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs shadow-md transition shrink-0 flex items-center gap-1.5 interactive-target"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Unlock Course (₦{(course.priceNgn || 5000).toLocaleString()}) →</span>
            </Link>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">
                {!course.isFreeTier && (course.priceNgn || 0) > 0 ? (
                  <>Your Status: <strong className="text-emerald-700">Enrolment Active • Full Course Unlocked</strong></>
                ) : (
                  <>Your Status: <strong>Basic 1 • 100% Free Tier Included</strong></>
                )}
              </span>
            </div>
            <Link href="/pricing" className="font-black text-teal-800 hover:underline">
              View All Supporter Plans →
            </Link>
          </div>
        )}

        {/* Lesson List with Server Entitlement Checks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Module Lessons &amp; Sign Videos</h2>
            <span className="text-xs font-bold text-slate-500">{lessons.length} Lessons Available</span>
          </div>

          <div className="bg-white rounded-3xl border-2 border-slate-200 p-2 divide-y divide-slate-100 shadow-sm">
            {lessons.map((item, idx) => {
              const access = checkLessonAccess(user, item.id, course.id);
              const isUnlocked = access.allowed;

              return (
                <div
                  key={item.id}
                  className="py-4 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition rounded-2xl"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 mt-0.5 sm:mt-0 border ${
                        isUnlocked
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      {item.orderIndex || idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                          {item.title}
                        </h3>
                        {isUnlocked ? (
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Enrollment Required
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {isUnlocked ? (
                      <Link
                        href={`/student/lessons/${item.id}`}
                        className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-black transition shadow-sm interactive-target"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch Sign Lesson</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/checkout?course=${course.id}`}
                        className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm interactive-target"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Unlock Full Course</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
