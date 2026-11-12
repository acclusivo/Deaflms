'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllUsers, updateUserRole, getAllPayments } from '@/lib/api';
import { UserProfile, UserRole, PaymentRecord } from '@/lib/types';
import { RoleBadge } from '@/components/common/RoleBadge';
import {
  ArrowLeft,
  Search,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  CreditCard,
  Zap,
  Sparkles,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [usersData, paymentsData] = await Promise.all([
          getAllUsers(),
          getAllPayments(),
        ]);

        const confirmedPayments = paymentsData.filter((p) => p.status === 'confirmed');

        // Ensure any active paid customer from payments table is included in roster
        const existingEmails = new Set(usersData.map((u) => u.email.toLowerCase()));
        const synthesizedFromPayments: UserProfile[] = [];

        for (const p of confirmedPayments) {
          const email = (p.userEmail || '').toLowerCase();
          if (email && !existingEmails.has(email)) {
            existingEmails.add(email);
            synthesizedFromPayments.push({
              id: p.userId || `user-paid-${p.id}`,
              email: p.userEmail,
              displayName: p.userName || email.split('@')[0],
              role: 'student',
              approvalStatus: 'approved',
              gradeLevel: 'Active Paid Learner',
              avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
              enrolledCourseIds: [p.courseId],
            });
          }
        }

        setUsers([...usersData, ...synthesizedFromPayments]);
        setPayments(paymentsData);
      } catch (e) {
        console.error('Failed to load users and payments:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    await updateUserRole(userId, newRole);
    const refreshed = await getAllUsers();
    setUsers(refreshed);
    setUpdatingId(null);
  };

  const filtered = users.filter((u) =>
    (u.displayName || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  // Active Paid Users calculation
  const getPaidInfo = (user: UserProfile) => {
    const userPayments = payments.filter(
      (p) =>
        p.status === 'confirmed' &&
        ((p.userEmail && p.userEmail.toLowerCase() === user.email.toLowerCase()) ||
          (user.id && p.userId === user.id))
    );

    const totalPaid = userPayments.reduce((sum, p) => sum + (p.amountNgn || 0), 0);
    const courses = Array.from(new Set(userPayments.map((p) => p.courseTitle)));
    return {
      hasPaid: totalPaid > 0,
      totalPaid,
      courses,
      count: userPayments.length,
    };
  };

  const paidUsersCount = users.filter((u) => getPaidInfo(u).hasPaid).length;

  return (
    <div className="w-full">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 transition shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  User Intelligence
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {paidUsersCount} Active Paid Learners
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                User Roster & Enrolment Billing
              </h1>
              <p className="text-xs text-slate-500 font-bold">
                Identify active learners, view payment amounts, and manage portal assignments.
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user by name or email..."
              className="w-full bg-white border-2 border-slate-200 rounded-2xl py-2 pl-9 pr-4 text-xs font-bold text-slate-900 focus:border-amber-600 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Quick Summary Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Total Users</span>
            <span className="text-2xl font-black text-slate-900">{users.length}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/20 shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">Active Paid Learners</span>
            <span className="text-2xl font-black text-emerald-950">{paidUsersCount}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Free Tier Learners</span>
            <span className="text-2xl font-black text-slate-900">{Math.max(0, users.filter(u => u.role === 'student').length - paidUsersCount)}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Teachers & Staff</span>
            <span className="text-2xl font-black text-slate-900">{users.filter(u => u.role === 'teacher' || u.role === 'admin').length}</span>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-4 px-6">Learner / User</th>
                  <th className="py-4 px-6">Payment & Upgrade Status</th>
                  <th className="py-4 px-6">Current Role</th>
                  <th className="py-4 px-6">Grade / Department</th>
                  <th className="py-4 px-6">Change Portal Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold">
                {filtered.map((u) => {
                  const paidInfo = getPaidInfo(u);

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition">
                      {/* User Info */}
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img
                          src={u.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'}
                          alt={u.displayName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-900 font-extrabold">{u.displayName}</span>
                            {paidInfo.hasPaid && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                <span>Active Paid</span>
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">{u.email}</div>
                        </div>
                      </td>

                      {/* Payment & Upgrade Status */}
                      <td className="py-4 px-6">
                        {paidInfo.hasPaid ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 font-black text-xs">
                              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span>₦{paidInfo.totalPaid.toLocaleString()} Paid</span>
                            </span>
                            <div className="text-[11px] text-slate-600 font-medium max-w-[220px] truncate">
                              {paidInfo.courses.join(', ') || 'Frontend Web Development'}
                            </div>
                          </div>
                        ) : u.role === 'student' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                            <span>Free Tier (Lesson 1 Starter)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold">
                            <span>Staff / Non-Learner</span>
                          </span>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6">
                        <RoleBadge role={u.role} size="sm" />
                      </td>

                      {/* Grade Level */}
                      <td className="py-4 px-6 text-slate-600 text-xs">
                        {u.gradeLevel || 'District Cohort'}
                      </td>

                      {/* Portal Access Select */}
                      <td className="py-4 px-6">
                        <select
                          value={u.role}
                          disabled={updatingId === u.id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                          className="bg-slate-50 border-2 border-slate-200 text-xs font-black rounded-xl py-1.5 px-3 text-slate-800 focus:border-amber-500 transition interactive-target"
                        >
                          <option value="student">Student Portal</option>
                          <option value="parent">Parent Portal</option>
                          <option value="teacher">Teacher Studio</option>
                          <option value="admin">Admin Hub</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
