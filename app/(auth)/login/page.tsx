'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HandMetal,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  UserCheck,
  CheckCircle2,
  VolumeX,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickLogin, isLoading } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleRoleQuickLogin = (role: UserRole) => {
    quickLogin(role);
    if (role === 'student') router.push('/student/dashboard');
    if (role === 'teacher') router.push('/teacher/dashboard');
    if (role === 'admin') router.push('/admin/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const success = await login(selectedRole, email, password);
      if (success) {
        if (selectedRole === 'student') router.push('/student/dashboard');
        if (selectedRole === 'teacher') router.push('/teacher/dashboard');
        if (selectedRole === 'admin') router.push('/admin/dashboard');
      } else {
        setErrorMsg('Invalid login credentials. Try 1-click demo login below.');
      }
    } catch (err) {
      setErrorMsg('Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition transform">
              <HandMetal className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Deaf<span className="text-indigo-600">LMS</span>
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-black text-slate-500 hover:text-slate-900 transition"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="max-w-md w-full space-y-6">
          
          {/* Header Card */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
              <VolumeX className="w-3 h-3 text-rose-500" />
              <span>Zero Audio Required • Visual Sign LMS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sign In to Your Portal
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Access your visual sign courses, track student progress, or manage school curriculum.
            </p>
          </div>

          {/* 1-CLICK INSTANT DEMO LOGIN TABS (Fastest Way to Proceed) */}
          <div className="bg-white p-5 rounded-3xl border-2 border-indigo-100 shadow-md space-y-3">
            <div className="flex items-center justify-between text-xs font-black text-slate-800">
              <span className="flex items-center gap-1.5 text-indigo-600">
                <Sparkles className="w-4 h-4 text-amber-500" />
                1-Click Instant Demo Login:
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">No Password Needed</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleQuickLogin('student')}
                className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 flex flex-col items-center text-center transition group interactive-target"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-xs font-black">Student</span>
                <span className="text-[9px] font-bold text-emerald-600">Maya Lin</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickLogin('teacher')}
                className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 flex flex-col items-center text-center transition group interactive-target"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-xs font-black">Facilitator</span>
                <span className="text-[9px] font-bold text-indigo-600">Mr. Jordan</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickLogin('admin')}
                className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 flex flex-col items-center text-center transition group interactive-target"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-black">Admin</span>
                <span className="text-[9px] font-bold text-amber-700">Director Sarah</span>
              </button>
            </div>
          </div>

          {/* Standard Email Sign-In Form */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xl space-y-5">
            <div className="text-xs font-black text-slate-700 uppercase tracking-wider text-center">
              Or Sign In with Email Credentials
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Account Role</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`py-1.5 text-xs font-extrabold rounded-xl transition ${
                      selectedRole === 'student'
                        ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('teacher')}
                    className={`py-1.5 text-xs font-extrabold rounded-xl transition ${
                      selectedRole === 'teacher'
                        ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Facilitator
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`py-1.5 text-xs font-extrabold rounded-xl transition ${
                      selectedRole === 'admin'
                        ? 'bg-white text-amber-800 shadow-sm border border-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      selectedRole === 'student'
                        ? 'maya.student@deafacademy.edu'
                        : selectedRole === 'teacher'
                        ? 'jordan.ellis@deafacademy.edu'
                        : 'sarah.vance@deafacademy.edu'
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md shadow-indigo-200 transition interactive-target flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? 'Signing In...' : 'Sign In with Credentials'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 text-center space-y-2">
              <p className="text-xs text-slate-500 font-medium">
                New to Deaf LMS?{' '}
                <Link
                  href="/signup"
                  className="font-black text-indigo-600 hover:underline"
                >
                  Create a Free Account
                </Link>
              </p>
              <p className="text-[11px] text-slate-400">
                Want to try right now?{' '}
                <Link href="/student/dashboard" className="font-bold text-emerald-600 hover:underline">
                  Explore Free Basic Lessons →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Working Links */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs font-medium text-slate-500 flex flex-wrap items-center justify-center gap-4">
        <span>&copy; 2026 Deaf LMS</span>
        <span>•</span>
        <Link href="/privacy" className="hover:text-indigo-600 transition">Privacy</Link>
        <span>•</span>
        <Link href="/terms" className="hover:text-indigo-600 transition">Terms</Link>
        <span>•</span>
        <Link href="/accessibility" className="hover:text-indigo-600 transition">Accessibility</Link>
        <span>•</span>
        <Link href="/support" className="hover:text-indigo-600 transition">Support</Link>
      </footer>
    </div>
  );
}
