'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { KeyboardTrainer } from '@/components/student/KeyboardTrainer';
import { Keyboard, ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Laptop } from 'lucide-react';

export default function KeyboardTrainerPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-700 selection:text-white">
      <Navbar currentRole="student" />

      {/* Top Breadcrumb & Quick Action Bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-teal-700 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/demo" className="hover:text-teal-700 transition">
              Demo
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Colourful Hand Keyboard Trainer</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/demo"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 interactive-target"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Demo</span>
            </Link>
            <Link
              href="/facilitator-results"
              className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs transition border border-teal-200 interactive-target"
            >
              Facilitator Results
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Page Hero Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-teal-200 inline-flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5" />
                Touch Typing & Fingerspelling Innovation
              </span>
              <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black uppercase tracking-wider">
                Home Row Progression: ASDF → JKL; → GH
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Colourful Hand Virtual Keyboard Trainer
            </h1>

            <p className="text-teal-100 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              Designed specifically for Deaf students to connect fingerspelling handshapes with tactile QWERTY typing. 
              Follow the color-coded fingers attached to the keyboard to master home row finger placement without relying on auditory feedback.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-teal-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Left Hand (ASDF) & Right Hand (JKL;)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Center Reach Keys (G & H)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Physical & On-Screen Typing Supported
              </span>
            </div>
          </div>
        </div>

        {/* The Keyboard Trainer Component */}
        <KeyboardTrainer />

        {/* Pedagogical Feature Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
              🖐️
            </div>
            <h3 className="text-lg font-black text-slate-900">1. Attached Colourful Hands</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Each finger has a distinct, vibrant color matching its designated keycaps. As the learner types, the exact finger lights up and bounces to prompt correct placement.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-black">
              🔤
            </div>
            <h3 className="text-lg font-black text-slate-900">2. Progressive Skill Sequence</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Start with Left Hand anchors (ASDF), balance with Right Hand anchors (JKL;), master Center Reaches (GH), and advance into approved computer literacy vocabulary.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
              📸
            </div>
            <h3 className="text-lg font-black text-slate-900">3. AnySign ASL & Custom Photos</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Authentic high-contrast fingerspelling photographs show the exact handshape for every key. Teachers can also upload custom Nigerian Sign Language (NSL) hand photographs.
            </p>
          </div>
        </div>
      </main>

      {/* Mandatory Legal & Corporate Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 px-4 sm:px-6 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-700">
          DeafLMS is a product of Acclusivo, owned by Tech Inclusion Enterprise Ltd, Abuja, Nigeria.
        </p>
        <p>© 2026 Tech Inclusion Enterprise Ltd. All rights reserved.</p>
        <div className="flex justify-center gap-4 text-[11px] pt-1 text-slate-400">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <span>•</span>
          <Link href="/accessibility" className="hover:underline">Accessibility Statement</Link>
        </div>
      </footer>
    </div>
  );
}
