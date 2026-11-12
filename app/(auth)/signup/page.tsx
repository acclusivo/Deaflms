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
      <div className="min-h-screen bg-[#F5F7FC] flex flex-col justify-between text-[#1F2937]">
        <header className="bg-white border-b border-[#E5EAF3]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="text-xl font-black tracking-tight text-[#1F2937]">
                Deaf<span className="text-[#1B4EA7]">LMS</span>
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E5EAF3] shadow-md text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-[#FEF7E8] border border-[#F4B942]/40 text-[#8F6010] flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#FEF7E8] text-[#8F6010] text-[11px] font-black uppercase tracking-wider border border-[#F4B942]/40">
                Application Submitted
              </span>
              <h1 className="text-2xl font-black text-[#00177D]">
                Teacher Approval Pending
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium leading-relaxed">
                Thank you for applying as an educator, <strong>{displayName}</strong>. To safeguard learners and ensure curriculum accreditation, teacher accounts require approval from an administrator before sign-in is unlocked.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F7FC] border border-[#E5EAF3] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#64748B] font-semibold">Registered Email:</span>
                <span className="font-black text-[#1F2937]">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B] font-semibold">School / Organization:</span>
                <span className="font-black text-[#1F2937]">{schoolOrOrganization || 'Independent Educator'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B] font-semibold">Approval Status:</span>
                <span className="font-black text-[#8F6010] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#F4B942] animate-pulse" />
                  Pending Admin Review
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link
                href="/login"
                className="w-full py-3.5 px-4 rounded-xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 interactive-target"
              >
                <span>Go to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="w-full py-2.5 px-4 rounded-xl bg-[#F5F7FC] hover:bg-[#E5EAF3] text-[#1F2937] font-bold text-xs border border-[#E5EAF3] transition block text-center"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </main>

        <footer className="py-6 text-center text-xs text-[#64748B]">
          DeafLMS by Acclusivo • Secure Role Isolation &amp; Accessible Authentication
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FC] flex flex-col  item-center justify-between text-[#1F2937]">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E5EAF3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 interactive-target">
            {/* <div className="w-9 h-9 rounded-xl bg-[#00177D] text-white flex items-center justify-center font-black text-sm shadow-xs">
              DL
            </div> */}
            <span className="text-xl font-black tracking-tight text-[#1F2937]">
              Deaf<span className="text-[#1B4EA7]">LMS</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-bold text-[#64748B] hover:text-[#1F2937] transition "
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Registration Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="max-w-lg w-full space-y-6">

          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#00177D] tracking-tight">
              Create an Account
            </h1>
            <p className="text-xs text-[#64748B] font-medium max-w-sm mx-auto">
              Join DeafLMS for visual sign lessons, and progress tracking.
            </p>
          </div>

          {/* Registration Form Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAF3] shadow-xs space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-[#B91C1C] text-xs font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Account Role Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">I am registering as:</label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#F5F7FC] rounded-2xl border border-[#E5EAF3]">
                  <button
                    type="button"
                    onClick={() => setAccountCategory('learner')}
                    className={`py-2.5 px-2 text-xs font-black rounded-xl transition flex flex-col items-center gap-1 text-center ${accountCategory === 'learner'
                      ? 'bg-[#1B4EA7] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#1F2937]'
                      }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Learner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountCategory('parent')}
                    className={`py-2.5 px-2 text-xs font-black rounded-xl transition flex flex-col items-center gap-1 text-center ${accountCategory === 'parent'
                      ? 'bg-[#3847AF] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#1F2937]'
                      }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Parent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountCategory('teacher')}
                    className={`py-2.5 px-2 text-xs font-black rounded-xl transition flex flex-col items-center gap-1 text-center ${accountCategory === 'teacher'
                      ? 'bg-[#00177D] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#1F2937]'
                      }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Teacher</span>
                  </button>
                </div>
              </div>

              {/* Teacher Approval Notice Banner */}
              {accountCategory === 'teacher' && (
                <div className="p-3.5 rounded-2xl bg-[#FEF7E8] border border-[#F4B942]/40 text-[#8F6010] text-xs font-medium space-y-1 animate-fade-in">
                  <div className="flex items-center gap-2 font-black text-[#8F6010]">
                    <Clock className="w-4 h-4 text-[#8F6010]" />
                    <span>Teacher Approval Required</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    To maintain classroom safeguarding and pedagogical quality, all educator accounts must be verified and approved by an administrator before access to the Facilitator Studio is granted.
                  </p>
                </div>
              )}

              {/* Baseline Onboarding Notice for Learner and Parent */}
              {/* {accountCategory !== 'teacher' && (
                <div className="p-3.5 rounded-2xl bg-[#E6F4F6] border border-[#CCEEF1] text-[#065A63] text-xs font-medium space-y-1 animate-fade-in">
                  <div className="flex items-center gap-2 font-black text-[#065A63]">
                    <Sparkles className="w-4 h-4 text-[#087F8C]" />
                    <span>Personalized Baseline Setup After Registration</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    Once you create your {accountCategory} account, you will configure your exact age segment (6–8, 9–12, 13–17, 18+), education stage (K-12 primary/secondary, tertiary, professional), and adaptive visual interface in onboarding.
                  </p>
                </div>
              )} */}

              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Amina Musa"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5EAF3] text-sm text-[#1F2937] focus:border-[#1B4EA7] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5EAF3] text-sm text-[#1F2937] focus:border-[#1B4EA7] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Teacher-Specific Field: School or Organization */}
              {accountCategory === 'teacher' && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-xs font-bold text-[#1F2937]">School or Organization</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={schoolOrOrganization}
                      onChange={(e) => setSchoolOrOrganization(e.target.value)}
                      placeholder="e.g. Abuja Model Deaf Academy"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5EAF3] text-sm text-[#1F2937] focus:border-[#1B4EA7] focus:outline-none transition"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 passwords"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5EAF3] text-sm text-[#1F2937] focus:border-[#1B4EA7] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 interactive-target disabled:opacity-50"
              >
                <span>
                  {submitting
                    ? 'Creating Account...'
                    : accountCategory === 'teacher'
                      ? 'Submit Teacher Application for Verification'
                      : 'Create New Account'}
                </span>
                {/* <ArrowRight className="w-4 h-4" /> */}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-[#64748B] font-medium">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-[#1B4EA7] underline hover:text-[#00177D]">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-[#64748B]">
        DeafLMS by Acclusivo • Secure Role Isolation &amp; Accessible Authentication
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
