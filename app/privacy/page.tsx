import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, Eye, HeartHandshake, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Deaf LMS',
  description: 'Child-safe, visual-first privacy standards for deaf learners and families.',
};

export default function PrivacyPolicyPage() {
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
        {/* Header Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Child-Safe &amp; DHH Family Protected</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Deaf LMS Privacy Policy
          </h1>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            We believe accessible education requires unconditional privacy. This policy explains how Deaf LMS protects deaf learners, hearing parents, and educators under COPPA, NDPR, and international child data protection standards.
          </p>
        </div>

        {/* Highlight Banner: Zero Medical Collection */}
        <div className="p-5 rounded-3xl bg-indigo-50 border-2 border-indigo-200 text-indigo-950 flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-black text-indigo-900">Zero Collection of Medical or Audiological Records</h2>
            <p className="text-xs text-indigo-800 font-medium leading-relaxed">
              We never request, collect, or store audiological decibel tests, medical diagnoses, hearing aid/cochlear implant status, or clinical records during registration or curriculum learning. Your child’s medical privacy is absolute.
            </p>
          </div>
        </div>

        {/* Section Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">1</span>
              Information We Collect &amp; Why
            </h2>
            <p>We practice strict data minimization and collect only what is necessary to personalize visual sign learning:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm font-medium text-slate-600">
              <li><strong>Account Credentials:</strong> Display name and email address for login verification and password recovery.</li>
              <li><strong>Parent/Guardian Verification:</strong> For learners under 13, registration is owned and verified by a parent, legal guardian, or certified school facilitator.</li>
              <li><strong>Learning Preferences:</strong> Selected sign language dialect (e.g. Nigerian Sign Language) and daily pace goal.</li>
              <li><strong>Curriculum Progress:</strong> Completed lesson markers, worksheet star scores, and touch-typing accuracy to resume learning safely.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">2</span>
              Webcam &amp; Video Privacy
            </h2>
            <p>
              Our interactive typing games and computer literacy lessons teach video call etiquette and camera positioning for clear signing space.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Local Browser Execution Only
              </div>
              <p>
                Any webcam preview used during student signing practice runs locally within the student&apos;s browser memory. Raw camera video is never transmitted to our servers or saved to databases.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">3</span>
              Zero Advertising &amp; Commercial Data Sales
            </h2>
            <p>
              Deaf LMS is an ad-free educational platform. We do not sell, rent, or monetize student or family profile information to third-party data brokers, ad networks, or behavioral targeting platforms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">4</span>
              Data Retention &amp; Right to Erasure
            </h2>
            <p>
              Parents, guardians, and educators can inspect, export, or permanently delete student account data at any time by contacting our privacy coordinator or via the account settings panel. All records are purged within 30 business days upon request.
            </p>
          </section>

          <section className="space-y-3 pt-2 border-t border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-indigo-600" />
              Contact Our Accessibility &amp; Privacy Officer
            </h2>
            <p className="text-xs text-slate-600">
              If you have questions regarding student privacy, school institutional data agreements, or accessibility compliance:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 space-y-1">
              <div>Email: <a href="mailto:privacy@deaflms.org" className="text-indigo-600 hover:underline">privacy@deaflms.org</a></div>
              <div>Deaf LMS Education Foundation • Lagos, Nigeria &amp; Global DHH Initiative</div>
            </div>
          </section>

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs font-bold text-slate-400">
        Deaf LMS — Child-Safe Visual Sign Platform
      </footer>
    </div>
  );
}
