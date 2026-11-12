'use client';

import React, { useState, useEffect } from 'react';
import { getAllUsers, getStudentProgress } from '@/lib/api';
import { UserProfile, StudentProgress } from '@/lib/types';
import { FileCheck2, Star, CheckCircle2, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TeacherGradebookPage() {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [progressRecords, setProgressRecords] = useState<StudentProgress[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const users = await getAllUsers();
      setStudents(users.filter((u) => u.role === 'student'));
      const prog = await getStudentProgress();
      setProgressRecords(prog);
    }
    load();
  }, []);

  const filteredStudents = students.filter((s) =>
    s.displayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/teacher/dashboard"
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 transition shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Classroom Gradebook & Progress
              </h1>
              <p className="text-xs text-slate-500 font-bold">
                Review student completion, accuracy rates, and stars earned in sign exercises.
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name..."
              className="w-full bg-white border-2 border-slate-200 rounded-2xl py-2 pl-9 pr-4 text-xs font-bold text-slate-900 focus:border-indigo-600 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Gradebook Table */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-black text-slate-800">No Enrolled Students Found</h3>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                When students register and complete practice exercises in Nigerian Sign Language, their progress and grades will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-4 px-6">Student</th>
                    <th className="py-4 px-6">Age Segment</th>
                    <th className="py-4 px-6">Education Stage</th>
                    <th className="py-4 px-6">Total Stars</th>
                    <th className="py-4 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold">
                  {filteredStudents.map((student) => {
                    const studentProg = progressRecords.filter((p) => p.studentId === student.id);
                    const completedCount = studentProg.filter((p) => p.completed).length;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 px-6 flex items-center gap-3">
                          <img
                            src={student.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'}
                            alt={student.displayName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="text-slate-900 font-extrabold">{student.displayName}</div>
                            <div className="text-xs text-slate-400">{student.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-700">
                          <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-black">
                            {student.ageSegment || '9-12'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-600 uppercase text-xs font-extrabold">
                          {student.educationStage ? student.educationStage.replace(/_/g, ' ') : student.gradeLevel || 'Active'}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 text-amber-600 font-black">
                            <Star className="w-4 h-4 fill-current" />
                            {student.totalStars || 0}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
