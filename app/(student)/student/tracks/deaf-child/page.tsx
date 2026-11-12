'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Laptop,
  Keyboard,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  Play,
  FileDown,
  CheckCircle2,
  HelpCircle,
  Camera,
  Heart,
  Star,
} from 'lucide-react';
import { openClarifyModal } from '@/components/student/SignyAITutorModal';

export default function DeafChildTrackPage() {
  const { user } = useAuth();

  return (
    <div className="w-full">
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Track Hero Banner */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-teal-100">
                Track 1 • Ages 6–12
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-400 text-slate-950 rounded-full text-[10px] font-black uppercase">
                100% Free Basic 1
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Foundational Literacy &amp; Computer Skills
            </h1>
            <p className="text-teal-100 text-sm sm:text-base font-medium leading-relaxed">
              Designed for foundational learners (Ages 6–12). Learn through real pictures, accredited Nigerian Sign Language videos, touch-typing games, and dual-pane storybooks.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/student/lessons/lesson-hardware-1"
                className="px-6 py-3.5 rounded-2xl bg-white text-teal-900 font-black text-xs hover:bg-teal-50 transition shadow-md flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Lesson 1: Hardware Basics</span>
              </Link>
              <Link
                href="/keyboard-trainer"
                className="px-6 py-3.5 rounded-2xl bg-teal-900/60 hover:bg-teal-900 text-white font-black text-xs border border-teal-500/40 transition flex items-center gap-2"
              >
                <Keyboard className="w-4 h-4" />
                <span>AnySign Keyboard Trainer</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Interactive Child Learning Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Hardware Explorer */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center font-black border border-teal-200">
                <Laptop className="w-6 h-6 text-teal-700" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-teal-700 tracking-wider">Module 1</span>
                <h3 className="text-lg font-black text-slate-900">Computer Hardware</h3>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Click hotspots to see monitor, keyboard, mouse, and webcam with verified NSL sign demonstrations.
              </p>
            </div>
            <Link
              href="/student/digital-literacy"
              className="py-3 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs transition border border-teal-200 text-center interactive-target flex items-center justify-center gap-1.5"
            >
              <span>Explore Hardware Game →</span>
            </Link>
          </div>

          {/* 2. AnySign Keyboard Trainer */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-black border border-slate-200">
                <Keyboard className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Module 2</span>
                <h3 className="text-lg font-black text-slate-900">Fingerspell Typing</h3>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                AnySign keyboard maps visual fingerspelling handshapes to physical QWERTY keys with real-time feedback.
              </p>
            </div>
            <Link
              href="/keyboard-trainer"
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition text-center interactive-target flex items-center justify-center gap-1.5"
            >
              <span>Open Typing Trainer →</span>
            </Link>
          </div>

          {/* 3. Dual-Pane Illustrated Storybook */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-black border border-amber-200">
                <BookOpen className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">Module 3</span>
                <h3 className="text-lg font-black text-slate-900">Visual Storybooks</h3>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Dual-pane storybook: Read illustrations side-by-side with synchronized Nigerian Sign Language video narrator.
              </p>
            </div>
            <Link
              href="/student/storybook/storybook-clever-fox"
              className="py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs transition border border-amber-200 text-center interactive-target flex items-center justify-center gap-1.5"
            >
              <span>Read "The Clever Fox" →</span>
            </Link>
          </div>

          {/* 4. Safe AI Clarification */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center font-black border border-teal-200">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-teal-700 tracking-wider">Support</span>
                <h3 className="text-lg font-black text-slate-900">Sign Clarification</h3>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Look up any unknown word in our safe, approved Nigerian Sign Language visual vocabulary dictionary.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openClarifyModal()}
              className="py-3 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs transition border border-teal-200 text-center interactive-target flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>Clarify a Word →</span>
            </button>
          </div>
        </div>

        {/* 5-Step Visual Literacy Architecture Card */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black uppercase text-teal-700 tracking-wider">Pedagogical Framework</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                The 5-Step Visual Literacy Model
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                100% auditory-free sequence developed with Nigerian Deaf educators.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { num: '1', title: 'SEE', desc: 'Real photo context before text', icon: '📷' },
              { num: '2', title: 'WATCH SIGN', desc: 'Native NSL sign video', icon: '👋' },
              { num: '3', title: 'UNDERSTAND', desc: 'Plain English & visual meaning', icon: '💡' },
              { num: '4', title: 'SHOW ME', desc: '3-frame visual sequential story', icon: '🖼️' },
              { num: '5', title: 'PRACTICE', desc: 'Choice check with stars', icon: '⭐' },
            ].map((step) => (
              <div key={step.num} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-center">
                <div className="text-2xl">{step.icon}</div>
                <div className="text-xs font-black text-teal-800 uppercase tracking-wider">Step {step.num}: {step.title}</div>
                <p className="text-[11px] text-slate-600 font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Printable Offline Worksheets Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase">
                Offline Resilience
              </span>
              <span className="text-xs text-slate-400 font-bold">Printable PDF Resources</span>
            </div>
            <h3 className="text-xl font-black text-white">Download Offline Fingerspelling &amp; Word Matching Sheets</h3>
            <p className="text-xs text-slate-300 font-medium">
              Continue learning at home or in schools even when internet connectivity is intermittent.
            </p>
          </div>

          <Link
            href="/student/worksheets/worksheet-basic-1"
            className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shrink-0"
          >
            <FileDown className="w-4 h-4" />
            <span>Download Worksheets (PDF)</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
