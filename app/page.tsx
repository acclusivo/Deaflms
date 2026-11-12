'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Code,
  Sliders,
  Video,
  ShieldCheck,
  Building2,
  ChevronDown,
  Clock,
  Keyboard,
  LogIn,
} from 'lucide-react';
import { AccessibleSignVideoPlayer } from '@/components/common/AccessibleSignVideoPlayer';
import { SignyAITutorModal } from '@/components/student/SignyAITutorModal';
import { Navbar } from '@/components/common/Navbar';

import { AgeSegment } from '@/lib/types';

interface CourseCard {
  id: string;
  ageSegment: AgeSegment;
  title: string;
  description: string;
  audience: string;
  duration: string;
  lessonCount: number;
  priceNgn: number;
  isFree: boolean;
  thumbnailUrl: string;
  ctaHref: string;
}

const COURSES: CourseCard[] = [
  {
    id: 'course-reading-storybook-1',
    ageSegment: '6-8',
    title: 'Visual Storybook: The Clever Fox',
    description: 'Dual-pane illustrated storybook with synchronized sign language video and tap-to-sign vocabulary.',
    audience: 'Ages 6–8 • Early Literacy',
    duration: '30 mins',
    lessonCount: 3,
    priceNgn: 0,
    isFree: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
    ctaHref: '/student/storybook/storybook-clever-fox',
  },
  {
    id: 'course-digital-literacy-1',
    ageSegment: '9-12',
    title: 'Computer Hardware & Digital Basics',
    description: 'A visual introduction to computer parts, mouse and keyboard navigation, and safe web browsing.',
    audience: 'Ages 9–12 • Digital Basics',
    duration: '45 mins',
    lessonCount: 5,
    priceNgn: 0,
    isFree: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    ctaHref: '/signup?course=course-digital-literacy-1&track=9-12',
  },
  {
    id: 'course-hearing-nsl-1',
    ageSegment: '13-17',
    title: 'Applied Visual Communication & Signs',
    description: 'Master everyday conversational signs, fingerspelling alphabet, interaction, and visual grammar.',
    audience: 'Ages 13–17 • Applied Tech',
    duration: '1 hour',
    lessonCount: 6,
    priceNgn: 4000,
    isFree: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    ctaHref: '/signup?course=course-hearing-nsl-1&track=13-17',
  },
  {
    id: 'course-frontend-web-1',
    ageSegment: '18+',
    title: 'Frontend Web Development & Engineering',
    description: 'Learn modern HTML5, CSS layout, and web fundamentals with native sign language video and live in-browser coding.',
    audience: 'Ages 18+ • Engineering Career',
    duration: '2 hours',
    lessonCount: 7,
    priceNgn: 5000,
    isFree: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80',
    ctaHref: '/signup?course=course-frontend-web-1&track=18+',
  },
];

const FAQS = [
  {
    q: 'Do I need previous coding experience?',
    a: 'No. The Frontend Web Development course starts from absolute basics. Every concept is explained visually in Nigerian Sign Language with live code examples.',
  },
  {
    q: 'How does the free Lesson 1 work?',
    a: 'You can start Lesson 1 on any course without entering payment details. You get full access to the video lesson, technical vocabulary, and code sandbox.',
  },
  {
    q: 'How do I pay to unlock Lesson 2 and above?',
    a: 'You can pay the one-time ₦5,000 fee via Selar (cards, USSD, Apple Pay) or direct bank transfer to our Zenith Bank account. Access unlocks immediately upon confirmation.',
  },
  {
    q: 'Which sign language is used?',
    a: 'All lessons use Nigerian Sign Language (NSL) taught by certified native Deaf educators.',
  },
];

