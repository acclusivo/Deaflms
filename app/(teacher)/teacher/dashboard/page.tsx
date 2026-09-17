'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { getCourses } from '@/lib/api';
import { Course } from '@/lib/types';
import {
  Plus,
  Sparkles,
  BookOpen,
  Users,
  CheckCircle2,
  HardDrive,
  FileCheck2,
  ArrowRight,
  Laptop,
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getCourses();
      setCourses(data);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentRole="teacher" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-sm">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md inline-block mb-1">
              Educator Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Welcome, Mr. Jordan Ellis
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Manage DHH curriculum, generate sign worksheets with AI, and review student progress.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/teacher/ai-generator"
              className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-sm border-2 border-indigo-200 transition interactive-target"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              AI Lesson Co-Pilot
            </Link>

            <Link
              href="/teacher/courses/new"
              className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-200 transition interactive-target"
            >
              <Plus className="w-4 h-4" />
              New Course
            </Link>
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-slate-900">28 Students</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Assigned Class Cohort</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-slate-900">{courses.length} Active Courses</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Published Units</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-slate-900">92% Accuracy</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Avg. Worksheet Score</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
              <HardDrive className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-slate-900">14.2 GB</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Supabase Video Storage</div>
          </div>
        </div>

        {/* Course Catalog Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Your Curriculum & Courses</h2>
            <Link
              href="/teacher/gradebook"
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <FileCheck2 className="w-4 h-4" />
              Open Gradebook
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm hover:border-indigo-400 hover:shadow-md transition flex flex-col"
              >
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-950/70 text-white backdrop-blur-sm">
                    {course.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>{course.gradeLevel}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Published
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
