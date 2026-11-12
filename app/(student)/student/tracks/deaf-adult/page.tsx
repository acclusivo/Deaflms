'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { VisualCodeLab } from '@/components/student/VisualCodeLab';
import {
  Code,
  Terminal,
  Zap,
  CheckCircle2,
  BookOpen,
  Award,
  Video,
  ExternalLink,
  Laptop,
  Layers,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Play,
  Lock,
} from 'lucide-react';

export default function DeafAdultTrackPage() {
  const { user } = useAuth();
  const isEnrolled = user?.enrolledCourseIds?.includes('course-frontend-web-1');

  return (
    <div className="w-full">
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Track Hero Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
                Track 2 • Ages 18+
              </span>
              <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black uppercase">
                Career Track
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Frontend Web Development in Nigerian Sign Language
            </h1>
            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
              Master modern HTML5, CSS layout, and interactive JavaScript with certified NSL video instruction, live browser coding sandboxes, and portfolio project reviews.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/checkout?course=course-frontend-web-1"
                className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition shadow-md flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{isEnrolled ? 'Course Enrolment Active' : 'Enroll for ₦5,000 (Instant Access)'}</span>
              </Link>
              <a
                href="#code-lab"
                className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs border border-slate-700 transition flex items-center gap-2"
              >
                <Terminal className="w-4 h-4 text-teal-400" />
                <span>Jump to Interactive Code Lab</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Professional Career Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-black border border-teal-200">
              <Code className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="text-base font-black text-slate-900">HTML5 Semantic Structure</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Accessible document outlines, semantic tags, forms, and ARIA attributes taught natively in NSL.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-black border border-slate-200">
              <Layers className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="text-base font-black text-slate-900">CSS Layout &amp; Responsive Design</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Flexbox, CSS Grid, mobile-first responsive design, and WCAG high-contrast styling tokens.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-black border border-amber-200">
              <Terminal className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="text-base font-black text-slate-900">JavaScript &amp; DOM Events</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Modern ES6+, DOM manipulation, event listeners, API data fetching, and state management.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black border border-emerald-200">
              <Briefcase className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="text-base font-black text-slate-900">Portfolio &amp; Certification</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Build a real accessible portfolio project reviewed by accredited Deaf tech industry mentors.
            </p>
          </div>
        </div>

        {/* 7 FRONTEND LESSONS SYLLABUS: FREE LESSON 1 + PAID UPGRADE FOR 2-7 */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                  Freemium Curriculum
                </span>
                <span className="text-xs font-bold text-slate-500">7 NSL Video Lessons + Live Demonstration</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Course Syllabus &amp; Visual Video Lessons
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Lesson 1 is 100% free for everyone. Upgrade to the full track (₦5,000) to proceed to Lesson 2 and beyond.
              </p>
            </div>

            <Link
              href={isEnrolled ? '/student/lessons/lesson-frontend-1' : '/checkout?course=course-frontend-web-1'}
              className="py-3 px-5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>{isEnrolled ? 'All 7 Lessons Unlocked' : 'Unlock All 7 Lessons (₦5,000)'}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              {
                id: 'lesson-frontend-1',
                order: 1,
                title: 'Lesson 1: Introduction to HTML & Web Fundamentals in NSL',
                desc: 'Discover what HTML is, how web browsers render pages, and the role of Deaf engineers in tech with live demonstration.',
                isFree: true,
                badge: '100% Free Lesson',
              },
              {
                id: 'lesson-frontend-2',
                order: 2,
                title: 'Lesson 2: Setting up VS Code for Deaf Developers',
                desc: 'Step-by-step setup of Visual Studio Code: extensions, live server preview, high-contrast themes, and shortcuts in NSL.',
                isFree: false,
                badge: 'Requires Upgrade',
              },
              {
                id: 'lesson-frontend-3',
                order: 3,
                title: 'Lesson 3: Your First HTML Page & Boilerplate Structure',
                desc: 'Construct your first index.html document. Understand <!DOCTYPE html>, <html>, <head>, and <body> tag architecture in sign analogies.',
                isFree: false,
                badge: 'Requires Upgrade',
              },
              {
                id: 'lesson-frontend-4',
                order: 4,
                title: 'Lesson 4: HTML Headings (h1 to h6) & Document Hierarchy',
                desc: 'Master heading ranks from <h1> to <h6>, visual prominence, and accessible document outline standards in NSL.',
                isFree: false,
                badge: 'Requires Upgrade',
              },
              {
                id: 'lesson-frontend-5',
                order: 5,
                title: 'Lesson 5: HTML Paragraphs & Text Formatting in NSL',
                desc: 'Structure paragraphs with <p>, emphasize text with <strong> and <em>, and format line breaks with live code validation.',
                isFree: false,
                badge: 'Requires Upgrade',
              },
              {
                id: 'lesson-frontend-6',
                order: 6,
                title: 'Lesson 6: HTML Links & Interactive Web Navigation',
                desc: 'Create hyperlinks using the anchor <a> tag, configure href destinations, external tab targets, and accessible click etiquette.',
                isFree: false,
                badge: 'Requires Upgrade',
              },
              {
                id: 'lesson-frontend-7',
                order: 7,
                title: 'Lesson 7: Adding Images & Accessible Alt Attributes in NSL',
                desc: 'Embed images using <img>, set width/height attributes, and craft descriptive alt text for WCAG 2.2 accessibility.',
                isFree: false,
                badge: 'Requires Upgrade',
              },
            ].map((item) => {
              const canAccess = item.isFree || isEnrolled;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    canAccess
                      ? 'bg-white border-slate-200 hover:border-teal-500 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 opacity-90'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border ${
                        canAccess
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : 'bg-slate-200 text-slate-500 border-slate-300'
                      }`}
                    >
                      {item.order}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                          {item.title}
                        </h4>
                        {item.isFree ? (
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                            {item.badge}
                          </span>
                        ) : isEnrolled ? (
                          <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md border border-teal-200">
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Upgrade to Proceed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    {canAccess ? (
                      <Link
                        href={`/student/lessons/${item.id}`}
                        className="py-2.5 px-5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition flex items-center gap-1.5 shadow-sm interactive-target"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{item.isFree && !isEnrolled ? 'Start Free Lesson 1' : 'Watch Sign Lesson'}</span>
                      </Link>
                    ) : (
                      <Link
                        href="/checkout?course=course-frontend-web-1"
                        className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition flex items-center gap-1.5 shadow-sm interactive-target"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Upgrade to Unlock</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* EMBEDDED CODE LAB COMPONENT */}
        <section id="code-lab" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-black uppercase text-teal-700 tracking-wider">Hands-On Practice</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Visual Browser Code Lab
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              HTML5, CSS &amp; DOM Verification
            </span>
          </div>

          <VisualCodeLab />
        </section>

        {/* Technical NSL Glossary Card */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black uppercase text-teal-700 tracking-wider">Vocabulary</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Accredited NSL Software Engineering Glossary
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Standardized signs for modern web technologies established with the Nigerian Deaf community.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { term: 'Semantic Element', sign: 'Structure + Meaning', desc: 'Tags like <header>, <main>, <article> that describe their content to assistive technology.' },
              { term: 'Flexbox', sign: 'Flexible Alignment', desc: 'One-dimensional layout model for distributing space among items in a container.' },
              { term: 'Event Listener', sign: 'Attentive Ear/Eye', desc: 'Code waiting to trigger when a user clicks, scrolls, or presses a key.' },
              { term: 'WCAG 2.2 AA', sign: 'Accessible Shield', desc: 'Global standards for color contrast, keyboard navigability, and zero auditory reliance.' },
              { term: 'API Endpoint', sign: 'Data Bridge Connection', desc: 'A communication URL where frontend requests structured JSON data from a backend server.' },
              { term: 'DOM Tree', sign: 'Document Branching Hierarchy', desc: 'The in-memory browser representation of HTML nodes that JavaScript can inspect and alter.' },
            ].map((item) => (
              <div key={item.term} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-slate-900">{item.term}</h4>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded">
                    {item.sign}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Enrolment / Checkout Banner using Phase 2 Engine */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-800 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <span className="px-2.5 py-0.5 rounded bg-teal-400 text-slate-950 text-[10px] font-black uppercase">
              Official Enrolment
            </span>
            <h3 className="text-2xl font-black text-white">Full Career Track: ₦5,000 One-Time</h3>
            <p className="text-xs sm:text-sm text-teal-100 font-medium leading-relaxed">
              Unlock all 8 certified NSL video modules, 3 real-world portfolio capstone projects, code review by Deaf engineers, and the DeafLMS Frontend Developer Certificate.
            </p>
          </div>

          <Link
            href="/checkout?course=course-frontend-web-1"
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
