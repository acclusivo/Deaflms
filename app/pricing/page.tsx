'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { PLANS_CATALOG, PlanDefinition } from '@/lib/plans';
import { MembershipTier } from '@/lib/types';
import { ArrowLeft, Check, Sparkles, ShieldCheck, HeartHandshake, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';

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
    <div className="min-h-screen bg-[#F5F7FC] flex flex-col selection:bg-[#1B4EA7] selection:text-white">
      {/* Shared Navigation Header */}
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F4F6] border border-[#CCEEF1] text-[#065A63] text-xs font-black uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-[#087F8C]" />
            <span>Foundational Signs are Always Free</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#00177D] tracking-tight">
            Fair Plans for Deaf Learners, Families &amp; Schools
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] font-medium leading-relaxed">
            We never place basic communication behind a paywall. Start immediately with Free Basic 1, and support our mission when you&apos;re ready for the full K-12 STEM library.
          </p>
        </div>

        {/* Development Checkout Review Notice */}
        {checkoutNotice && (
          <div className="p-4 rounded-3xl bg-[#EEF2FF] border border-[#C7D2FE] text-[#1F2937] max-w-xl mx-auto space-y-3 shadow-md animate-fade-in">
            <div className="flex items-center gap-2 text-sm font-black text-[#00177D]">
              <Sparkles className="w-4 h-4 text-[#F4B942]" />
              <span>Checkout Review &amp; Integration Boundary</span>
            </div>
            <p className="text-xs text-[#64748B] font-medium leading-relaxed">
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
                className="px-4 py-2 rounded-xl bg-[#1B4EA7] text-white font-bold text-xs hover:bg-[#00177D] transition"
              >
                Confirm Test Activation
              </button>
              <button
                onClick={() => setCheckoutNotice(null)}
                className="px-3 py-2 rounded-xl bg-[#F5F7FC] text-[#64748B] font-bold text-xs hover:bg-[#E5EAF3] border border-[#E5EAF3] transition"
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
                    ? 'bg-white border-2 border-[#1B4EA7] shadow-xl shadow-[#1B4EA7]/10 ring-4 ring-[#1B4EA7]/10 scale-[1.02]'
                    : 'bg-white border border-[#E5EAF3] shadow-xs hover:border-[#1B4EA7]'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1B4EA7] text-white text-[11px] font-black uppercase px-3 py-0.5 rounded-full shadow-sm">
                    Most Popular for Families
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#1B4EA7] bg-[#F0F4FA] px-2.5 py-0.5 rounded-md inline-block">
                      {plan.badge}
                    </span>
                    <h2 className="text-xl font-black text-[#1F2937]">{plan.name}</h2>
                    <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price Display */}
                  <div className="py-2 border-y border-[#E5EAF3]">
                    <div className="text-3xl font-black text-[#00177D]">{plan.price.formatted}</div>
                    <div className="text-xs font-bold text-[#64748B] mt-0.5">
                      {plan.price.billingInterval}
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#1F2937] block">
                      Plan Capabilities:
                    </span>
                    <ul className="space-y-2">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs">
                          {feat.included ? (
                            <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                          ) : (
                            <Lock className="w-4 h-4 text-[#ABB8D7] shrink-0 mt-0.5" />
                          )}
                          <span
                            className={
                              feat.included
                                ? 'text-[#1F2937] font-medium'
                                : 'text-[#64748B] font-normal line-through'
                            }
                          >
                            {feat.label}
                            {feat.note && (
                              <span className="ml-1 text-[10px] font-bold text-[#64748B] no-underline">
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
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#F5F7FC] text-[#64748B] font-black text-xs cursor-default flex items-center justify-center gap-1.5 border border-[#E5EAF3]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                      Current Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs transition interactive-target flex items-center justify-center gap-2 shadow-md ${
                        plan.highlighted
                          ? 'bg-[#1B4EA7] hover:bg-[#00177D] text-white shadow-[#1B4EA7]/20'
                          : 'bg-[#00177D] hover:bg-[#1B4EA7] text-white'
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
        <div className="p-6 rounded-3xl bg-white border border-[#E5EAF3] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-[#64748B] text-xs font-medium">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#15803D] flex items-center justify-center shrink-0 font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-[#1F2937] block text-sm">Our Honest Pricing Pledge</span>
              <span>No preselected upgrades • No countdown timers • Immediate one-click cancellation • Free access preserved on downgrade</span>
            </div>
          </div>
          <Link href="/support" className="text-[#1B4EA7] font-bold hover:underline shrink-0">
            Have Billing Questions? Contact Support →
          </Link>
        </div>

        {/* Buyer Section & Pilot Invitation per Section 17 */}
        <div className="p-6 rounded-3xl bg-[#E6F4F6] border border-[#CCEEF1] text-[#065A63] space-y-3">
          <div className="flex items-center gap-2 font-black text-sm">
            <Sparkles className="w-4 h-4 text-[#087F8C]" />
            <span>Customer &amp; Buyer Model</span>
          </div>
          <p className="text-xs font-semibold leading-relaxed">
            Learners use DeafLMS. Schools, NGOs, sponsors or families may pay for access. All prices displayed are proposed prices currently being tested with potential institutional and pilot partners.
          </p>
          <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#065A63]">
              We are seeking schools and organisations to test the prototype with Deaf learners.
            </span>
            <a
              href="mailto:pilots@acclusivo.com?subject=Pilot%20Inquiry"
              className="px-4 py-2 rounded-xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-black text-xs transition text-center shrink-0 interactive-target"
            >
              Inquire for Pilot Cohorts
            </a>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-[#E5EAF3] py-6 px-4 text-center text-xs font-medium text-[#64748B] space-y-2">
        <p className="text-[#1F2937] font-semibold">
          DeafLMS is a product of Acclusivo, owned by Tech Inclusion Enterprise Ltd, Abuja, Nigeria.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[#64748B]">
          <span>&copy; {new Date().getFullYear()} Tech Inclusion Enterprise Ltd. All rights reserved.</span>
          <span>•</span>
          <Link href="/privacy" className="hover:text-[#1B4EA7] transition">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-[#1B4EA7] transition">Terms of Service</Link>
          <span>•</span>
          <Link href="/accessibility" className="hover:text-[#1B4EA7] transition">Accessibility</Link>
          <span>•</span>
          <Link href="/support" className="hover:text-[#1B4EA7] transition">Support</Link>
        </div>
      </footer>
    </div>
  );
}
