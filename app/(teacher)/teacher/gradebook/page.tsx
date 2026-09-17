'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentRole="teacher" />

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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Grade Level</th>
                  <th className="py-4 px-6">Hardware & Tech Matching</th>
                  <th className="py-4 px-6">Sign-to-Text Reading</th>
                  <th className="py-4 px-6">Total Stars</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={student.avatarUrl}
                        alt={student.displayName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="text-slate-900 font-extrabold">{student.displayName}</div>
                        <div className="text-xs text-slate-400">{student.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{student.gradeLevel || 'Grade 3'}</td>
                    <td className="py-4 px-6">
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs font-black">
                        100% (40/40)
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 text-xs font-black">
                        90% (27/30)
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-amber-600 font-black">
                        <Star className="w-4 h-4 fill-current" />
                        {student.totalStars || 24}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    </td>
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
