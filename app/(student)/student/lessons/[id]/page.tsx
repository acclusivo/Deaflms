'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { useAuth } from '@/lib/auth-context';
import { getLessonById, getCourseById } from '@/lib/api';
import { Lesson, Course } from '@/lib/types';
import { checkLessonAccess } from '@/lib/plans';
import { SignVideoPlayer } from '@/components/student/SignVideoPlayer';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Sparkles,
  Clock,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award,
  Video,
  Eye,
  Layers,
  Lock,
  RotateCcw,
  Check,
} from 'lucide-react';

export default function LessonVideoPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const lessonId = params?.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeVocabIndex, setActiveVocabIndex] = useState<number>(0);
  const [practicedSigns, setPracticedSigns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      if (!lessonId) return;
      setLoading(true);
      const l = await getLessonById(lessonId);
      setLesson(l);

      if (l?.courseId) {
        const c = await getCourseById(l.courseId);
        setCourse(c);
      }
      setLoading(false);
    }
    loadData();
  }, [lessonId]);

  // Determine the target quiz/worksheet activity for this lesson
  const getActivityUrl = (id: string): string => {
    switch (id) {
      case 'lesson-hardware-1':
        return '/student/worksheets/ws-hardware-match';
      case 'lesson-keyboard-1':
        return '/student/digital-literacy';
      case 'lesson-web-1':
        return '/student/worksheets/ws-fingerspell-builder';
      case 'lesson-everyday-1':
        return '/student/worksheets/ws-hardware-match';
      case 'lesson-storybook-1':
        return '/student/storybook/lesson-storybook-1';
      default:
        return '/student/worksheets/ws-hardware-match';
    }
  };

  const togglePracticed = (signId: string) => {
    setPracticedSigns((prev) => ({
      ...prev,
      [signId]: !prev[signId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar currentRole="student" stars={user?.totalStars || 25} />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3 text-indigo-600 font-bold">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-700 text-sm font-semibold">Loading Sign Language Video Lesson...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar currentRole="student" stars={user?.totalStars || 25} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Lesson Not Found</h1>
          <p className="text-slate-600 text-sm max-w-md mb-6">
            We couldn&apos;t locate the requested sign language lesson. Please check your dashboard or course syllabus.
          </p>
          <Link
            href="/student/dashboard"
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/30"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Server-side entitlement check
  const entitlement = checkLessonAccess(user, lesson.id);
  if (!entitlement.allowed) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar currentRole="student" stars={user?.totalStars || 25} />
        <div className="flex-1 max-w-xl mx-auto px-4 py-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-3">
            Supporter Tier Locked
          </span>
          <h1 className="text-2xl font-black text-slate-900 mb-2">{lesson.title}</h1>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            {entitlement.reason ||
              'This advanced sign lesson is part of our full K-12 curriculum. Upgrade to Family Supporter to unlock all 24+ modules.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition shadow-lg shadow-emerald-600/30"
            >
              Explore Supporter Plans
            </Link>
            <Link
              href="/student/courses/course-digital-literacy-1"
              className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition"
            >
              Back to Free Basic 1 Lessons
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const vocabItems = lesson.vocabularyItems || [];
  const currentVocab = vocabItems[activeVocabIndex] || vocabItems[0];
  const totalPracticed = Object.values(practicedSigns).filter(Boolean).length;
  const targetQuizUrl = getActivityUrl(lesson.id);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentRole="student" stars={user?.totalStars || 25} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={course ? `/student/courses/${course.id}` : '/student/dashboard'}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl transition shadow-sm interactive-target"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-600" />
            <span>Back to {course?.title || 'Course'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-black text-xs rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Lesson {lesson.orderIndex} of 5 • Video Instruction
            </span>
          </div>
        </div>

        {/* Lesson Title & Concept Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold text-indigo-700">
            <span className="px-3 py-1 rounded-md bg-indigo-50 border border-indigo-100">
              Module 1: Computer Hardware &amp; Digital Basics
            </span>
            <span>•</span>
            <span className="text-slate-500 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {Math.round((lesson.durationSeconds || 180) / 60)} Minutes Sign Video
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {lesson.title}
          </h1>

          <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-4xl">
            {lesson.description}
          </p>

          {/* Deaf Accessibility Notice */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 flex items-center gap-3 text-xs text-indigo-900 font-bold">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>
              <strong>Signing Space Approved:</strong> Hands, face, and upper body are fully framed. Use playback speed controls below (0.5x, 0.75x) to inspect fine finger positions.
            </span>
          </div>
        </div>

        {/* Core Media Section: Sign Language Video Player */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black text-slate-900">Step 1: Watch Native Sign Model</h2>
            </div>
            <span className="text-xs font-bold text-slate-500">Zero Audio • Pure Visual Signing</span>
          </div>

          <SignVideoPlayer
            videoUrl={lesson.signVideoUrl || 'https://www.youtube.com/watch?v=0FcwzMq4iWg'}
            title={`${lesson.title} - Visual Sign Lesson`}
            autoPlay={false}
          />
        </div>

        {/* Step 2: Key Vocabulary & Signing Breakdown Cards */}
        {vocabItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-black text-slate-900">
                  Step 2: Learn Key Visual Signs ({vocabItems.length} Terms)
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                {totalPracticed} of {vocabItems.length} Practiced
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {vocabItems.map((vocab, index) => {
                const isSelected = activeVocabIndex === index;
                const isPracticed = !!practicedSigns[vocab.id];

                return (
                  <div
                    key={vocab.id}
                    onClick={() => setActiveVocabIndex(index)}
                    className={`cursor-pointer rounded-3xl p-5 border-2 transition relative flex flex-col justify-between gap-4 ${
                      isSelected
                        ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-600/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Image Thumbnail */}
                      <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-200/80">
                        <img
                          src={vocab.pictureUrl}
                          alt={vocab.textWord}
                          className="w-full h-full object-cover"
                        />
                        {isPracticed && (
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-1 shadow">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span className="absolute bottom-2 left-2 bg-slate-950/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
                          {vocab.category}
                        </span>
                      </div>

                      {/* Word & Fingerspelling */}
                      <div>
                        <h3 className="text-lg font-black text-slate-900">{vocab.textWord}</h3>
                        <p className="text-xs font-mono font-black text-indigo-600 tracking-widest mt-0.5">
                          {vocab.fingerspellText}
                        </p>
                      </div>

                      {/* Movement Tips */}
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {vocab.descriptionTips}
                      </p>
                    </div>

                    {/* Practiced Toggle Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePracticed(vocab.id);
                      }}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 interactive-target ${
                        isPracticed
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isPracticed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Practiced ✓</span>
                        </>
                      ) : (
                        <span>Mark as Practiced</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Selected Sign Deep Dive Spotlight */}
            {currentVocab && (
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-indigo-700/50">
                <div className="space-y-3 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-md">
                      Spotlight Sign
                    </span>
                    <span className="text-xs font-bold text-indigo-200">
                      {currentVocab.textWord}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black">{currentVocab.textWord}</h3>
                  <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                    <strong>Signing Guidance:</strong> {currentVocab.descriptionTips}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <span className="text-xs text-indigo-200 font-bold">Fingerspelling:</span>
                    <span className="px-3 py-1 rounded-xl bg-white/10 font-mono font-black text-amber-300 text-sm border border-white/20">
                      {currentVocab.fingerspellText}
                    </span>
                  </div>
                </div>

                <div className="w-full md:w-56 h-44 rounded-2xl overflow-hidden bg-white/10 border-2 border-white/20 shrink-0 relative">
                  <img
                    src={currentVocab.pictureUrl}
                    alt={currentVocab.textWord}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <span className="text-xs font-black text-white">{currentVocab.textWord}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Signy Visual AI Tutor Practice Tip */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-base font-black text-slate-900">
              Signy&apos;s Visual Learning Tip for {lesson.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Deaf learners remember hardware signs through physical shape imitation. When signing <strong>Monitor</strong>, draw the exact rectangle of a screen in front of your chest. When signing <strong>Keyboard</strong>, wiggle your fingers like you are touch-typing on a desk!
            </p>
          </div>
        </div>

        {/* Visually Dominant Progression Action */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-1">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              Step 3: Verification &amp; Games
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Watched the video? Put your signs to the test!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Complete the interactive Picture-to-Sign matching activity and earn up to 40 Stars!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              href={targetQuizUrl}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base transition shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 interactive-target transform hover:scale-105"
            >
              <span>I&apos;m Ready! Take Quiz &amp; Practice</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
