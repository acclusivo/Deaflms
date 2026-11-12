'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import {

  GraduationCap,
  Users,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Flame,
  Clock,
  Award,
  VolumeX,
  Compass,
  Lock,
  Laptop,
  Terminal,
  Zap,
  School,
  Building,
  UserCheck,
  Layout,
  Palette,
  Eye,
  Sliders,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import {
  AgeSegment,
  EducationStage,
  AdaptiveInterfaceMode,
  SignLanguageDialect,
} from '@/lib/types';

interface DialectOption {
  code: SignLanguageDialect;
  name: string;
  nativeName?: string;
  flag: string;
  region: string;
  description: string;
  isAvailable: boolean;
  priorityBadge?: string;
  comingSoonText?: string;
}

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateProfile } = useAuth();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  // Track / Age Segment State
  const trackParam = searchParams.get('track');
  const courseParam = searchParams.get('course');

  const [selectedAgeSegment, setSelectedAgeSegment] = useState<AgeSegment>(() => {
    if (courseParam === 'course-frontend-web-1' || trackParam === '18+') return '18+';
    if (courseParam === 'course-digital-literacy-1' || trackParam === '9-12') return '9-12';
    if (courseParam === 'course-reading-storybook-1' || trackParam === '6-8') return '6-8';
    if (courseParam === 'course-hearing-nsl-1' || trackParam === '13-17') return '13-17';
    if (user?.ageSegment) return user.ageSegment;
    return '9-12';
  });

  const [customAgeInput, setCustomAgeInput] = useState<string>(() => {
    return user?.customAge ? String(user.customAge) : '';
  });

  // Education Stage State (K-12 & Beyond)
  const [selectedEducationStage, setSelectedEducationStage] = useState<EducationStage>(() => {
    if (user?.educationStage) return user.educationStage;
    if (selectedAgeSegment === '6-8') return 'primary';
    if (selectedAgeSegment === '9-12') return 'jss';
    if (selectedAgeSegment === '13-17') return 'ss';
    if (selectedAgeSegment === '18+') return 'tertiary';
    return 'jss';
  });

  // Adaptive Interface Mode State
  const [selectedInterfaceMode, setSelectedInterfaceMode] = useState<AdaptiveInterfaceMode>(() => {
    if (user?.interfaceMode) return user.interfaceMode;
    if (selectedAgeSegment === '6-8') return 'storybook';
    if (selectedAgeSegment === '9-12') return 'explorer';
    if (selectedAgeSegment === '13-17') return 'youth_tech';
    return 'workbench';
  });

  const [selectedDialect, setSelectedDialect] = useState<SignLanguageDialect>('NSL');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(10);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (trackParam && ['6-8', '9-12', '13-17', '18+'].includes(trackParam)) {
      setSelectedAgeSegment(trackParam as AgeSegment);
    }
  }, [trackParam]);

  // Handle custom age change and auto-match segment
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

  const handleSegmentClick = (segment: AgeSegment) => {
    setSelectedAgeSegment(segment);
    if (segment === '6-8') {
      setSelectedEducationStage('primary');
      setSelectedInterfaceMode('storybook');
      if (!customAgeInput) setCustomAgeInput('7');
    } else if (segment === '9-12') {
      setSelectedEducationStage('jss');
      setSelectedInterfaceMode('explorer');
      if (!customAgeInput) setCustomAgeInput('10');
    } else if (segment === '13-17') {
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

  // Dialect options
  const priorityDialects: DialectOption[] = [
    {
      code: 'NSL',
      name: 'Nigerian Sign Language (NSL)',
      flag: '🇳🇬',
      region: 'Nigeria & West Africa',
      description: 'Primary launch curriculum taught natively by certified Nigerian Deaf educators.',
      isAvailable: true,
      priorityBadge: '🟢 Priority Launch 1 • Active Now',
    },
  ];

  const lockedDialects: DialectOption[] = [
    {
      code: 'KRSL',
      name: 'Korean Sign Language (KRSL)',
      nativeName: '한국수어 (韓國手語)',
      flag: '🇰🇷',
      region: 'South Korea (대한민국)',
      description: 'Official national sign language of South Korea with hangul fingerspelling.',
      isAvailable: false,
      comingSoonText: 'Coming Soon • Phase 2 Expansion',
    },
    {
      code: 'KSL',
      name: 'Kenyan Sign Language (KSL)',
      flag: '🇰🇪',
      region: 'Kenya & East Africa',
      description: 'Used across Kenyan inclusive schools and universities.',
      isAvailable: false,
      comingSoonText: 'Coming Soon • Q2 Future Rollout',
    },
    {
      code: 'GSL',
      name: 'Ghanaian Sign Language (GSL)',
      flag: '🇬🇭',
      region: 'Ghana',
      description: 'Primary visual language across Ghanaian deaf schools.',
      isAvailable: false,
      comingSoonText: 'Coming Soon • Q3 Future Rollout',
    },
    {
      code: 'ASL',
      name: 'American Sign Language (ASL)',
      flag: '🌐',
      region: 'Global / International Standard',
      description: 'Widely used in the Americas and international conferences.',
      isAvailable: false,
      comingSoonText: 'Coming Soon • Q3 Future Rollout',
    },
  ];

  const handleDialectClick = (dialect: DialectOption) => {
    if (dialect.isAvailable) {
      setSelectedDialect(dialect.code);
      setLockedNotice(null);
    } else {
      setLockedNotice(
        `🔒 ${dialect.name} is reserved for future expansion! Nigeria 🇳🇬 (NSL) is our active priority launch track right now.`
      );
      setTimeout(() => setLockedNotice(null), 4500);
    }
  };

  // Step 1: Age Segment Options
  const segmentOptions = [
    {
      id: '6-8' as AgeSegment,
      title: 'Ages 6–8: Early Visual Literacy',
      subtitle: 'Foundational Storybooks & Visual Alphabet',
      badge: '👶 Foundational Literacy',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
      detail: 'Illustrated dual-pane storybooks with synchronized sign video, fingerspelling alphabet cards, and everyday classroom signs.',
      recommendedStage: 'Primary (Basic 1–6)',
      accentBorder: 'border-emerald-600 bg-emerald-50/50 ring-4 ring-emerald-100',
    },
    {
      id: '9-12' as AgeSegment,
      title: 'Ages 9–12: Digital Literacy & Computer Basics',
      subtitle: 'Hardware Signs, Keyboarding & Navigation',
      badge: '💻 Digital Basics',
      badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
      icon: <Laptop className="w-6 h-6 text-teal-600" />,
      detail: 'Explore computer hardware (monitor, mouse, webcam, keyboard), AnySign fingerspelling QWERTY touch-typing, and safe browsing.',
      recommendedStage: 'JSS 1–3',
      accentBorder: 'border-teal-600 bg-teal-50/50 ring-4 ring-teal-100',
    },
    {
      id: '13-17' as AgeSegment,
      title: 'Ages 13–17: Applied STEM & Web Logic',
      subtitle: 'Youth Coding Concepts & Visual STEM Science',
      badge: '🚀 Youth Tech',
      badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      detail: 'Learn space science signs, introductory HTML markup tags, slow-motion sign review, and applied visual communication.',
      recommendedStage: 'SS 1–3',
      accentBorder: 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-100',
    },
    {
      id: '18+' as AgeSegment,
      title: 'Ages 18+: Frontend Web Engineering in Sign',
      subtitle: 'Professional Tech Career Track • 7 Video Modules',
      badge: '🌟 Career Engineering',
      badgeClass: 'bg-slate-900 text-white border-slate-700',
      icon: <Terminal className="w-6 h-6 text-teal-700" />,
      detail: 'Master HTML5, CSS layout, VS Code workflows, JavaScript DOM, in-browser code sandboxes, and portfolio project reviews.',
      recommendedStage: 'Tertiary / Employed / Professional',
      accentBorder: 'border-teal-700 bg-teal-50/50 ring-4 ring-teal-100',
    },
  ];

  // Step 2: Education Stage / Class (K-12 & Beyond)
  const educationStages = [
    {
      id: 'primary' as EducationStage,
      label: 'Primary School',
      classDetail: 'Basic 1–6 (Elementary)',
      category: 'K-12 Foundation',
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      desc: 'Visual picture cards, fingerspelling alphabet cards, and introductory computer identification.',
      defaultMode: 'storybook' as AdaptiveInterfaceMode,
    },
    {
      id: 'jss' as EducationStage,
      label: 'Junior Secondary School',
      classDetail: 'JSS 1–3 (Middle School)',
      category: 'K-12 Intermediate',
      icon: <School className="w-5 h-5 text-teal-600" />,
      desc: 'Computer hardware components, AnySign QWERTY fingerspell touch-typing, and digital exploration.',
      defaultMode: 'explorer' as AdaptiveInterfaceMode,
    },
    {
      id: 'ss' as EducationStage,
      label: 'Senior Secondary School',
      classDetail: 'SS 1–3 (High School)',
      category: 'K-12 Secondary',
      icon: <GraduationCap className="w-5 h-5 text-indigo-600" />,
      desc: 'Visual STEM science vocabulary, introductory web markup structure, and applied sign dialogue.',
      defaultMode: 'youth_tech' as AdaptiveInterfaceMode,
    },
    {
      id: 'tertiary' as EducationStage,
      label: 'Tertiary Education',
      classDetail: 'University / Polytechnic / Colleges',
      category: 'Higher Education',
      icon: <Building className="w-5 h-5 text-blue-600" />,
      desc: 'Advanced technical signs, frontend engineering labs, computer science theory, and project portfolios.',
      defaultMode: 'workbench' as AdaptiveInterfaceMode,
    },
    {
      id: 'no_formal_school' as EducationStage,
      label: 'No Formal School',
      classDetail: 'Community & Self-Paced Learner',
      category: 'Inclusive Learning',
      icon: <Users className="w-5 h-5 text-amber-600" />,
      desc: 'Intuitive picture-anchored storyboards and everyday practical signs with zero academic prerequisites.',
      defaultMode: 'storybook' as AdaptiveInterfaceMode,
    },
    {
      id: 'employed' as EducationStage,
      label: 'Employed',
      classDetail: 'Workplace Practitioner / Upskilling',
      category: 'Career Growth',
      icon: <Briefcase className="w-5 h-5 text-teal-700" />,
      desc: 'Workplace communication, professional digital workflows, fast typing speed, and career tools.',
      defaultMode: 'workbench' as AdaptiveInterfaceMode,
    },
    {
      id: 'professional' as EducationStage,
      label: 'Professional',
      classDetail: 'Software Engineer / Educator',
      category: 'Industry Track',
      icon: <UserCheck className="w-5 h-5 text-slate-800" />,
      desc: 'Full web engineering workbench, custom accessibility tokens, DOM events, and mentorship workflows.',
      defaultMode: 'workbench' as AdaptiveInterfaceMode,
    },
  ];

  // Step 3: Adaptive Interface Modes
  const interfaceModes = [
    {
      id: 'storybook' as AdaptiveInterfaceMode,
      name: 'Visual Storybook Mode',
      badge: '🎨 Picture-Rich & High Visual Density',
      icon: <Palette className="w-6 h-6 text-emerald-600" />,
      summary: 'Large illustrations, synchronized sign video, minimal text clutter, extra visual cues.',
      bestFor: 'Primary School (Basic 1–6) & Ages 6–8',
      previewDetails: [
        'Dual-pane picture book layout',
        'Fingerspelling visual cards with large touch targets',
        'Zero auditory assumptions, high-contrast badges',
      ],
      border: 'border-emerald-600 ring-4 ring-emerald-100',
    },
    {
      id: 'explorer' as AdaptiveInterfaceMode,
      name: 'Interactive Explorer Mode',
      badge: '💻 Guided Steps & Hardware Tools',
      icon: <Laptop className="w-6 h-6 text-teal-600" />,
      summary: 'Interactive keyboard trainer, component identification, step-by-step visual guidance.',
      bestFor: 'Junior Secondary (JSS 1–3) & Ages 9–12',
      previewDetails: [
        'AnySign QWERTY fingerspelling typing keyboard',
        'Interactive computer hardware explorer',
        'Visual progress trackers and reward stars',
      ],
      border: 'border-teal-600 ring-4 ring-teal-100',
    },
    {
      id: 'youth_tech' as AdaptiveInterfaceMode,
      name: 'Youth Tech & Logic Mode',
      badge: '🚀 STEM Visuals & Code Logic',
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      summary: 'Science diagrams, HTML tag concepts, slow-motion sign review (0.5x, 0.75x), logic puzzles.',
      bestFor: 'Senior Secondary (SS 1–3) & Ages 13–17',
      previewDetails: [
        'Astronomy & Space STEM sign videos',
        'Introductory web markup structure preview',
        'Visual dialogue scenarios and quiz validation',
      ],
      border: 'border-indigo-600 ring-4 ring-indigo-100',
    },
    {
      id: 'workbench' as AdaptiveInterfaceMode,
      name: 'Career Code Workbench Mode',
      badge: '⚡ Pro Developer Environment',
      icon: <Terminal className="w-6 h-6 text-teal-800" />,
      summary: 'Split-screen live code editor, in-browser execution, dev console, professional tracks.',
      bestFor: 'Tertiary, Employed, Professional & Ages 18+',
      previewDetails: [
        'Live HTML/CSS/JavaScript editor with instant output',
        'Certified NSL video instruction by Deaf engineers',
        'Real portfolio projects and technical career modules',
      ],
      border: 'border-slate-800 ring-4 ring-slate-100',
    },
  ];

  // Daily Pace Options
  const dailyGoalOptions = [
    {
      minutes: 5,
      label: 'Casual Pace',
      pace: '5 mins / day',
      desc: '1 visual module per day. Steady foundational habit.',
      icon: <Clock className="w-5 h-5 text-indigo-600" />,
    },
    {
      minutes: 10,
      label: 'Regular (Recommended)',
      pace: '10 mins / day',
      desc: '1 video lesson + 1 live sandbox or typing exercise. Best retention.',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      recommended: true,
    },
    {
      minutes: 20,
      label: 'Fast-Track',
      pace: '20 mins / day',
      desc: 'Accelerated coding proficiency and fluent technical sign vocabulary.',
      icon: <Flame className="w-5 h-5 text-rose-500" />,
    },
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((s) => s + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const handleComplete = () => {
    setIsFinishing(true);

    const customAge = customAgeInput ? parseInt(customAgeInput, 10) : undefined;

    // Save baseline preferences to user profile and session
    updateProfile({
      ageSegment: selectedAgeSegment,
      customAge,
      educationStage: selectedEducationStage,
      interfaceMode: selectedInterfaceMode,
      signLanguage: selectedDialect,
      dailyGoalMinutes,
      totalStars: (user?.totalStars || 10) + 20, // Bonus onboarding stars!
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('deaflms_selected_age_segment', selectedAgeSegment);
      localStorage.setItem('deaflms_education_stage', selectedEducationStage);
      localStorage.setItem('deaflms_interface_mode', selectedInterfaceMode);
      if (customAge) {
        localStorage.setItem('deaflms_custom_age', String(customAge));
      }
    }

    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#0f766e', '#10b981', '#f59e0b', '#3b82f6', '#06b6d4'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }

    // Direct routing to adapted dashboard
    setTimeout(() => {
      if (user?.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else if (user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    }, 1500);
  };

  const progressPercent = Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-teal-600 selection:text-white">
      {/* Top Header: Progress Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className={`p-2 rounded-xl transition ${step > 1 ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 cursor-not-allowed'
              }`}
            aria-label="Previous step"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Progress Bar */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              <span>Step {step} of {totalSteps}: {
                step === 1 ? 'Age' :
                  step === 2 ? 'Education & Class' :
                    step === 3 ? 'Adaptive Interface' :
                      'Habit & Dialect'
              }</span>
              <span className="text-teal-700 font-extrabold">{progressPercent}% Ready</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 transition-all duration-500 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <VolumeX className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">Zero Audio Required</span>
          </div> */}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col justify-center">

        {/* =================================================================== */}
        {/* STEP 1: AGE SEGMENT & EXACT AGE CALIBRATION                        */}
        {/* =================================================================== */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-black uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-teal-700" />
                <span>Baseline Step 1 • Age </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Select Your Age Segment
              </h1>
              {/* <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Choose an age segment or enter an exact age. We calibrate vocabulary complexity, font scaling, and instructional progression.
              </p> */}
            </div>

            {/* Custom Exact Age Numeric Input */}
            <div className="p-4 rounded-3xl bg-white border-2 border-slate-200 shadow-xs max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-left">
                <span className="text-xs font-black text-slate-800 block">Customize Exact Age</span>
                {/* <span className="text-[11px] text-slate-500 font-medium block">
                  Auto-calibrates age segment and K-12 class
                </span> */}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={4}
                  max={99}
                  value={customAgeInput}
                  onChange={(e) => handleCustomAgeChange(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-24 py-2 px-3 rounded-xl border-2 border-slate-300 text-sm font-black text-slate-900 focus:border-teal-700 focus:outline-none bg-slate-50 text-center"
                />
                {customAgeInput && (
                  <span className="text-xs font-black text-teal-800 bg-teal-50 px-2.5 py-1.5 rounded-xl border border-teal-200">
                    Ages {selectedAgeSegment} ✓
                  </span>
                )}
              </div>
            </div>

            {/* 4 Age Segment Cards */}
            <div className="grid grid-cols-1 gap-4 pt-1">
              {segmentOptions.map((opt) => {
                const isSelected = selectedAgeSegment === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSegmentClick(opt.id)}
                    className={`p-6 rounded-3xl border-2 text-left transition-all transform interactive-target flex flex-col justify-between space-y-4 relative ${isSelected
                      ? opt.accentBorder + ' shadow-xl scale-[1.01]'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
                          {opt.icon}
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-black text-slate-900 text-base sm:text-lg">
                              {opt.title}
                            </h2>
                            {/* <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${opt.badgeClass}`}>
                              {opt.badge}
                            </span> */}
                          </div>
                          <span className="text-xs font-bold text-slate-500 block">
                            {opt.subtitle} • Recommended: {opt.recommendedStage}
                          </span>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full border-2 border-slate-300 shrink-0" />
                      )}
                    </div>

                    {/* <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      {opt.detail}
                    </p> */}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: CLASS & EDUCATION STAGE (K-12 & BEYOND)                    */}
        {/* =================================================================== */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-black uppercase tracking-wider">
                <School className="w-3.5 h-3.5 text-indigo-700" />
                <span>Baseline Step 2 • Education Stage &amp; Class</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Select Your Education Stage or Class
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Choose your current school class or learning background. This aligns our visual lessons with official curriculum standards.
              </p>
            </div>

            {/* 7 Education Stages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {educationStages.map((stage) => {
                const isSelected = selectedEducationStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => {
                      setSelectedEducationStage(stage.id);
                      setSelectedInterfaceMode(stage.defaultMode);
                    }}
                    className={`p-5 rounded-3xl border-2 text-left transition-all interactive-target flex flex-col justify-between space-y-3 relative ${isSelected
                      ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-50 scale-[1.01] ring-4 ring-indigo-100'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          {stage.icon}
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                            {stage.category}
                          </span>
                          <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                            {stage.label}
                          </h3>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 shrink-0" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200 inline-block">
                        {stage.classDetail}
                      </span>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {stage.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: ADAPTIVE PLATFORM INTERFACE                                */}
        {/* =================================================================== */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-black uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5 text-teal-700" />
                <span>Baseline Step 3 • Adaptive Platform Interface</span>
              </div> */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                One Platform
              </h1>
              {/* <p className="text-xs sm:text-sm text-slate-500 font-medium">
                DeafLMS dynamically transforms its layout, picture density, and tools to match your calibrated interface preference. You can change this anytime in your Profile.
              </p> */}
            </div>

            {/* 4 Adaptive Interface Modes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {interfaceModes.map((mode) => {
                const isSelected = selectedInterfaceMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedInterfaceMode(mode.id)}
                    className={`p-6 rounded-3xl border-2 text-left transition-all interactive-target flex flex-col justify-between space-y-4 relative ${isSelected
                      ? `bg-white ${mode.border} shadow-xl scale-[1.01]`
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          {mode.icon}
                        </div>
                        <div>
                          {/* <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 block">
                            {mode.badge}
                          </span> */}
                          <h3 className="font-black text-slate-900 text-base leading-tight">
                            {mode.name}
                          </h3>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full border-2 border-slate-300 shrink-0" />
                      )}
                    </div>

                    {/* <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {mode.summary}
                    </p> */}

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 block">Key Interface Features:</span>
                      {mode.previewDetails.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      Best for: {mode.bestFor}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: SIGN LANGUAGE DIALECT & DAILY HABIT PACE                   */}
        {/* =================================================================== */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1  border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
                {/* <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> */}
                <span>Step 4 • Habit &amp; Dialect</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Confirm Sign Language &amp; Daily Pace
              </h1>
              {/* <p className="text-xs sm:text-sm text-slate-500 font-medium">
                DeafLMS is currently operating its primary production curriculum in <strong>Nigerian Sign Language (NSL)</strong>.
              </p> */}
            </div>

            {lockedNotice && (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-3 animate-bounce shadow-md">
                <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{lockedNotice}</span>
              </div>
            )}

            {/* Priority Dialect */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                Primary Instructional Sign Language
              </label>
              <div className="p-4 rounded-3xl bg-white border-2 border-teal-700 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* <span className="text-4xl">🇳🇬</span> */}
                  <div>
                    <span className="text-sm font-black text-slate-900 block">
                      Nigerian Sign Language (NSL)
                    </span>
                    {/* <span className="text-xs text-slate-500 font-medium block">
                      Certified native Deaf instructors from Abuja &amp; Lagos clusters
                    </span> */}
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200">
                  Active
                </span>
              </div>
            </div>

            {/* Daily Commitment Pace */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                Daily Learning Commitment
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {dailyGoalOptions.map((goal) => {
                  const isSelected = dailyGoalMinutes === goal.minutes;
                  return (
                    <button
                      key={goal.minutes}
                      onClick={() => setDailyGoalMinutes(goal.minutes)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all interactive-target flex flex-col justify-between space-y-2 ${isSelected
                        ? 'bg-white border-teal-700 shadow-md ring-4 ring-teal-100'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                          {goal.icon}
                        </div>
                        <span className="text-xs font-black text-teal-800">{goal.pace}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{goal.label}</h4>
                        {/* <p className="text-[10px] text-slate-500 font-medium leading-snug mt-0.5">
                          {goal.desc}
                        </p> */}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Baseline Summary Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-teal-50 to-indigo-50 border-2 border-teal-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-900">
                  Your Summary
                </span>
                {/* <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  ⭐ +20 Bonus Stars
                </span> */}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-white/80 p-2.5 rounded-xl border border-teal-100">
                  <span className="text-[10px] text-slate-400 block font-bold">Age Segment</span>
                  <strong className="text-slate-900">Ages {selectedAgeSegment}</strong>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-teal-100">
                  <span className="text-[10px] text-slate-400 block font-bold">Class / Stage</span>
                  <strong className="text-slate-900 capitalize">{selectedEducationStage}</strong>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-teal-100">
                  <span className="text-[10px] text-slate-400 block font-bold">Interface</span>
                  <strong className="text-slate-900 capitalize">{selectedInterfaceMode}</strong>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-teal-100">
                  <span className="text-[10px] text-slate-400 block font-bold">Daily Habit</span>
                  <strong className="text-slate-900">{dailyGoalMinutes} mins / day</strong>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Sticky Bottom Footer Controls */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 sticky bottom-0 z-30 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Calibrating: <strong className="text-teal-800">Ages {selectedAgeSegment}</strong> • Class: <strong className="text-indigo-800 capitalize">{selectedEducationStage}</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {step > 1 && (
              <button
                onClick={handlePrev}
                className="px-5 py-3 rounded-2xl border-2 border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition interactive-target"
              >
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={isFinishing}
              className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-lg shadow-teal-700/20 hover:scale-105 transition interactive-target flex items-center justify-center gap-2"
            >
              {isFinishing ? (
                'Launching Calibrated Dashboard...'
              ) : step === totalSteps ? (
                <>
                  {/* <Sparkles className="w-4 h-4 text-amber-300" /> */}
                  <span>Start Learning</span>
                </>
              ) : (
                <>
                  <span>Step {step + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-700 font-bold text-sm">Loading onboarding</p>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
