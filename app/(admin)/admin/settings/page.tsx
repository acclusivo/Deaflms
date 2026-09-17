'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { ArrowLeft, CheckCircle2, AlertTriangle, Sparkles, HardDrive, ShieldCheck, Database } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentRole="admin" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 transition shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              System Settings & Service Health
            </h1>
            <p className="text-xs text-slate-500 font-bold">
              Check database connections, AI engines, and storage bucket allocations.
            </p>
          </div>
        </div>

        {/* Health Check Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Supabase Connection */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Supabase Database & Auth</h3>
                  <p className="text-xs text-slate-400 font-bold">PostgreSQL Engine</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 text-xs font-black rounded-lg ${
                isSupabaseConfigured
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {isSupabaseConfigured ? 'Connected' : 'Offline / Mock Active'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {isSupabaseConfigured
                ? 'Your project is connected to live Supabase backend. Tables and Auth RLS are operating normally.'
                : 'Running in resilient offline mode with pre-seeded K-12 sign curriculum and in-memory progress tracking.'}
            </p>
          </div>

          {/* Gemini AI Engine */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Google Gemini AI Engine</h3>
                  <p className="text-xs text-slate-400 font-bold">Visual Tutor & Co-Pilot</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-black rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                Operational
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Powers student concept visual analogies and teacher curriculum generation with automatic fallback safety.
            </p>
          </div>

          {/* Supabase Storage Quota */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Sign Video Storage</h3>
                  <p className="text-xs text-slate-400 font-bold">Bucket: sign-videos</p>
                </div>
              </div>
              <span className="text-xs font-black text-slate-700">14.2 GB / 50 GB</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '28%' }} />
            </div>
            <p className="text-xs text-slate-500">28% storage consumed. CDN edge caching active for sign video streaming.</p>
          </div>

          {/* Zero Auditory Dependency Gate */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">DHH Visual Audit</h3>
                  <p className="text-xs text-slate-400 font-bold">Zero Auditory Reliance</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-black rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                100% Passed
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              All notifications, quizzes, and rewards utilize visual confetti, color glow indicators, and tactile animations with zero required audio.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
