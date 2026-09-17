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
  User,
  CheckCircle2,
  VolumeX,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';

export default function SignUpPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
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
      const success = await signup(displayName, email, selectedRole, password);
      if (success) {
        if (selectedRole === 'student') router.push('/student/dashboard');
        if (selectedRole === 'teacher') router.push('/teacher/dashboard');
        if (selectedRole === 'admin') router.push('/admin/dashboard');
      } else {
        setErrorMsg('Sign up encountered an issue. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Sign up failed. Please try again.');
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

      {/* Main Registration Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="max-w-md w-full space-y-6">
          
          {/* Header Card */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Start Free • Unlock Intermediate &amp; Advanced Courses</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Create Your Free Account
            </h1>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
              Join Deaf LMS to track star achievements, access interactive storybooks, and learn computer skills in sign language.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Account Role Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">I am joining as a:</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`py-2 text-xs font-extrabold rounded-xl transition flex flex-col items-center gap-1 ${
                      selectedRole === 'student'
                        ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    Student
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('teacher')}
                    className={`py-2 text-xs font-extrabold rounded-xl transition flex flex-col items-center gap-1 ${
                      selectedRole === 'teacher'
                        ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    Facilitator
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`py-2 text-xs font-extrabold rounded-xl transition flex flex-col items-center gap-1 ${
                      selectedRole === 'admin'
                        ? 'bg-white text-amber-800 shadow-sm border border-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </button>
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={
                      selectedRole === 'student'
                        ? 'e.g., Emeka Johnson'
                        : selectedRole === 'teacher'
                        ? 'e.g., Mrs. Aisha Bello'
                        : 'e.g., Dr. Chidi Okafor'
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
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
                    placeholder="your.name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Reassurance Checkbox list */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 font-medium space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Free Basic Sign Language Courses Included
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Zero Auditory Reliance (100% Visual Confetti &amp; Stars)
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-200 transition interactive-target flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? 'Creating Account...' : 'Complete Free Registration'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500 font-medium">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-black text-indigo-600 hover:underline"
                >
                  Sign In Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs font-bold text-slate-400">
        Deaf LMS — K-12 Visual Sign &amp; Digital Literacy Platform
      </footer>
    </div>
  );
}
