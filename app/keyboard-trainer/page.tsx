'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { KeyboardTrainer } from '@/components/student/KeyboardTrainer';
import { Keyboard, ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Laptop } from 'lucide-react';

export default function KeyboardTrainerPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FC] flex flex-col text-[#1F2937] selection:bg-[#1B4EA7] selection:text-white">
      <Navbar />

      {/* Top Breadcrumb & Quick Action Bar */}
      <div className="bg-white border-b border-[#E5EAF3] py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-[#1B4EA7] transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/demo" className="hover:text-[#1B4EA7] transition">
              Demo
            </Link>
            <span>/</span>
            <span className="text-[#1F2937] font-bold">Colourful Hand Keyboard Trainer</span>
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
              className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-[#F0F4FA] hover:bg-[#E5EAF3] text-[#1B4EA7] font-bold text-xs transition border border-[#ABB8D7]/40 interactive-target"
            >
              Facilitator Results
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Page Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#E5EAF3] shadow-xs space-y-4">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#087F8C] bg-[#E6F4F6] px-3 py-1 rounded-md border border-[#087F8C]/30 inline-block">
              Fingerspelling &amp; QWERTY Practice
            </span>

            <h1 className="text-2xl sm:text-4xl font-black text-[#00177D] tracking-tight leading-tight">
              Colourful Hand Keyboard Trainer
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              Connect fingerspelling handshapes to tactile keyboard typing. Follow the color-coded fingers to learn home row key positions visually.
            </p>
          </div>
        </div>

        {/* The Keyboard Trainer Component */}
        <KeyboardTrainer />

        {/* Pedagogical Feature Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white rounded-3xl p-6 border-2 border-[#E5EAF3] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6F4F6] text-[#087F8C] flex items-center justify-center font-black">
              1
            </div>
            <h3 className="text-lg font-black text-[#1F2937]">Color-Coded Finger Guidance</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Each finger matches its assigned home row keys, giving instant visual confirmation of finger placement.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-[#E5EAF3] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-black">
              2
            </div>
            <h3 className="text-lg font-black text-[#1F2937]">Step-by-Step Practice</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Start with left hand anchors (ASDF), then right hand (JKL;), and advance into approved computer vocabulary.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-[#E5EAF3] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-black">
              3
            </div>
            <h3 className="text-lg font-black text-[#1F2937]">Real Handshape Photos</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Clear fingerspelling photographs show the exact handshape for every key without relying on sound.
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
