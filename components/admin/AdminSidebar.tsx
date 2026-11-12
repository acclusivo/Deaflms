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
      <div className="md:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 py-2 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {navItems.map((item) => {
            const active = isItemActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition interactive-target ${active
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-amber-400' : 'text-slate-600'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black">
                    {item.badge.split(' ')[0]}
                  </span>
                )}
                {item.tag && (
                  <span className="ml-0.5 px-1 py-0.2 rounded bg-teal-100 text-teal-800 text-[9px] font-black uppercase">
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
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 shrink-0 bg-white border-r border-slate-200 sticky top-16 h-[calc(100vh-4rem)] p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Sidebar Institutional Title */}
          <div className="px-2 pt-1">
            {/* <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Institutional Menu
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live NSL
              </span>
            </div> */}
            <h2 className="text-sm font-black text-slate-900 mt-1">
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
                    ? 'bg-amber-500/10 text-amber-950 font-black border-2 border-amber-400/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border-2 border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition ${active
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="truncate text-slate-900 font-extrabold flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {item.tag && (
                          <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-teal-100 text-teal-800 border border-teal-200">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium truncate">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-slate-950 shadow-2xs shrink-0 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: System Status & User Profile Actions */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          {/* Quick System Badge */}
          {/* <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                Zero-Trust Isolation
              </span>
              <span className="text-[10px] font-black text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                Active
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Cross-role edge boundary guarded. Access restricted to accredited administrators.
            </p>
          </div> */}

          {/* Current Administrator Card */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-amber-50/60 border border-amber-200/60">
            <Link
              href="/profile"
              className="flex items-center gap-2.5 min-w-0 group interactive-target"
              title="Admin Profile Settings"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-800 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition">
                {(user?.displayName || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-xs font-black text-slate-900 truncate group-hover:text-amber-900 transition">
                  {user?.displayName || 'Dr. Patricia Okon'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium truncate">
                  Platform Admin
                </div>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200 shrink-0"
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
