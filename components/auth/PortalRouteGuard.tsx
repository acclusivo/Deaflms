'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';
import {
  ShieldAlert,
  ArrowRight,
  LogOut,
  Loader2,
  Lock,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface PortalRouteGuardProps {
  allowedRole: UserRole;
  children: React.ReactNode;
}

export const PortalRouteGuard: React.FC<PortalRouteGuardProps> = ({
  allowedRole,
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, pathname, router]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 p-8 rounded-3xl bg-white border border-slate-200 shadow-lg text-center max-w-sm w-full">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center animate-pulse">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <h2 className="text-base font-black text-slate-900">Verifying Portal Access</h2>
          <p className="text-xs text-slate-500 font-medium">
            Checking role credentials for secure portal isolation...
          </p>
        </div>
      </div>
    );
  }

  // Unauthenticated State
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-slate-900">Sign In Required</h1>
            <p className="text-xs text-slate-500 font-medium">
              You must be logged in to access this portal. Redirecting to login...
            </p>
          </div>
          <button
            onClick={() => router.push(`/login?redirect=${encodeURIComponent(pathname)}`)}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Unauthorized / Role Mismatch State (Strict Portal Isolation)
  if (user.role !== allowedRole) {
    const roleLabels: Record<UserRole, { name: string; portal: string; icon: React.ReactNode; color: string; path: string }> = {
      student: {
        name: 'Student Learner',
        portal: 'Student Learner Portal',
        icon: <GraduationCap className="w-4 h-4 text-emerald-600" />,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        path: '/student/dashboard',
      },
      teacher: {
        name: 'Facilitator / Educator',
        portal: 'Facilitator Studio',
        icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
        color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
        path: '/teacher/dashboard',
      },
      admin: {
        name: 'Administrator',
        portal: 'Admin Console',
        icon: <ShieldCheck className="w-4 h-4 text-amber-700" />,
        color: 'text-amber-800 bg-amber-50 border-amber-200',
        path: '/admin/dashboard',
      },
    };

    const currentRoleInfo = roleLabels[user.role] || roleLabels.student;
    const requiredRoleInfo = roleLabels[allowedRole] || roleLabels.student;

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 selection:bg-rose-500 selection:text-white">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border-2 border-rose-200 shadow-2xl text-center space-y-6 animate-fade-in">
          
          {/* Top Restricted Badge & Shield */}
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center shadow-inner">
            <ShieldAlert className="w-10 h-10" />
            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
              ✕
            </span>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-black uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Portal Access Restricted</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Access Denied to this Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Student, Facilitator, and Admin portals are strictly isolated. Your current account does not have permission to access the <strong>{requiredRoleInfo.portal}</strong>.
            </p>
          </div>

          {/* Role Comparison Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="font-bold text-slate-500">Your Signed-In Account:</span>
              <span className="font-black text-slate-900">{user.displayName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-500">Your Active Role:</span>
              <span className={`px-2.5 py-0.5 rounded-lg border font-black flex items-center gap-1 ${currentRoleInfo.color}`}>
                {currentRoleInfo.icon}
                {currentRoleInfo.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-500">Required Portal Access:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-700 font-black flex items-center gap-1">
                {requiredRoleInfo.icon}
                {requiredRoleInfo.portal} Only
              </span>
            </div>
          </div>

          {/* Clear Isolation Action Buttons */}
          <div className="space-y-3 pt-1">
            <button
              onClick={() => router.push(currentRoleInfo.path)}
              className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-xl shadow-indigo-200 hover:scale-[1.02] transition interactive-target flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Return to My {currentRoleInfo.name} Portal
            </button>

            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition interactive-target flex items-center justify-center gap-2 border border-slate-200"
            >
              <LogOut className="w-4 h-4 text-slate-500" />
              Sign Out to Switch Account
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-medium">
            Deaf LMS Security Standard • Strict Role-Based Portal Isolation
          </p>
        </div>
      </div>
    );
  }

  // Access Granted: User role strictly matches the portal requirement
  return <>{children}</>;
};
