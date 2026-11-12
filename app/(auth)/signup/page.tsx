'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  User,
  AlertCircle,
  Building2,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { UserRole, AgeSegment } from '@/lib/types';

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, isLoading } = useAuth();

  type AccountCategory = 'learner' | 'parent' | 'teacher';

  const [accountCategory, setAccountCategory] = useState<AccountCategory>('learner');
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [schoolOrOrganization, setSchoolOrOrganization] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [teacherSubmitted, setTeacherSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const mappedRole: UserRole =
        accountCategory === 'teacher'
          ? 'teacher'
          : accountCategory === 'parent'
          ? 'parent'
          : 'student';

      const result = await signup(
        displayName,
        email,
        mappedRole,
        password,
        '9-12', // baseline default, fully calibrated on /onboarding
        undefined,
        schoolOrOrganization
      );

      if (result.success) {
        if (result.pendingApproval || mappedRole === 'teacher') {
          // Teacher accounts require admin approval: Show verification status
          setTeacherSubmitted(true);
        } else {
          // Learner or Parent: Route to baseline onboarding to calibrate age, class, and interface
          router.push('/onboarding');
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

  // If teacher submitted application, show friendly confirmation screen
  if (teacherSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center font-black text-sm shadow-xs">
                DL
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Deaf<span className="text-teal-700">LMS</span>
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-md text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black uppercase tracking-wider">
                Application Submitted
              </span>
              <h1 className="text-2xl font-black text-slate-900">
                Teacher Approval Pending
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Thank you for applying as an educator, <strong>{displayName}</strong>. To safeguard learners and ensure curriculum accreditation, teacher accounts require approval from an administrator before sign-in is unlocked.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Registered Email:</span>
                <span className="font-black text-slate-900">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">School / Organization:</span>
                <span className="font-black text-slate-900">{schoolOrOrganization || 'Independent Educator'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Approval Status:</span>
                <span className="font-black text-amber-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Pending Admin Review
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link
                href="/login"
                className="w-full py-3.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 interactive-target"
              >
                <span>Go to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition block text-center"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </main>

        <footer className="py-6 text-center text-xs text-slate-500">
          DeafLMS • Secure Role Isolation &amp; Accessible Authentication
        </footer>
      </div>
    );
  }

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

      {/* Main Registration Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="max-w-lg w-full space-y-6">

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
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Account Role Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">I am registering as:</label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setAccountCategory('learner')}
                    className={`py-2.5 px-2 text-xs font-black rounded-xl transition flex flex-col items-center gap-1 text-center ${
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
                    className={`py-2.5 px-2 text-xs font-black rounded-xl transition flex flex-col items-center gap-1 text-center ${
                      accountCategory === 'parent'
                        ? 'bg-indigo-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Parent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountCategory('teacher')}
                    className={`py-2.5 px-2 text-xs font-black rounded-xl transition flex flex-col items-center gap-1 text-center ${
                      accountCategory === 'teacher'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Teacher</span>
                  </button>
                </div>
              </div>

              {/* Teacher Approval Notice Banner */}
              {accountCategory === 'teacher' && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 text-xs font-medium space-y-1 animate-fade-in">
                  <div className="flex items-center gap-2 font-black text-amber-950">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>Teacher Approval Required</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    To maintain classroom safeguarding and pedagogical quality, all educator accounts must be verified and approved by an administrator before access to the Facilitator Studio is granted.
                  </p>
                </div>
              )}

              {/* Baseline Onboarding Notice for Learner and Parent */}
              {accountCategory !== 'teacher' && (
                <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 text-teal-900 text-xs font-medium space-y-1 animate-fade-in">
                  <div className="flex items-center gap-2 font-black text-teal-950">
                    <Sparkles className="w-4 h-4 text-teal-700" />
                    <span>Personalized Baseline Setup After Registration</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Once you create your {accountCategory} account, you will configure your exact age segment (6–8, 9–12, 13–17, 18+), education stage (K-12 primary/secondary, tertiary, professional), and adaptive visual interface in onboarding.
                  </p>
                </div>
              )}

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
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-700 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Teacher-Specific Field: School or Organization */}
              {accountCategory === 'teacher' && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-xs font-bold text-slate-700">School or Organization</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={schoolOrOrganization}
                      onChange={(e) => setSchoolOrOrganization(e.target.value)}
                      placeholder="e.g. Abuja Model Deaf Academy"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-700 focus:outline-none transition"
                    />
                  </div>
                </div>
              )}

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
                <span>
                  {submitting
                    ? 'Creating Account...'
                    : accountCategory === 'teacher'
                    ? 'Submit Teacher Application for Verification'
                    : 'Create Account & Set Baseline →'}
                </span>
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

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <p className="text-slate-700 font-bold text-sm">Loading registration...</p>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
