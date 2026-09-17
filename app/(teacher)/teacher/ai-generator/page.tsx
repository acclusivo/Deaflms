'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { VideoUploader } from '@/components/teacher/VideoUploader';
import { AILessonGeneration } from '@/lib/types';
import { createCourse } from '@/lib/api';
import { Sparkles, Loader2, CheckCircle2, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TeacherAIGeneratorPage() {
  const router = useRouter();
  const [topic, setTopic] = useState('Computer Input & Output Devices');
  const [gradeLevel, setGradeLevel] = useState('Grade 3-5');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<AILessonGeneration | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>('https://www.youtube.com/watch?v=0FcwzMq4iWg');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/ai/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, gradeLevel }),
      });

      if (res.ok) {
        const data = await res.json();
        setGenerated(data);
      }
    } catch (e) {
      console.warn('Lesson generation failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToClassroom = async () => {
    if (!generated) return;

    await createCourse({
      title: generated.lessonTitle,
      description: generated.description,
      gradeLevel: generated.gradeLevel,
      category: generated.category,
      thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      durationMinutes: 35,
      iconName: 'Laptop',
      teacherName: 'Mr. Jordan Ellis',
      videoUrl: uploadedVideoUrl,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      router.push('/teacher/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentRole="teacher" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-2 relative z-10">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-indigo-100 inline-block">
              Educator AI Studio
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              AI Lesson & Worksheet Co-Pilot
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base">
              Generate complete DHH-tailored vocabulary banks, sign physical cues, and interactive matching worksheets in seconds with Gemini.
            </p>
          </div>
        </div>

        {/* Generator Form */}
        <form
          onSubmit={handleGenerate}
          className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                Lesson Topic or Theme:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Computer Hardware, Animals, Everyday Feelings..."
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 focus:border-indigo-600 focus:bg-white transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                Target Grade Level:
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 focus:border-indigo-600 focus:bg-white transition"
              >
                <option value="Grade K-2">Grade K-2</option>
                <option value="Grade 3-5">Grade 3-5</option>
                <option value="Grade 6-8">Grade 6-8</option>
                <option value="Grade 9-12">Grade 9-12</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md shadow-indigo-200 transition interactive-target"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Curriculum...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Generate Lesson & Worksheet
                </>
              )}
            </button>
          </div>
        </form>

        {/* Generated Curriculum Preview */}
        {generated && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6 animate-star-pop">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                  {generated.category} • {generated.gradeLevel}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">{generated.lessonTitle}</h3>
                <p className="text-slate-600 text-sm mt-1">{generated.description}</p>
              </div>

              <button
                onClick={handleSaveToClassroom}
                disabled={savedSuccess}
                className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md shadow-emerald-200 transition interactive-target shrink-0"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Published to Classroom!
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    Publish to Classroom
                  </>
                )}
              </button>
            </div>

            {/* Generated Vocabulary Bank */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                1. Generated Sign Vocabulary Bank:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {generated.vocabulary.map((vocab, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-slate-900">{vocab.word}</span>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        {vocab.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {vocab.signDescription}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Matching Worksheet Preview */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                2. Auto-Formatted Matching Worksheet:
              </h4>
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
                <div className="font-extrabold text-slate-900 text-sm">{generated.worksheet.title}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {generated.worksheet.pairs.map((pair) => (
                    <div key={pair.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800">{pair.label}</span>
                      <span className="text-indigo-600 font-medium">{pair.signHint}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Teacher Sign Video Integration */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                3. Attached Sign Demonstration Video:
              </h4>
              <VideoUploader
                initialUrl={uploadedVideoUrl}
                onVideoUploaded={(url) => setUploadedVideoUrl(url)}
              />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
