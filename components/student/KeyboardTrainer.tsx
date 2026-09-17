'use client';

import React, { useState, useEffect } from 'react';
import { Keyboard as KeyboardIcon, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

interface KeyboardTrainerProps {
  onComplete?: (score: number, stars: number) => void;
}

export const KeyboardTrainer: React.FC<KeyboardTrainerProps> = ({ onComplete }) => {
  const targetWords = ['CHAT', 'WEBCAM', 'LINK', 'SIGN'];
  const [wordIndex, setWordIndex] = useState(0);
  const [typedLetters, setTypedLetters] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const currentWord = targetWords[wordIndex];

  const qwertyRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  const handleKeyPress = (char: string) => {
    setActiveKey(char);
    setTimeout(() => setActiveKey(null), 200);

    const nextExpectedChar = currentWord[typedLetters.length];
    if (char.toUpperCase() === nextExpectedChar) {
      const nextTyped = [...typedLetters, char.toUpperCase()];
      setTypedLetters(nextTyped);

      if (nextTyped.length === currentWord.length) {
        // Finished current word
        setTimeout(() => {
          if (wordIndex + 1 < targetWords.length) {
            setWordIndex((w) => w + 1);
            setTypedLetters([]);
          } else {
            if (onComplete) onComplete(30, 3);
          }
        }, 500);
      }
    }
  };

  // Listen to physical keyboard events as well
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const char = e.key.toUpperCase();
      if (/^[A-Z]$/.test(char)) {
        handleKeyPress(char);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentWord, typedLetters, wordIndex]);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
            <KeyboardIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg">Fingerspell Keyboarding Trainer</h3>
            <p className="text-xs text-slate-500">Press keys or tap below to practice typing digital words!</p>
          </div>
        </div>

        <div className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
          Word {wordIndex + 1} of {targetWords.length}
        </div>
      </div>

      {/* Target Word Display */}
      <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 text-center space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Type this word:</span>
        <div className="flex justify-center items-center gap-3">
          {currentWord.split('').map((letter, idx) => {
            const isTyped = idx < typedLetters.length;
            const isCurrent = idx === typedLetters.length;
            return (
              <div
                key={idx}
                className={`w-14 h-16 rounded-2xl border-4 flex flex-col items-center justify-center font-black text-2xl transition-all ${
                  isTyped
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 scale-105'
                    : isCurrent
                    ? 'border-indigo-600 bg-white text-indigo-900 ring-4 ring-indigo-200 animate-pulse'
                    : 'border-slate-200 bg-white text-slate-300'
                }`}
              >
                <span>{letter}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">ASL</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive On-Screen Visual QWERTY Keyboard */}
      <div className="bg-slate-900 p-4 sm:p-6 rounded-3xl border-4 border-slate-800 space-y-2 select-none shadow-xl">
        {qwertyRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-1.5 sm:gap-2">
            {row.map((key) => {
              const nextTargetChar = currentWord[typedLetters.length];
              const isTargetKey = key === nextTargetChar;
              const isActive = activeKey === key;

              return (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`w-8 h-10 sm:w-12 sm:h-14 rounded-xl font-black text-xs sm:text-base flex flex-col items-center justify-center transition-all shadow-md interactive-target ${
                    isTargetKey
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105 animate-bounce'
                      : isActive
                      ? 'bg-indigo-600 text-white scale-95'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span>{key}</span>
                  <span className="text-[7px] font-bold text-slate-400">👋</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
