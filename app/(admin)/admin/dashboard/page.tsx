'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { getPlatformKPIs } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
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
  Globe,
  Award,
  Settings,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
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
        {/* Admin Banner — Personalized to Institutional Administrator */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-2.5 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-amber-100 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                Institutional Oversight Hub
              </span>
              <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 rounded-md text-[10px] font-black uppercase">
                Super Admin
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Welcome, {user?.displayName || 'Dr. Patricia Okon'}
            </h1>

            <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
              Deaf LMS pan-African &amp; global institutional cockpit. Monitor district student engagement, approve certified deaf educators, and oversee cross-dialect curricula.
            </p>
          </div>
        </div>

        {/* Multi-Dialect Regional Reach Banner */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Pan-African &amp; Global Dialect Deployment</h3>
                <p className="text-xs text-slate-500 font-medium">Active visual education reach across partner countries</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              ● 1 Priority Track Active (Nigeria 🇳🇬 NSL)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { flag: '🇳🇬', code: 'NSL', name: 'Nigeria', status: 'Priority 1 (Active)', share: '100%', active: true },
              { flag: '🇰🇷', code: 'KRSL', name: 'South Korea', status: '🔒 Phase 2 Rollout', share: 'Pipeline', active: false },
              { flag: '🇰🇪', code: 'KSL', name: 'Kenya', status: '🔒 Q2 Expansion', share: 'Pipeline', active: false },
              { flag: '🇿🇦', code: 'SASL', name: 'South Africa', status: '🔒 Q2 Expansion', share: 'Pipeline', active: false },
              { flag: '🇬🇭', code: 'GSL', name: 'Ghana', status: '🔒 Q3 Expansion', share: 'Pipeline', active: false },
              { flag: '🌐', code: 'ASL', name: 'Global ASL', status: '🔒 Q3 Expansion', share: 'Pipeline', active: false },
              { flag: '🇬🇧', code: 'BSL', name: 'UK Partner', status: '🔒 Q4 Expansion', share: 'Pipeline', active: false },
              { flag: '🌍', code: 'IS', name: 'Intl Sign', status: '🔒 Summit Pack', share: 'Pipeline', active: false },
            ].map((d) => (
              <div
                key={d.code}
                className={`p-3 rounded-2xl border text-center space-y-1 ${
                  d.active
                    ? 'bg-white border-indigo-400 shadow-md ring-2 ring-indigo-100'
                    : 'bg-slate-50/80 border-dashed border-slate-300 opacity-60'
                }`}
              >
                <div className="text-2xl">{d.flag}</div>
                <div className="font-black text-xs text-slate-900">{d.code}</div>
                <div className="text-[10px] text-slate-500">{d.name}</div>
                <div className={`text-[10px] font-black ${d.active ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {d.status}
                </div>
              </div>
            ))}
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
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                Total Enrolled Students
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900">{kpis.totalTeachers}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                Certified Deaf Educators
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900">{kpis.publishedCourses}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                Curriculum Courses Active
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
                <HardDrive className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900">{kpis.storageUsedGb}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                Video Storage Allocated
              </div>
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
            <h3 className="text-xl font-black text-slate-900">User &amp; Roster Management</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Assign roles, approve certified deaf educators, and oversee student grade-cohort groupings.
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
            <h3 className="text-xl font-black text-slate-900">Curriculum Standards &amp; Moderation</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Audit published courses for DHH accessibility compliance, WCAG AAA contrast, and Nigerian sign accuracy.
            </p>
          </Link>

          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-400 hover:shadow-md transition group space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <HardDrive className="w-6 h-6" />
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Supabase Storage Health</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              100% operational with low-latency CDN streaming across West &amp; East Africa.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
