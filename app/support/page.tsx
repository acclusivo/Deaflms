import React from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Laptop, BookOpen, HandMetal, Users, Mail, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Help & Support | Deaf LMS',
  description: 'Visual guides, FAQ, and technical support for deaf learners, parents, and facilitators.',
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <span className="text-xs font-bold text-slate-400">Deaf LMS Support Center</span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 space-y-10">
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-black uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Visual Support &amp; Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How Can We Help You Learn?
          </h1>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            Find visual step-by-step guides for students, hearing parents, and educators.
          </p>
        </div>

        {/* Quick Help Topics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
              <Laptop className="w-5 h-5" />
            </div>
            <h2 className="font-black text-slate-900 text-base">Fingerspelling Keyboard</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              How to use physical QWERTY keys with AnySign visual handshapes, type letter-by-letter, and earn stars.
            </p>
            <Link
              href="/student/digital-literacy"
              className="text-xs font-black text-indigo-600 hover:underline inline-block pt-1"
            >
              Open Keyboard Practice →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="font-black text-slate-900 text-base">Hearing Parents Guide</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Start with basic home signs (food, emotions, questions) and learn side-by-side with your deaf child.
            </p>
            <Link
              href="/onboarding"
              className="text-xs font-black text-emerald-600 hover:underline inline-block pt-1"
            >
              Start Family Setup →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="font-black text-slate-900 text-base">Dual-Pane Storybooks</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Tap any underlined English word to open its individual sign video demonstration in slow motion.
            </p>
            <Link
              href="/student/storybook/lesson-storybook-1"
              className="text-xs font-black text-amber-700 hover:underline inline-block pt-1"
            >
              Open Sample Storybook →
            </Link>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>

          <div className="divide-y divide-slate-100 space-y-4">
            <div className="pt-4 first:pt-0 space-y-1.5">
              <h3 className="text-sm font-black text-slate-900">Is the Free Basic 1 tier truly free forever?</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Yes! Free Basic 1 includes the complete 5 foundational lessons (Computer Hardware, Keyboard Typing, Web Navigation, Everyday Signs, and Storybook). We never require a credit card and never cancel free access.
              </p>
            </div>

            <div className="pt-4 space-y-1.5">
              <h3 className="text-sm font-black text-slate-900">Which sign language dialect should we start with?</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Our active priority track is <strong>Nigerian Sign Language (NSL)</strong>, which shares core cognates with American Sign Language (ASL) and is recognized across West African inclusive schools. Additional regional tracks are coming soon.
              </p>
            </div>

            <div className="pt-4 space-y-1.5">
              <h3 className="text-sm font-black text-slate-900">How do I slow down a sign video?</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Every video player features dedicated <strong>0.5x</strong> and <strong>0.75x</strong> playback speed buttons directly under the video frame.
              </p>
            </div>
          </div>
        </div>

        {/* Direct Help Desk */}
        <div className="p-6 rounded-3xl bg-indigo-50 border-2 border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-base font-black text-indigo-900">Still have a question or need school pilot support?</h2>
            <p className="text-xs text-indigo-700 font-medium">
              Our support team includes native deaf educators and technical specialists.
            </p>
          </div>
          <a
            href="mailto:support@deaflms.org"
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition shadow-md shrink-0 flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Email Support: support@deaflms.org
          </a>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs font-bold text-slate-400">
        Deaf LMS — Support Desk
      </footer>
    </div>
  );
}
