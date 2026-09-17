import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ShieldCheck, Scale, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Deaf LMS',
  description: 'Fair, transparent, and child-safe terms of service for Deaf LMS users and institutions.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <span className="text-xs font-bold text-slate-400">Effective Date: September 2026</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-black uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-indigo-600" />
            <span>Fair &amp; Transparent Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Deaf LMS Terms of Service
          </h1>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            Welcome to Deaf LMS. These terms outline our mutual commitments to fair, safe, and accessible learning for students, parents, and schools.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">1. Guardian &amp; Student Accounts</h2>
            <p>
              Deaf LMS serves K-12 students, hearing family members, and certified educators. Accounts for children under 13 must be created with the consent of a parent, legal guardian, or authorized school facilitator.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">2. Free Access Guarantee &amp; Subscription Terms</h2>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                No Disguised Trials or Hidden Renewals
              </div>
              <p>
                Our <strong>Free Basic 1</strong> tier is permanently free. We do not require a credit card for free signup and will never convert a free account into a paid trial without explicit affirmative consent.
              </p>
              <p>
                Paid Supporter and School subscriptions can be canceled at any time from your account settings. Upon cancellation, you retain full access through the end of the paid billing period, after which your account safely returns to Free Basic 1 with your learning history intact.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">3. Cultural Integrity of Sign Language Content</h2>
            <p>
              All sign language videos, handshape illustrations, and curriculum assets are developed in collaboration with native Deaf educators and respected sign language linguistics bodies (including the Nigerian Educational Research and Development Council - NERDC). Users may not re-upload, commercialize, or distort approved sign language assets.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">4. Responsible AI Tutor Usage</h2>
            <p>
              Our Gemini AI Tutor (&quot;Signy&quot;) is designed as a supplementary comprehension aid to provide visual analogies and fingerspelling sequences. It does not replace certified human deaf educators or formal speech-and-language pathology services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">5. Contact &amp; Legal Support</h2>
            <p className="text-xs text-slate-600">
              Questions regarding these terms may be sent to <a href="mailto:legal@deaflms.org" className="text-indigo-600 font-bold hover:underline">legal@deaflms.org</a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs font-bold text-slate-400">
        Deaf LMS — Transparent K-12 Educational Terms
      </footer>
    </div>
  );
}
