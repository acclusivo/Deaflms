'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SignMimicryTrainer } from '@/components/student/SignMimicryTrainer';
import {
  Users,
  Video,
  Heart,
  Eye,
  CheckCircle2,
  Sparkles,
  Zap,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Clock,
  Home,
  GraduationCap,
  Stethoscope,
  Briefcase,
} from 'lucide-react';

export default function HearingAlliesTrackPage() {
  const { user } = useAuth();
  const isEnrolled = user?.enrolledCourseIds?.includes('course-hearing-nsl-1');

  return (
    <div className="w-full">
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Track Hero Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-indigo-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-teal-800">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
                Track 3 • Conversational Sign (All Ages)
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-400 text-slate-950 rounded-full text-[10px] font-black uppercase">
                Conversational Track
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Conversational Nigerian Sign Language Practice
            </h1>
            <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
              Build fluent visual communication skills for home, school, and professional interactions. Practice natural signing through video mimicry, slow-motion review, and real-world dialogue scenarios.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/checkout?course=course-hearing-nsl-1"
                className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition shadow-md flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{isEnrolled ? 'Conversational Track Enrolment Active' : 'Enroll for ₦4,000 (Instant Access)'}</span>
              </Link>
              <a
                href="#mirror-trainer"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs border border-white/20 transition flex items-center gap-2"
              >
                <Video className="w-4 h-4 text-amber-300" />
                <span>Open Sign Mimicry Trainer</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Everyday Dialogue Scenario Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase text-teal-700 tracking-wider">Everyday Scenarios</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Contextual Communication Modules
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">4 Dialogue Tracks</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-black border border-teal-200">
                <Home className="w-5 h-5 text-teal-700" />
              </div>
              <h3 className="text-base font-black text-slate-900">At the Dinner Table</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Food signs, passing items, "How was your day?", feelings, and bedtime routines with your Deaf child.
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-black border border-slate-200">
                <GraduationCap className="w-5 h-5 text-slate-700" />
              </div>
              <h3 className="text-base font-black text-slate-900">Classroom &amp; School</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                For teachers and classmates: Asking questions, homework instructions, break times, and encouragement signs.
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-black border border-amber-200">
                <Stethoscope className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="text-base font-black text-slate-900">Clinic &amp; Healthcare</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Medical terminology: "Where does it hurt?", pain scale, medicine dosage, and emergency visual signs.
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black border border-emerald-200">
                <Briefcase className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="text-base font-black text-slate-900">Workplace Collaboration</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Professional etiquette: Meetings, project deadlines, brainstorming, and inclusive team discussions.
              </p>
            </div>
          </div>
        </div>

        {/* EMBEDDED SIGN MIMICRY & MIRROR COMPONENT */}
        <section id="mirror-trainer" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-black uppercase text-teal-700 tracking-wider">Interactive Practice</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Sign Mimicry &amp; Webcam Mirror
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              0.5x Slow-Motion Controls &amp; Self-Check
            </span>
          </div>

          <SignMimicryTrainer />
        </section>

        {/* Deaf Culture & Communication Rules */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black uppercase text-teal-700 tracking-wider">Ally Guide</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Core Rules of Deaf Visual Culture
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Respectful behaviors that make communication natural and comfortable.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-teal-700" />
                <h4 className="font-black text-sm text-slate-900">1. Eye Contact is Attention</h4>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Looking away while a Deaf person is signing is equivalent to walking away while someone is speaking to you. Keep your gaze on their face and hands.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-700" />
                <h4 className="font-black text-sm text-slate-900">2. How to Gain Attention</h4>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Gently tap on the shoulder once or twice, wave your hand in their peripheral vision, or tap the table. Never shout, stomp aggressively, or throw objects.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <h4 className="font-black text-sm text-slate-900">3. Clear Sightlines</h4>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Never stand directly between two people who are signing. If you must pass through, walk briskly without ducking or stopping to apologize.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-teal-700" />
                <h4 className="font-black text-sm text-slate-900">4. Facial Expression is Grammar</h4>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                In NSL, raised eyebrows indicate a Yes/No question, while furrowed eyebrows indicate a What/Where/Who question. Facial expressions convey tone and intensity!
              </p>
            </div>
          </div>
        </section>

        {/* Enrolment / Checkout Banner using Phase 2 Engine */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-900 to-indigo-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <span className="px-2.5 py-0.5 rounded bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
              Ally Certificate Program
            </span>
            <h3 className="text-2xl font-black text-white">Conversational NSL Track: ₦4,000</h3>
            <p className="text-xs sm:text-sm text-teal-100 font-medium leading-relaxed">
              Complete all 4 scenario modules, earn the DeafLMS Certified Hearing Ally badge, and gain lifetime access to vocabulary updates.
            </p>
          </div>

          <Link
            href="/checkout?course=course-hearing-nsl-1"
            className="py-4 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg transition shrink-0 flex items-center gap-2"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Pay via Selar or Bank Transfer →</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
