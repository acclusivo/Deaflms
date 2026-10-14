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
  Lock,
  Mail,
  User,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';

export default function SignUpPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();

  type AccountCategory = 'learner' | 'parent' | 'facilitator';
  const [accountCategory, setAccountCategory] = useState<AccountCategory>('learner');
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const mappedRole: UserRole = accountCategory === 'facilitator' ? 'teacher' : 'student';
      const result = await signup(displayName, email, mappedRole, password);

      if (result.success) {
        if (mappedRole === 'teacher') {
          router.push('/teacher/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      } else {
        setErrorMsg(result.error || 'Registration could not be completed. Please try again.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred during registration.');
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

      {/* Main Registration Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="max-w-md w-full space-y-6">
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Create an Account
            </h1>
            <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto">
              Join DeafLMS for visual sign lessons, fingerspelling practice, and progress tracking.
            </p>
          </div>

          {/* Registration Form Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Account Role Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">I am joining as a:</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setAccountCategory('learner')}
                    className={`py-2 px-1 text-xs font-extrabold rounded-lg transition flex flex-col items-center gap-1 text-center ${
                      accountCategory === 'learner'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Learner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountCategory('parent')}
                    className={`py-2 px-1 text-xs font-extrabold rounded-lg transition flex flex-col items-center gap-1 text-center ${
                      accountCategory === 'parent'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Parent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountCategory('facilitator')}
                    className={`py-2 px-1 text-xs font-extrabold rounded-lg transition flex flex-col items-center gap-1 text-center ${
                      accountCategory === 'facilitator'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Facilitator</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Display Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Amina Musa"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-700 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Email Address */}
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

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
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
                <span>{submitting ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-teal-700 underline hover:text-teal-900">
                Sign in here
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
