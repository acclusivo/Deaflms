'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { getAllUsers, updateUserRole } from '@/lib/api';
import { UserProfile, UserRole } from '@/lib/types';
import { RoleBadge } from '@/components/common/RoleBadge';
import { ArrowLeft, Search, UserCheck, ShieldAlert } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getAllUsers();
      setUsers(data);
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
    u.displayName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentRole="admin" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 transition shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                User Roster & Role Assignments
              </h1>
              <p className="text-xs text-slate-500 font-bold">
                Assign and modify roles for students, educators, and district administrators.
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user or email..."
              className="w-full bg-white border-2 border-slate-200 rounded-2xl py-2 pl-9 pr-4 text-xs font-bold text-slate-900 focus:border-amber-600 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Current Role</th>
                  <th className="py-4 px-6">Grade / Department</th>
                  <th className="py-4 px-6">Change Portal Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.displayName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="text-slate-900 font-extrabold">{u.displayName}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <RoleBadge role={u.role} size="sm" />
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {u.gradeLevel || 'District Cohort'}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={u.role}
                        disabled={updatingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="bg-slate-50 border-2 border-slate-200 text-xs font-black rounded-xl py-1.5 px-3 text-slate-800 focus:border-amber-500 transition interactive-target"
                      >
                        <option value="student">Student Portal</option>
                        <option value="teacher">Teacher Studio</option>
                        <option value="admin">Admin Hub</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
