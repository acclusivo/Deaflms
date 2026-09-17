'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { VideoUploader } from '@/components/teacher/VideoUploader';
import { createCourse } from '@/lib/api';
import { CourseCategory } from '@/lib/types';
import { ArrowLeft, Save, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function NewCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CourseCategory>('Digital Literacy');
  const [gradeLevel, setGradeLevel] = useState('Grade 3-5');
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    await createCourse({
      title,
      description,
      category,
      gradeLevel,
      thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      durationMinutes: 40,
      iconName: 'Laptop',
      teacherName: 'Mr. Jordan Ellis',
      videoUrl: uploadedVideoUrl,
    });

    setTimeout(() => {
      setSaving(false);
      router.push('/teacher/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentRole="teacher" />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/teacher/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <Link
            href="/teacher/ai-generator"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Try AI Generator instead
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Create New Sign Course</h1>
            <p className="text-xs text-slate-500 mt-1">Design a structured visual unit for Deaf and Hard-of-Hearing students.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">Course Title:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Video Communication & Webcam Basics in ASL"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 focus:border-indigo-600 focus:bg-white transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">Curriculum Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CourseCategory)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 focus:border-indigo-600 focus:bg-white transition"
                >
                  <option value="Digital Literacy">Digital Literacy</option>
                  <option value="Reading & Literacy">Reading & Literacy</option>
                  <option value="Everyday Signs">Everyday Signs</option>
                  <option value="STEM">STEM</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">Target Grade Level:</label>
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

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">Course Summary:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what visual concepts and sign vocabulary will be learned..."
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium text-slate-900 focus:border-indigo-600 focus:bg-white transition"
              />
            </div>

            {/* Video Upload Field */}
            <VideoUploader onVideoUploaded={(url) => setUploadedVideoUrl(url)} />

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 py-3.5 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-200 transition interactive-target"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Publish Course
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
