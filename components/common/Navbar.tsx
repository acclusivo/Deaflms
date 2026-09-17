'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole } from '@/lib/types';
import { StarMeter } from './StarMeter';
import { useAuth } from '@/lib/auth-context';
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
  LogIn,
  LogOut,
  PlusCircle,
} from 'lucide-react';

interface NavbarProps {
  currentRole?: UserRole;
  stars?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, stars = 24 }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Determine active portal role: prioritize authenticated user role, then pathname/prop
  let activeRole: UserRole = user?.role || currentRole || 'student';
  if (pathname.startsWith('/teacher')) activeRole = 'teacher';
  if (pathname.startsWith('/admin')) activeRole = 'admin';
  if (pathname.startsWith('/student')) activeRole = 'student';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Portal-specific branding configuration
  const portalConfig = {
    student: {
      homeHref: '/student/dashboard',
      badge: 'Learner Portal',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      subtitle: 'Visual Sign & Tech Learning',
      roleTag: '🎓 Student Learner',
      roleClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      avatarBg: 'bg-emerald-600 text-white',
    },
    teacher: {
      homeHref: '/teacher/dashboard',
      badge: 'Facilitator Studio',
      badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      subtitle: 'Educator & Curriculum Portal',
      roleTag: '👨‍🏫 Certified Facilitator',
      roleClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      avatarBg: 'bg-indigo-600 text-white',
    },
    admin: {
      homeHref: '/admin/dashboard',
      badge: 'Admin Console',
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
      subtitle: 'Institutional Oversight',
      roleTag: '🛡️ Administrator',
      roleClass: 'text-amber-800 bg-amber-50 border-amber-300',
      avatarBg: 'bg-amber-700 text-white',
    },
  }[activeRole];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Portal Brand & Logo — Links strictly to current portal's home */}
          <Link href={portalConfig.homeHref} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition transform">
              <HandMetal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Deaf<span className="text-indigo-600">LMS</span>
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-md border ${portalConfig.badgeClass}`}>
                  {portalConfig.badge}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block -mt-0.5">
                {portalConfig.subtitle}
              </span>
            </div>
          </Link>

          {/* Navigation Links — Strictly isolated per active portal role */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Student Navigation */}
            {activeRole === 'student' && (
              <>
                <Link
                  href="/student/dashboard"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                    pathname === '/student/dashboard'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
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
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
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
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Visual Storybook
                </Link>
              </>
            )}

            {/* Facilitator Navigation */}
            {activeRole === 'teacher' && (
              <>
                <Link
                  href="/teacher/dashboard"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                    pathname === '/teacher/dashboard'
                      ? 'bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Facilitator Studio
                </Link>
                <Link
                  href="/teacher/ai-generator"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                    pathname === '/teacher/ai-generator'
                      ? 'bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-xs'
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
                      ? 'bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4" />
                  Gradebook &amp; Progress
                </Link>
                <Link
                  href="/teacher/courses/new"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                    pathname === '/teacher/courses/new'
                      ? 'bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Create Lesson
                </Link>
              </>
            )}

            {/* Administrator Navigation */}
            {activeRole === 'admin' && (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                    pathname === '/admin/dashboard'
                      ? 'bg-amber-50 text-amber-900 border border-amber-300 shadow-xs'
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
                      ? 'bg-amber-50 text-amber-900 border border-amber-300 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  User Rosters
                </Link>
                <Link
                  href="/admin/courses"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                    pathname === '/admin/courses'
                      ? 'bg-amber-50 text-amber-900 border border-amber-300 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Curriculum Standards
                </Link>
                <Link
                  href="/admin/settings"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 ${
                    pathname === '/admin/settings'
                      ? 'bg-amber-50 text-amber-900 border border-amber-300 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  System &amp; Storage
                </Link>
              </>
            )}
          </nav>

          {/* Right Section: Stars (Student only) + Isolated User Info & Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Show Star counter in student portal */}
            {activeRole === 'student' && <StarMeter stars={user?.totalStars ?? stars} />}

            {/* Authenticated User Profile Badge & Logout (Strictly Isolated, No Role Switcher) */}
            {user ? (
              <div className="flex items-center gap-2 pl-1">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-black text-slate-900 line-clamp-1 max-w-[140px]">
                    {user.displayName}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border inline-block self-end ${portalConfig.roleClass}`}>
                    {portalConfig.roleTag}
                  </span>
                </div>

                <div
                  className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center shadow-xs ${portalConfig.avatarBg}`}
                  title={`Signed in to ${portalConfig.badge} as ${user.displayName}`}
                >
                  {user.displayName.charAt(0).toUpperCase()}
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition interactive-target border border-transparent hover:border-rose-200"
                  title="Sign Out of Portal"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition interactive-target"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
