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
  Users,
  Settings,
  FileCheck2,
  LogIn,
  LogOut,
  PlusCircle,
  HelpCircle,
  Award,
  Activity,
  Heart,
  Sparkles,
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

  const isParentTrack = user?.personaGoal === 'parent';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Portal-specific branding configuration (DeafLMS green / calm palette)
  const portalConfig = {
    student: {
      homeHref: '/student/dashboard',
      badge: 'Learner Portal',
      badgeClass: 'bg-teal-50 text-teal-900 border-teal-200',
      subtitle: 'Visual Sign & Practice',
      roleTag: 'Student Learner',
      roleClass: 'text-teal-800 bg-teal-50 border-teal-200',
      avatarBg: 'bg-teal-700 text-white',
    },
    teacher: {
      homeHref: '/teacher/dashboard',
      badge: 'Facilitator Studio',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
      subtitle: 'Educator & Review Portal',
      roleTag: 'Facilitator',
      roleClass: 'text-slate-800 bg-slate-100 border-slate-300',
      avatarBg: 'bg-slate-800 text-white',
    },
    admin: {
      homeHref: '/admin/dashboard',
      badge: 'Admin Console',
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
      subtitle: 'Institutional Oversight',
      roleTag: 'Administrator',
      roleClass: 'text-amber-800 bg-amber-50 border-amber-300',
      avatarBg: 'bg-amber-800 text-white',
    },
  }[activeRole];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Portal Brand & Logo */}
          <Link href={portalConfig.homeHref} className="flex items-center gap-2.5 group interactive-target">
            {/* <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white transition group-hover:bg-teal-800">
              <HandMetal className="w-5 h-5" />
            </div> */}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Deaf<span className="text-teal-700">LMS</span>
                </span>
                {/* <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-md border ${portalConfig.badgeClass}`}>
                  {portalConfig.badge}
                </span> */}
              </div>
              {/* <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block -mt-0.5">
                {portalConfig.subtitle}
              </span> */}
            </div>
          </Link>

          {/* Navigation Links — Role-Based, direct, no clutter */}
          <nav className="hidden md:flex items-center gap-1">

            {/* 1. Learner / Parent Navigation */}
            {activeRole === 'student' && !isParentTrack && (
              <>
                <Link
                  href="/student/dashboard"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/student/dashboard'
                    ? 'bg-teal-50 text-teal-900 border border-teal-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <BookOpen className="w-4 h-4 text-teal-700" />
                  <span>Lessons</span>
                </Link>
                <Link
                  href="/student/digital-literacy"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/student/digital-literacy'
                    ? 'bg-teal-50 text-teal-900 border border-teal-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <Laptop className="w-4 h-4 text-teal-700" />
                  <span>Practice</span>
                </Link>
                <Link
                  href="/keyboard-trainer"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/keyboard-trainer'
                    ? 'bg-teal-50 text-teal-900 border border-teal-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <Award className="w-4 h-4 text-teal-700" />
                  <span>Progress</span>
                </Link>
                <Link
                  href="/support"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/support'
                    ? 'bg-teal-50 text-teal-900 border border-teal-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <HelpCircle className="w-4 h-4 text-teal-700" />
                  <span>Help</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('open-clarify-modal', { detail: {} }));
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl font-bold text-sm text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition flex items-center gap-1.5 interactive-target"
                  title="Clarify Word with Safe AI"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Clarification</span>
                </button>
              </>
            )}

            {/* Parent View Navigation */}
            {activeRole === 'student' && isParentTrack && (
              <>
                <Link
                  href="/student/dashboard"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/student/dashboard'
                    ? 'bg-teal-50 text-teal-900 border border-teal-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <Award className="w-4 h-4 text-teal-700" />
                  <span>Child’s Progress</span>
                </Link>
                <Link
                  href="/student/digital-literacy"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/student/digital-literacy'
                    ? 'bg-teal-50 text-teal-900 border border-teal-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <Activity className="w-4 h-4 text-teal-700" />
                  <span>Activity</span>
                </Link>
                <Link
                  href="/support"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/support'
                    ? 'bg-teal-50 text-teal-900 border border-teal-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <Heart className="w-4 h-4 text-teal-700" />
                  <span>Support</span>
                </Link>
              </>
            )}

            {/* 2. Facilitator Navigation */}
            {activeRole === 'teacher' && (
              <>
                <Link
                  href="/teacher/gradebook"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/teacher/gradebook'
                    ? 'bg-slate-100 text-slate-900 border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <Users className="w-4 h-4 text-slate-700" />
                  <span>Learners</span>
                </Link>
                <Link
                  href="/teacher/dashboard"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/teacher/dashboard'
                    ? 'bg-slate-100 text-slate-900 border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <HelpCircle className="w-4 h-4 text-amber-700" />
                  <span>Live Requests</span>
                </Link>
                <Link
                  href="/teacher/dashboard#lessons"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname.includes('/courses')
                    ? 'bg-slate-100 text-slate-900 border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <BookOpen className="w-4 h-4 text-slate-700" />
                  <span>Lessons</span>
                </Link>
                <Link
                  href="/teacher/vocabulary/new"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/teacher/vocabulary/new'
                    ? 'bg-teal-50 text-teal-900 border border-teal-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <PlusCircle className="w-4 h-4 text-teal-700" />
                  <span>Upload Content</span>
                </Link>
                <Link
                  href="/facilitator-results"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/facilitator-results'
                    ? 'bg-slate-100 text-slate-900 border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <FileCheck2 className="w-4 h-4 text-slate-700" />
                  <span>Reports</span>
                </Link>
              </>
            )}

            {/* 3. Administrator Navigation */}
            {activeRole === 'admin' && (
              <>
                <Link
                  href="/admin/users"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/admin/users'
                    ? 'bg-amber-50 text-amber-900 border border-amber-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <Users className="w-4 h-4 text-amber-800" />
                  <span>Users</span>
                </Link>
                <Link
                  href="/admin/users"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/admin/users'
                    ? 'bg-amber-50 text-amber-900 border border-amber-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <GraduationCap className="w-4 h-4 text-amber-800" />
                  <span>Facilitators</span>
                </Link>
                <Link
                  href="/admin/courses"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/admin/courses'
                    ? 'bg-amber-50 text-amber-900 border border-amber-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <BookOpen className="w-4 h-4 text-amber-800" />
                  <span>Content Review</span>
                </Link>
                <Link
                  href="/admin/dashboard"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/admin/dashboard'
                    ? 'bg-amber-50 text-amber-900 border border-amber-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-800" />
                  <span>Institutions</span>
                </Link>
                <Link
                  href="/user-testing"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/user-testing'
                    ? 'bg-amber-50 text-amber-900 border border-amber-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Safeguarding</span>
                </Link>
                <Link
                  href="/admin/settings"
                  className={`px-3 py-1.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/admin/settings'
                    ? 'bg-amber-50 text-amber-900 border border-amber-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <Settings className="w-4 h-4 text-amber-800" />
                  <span>Settings</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Section: Stars (Student only) + User Info & Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3">
            {activeRole === 'student' && <StarMeter stars={user?.totalStars ?? stars} />}

            {user ? (
              <div className="flex items-center gap-2 pl-1">
                <div className="hidden sm:flex flex-col text-right">
                  {/* <span className="text-xs font-black text-slate-900 line-clamp-1 max-w-[140px]">
                    {user.displayName}
                  </span> */}
                  {/* <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border inline-block self-end ${portalConfig.roleClass}`}>
                    {portalConfig.roleTag}
                  </span> */}
                </div>

                <div
                  className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center ${portalConfig.avatarBg}`}
                  title={`Signed in as ${user.displayName}`}
                >
                  {user.displayName.charAt(0).toUpperCase()}
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition interactive-target border border-transparent hover:border-rose-200"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 transition interactive-target"
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
