'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import {
  getCourses,
  getLearnerHelpRequests,
  resolveLearnerHelpRequest,
  getVocabularyContentList,
} from '@/lib/api';
import { Course, LearnerHelpRequest, VocabularyContent } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { LearnerPreviewModal } from '@/components/teacher/LearnerPreviewModal';
import {
  Plus,
  Sparkles,
  BookOpen,
  Users,
  CheckCircle2,
  HardDrive,
  FileCheck2,
  ArrowRight,
  Laptop,
  Camera,
  Award,
  HelpCircle,
  Video,
  Check,
  Calendar,
  PhoneCall,
  Eye,
  ShieldCheck,
  AlertCircle,
  Layers,
  Clock,
  ExternalLink,
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [helpRequests, setHelpRequests] = useState<LearnerHelpRequest[]>([]);
  const [vocabularyList, setVocabularyList] = useState<VocabularyContent[]>([]);

  // Preview Modal State
  const [previewItem, setPreviewItem] = useState<Partial<VocabularyContent> | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Supervised Session Meeting Link Modal
  const [activeSessionModalRequest, setActiveSessionModalRequest] = useState<LearnerHelpRequest | null>(null);
  const [selectedMeetingTool, setSelectedMeetingTool] = useState<string>('deaflms_planned');

  useEffect(() => {
    async function loadData() {
      const [coursesData, requestsData, vocabData] = await Promise.all([
        getCourses(),
        getLearnerHelpRequests(),
        getVocabularyContentList(),
      ]);
      setCourses(coursesData);
      setHelpRequests(requestsData);
      setVocabularyList(vocabData);
    }
    loadData();
  }, []);

  const handleResolveRequest = async (id: string) => {
    await resolveLearnerHelpRequest(id, 'Resolved by teacher in studio.');
    const updated = await getLearnerHelpRequests();
    setHelpRequests(updated);
  };

  const handleOpenPreview = (item: VocabularyContent) => {
    setPreviewItem(item);
    setIsPreviewModalOpen(true);
  };

  const dialectNames: Record<string, { name: string; curriculum: string }> = {
    NSL: {
      name: 'Nigerian Sign Language (NSL)',
      curriculum: 'Proposed future curriculum alignment (Nigeria)',
    },
    KRSL: {
      name: 'Korean Sign Language (한국수어)',
      curriculum: 'South Korea National Special Education & KSL Act (한국수어법) Standards',
    },
    ASL: {
      name: 'American Sign Language (Global)',
      curriculum: 'Universal K-12 Deaf STEM & Literacy Standards',
    },
  };

  const currentDialect = (user?.signLanguage as string) || 'NSL';
  const dialectInfo = dialectNames[currentDialect] || dialectNames['NSL'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-700 selection:text-white">
      <Navbar currentRole="teacher" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Welcome Header — Personalized to Educator */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-sm">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 border border-teal-200">
                <span>{dialectInfo.name}</span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block border border-emerald-200">
                Facilitator Studio Lead
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome, {user?.displayName || 'Facilitator'}
            </h1>

            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Manage your cohort&apos;s learning journey, review supervised help requests, and author verified Nigerian Sign Language vocabulary without editing source code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/teacher/vocabulary/new"
              className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm shadow-md shadow-teal-200 transition interactive-target"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vocabulary</span>
            </Link>

            <Link
              href="/teacher/courses/new"
              className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-sm border-2 border-slate-300 transition interactive-target shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-teal-700" />
              <span>New Course</span>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* P1: LEARNERS NEEDING HELP QUEUE */}
        {/* Lesson, word, difficulty, attempts, show me viewed, approval, and status */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  Learners Needing Help Queue
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Live assistance requests from learners practicing with visual lessons. Child identity safeguarded.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase">
              {helpRequests.filter((r) => r.status === 'waiting_for_facilitator').length} Pending Requests
            </span>
          </div>

          {/* Queue Items List */}
          <div className="space-y-4">
            {helpRequests.map((req) => (
              <div
                key={req.id}
                className={`p-5 rounded-2xl border-2 transition space-y-4 ${
                  req.status === 'waiting_for_facilitator'
                    ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-100'
                    : 'bg-slate-50 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black text-slate-900">
                        {req.learnerName}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-900 text-[11px] font-black uppercase">
                        Lesson: {req.lessonTitle} • Word: {req.word}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[11px] font-black flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{req.approvalStatus.replace('_', ' ').toUpperCase()}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 pt-1">
                      <div>
                        <strong>Difficulty:</strong> <span className="capitalize">{req.difficultyStage}</span>
                      </div>
                      <div>
                        <strong>Attempts:</strong> {req.attemptsCount}
                      </div>
                      <div>
                        <strong>Show Me Viewed:</strong> {req.showMeViewed ? 'Yes ✓' : 'No'}
                      </div>
                      <div>
                        <strong>Status:</strong>{' '}
                        <span className={`font-black ${req.status === 'resolved' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {req.status === 'resolved' ? 'Resolved ✓' : 'Waiting for Facilitator'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 font-medium italic pt-1">
                      &ldquo;{req.difficultyDescription}&rdquo;
                    </p>
                  </div>

                  {/* Actions for Facilitator */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Link
                      href={`/demo?pitch=true`}
                      className="px-3.5 py-2 rounded-xl bg-white border border-teal-300 text-teal-800 hover:bg-teal-50 text-xs font-bold transition interactive-target flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Show Me Story</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setActiveSessionModalRequest(req)}
                      className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-black transition interactive-target flex items-center gap-1.5 shadow-sm"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Connect Supervised Session</span>
                    </button>

                    {req.status !== 'resolved' && (
                      <button
                        type="button"
                        onClick={() => handleResolveRequest(req.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-black transition interactive-target flex items-center gap-1.5 border border-emerald-300"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* APPROVED VOCABULARY BANK (WITH VERSIONING & REGIONAL VARIANTS) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Approved Vocabulary Content Catalog
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Deaf educators create, sign and review. Only approved versions are published to children.
              </p>
            </div>

            <Link
              href="/teacher/vocabulary/new"
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition interactive-target flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Vocabulary Item</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-black uppercase text-[10px]">
                  <th className="py-3 px-3">Word</th>
                  <th className="py-3 px-3">Language &amp; Region</th>
                  <th className="py-3 px-3">Version</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Reviewed By</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {vocabularyList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <img src={item.pictureUrl} alt={item.word} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <strong className="font-black text-slate-900 text-sm block">{item.word}</strong>
                          <span className="text-[10px] text-slate-400">{item.fingerspelling}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-800 block">{item.signLanguage}</span>
                      <span className="text-[10px] text-teal-800 font-semibold">{item.localVariant || item.region}</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-black text-[11px]">
                        v{item.version}.0
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-[10px] uppercase border border-emerald-200">
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-500">
                      {item.approvedBy || 'Acclusivo Deaf Review Team'}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleOpenPreview(item)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition interactive-target inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview as Learner</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Assigned Curriculum Courses */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Your Assigned Curriculum Courses</h2>
            <span className="text-xs font-bold text-slate-500">Showing {courses.length} courses</span>
          </div>

          <div className="divide-y divide-slate-100">
            {courses.map((course) => (
              <div key={course.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center font-black text-teal-700 shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm sm:text-base">{course.title}</h3>
                    <p className="text-xs text-slate-500">Grade {course.gradeLevel} • {course.lessonsCount} Video Lessons</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/teacher/gradebook"
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                  >
                    View Cohort Progress
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Supervised Session Meeting Tool Modal */}
      {activeSessionModalRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border-2 border-teal-300 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Supervised Video Support
                </h3>
              </div>
              <button
                onClick={() => setActiveSessionModalRequest(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-500">Learner:</span>
              <p className="font-black text-slate-900 text-sm">
                {activeSessionModalRequest.learnerName} (Lesson: {activeSessionModalRequest.word})
              </p>
              <span className="text-emerald-700 font-bold block pt-1">
                Parent approval verified on device • Safe 1-on-1 supervised check-in
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-black uppercase text-slate-700 block">Choose Platform:</label>
              {[
                { id: 'deaflms_planned', label: 'DeafLMS Video Support (Planned)', badge: 'Integrated' },
                { id: 'zoom_guest', label: 'Zoom Guest Link (One-Time)', badge: 'Safe Guest' },
                { id: 'meet_guest', label: 'Google Meet Guest Link', badge: 'Safe Guest' },
                { id: 'whatsapp_parent', label: 'WhatsApp Through Parent Phone', badge: 'Parent Supervised' },
              ].map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setSelectedMeetingTool(tool.id)}
                  className={`w-full p-3 rounded-xl border-2 text-left flex items-center justify-between transition ${
                    selectedMeetingTool === tool.id
                      ? 'border-teal-700 bg-teal-50 text-teal-950 font-black'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{tool.label}</span>
                  <span className="text-[10px] font-bold text-slate-500">{tool.badge}</span>
                </button>
              ))}
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-medium leading-relaxed">
              DeafLMS safeguards children: No permanent public call links or child contact info is stored.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveSessionModalRequest(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleResolveRequest(activeSessionModalRequest.id);
                  setActiveSessionModalRequest(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-700 text-white font-black text-xs hover:bg-teal-800"
              >
                Launch &amp; Mark Session Started
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Learner Preview Modal */}
      {previewItem && (
        <LearnerPreviewModal
          content={previewItem}
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
        />
      )}
    </div>
  );
}
