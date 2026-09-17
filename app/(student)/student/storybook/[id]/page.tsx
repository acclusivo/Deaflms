'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLessonById } from '@/lib/api';
import { Lesson } from '@/lib/types';
import { Navbar } from '@/components/common/Navbar';
import { StorybookReader } from '@/components/student/StorybookReader';
import { VisualReward } from '@/components/common/VisualReward';
import { ArrowLeft, Loader2, Play } from 'lucide-react';
import Link from 'next/link';

export default function StorybookPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = (params?.id as string) || 'lesson-storybook-1';

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getLessonById(lessonId);
      setLesson(data);
      setLoading(false);
    }
    load();
  }, [lessonId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar currentRole="student" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-indigo-600 font-bold">
            <Loader2 className="w-6 h-6 animate-spin" />
            Opening Storybook...
          </div>
        </div>
      </div>
    );
  }

  if (!lesson || !lesson.storyPages) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar currentRole="student" />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Storybook not found</h2>
          <Link
            href="/student/dashboard"
            className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentRole="student" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <Link
            href="/student/worksheets/ws-sign-to-text-animals"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition shadow-sm shadow-emerald-200"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Take Comprehension Quiz
          </Link>
        </div>

        <StorybookReader
          title={lesson.title}
          pages={lesson.storyPages}
          signVideoUrl={lesson.signVideoUrl}
          onComplete={() => setShowReward(true)}
        />
      </main>

      <VisualReward
        isOpen={showReward}
        score={30}
        starsEarned={3}
        totalPoints={30}
        onContinue={() => router.push('/student/worksheets/ws-sign-to-text-animals')}
        title="Story Completed!"
        subtitle="You read the full story and watched all sign videos!"
      />
    </div>
  );
}
