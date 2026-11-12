'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getCourseById, getCourses, OFFICIAL_BANK_DETAILS, generatePaymentReference } from '@/lib/api';
import { Course, PaymentRecord } from '@/lib/types';
import { PLANS_CATALOG } from '@/lib/plans';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Loader2,
  Sparkles,
  AlertCircle,
  Clock,
  Zap,
  Building2,
  Copy,
  Check,
  ExternalLink,
  CreditCard,
  FileText,
  UploadCloud,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateProfile } = useAuth();

  const courseParam = searchParams.get('course');
  const planParam = searchParams.get('plan');
  const statusParam = searchParams.get('status');
  const referenceParam = searchParams.get('reference');

  // State
  const [course, setCourse] = useState<Course | null>(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [activeTab, setActiveTab] = useState<'selar' | 'manual'>('selar');
  const [uniqueRef, setUniqueRef] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Manual payment form state
  const [senderName, setSenderName] = useState(user?.displayName || '');
  const [bankName, setBankName] = useState('GTBank');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [proofUrl, setProofUrl] = useState('');
  const [submittingManual, setSubmittingManual] = useState(false);
  const [manualSubmittedRecord, setManualSubmittedRecord] = useState<PaymentRecord | null>(null);

  // Selar instant trigger state
  const [selarProcessing, setSelarProcessing] = useState(false);
  const [selarConfirmedRecord, setSelarConfirmedRecord] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pricing calculations
  const priceNgn = course?.priceNgn ?? (planParam === 'school_institutional' ? 45000 : 5000);
  const itemName = course?.title ?? (planParam ? PLANS_CATALOG[planParam as keyof typeof PLANS_CATALOG]?.name : 'Frontend Web Development in Nigerian Sign Language');
  const itemAudience = course?.ageSegment || '18+';

  // Check if returning from a live Selar hosted redirect (?status=confirmed)
  useEffect(() => {
    if ((statusParam === 'confirmed' || statusParam === 'success') && !selarConfirmedRecord) {
      const targetCourseId = courseParam || (planParam ? undefined : 'course-frontend-web-1');
      const ref = referenceParam || `SELAR-${Date.now()}`;

      if (targetCourseId && user) {
        const currentEnrolled = user.enrolledCourseIds || [];
        if (!currentEnrolled.includes(targetCourseId)) {
          updateProfile({
            enrolledCourseIds: [...currentEnrolled, targetCourseId],
          });
        }
      }

      setSelarConfirmedRecord({
        reference: ref,
        amount: priceNgn,
        status: 'confirmed',
        courseId: targetCourseId,
        channel: 'selar_instant',
      });
    }
  }, [statusParam, referenceParam, courseParam, planParam, user, updateProfile, priceNgn, selarConfirmedRecord]);

  // Initialize reference code once on load
  useEffect(() => {
    setUniqueRef(generatePaymentReference());
  }, []);

  // Update sender name when auth user loads
  useEffect(() => {
    if (user?.displayName && !senderName) {
      setSenderName(user.displayName);
    }
  }, [user, senderName]);

  // Load course details
  useEffect(() => {
    async function loadItem() {
      setLoadingCourse(true);
      try {
        const targetCourseId = courseParam || (planParam ? undefined : 'course-frontend-web-1');
        if (targetCourseId) {
          const found = await getCourseById(targetCourseId);
          if (found) {
            setCourse(found);
            setLoadingCourse(false);
            return;
          }
        }
        // Fallback to first available course if specific ID not found
        const allCourses = await getCourses();
        const fallback = allCourses.find((c) => !c.isFreeTier) || allCourses[0];
        setCourse(fallback || null);
      } catch (e) {
        console.error('Failed to load course details:', e);
      } finally {
        setLoadingCourse(false);
      }
    }
    loadItem();
  }, [courseParam, planParam]);

  // Check if a hosted Selar product link is configured in environment
  const configuredSelarUrl =
    (course?.id === 'course-frontend-web-1' && process.env.NEXT_PUBLIC_SELAR_COURSE_WEB_DEV_URL) ||
    (course?.id === 'course-hearing-nsl-1' && process.env.NEXT_PUBLIC_SELAR_COURSE_HEARING_NSL_URL) ||
    process.env.NEXT_PUBLIC_SELAR_STORE_URL ||
    '';

  const getSelarHostedUrl = () => {
    if (!configuredSelarUrl) return '';
    try {
      const url = new URL(configuredSelarUrl);
      if (user?.email) url.searchParams.set('email', user.email);
      if (user?.displayName) url.searchParams.set('name', user.displayName);
      return url.toString();
    } catch {
      return configuredSelarUrl;
    }
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  /**
   * Handle Instant Selar Payment (Production Link or Fast Webhook Demo)
   */
  const handleSelarInstantCheckout = async (isSimulation = false) => {
    setSelarProcessing(true);
    setErrorMessage(null);

    try {
      const payload = {
        id: `selar_${Date.now()}`,
        reference: `SELAR-${Date.now()}`,
        amount: priceNgn,
        user_id: user?.id || 'demo-learner-1',
        email: user?.email || 'learner@deaflms.org',
        name: user?.displayName || 'Learner',
        course_id: course?.id || 'course-frontend-web-1',
      };

      // Call our idempotent Selar webhook endpoint
      const res = await fetch('/api/billing/selar/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process instant checkout');
      }

      // Update auth profile with unlocked course
      if (course?.id) {
        const currentEnrolled = user?.enrolledCourseIds || [];
        if (!currentEnrolled.includes(course.id)) {
          updateProfile({
            enrolledCourseIds: [...currentEnrolled, course.id],
          });
        }
      }

      setSelarConfirmedRecord(data);
    } catch (e: any) {
      console.error('Selar error:', e);
      setErrorMessage(e.message || 'Payment could not be verified automatically. You can switch to Manual Bank Transfer.');
    } finally {
      setSelarProcessing(false);
    }
  };

  /**
   * Handle Manual Bank Transfer Proof Submission
   */
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !bankName.trim()) {
      setErrorMessage('Please provide the sender name and bank name used for the transfer.');
      return;
    }

    setSubmittingManual(true);
    setErrorMessage(null);

    try {
      const payload = {
        userId: user?.id || 'demo-learner-1',
        userEmail: user?.email || 'learner@deaflms.org',
        userName: senderName,
        courseId: course?.id || 'course-frontend-web-1',
        courseTitle: itemName,
        amountNgn: priceNgn,
        reference: uniqueRef,
        bankName,
        senderName,
        transferDate,
        proofUrl: proofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      };

      const res = await fetch('/api/billing/manual/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit payment proof');
      }

      setManualSubmittedRecord(data.payment);
    } catch (e: any) {
      console.error('Manual submit error:', e);
      setErrorMessage(e.message || 'Submission failed. Please check your network and try again.');
    } finally {
      setSubmittingManual(false);
    }
  };

  // SUCCESS STATE: Instant Selar Activated
  if (selarConfirmedRecord) {
    return (
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="text-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-300">
            ⚡ Instant Access Activated
          </span>
          <h1 className="text-2xl font-black text-slate-900">Payment Confirmed!</h1>
          <p className="text-sm text-slate-600 font-medium">
            Your enrolment in <strong>{itemName}</strong> has been instantly unlocked. All Nigerian Sign Language video modules and code labs are now available.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between text-slate-600">
            <span className="font-bold">Active Learner:</span>
            <span className="font-bold text-slate-900">{user?.displayName || 'Learner'} ({user?.email || 'student@deaflms.org'})</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="font-bold">Transaction Reference:</span>
            <span className="font-mono text-slate-900 font-black">{selarConfirmedRecord.reference}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="font-bold">Payment Method:</span>
            <span className="font-bold text-slate-900">Selar Instant Checkout (Live Webhook)</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="font-bold">Amount Paid:</span>
            <span className="font-black text-emerald-700">₦{priceNgn.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Link
            href="/student/lessons/lesson-frontend-2"
            className="w-full py-4 px-6 rounded-2xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Proceed to Lesson 2: VS Code Setup →</span>
          </Link>

          {course && (
            <Link
              href={`/student/courses/${course.id}`}
              className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <span>View Course Syllabus & Modules</span>
            </Link>
          )}

          <Link
            href="/student/payments"
            className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 font-bold text-xs transition block text-center"
          >
            View Payment Receipt History
          </Link>
        </div>
      </div>
    );
  }

  // SUCCESS STATE: Manual Transfer Proof Submitted (Pending Admin Review)
  if (manualSubmittedRecord) {
    return (
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border-2 border-amber-200">
          <Clock className="w-8 h-8" />
        </div>

        <div className="text-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md border border-amber-300">
            ⏳ Proof Received • Pending Verification
          </span>
          <h1 className="text-2xl font-black text-slate-900">Transfer Proof Submitted!</h1>
          <p className="text-sm text-slate-600 font-medium">
            Thank you, <strong>{manualSubmittedRecord.userName}</strong>. Our finance administrator will reconcile your transfer of <strong>₦{manualSubmittedRecord.amountNgn.toLocaleString()}</strong> and activate your course enrolment.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between text-slate-600">
            <span className="font-bold">Payment Reference:</span>
            <span className="font-mono text-slate-900 font-black">{manualSubmittedRecord.reference}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="font-bold">Bank Used:</span>
            <span className="font-bold text-slate-900">{manualSubmittedRecord.bankName}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="font-bold">Sender Name:</span>
            <span className="font-bold text-slate-900">{manualSubmittedRecord.senderName}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="font-bold">Status:</span>
            <span className="font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Pending Admin Approval</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F0F4FA] border border-[#ABB8D7]/40 text-xs text-[#00177D] space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1B4EA7] shrink-0" />
            Verification Window
          </div>
          <p className="text-[#1F2937] text-[11px] leading-relaxed">
            Manual transfers are reconciled within 1-2 hours during business hours. You can track this verification status anytime from your account.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <Link
            href="/student/payments"
            className="w-full py-4 px-6 rounded-2xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Track Verification Status in My Account →</span>
          </Link>
          <Link
            href="/student/dashboard"
            className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 font-bold text-xs transition block text-center"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl space-y-6 animate-fade-in">
      {/* Top Breadcrumb & SSL Badge */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <Link
          href={course ? `/student/courses/${course.id}` : '/student/dashboard'}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </Link>
        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
          <Lock className="w-3 h-3 text-emerald-600" />
          256-Bit SSL Encrypted
        </span>
      </div>

      {/* Course Summary Card */}
      <div className="p-5 rounded-2xl bg-[#F0F4FA] border border-[#E5EAF3] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#00177D] bg-white border border-[#ABB8D7]/40 px-2.5 py-0.5 rounded-md">
              {course?.category || 'Ages 18+ Career Track'}
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">{itemName}</h2>
          </div>
          <div className="sm:text-right shrink-0">
            <div className="text-2xl font-black text-[#00177D]">₦{priceNgn.toLocaleString()}</div>
            <span className="text-[11px] text-[#1B4EA7] font-bold block">One-Time Full Access</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          {course?.description || 'Learn modern web engineering with certified Nigerian Sign Language video modules, interactive fingerspelling, and browser code labs.'}
        </p>

        {/* Benefits list */}
        <div className="pt-2 border-t border-[#E5EAF3] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4EA7] shrink-0" />
            <span>Certified NSL Instruction Videos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4EA7] shrink-0" />
            <span>Interactive Visual Code Exercises</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4EA7] shrink-0" />
            <span>Lifetime Access to Course Updates</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4EA7] shrink-0" />
            <span>DeafLMS Completion Certificate</span>
          </div>
        </div>
      </div>

      {/* Payment Engine Selection Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700">
            Choose Payment Method:
          </label>
          <span className="text-[10px] font-bold text-slate-500">2 Options Available</span>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('selar');
              setErrorMessage(null);
            }}
            className={`py-3 px-3 rounded-xl font-black text-xs transition flex flex-col sm:flex-row items-center justify-center gap-2 ${
              activeTab === 'selar'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Zap className={`w-4 h-4 ${activeTab === 'selar' ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
              <span>Instant Selar</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              5 Seconds
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('manual');
              setErrorMessage(null);
            }}
            className={`py-3 px-3 rounded-xl font-black text-xs transition flex flex-col sm:flex-row items-center justify-center gap-2 ${
              activeTab === 'manual'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Building2 className={`w-4 h-4 ${activeTab === 'manual' ? 'text-[#1B4EA7]' : 'text-slate-400'}`} />
              <span>Bank Transfer</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
              Manual Fallback
            </span>
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 1: INSTANT SELAR CHECKOUT                                        */}
      {/* ==================================================================== */}
      {activeTab === 'selar' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Fastest &amp; Zero Paperwork: Pay with Card, USSD, or Bank App</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Selar instantly confirms your payment and activates your course in real time via secure webhook. No waiting for manual administrative review.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-2 text-[10px] font-bold text-amber-800">
              <span className="bg-amber-100 px-2 py-0.5 rounded">✓ Verve / Visa / Mastercard</span>
              <span className="bg-amber-100 px-2 py-0.5 rounded">✓ USSD (*737#, *894#)</span>
              <span className="bg-amber-100 px-2 py-0.5 rounded">✓ Instant Bank Transfer</span>
              <span className="bg-amber-100 px-2 py-0.5 rounded">✓ Apple Pay</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {configuredSelarUrl ? (
              <>
                <a
                  href={getSelarHostedUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-md transition interactive-target flex items-center justify-center gap-2 border border-amber-500"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Proceed to Pay ₦{priceNgn.toLocaleString()} on Selar ↗</span>
                </a>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-bold">Finished paying on Selar?</span>
                    <button
                      type="button"
                      disabled={selarProcessing}
                      onClick={() => handleSelarInstantCheckout(false)}
                      className="font-black text-[#1B4EA7] hover:text-[#00177D] underline flex items-center gap-1.5 text-xs self-start sm:self-auto"
                    >
                      {selarProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      <span>Activate My Enrolment Now →</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    If Selar already received your payment, tap the button above to unlock your course immediately.
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Instant Webhook Activation (5 Seconds Access) */}
                <button
                  type="button"
                  disabled={selarProcessing}
                  onClick={() => handleSelarInstantCheckout(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-black text-sm shadow-lg shadow-[#1B4EA7]/20 transition interactive-target flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {selarProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Activating Course Access...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current text-amber-300" />
                      <span>Pay ₦{priceNgn.toLocaleString()} via Selar (Instant 5-Second Access)</span>
                    </>
                  )}
                </button>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong>Selar Integration Ready:</strong> Paste your Selar product link in <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono font-bold">.env.local</code> to enable direct external checkout. Instant verification is already active.
                  </div>
                </div>
              </>
            )}

            <p className="text-center text-[11px] text-slate-500 font-medium">
              Payments are deposited directly to Acclusivo Technologies Ltd bank account.
            </p>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: MANUAL BANK TRANSFER FALLBACK                                 */}
      {/* ==================================================================== */}
      {activeTab === 'manual' && (
        <div className="space-y-5 animate-fade-in">
          {/* Bank Details Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Official Receiving Bank
                </span>
                <h3 className="text-base font-black text-slate-900">{OFFICIAL_BANK_DETAILS.bankName}</h3>
              </div>
              <span className="text-[10px] font-black uppercase text-[#1B4EA7] bg-[#F0F4FA] border border-[#ABB8D7]/40 px-2 py-0.5 rounded">
                Verified Account
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Account Number with Copy */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Account Number</span>
                  <span className="text-base font-mono font-black text-slate-900">
                    {OFFICIAL_BANK_DETAILS.accountNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(OFFICIAL_BANK_DETAILS.accountNumber, 'account')}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="Copy Account Number"
                >
                  {copiedField === 'account' ? (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Unique Payment Reference with Copy */}
              <div className="p-3 bg-white rounded-xl border border-amber-300 bg-amber-50/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-700 block uppercase">Transfer Narration / Ref</span>
                  <span className="text-sm font-mono font-black text-amber-950">
                    {uniqueRef}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(uniqueRef, 'ref')}
                  className="p-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition"
                  title="Copy Reference"
                >
                  {copiedField === 'ref' ? (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Account Name:</span>
                <span className="font-bold text-slate-900">{OFFICIAL_BANK_DETAILS.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Amount to Transfer:</span>
                <span className="font-black text-slate-900">₦{priceNgn.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Important:</strong> Put <strong>{uniqueRef}</strong> in the transfer remark or narration in your bank app.
              </span>
            </div>
          </div>

          {/* Form to submit proof */}
          <form onSubmit={handleManualSubmit} className="space-y-4 pt-1">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1B4EA7]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Step 2: Submit Your Transfer Proof
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Sender’s Full Name</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Amina Bello"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B4EA7]/20 focus:border-[#1B4EA7] text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Sending Bank Used</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B4EA7]/20 focus:border-[#1B4EA7] text-slate-900 font-medium bg-white"
                >
                  <option value="GTBank">Guaranty Trust Bank (GTBank)</option>
                  <option value="Access Bank">Access Bank</option>
                  <option value="Zenith Bank">Zenith Bank</option>
                  <option value="First Bank">First Bank of Nigeria</option>
                  <option value="UBA">United Bank for Africa (UBA)</option>
                  <option value="Kuda Bank">Kuda Bank</option>
                  <option value="OPay">OPay</option>
                  <option value="PalmPay">PalmPay</option>
                  <option value="Wema Bank / ALAT">Wema Bank / ALAT</option>
                  <option value="Fidelity Bank">Fidelity Bank</option>
                  <option value="Other">Other Bank / Fintech</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Transfer Date</label>
                <input
                  type="date"
                  required
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B4EA7]/20 focus:border-[#1B4EA7] text-slate-900 font-medium bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Receipt Image URL (Optional)</label>
                <input
                  type="text"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://... receipt image link"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B4EA7]/20 focus:border-[#1B4EA7] text-slate-900 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingManual}
              className="w-full py-4 px-6 rounded-2xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-black text-sm shadow-md transition interactive-target flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submittingManual ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Transfer Proof...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Submit Payment Proof for Verification</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FC] flex flex-col items-center justify-center p-4 selection:bg-[#1B4EA7] selection:text-white">
      <Suspense
        fallback={
          <div className="p-8 bg-white rounded-3xl border border-[#E5EAF3] shadow-md text-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#1B4EA7] mx-auto" />
            <span className="text-xs font-bold text-slate-500 mt-2 block">Loading Secure Checkout...</span>
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
