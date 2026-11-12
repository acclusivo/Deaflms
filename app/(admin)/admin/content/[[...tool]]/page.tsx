'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { projectId, dataset } from '@/sanity/env';
import { Lesson } from '@/lib/types';
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Video,
  Play,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Save,
  Lock,
  Unlock,
  Loader2,
  Check,
  Code,
  Laptop,
  HelpCircle,
  RefreshCw,
  Copy,
  Zap,
} from 'lucide-react';

// Initial 7 frontend lessons fallback catalog
const DEFAULT_FRONTEND_LESSONS = [
  {
    id: 'lesson-frontend-1',
    courseId: 'course-frontend-web-1',
    orderIndex: 1,
    title: 'Lesson 1: Introduction to HTML & Web Fundamentals in NSL',
    description: 'Discover what HTML is, how web browsers render pages, and the role of Deaf engineers in tech with certified NSL video instruction and live demonstration. 100% Free Lesson.',
    isFreeBasic1: true,
    muxPlaybackId: '',
    durationMinutes: 12,
  },
  {
    id: 'lesson-frontend-2',
    courseId: 'course-frontend-web-1',
    orderIndex: 2,
    title: 'Lesson 2: Setting up VS Code for Deaf Developers',
    description: 'Step-by-step setup of Visual Studio Code: extensions, live server preview, high-contrast themes, and keyboard shortcuts in NSL.',
    isFreeBasic1: false,
    muxPlaybackId: '',
    durationMinutes: 15,
  },
  {
    id: 'lesson-frontend-3',
    courseId: 'course-frontend-web-1',
    orderIndex: 3,
    title: 'Lesson 3: Your First HTML Page & Boilerplate Structure',
    description: 'Construct your first index.html document. Understand <!DOCTYPE html>, <html>, <head>, and <body> tag architecture in native sign analogies.',
    isFreeBasic1: false,
    muxPlaybackId: '',
    durationMinutes: 14,
  },
  {
    id: 'lesson-frontend-4',
    courseId: 'course-frontend-web-1',
    orderIndex: 4,
    title: 'Lesson 4: HTML Headings (h1 to h6) & Document Hierarchy',
    description: 'Master semantic heading hierarchy in NSL without skipping levels for SEO and screen-reader accessibility.',
    isFreeBasic1: false,
    muxPlaybackId: '',
    durationMinutes: 10,
  },
  {
    id: 'lesson-frontend-5',
    courseId: 'course-frontend-web-1',
    orderIndex: 5,
    title: 'Lesson 5: HTML Paragraphs & Text Formatting in NSL',
    description: 'Structure paragraphs with <p>, emphasize text with <strong> and <em>, and manage line breaks with real-time visual code lab validation.',
    isFreeBasic1: false,
    muxPlaybackId: '',
    durationMinutes: 12,
  },
  {
    id: 'lesson-frontend-6',
    courseId: 'course-frontend-web-1',
    orderIndex: 6,
    title: 'Lesson 6: HTML Links & Interactive Web Navigation',
    description: 'Create internal and external hyperlinks using <a href=""> with target="_blank" and accessible focus indicators.',
    isFreeBasic1: false,
    muxPlaybackId: '',
    durationMinutes: 14,
  },
  {
    id: 'lesson-frontend-7',
    courseId: 'course-frontend-web-1',
    orderIndex: 7,
    title: 'Lesson 7: Adding Images & Accessible Alt Attributes in NSL',
    description: 'Embed images using <img>, set width/height attributes, and craft descriptive alt text for WCAG 2.2 accessibility.',
    isFreeBasic1: false,
    muxPlaybackId: '',
    durationMinutes: 15,
  },
];

// Helper to extract clean Mux playback ID from bare IDs or player URLs
function extractMuxId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  const match = trimmed.match(/(?:player|stream)\.mux\.com\/([a-zA-Z0-9]+)/i);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed.split('?')[0].replace(/[^a-zA-Z0-9_-]/g, '');
}

