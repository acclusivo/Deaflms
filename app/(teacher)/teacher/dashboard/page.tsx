'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { getCourses } from '@/lib/api';
import { Course } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
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
  Camera,
  Globe,
  Award,
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getCourses();
      setCourses(data);
    }
    load();
  }, []);

  const dialectNames: Record<string, { name: string; flag: string; curriculum: string }> = {
    NSL: {
      name: 'Nigerian Sign Language (NSL)',
      flag: '🇳🇬',
      curriculum: 'NERDC Special Needs National Curriculum (Nigeria)',
    },
    KRSL: {
      name: 'Korean Sign Language (한국수어)',
      flag: '🇰🇷',
      curriculum: 'South Korea National Special Education & KSL Act (한국수어법) Standards',
    },
    KSL: {
      name: 'Kenyan Sign Language (KSL)',
      flag: '🇰🇪',
      curriculum: 'KICD Special Needs Education Standards (Kenya)',
    },
    SASL: {
      name: 'South African Sign Language (SASL)',
      flag: '🇿🇦',
      curriculum: 'DBE CAPS Specialised Language Curriculum (South Africa)',
    },
    GSL: {
      name: 'Ghanaian Sign Language (GSL)',
      flag: '🇬🇭',
      curriculum: 'Ghana Education Service DHH Framework',
    },
    ASL: {
      name: 'American Sign Language (Global)',
      flag: '🌐',
      curriculum: 'Universal K-12 Deaf STEM & Literacy Standards',
    },
    BSL: {
      name: 'British Sign Language (BSL)',
      flag: '🇬🇧',
      curriculum: 'UK National Deaf Children’s Curriculum Standards',
    },
    IS: {
      name: 'International Sign (IS)',
      flag: '🌍',
      curriculum: 'WFD International Deaf Education Framework',
    },
  };

  const currentDialect = (user?.signLanguage as string) || 'NSL';
  const dialectInfo = dialectNames[currentDialect] || dialectNames['NSL'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentRole="teacher" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header — Personalized to Educator */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-sm">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 border border-indigo-200">
                <span>{dialectInfo.flag}</span>
                <span>{dialectInfo.name} Certified</span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block border border-emerald-200">
                Classroom Lead
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome, {user?.displayName || 'Jordan Ellis'}
            </h1>

            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Aligned with <strong>{dialectInfo.curriculum}</strong>. Manage your deaf learners, generate AI visual worksheets, and upload classroom sign photos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/teacher/ai-generator"
              className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-sm border-2 border-indigo-200 transition interactive-target shadow-xs"
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

        {/* Educator Feature Row: AI Worksheet & Fingerspelling Keyboard Classroom Manager */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Generator Tool Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-white p-6 sm:p-7 rounded-3xl border-2 border-indigo-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">
                  Calibrated for {dialectInfo.name}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                AI Visual Worksheet Co-Pilot
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Create instant fingerspelling match tests, multiple-choice sign comprehension worksheets, and printable PDF materials for your class in seconds.
              </p>
            </div>

            <Link
              href="/teacher/ai-generator"
              className="inline-flex items-center justify-between w-full p-3 bg-white hover:bg-indigo-600 text-indigo-700 hover:text-white font-black text-xs rounded-2xl border border-indigo-200 transition shadow-xs group"
            >
              <span>Launch Worksheet Generator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* Classroom Fingerspelling Photos Card */}
          <div className="bg-gradient-to-br from-amber-50 to-white p-6 sm:p-7 rounded-3xl border-2 border-amber-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-200">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                  School Visual Media
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                School Handshape Photo Hub
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Upload real photos of your own hands or students signing each letter to customize the interactive fingerspelling keyboard for your school cohort.
              </p>
            </div>

            <Link
              href="/student/digital-literacy"
              className="inline-flex items-center justify-between w-full p-3 bg-white hover:bg-amber-500 text-amber-900 hover:text-white font-black text-xs rounded-2xl border border-amber-200 transition shadow-xs group"
            >
              <span>Manage School Keyboard Photos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
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
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Assigned Class Cohort
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-slate-900">{courses.length} Active Courses</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Published Units
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-slate-900">92% Accuracy</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Avg. Worksheet Score
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
              <HardDrive className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-slate-900">14.2 GB</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Supabase Video Storage
            </div>
          </div>
        </div>

        {/* Assigned Courses List */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Your Assigned Curriculum Courses</h2>
            <span className="text-xs font-bold text-slate-500">Showing {courses.length} courses</span>
          </div>

          <div className="divide-y divide-slate-100">
            {courses.map((course) => (
              <div key={course.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-indigo-600 shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm sm:text-base">{course.title}</h3>
                    <p className="text-xs text-slate-500">Grade {course.gradeLevel} • {course.lessonsCount} Video Lessons</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/courses/${course.id}`}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                  >
                    View Lessons
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
