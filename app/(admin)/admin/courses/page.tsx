'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCourses } from '@/lib/api';
import { Course } from '@/lib/types';
import { ArrowLeft, BookOpen, CheckCircle2, ShieldCheck, Eye, Layers } from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getCourses();
      setCourses(data);
    }
    load();
  }, []);

  return (
    <div className="w-full">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 transition shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Curriculum Standards &amp; Courses
              </h1>
              <p className="text-xs text-slate-500 font-bold">
                Review published courses across Child, Adult, and Hearing tracks.
              </p>
            </div>
          </div>

          <Link
            href="/admin/content"
            className="px-5 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs shadow-md shadow-teal-700/20 transition interactive-target flex items-center gap-2 self-start sm:self-auto"
          >
            <Layers className="w-4 h-4" />
            <span>Open Sanity Studio →</span>
          </Link>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-4 px-6">Course Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Grade</th>
                  <th className="py-4 px-6">Educator</th>
                  <th className="py-4 px-6">Accessibility Audit</th>
                  <th className="py-4 px-6 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-slate-900">{course.title}</div>
                      <div className="text-xs text-slate-400 line-clamp-1">{course.description}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-black px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
                        {course.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{course.gradeLevel}</td>
                    <td className="py-4 px-6 text-slate-700">{course.teacherName || 'Facilitator — Sample Account'}</td>
                    <td className="py-4 px-6">
                      {/* <span className="inline-flex items-center gap-1 text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Designed toward AA
                      </span> */}
                    </td>
                    {/* <td className="py-4 px-6 text-right">
                      <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-xl text-xs font-black">
                        Approved
                      </span>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
