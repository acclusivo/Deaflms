'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Keyboard as KeyboardIcon,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Camera,
  Layers,
  Sun,
  Moon,
  ZoomIn,
  Hand,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  VolumeX,
  Palette,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SignHandshapeIcon } from './SignHandshapeIcon';
import { SignImageUploadModal } from './SignImageUploadModal';
import { ColourfulHandGuide } from './ColourfulHandGuide';
import { getSignImage, getCustomUploadedLetters } from '@/lib/fingerspell-signs';
import {
  KEYBOARD_CURRICULUM_STAGES,
  KeyboardLessonStage,
  KeyboardLessonDrill,
  getFingerForKey,
  FingerDefinition,
} from '@/lib/keyboard-curriculum';

interface KeyboardTrainerProps {
  onComplete?: (score: number, stars: number) => void;
}

export const KeyboardTrainer: React.FC<KeyboardTrainerProps> = ({ onComplete }) => {
  // Curriculum Stage and Drill State
  const [currentStageId, setCurrentStageId] = useState<string>('stage-asdf');
  const [drillIndex, setDrillIndex] = useState<number>(0);
  const [typedLetters, setTypedLetters] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'both' | 'signs_only' | 'letters_only'>('both');
  const [boardTheme, setBoardTheme] = useState<'light' | 'dark'>('light');
  const [showFingerColors, setShowFingerColors] = useState<boolean>(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [customLettersCount, setCustomLettersCount] = useState<number>(0);
  const [renderNonce, setRenderNonce] = useState<number>(0);
  const [drillSuccess, setDrillSuccess] = useState<boolean>(false);

  // Active Stage and Drill
  const currentStage: KeyboardLessonStage = useMemo(() => {
    return (
      KEYBOARD_CURRICULUM_STAGES.find((s) => s.id === currentStageId) ||
      KEYBOARD_CURRICULUM_STAGES[0]
    );
  }, [currentStageId]);

  const currentDrill: KeyboardLessonDrill = useMemo(() => {
    return currentStage.drills[drillIndex] || currentStage.drills[0];
  }, [currentStage, drillIndex]);

  const currentSequence = currentDrill.targetSequence;
  const targetChars = useMemo(() => currentSequence.split(''), [currentSequence]);
  const nextTargetChar = targetChars[typedLetters.length] || null;
  const currentSignInfo = nextTargetChar ? getSignImage(nextTargetChar) : null;
  const targetFinger: FingerDefinition | null = nextTargetChar
    ? getFingerForKey(nextTargetChar)
    : null;

  // Refresh custom image count
  const refreshCustomCount = useCallback(() => {
    if (typeof window !== 'undefined') {
      const customs = getCustomUploadedLetters();
      setCustomLettersCount(customs.length);
      setRenderNonce((n) => n + 1);
    }
  }, []);

  useEffect(() => {
    refreshCustomCount();
  }, [refreshCustomCount]);

  // Reset typed letters on drill change
  const handleSelectStage = (stageId: string) => {
    setCurrentStageId(stageId);
    setDrillIndex(0);
    setTypedLetters([]);
    setDrillSuccess(false);
  };

  const handleSelectDrill = (index: number) => {
    setDrillIndex(index);
    setTypedLetters([]);
    setDrillSuccess(false);
  };

  const handleNextDrill = () => {
    if (drillIndex + 1 < currentStage.drills.length) {
      setDrillIndex((prev) => prev + 1);
      setTypedLetters([]);
      setDrillSuccess(false);
    } else {
      // Find next stage
      const currentStageIdx = KEYBOARD_CURRICULUM_STAGES.findIndex(
        (s) => s.id === currentStage.id
      );
      if (currentStageIdx + 1 < KEYBOARD_CURRICULUM_STAGES.length) {
        setCurrentStageId(KEYBOARD_CURRICULUM_STAGES[currentStageIdx + 1].id);
        setDrillIndex(0);
        setTypedLetters([]);
        setDrillSuccess(false);
      }
    }
  };

  // Keyboard Rows (Full QWERTY layout including Home Row with semicolon)
  const qwertyRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  const handleKeyPress = (char: string) => {
    const formattedChar = char.toUpperCase();
    setActiveKey(formattedChar);
    setTimeout(() => setActiveKey(null), 180);

    if (!nextTargetChar) return;

    if (
      formattedChar === nextTargetChar.toUpperCase() ||
      (char === ';' && nextTargetChar === ';') ||
      (char === ' ' && nextTargetChar === ' ')
    ) {
      const nextTyped = [...typedLetters, nextTargetChar];
      setTypedLetters(nextTyped);

      if (nextTyped.length === targetChars.length) {
        // Completed current drill!
        setDrillSuccess(true);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#0D9488', '#10B981', '#3B82F6', '#F59E0B', '#EC4899'],
          });
        } catch {
          // ignore if canvas not available
        }

        if (onComplete) {
          onComplete(30, 3);
        }
      }
    }
  };

  const handleResetDrill = () => {
    setTypedLetters([]);
    setDrillSuccess(false);
  };

  const handleDeleteLetter = () => {
    if (typedLetters.length > 0) {
      setTypedLetters((prev) => prev.slice(0, prev.length - 1));
      setDrillSuccess(false);
    }
  };

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing inside an input or modal
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleDeleteLetter();
        return;
      }

      if (e.key === ';') {
        e.preventDefault();
        handleKeyPress(';');
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        handleKeyPress(' ');
        return;
      }

      const char = e.key.toUpperCase();
      if (/^[A-Z]$/.test(char)) {
        e.preventDefault();
        handleKeyPress(char);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentDrill, typedLetters, nextTargetChar, targetChars]);

  return (
    <div key={renderNonce} className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* ========================================================================= */}
      {/* 1. CURRICULUM STAGES NAVIGATION BAR (ASDF -> JKL; -> GH -> WORDS) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                Progressive Skill Sequence
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                Stage {currentStage.stageNumber} of {KEYBOARD_CURRICULUM_STAGES.length}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {currentStage.title}
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-md font-medium leading-relaxed">
            {currentStage.description}
          </p>
        </div>

        {/* Stage Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {KEYBOARD_CURRICULUM_STAGES.map((stg) => {
            const isSelected = stg.id === currentStage.id;
            return (
              <button
                key={stg.id}
                onClick={() => handleSelectStage(stg.id)}
                className={`p-3 rounded-2xl border-2 text-left transition-all interactive-target flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-200 scale-102'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
                aria-label={`Select stage ${stg.title}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {stg.badge}
                  </span>
                  <span className="text-xs font-black">Stage {stg.stageNumber}</span>
                </div>
                <div className="font-black text-xs sm:text-sm line-clamp-1">
                  {stg.shortLabel}
                </div>
              </button>
            );
          })}
        </div>

        {/* Drill Pills within Current Stage */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 mr-1">
            Drill Exercises:
          </span>
          {currentStage.drills.map((drill, idx) => {
            const isCurrentDrill = idx === drillIndex;
            return (
              <button
                key={drill.id}
                onClick={() => handleSelectDrill(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition interactive-target flex items-center gap-1.5 ${
                  isCurrentDrill
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{drill.targetSequence}</span>
                <span className="opacity-70 text-[10px]">({drill.title})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN INTERACTIVE TRAINING CONTAINER */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
        {/* Header & Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-md shadow-teal-100 shrink-0 font-black">
              <KeyboardIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h3 className="font-black text-slate-900 text-lg sm:text-xl">
                  {currentDrill.title}
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md border border-teal-200">
                  Target: {currentDrill.targetSequence}
                </span>
                {targetFinger && (
                  <span
                    className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-white shadow-xs"
                    style={{ backgroundColor: targetFinger.color.hex }}
                  >
                    Finger: {targetFinger.handName} {targetFinger.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {currentDrill.description}
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Toggle Finger Colors on Keycaps */}
            <button
              onClick={() => setShowFingerColors((v) => !v)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-xs interactive-target ${
                showFingerColors
                  ? 'bg-teal-50 border-teal-300 text-teal-800'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
              title="Toggle color-coded finger guides on keycaps"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Finger Colors: {showFingerColors ? 'ON' : 'OFF'}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setBoardTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 shadow-xs interactive-target"
              title="Toggle board theme"
            >
              {boardTheme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span>Dark Board</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light Board</span>
                </>
              )}
            </button>

            {/* Upload Custom Sign Pictures Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black transition flex items-center gap-1.5 border border-indigo-200 shadow-sm interactive-target"
              title="Upload real photos of local signs (NSL, ASL)"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-600" />
              <span>Sign Photos</span>
              {customLettersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-black flex items-center justify-center">
                  {customLettersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Display Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <Layers className="w-4 h-4 text-teal-700" />
            <span>Keycap Content:</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setDisplayMode('both')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                displayMode === 'both'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔤 + 📸 Letter & Sign Picture
            </button>
            <button
              onClick={() => setDisplayMode('signs_only')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                displayMode === 'signs_only'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📸 Sign Pictures Only
            </button>
            <button
              onClick={() => setDisplayMode('letters_only')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                displayMode === 'letters_only'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔤 Letters Only
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. VISUAL TARGET SEQUENCE TILES & TARGET SIGN SPOTLIGHT */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          {/* Target Sequence Display (2 cols) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-50 via-white to-teal-50/30 border-2 border-slate-200 rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Type These Letters in Sequence:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDeleteLetter}
                  disabled={typedLetters.length === 0}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 disabled:opacity-40 transition"
                  title="Delete last typed letter"
                >
                  ← Backspace
                </button>
                <button
                  onClick={handleResetDrill}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>

            {/* Sequence Letter Tiles with Fingerspelling Signs */}
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 py-2">
              {targetChars.map((letter, idx) => {
                const isTyped = idx < typedLetters.length;
                const isCurrent = idx === typedLetters.length;
                const letterFinger = getFingerForKey(letter);

                return (
                  <div
                    key={idx}
                    className={`relative w-16 sm:w-20 h-24 sm:h-28 rounded-2xl border-4 flex flex-col items-center justify-between p-2 transition-all ${
                      isTyped
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md scale-102'
                        : isCurrent
                        ? 'border-amber-400 bg-white text-slate-900 ring-4 ring-amber-200 shadow-xl scale-105 animate-pulse'
                        : 'border-slate-200 bg-slate-50/80 text-slate-400 opacity-60'
                    }`}
                  >
                    {/* Visual Sign Icon */}
                    <div className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center">
                      <SignHandshapeIcon letter={letter} size="sm" />
                    </div>

                    {/* Letter Character */}
                    <span className="font-black text-lg sm:text-xl tracking-wide">
                      {letter}
                    </span>

                    {/* Finger Color Accent Dot */}
                    {letterFinger && (
                      <div className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: letterFinger.color.hex }}
                        />
                        <span className="text-[8px] font-bold text-slate-500">
                          {letterFinger.name}
                        </span>
                      </div>
                    )}

                    {/* Status indicator */}
                    {isTyped && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute -top-1.5 -right-1.5 bg-white rounded-full shadow-xs" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Real-time Guidance Banner */}
            {drillSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 animate-star-pop">
                <span className="text-emerald-800 font-black text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Drill Completed Successfully!
                </span>
                <button
                  onClick={handleNextDrill}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black transition flex items-center gap-1 shadow-sm interactive-target"
                >
                  <span>Next Exercise</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : targetFinger && nextTargetChar ? (
              <div
                className="p-3 rounded-2xl border-2 flex items-center justify-between gap-3 text-xs font-bold"
                style={{
                  borderColor: targetFinger.color.hex,
                  backgroundColor: `${targetFinger.color.hex}14`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-black"
                    style={{ backgroundColor: targetFinger.color.hex }}
                  >
                    ✓
                  </span>
                  <span>
                    Next letter is{' '}
                    <strong
                      className="text-sm font-black underline decoration-2"
                      style={{ textDecorationColor: targetFinger.color.hex }}
                    >
                      &ldquo;{nextTargetChar}&rdquo;
                    </strong>
                    . Press it using your{' '}
                    <strong style={{ color: targetFinger.color.hex }}>
                      {targetFinger.handName} {targetFinger.name}
                    </strong>
                    .
                  </span>
                </div>
                <span className="text-[10px] uppercase font-black text-slate-500">
                  Home Key: [{targetFinger.homeKey}]
                </span>
              </div>
            ) : (
              <div className="text-center text-xs font-semibold text-slate-500">
                Keep fingers anchored lightly on the home row keys: A S D F — J K L ;
              </div>
            )}
          </div>

          {/* Current Sign Spotlight Card */}
          <div className="bg-gradient-to-br from-teal-50 via-white to-amber-50/70 border-2 border-teal-200 text-slate-900 rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-between text-center space-y-4 shadow-lg relative overflow-hidden">
            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 bg-teal-100/80 border border-teal-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Target Sign Spotlight
              </span>
              {targetFinger && (
                <span
                  className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md text-white shadow-2xs"
                  style={{ backgroundColor: targetFinger.color.hex }}
                >
                  {targetFinger.name}
                </span>
              )}
            </div>

            {/* Spotlight Showcase Stage */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white border-4 border-amber-400 shadow-xl flex items-center justify-center p-3 ring-6 ring-amber-100/80 relative">
              {nextTargetChar ? (
                <SignHandshapeIcon letter={nextTargetChar} size="2xl" />
              ) : (
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
              )}
            </div>

            {/* Letter & Finger Instruction */}
            <div className="space-y-1">
              <div className="text-2xl font-black text-slate-900">
                Letter{' '}
                <span className="text-teal-700 underline decoration-amber-400 decoration-4">
                  {nextTargetChar || '✓'}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-bold">
                {currentSignInfo?.details.name || 'All done!'}
              </p>
              {targetFinger && nextTargetChar && (
                <p className="text-[11px] text-slate-500 font-semibold leading-tight">
                  Reach with <span className="font-black text-slate-800">{targetFinger.handName} {targetFinger.name}</span>
                </p>
              )}
            </div>

            {/* Quick Upload Action */}
            {nextTargetChar && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-teal-800 text-xs font-black transition flex items-center justify-center gap-1.5 border border-teal-200 interactive-target shadow-2xs"
              >
                <Camera className="w-3.5 h-3.5 text-teal-700" />
                <span>Upload custom photo for &quot;{nextTargetChar}&quot;</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. VISUAL ON-SCREEN QWERTY KEYBOARD (WITH FINGER-COLOR GUIDES) */}
        {/* ========================================================================= */}
        <div
          className={`p-3 sm:p-5 md:p-6 rounded-3xl border-4 space-y-2 select-none shadow-xl overflow-x-auto transition-colors ${
            boardTheme === 'light'
              ? 'bg-slate-100 border-slate-300'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-xs px-2 pb-1">
            <span
              className={`font-black flex items-center gap-2 ${
                boardTheme === 'light' ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              <KeyboardIcon className="w-4 h-4 text-teal-700" />
              Deaf QWERTY Visual Trainer (Color-Coded Home Row & Fingerspelling)
            </span>
            <span
              className={`text-[11px] font-bold flex items-center gap-1 ${
                boardTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5 text-teal-600" />
              Type on screen or physical laptop keys
            </span>
          </div>

          {qwertyRows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex justify-center gap-1 sm:gap-1.5">
              {row.map((key) => {
                const isTargetKey = key.toUpperCase() === nextTargetChar?.toUpperCase();
                const isActive = activeKey === key.toUpperCase();
                const keyFinger = getFingerForKey(key);
                const hasCustomPhoto =
                  typeof window !== 'undefined' && getCustomUploadedLetters().includes(key);

                return (
                  <button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className={`rounded-2xl transition-all shadow-sm interactive-target relative flex flex-col items-center justify-between overflow-hidden ${
                      displayMode === 'both'
                        ? 'w-10 sm:w-16 md:w-20 h-16 sm:h-24 md:h-28 p-1 sm:p-1.5'
                        : displayMode === 'signs_only'
                        ? 'w-10 sm:w-16 md:w-20 h-16 sm:h-24 md:h-28 p-1 sm:p-1.5'
                        : 'w-8 h-10 sm:w-14 sm:h-16 md:w-16 md:h-18'
                    } ${
                      isTargetKey
                        ? 'bg-amber-300 border-4 border-amber-500 text-slate-950 ring-4 ring-amber-200/90 scale-105 z-20 shadow-amber-400/60 shadow-xl animate-pulse'
                        : isActive
                        ? 'bg-teal-700 border-2 border-teal-800 text-white scale-95 z-10'
                        : boardTheme === 'light'
                        ? 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 hover:border-teal-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                    style={{
                      borderTopWidth: showFingerColors && keyFinger ? '5px' : undefined,
                      borderTopColor: showFingerColors && keyFinger ? keyFinger.color.hex : undefined,
                    }}
                    title={`Letter ${key}${keyFinger ? ` — ${keyFinger.handName} ${keyFinger.name}` : ''}`}
                    aria-label={`Letter ${key}, finger: ${keyFinger ? `${keyFinger.handName} ${keyFinger.name}` : 'default'}`}
                  >
                    {/* Top Finger Indicator Stripe / Badge */}
                    {showFingerColors && keyFinger && (
                      <span
                        className="absolute top-0.5 right-1 w-2 h-2 rounded-full ring-1 ring-white"
                        style={{ backgroundColor: keyFinger.color.hex }}
                        title={`${keyFinger.name} finger`}
                      />
                    )}

                    {/* Letter Label Badge in Top-Left Corner */}
                    {displayMode === 'both' && (
                      <span
                        className={`absolute top-1 left-1.5 px-1.5 py-0.5 rounded-md font-black text-[10px] sm:text-xs z-10 ${
                          isTargetKey
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : boardTheme === 'light'
                            ? 'bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs'
                            : 'bg-slate-950 text-amber-300 border border-slate-700'
                        }`}
                      >
                        {key}
                      </span>
                    )}

                    {/* Enlarged Sign Handshape Picture */}
                    {displayMode !== 'letters_only' && (
                      <div className="w-full h-full flex items-center justify-center p-0.5 sm:p-1">
                        <SignHandshapeIcon
                          letter={key}
                          size="keycap"
                          invertOnDark={boardTheme === 'dark' && !isTargetKey}
                        />
                      </div>
                    )}

                    {/* Standard Letter (in Letters-Only Mode) */}
                    {displayMode === 'letters_only' && (
                      <span
                        className={`font-black text-sm sm:text-xl ${
                          boardTheme === 'light' ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {key}
                      </span>
                    )}

                    {/* Sign Only Mode - Small hint letter at bottom */}
                    {displayMode === 'signs_only' && (
                      <span
                        className={`absolute bottom-0.5 right-1 text-[8px] sm:text-[10px] font-black ${
                          boardTheme === 'light' ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {key}
                      </span>
                    )}

                    {/* Custom photo indicator dot */}
                    {hasCustomPhoto && (
                      <span
                        className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white"
                        title="Custom photo active"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Bottom Space Bar with Thumbs Guidance */}
          <div className="flex justify-center items-center gap-2 pt-1.5">
            <button
              onClick={() => handleKeyPress(' ')}
              className={`w-1/2 h-9 sm:h-11 border-2 rounded-2xl flex items-center justify-center text-xs font-bold shadow-inner transition interactive-target ${
                boardTheme === 'light'
                  ? 'bg-white hover:bg-slate-50 border-purple-300 text-purple-900'
                  : 'bg-slate-800 hover:bg-slate-700 border-purple-500 text-purple-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Spacebar (Thumbs)</span>
              </div>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. ATTACHED COLOURFUL HANDS WITH FINGERS GUIDE (USER'S KEY REQUEST) */}
        {/* ========================================================================= */}
        <div className="pt-2">
          <ColourfulHandGuide
            activeKey={nextTargetChar}
            pressedKey={activeKey}
            showSignsOnFingers={true}
            theme={boardTheme}
          />
        </div>
      </div>

      {/* Image Upload & Management Modal */}
      <SignImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImagesUpdated={refreshCustomCount}
      />
    </div>
  );
};
