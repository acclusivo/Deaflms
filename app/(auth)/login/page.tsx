'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const { login, isLoading } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const routeForRole = (role: UserRole) => {
    if (redirectPath) return redirectPath;
    if (role === 'student' || role === 'parent') return '/student/dashboard';
    if (role === 'teacher') return '/teacher/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/student/dashboard';
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const result = await login(selectedRole, email, password);
      if (result.success) {
        router.push(routeForRole(result.role || selectedRole));
      } else {
        setErrorMsg(result.error || 'Invalid login credentials. Please check your email and password.');
      }
    } catch {
      setErrorMsg('Login could not be completed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 interactive-target">
            <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center font-black text-sm shadow-xs">
              DL
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Deaf<span className="text-teal-700">LMS</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition interactive-target"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Login Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="max-w-md w-full space-y-6">

          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sign In to DeafLMS
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Choose your role and enter your account credentials.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-slate-200 shadow-xs space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection Tabs for 4 Portals */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Select Portal Role</label>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Zero-Trust Isolation</span>
                </div>
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSelectRole('student')}
                    className={`py-2 text-[11px] font-black rounded-lg transition flex flex-col items-center gap-1 ${
                      selectedRole === 'student'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Learner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectRole('teacher')}
                    className={`py-2 text-[11px] font-black rounded-lg transition flex flex-col items-center gap-1 ${
                      selectedRole === 'teacher'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Teacher</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectRole('parent')}
                    className={`py-2 text-[11px] font-black rounded-lg transition flex flex-col items-center gap-1 ${
                      selectedRole === 'parent'
                        ? 'bg-indigo-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Parent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectRole('admin')}
                    className={`py-2 text-[11px] font-black rounded-lg transition flex flex-col items-center gap-1 ${
                      selectedRole === 'admin'
                        ? 'bg-amber-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                </div>

                {selectedRole === 'teacher' && (
                  <p className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5 mt-1">
                    <span>⚠️</span>
                    <span>Teacher sign-in requires approved status from an administrator.</span>
                  </p>
                )}
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
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-700 focus:outline-none transition"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-700 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 interactive-target disabled:opacity-50"
              >
                <span>{submitting ? 'Signing In...' : `Sign In to ${selectedRole === 'teacher' ? 'Teacher Studio' : selectedRole === 'parent' ? 'Parent Portal' : selectedRole === 'admin' ? 'Admin Hub' : 'Learner Portal'}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500 font-medium">
              Don&apos;t have an account yet?{' '}
              <Link href="/signup" className="font-bold text-teal-700 underline hover:text-teal-900">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-500">
        DeafLMS • Secure Role Isolation &amp; Accessible Authentication
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-slate-500">Loading Secure Portal Login...</span>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
