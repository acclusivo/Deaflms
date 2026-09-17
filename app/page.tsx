'use client';

import React from 'react';
import Link from 'next/link';
import {
  HandMetal,
  GraduationCap,
  BookOpen,
  Laptop,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle2,
  Video,
  Eye,
  HeartHandshake,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <HandMetal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Deaf<span className="text-indigo-600">LMS</span>
                </span>
                <span className="px-2 py-0.5 text-[11px] font-black uppercase bg-indigo-100 text-indigo-700 rounded-md">
                  K-12 Platform
                </span>
              </div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                Visual Sign & Digital Literacy
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/student/dashboard"
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-200 transition interactive-target"
            >
              Launch Platform
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6 pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border-2 border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Zero Auditory Dependency • DHH-First Learning
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Where Signs, Pictures & Digital Skills{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">
              Come Together
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-xl font-medium leading-relaxed">
            The first accessibility-first K-12 learning management system designed for Deaf and Hard-of-Hearing learners, with interactive visual storybooks, fingerspell typing, and Gemini AI visual tutoring.
          </p>
        </section>

        {/* 3 Portal Selection Cards (1-Click Demo) */}
        <section className="space-y-4">
          <div className="text-center">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Select an Experience to Explore
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Portal Card */}
            <Link
              href="/student/dashboard"
              className="bg-white rounded-3xl p-8 border-4 border-emerald-400/40 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                    Student Portal
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">Enter as Student</h3>
                  <p className="text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                    Watch slow-mo sign videos, match pictures to signs, read interactive storybooks, and practice typing on the fingerspell keyboard.
                  </p>
                </div>
              </div>

              <div className="pt-6 flex items-center gap-2 text-emerald-600 font-black text-sm group-hover:translate-x-1 transition">
                Start Learning Now <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Teacher Studio Card */}
            <Link
              href="/teacher/dashboard"
              className="bg-white rounded-3xl p-8 border-4 border-indigo-400/40 hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    Teacher Studio
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">Enter as Educator</h3>
                  <p className="text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                    Upload your own sign videos to Supabase Storage, auto-generate interactive worksheets with Gemini AI, and inspect student gradebooks.
                  </p>
                </div>
              </div>

              <div className="pt-6 flex items-center gap-2 text-indigo-600 font-black text-sm group-hover:translate-x-1 transition">
                Open Teacher Studio <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Admin Hub Card */}
            <Link
              href="/admin/dashboard"
              className="bg-white rounded-3xl p-8 border-4 border-amber-400/40 hover:border-amber-500 hover:shadow-xl hover:-translate-y-1 transition group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md">
                    Admin Oversight
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">Enter as Principal</h3>
                  <p className="text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                    Review school-wide learning metrics, moderate published curriculum, manage teacher/student accounts, and audit storage quotas.
                  </p>
                </div>
              </div>

              <div className="pt-6 flex items-center gap-2 text-amber-800 font-black text-sm group-hover:translate-x-1 transition">
                Open Admin Hub <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Built for Deaf & Hard-of-Hearing Success
            </h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Pedagogically proven bilingual-bicultural (Bi-Bi) learning features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Sign Video Player with Slow-Mo</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Instant 0.5x, 0.75x, and 1.0x playback speeds with A-B looping, designed for inspecting delicate finger movements and handshapes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Digital & Computer Literacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Hardware diagram matching, QWERTY fingerspell typing trainer, and video call sign etiquette tips for independent digital communication.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Gemini AI Visual Tutor</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                &quot;Signy&quot; transforms difficult terminology into visual analogies, sign guidelines, and fingerspelling sequences with zero audio dependency.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs font-bold text-slate-400">
        Deaf LMS — Built with Next.js, Supabase, Tailwind CSS & Google Gemini
      </footer>
    </div>
  );
}
