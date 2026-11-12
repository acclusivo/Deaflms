'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  BookOpen,
  CreditCard,
  Users,
  Layers,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Activity,
  CheckCircle2,
  Clock,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, getPendingTeachers } = useAuth();
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    if (getPendingTeachers) {
      try {
        const pending = getPendingTeachers();
        setPendingCount(pending.length);
      } catch (e) {
        console.warn('Could not read pending teachers:', e);
      }
    }
  }, [getPendingTeachers, pathname]);

  const navItems = [
    {
      label: 'Home',
      href: '/admin/dashboard',
      icon: Home,
      exact: true,
      description: 'Institutional KPIs & Overview',
    },
    {
      label: 'Courses',
      href: '/admin/courses',
      icon: BookOpen,
      exact: false,
      description: 'Curriculum & Tier Audits',
    },
    {
      label: 'Payments',
      href: '/admin/payments',
      icon: CreditCard,
      exact: false,
      description: 'Direct Bank & Selar Gateway',
    },
    {
      label: 'Users',
      href: '/admin/users',
      icon: Users,
      exact: false,
      badge: pendingCount > 0 ? `${pendingCount} Pending` : undefined,
      badgeVariant: 'amber',
      description: 'Rosters & Teacher Approvals',
    },
    {
      label: 'Content Studio',
      href: '/admin/content',
      icon: Layers,
      exact: false,
      tag: 'Sanity',
      description: 'Headless CMS & Media',
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      exact: false,
      description: 'System Health & Engine',
    },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isItemActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* MOBILE HORIZONTAL NAVIGATION SUB-BAR (visible on screens < md)             */}
      {/* ========================================================================= */}
      <div className="md:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5EAF3] px-3 py-2 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {navItems.map((item) => {
            const active = isItemActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition interactive-target ${active
                  ? 'bg-[#00177D] text-white shadow-xs'
                  : 'bg-[#F5F7FC] text-[#1F2937] hover:bg-[#E5EAF3] border border-[#E5EAF3]'
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#F4B942]' : 'text-[#64748B]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-md bg-[#FEF7E8] text-[#8F6010] border border-[#F4B942]/40 text-[10px] font-black">
                    {item.badge.split(' ')[0]}
                  </span>
                )}
                {item.tag && (
                  <span className="ml-0.5 px-1 py-0.2 rounded bg-[#E6F4F6] text-[#065A63] border border-[#CCEEF1] text-[9px] font-black uppercase">
                    {item.tag}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP VERTICAL SIDEBAR (sticky on md+ screens)                          */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 shrink-0 bg-white border-r border-[#E5EAF3] sticky top-16 h-[calc(100vh-4rem)] p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Sidebar Institutional Title */}
          <div className="px-2 pt-1">
            <h2 className="text-sm font-black text-[#00177D] mt-1">
              Admin Workspace
            </h2>
          </div>

          {/* Navigation Items List */}
          <nav className="space-y-1.5" aria-label="Administrator Navigation">
            {navItems.map((item) => {
              const active = isItemActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition interactive-target ${active
                    ? 'bg-[#F0F4FA] text-[#00177D] font-black border border-[#1B4EA7] shadow-xs'
                    : 'text-[#64748B] hover:text-[#1F2937] hover:bg-[#F5F7FC] border border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition ${active
                        ? 'bg-[#1B4EA7] text-white shadow-xs'
                        : 'bg-[#F5F7FC] text-[#64748B] group-hover:bg-[#E5EAF3] group-hover:text-[#1F2937]'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="truncate text-[#1F2937] font-extrabold flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {item.tag && (
                          <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-[#E6F4F6] text-[#065A63] border border-[#CCEEF1]">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#64748B] font-medium truncate">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#FEF7E8] text-[#8F6010] border border-[#F4B942]/40 shadow-2xs shrink-0 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: System Status & User Profile Actions */}
        <div className="pt-4 border-t border-[#E5EAF3] space-y-3">
          {/* Current Administrator Card */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-[#F5F7FC] border border-[#E5EAF3]">
            <Link
              href="/profile"
              className="flex items-center gap-2.5 min-w-0 group interactive-target"
              title="Admin Profile Settings"
            >
              <div className="w-8 h-8 rounded-xl bg-[#00177D] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition">
                {(user?.displayName || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-xs font-black text-[#1F2937] truncate group-hover:text-[#00177D] transition">
                  {user?.displayName || 'Dr. Patricia Okon'}
                </div>
                <div className="text-[10px] text-[#64748B] font-medium truncate">
                  Platform Admin
                </div>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-xl text-[#64748B] hover:text-[#B91C1C] hover:bg-red-50 transition border border-transparent hover:border-red-200 shrink-0"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
