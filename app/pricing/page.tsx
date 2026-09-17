'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { PLANS_CATALOG, PlanDefinition } from '@/lib/plans';
import { MembershipTier } from '@/lib/types';
import { ArrowLeft, Check, Sparkles, ShieldCheck, HeartHandshake, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null);

  const handleSelectPlan = (plan: PlanDefinition) => {
    if (!plan.isPaid) {
      if (user) {
        router.push('/student/dashboard');
      } else {
        router.push('/signup?plan=free_basic_1');
      }
      return;
    }

    // Paid plan selected: preserve purchase intent and navigate to checkout review or signup
    if (!user) {
      router.push(`/signup?plan=${plan.id}&redirect=/checkout?plan=${plan.id}`);
    } else {
      setSelectedTier(plan.id);
      setCheckoutNotice(
        `Reviewing ${plan.name} (${plan.price.formatted}). Development test checkout boundary initialized below.`
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Transparent Pricing • Zero Hidden Trials</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Foundational Signs are Always Free</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Fair Plans for Deaf Learners, Families &amp; Schools
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            We never place basic communication behind a paywall. Start immediately with Free Basic 1, and support our mission when you&apos;re ready for the full K-12 STEM library.
          </p>
        </div>

        {/* Development Checkout Review Notice */}
        {checkoutNotice && (
          <div className="p-4 rounded-3xl bg-indigo-50 border-2 border-indigo-300 text-indigo-950 max-w-xl mx-auto space-y-3 shadow-md animate-fade-in">
            <div className="flex items-center gap-2 text-sm font-black text-indigo-900">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Checkout Review &amp; Integration Boundary</span>
            </div>
            <p className="text-xs text-indigo-800 font-medium leading-relaxed">
              {checkoutNotice} In production, this completes via secure Paystack / Stripe webhooks. Test activation is available below.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  alert(
                    'Integration Boundary: Payment verification event simulated. In production, this grants verified paid membership idempotently.'
                  );
                  setCheckoutNotice(null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
              >
                Confirm Test Activation
              </button>
              <button
                onClick={() => setCheckoutNotice(null)}
                className="px-3 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* 3-Column Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {Object.values(PLANS_CATALOG).map((plan) => {
            const isCurrentPlan = user?.membershipTier === plan.id;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-7 flex flex-col justify-between transition-all relative ${
                  plan.highlighted
                    ? 'bg-white border-3 border-indigo-600 shadow-xl shadow-indigo-100 ring-4 ring-indigo-50 scale-[1.02]'
                    : 'bg-white border-2 border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-black uppercase px-3 py-0.5 rounded-full shadow-sm">
                    Most Popular for Families
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md inline-block">
                      {plan.badge}
                    </span>
                    <h2 className="text-xl font-black text-slate-900">{plan.name}</h2>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price Display */}
                  <div className="py-2 border-y border-slate-100">
                    <div className="text-3xl font-black text-slate-900">{plan.price.formatted}</div>
                    <div className="text-xs font-bold text-slate-400 mt-0.5">
                      {plan.price.billingInterval}
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                      Plan Capabilities:
                    </span>
                    <ul className="space-y-2">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs">
                          {feat.included ? (
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                          )}
                          <span
                            className={
                              feat.included
                                ? 'text-slate-700 font-medium'
                                : 'text-slate-400 font-normal line-through'
                            }
                          >
                            {feat.label}
                            {feat.note && (
                              <span className="ml-1 text-[10px] font-bold text-slate-400 no-underline">
                                ({feat.note})
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="pt-6">
                  {isCurrentPlan ? (
                    <button
                      disabled
                      className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 text-slate-500 font-black text-xs cursor-default flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Current Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs transition interactive-target flex items-center justify-center gap-2 shadow-md ${
                        plan.highlighted
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Transparency Pledge Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 text-xs font-medium">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-sm">Our Honest Pricing Pledge</span>
              <span>No preselected upgrades • No countdown timers • Immediate one-click cancellation • Free access preserved on downgrade</span>
            </div>
          </div>
          <Link href="/support" className="text-indigo-600 font-bold hover:underline shrink-0">
            Have Billing Questions? Contact Support →
          </Link>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs font-bold text-slate-400">
        Deaf LMS — Transparent Pricing for Inclusive Education
      </footer>
    </div>
  );
}
