'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { getPlatformKPIs } from '@/lib/api';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  HardDrive,
  Activity,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await getPlatformKPIs();
      setKpis(data);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentRole="admin" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Admin Banner */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-2 relative z-10">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-amber-100 inline-block">
              School & District Oversight Hub
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Deaf Academy Administration
            </h1>
            <p className="text-amber-100 text-sm sm:text-base">
              Monitor school-wide visual literacy progress, manage educator and student accounts, and oversee Supabase video storage.
            </p>
          </div>
        </div>

        {/* Platform KPI Grid */}
        {kpis && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900">{kpis.totalStudents}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Enrolled Students</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900">{kpis.totalTeachers}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Certified Deaf Educators</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900">{kpis.publishedCourses}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Curriculum Courses Active</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
                <HardDrive className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900">{kpis.storageUsedGb}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Video Storage Allocated</div>
            </div>
          </div>
        )}

        {/* Quick Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/users"
            className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-400 hover:shadow-md transition group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition" />
            </div>
            <h3 className="text-xl font-black text-slate-900">User & Roster Management</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              View all student and teacher accounts, assign portal roles, and review account permissions.
            </p>
          </Link>

          <Link
            href="/admin/courses"
            className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-400 hover:shadow-md transition group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Curriculum Moderation</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Audit reading storybooks and digital literacy courses to ensure DHH accessibility standards.
            </p>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-400 hover:shadow-md transition group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition" />
            </div>
            <h3 className="text-xl font-black text-slate-900">System & AI Diagnostics</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Inspect Supabase database connectivity, Gemini API status, and storage quotas.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
