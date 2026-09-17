'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { PLANS_CATALOG } from '@/lib/plans';
import { MembershipTier } from '@/lib/types';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Loader2,
  Sparkles,
  AlertCircle,
  Clock,
} from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateProfile } = useAuth();

  const planId = (searchParams.get('plan') as MembershipTier) || 'family_supporter';
  const plan = PLANS_CATALOG[planId] || PLANS_CATALOG.family_supporter;

  const [paymentStatus, setPaymentStatus] = useState<
    'review' | 'processing' | 'confirming' | 'success' | 'failed'
  >('review');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirmCheckout = async () => {
    setPaymentStatus('processing');
    setErrorMessage(null);

    try {
      // Simulate payment processing step
      await new Promise((r) => setTimeout(r, 1200));
      setPaymentStatus('confirming');

      // Simulate delayed activation verification
      await new Promise((r) => setTimeout(r, 1500));

      // Grant paid membership idempotently
      updateProfile({
        membershipTier: plan.id,
        subscription: {
          tier: plan.id,
          status: 'active',
          billingPeriod: 'monthly',
          currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
          cancelAtPeriodEnd: false,
        },
      });

      setPaymentStatus('success');
    } catch (e) {
      setPaymentStatus('failed');
      setErrorMessage('Payment verification could not be completed. No funds were debited.');
    }
  };

  return (
    <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl space-y-6 animate-fade-in">
      {/* Header Badge */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900">Review Your Selection</h1>
            <p className="text-[11px] text-slate-500 font-medium">Verified Server Pricing &amp; Terms</p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
          256-Bit SSL Encrypted
        </span>
      </div>

      {paymentStatus === 'review' && (
        <div className="space-y-5">
          {/* Plan Summary Card */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                  {plan.badge}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{plan.name}</h2>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900">{plan.price.formatted}</div>
                <span className="text-[10px] text-slate-500 font-bold block">{plan.price.billingInterval}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">{plan.tagline}</p>
          </div>

          {/* Included Features */}
          <div className="space-y-2 text-xs">
            <span className="font-black text-slate-700 uppercase tracking-wider block">
              Entitlements Included with this Upgrade:
            </span>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All 24+ Intermediate &amp; Advanced K-12 STEM Curriculum Modules</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unlimited Interactive Storybooks with Synchronized Video</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Signy AI Visual Tutor (50 clarification requests / day)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Immediate 1-click cancellation anytime; free access preserved on downgrade</span>
              </li>
            </ul>
          </div>

          {/* Test Integration Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Development Integration Boundary
            </div>
            <p>
              In production, this initiates Paystack / Stripe. In this development test flow, clicking confirm activates your membership safely without charging a real card.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleConfirmCheckout}
              className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-200 transition interactive-target flex items-center justify-center gap-2"
            >
              <span>Confirm &amp; Activate {plan.name}</span>
            </button>
            <Link
              href="/pricing"
              className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 font-bold text-xs transition block text-center"
            >
              Cancel &amp; Return to Plans
            </Link>
          </div>
        </div>
      )}

      {paymentStatus === 'processing' && (
        <div className="py-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
          <h2 className="text-lg font-black text-slate-900">Connecting Secure Payment Gateway...</h2>
          <p className="text-xs text-slate-500 font-medium">Please do not refresh the page.</p>
        </div>
      )}

      {paymentStatus === 'confirming' && (
        <div className="py-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7 animate-pulse" />
          </div>
          <h2 className="text-lg font-black text-slate-900">Confirming Your Payment...</h2>
          <p className="text-xs text-slate-500 font-medium">
            Verifying provider event signature and updating account entitlements.
          </p>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="py-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">Membership Activated!</h2>
            <p className="text-xs text-slate-600 font-medium">
              You now have full access to the <strong>{plan.name}</strong> curriculum and visual storybooks.
            </p>
          </div>
          <button
            onClick={() => router.push('/student/dashboard')}
            className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition"
          >
            Go to My Student Dashboard →
          </button>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div className="py-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border-2 border-rose-200">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Payment Could Not Be Verified</h2>
            <p className="text-xs text-slate-600 font-medium">{errorMessage}</p>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => setPaymentStatus('review')}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 text-white font-black text-xs"
            >
              Try Again
            </button>
            <Link
              href="/pricing"
              className="block text-xs font-bold text-slate-500 hover:underline"
            >
              Return to Plans
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <Suspense
        fallback={
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-md text-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
            <span className="text-xs font-bold text-slate-500 mt-2 block">Loading Checkout Review...</span>
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
