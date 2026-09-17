'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Keyboard as KeyboardIcon,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Camera,
  Layers,
  HelpCircle,
  Eye,
  Info,
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
    <div key={renderNonce} className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Main Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
        
        {/* Header & Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
              <KeyboardIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-lg sm:text-xl">
                  Visual Fingerspelling Keyboard Trainer
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  Deaf Literacy
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md border border-indigo-200">
                  AnySign ASL Matched
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Each letter and key is matched with authentic AnySign ASL handshape photos (or custom photos) for instant visual learning!
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Upload Custom Sign Pictures Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black transition flex items-center gap-2 border border-indigo-200 shadow-sm interactive-target"
              title="Upload real photos of local signs (NSL, ASL, KSL, SASL, GSL) to replace default vectors"
            >
              <Camera className="w-4 h-4 text-indigo-600" />
              <span>Upload / Edit Sign Photos</span>
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
            <span>Keycap Display Style:</span>
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
              🔤 + 👋 Letter & Sign Picture
            </button>
            <button
              onClick={() => setDisplayMode('signs_only')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                displayMode === 'signs_only'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👋 Sign Pictures Only (Deaf Challenge)
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

        {/* Visual Target Word & Current Sign Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          {/* Target Word Display (2 cols) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-50 to-indigo-50/30 border-2 border-slate-200 rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Spell This Word Using Handshapes:
              </span>
              <button
                onClick={handleResetWord}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Word
              </button>
            </div>

            {/* Word Letter Tiles with Individual Handshape Signs */}
            <div className="flex flex-wrap justify-center items-center gap-2.5 sm:gap-3.5 py-2">
              {currentWord.split('').map((letter, idx) => {
                const isTyped = idx < typedLetters.length;
                const isCurrent = idx === typedLetters.length;

                return (
                  <div
                    key={idx}
                    className={`relative w-16 sm:w-20 h-24 sm:h-28 rounded-2xl border-4 flex flex-col items-center justify-between p-2 transition-all ${
                      isTyped
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md scale-105'
                        : isCurrent
                        ? 'border-indigo-600 bg-white text-indigo-900 ring-4 ring-indigo-200 shadow-lg scale-110 animate-pulse'
                        : 'border-slate-200 bg-white text-slate-400 opacity-60'
                    }`}
                  >
                    {/* Visual Sign Image / Icon for this letter */}
                    <div className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center">
                      <SignHandshapeIcon letter={letter} size="md" />
                    </div>

                    {/* Letter Character */}
                    <span className="font-black text-lg sm:text-xl tracking-wide">
                      {letter}
                    </span>

                    {/* Status indicator */}
                    {isTyped ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute -top-2 -right-2 bg-white rounded-full" />
                    ) : (
                      <span className="text-[8px] font-black uppercase text-slate-400">
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
                <span className="text-emerald-600 font-black flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Word Complete! Preparing next word...
                </span>
              ) : (
                <span>
                  Type the sign handshape for letter{' '}
                  <strong className="text-indigo-600 font-black text-sm">&quot;{nextTargetChar}&quot;</strong> on your keyboard
                </span>
              )}
            </div>
          </div>

          {/* Current Sign Spotlight Card (1 col) */}
          <div className="bg-indigo-900 text-white rounded-3xl p-5 flex flex-col items-center justify-between text-center space-y-3 shadow-xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="w-full flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Target Sign
              </span>
              {currentSignInfo?.type === 'custom' && (
                <span className="text-[9px] font-black uppercase bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2 py-0.5 rounded-md">
                  Custom Photo
                </span>
              )}
            </div>

            {/* Prominent Large Sign Picture */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-indigo-800/80 border-2 border-indigo-400/30 flex items-center justify-center p-2 shadow-inner">
              {nextTargetChar ? (
                <SignHandshapeIcon letter={nextTargetChar} size="xl" />
              ) : (
                <CheckCircle2 className="w-16 h-16 text-emerald-400" />
              )}
            </div>

            {/* Letter & Description */}
            <div className="space-y-1">
              <div className="text-2xl font-black text-amber-300">
                Letter {nextTargetChar || '✓'}
              </div>
              <p className="text-xs text-indigo-100 font-bold">
                {currentSignInfo?.details.name || 'Well done!'}
              </p>
              <p className="text-[11px] text-indigo-200/80 leading-snug line-clamp-2 max-w-[220px]">
                {currentSignInfo?.details.handshapeDescription || 'You matched all letters!'}
              </p>
            </div>

            {/* Quick Upload Action */}
            {nextTargetChar && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-indigo-700/80 hover:bg-indigo-600 text-indigo-100 text-[11px] font-bold transition flex items-center justify-center gap-1.5 border border-indigo-500/30 interactive-target"
              >
                <Camera className="w-3.5 h-3.5 text-amber-300" />
                <span>Customize sign for &quot;{nextTargetChar}&quot;</span>
              </button>
            )}
          </div>
        </div>

        {/* Visual On-Screen QWERTY Keyboard */}
        <div className="bg-slate-900 p-4 sm:p-6 rounded-3xl border-4 border-slate-800 space-y-2.5 select-none shadow-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs px-2 pb-1">
            <span className="font-bold flex items-center gap-1.5">
              <KeyboardIcon className="w-4 h-4 text-indigo-400" />
              Interactive Deaf QWERTY Keypad
            </span>
            <span className="text-[11px] text-slate-400">
              Tap keys or use your physical keyboard
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
                    className={`rounded-2xl transition-all shadow-md interactive-target relative flex flex-col items-center justify-center ${
                      displayMode === 'both'
                        ? 'w-9 h-14 sm:w-14 sm:h-20 p-1'
                        : displayMode === 'signs_only'
                        ? 'w-10 h-14 sm:w-16 sm:h-20 p-1'
                        : 'w-8 h-10 sm:w-12 sm:h-14'
                    } ${
                      isTargetKey
                        ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300/80 scale-105 z-10 shadow-amber-500/50 shadow-lg'
                        : isActive
                        ? 'bg-indigo-600 text-white scale-95'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                    }`}
                    title={`Letter ${key}`}
                  >
                    {/* Sign Handshape Picture */}
                    {displayMode !== 'letters_only' && (
                      <div className="shrink-0 flex items-center justify-center">
                        <SignHandshapeIcon
                          letter={key}
                          size={displayMode === 'signs_only' ? 'sm' : 'xs'}
                        />
                      </div>
                    )}

                    {/* Letter Label */}
                    {displayMode !== 'signs_only' && (
                      <span className={`font-black tracking-tight ${
                        displayMode === 'both'
                          ? 'text-[11px] sm:text-xs mt-0.5'
                          : 'text-xs sm:text-base'
                      }`}>
                        {key}
                      </span>
                    )}

                    {/* Subtle dot indicating custom photo active for this letter */}
                    {hasCustomPhoto && (
                      <span
                        className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400"
                        title="Custom photo active"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Bottom Space Bar */}
          <div className="flex justify-center pt-1">
            <div className="w-1/2 h-8 sm:h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold">
              Spacebar / Visual Fingerspelling Active
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
