'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCourses } from '@/lib/api';
import {
  Course,
  AgeSegment,
  EducationStage,
  AdaptiveInterfaceMode,
} from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import {
  Play,
  BookOpen,
  Laptop,
  ArrowRight,
  Sparkles,
  Users,
  Code,
  Terminal,
  Video,
  Award,
  Keyboard,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Sliders,
  Palette,
  ExternalLink,
  GraduationCap,
  School,
  Building,
  Briefcase,
  UserCheck,
} from 'lucide-react';
import { openClarifyModal } from '@/components/student/SignyAITutorModal';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [showAllCourses, setShowAllCourses] = useState<boolean>(false);

  const isParent = user?.role === 'parent';

  // Read calibrated baseline from user profile or fallback defaults
  const calibratedSegment: AgeSegment = user?.ageSegment || '9-12';
  const calibratedStage: EducationStage = user?.educationStage || (
    calibratedSegment === '6-8' ? 'primary' :
      calibratedSegment === '9-12' ? 'jss' :
        calibratedSegment === '13-17' ? 'ss' : 'tertiary'
  );
  const calibratedMode: AdaptiveInterfaceMode = user?.interfaceMode || (
    calibratedSegment === '6-8' ? 'storybook' :
      calibratedSegment === '9-12' ? 'explorer' :
        calibratedSegment === '13-17' ? 'youth_tech' : 'workbench'
  );

  useEffect(() => {
    async function load() {
      const c = await getCourses();
      setCourses(c);
    }
    load();
  }, []);

  const stageLabels: Record<EducationStage, { label: string; badge: string; icon: React.ReactNode }> = {
    primary: {
      label: 'Primary School (Basic 1–6)',
      badge: 'Elementary',
      icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
    },
    jss: {
      label: 'Junior Secondary School (JSS 1–3)',
      badge: 'Middle School',
      icon: <School className="w-4 h-4 text-teal-600" />,
    },
    ss: {
      label: 'Senior Secondary School (SS 1–3)',
      badge: 'High School',
      icon: <GraduationCap className="w-4 h-4 text-indigo-600" />,
    },
    tertiary: {
      label: 'Tertiary Education (University / College)',
      badge: 'Higher Ed',
      icon: <Building className="w-4 h-4 text-blue-600" />,
    },
    no_formal_school: {
      label: 'No Formal School (Community / Self-Taught)',
      badge: 'Community',
      icon: <Users className="w-4 h-4 text-amber-600" />,
    },
    employed: {
      label: 'Employed Practitioner',
      badge: 'Workplace',
      icon: <Briefcase className="w-4 h-4 text-teal-700" />,
    },
    professional: {
      label: 'Professional / Tech Practitioner',
      badge: 'Industry',
      icon: <UserCheck className="w-4 h-4 text-slate-800" />,
    },
  };

  const modeLabels: Record<AdaptiveInterfaceMode, { label: string; badge: string }> = {
    storybook: { label: 'Visual Storybook Mode', badge: 'Picture-Rich' },
    explorer: { label: 'Interactive Explorer Mode', badge: 'Hardware & Typing' },
    youth_tech: { label: 'Youth Tech & Logic Mode', badge: 'STEM & Logic' },
    workbench: { label: 'Career Code Workbench Mode', badge: 'Pro Developer IDE' },
  };

  // Filter courses based on user's calibrated baseline or show all
  const displayedCourses = showAllCourses
    ? courses
    : courses.filter((c) => {
      if (c.ageSegment === calibratedSegment) return true;
      if (user?.customAge && c.minAge !== undefined && c.maxAge !== undefined) {
        return user.customAge >= c.minAge && user.customAge <= c.maxAge;
      }
      return false;
    });

  return (
    <div className="w-full">
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">

        {/* ==================================================================== */}
        {/* PARENT OVERSIGHT BANNER (If user is parent)                          */}
        {/* ==================================================================== */}
        {isParent && (
          <div className="bg-gradient-to-r from-[#00177D] via-[#1B4EA7] to-[#3847AF] rounded-3xl p-5 sm:p-6 text-white border border-[#3847AF] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3.5">
              {/* <div className="w-11 h-11 rounded-2xl bg-white/15 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-indigo-200" />
              </div> */}
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-200">
                  Parent &amp; Family Supervision Mode
                </span>
                <h2 className="text-base sm:text-lg font-black text-white">
                  Monitoring Learning Journey for {user?.displayName || 'Family Learner'}
                </h2>
                {/* <p className="text-xs text-indigo-100">
                  Curriculum and visual interface are calibrated for: <strong>Ages {calibratedSegment}</strong>
                  {user?.customAge ? ` (Exact age: ${user.customAge})` : ''} • {stageLabels[calibratedStage]?.label}.
                </p> */}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <Link
                href="/profile"
                className="px-4 py-2 rounded-xl bg-white text-[#00177D] font-bold text-xs hover:bg-[#F5F7FC] transition shadow-xs flex items-center gap-1.5"
              >
                {/* <Sliders className="w-3.5 h-3.5 text-[#1B4EA7]" /> */}
                <span>Edit Child Profile</span>
              </Link>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ADAPTIVE LEARNING BASELINE STATUS BANNER                             */}
        {/* ==================================================================== */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF3] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 animate-fade-in">
          <div className="space-y-2 max-w-2xl">
            {/* <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#E6F4F6] text-[#065A63] text-[10px] font-black uppercase tracking-wider border border-[#CCEEF1]">
                Learning Baseline
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F5F7FC] text-[#1F2937] text-[10px] font-bold border border-[#E5EAF3]">
                {modeLabels[calibratedMode]?.badge}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#15803D] text-[10px] font-bold border border-emerald-200">
                NSL Active
              </span>
            </div> */}

            <div className="space-y-0.5">
              <h1 className="text-xl sm:text-2xl font-black text-[#00177D] tracking-tight">
                Welcome back, {user?.displayName || 'Learner'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            <Link
              href="/profile"
              className="px-4 py-2.5 rounded-2xl border border-[#E5EAF3] bg-[#F5F7FC] hover:bg-[#E5EAF3] text-[#1F2937] font-black text-xs transition flex items-center gap-1.5 shadow-xs interactive-target"
            >
              <Sliders className="w-3.5 h-3.5 text-[#1B4EA7]" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* ADAPTIVE HERO 1: STORYBOOK MODE (Ages 6–8 / Primary)                 */}
        {/* ==================================================================== */}
        {(calibratedMode === 'storybook' || calibratedSegment === '6-8') && (
          <div className="bg-gradient-to-r from-[#00177D] to-[#1B4EA7] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fade-in">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                  Visual Storybook Mode • Ages 6–8
                </span>
                {/* <span className="px-2 py-0.5 rounded-full bg-[#F4B942] text-[#1F2937] text-[10px] font-black uppercase">
                  100% Free Basic 1
                </span> */}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Foundational Signs &amp; Visual Storybooks
              </h2>
              {/* <p className="text-sky-100 text-xs sm:text-sm font-medium leading-relaxed">
                Learn daily vocabulary, fingerspelling alphabet cards, and read illustrated dual-pane storybooks with side-by-side sign video instruction.
              </p> */}
            </div>

            {/* <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <Link
                href="/student/storybook/storybook-clever-fox"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F5F7FC] text-[#00177D] font-black text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Open The Clever Fox Storybook</span>
              </Link>
            </div> */}
          </div>
        )}

        {/* ==================================================================== */}
        {/* ADAPTIVE HERO 2: EXPLORER MODE (Ages 9–12 / JSS)                    */}
        {/* ==================================================================== */}
        {(calibratedMode === 'explorer' || calibratedSegment === '9-12') && (
          <div className="bg-gradient-to-r from-[#00177D] via-[#1B4EA7] to-[#087F8C] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fade-in">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Computer Hardware &amp; Touch-Typing
              </h2>
              {/* <p className="text-sky-100 text-xs sm:text-sm font-medium leading-relaxed">
                Learn computer hardware components (webcam, mouse, monitor, keyboard) and practice fingerspelling QWERTY typing with tactile visual keys.
              </p> */}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <Link
                href="/student/lessons/lesson-hardware-1"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F5F7FC] text-[#00177D] font-black text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Laptop className="w-4 h-4" />
                <span>Start Hardware</span>
              </Link>
              <Link
                href="/keyboard-trainer"
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs border border-white/25 transition flex items-center justify-center gap-1.5"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Keyboard Trainer</span>
              </Link>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ADAPTIVE HERO 3: YOUTH TECH MODE (Ages 13–17 / SS)                   */}
        {/* ==================================================================== */}
        {(calibratedMode === 'youth_tech' || calibratedSegment === '13-17') && (
          <div className="bg-gradient-to-r from-[#00177D] via-[#1B4EA7] to-[#3847AF] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#3847AF]/40 animate-fade-in">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-indigo-100 border border-white/20 text-[10px] font-black uppercase tracking-wider">
                  Youth Tech &amp; Logic Mode • Ages 13–17
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F4B942] text-[#1F2937] text-[10px] font-black uppercase">
                  Youth Track
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Visual Web Concepts &amp; STEM Science
              </h2>
              <p className="text-indigo-100 text-xs sm:text-sm font-medium leading-relaxed">
                Explore space and science sign vocabulary, introductory web markup concepts, and conversational visual communication.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <Link
                href="/student/courses/course-hearing-nsl-1"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F5F7FC] text-[#00177D] font-black text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>Explore Visual Modules</span>
              </Link>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ADAPTIVE HERO 4: WORKBENCH MODE (Ages 18+ / Tertiary & Pro)         */}
        {/* ==================================================================== */}
        {(calibratedMode === 'workbench' || calibratedSegment === '18+') && (
          <div className="bg-gradient-to-r from-[#00177D] via-[#1B4EA7] to-[#087F8C] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#1B4EA7] animate-fade-in">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Frontend Web Development in Nigerian Sign Language
              </h2>
              <p className="text-sky-100 text-xs sm:text-sm font-medium leading-relaxed">
                Build real-world accessible web apps with HTML5, modern CSS layouts, and JavaScript DOM manipulation with native sign technical instruction.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <Link
                href="/student/lessons/lesson-frontend-1"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#F4B942] hover:bg-[#e0a838] text-[#1F2937] font-black text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Lesson</span>
              </Link>

              <Link
                href="/student/courses/course-frontend-web-1"
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs border border-white/20 transition flex items-center justify-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5 text-[#ABB8D7]" />
                <span>View Full Syllabus</span>
              </Link>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* INTERACTIVE ACTION TILES                                             */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E5EAF3] shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4F6] text-[#087F8C] flex items-center justify-center font-black">
                <Laptop className="w-5 h-5 text-[#087F8C]" />
              </div>
              <h3 className="font-black text-[#1F2937] text-sm">Hardware &amp; Digital Lab</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Touch-interactive hardware components and fingerspell typing trainer.
              </p>
            </div>
            <Link
              href="/student/digital-literacy"
              className="py-2 px-3 rounded-xl bg-[#E6F4F6] hover:bg-[#CCEEF1] text-[#065A63] font-bold text-xs transition border border-[#CCEEF1] text-center flex items-center justify-center gap-1"
            >
              <span>Practice Lab</span>
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5EAF3] shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-[#F0F4FA] text-[#1B4EA7] flex items-center justify-center font-black">
                <Terminal className="w-5 h-5 text-[#1B4EA7]" />
              </div>
              <h3 className="font-black text-[#1F2937] text-sm">Interactive Code Sandbox</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Live in-browser HTML &amp; CSS code editor with instant rendering.
              </p>
            </div>
            <Link
              href="/student/tracks/deaf-adult#code-lab"
              className="py-2 px-3 rounded-xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-bold text-xs transition text-center flex items-center justify-center gap-1"
            >
              <span>Open Code Lab</span>
            </Link>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* COURSES CATALOG FILTERED BY BASELINE WITH ALL-CATALOG TOGGLE         */}
        {/* ==================================================================== */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#00177D]">
                {showAllCourses ? 'Complete DeafLMS Curriculum Catalog' : `Curriculum for Ages ${calibratedSegment} (${stageLabels[calibratedStage]?.label})`}
              </h2>
              <p className="text-xs text-[#64748B] font-medium">
                {showAllCourses
                  ? 'All courses across primary, secondary, and career web engineering.'
                  : 'Tailored courses calibrated to your current baseline profile.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAllCourses(!showAllCourses)}
              className="px-3.5 py-1.5 rounded-xl border border-[#E5EAF3] bg-white text-xs font-bold text-[#1F2937] hover:bg-[#F5F7FC] transition self-start sm:self-auto flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5 text-[#1B4EA7]" />
              <span>{showAllCourses ? `Filter by My Calibrated Baseline (${calibratedSegment})` : 'Browse Complete Catalog (All Ages)'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses.map((course) => {
              const isWebCourse = course.id === 'course-frontend-web-1';

              return (
                <div
                  key={course.id}
                  className={`bg-white rounded-3xl border overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between ${isWebCourse ? 'border-[#1B4EA7] ring-1 ring-[#1B4EA7]/20' : 'border-[#E5EAF3]'
                    }`}
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/95 text-[#1F2937] shadow-xs border border-[#E5EAF3]">
                          {course.gradeLevel}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#111827]/80 text-white backdrop-blur-xs">
                          {course.isFreeTier ? '100% Free' : `₦${course.priceNgn?.toLocaleString()}`}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <h3 className="font-black text-[#1F2937] text-base leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-[#64748B] font-medium leading-relaxed line-clamp-2">
                        {course.description}
                      </p>
                      <div className="text-[11px] text-[#64748B] font-bold flex items-center gap-3 pt-1">
                        <span>{course.lessonsCount} Video Lessons</span>
                        <span>•</span>
                        <span>{course.durationMinutes} mins</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      href={
                        course.id === 'course-reading-storybook-1'
                          ? '/student/storybook/storybook-clever-fox'
                          : course.id === 'course-digital-literacy-1'
                            ? '/student/lessons/lesson-hardware-1'
                            : `/student/lessons/lesson-frontend-1`
                      }
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-black text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <span>Start Learning</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
