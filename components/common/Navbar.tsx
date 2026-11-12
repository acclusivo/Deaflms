'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole } from '@/lib/types';
import { StarMeter } from './StarMeter';
import { useAuth } from '@/lib/auth-context';
import {
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
  Layers,
  CreditCard,
  Code,
  Keyboard,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  currentRole?: UserRole;
  stars?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, stars = 24 }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Portal vs Public detection
  const isStudentPortal = pathname.startsWith('/student');
  const isTeacherPortal = pathname.startsWith('/teacher');
  const isAdminPortal = pathname.startsWith('/admin');
  const isDashboard = isStudentPortal || isTeacherPortal || isAdminPortal;

  // Active role for dashboard portals
  let activeRole: UserRole = currentRole || user?.role || 'student';
  if (isTeacherPortal) activeRole = 'teacher';
  if (isAdminPortal) activeRole = 'admin';
  if (isStudentPortal) {
    activeRole = user?.role === 'parent' ? 'parent' : 'student';
  }

  const isParentTrack = user?.role === 'parent' || user?.personaGoal === 'parent';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getDashboardUrl = (role?: UserRole) => {
    if (role === 'teacher') return '/teacher/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/student/dashboard';
  };

  // Portal-specific badge configuration
  const portalConfig = {
    student: {
      homeHref: '/student/dashboard',
      badge: 'Learner',
      badgeClass: 'bg-[#E6F4F6] text-[#065A63] border-[#CCEEF1]',
      avatarBg: 'bg-[#1B4EA7] text-white',
    },
    parent: {
      homeHref: '/student/dashboard',
      badge: 'Parent',
      badgeClass: 'bg-[#EEF2FF] text-[#3847AF] border-[#C7D2FE]',
      avatarBg: 'bg-[#3847AF] text-white',
    },
    teacher: {
      homeHref: '/teacher/dashboard',
      badge: 'Facilitator',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
      avatarBg: 'bg-slate-800 text-white',
    },
    admin: {
      homeHref: '/admin/dashboard',
      badge: 'Admin',
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
      avatarBg: 'bg-amber-800 text-white',
    },
  }[activeRole];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5EAF3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Unified Brand & Logo — strictly DeafLMS */}
          <Link
            href={isDashboard ? portalConfig.homeHref : '/'}
            className="flex items-center gap-2.5 group interactive-target"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900">
                Deaf<span className="text-[#1B4EA7]">LMS</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — Role & Context Aware */}
          <nav className="hidden md:flex items-center gap-1">

            {/* 1. PUBLIC MARKETING NAVIGATION */}
            {!isDashboard && (
              <>
                <Link
                  href="/#courses"
                  className="px-3.5 py-2 rounded-xl font-bold text-sm text-slate-600 hover:text-slate-900 hover:bg-[#F0F4FA] transition interactive-target"
                >
                  Courses
                </Link>
                <Link
                  href="/#how-it-works"
                  className="px-3.5 py-2 rounded-xl font-bold text-sm text-slate-600 hover:text-slate-900 hover:bg-[#F0F4FA] transition interactive-target"
                >
                  How It Works
                </Link>
                <Link
                  href="/pricing"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition interactive-target ${pathname === '/pricing'
                    ? 'bg-[#F0F4FA] text-[#1B4EA7] border border-[#ABB8D7]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-[#F0F4FA]'
                    }`}
                >
                  Pricing
                </Link>
                {/* <Link
                  href="/support"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition interactive-target ${pathname === '/support'
                    ? 'bg-[#F0F4FA] text-[#1B4EA7] border border-[#ABB8D7]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-[#F0F4FA]'
                    }`}
                >
                  Support
                </Link> */}
              </>
            )}

            {/* 2. LEARNER NAVIGATION */}
            {isStudentPortal && !isParentTrack && (
              <>
                {/* <Link
                  href="/student/dashboard"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/student/dashboard'
                      ? 'bg-teal-50 text-teal-900 border border-teal-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <BookOpen className="w-4 h-4 text-teal-700" />
                  <span>Curriculum &amp; Ages</span>
                </Link> */}
                {/* <Link
                  href="/student/tracks/deaf-adult"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${
                    pathname === '/student/tracks/deaf-adult'
                      ? 'bg-teal-50 text-teal-900 border border-teal-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Code className="w-4 h-4 text-teal-700" />
                  <span>Web Dev Lab (18+)</span>
                </Link> */}
                {/* <Link
                  href="/student/tracks/hearing-allies"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${
                    pathname === '/student/tracks/hearing-allies'
                      ? 'bg-teal-50 text-teal-900 border border-teal-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4 text-teal-700" />
                  <span>Conversational Sign</span>
                </Link> */}
                {/* <Link
                  href="/student/digital-literacy"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${
                    pathname === '/student/digital-literacy'
                      ? 'bg-teal-50 text-teal-900 border border-teal-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Laptop className="w-4 h-4 text-teal-700" />
                  <span>Practice</span>
                </Link> */}
                {/* <Link
                  href="/keyboard-trainer"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${
                    pathname === '/keyboard-trainer'
                      ? 'bg-teal-50 text-teal-900 border border-teal-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Keyboard className="w-4 h-4 text-teal-700" />
                  <span>Keyboard</span>
                </Link> */}
                {/* <Link
                  href="/student/payments"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${
                    pathname === '/student/payments'
                      ? 'bg-teal-50 text-teal-900 border border-teal-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-teal-700" />
                  <span>Payments</span>
                </Link> */}
                {/* <Link
                  href="/support"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${
                    pathname === '/support'
                      ? 'bg-teal-50 text-teal-900 border border-teal-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-teal-700" />
                  <span>Help</span>
                </Link> */}
                {/* <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('open-clarify-modal', { detail: {} }));
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl font-bold text-sm text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition flex items-center gap-1.5 interactive-target cursor-pointer"
                  title="Clarify Word with Safe AI"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Tutor</span>
                </button> */}
              </>
            )}

            {/* PARENT VIEW */}
            {isStudentPortal && isParentTrack && (
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
                {/* <Link
                  href="/support"
                  className={`px-3.5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-1.5 interactive-target ${pathname === '/support'
                    ? 'bg-teal-50 text-teal-900 border border-teal-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <span>Support</span>
                </Link> */}
              </>
            )}

            {/* 3. FACILITATOR NAVIGATION */}
            {isTeacherPortal && (
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

            {/* 4. ADMINISTRATOR STATUS INDICATOR (Menu moved to dedicated AdminSidebar) */}
            {isAdminPortal && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Admin Console</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 hidden lg:inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Institutional Mode
                </span>
              </div>
            )}
          </nav>

          {/* Right Section: Stars + User Session / Sign In + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isStudentPortal && <StarMeter stars={user?.totalStars ?? stars} />}

            {user ? (
              <div className="flex items-center gap-2 pl-1">
                {/* When on public pages and user is logged in, show direct link to their portal */}
                {!isDashboard && (
                  <Link
                    href={getDashboardUrl(user.role)}
                    className="hidden sm:flex px-3 py-1.5 rounded-xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-bold text-xs items-center gap-1.5 transition shadow-xs"
                  >
                    <span>My Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}

                <Link
                  href="/profile"
                  className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center ${portalConfig.avatarBg} shrink-0 hover:ring-2 hover:ring-[#1B4EA7] transition cursor-pointer interactive-target`}
                  title={`Profile & Baseline Settings (${user.displayName || user.email})`}
                >
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition interactive-target border border-transparent hover:border-rose-200 cursor-pointer"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#1B4EA7] hover:text-[#00177D] hover:bg-[#F0F4FA] transition flex items-center gap-1.5 interactive-target"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                {!isDashboard && (
                  <Link
                    href="/#courses"
                    className="hidden sm:inline-flex px-4 py-3 rounded-x bg-[#1B4EA7] hover:bg-[#00177D] text-white text-xs font-bold transition shadow-xs"
                  >
                    Explore Courses
                  </Link>
                )}
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition interactive-target"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 animate-fade-in space-y-1">
            {!isDashboard && (
              <>
                <Link
                  href="/#courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  Courses
                </Link>
                <Link
                  href="/#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  How It Works
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  Pricing
                </Link>
                {/* <Link
                  href="/keyboard-trainer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  Keyboard Trainer
                </Link> */}
                {/* <Link
                  href="/support"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  Support
                </Link> */}
                {user && (
                  <Link
                    href={getDashboardUrl(user.role)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-teal-800 bg-teal-50"
                  >
                    Go to Portal Dashboard
                  </Link>
                )}
              </>
            )}

            {user && (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-teal-900 bg-teal-50 border border-teal-200"
              >
                Profile
              </Link>
            )}

            {isStudentPortal && (
              <>
                <Link
                  href="/student/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  Curriculum &amp; Ages
                </Link>
                <Link
                  href="/student/tracks/deaf-adult"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  Web Dev Lab (18+)
                </Link>
                <Link
                  href="/student/tracks/hearing-allies"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  Conversational Sign
                </Link>
                <Link
                  href="/student/digital-literacy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  Practice
                </Link>
                <Link
                  href="/keyboard-trainer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  Keyboard Trainer
                </Link>
                <Link
                  href="/student/payments"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  Payments
                </Link>
                <Link
                  href="/support"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  Help &amp; Support
                </Link>
              </>
            )}

            {isTeacherPortal && (
              <>
                <Link
                  href="/teacher/gradebook"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  Learners
                </Link>
                <Link
                  href="/teacher/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  Live Requests
                </Link>
                <Link
                  href="/teacher/vocabulary/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  Upload Content
                </Link>
                <Link
                  href="/facilitator-results"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  Reports
                </Link>
              </>
            )}

            {isAdminPortal && (
              <>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100"
                >
                  Admin Home &amp; Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl font-bold text-sm text-amber-900 bg-amber-50 border border-amber-200"
                >
                  Admin Profile &amp; Account
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
