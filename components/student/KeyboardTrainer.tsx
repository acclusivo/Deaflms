'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';
import { SignHandshapeIcon } from './SignHandshapeIcon';
import { SignImageUploadModal } from './SignImageUploadModal';
import { getSignImage, getCustomUploadedLetters } from '@/lib/fingerspell-signs';

interface KeyboardTrainerProps {
  onComplete?: (score: number, stars: number) => void;
}

export const KeyboardTrainer: React.FC<KeyboardTrainerProps> = ({ onComplete }) => {
  const targetWords = ['CHAT', 'WEBCAM', 'LINK', 'SIGN', 'DEAF', 'BRAIN'];
  const [wordIndex, setWordIndex] = useState(0);
  const [typedLetters, setTypedLetters] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'both' | 'signs_only' | 'letters_only'>('both');
  const [boardTheme, setBoardTheme] = useState<'light' | 'dark'>('light'); // Light is high-contrast default for black signs
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [customLettersCount, setCustomLettersCount] = useState(0);
  const [renderNonce, setRenderNonce] = useState(0);

  const currentWord = targetWords[wordIndex];
  const nextTargetChar = currentWord[typedLetters.length];
  const currentSignInfo = nextTargetChar ? getSignImage(nextTargetChar) : null;

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

  const qwertyRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  const handleKeyPress = (char: string) => {
    setActiveKey(char);
    setTimeout(() => setActiveKey(null), 180);

    if (!nextTargetChar) return;

    if (char.toUpperCase() === nextTargetChar) {
      const nextTyped = [...typedLetters, char.toUpperCase()];
      setTypedLetters(nextTyped);

      if (nextTyped.length === currentWord.length) {
        // Completed current word
        setTimeout(() => {
          if (wordIndex + 1 < targetWords.length) {
            setWordIndex((w) => w + 1);
            setTypedLetters([]);
          } else {
            if (onComplete) onComplete(50, 3);
          }
        }, 600);
      }
    }
  };

  const handleResetWord = () => {
    setTypedLetters([]);
  };

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing inside an input or modal
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      const char = e.key.toUpperCase();
      if (/^[A-Z]$/.test(char)) {
        handleKeyPress(char);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentWord, typedLetters, wordIndex, nextTargetChar]);

  return (
    <div key={renderNonce} className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Main Container Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
        
        {/* Header & Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100 shrink-0">
              <KeyboardIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h3 className="font-black text-slate-900 text-lg sm:text-xl">
                  Visual Fingerspelling Keyboard Trainer
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  High Contrast
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md border border-indigo-200">
                  AnySign ASL Matched
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Crystal-clear black signs on high-contrast surfaces for effortless visual reading
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Theme Toggle Button (Light Contrast vs Dark Mode) */}
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
              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black transition flex items-center gap-2 border border-indigo-200 shadow-sm interactive-target"
              title="Upload real photos of local signs (NSL, ASL, KSL, SASL, GSL)"
            >
              <Camera className="w-4 h-4 text-indigo-600" />
              <span>Upload Sign Photos</span>
              {customLettersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
                  {customLettersCount}
                </span>
              )}
            </button>

            {/* Word Index Badge */}
            <div className="text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
              Word {wordIndex + 1} of {targetWords.length}
            </div>
          </div>
        </div>

        {/* Display Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Keycap Style:</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setDisplayMode('both')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                displayMode === 'both'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔤 + 📸 Letter & Large Sign Picture
            </button>
            <button
              onClick={() => setDisplayMode('signs_only')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                displayMode === 'signs_only'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📸 Sign Pictures Only (Visual Challenge)
            </button>
            <button
              onClick={() => setDisplayMode('letters_only')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                displayMode === 'letters_only'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔤 Letters Only
            </button>
          </div>
        </div>

        {/* Visual Target Word & High-Contrast Sign Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          {/* Target Word Display (2 cols) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 border-2 border-slate-200 rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Spell This Word Using Handshapes:
              </span>
              <button
                onClick={handleResetWord}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Word
              </button>
            </div>

            {/* Word Letter Tiles with High-Contrast Signs */}
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 py-2">
              {currentWord.split('').map((letter, idx) => {
                const isTyped = idx < typedLetters.length;
                const isCurrent = idx === typedLetters.length;

                return (
                  <div
                    key={idx}
                    className={`relative w-20 sm:w-24 h-28 sm:h-34 rounded-3xl border-4 flex flex-col items-center justify-between p-2.5 transition-all ${
                      isTyped
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md scale-105'
                        : isCurrent
                        ? 'border-indigo-600 bg-white text-indigo-900 ring-4 ring-indigo-200 shadow-xl scale-110 animate-pulse'
                        : 'border-slate-200 bg-slate-50/90 text-slate-400 opacity-60'
                    }`}
                  >
                    {/* Visual Sign Image / Icon for this letter */}
                    <div className="w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center">
                      <SignHandshapeIcon letter={letter} size="lg" />
                    </div>

                    {/* Letter Character */}
                    <span className="font-black text-xl sm:text-2xl tracking-wide">
                      {letter}
                    </span>

                    {/* Status indicator */}
                    {isTyped ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute -top-2 -right-2 bg-white rounded-full shadow-sm" />
                    ) : (
                      <span className="text-[9px] font-black uppercase text-slate-400">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress caption */}
            <div className="text-center text-xs font-semibold text-slate-500">
              {typedLetters.length === currentWord.length ? (
                <span className="text-emerald-600 font-black flex items-center justify-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Word Complete! Preparing next word...
                </span>
              ) : (
                <span>
                  Look at the spotlight sign for letter{' '}
                  <strong className="text-indigo-600 font-black text-base">&quot;{nextTargetChar}&quot;</strong>, then find it on the keyboard below!
                </span>
              )}
            </div>
          </div>

          {/* Current Sign Spotlight Card — Clean, High-Contrast Light Theme (Zero Violet Blur) */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-amber-50/70 border-2 border-indigo-200 text-slate-900 rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-between text-center space-y-4 shadow-lg relative overflow-hidden">
            {/* Soft Ambient Glow */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-indigo-200/40 rounded-full blur-2xl pointer-events-none" />

            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-800 bg-indigo-100/80 border border-indigo-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Target Sign Spotlight
              </span>
              {currentSignInfo?.type === 'custom' ? (
                <span className="text-[9px] font-black uppercase bg-emerald-100 border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded-md">
                  Custom Photo
                </span>
              ) : (
                <span className="text-[9px] font-black uppercase bg-amber-100 border border-amber-300 text-amber-900 px-2 py-0.5 rounded-md">
                  AnySign ASL
                </span>
              )}
            </div>

            {/* Crystal-Clear White Spotlight Showcase Stage */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-white border-4 border-amber-400 shadow-xl flex items-center justify-center p-3 ring-8 ring-amber-100/80 relative group">
              {nextTargetChar ? (
                <SignHandshapeIcon letter={nextTargetChar} size="2xl" />
              ) : (
                <CheckCircle2 className="w-20 h-20 text-emerald-500" />
              )}
            </div>

            {/* Letter & Detailed Description */}
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                Letter <span className="text-indigo-600 underline decoration-amber-400 decoration-4">{nextTargetChar || '✓'}</span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-900 font-bold">
                {currentSignInfo?.details.name || 'Well done!'}
              </p>
              <p className="text-xs text-slate-600 leading-snug max-w-[240px] font-medium">
                {currentSignInfo?.details.handshapeDescription || 'All letters matched!'}
              </p>
            </div>

            {/* Quick Upload Action */}
            {nextTargetChar && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 text-xs font-black transition flex items-center justify-center gap-1.5 border border-indigo-200 interactive-target shadow-sm"
              >
                <Camera className="w-4 h-4 text-indigo-600" />
                <span>Customize photo for &quot;{nextTargetChar}&quot;</span>
              </button>
            )}
          </div>
        </div>

        {/* Visual On-Screen QWERTY Keyboard — High Contrast (Black Signs on Crisp White Keys) */}
        <div
          className={`p-3 sm:p-6 md:p-7 rounded-3xl border-4 space-y-2.5 sm:space-y-3 select-none shadow-xl overflow-x-auto transition-colors ${
            boardTheme === 'light'
              ? 'bg-slate-100 border-slate-300'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-xs px-2 pb-1">
            <span
              className={`font-bold flex items-center gap-2 ${
                boardTheme === 'light' ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              <KeyboardIcon className="w-4 h-4 text-indigo-600" />
              Deaf QWERTY Keypad ({boardTheme === 'light' ? 'Light Contrast Mode' : 'Dark Glow Mode'})
            </span>
            <span
              className={`text-[11px] flex items-center gap-1 ${
                boardTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5 text-indigo-500" />
              100% Visual Readability
            </span>
          </div>

          {qwertyRows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex justify-center gap-1 sm:gap-2">
              {row.map((key) => {
                const isTargetKey = key === nextTargetChar;
                const isActive = activeKey === key;
                const hasCustomPhoto = typeof window !== 'undefined' && getCustomUploadedLetters().includes(key);

                return (
                  <button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className={`rounded-2xl transition-all shadow-md interactive-target relative flex flex-col items-center justify-center overflow-hidden ${
                      displayMode === 'both'
                        ? 'w-10 sm:w-16 md:w-20 h-16 sm:h-24 md:h-28 p-1 sm:p-1.5'
                        : displayMode === 'signs_only'
                        ? 'w-10 sm:w-16 md:w-20 h-16 sm:h-24 md:h-28 p-1 sm:p-1.5'
                        : 'w-8 h-10 sm:w-14 sm:h-16 md:w-16 md:h-18'
                    } ${
                      isTargetKey
                        ? 'bg-amber-300 border-4 border-amber-500 text-slate-950 ring-4 ring-amber-200/90 scale-105 z-20 shadow-amber-400/60 shadow-xl animate-pulse'
                        : isActive
                        ? 'bg-indigo-600 border-2 border-indigo-700 text-white scale-95 z-10'
                        : boardTheme === 'light'
                        ? 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 hover:border-indigo-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                    title={`Letter ${key}`}
                  >
                    {/* Letter Label Badge in Top-Left Corner (in Both Mode) */}
                    {displayMode === 'both' && (
                      <span
                        className={`absolute top-1 left-1.5 px-1.5 py-0.5 rounded-md font-black text-[10px] sm:text-xs z-10 ${
                          isTargetKey
                            ? 'bg-amber-400 text-slate-950 border border-amber-600/30 font-black'
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
                        className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white"
                        title="Custom photo active"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Bottom Space Bar */}
          <div className="flex justify-center pt-1.5">
            <div
              className={`w-1/2 h-8 sm:h-10 border rounded-xl flex items-center justify-center text-xs font-bold shadow-inner ${
                boardTheme === 'light'
                  ? 'bg-white border-slate-300 text-slate-500'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Spacebar / High-Contrast Fingerspelling Active
            </div>
          </div>
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
