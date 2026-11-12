'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Sparkles,
} from 'lucide-react';
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
  // {
  //   id: 'course-reading-storybook-1',
  //   ageSegment: '6-8',
  //   title: 'Visual Storybook: The Clever Fox',
  //   description: 'Dual-pane illustrated storybook with synchronized sign language video and tap-to-sign vocabulary.',
  //   audience: 'Ages 6–8 • Early Literacy',
  //   duration: '30 mins',
  //   lessonCount: 3,
  //   priceNgn: 0,
  //   isFree: true,
  //   thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
  //   ctaHref: '/student/storybook/storybook-clever-fox',
  // },
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
  // {
  //   id: 'course-hearing-nsl-1',
  //   ageSegment: '13-17',
  //   title: 'Applied Visual Communication & Signs',
  //   description: 'Master everyday conversational signs, fingerspelling alphabet, interaction, and visual grammar.',
  //   audience: 'Ages 13–17 • Applied Tech',
  //   duration: '1 hour',
  //   lessonCount: 6,
  //   priceNgn: 4000,
  //   isFree: false,
  //   thumbnailUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
  //   ctaHref: '/signup?course=course-hearing-nsl-1&track=13-17',
  // },
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
        <section className="pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#E5EAF3] bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

              {/* Left Column: Human Value Proposition */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-5xl font-black text-[#00177D] tracking-tight leading-[1.15]">
                    Learn tech in Sign Language.
                  </h1>
                  <p className="text-base text-[#1F2937] leading-relaxed max-w-lg">
                    Video lessons taught by native Deaf experienced trainers with live in-browser coding practice. Start Lesson 1 free on any course.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <button
                    onClick={scrollToCourses}
                    className="px-6 py-3.5 rounded-xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>Choose a Course</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Visual Learning in Action (Deaf Child Learning) */}
              <div className="lg:col-span-6">
                <div className="rounded-3xl border-2 border-[#E5EAF3] bg-white shadow-xl overflow-hidden transition-all hover:shadow-2xl">
                  {/* Visual Image Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <Image
                      src="/images/deaf-child-learning.jpg"
                      alt="A young deaf Nigerian child with a hearing aid smiling with understanding while learning STEM on a laptop"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />

                    {/* Subtle contrast gradient for badges and text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Status Badges */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between gap-2 pointer-events-none">
                      {/* <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#00177D] text-[11px] font-black shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-[#087F8C] animate-pulse" />
                        Visual STEM Learning
                      </span> */}
                      {/* <span className="px-2.5 py-1 rounded-full bg-[#00177D]/90 backdrop-blur-md text-white text-[10px] font-bold">
                        Deaf-First Education
                      </span> */}
                    </div>

                    {/* Bottom Caption & Understanding Highlight */}
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white pointer-events-none space-y-1">
                      {/* <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Comprehension by Design</span>
                      </div> */}
                      {/* <p className="text-sm sm:text-base font-black leading-snug drop-shadow-sm">
                        Where visual clarity turns complex STEM concepts into joyful understanding.
                      </p> */}
                    </div>
                  </div>

                  {/* Bottom Feature Card Bar */}
                  {/* <div className="p-4 sm:p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-[#E5EAF3]">
                    <div className="flex items-center gap-2 text-[#1F2937] font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#087F8C] shrink-0" />
                      <span>Certified NSL instruction • Visual stories &amp; code labs</span>
                    </div>
                    <Link
                      href="/signup?course=course-reading-storybook-1&track=6-8"
                      className="text-[#1B4EA7] hover:text-[#00177D] font-bold flex items-center gap-1.5 shrink-0 transition"
                    >
                      <span>Explore Lessons</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div> */}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. Three Core Pillars (Clean & Human) */}
        <section id="how-it-works" className="py-16 border-b border-[#E5EAF3] bg-[#F5F7FC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[#00177D] tracking-tight">
                Built specifically for visual learners.
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Most platforms simply put delayed captions over spoken video. DeafLMS is built around visual comprehension.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-white p-6 rounded-2xl border border-[#E5EAF3] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0F4FA] text-[#1B4EA7] flex items-center justify-center font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1F2937]">Native Sign Instruction</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Every lesson is delivered by certified Deaf instructors in Nigerian Sign Language, with fingerspelled technical terms shown clearly on screen.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E5EAF3] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0F4FA] text-[#1B4EA7] flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1F2937]">Motion Speed Controls</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Slow down any video to 0.5x or 0.75x to study rapid handshapes and technical signs without audio pitch distortion.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E5EAF3] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0F4FA] text-[#1B4EA7] flex items-center justify-center font-bold">
                  <Code className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1F2937]">In-Browser Code Lab</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Write HTML and CSS in a split-screen editor right beside the signing instructor. No complex software installation required.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Course Catalog */}
        <section ref={coursesRef} id="courses" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 space-y-8 scroll-mt-20">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5EAF3] pb-5">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-[#00177D] tracking-tight">
                Available Courses
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Choose a course. Lesson 1 is completely free on all tracks.
              </p>
            </div>

            {/* Filter Pills: Age Segments */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F5F7FC] rounded-xl border border-[#E5EAF3] self-start sm:self-auto">
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
                    ? 'bg-[#1B4EA7] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#1F2937]'
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
                  className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between ${isTechTrack ? 'border-[#1B4EA7] ring-1 ring-[#1B4EA7]/20' : 'border-[#E5EAF3]'
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
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/90 text-[#1F2937] shadow-xs">
                          {course.audience}
                        </span>
                      </div>
                      {/* <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                        <span className="bg-[#111827]/80 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#ABB8D7]" />
                          <span>{course.duration} • {course.lessonCount} Lessons</span>
                        </span>
                        <span className="bg-[#15803D] px-2 py-0.5 rounded text-[11px]">
                          {course.isFree ? 'Free Forever' : 'Lesson 1 Free'}
                        </span>
                      </div> */}
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 space-y-2">
                      <h3 className="text-lg font-bold text-[#1F2937] leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer & CTA */}
                  <div className="p-5 sm:p-6 pt-0 border-t border-[#E5EAF3] mt-2 space-y-3">
                    {/* <div className="flex items-center justify-between pt-3 text-xs">
                      <div>
                        {course.isFree ? (
                          <span className="font-bold text-[#15803D]">100% Free</span>
                        ) : (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-bold text-[#00177D]">
                              ₦{course.priceNgn.toLocaleString()}
                            </span>
                            <span className="text-[#64748B] font-medium">for full track</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[#64748B] font-medium">
                        {course.isFree ? 'No account required' : 'Free Lesson 1 • Upgrade anytime'}
                      </span>
                    </div> */}

                    <Link
                      href={course.ctaHref}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2"
                    >
                      <span>Start Lesson</span>
                      {/* <ArrowRight className="w-4 h-4" /> */}
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
            <h2 className="text-2xl sm:text-3xl font-black text-[#00177D] tracking-tight">
              Simple, transparent pricing.
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Start with Lesson 1 for free. Pay once when you are ready to continue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Free Tier */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5EAF3] shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Free Preview</span>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#1F2937]">Lesson 1 Free</h3>
                  <div className="text-3xl font-black text-[#00177D]">₦0</div>
                </div>

                <ul className="space-y-2 text-xs text-[#64748B] pt-2 border-t border-[#E5EAF3]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                    <span>Full access to Lesson 1 on all courses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                    <span>In-browser HTML &amp; CSS code sandbox</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                    <span>AnySign fingerspelling keyboard trainer</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={scrollToCourses}
                className="w-full py-2.5 rounded-xl bg-[#F5F7FC] hover:bg-[#E5EAF3] text-[#1F2937] font-semibold text-xs border border-[#E5EAF3] transition cursor-pointer"
              >
                Start Free Lesson 1
              </button>
            </div>

            {/* Paid Full Course Pass */}
            <div className="p-6 rounded-2xl bg-[#00177D] text-white border border-[#1B4EA7] shadow-md space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-[#F4B942] uppercase tracking-wider">Full Course Pass</span>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Frontend Web Dev</h3>
                  <div className="text-3xl font-black text-white">₦5,000</div>
                  <p className="text-xs text-[#ABB8D7]">One-time payment • Lifetime access</p>
                </div>

                <ul className="space-y-2 text-xs text-sky-100 pt-2 border-t border-[#1B4EA7]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F4B942] shrink-0" />
                    <span>All 7 video lessons &amp; code challenges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F4B942] shrink-0" />
                    <span>VS Code setup and high-contrast tips</span>
                  </li>
                  {/* <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F4B942] shrink-0" />
                    <span>Certificate of completion in NSL</span>
                  </li> */}
                </ul>
              </div>

              <Link
                href="/signup?course=course-frontend-web-1&track=18+"
                className="w-full py-2.5 rounded-xl bg-white hover:bg-[#F5F7FC] text-[#00177D] font-bold text-xs transition text-center shadow-xs"
              >
                Enroll in Track
              </Link>
            </div>

          </div>

          {/* Payment Details Note */}
          {/* <div className="p-4 bg-white rounded-xl border border-[#E5EAF3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#64748B]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1B4EA7] shrink-0" />
              <span><strong className="text-[#1F2937]">Selar:</strong> Instant Card, USSD &amp; Apple Pay</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#1B4EA7] shrink-0" />
              <span><strong className="text-[#1F2937]">Zenith Bank:</strong> Acclusivo Technologies Ltd (1224567890)</span>
            </div>
          </div> */}

        </section>

        {/* 7. FAQs (Concise & Clear) */}
        <section className="py-12 max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[#00177D]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2.5">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-xl border border-[#E5EAF3] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-semibold text-xs sm:text-sm text-[#1F2937] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F5F7FC]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-[#64748B] leading-relaxed border-t border-[#E5EAF3] pt-2">
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
      <footer className="bg-white border-t border-[#E5EAF3] py-10 text-xs text-[#64748B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* <div className="w-6 h-6 rounded bg-[#00177D] text-white flex items-center justify-center font-bold text-xs">
                DL
              </div> */}
              <span className="font-bold text-[#1F2937] text-sm">Deaf<span className="text-[#1B4EA7]">LMS</span></span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button onClick={scrollToCourses} className="hover:text-[#1B4EA7] cursor-pointer">
                Courses
              </button>
              <Link href="/keyboard-trainer" className="hover:text-[#1B4EA7]">
                Keyboard Trainer
              </Link>
              <Link href="/login" className="hover:text-[#1B4EA7]">
                Sign In
              </Link>
            </div>
          </div>

          <div className="border-t border-[#E5EAF3] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#64748B] text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} Acclusivo DeafLMS. All rights reserved.</p>
            {/* <p>100% visual instruction in Nigerian Sign Language (NSL).</p> */}
          </div>
        </div>
      </footer>

    </div>
  );
}
