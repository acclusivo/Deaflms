'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole } from '@/lib/types';
import { StarMeter } from './StarMeter';
import {
  HandMetal,
  BookOpen,
  Laptop,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
  Settings,
  FileCheck2,
} from 'lucide-react';

interface NavbarProps {
  currentRole?: UserRole;
  stars?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole = 'student', stars = 24 }) => {
  const pathname = usePathname();
  const router = useRouter();

  // Determine current active role from URL or prop
  let activeRole: UserRole = currentRole;
  if (pathname.startsWith('/teacher')) activeRole = 'teacher';
  if (pathname.startsWith('/admin')) activeRole = 'admin';
  if (pathname.startsWith('/student')) activeRole = 'student';

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'student') router.push('/student/dashboard');
    if (newRole === 'teacher') router.push('/teacher/dashboard');
    if (newRole === 'admin') router.push('/admin/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition transform">
              <HandMetal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">Deaf<span className="text-indigo-600">LMS</span></span>
                <span className="px-1.5 py-0.5 text-[10px] font-black uppercase bg-indigo-100 text-indigo-700 rounded-md">K-12</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block -mt-0.5">Visual Sign & Tech Learning</span>
            </div>
          </Link>

          {/* Navigation Links according to Active Role */}
          <nav className="hidden md:flex items-center gap-1">
            {activeRole === 'student' && (
              <>
                <Link
                  href="/student/dashboard"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                    pathname === '/student/dashboard'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  My Lessons
                </Link>
                <Link
                  href="/student/digital-literacy"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                    pathname === '/student/digital-literacy'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Laptop className="w-4 h-4" />
                  Computer Skills
                </Link>
                <Link
                  href="/student/storybook/lesson-storybook-1"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                    pathname.includes('/storybook')
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Visual Storybook
                </Link>
              </>
            )}

            {activeRole === 'teacher' && (
              <>
                <Link
                  href="/teacher/dashboard"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                    pathname === '/teacher/dashboard'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Classroom Overview
                </Link>
                <Link
                  href="/teacher/ai-generator"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                    pathname === '/teacher/ai-generator'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  AI Lesson Co-Pilot
                </Link>
                <Link
                  href="/teacher/gradebook"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                    pathname === '/teacher/gradebook'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4" />
                  Gradebook & Progress
                </Link>
              </>
            )}

            {activeRole === 'admin' && (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                    pathname === '/admin/dashboard'
                      ? 'bg-amber-50 text-amber-800 border border-amber-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Platform Metrics
                </Link>
                <Link
                  href="/admin/users"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                    pathname === '/admin/users'
                      ? 'bg-amber-50 text-amber-800 border border-amber-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  User Rosters
                </Link>
                <Link
                  href="/admin/settings"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                    pathname === '/admin/settings'
                      ? 'bg-amber-50 text-amber-800 border border-amber-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  System & Storage
                </Link>
              </>
            )}
          </nav>

          {/* Right Section: Stars & Quick Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Show Star counter in student portal */}
            {activeRole === 'student' && <StarMeter stars={stars} />}

            {/* Role Switcher Pill */}
            <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-2xl">
              <button
                onClick={() => switchRole('student')}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition ${
                  activeRole === 'student'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Switch to Student View"
              >
                Student
              </button>
              <button
                onClick={() => switchRole('teacher')}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition ${
                  activeRole === 'teacher'
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Switch to Teacher View"
              >
                Teacher
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2.5 py-1 text-xs font-bold rounded-xl transition ${
                  activeRole === 'admin'
                    ? 'bg-white text-amber-800 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Switch to Admin View"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
