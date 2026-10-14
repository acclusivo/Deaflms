'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  HandMetal,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth, DEMO_CREDENTIALS } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const { login, quickLogin, isLoading } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState<string>('student@deaflms.org');
  const [password, setPassword] = useState<string>('learner123');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const routeForRole = (role: UserRole) => {
    if (redirectPath) return redirectPath;
    if (role === 'student') return '/student/dashboard';
    if (role === 'teacher') return '/teacher/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/';
  };

  const handleRoleQuickLogin = (role: UserRole) => {
    quickLogin(role);
    router.push(routeForRole(role));
  };

  const handleSelectRolePreset = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student') {
      setEmail(DEMO_CREDENTIALS.student.email);
      setPassword(DEMO_CREDENTIALS.student.pass);
    } else if (role === 'teacher') {
      setEmail(DEMO_CREDENTIALS.teacher.email);
      setPassword(DEMO_CREDENTIALS.teacher.pass);
    } else if (role === 'admin') {
      setEmail(DEMO_CREDENTIALS.admin.email);
      setPassword(DEMO_CREDENTIALS.admin.pass);
    }
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const result = await login(selectedRole, email, password);
      if (result.success) {
        router.push(routeForRole(selectedRole));
      } else {
        setErrorMsg(result.error || 'Invalid login credentials. Please check your password or use 1-click login below.');
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
            <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white font-bold">
              <HandMetal className="w-5 h-5" />
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
              Choose your role or enter your account credentials.
            </p>
          </div>

          {/* 1-Click Fast Demo Login for Judges & Evaluators */}
          <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-black text-slate-800">
              <span>1-Click Demonstration Accounts:</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Instant Access</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleQuickLogin('student')}
                className="p-3 rounded-2xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 flex flex-col items-center text-center transition interactive-target"
              >
                <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center mb-1.5">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-xs font-black">Learner</span>
                <span className="text-[9px] font-bold text-teal-700">Amina</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickLogin('teacher')}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 flex flex-col items-center text-center transition interactive-target"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center mb-1.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-xs font-black">Facilitator</span>
                <span className="text-[9px] font-bold text-slate-600">Jordan</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickLogin('admin')}
                className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 flex flex-col items-center text-center transition interactive-target"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-800 text-white flex items-center justify-center mb-1.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-black">Admin</span>
                <span className="text-[9px] font-bold text-amber-800">Dr. Okon</span>
              </button>
            </div>
          </div>

          {/* Standard Email / Password Form */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-slate-200 shadow-xs space-y-5">
            <div className="text-xs font-black text-slate-700 uppercase tracking-wider text-center">
              Or Sign In with Email
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection Tabs */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Account Portal</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSelectRolePreset('student')}
                    className={`py-1.5 text-xs font-extrabold rounded-lg transition ${selectedRole === 'student'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Learner
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectRolePreset('teacher')}
                    className={`py-1.5 text-xs font-extrabold rounded-lg transition ${selectedRole === 'teacher'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Facilitator
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectRolePreset('admin')}
                    className={`py-1.5 text-xs font-extrabold rounded-lg transition ${selectedRole === 'admin'
                        ? 'bg-amber-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
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
                    placeholder="name@school.org"
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

              {/* Demo Hint */}
              {/* <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 font-medium">
                Demo passwords: <code className="font-bold text-slate-900">learner123</code>, <code className="font-bold text-slate-900">teacher123</code>, or <code className="font-bold text-slate-900">admin123</code>
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 interactive-target disabled:opacity-50"
              >
                <span>{submitting ? 'Signing In...' : 'Sign In'}</span>
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
