'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  School,
  Building,
  Briefcase,
  UserCheck,
  Palette,
  Laptop,
  Terminal,
  Clock,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Save,
  Award,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import {
  AgeSegment,
  EducationStage,
  AdaptiveInterfaceMode,
  SignLanguageDialect,
} from '@/lib/types';
import { RoleBadge } from '@/components/common/RoleBadge';
import { Navbar } from '@/components/common/Navbar';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [displayName, setDisplayName] = useState<string>(user?.displayName || '');
  const [selectedAgeSegment, setSelectedAgeSegment] = useState<AgeSegment>(user?.ageSegment || '9-12');
  const [customAgeInput, setCustomAgeInput] = useState<string>(user?.customAge ? String(user.customAge) : '');
  const [selectedEducationStage, setSelectedEducationStage] = useState<EducationStage>(user?.educationStage || 'jss');
  const [selectedInterfaceMode, setSelectedInterfaceMode] = useState<AdaptiveInterfaceMode>(user?.interfaceMode || 'explorer');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(user?.dailyGoalMinutes || 10);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Auto-calibrate segment if custom age typed
  const handleCustomAgeChange = (val: string) => {
    setCustomAgeInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      if (num <= 8) {
        setSelectedAgeSegment('6-8');
        setSelectedEducationStage('primary');
        setSelectedInterfaceMode('storybook');
      } else if (num <= 12) {
        setSelectedAgeSegment('9-12');
        setSelectedEducationStage('jss');
        setSelectedInterfaceMode('explorer');
      } else if (num <= 17) {
        setSelectedAgeSegment('13-17');
        setSelectedEducationStage('ss');
        setSelectedInterfaceMode('youth_tech');
      } else {
        setSelectedAgeSegment('18+');
        if (selectedEducationStage === 'primary' || selectedEducationStage === 'jss' || selectedEducationStage === 'ss') {
          setSelectedEducationStage('tertiary');
        }
        setSelectedInterfaceMode('workbench');
      }
    }
  };

  const handleSegmentClick = (seg: AgeSegment) => {
    setSelectedAgeSegment(seg);
    if (seg === '6-8') {
      setSelectedEducationStage('primary');
      setSelectedInterfaceMode('storybook');
      if (!customAgeInput) setCustomAgeInput('7');
    } else if (seg === '9-12') {
      setSelectedEducationStage('jss');
      setSelectedInterfaceMode('explorer');
      if (!customAgeInput) setCustomAgeInput('10');
    } else if (seg === '13-17') {
      setSelectedEducationStage('ss');
      setSelectedInterfaceMode('youth_tech');
      if (!customAgeInput) setCustomAgeInput('15');
    } else {
      if (selectedEducationStage === 'primary' || selectedEducationStage === 'jss' || selectedEducationStage === 'ss') {
        setSelectedEducationStage('tertiary');
      }
      setSelectedInterfaceMode('workbench');
      if (!customAgeInput) setCustomAgeInput('21');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const customAge = customAgeInput ? parseInt(customAgeInput, 10) : undefined;

    updateProfile({
      displayName: displayName.trim() || user?.displayName,
      ageSegment: selectedAgeSegment,
      customAge,
      educationStage: selectedEducationStage,
      interfaceMode: selectedInterfaceMode,
      dailyGoalMinutes,
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('deaflms_selected_age_segment', selectedAgeSegment);
      localStorage.setItem('deaflms_education_stage', selectedEducationStage);
      localStorage.setItem('deaflms_interface_mode', selectedInterfaceMode);
      if (customAge) {
        localStorage.setItem('deaflms_custom_age', String(customAge));
      }
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const educationStages = [
    {
      id: 'primary' as EducationStage,
      label: 'Primary School (Basic 1–6)',
      category: 'K-12 Elementary',
      icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
      desc: 'Visual picture cards, fingerspelling alphabet cards, and introductory computer identification.',
      defaultMode: 'storybook' as AdaptiveInterfaceMode,
    },
    {
      id: 'jss' as EducationStage,
      label: 'Junior Secondary School (JSS 1–3)',
      category: 'K-12 Middle School',
      icon: <School className="w-4 h-4 text-teal-600" />,
      desc: 'Computer hardware components, AnySign QWERTY touch-typing, and digital exploration.',
      defaultMode: 'explorer' as AdaptiveInterfaceMode,
    },
    {
      id: 'ss' as EducationStage,
      label: 'Senior Secondary School (SS 1–3)',
      category: 'K-12 Secondary',
      icon: <GraduationCap className="w-4 h-4 text-indigo-600" />,
      desc: 'Visual STEM science vocabulary, introductory web markup structure, and applied sign dialogue.',
      defaultMode: 'youth_tech' as AdaptiveInterfaceMode,
    },
    {
      id: 'tertiary' as EducationStage,
      label: 'Tertiary Education (University / College)',
      category: 'Higher Education',
      icon: <Building className="w-4 h-4 text-blue-600" />,
      desc: 'Advanced technical signs, frontend engineering labs, computer science theory, and project portfolios.',
      defaultMode: 'workbench' as AdaptiveInterfaceMode,
    },
    {
      id: 'no_formal_school' as EducationStage,
      label: 'No Formal School',
      category: 'Community & Self-Paced',
      icon: <User className="w-4 h-4 text-amber-600" />,
      desc: 'Intuitive picture-anchored storyboards and everyday practical signs with zero academic prerequisites.',
      defaultMode: 'storybook' as AdaptiveInterfaceMode,
    },
    {
      id: 'employed' as EducationStage,
      label: 'Employed Practitioner',
      category: 'Workplace Skills',
      icon: <Briefcase className="w-4 h-4 text-teal-700" />,
      desc: 'Workplace communication, professional digital workflows, fast typing speed, and career tools.',
      defaultMode: 'workbench' as AdaptiveInterfaceMode,
    },
    {
      id: 'professional' as EducationStage,
      label: 'Professional / Software Engineer',
      category: 'Industry Career',
      icon: <UserCheck className="w-4 h-4 text-slate-800" />,
      desc: 'Full web engineering workbench, custom accessibility tokens, DOM events, and mentorship workflows.',
      defaultMode: 'workbench' as AdaptiveInterfaceMode,
    },
  ];

  const interfaceModes = [
    {
      id: 'storybook' as AdaptiveInterfaceMode,
      name: 'Visual Storybook Mode',
      badge: '🎨 Picture-Rich & High Visual Density',
      icon: <Palette className="w-5 h-5 text-emerald-600" />,
      desc: 'Dual-pane illustrated storybooks, visual flashcards, large touch targets, zero technical jargon.',
      bestFor: 'Primary School (Basic 1–6) & Ages 6–8',
      border: 'border-emerald-600 ring-2 ring-emerald-100',
    },
    {
      id: 'explorer' as AdaptiveInterfaceMode,
      name: 'Interactive Explorer Mode',
      badge: '💻 Guided Steps & Hardware Tools',
      icon: <Laptop className="w-5 h-5 text-teal-600" />,
      desc: 'AnySign fingerspelling QWERTY keyboard, hardware component explorer, step-by-step guidance.',
      bestFor: 'Junior Secondary (JSS 1–3) & Ages 9–12',
      border: 'border-teal-600 ring-2 ring-teal-100',
    },
    {
      id: 'youth_tech' as AdaptiveInterfaceMode,
      name: 'Youth Tech & Logic Mode',
      badge: '🚀 STEM Visuals & Code Logic',
      icon: <GraduationCap className="w-5 h-5 text-indigo-600" />,
      desc: 'Space science signs, HTML tags preview, slow-motion sign playback (0.5x, 0.75x), logic puzzles.',
      bestFor: 'Senior Secondary (SS 1–3) & Ages 13–17',
      border: 'border-indigo-600 ring-2 ring-indigo-100',
    },
    {
      id: 'workbench' as AdaptiveInterfaceMode,
      name: 'Career Code Workbench Mode',
      badge: '⚡ Pro Developer Environment',
      icon: <Terminal className="w-5 h-5 text-slate-800" />,
      desc: 'Split-screen live code editor, in-browser code execution, dev console, professional career modules.',
      bestFor: 'Tertiary, Employed, Professional & Ages 18+',
      border: 'border-slate-800 ring-2 ring-slate-100',
    },
  ];

  const dashboardRoute =
    user?.role === 'teacher'
      ? '/teacher/dashboard'
      : user?.role === 'admin'
        ? '/admin/dashboard'
        : '/student/dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-teal-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <Link
              href={dashboardRoute}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Profile &amp; Learning Baseline
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Calibrate your age segment, K-12/tertiary class, and adaptive interface so DeafLMS adapts to your needs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/onboarding"
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-black text-slate-700 transition flex items-center gap-1.5 shadow-xs"
            >
              <Sliders className="w-3.5 h-3.5 text-teal-700" />
              <span>Restart Full Onboarding</span>
            </Link>
            <Link
              href={dashboardRoute}
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-black transition shadow-xs flex items-center gap-1.5"
            >
              <span>View Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-3 animate-fade-in shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Your baseline profile settings have been saved! DeafLMS has dynamically adapted your dashboard and interface.
            </span>
          </div>
        )}

        {/* User Identity Snapshot Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'}
              alt={user?.displayName || 'User'}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  {user?.displayName || 'Active Learner'}
                </h2>
                <RoleBadge role={user?.role || 'student'} />
              </div>
              <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
              {user?.schoolOrOrganization && (
                <span className="text-[11px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-md inline-block">
                  {user.schoolOrOrganization}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Total Stars
              </span>
              <span className="text-lg font-black text-amber-500 flex items-center gap-1 justify-end">
                ⭐ {user?.totalStars || 10}
              </span>
            </div>
          </div>
        </div>

        {/* Baseline Settings Form */}
        <form onSubmit={handleSave} className="space-y-8">

          {/* Section 1: Display Name */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Personal Information</h3>
              <p className="text-xs text-slate-500 font-medium">Update your profile display name</p>
            </div>
            <div className="max-w-md space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Amina Musa"
                className="w-full py-2 px-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-teal-700 focus:outline-none bg-slate-50/50"
              />
            </div>
          </div>

          {/* Section 2: Age Segment & Exact Age Baseline */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 block">
                  Baseline Calibration 1
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Age Segment &amp; Exact Age
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Sets instructional pace, vocabulary complexity, and lesson difficulty.
                </p>
              </div>

              {/* Exact Age Input */}
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700 shrink-0">Exact Age:</label>
                <input
                  type="number"
                  min={4}
                  max={99}
                  value={customAgeInput}
                  onChange={(e) => handleCustomAgeChange(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-20 py-1 px-2.5 rounded-lg border border-slate-300 text-xs font-black text-slate-900 text-center bg-white"
                />
                {customAgeInput && (
                  <span className="text-[11px] font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    Ages {selectedAgeSegment}
                  </span>
                )}
              </div>
            </div>

            {/* 4 Age Segment Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: '6-8' as AgeSegment, label: 'Ages 6–8', title: 'Early Visual Literacy', badge: 'Primary Basic 1–3' },
                { id: '9-12' as AgeSegment, label: 'Ages 9–12', title: 'Digital Basics & Hardware', badge: 'JSS Middle School' },
                { id: '13-17' as AgeSegment, label: 'Ages 13–17', title: 'Youth STEM & Web Logic', badge: 'SS High School' },
                { id: '18+' as AgeSegment, label: 'Ages 18+', title: 'Frontend Engineering', badge: 'Tertiary & Career' },
              ].map((seg) => {
                const isSelected = selectedAgeSegment === seg.id;
                return (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() => handleSegmentClick(seg.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all interactive-target flex flex-col justify-between space-y-2 ${isSelected
                        ? 'bg-teal-50/70 border-teal-700 shadow-sm ring-2 ring-teal-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900">{seg.label}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-700" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-800 leading-snug">{seg.title}</span>
                    <span className="text-[10px] font-medium text-slate-500 block">{seg.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Class & Education Stage (K-12 & Beyond) */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs space-y-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block">
                Baseline Calibration 2
              </span>
              <h3 className="text-base font-black text-slate-900">
                Class / Education Stage (K-12 &amp; Beyond)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Aligns syllabus progression with school grades or professional background.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {educationStages.map((stage) => {
                const isSelected = selectedEducationStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => {
                      setSelectedEducationStage(stage.id);
                      setSelectedInterfaceMode(stage.defaultMode);
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all interactive-target flex flex-col justify-between space-y-2.5 ${isSelected
                        ? 'bg-indigo-50/70 border-indigo-600 shadow-sm ring-2 ring-indigo-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {stage.icon}
                        <h4 className="text-xs font-black text-slate-900">{stage.label}</h4>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      {stage.desc}
                    </p>
                    <span className="text-[10px] font-black uppercase text-indigo-800 bg-white px-2 py-0.5 rounded border border-indigo-100 self-start">
                      {stage.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Adaptive Platform Interface Mode */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs space-y-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 block">
                Baseline Calibration 3
              </span>
              <h3 className="text-base font-black text-slate-900">
                Adaptive Interface Mode
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                One platform that dynamically adapts its layout, picture density, and tools to match your preference.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {interfaceModes.map((mode) => {
                const isSelected = selectedInterfaceMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedInterfaceMode(mode.id)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all interactive-target flex flex-col justify-between space-y-3 ${isSelected
                        ? `bg-slate-50/70 ${mode.border} shadow-sm`
                        : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                          {mode.icon}
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 block">
                            {mode.badge}
                          </span>
                          <h4 className="text-sm font-black text-slate-900">{mode.name}</h4>
                        </div>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {mode.desc}
                    </p>

                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 self-start">
                      Best for: {mode.bestFor}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Daily Habit Pace */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Daily Learning Habit</h3>
              <p className="text-xs text-slate-500 font-medium">Set your daily commitment</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { min: 5, label: 'Casual', desc: '5 mins/day • 1 visual module' },
                { min: 10, label: 'Regular (Recommended)', desc: '10 mins/day • Video + exercise' },
                { min: 20, label: 'Fast-Track', desc: '20 mins/day • Deep coding sandbox' },
              ].map((pace) => {
                const isSelected = dailyGoalMinutes === pace.min;
                return (
                  <button
                    key={pace.min}
                    type="button"
                    onClick={() => setDailyGoalMinutes(pace.min)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all interactive-target flex items-center justify-between ${isSelected
                        ? 'bg-teal-50 border-teal-700 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{pace.label}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{pace.desc}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-700" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <Link
              href={dashboardRoute}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 transition"
            >
              ← Cancel &amp; Return to Dashboard
            </Link>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 interactive-target"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </main>

      <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-200 mt-12">
        DeafLMS • Adaptive Learning Platform &amp; Baseline Profile Architecture
      </footer>
    </div>
  );
}
