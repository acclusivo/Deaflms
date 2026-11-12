'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getUserPayments, getUserEnrollments } from '@/lib/api';
import { PaymentRecord, CourseEnrollment } from '@/lib/types';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Building2,
  Copy,
  Check,
  Filter,
  Loader2,
} from 'lucide-react';

export default function StudentPaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'rejected'>('all');
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const userId = user?.id || 'user-student-1';
        const [payData, enrData] = await Promise.all([
          getUserPayments(userId),
          getUserEnrollments(userId),
        ]);
        setPayments(payData);
        setEnrollments(enrData);
      } catch (e) {
        console.error('Failed to load learner payments:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const copyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const filteredPayments = payments.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const confirmedCount = payments.filter((p) => p.status === 'confirmed').length;
  const pendingCount = payments.filter((p) => p.status === 'pending').length;

  return (
    <div className="w-full">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-0.5 rounded-md border border-teal-200">
                Billing &amp; Access Status
              </span>
              <span className="text-xs font-bold text-slate-500">
                Official Receipts
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Payment &amp; Enrolment History
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Track real-time status of your Selar instant payments and manual bank transfers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/checkout"
              className="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Unlock New Course</span>
            </Link>
          </div>
        </div>

        {/* Quick Stat Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Enrolments</div>
            <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>{enrollments.length}</span>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Full Access Unlocked
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmed Payments</div>
            <div className="text-2xl font-black text-emerald-700 flex items-center gap-2">
              <span>{confirmedCount}</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Awaiting Verification</div>
            <div className="text-2xl font-black text-amber-700 flex items-center gap-2">
              <span>{pendingCount}</span>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                filter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records ({payments.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('confirmed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                filter === 'confirmed' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Confirmed ({confirmedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                filter === 'pending' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({pendingCount})
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredPayments.length} of {payments.length} transactions
          </span>
        </div>

        {/* Transactions Table / Cards */}
        {loading ? (
          <div className="py-16 bg-white rounded-3xl border-2 border-slate-200 text-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-teal-700 mx-auto" />
            <span className="text-xs font-bold text-slate-500 block">Loading Billing History...</span>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-16 bg-white rounded-3xl border-2 border-slate-200 text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">No payment records found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {filter === 'all'
                  ? 'You haven’t completed any paid enrolments yet. Free Basic 1 curriculum is included by default.'
                  : `No records matching status "${filter}".`}
              </p>
            </div>
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-teal-700 text-white font-black text-xs hover:bg-teal-800 transition"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Explore Paid Courses</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPayments.map((record) => {
              const isConfirmed = record.status === 'confirmed';
              const isPending = record.status === 'pending';
              const isRejected = record.status === 'rejected';

              return (
                <div
                  key={record.id}
                  className={`bg-white rounded-2xl p-5 border-2 transition shadow-xs space-y-3 ${
                    isConfirmed
                      ? 'border-emerald-200 hover:border-emerald-300'
                      : isPending
                      ? 'border-amber-200 hover:border-amber-300 bg-amber-50/20'
                      : 'border-rose-200 hover:border-rose-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 ${
                          record.method === 'selar_instant'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-teal-50 text-teal-800'
                        }`}
                      >
                        {record.method === 'selar_instant' ? (
                          <Zap className="w-5 h-5 text-amber-600 fill-amber-500" />
                        ) : (
                          <Building2 className="w-5 h-5 text-teal-700" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-black text-slate-900">{record.courseTitle}</h3>
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                              isConfirmed
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : isPending
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                          >
                            {isConfirmed && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {isPending && <Clock className="w-3 h-3 text-amber-600 animate-pulse" />}
                            {isRejected && <AlertCircle className="w-3 h-3 text-rose-600" />}
                            <span>{isConfirmed ? 'Confirmed & Active' : isPending ? 'Pending Review' : 'Rejected'}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="font-bold">
                            {record.method === 'selar_instant' ? 'Selar Instant Gateway' : `Manual Transfer via ${record.bankName || 'Bank'}`}
                          </span>
                          <span>•</span>
                          <span>Date: {new Date(record.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="font-black text-slate-900">
                            {record.amountNgn === 0 ? 'Free Basic 1' : `₦${record.amountNgn.toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {isConfirmed && (
                        <Link
                          href={`/student/courses/${record.courseId}`}
                          className="py-2 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs shadow-xs transition flex items-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open Course</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      {isPending && (
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100/70 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Awaiting Reconciliation</span>
                        </span>
                      )}

                      {isRejected && (
                        <Link
                          href={`/checkout?course=${record.courseId}`}
                          className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition"
                        >
                          Retry Payment
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Reference & Proof Details */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-500">Ref:</span>
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {record.reference}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyRef(record.reference)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded"
                        title="Copy Reference"
                      >
                        {copiedRef === record.reference ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {record.adminNotes && (
                      <div className="text-[11px] text-amber-800 italic bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        Admin Note: {record.adminNotes}
                      </div>
                    )}

                    {record.proofUrl && (
                      <a
                        href={record.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-700 hover:underline flex items-center gap-1 font-bold"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View Transfer Receipt</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