export default function AdminContentManagementPage() {
  const [activeTrack, setActiveTrack] = useState<'frontend' | 'digital_literacy'>('frontend');
  const [lessons, setLessons] = useState<any[]>(DEFAULT_FRONTEND_LESSONS);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null);

  // Form edit states
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editMuxId, setEditMuxId] = useState('');
  const [editIsFree, setEditIsFree] = useState(false);
  const [editDuration, setEditDuration] = useState(10);

  // Load lessons via Sanity API
  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content/lessons?courseId=course-frontend-web-1');
      if (res.ok) {
        const data = await res.json();
        if (data.lessons && data.lessons.length > 0) {
          // Merge with default list to ensure all 7 are present
          const merged = DEFAULT_FRONTEND_LESSONS.map((def) => {
            const found = data.lessons.find((l: any) => l.id === def.id || l._id === def.id);
            return found ? { ...def, ...found } : def;
          });
          setLessons(merged);
        }
      }
    } catch (e) {
      console.warn('API fetch notice, using fallback lessons:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const openEditModal = (lesson: any) => {
    setSelectedLesson(lesson);
    setEditTitle(lesson.title);
    setEditDesc(lesson.description || '');
    setEditMuxId(lesson.muxPlaybackId || '');
    setEditIsFree(Boolean(lesson.isFreeBasic1));
    setEditDuration(lesson.durationMinutes || 10);
  };

  const closeEditModal = () => {
    setSelectedLesson(null);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLesson) return;

    setSaving(true);
    try {
      const cleanedMux = extractMuxId(editMuxId);
      const payload = {
        id: selectedLesson.id,
        courseId: selectedLesson.courseId || 'course-frontend-web-1',
        title: editTitle,
        description: editDesc,
        muxPlaybackId: cleanedMux,
        isFreeBasic1: editIsFree,
        orderIndex: selectedLesson.orderIndex,
        durationMinutes: Number(editDuration),
      };

      const res = await fetch('/api/admin/content/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update lesson');
      }

      // Update local state immediately
      setLessons((prev) =>
        prev.map((item) => (item.id === selectedLesson.id ? { ...item, ...payload } : item))
      );

      setToastMessage({
        text: data.message || 'Lesson and Mux video stream updated successfully!',
        type: 'success',
      });
      setTimeout(() => setToastMessage(null), 4000);
      closeEditModal();
    } catch (err: any) {
      setToastMessage({
        text: err.message || 'Failed to save lesson changes',
        type: 'error',
      });
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const cleanPreviewId = extractMuxId(editMuxId);

  return (
    <div className="w-full">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold text-white ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600'
                : toastMessage.type === 'error'
                ? 'bg-rose-600'
                : 'bg-teal-700'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Banner / Breadcrumb */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl w-full mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700 shrink-0"
              title="Return to Admin Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Content Management &amp; Video Studio
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-400" />
                  Sanity API Active
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Direct GUI to manage video lessons, Mux player IDs, and Freemium tier permissions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <Link
              href="/student/tracks/deaf-adult"
              target="_blank"
              className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>Preview Student Hub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <a
              href="https://dashboard.mux.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition border border-slate-700 flex items-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5 text-amber-400" />
              <span>Mux Dashboard ↗</span>
            </a>
          </div>
        </div>

        {/* Live Sanity Project Status Bar */}
        <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sanity Connected:
            </span>
            <span>
              Project: <strong className="text-white font-mono">{projectId}</strong>
            </span>
            <span>•</span>
            <span>
              Dataset: <strong className="text-white font-mono">{dataset}</strong>
            </span>
            <span>•</span>
            <span className="text-teal-300">Live Dashboard GUI Mode</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span>Stand-alone Studio: <code className="text-slate-400 font-mono">http://localhost:3333</code></span>
          </div>
        </div>
      </div>

      {/* Main Admin Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Track Selector Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTrack('frontend')}
              className={`py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                activeTrack === 'frontend'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Track 2: Frontend Web Development (7 Lessons)</span>
              <span className="text-[10px] bg-teal-900/60 text-teal-200 px-1.5 py-0.5 rounded">
                Active
              </span>
            </button>

            <button
              onClick={() => setActiveTrack('digital_literacy')}
              className={`py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                activeTrack === 'digital_literacy'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>Track 1: Digital Literacy (Deaf Children)</span>
            </button>
          </div>

          <button
            onClick={fetchLessons}
            disabled={loading}
            className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
            title="Refresh lessons from Sanity API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Tab 1: Frontend Web Development 7 Lessons */}
        {activeTrack === 'frontend' && (
          <div className="space-y-6 animate-fade-in">
            {/* Guide Card */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-black text-amber-900">
                  <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>How Your 7 Frontend Lessons &amp; Freemium Work:</span>
                </div>
                <p className="text-amber-800 leading-relaxed font-medium">
                  <strong>Lesson 1</strong> is marked <em>100% Free</em> so anyone can learn without paying. <strong>Lessons 2 to 7</strong> require the ₦5,000 Selar upgrade. Simply paste your Mux Playback ID below to publish each sign video instantly.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-white text-emerald-800 border border-emerald-300 font-black text-[11px] shadow-2xs">
                  1 Free Lesson
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white text-amber-800 border border-amber-300 font-black text-[11px] shadow-2xs">
                  6 Paid Lessons (₦5,000)
                </span>
              </div>
            </div>

            {/* Lessons List Grid */}
            <div className="grid grid-cols-1 gap-4">
              {lessons.map((lesson) => {
                const hasMux = Boolean(lesson.muxPlaybackId);

                return (
                  <div
                    key={lesson.id}
                    className="p-5 rounded-3xl bg-white border-2 border-slate-200 hover:border-teal-500/60 shadow-xs transition space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0">
                          {lesson.orderIndex}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                              {lesson.title}
                            </h3>

                            {lesson.isFreeBasic1 ? (
                              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                                <Unlock className="w-3 h-3 text-emerald-600" />
                                100% Free Lesson
                              </span>
                            ) : (
                              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                                <Lock className="w-3 h-3 text-amber-600" />
                                Upgrade Required (₦5,000)
                              </span>
                            )}

                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              ~{lesson.durationMinutes || 10} Mins
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                            {lesson.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {hasMux && (
                          <button
                            type="button"
                            onClick={() => setPreviewVideoId(lesson.muxPlaybackId)}
                            className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                            title="Watch live preview"
                          >
                            <Play className="w-3.5 h-3.5 text-teal-700 fill-teal-700" />
                            <span>Preview</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => openEditModal(lesson)}
                          className="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{hasMux ? 'Edit Lesson' : 'Add Mux Video'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Status Ribbon */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-500">Mux Video Stream:</span>
                        {hasMux ? (
                          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                            <Check className="w-3 h-3 text-teal-600" />
                            ID: {lesson.muxPlaybackId}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 font-bold text-[11px] text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            No Mux Video Configured Yet
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/student/lessons/${lesson.id}`}
                          target="_blank"
                          className="text-slate-500 hover:text-teal-700 font-bold text-[11px] flex items-center gap-1 transition"
                        >
                          <span>Open Student Lesson Page</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Digital Literacy Track */}
        {activeTrack === 'digital_literacy' && (
          <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 text-center space-y-4 animate-fade-in">
            <Laptop className="w-12 h-12 text-teal-700 mx-auto" />
            <h3 className="text-xl font-black text-slate-900">
              Track 1: Computer &amp; Digital Literacy for Deaf Children
            </h3>
            <p className="text-slate-600 text-xs max-w-lg mx-auto leading-relaxed">
              5 core lessons (Webcam, Keyboard, Mouse, Monitor, Storybook) are permanently unlocked for every Deaf child under the Free Basic 1 tier.
            </p>
            <div className="pt-2">
              <Link
                href="/student/courses/course-digital-literacy-1"
                target="_blank"
                className="px-5 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm"
              >
                <span>View Digital Literacy Track in Learner View →</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* EDIT LESSON & MUX VIDEO MODAL                                             */}
      {/* ========================================================================= */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Lesson #{selectedLesson.orderIndex} Editor
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Edit Lesson &amp; Mux Video Stream
                </h3>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4">
              {/* Lesson Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Lesson Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-sm text-slate-900"
                  placeholder="E.g., Lesson 1: Introduction to HTML"
                />
              </div>

              {/* Mux Video Playback ID or Player URL */}
              <div className="space-y-2 p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-teal-700" />
                    <span>Mux Video Playback ID or Player URL</span>
                  </label>
                  <a
                    href="https://dashboard.mux.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-teal-800 hover:text-teal-950 font-bold underline flex items-center gap-1"
                  >
                    <span>Get ID from Mux ↗</span>
                  </a>
                </div>

                <input
                  type="text"
                  value={editMuxId}
                  onChange={(e) => setEditMuxId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-teal-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-xs text-slate-900"
                  placeholder="Paste e.g. 5mX7hKk02Z1F... or https://player.mux.com/5mX7hKk02Z1F..."
                />
                <p className="text-[11px] text-teal-800 font-medium">
                  Upload your NSL sign lesson video to Mux, then paste either the bare Playback ID or player URL here.
                </p>

                {/* Instant Video Preview inside the form! */}
                {cleanPreviewId && (
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-900 block">
                      Live Video Stream Preview:
                    </span>
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-700 shadow-md">
                      <iframe
                        src={`https://player.mux.com/${cleanPreviewId}?metadata-video-title=${encodeURIComponent(editTitle)}`}
                        title="Live Mux Preview"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Access Tier (Freemium Toggle) */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Student Access Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditIsFree(true)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col gap-1 ${
                      editIsFree
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs text-emerald-800">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>100% Free Lesson</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Available to all learners without paying (Lesson 1)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditIsFree(false)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col gap-1 ${
                      !editIsFree
                        ? 'border-amber-500 bg-amber-50 text-amber-950'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs text-amber-800">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Requires Upgrade</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Requires ₦5,000 Selar payment to unlock
                    </span>
                  </button>
                </div>
              </div>

              {/* Estimated Duration */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Estimated Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={editDuration}
                  onChange={(e) => setEditDuration(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-sm text-slate-900"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Lesson Overview &amp; Live Demonstration Notes
                </label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs text-slate-900 font-medium leading-relaxed"
                  placeholder="Describe the topics and sign explanations covered in this lesson..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-5 py-3 rounded-xl text-slate-600 hover:text-slate-900 font-bold text-xs transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition flex items-center gap-2 shadow-md disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Sanity API...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save &amp; Sync to Sanity</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIDEO PREVIEW MODAL                                                       */}
      {/* ========================================================================= */}
      {previewVideoId && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-slate-900 rounded-3xl border-2 border-slate-700 shadow-2xl overflow-hidden p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono text-teal-400 font-bold flex items-center gap-1.5">
                <Video className="w-4 h-4 text-teal-400" />
                Mux Playback ID: {previewVideoId}
              </span>
              <button
                type="button"
                onClick={() => setPreviewVideoId(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
              <iframe
                src={`https://player.mux.com/${previewVideoId}?metadata-video-title=NSL+Video+Preview`}
                title="Mux Video Player"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewVideoId(null)}
                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-black text-xs transition"
              >
                Done Previewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
