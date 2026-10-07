'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

interface TestingLog {
  participantCode: string;
  ageRange: string;
  task: string;
  expectedBehaviour: string;
  observedBehaviour: string;
  difficulty: string;
  changeMade: string;
  retestResult: string;
  remainingQuestion: string;
}

const REAL_TESTING_EVIDENCE: TestingLog[] = [
  {
    participantCode: 'DL-01',
    ageRange: '16 years (Adolescent)',
    task: 'Connect computer hardware signs to physical pictures and type spelling on laptop',
    expectedBehaviour: 'Watch sign video, select webcam picture, and type W-E-B-C-A-M on physical keyboard.',
    observedBehaviour:
      'Learner enjoyed using laptop keyboard and readily identified computer icons. When asked to write the word in an exercise book, showed resistance. Recognized the webcam picture immediately but hesitated when connecting written letters outside digital context. Confused when explanations used difficult vocabulary.',
    difficulty:
      'Gap between picture recognition, written spelling, and simple meaning. Vocabulary explanations containing advanced English words caused hesitation.',
    changeMade:
      'Revised learning flow into five explicit discrete steps (sign -> picture -> word -> simple meaning -> spelling practice). Simplified definition to short sentences and familiar words. Added visual QWERTY keyboard trainer.',
    retestResult: 'Awaiting retest.',
    remainingQuestion:
      'Does tactile physical typing transfer to better retention when reading outside the computer interface?',
  },
  {
    participantCode: 'DL-02',
    ageRange: '10 years (Primary 4)',
    task: 'Retain vocabulary signs and match to simple concepts across multiple days',
    expectedBehaviour: 'Remember sign-meaning pairs across consecutive study sessions.',
    observedBehaviour:
      'Learner experienced literacy and memory challenges between sessions. Needed visual reminders connecting sign to picture before recalling word meaning.',
    difficulty:
      'Visual working memory retention and connecting abstract written words to physical concepts.',
    changeMade:
      'Added immediate rule-based recommendations: repeating sign-to-picture when picture match fails, and repeating simple meaning when check question fails. Removed cognitive scoring.',
    retestResult: 'Awaiting retest.',
    remainingQuestion:
      'What optimal spacing of visual micro-practice prevents cognitive fatigue for younger primary school learners?',
  },
];

export default function UserTestingPage() {
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
                Deaf<span className="text-teal-700">LMS</span> Testing Evidence
              </span>
              <span className="text-[10px] text-slate-500 font-bold block">
                Observed User Discovery Logs • Safeguarded &amp; Uninvented
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/demo"
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition flex items-center gap-1.5 shadow-sm interactive-target"
            >
              <span>Test MVP Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
            <span>Honest Evidence Record • Child Identity Protected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            User Testing Evidence &amp; Discovery Observations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-3xl leading-relaxed">
            In accordance with ACE Pitch Competition standards, this record contains actual observations from early testing sessions with Deaf learners. We do not invent positive results or claim widespread validation.
          </p>
        </div>

        {/* Observation Disclaimers */}
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-black uppercase tracking-wider text-amber-900 block">
              Discovery Evidence Notice:
            </span>
            <p className="leading-relaxed font-semibold">
              The observations below represent qualitative discovery evidence from observed sessions with two Deaf learners. They do not claim that DeafLMS is proven effective for all Deaf learners. Retest results are pending structured pilot deployments.
            </p>
          </div>
        </div>

        {/* Evidence Cards */}
        <div className="space-y-6">
          {REAL_TESTING_EVIDENCE.map((log) => (
            <div
              key={log.participantCode}
              className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden p-6 sm:p-7 space-y-5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-black text-sm">
                    {log.participantCode}
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">
                      Participant {log.participantCode}
                    </h2>
                    <span className="text-xs font-bold text-slate-500">
                      Age Range: {log.ageRange}
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-black self-start sm:self-auto border border-amber-200">
                  Status: {log.retestResult}
                </span>
              </div>

              {/* Grid of Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-black uppercase tracking-wider text-slate-500 block">
                    Task Given:
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">{log.task}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-black uppercase tracking-wider text-slate-500 block">
                    Expected Behaviour:
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">{log.expectedBehaviour}</p>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1 md:col-span-2">
                  <span className="font-black uppercase tracking-wider text-amber-900 block">
                    Observed Behaviour:
                  </span>
                  <p className="text-slate-900 font-medium leading-relaxed">{log.observedBehaviour}</p>
                </div>

                <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-1">
                  <span className="font-black uppercase tracking-wider text-rose-900 block">
                    Identified Difficulty / Gap:
                  </span>
                  <p className="text-slate-900 font-medium leading-relaxed">{log.difficulty}</p>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1">
                  <span className="font-black uppercase tracking-wider text-emerald-900 block">
                    Product Change Made:
                  </span>
                  <p className="text-slate-900 font-medium leading-relaxed">{log.changeMade}</p>
                </div>

                <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 space-y-1 md:col-span-2">
                  <span className="font-black uppercase tracking-wider text-slate-600 block">
                    Remaining Unanswered Question:
                  </span>
                  <p className="text-slate-800 font-medium italic leading-relaxed">
                    &ldquo;{log.remainingQuestion}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ))}
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
