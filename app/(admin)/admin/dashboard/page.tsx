'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { getPlatformKPIs, getCountrySignLanguages, updateCountrySignLanguageStatus } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { CountrySignLanguageSupport, SignLanguageDialect } from '@/lib/types';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  HardDrive,
  ArrowUpRight,
  CheckCircle2,
  Settings,
  Globe,
  Languages,
  Check,
  Filter,
  Sparkles,
  X,
  AlertCircle,
  Eye,
  Lock,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [kpis, setKpis] = useState<any>(null);
  const [signLanguages, setSignLanguages] = useState<CountrySignLanguageSupport[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'locked'>('all');
  const [selectedCountry, setSelectedCountry] = useState<CountrySignLanguageSupport | null>(null);
  const [updatingCode, setUpdatingCode] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getPlatformKPIs();
      setKpis(data);
      const langs = await getCountrySignLanguages();
      setSignLanguages(langs);
    }
    load();
  }, []);

  const handleStatusChange = async (code: SignLanguageDialect, newStatus: 'active' | 'pilot' | 'in_review' | 'planned') => {
    if (code !== 'NSL') {
      setStatusMessage(`Notice: ${code} is locked for pitch focus. Only Nigeria (NSL) can be active.`);
      setTimeout(() => setStatusMessage(null), 3500);
      return;
    }
    setUpdatingCode(code);
    const updated = await updateCountrySignLanguageStatus(code, newStatus);
    setSignLanguages(updated);
    if (selectedCountry && selectedCountry.code === code) {
      const updatedItem = updated.find((c) => c.code === code);
      if (updatedItem) setSelectedCountry(updatedItem);
    }
    setUpdatingCode(null);
    setStatusMessage(`Updated ${code} status to ${newStatus.toUpperCase()}`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const filteredLanguages = signLanguages.filter((item) => {
    const isNigeria = item.code === 'NSL' || item.country.toLowerCase() === 'nigeria';
    if (filterMode === 'active') return isNigeria;
    if (filterMode === 'locked') return !isNigeria;
    return true;
  });

  const activeCount = signLanguages.filter(
    (s) => s.code === 'NSL' || s.country.toLowerCase() === 'nigeria'
  ).length;
  const lockedCount = signLanguages.filter(
    (s) => s.code !== 'NSL' && s.country.toLowerCase() !== 'nigeria'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar currentRole="admin" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Admin Header — Clean, Professional, Credible */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                Institutional Oversight Console
              </span>
              <span className="text-xs font-bold text-slate-500">
                Demonstration Environment
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome, {user?.displayName || 'Administrator'}
            </h1>

            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Oversee certified Deaf educators, support local sign languages from partner countries, review curriculum standards, inspect child safeguarding requests, and monitor storage integrity.
            </p>
          </div>
        </div>

        {/* Platform Metric Cards */}
        {kpis && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900">{kpis.totalStudents}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Enrolled Learners (Demo)
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                <Users className="w-5 h-5 text-teal-700" />
              </div>
              <div className="text-3xl font-black text-slate-900">{kpis.totalTeachers}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Deaf Educators (Demo)
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900">{kpis.publishedCourses}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Approved Modules
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <HardDrive className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900">{kpis.storageUsedGb}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Storage Allocated
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MULTINATIONAL & LOCAL SIGN LANGUAGE GOVERNANCE CONSOLE */}
        {/* Supporting Country Sign Languages, Reviewer Teams & Regional Dialect Variants */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-black shrink-0 shadow-md shadow-teal-200">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Local Sign Languages by Country
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Nigeria (NSL) Unlocked
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-black uppercase flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-slate-400" />
                    {lockedCount} Locked
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium pt-0.5">
                  Moderate national sign languages, accredited Deaf review panels, and regional school dialects.
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-xl font-black transition ${
                  filterMode === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Countries ({signLanguages.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('active')}
                className={`px-3 py-1.5 rounded-xl font-black transition ${
                  filterMode === 'active'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🟢 Active Track (Nigeria 🇳🇬)
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('locked')}
                className={`px-3 py-1.5 rounded-xl font-black transition flex items-center gap-1.5 ${
                  filterMode === 'locked'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>Locked Tracks ({lockedCount})</span>
              </button>
            </div>
          </div>

          {/* National Safeguard & Policy Notice Banner */}
          <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
              <Lock className="w-4 h-4 text-amber-800" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="font-black text-amber-950 flex flex-wrap items-center gap-2">
                <span>Curriculum Policy: Nigerian Sign Language (NSL) is the Sole Unlocked Track</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-[10px]">
                  1 Active • {lockedCount} Locked
                </span>
              </div>
              <p className="text-amber-900/85 font-medium leading-relaxed">
                To guarantee zero AI hallucinations and ensure complete community accreditation for the ACE demonstration, all international and cross-border sign languages are currently locked. All visual lessons strictly feature verified Nigerian Sign Language recorded by certified native Deaf educators in Abuja and Lagos.
              </p>
            </div>
          </div>

          {/* Toast / Notification feedback */}
          {statusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Country Sign Language Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredLanguages.map((lang) => {
              const isNigeria = lang.code === 'NSL' || lang.country.toLowerCase() === 'nigeria';
              const isLocked = !isNigeria || lang.isLocked;

              return (
                <div
                  key={lang.code}
                  className={`p-5 rounded-2xl border-2 transition flex flex-col justify-between gap-4 ${
                    isNigeria
                      ? 'bg-white border-emerald-500 ring-2 ring-emerald-100 shadow-sm relative'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Flag, Name, Code */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl leading-none">{lang.flag}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-black text-slate-900 text-sm">{lang.code}</h3>
                            <span className="text-[11px] font-bold text-slate-500">({lang.country})</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold block">{lang.region}</span>
                        </div>
                      </div>

                      {/* Status Tag */}
                      {isNigeria ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase border bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase border bg-slate-100 text-slate-600 border-slate-200 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 text-slate-400" />
                          Locked
                        </span>
                      )}
                    </div>

                    {/* Full Name & Reviewer */}
                    <div className="space-y-1">
                      <div className="text-xs font-black text-slate-900 leading-tight">
                        {lang.name}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                        {lang.reviewerTeam}
                      </p>
                    </div>

                    {/* Regional Variants Chips */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Regional School Variants:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {lang.regionalVariants.slice(0, 3).map((v) => (
                          <span
                            key={v}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              isNigeria
                                ? 'bg-emerald-50/60 text-emerald-900 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {v.split(' ')[0]}
                          </span>
                        ))}
                        {lang.regionalVariants.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                            +{lang.regionalVariants.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Controls: Learner Count & Status Display */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                      <span>{lang.learnerCount} learners</span>
                      <button
                        type="button"
                        onClick={() => setSelectedCountry(lang)}
                        className="text-teal-700 hover:text-teal-900 font-black flex items-center gap-0.5 transition"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </div>

                    {/* Status Pill / Switcher */}
                    {isNigeria ? (
                      <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] font-black rounded-xl py-2 px-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Active Standard (Sole Launch Track)</span>
                        </div>
                        <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
                          Unlocked
                        </span>
                      </div>
                    ) : (
                      <div className="w-full bg-slate-100/90 border border-slate-200 text-slate-500 text-[11px] font-black rounded-xl py-2 px-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Locked for Pitch Focus</span>
                        </div>
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                          Phase 2
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Detailed Country Inspection Modal */}
        {selectedCountry && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="country-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-teal-600/30 shadow-2xl relative space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedCountry.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 id="country-modal-title" className="text-xl font-black text-slate-900">
                        {selectedCountry.name}
                      </h3>
                    </div>
                    <p className="text-xs font-bold text-slate-500">
                      {selectedCountry.country} • {selectedCountry.region}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
                  aria-label="Close country details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Notice inside Modal */}
              {selectedCountry.code !== 'NSL' ? (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <div className="font-black text-amber-950 flex items-center gap-2">
                      <span>Track Locked on Administrator Dashboard</span>
                      <span className="px-2 py-0.2 rounded bg-amber-200/80 text-amber-900 font-extrabold text-[10px]">
                        Pitch Focus
                      </span>
                    </div>
                    <p className="text-amber-900/85 leading-relaxed font-medium">
                      {selectedCountry.name} is currently locked on the administrator dashboard. Only Nigerian Sign Language (NSL) is active to ensure zero AI hallucinations and full community accreditation during the demonstration. This track will unlock in Phase 2 in partnership with accredited local Deaf councils.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <div className="font-black text-emerald-950 flex items-center gap-2">
                      <span>Primary Active Launch Track (Nigeria 🇳🇬)</span>
                      <span className="px-2 py-0.2 rounded bg-emerald-200/80 text-emerald-900 font-extrabold text-[10px]">
                        Sole Active
                      </span>
                    </div>
                    <p className="text-emerald-900/85 leading-relaxed font-medium">
                      Fully unlocked and accredited. Over 450 verified Nigerian Sign Language signs recorded by certified Deaf educators in Abuja and Lagos.
                    </p>
                  </div>
                </div>
              )}

              {/* Panel and Review Info */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="font-black text-slate-500 uppercase text-[10px] block">
                    Accredited Review Authority:
                  </span>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {selectedCountry.reviewerTeam}
                  </div>
                  <p className="text-slate-600 font-medium pt-1 leading-relaxed">
                    {selectedCountry.notes}
                  </p>
                </div>

                {/* Regional Dialects */}
                <div className="p-3.5 bg-teal-50/60 border border-teal-200 rounded-2xl space-y-2">
                  <span className="font-black text-teal-900 uppercase text-[10px] block">
                    Regional Variants &amp; School Clusters:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCountry.regionalVariants.map((variant) => (
                      <span
                        key={variant}
                        className="px-2.5 py-1 rounded-lg bg-white border border-teal-300 font-extrabold text-teal-950 text-xs shadow-xs"
                      >
                        {variant}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-lg font-black text-slate-900 block">
                      {selectedCountry.learnerCount}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Enrolled Learners</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-lg font-black text-teal-800 block">
                      {selectedCountry.approvedVocabularyCount}+
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Verified Signs</span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-between items-center pt-2">
                {selectedCountry.code === 'NSL' ? (
                  <Link
                    href="/admin/courses"
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
                  >
                    View curriculum for {selectedCountry.code} →
                  </Link>
                ) : (
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Curriculum locked for Phase 2</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedCountry(null)}
                  className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Administrative Management Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/users"
            className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-slate-400 transition group space-y-3 interactive-target"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition" />
            </div>
            <h3 className="text-lg font-black text-slate-900">User &amp; Educator Rosters</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Assign roles, manage country sign language preferences, and oversee student cohorts.
            </p>
          </Link>

          <Link
            href="/admin/courses"
            className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-slate-400 transition group space-y-3 interactive-target"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-teal-700" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Curriculum &amp; Content Review</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Review draft vocabulary, ensure Nigerian and multinational sign standards, and approve new lessons.
            </p>
          </Link>

          <Link
            href="/user-testing"
            className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-slate-400 transition group space-y-3 interactive-target"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Child Safeguarding Logs</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Inspect parent-approved support sessions, verify zero unauthorized recording, and audit user discovery notes.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
