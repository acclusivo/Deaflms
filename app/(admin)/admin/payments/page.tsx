'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getAllPayments, OFFICIAL_BANK_DETAILS } from '@/lib/api';
import { PaymentRecord } from '@/lib/types';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Search,
  Check,
  X,
  CreditCard,
  Building2,
  Zap,
  Filter,
  Loader2,
  Eye,
  FileText,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Copy,
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'confirmed' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const records = await getAllPayments();
      setPayments(records);
    } catch (e) {
      console.error('Failed to load admin payments:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleVerify = async (paymentId: string, action: 'confirm' | 'reject') => {
    setActionLoading(paymentId);
    try {
      const res = await fetch('/api/billing/manual/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          action,
          adminNotes: adminNoteInput.trim() || undefined,
          reviewerName: user?.displayName || 'Administrator',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      // Update state locally
      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? data.payment : p))
      );

      if (selectedPayment?.id === paymentId) {
        setSelectedPayment(data.payment);
      }

      showToast(
        action === 'confirm'
          ? 'Enrolment verified and course access granted to learner!'
          : 'Payment marked as rejected with note saved.'
      );
      setAdminNoteInput('');
    } catch (e: any) {
      console.error('Action error:', e);
      showToast(e.message || 'Verification update failed');
    } finally {
      setActionLoading(null);
    }
  };

  // Metrics
  const totalRevenue = payments
    .filter((p) => p.status === 'confirmed')
    .reduce((sum, p) => sum + (p.amountNgn || 0), 0);

  const pendingList = payments.filter((p) => p.status === 'pending');
  const confirmedList = payments.filter((p) => p.status === 'confirmed');
  const selarList = payments.filter((p) => p.method === 'selar_instant');
  const manualList = payments.filter((p) => p.method === 'manual_bank_transfer');
  
  // Unique Active Paid Learners
  const activePaidLearnersCount = new Set(
    confirmedList.map((p) => (p.userEmail || p.userName || '').toLowerCase()).filter(Boolean)
  ).size;

  // Filtered payments
  const displayedPayments = payments.filter((p) => {
    // Tab filter
    if (activeTab === 'pending' && p.status !== 'pending') return false;
    if (activeTab === 'confirmed' && p.status !== 'confirmed') return false;
    if (activeTab === 'rejected' && p.status !== 'rejected') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.userName?.toLowerCase().includes(q);
      const matchEmail = p.userEmail?.toLowerCase().includes(q);
      const matchRef = p.reference?.toLowerCase().includes(q);
      const matchBank = p.bankName?.toLowerCase().includes(q);
      const matchSender = p.senderName?.toLowerCase().includes(q);
      const matchCourse = p.courseTitle?.toLowerCase().includes(q);
      return matchName || matchEmail || matchRef || matchBank || matchSender || matchCourse;
    }
    return true;
  });

  return (
    <div className="w-full">

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white text-xs font-black shadow-2xl flex items-center gap-2 animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-50 px-3 py-0.5 rounded-md border border-amber-300">
                Institutional Finance Console
              </span>
              <span className="text-xs font-bold text-slate-500">
                Dual Payment Gateway (Selar + Wema Bank Manual)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Payment Verification &amp; Enrolments
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Reconcile incoming direct bank transfers against bank statement narration and monitor instant Selar automated enrolments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchPayments}
              className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 font-black text-xs text-slate-700 transition flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Records</span>
            </button>

            <Link
              href="/admin/dashboard"
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition"
            >
              Back to Admin
            </Link>
          </div>
        </div>

        {/* Executive Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-teal-700" />
              <span>Total Revenue (NGN)</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-900">
              ₦{totalRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold">
              {confirmedList.length} Confirmed Transactions
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/30 shadow-xs space-y-1">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Active Paid Learners</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-950">
              {activePaidLearnersCount}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold">
              Verified & Full Access Unlocked
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Selar Instant Enrolments</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {selarList.length}
            </div>
            <div className="text-[11px] text-teal-700 font-bold">
              100% Automated via Webhook
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/30 shadow-xs space-y-1">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Pending Bank Review</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-950">
              {pendingList.length}
            </div>
            <div className="text-[11px] text-amber-800 font-bold">
              Direct Wema Bank Transfers
            </div>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Review ({pendingList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Submissions ({payments.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('confirmed')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                activeTab === 'confirmed'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmed ({confirmedList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rejected')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'rejected'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rejected
            </button>
          </div>

          {/* Search Box */}
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by learner, ref, bank..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 text-xs font-medium bg-white"
            />
          </div>
        </div>

        {/* Verification Queue / Table */}
        {loading ? (
          <div className="py-20 bg-white rounded-3xl border-2 border-slate-200 text-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-teal-700 mx-auto" />
            <span className="text-xs font-bold text-slate-500 block">Loading Verification Queue...</span>
          </div>
        ) : displayedPayments.length === 0 ? (
          <div className="py-20 bg-white rounded-3xl border-2 border-slate-200 text-center p-6 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-base font-black text-slate-800">No records found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeTab === 'pending'
                ? 'All manual transfers have been verified! No pending items in the reconciliation queue.'
                : 'No payments match the current filter or search criteria.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Learner / Contact</th>
                    <th className="py-3 px-4">Course Enrolment</th>
                    <th className="py-3 px-4">Gateway / Bank</th>
                    <th className="py-3 px-4">Reference Code</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedPayments.map((p) => {
                    const isPending = p.status === 'pending';
                    const isConfirmed = p.status === 'confirmed';
                    const isRejected = p.status === 'rejected';

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        {/* Learner */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-black text-slate-900 text-sm">{p.userName}</span>
                            {isConfirmed && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                <span>Active Paid User</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">{p.userEmail}</div>
                          {p.senderName && p.senderName !== p.userName && (
                            <div className="text-[10px] text-teal-800 font-bold mt-0.5">
                              Sender: {p.senderName}
                            </div>
                          )}
                        </td>

                        {/* Course */}
                        <td className="py-3.5 px-4 font-bold text-slate-800 max-w-[200px] truncate">
                          {p.courseTitle}
                        </td>

                        {/* Gateway / Bank */}
                        <td className="py-3.5 px-4">
                          {p.method === 'selar_instant' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span>Selar Instant</span>
                            </span>
                          ) : (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 text-[11px] font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                <Building2 className="w-3 h-3 text-teal-700" />
                                <span>{p.bankName || 'Direct Transfer'}</span>
                              </span>
                              {p.transferDate && (
                                <div className="text-[10px] text-slate-500">
                                  Sent: {p.transferDate}
                                </div>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Reference */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                            <span>{p.reference}</span>
                            <button
                              type="button"
                              onClick={() => copyRef(p.reference)}
                              className="text-slate-400 hover:text-slate-700"
                              title="Copy Reference"
                            >
                              {copiedRef === p.reference ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 font-black">
                          <span className="inline-block text-xs font-black text-emerald-950 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-lg">
                            {p.amountNgn === 0 ? 'Free' : `₦${p.amountNgn.toLocaleString()}`}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
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
                            <span>{isConfirmed ? 'Confirmed' : isPending ? 'Pending' : 'Rejected'}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Inspect proof button */}
                            <button
                              type="button"
                              onClick={() => setSelectedPayment(p)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                              title="Inspect Details / Proof"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Direct confirm/reject for pending items */}
                            {isPending && (
                              <>
                                <button
                                  type="button"
                                  disabled={actionLoading === p.id}
                                  onClick={() => handleVerify(p.id, 'confirm')}
                                  className="py-1 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[11px] transition shadow-xs flex items-center gap-1 disabled:opacity-50"
                                  title="Reconciled & Approve"
                                >
                                  {actionLoading === p.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                  <span>Confirm</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={actionLoading === p.id}
                                  onClick={() => handleVerify(p.id, 'reject')}
                                  className="py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold text-[11px] transition border border-slate-200"
                                  title="Reject Submission"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </>
                            )}

                            {isConfirmed && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Enrolment Active
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Verification Modal / Drawer */}
        {selectedPayment && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 border-2 border-slate-200 shadow-2xl space-y-4 animate-scale-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-black">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Transfer Reconciler</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Payment ID: {selectedPayment.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Learner Name:</span>
                  <span className="font-black text-slate-900">{selectedPayment.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Learner Email:</span>
                  <span className="font-mono text-slate-900">{selectedPayment.userEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Course Target:</span>
                  <span className="font-bold text-slate-900">{selectedPayment.courseTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Narration / Reference:</span>
                  <span className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {selectedPayment.reference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Amount Due:</span>
                  <span className="font-black text-emerald-700 text-sm">
                    ₦{selectedPayment.amountNgn.toLocaleString()}
                  </span>
                </div>
                {selectedPayment.bankName && (
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-500">Sending Bank:</span>
                    <span className="font-bold text-slate-900">{selectedPayment.bankName}</span>
                  </div>
                )}
                {selectedPayment.senderName && (
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-500">Sender Account Name:</span>
                    <span className="font-bold text-slate-900">{selectedPayment.senderName}</span>
                  </div>
                )}
                {selectedPayment.reviewedBy && (
                  <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>Reviewed By:</span>
                    <span>{selectedPayment.reviewedBy} at {new Date(selectedPayment.reviewedAt || '').toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Receipt Preview */}
              {selectedPayment.proofUrl && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Transfer Receipt Attachment</label>
                  <div className="rounded-xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100 flex items-center justify-center">
                    <img
                      src={selectedPayment.proofUrl}
                      alt="Transfer Receipt"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Admin Note input */}
              {selectedPayment.status === 'pending' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Admin Verification Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="e.g. Reconciled with Wema Bank statement 06/11"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-700/20"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
                  className="py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
                >
                  Close
                </button>

                {selectedPayment.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      disabled={actionLoading === selectedPayment.id}
                      onClick={() => handleVerify(selectedPayment.id, 'reject')}
                      className="py-2.5 px-4 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition"
                    >
                      Reject Proof
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading === selectedPayment.id}
                      onClick={() => handleVerify(selectedPayment.id, 'confirm')}
                      className="py-2.5 px-5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-black shadow-md transition flex items-center gap-1.5"
                    >
                      {actionLoading === selectedPayment.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Confirm &amp; Unlock Enrolment</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
