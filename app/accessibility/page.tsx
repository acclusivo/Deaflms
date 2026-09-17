import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, VolumeX, HandMetal, CheckCircle2, ShieldCheck, HeartHandshake, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Accessibility Statement | Deaf LMS',
  description: 'Our commitment to zero-auditory reliance and WCAG 2.2 AA visual accessibility.',
};

export default function AccessibilityStatementPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <span className="text-xs font-bold text-slate-400">Target Standard: WCAG 2.2 AA</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <VolumeX className="w-3.5 h-3.5 text-rose-500" />
            <span>Zero Auditory Reliance Standard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Deaf LMS Accessibility Statement
          </h1>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            Deaf LMS is purpose-engineered for deaf and hard-of-hearing learners, families, and teachers. We design every interface to be 100% operational through vision, touch, and assistive technology—never sound.
          </p>
        </div>

        {/* Commitment Card */}
        <div className="p-5 rounded-3xl bg-white border-2 border-emerald-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Our Accessibility Standards &amp; Targets</h2>
              <p className="text-xs text-slate-500 font-medium">Targeting Web Content Accessibility Guidelines (WCAG) 2.2 Level AA</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            While formal third-party certification is ongoing as new curriculum modules are authored, we hold our platform to the rigorous engineering benchmarks detailed below.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
              <VolumeX className="w-4 h-4 text-rose-500" />
              Zero Auditory Dependency
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              No instructions, quizzes, errors, or feedback rely on audio cues, beeps, or voice. All statuses have high-contrast visual badges, text labels, and animated icons.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
              <HandMetal className="w-4 h-4 text-indigo-600" />
              Preserved Signing Space in Video
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              All sign videos maintain approved proportions from navel to top of head and shoulder-to-shoulder. We never crop footage where hands or facial markers would be obscured.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
              <Eye className="w-4 h-4 text-amber-600" />
              Playback Speed Controls (0.5x, 0.75x, 1x)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Learners and parents can slow down complex sign videos to 0.5x or 0.75x to study finger shapes and hand orientations in detail without pitch distortion.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Keyboard &amp; Focus Visibility
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Every interactive button, card, and quiz option is reachable via Tab and Enter/Space with high-contrast 2px focus indicators (`outline-offset: 2px`).
            </p>
          </div>
        </div>

        {/* Zoom & Motion Support */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-black text-slate-900">Text Scaling (200% Zoom) &amp; Motion Sensitivity</h2>
          <p>
            Layouts use flexible container sizing and relative units (rem/em) to ensure pages remain readable and functional at 200% browser zoom without clipped translated text or horizontal overflow.
          </p>
          <p>
            We respect the <code>prefers-reduced-motion</code> system preference by dampening decorative transitions and removing flashing rewards to support learners with vestibular disorders or attention sensitivities.
          </p>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-indigo-600" />
              Accessibility Feedback &amp; Assistance
            </h3>
            <p className="text-xs text-slate-600">
              If you encounter any barrier, unreadable sign video, or keyboard navigation conflict, please notify our accessibility working group:
            </p>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
              Email: <a href="mailto:accessibility@deaflms.org" className="text-indigo-600 hover:underline">accessibility@deaflms.org</a>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs font-bold text-slate-400">
        Deaf LMS — Dedicated to Inclusive Visual Education
      </footer>
    </div>
  );
}
