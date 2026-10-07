'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

interface LearnerResultRow {
  word: string;
  signToPicture: 'Correct' | 'Needs help' | 'Not attempted';
  spelling: 'Correct' | 'Needs help' | 'Not attempted';
  meaning: 'Correct' | 'Needs help' | 'Not attempted';
  recommendation: string;
}

const SAMPLE_FACILITATOR_DATA: LearnerResultRow[] = [
  {
    word: 'Webcam',
    signToPicture: 'Correct',
    spelling: 'Needs help',
    meaning: 'Needs help',
    recommendation: 'Repeat meaning activity',
  },
  {
    word: 'Keyboard',
    signToPicture: 'Correct',
    spelling: 'Correct',
    meaning: 'Correct',
    recommendation: 'Continue',
  },
  {
    word: 'Mouse',
    signToPicture: 'Needs help',
    spelling: 'Not attempted',
    meaning: 'Not attempted',
    recommendation: 'Replay sign',
  },
  {
    word: 'Monitor',
    signToPicture: 'Correct',
    spelling: 'Correct',
    meaning: 'Needs help',
    recommendation: 'Review simple meaning',
  },
];

export default function FacilitatorResultsPage() {
  const getBadge = (status: 'Correct' | 'Needs help' | 'Not attempted') => {
    switch (status) {
      case 'Correct':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Correct
          </span>
        );
      case 'Needs help':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Needs help
          </span>
        );
      case 'Not attempted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 text-xs font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            Not attempted
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-700 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition interactive-target"
              aria-label="Back to Homepage"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900">
                Deaf<span className="text-teal-700">LMS</span> Facilitator Studio
              </span>
              <span className="text-[10px] text-slate-500 font-bold block">
                Sample Learning Activity &amp; Diagnostic Overview
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/demo"
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition flex items-center gap-1.5 shadow-sm interactive-target"
            >
              <span>Try 90s Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Title & Sample Notice */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Sample Demonstration Data</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Facilitator Learning Diagnostic Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-3xl">
            This view allows educators and facilitators to pinpoint exactly where a learner is struggling across the 5 learning stages (sign, picture, written word, spelling, and simple meaning).
          </p>
        </div>

        {/* Demo Learner Profile Card */}
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-black text-lg">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">Amina — Demo Learner</h2>
                <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-black uppercase border border-teal-200">
                  Sample Account
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Participant Code: DL-01 • Age Group: 16 years • Hardware Exploration Unit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span>Vocabulary Completed: 2 / 4 words</span>
          </div>
        </div>

        {/* Required Mandatory Section 18 Table */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Detailed Learning Diagnostic Breakdown
            </h3>
            <span className="text-[11px] text-slate-500 font-bold">
              Unit: 4 Foundational Computer Words
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-black text-[11px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Word</th>
                  <th className="py-3.5 px-4 sm:px-6">Sign-to-picture</th>
                  <th className="py-3.5 px-4 sm:px-6">Spelling</th>
                  <th className="py-3.5 px-4 sm:px-6">Meaning</th>
                  <th className="py-3.5 px-4 sm:px-6">Recommended next step</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold">
                {SAMPLE_FACILITATOR_DATA.map((row) => (
                  <tr key={row.word} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 sm:px-6 text-slate-900 font-black">
                      {row.word}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      {getBadge(row.signToPicture)}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      {getBadge(row.spelling)}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      {getBadge(row.meaning)}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className="text-teal-900 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200 text-xs font-black inline-block">
                        {row.recommendation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Required Mandatory Medical & Cognitive Disclaimer Note */}
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-xs font-black uppercase tracking-wider text-amber-900">
              Important Educational Notice:
            </div>
            <p className="text-xs font-semibold leading-relaxed">
              This dashboard shows learning activity, not a medical or cognitive diagnosis.
            </p>
          </div>
        </div>

        {/* Facilitator Action Guidance & Links */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-sm font-black text-slate-900 block">
              Want to see real learner discovery evidence?
            </span>
            <p className="text-xs text-slate-500 font-medium">
              Inspect observed testing logs from Deaf learner sessions without invented results.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/user-testing"
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition interactive-target"
            >
              View User Testing Evidence →
            </Link>
            <Link
              href="/demo"
              className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition shadow-sm interactive-target"
            >
              Test Demo as Learner →
            </Link>
          </div>
        </div>
      </main>

      {/* Corporate Legal Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs font-medium text-slate-500 space-y-2 mt-auto">
        <p className="text-slate-600 font-semibold">
          DeafLMS is a product of Acclusivo, owned by Tech Inclusion Enterprise Ltd, Abuja, Nigeria.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
          <span>&copy; 2026 Tech Inclusion Enterprise Ltd. All rights reserved.</span>
          <span>•</span>
          <Link href="/privacy" className="hover:text-teal-700 transition">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-teal-700 transition">Terms of Service</Link>
          <span>•</span>
          <Link href="/accessibility" className="hover:text-teal-700 transition">Accessibility</Link>
          <span>•</span>
          <Link href="/support" className="hover:text-teal-700 transition">Support</Link>
        </div>
      </footer>
    </div>
  );
}