export default function LandingPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | '6-8' | '9-12' | '13-17' | '18+'>('all');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const coursesRef = useRef<HTMLDivElement>(null);

  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filteredCourses = COURSES.filter((c) => {
    if (selectedFilter === 'all') return true;
    return c.ageSegment === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 antialiased selection:bg-teal-700 selection:text-white">

      {/* 1. Shared Navigation Header */}
      <Navbar />

      <main className="flex-1">

        {/* 2. Hero Section */}
        <section className="pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

              {/* Left Column: Human Value Proposition */}
              <div className="lg:col-span-6 space-y-6">
                {/* <span className="inline-block px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                  Deaf-Led Education • Nigeria
                </span> */}

                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                    Learn tech in Nigerian Sign Language.
                  </h1>
                  <p className="text-base text-slate-600 leading-relaxed max-w-lg">
                    Video lessons taught by native Deaf educators with live in-browser coding practice. Start Lesson 1 free on any course.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <button
                    onClick={scrollToCourses}
                    className="px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>Choose a Course</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* <Link
                    href="/keyboard-trainer"
                    className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition flex items-center justify-center gap-2"
                  >
                    <Keyboard className="w-4 h-4 text-teal-800" />
                    <span>Try Keyboard Trainer</span>
                  </Link> */}
                </div>

                {/* Minimal Trust Strip */}
                {/* <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 font-medium">
                  <div>
                    <strong className="text-slate-900 font-bold block text-sm">580+</strong>
                    <span>Deaf learners</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <div>
                    <strong className="text-slate-900 font-bold block text-sm">100%</strong>
                    <span>Visual instruction</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <div>
                    <strong className="text-slate-900 font-bold block text-sm">₦0</strong>
                    <span>Lesson 1 free</span>
                  </div>
                </div> */}
              </div>

              {/* Right Column: Live Lesson Demo */}
              <div className="lg:col-span-6">
                <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl text-white space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                    <span className="font-semibold text-slate-200">Live Lesson Preview</span>
                    <span className="text-[11px] font-mono text-teal-400">Lesson 1: Free Access</span>
                  </div>

                  <div className="rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-800">
                    <AccessibleSignVideoPlayer
                      source={{
                        provider: 'mux',
                        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                        fallbackSrc: '/videos/frontend-nsl-lesson-1.mp4',
                        muxPlaybackId: 'rsjNCUwsOkAlOqacIFB4DSueCNQD9gew00lzy2x101uTI',
                        posterUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop&q=80',
                        title: 'Lesson 1: Introduction to HTML in NSL',
                        signLanguage: 'Nigerian Sign Language (NSL)',
                        durationSeconds: 240,
                        reviewedBy: 'Acclusivo NSL Review Board',
                        reviewStatus: 'approved',
                      }}
                      showTitle={false}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                    <span>Includes live code editor &amp; slow-motion controls</span>
                    <Link
                      href="/signup?course=course-frontend-web-1&track=18+"
                      className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                    >
                      <span>Start this lesson</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. Three Core Pillars (Clean & Human) */}
        <section id="how-it-works" className="py-16 border-b border-slate-200 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Built specifically for visual learners.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Most platforms simply put delayed captions over spoken video. DeafLMS is built around visual comprehension.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Native Sign Instruction</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every lesson is delivered by certified Deaf instructors in Nigerian Sign Language, with fingerspelled technical terms shown clearly on screen.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Motion Speed Controls</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Slow down any video to 0.5x or 0.75x to study rapid handshapes and technical signs without audio pitch distortion.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
                  <Code className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">In-Browser Code Lab</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Write HTML and CSS in a split-screen editor right beside the signing instructor. No complex software installation required.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Course Catalog */}
        <section ref={coursesRef} id="courses" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 space-y-8 scroll-mt-20">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Available Courses
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Choose a course. Lesson 1 is completely free on all tracks.
              </p>
            </div>

            {/* Filter Pills: Age Segments */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
              {[
                { id: 'all', label: 'All Ages' },
                { id: '6-8', label: 'Ages 6–8' },
                { id: '9-12', label: 'Ages 9–12' },
                { id: '13-17', label: 'Ages 13–17' },
                { id: '18+', label: 'Ages 18+' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setSelectedFilter(filter.id as any)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${selectedFilter === filter.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => {
              const isTechTrack = course.id === 'course-frontend-web-1';

              return (
                <div
                  key={course.id}
                  className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between ${isTechTrack ? 'border-teal-700 ring-1 ring-teal-700/20' : 'border-slate-200'
                    }`}
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/90 text-slate-800 shadow-xs">
                          {course.audience}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                        <span className="bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                          <Clock className="w-3 h-3 text-teal-300" />
                          <span>{course.duration} • {course.lessonCount} Lessons</span>
                        </span>
                        <span className="bg-emerald-600 px-2 py-0.5 rounded text-[11px]">
                          {course.isFree ? 'Free Forever' : 'Lesson 1 Free'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer & CTA */}
                  <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 mt-2 space-y-3">
                    <div className="flex items-center justify-between pt-3 text-xs">
                      <div>
                        {course.isFree ? (
                          <span className="font-bold text-emerald-700">100% Free</span>
                        ) : (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-bold text-slate-900">
                              ₦{course.priceNgn.toLocaleString()}
                            </span>
                            <span className="text-slate-400 font-medium">for full track</span>
                          </div>
                        )}
                      </div>
                      <span className="text-slate-500 font-medium">
                        {course.isFree ? 'No account required' : 'Free Lesson 1 • Upgrade anytime'}
                      </span>
                    </div>

                    <Link
                      href={course.ctaHref}
                      className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2"
                    >
                      <span>Start Free Lesson 1</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </section>

        {/* 5. Pricing & Payment Options */}
        <section id="pricing" className="py-16 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">

          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Simple, transparent pricing.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Start with Lesson 1 for free. Pay once when you are ready to continue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Free Tier */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Free Preview</span>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">Lesson 1 Free</h3>
                  <div className="text-3xl font-black text-slate-900">₦0</div>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full access to Lesson 1 on all courses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>In-browser HTML &amp; CSS code sandbox</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>AnySign fingerspelling keyboard trainer</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={scrollToCourses}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition cursor-pointer"
              >
                Start Free Lesson 1
              </button>
            </div>

            {/* Paid Full Course Pass */}
            <div className="p-6 rounded-2xl bg-teal-900 text-white border border-teal-800 shadow-md space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider">Full Course Pass</span>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Frontend Web Dev</h3>
                  <div className="text-3xl font-black text-white">₦5,000</div>
                  <p className="text-xs text-teal-200">One-time payment • Lifetime access</p>
                </div>

                <ul className="space-y-2 text-xs text-teal-100 pt-2 border-t border-teal-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                    <span>All 7 video lessons &amp; code challenges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                    <span>VS Code setup and high-contrast tips</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                    <span>Certificate of completion in NSL</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/signup?course=course-frontend-web-1&track=18+"
                className="w-full py-2.5 rounded-xl bg-white hover:bg-teal-50 text-slate-900 font-bold text-xs transition text-center"
              >
                Enroll in Track
              </Link>
            </div>

          </div>

          {/* Payment Details Note */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
              <span><strong>Selar:</strong> Instant Card, USSD &amp; Apple Pay</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-700 shrink-0" />
              <span><strong>Zenith Bank:</strong> Acclusivo Technologies Ltd (1224567890)</span>
            </div>
          </div>

        </section>

        {/* 7. FAQs (Concise & Clear) */}
        <section className="py-12 max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2.5">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-semibold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Safe AI Clarification Modal */}
        <SignyAITutorModal />

      </main>

      {/* 8. Clean Corporate Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-teal-800 text-white flex items-center justify-center font-bold text-xs">
                DL
              </div>
              <span className="font-bold text-slate-900 text-sm">DeafLMS</span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button onClick={scrollToCourses} className="hover:text-teal-800 cursor-pointer">
                Courses
              </button>
              <Link href="/keyboard-trainer" className="hover:text-teal-800">
                Keyboard Trainer
              </Link>
              <Link href="/login" className="hover:text-teal-800">
                Sign In
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} DeafLMS. All rights reserved.</p>
            <p>100% visual instruction in Nigerian Sign Language (NSL).</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
