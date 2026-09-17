'use client';

import React, { useState } from 'react';
import { Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react';
import { SignHandshapeIcon } from './SignHandshapeIcon';

interface FingerspellBuilderProps {
  targetWord: string;
  availableTiles: string[];
  onComplete: (score: number, stars: number) => void;
}

export const FingerspellBuilder: React.FC<FingerspellBuilderProps> = ({
  targetWord,
  availableTiles,
  onComplete,
}) => {
  const [currentSpelling, setCurrentSpelling] = useState<string[]>([]);
  const [usedTileIndices, setUsedTileIndices] = useState<number[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const lettersTarget = targetWord.toUpperCase().split('');

  const handleTileClick = (letter: string, tileIndex: number) => {
    if (usedTileIndices.includes(tileIndex) || isSuccess) return;

    const nextSpelling = [...currentSpelling, letter];
    const nextUsed = [...usedTileIndices, tileIndex];

    setCurrentSpelling(nextSpelling);
    setUsedTileIndices(nextUsed);

    // Check if finished
    if (nextSpelling.length === lettersTarget.length) {
      if (nextSpelling.join('') === targetWord.toUpperCase()) {
        setIsSuccess(true);
        setTimeout(() => {
          onComplete(20, 3);
        }, 700);
      }
    }
  };

  const handleReset = () => {
    setCurrentSpelling([]);
    setUsedTileIndices([]);
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6 text-center">
      {/* Header */}
      <div>
        <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 inline-block mb-2">
          Fingerspell Tile Builder
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Spell the word: <span className="text-indigo-600 underline decoration-indigo-300">{targetWord}</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">Tap the fingerspelling handshape letter tiles in the correct order!</p>
      </div>

      {/* Target Letter Slots */}
      <div className="flex justify-center gap-3 py-4">
        {lettersTarget.map((targetChar, idx) => {
          const filledChar = currentSpelling[idx];
          return (
            <div
              key={idx}
              className={`w-16 sm:w-20 h-24 sm:h-28 rounded-2xl border-4 flex flex-col items-center justify-between p-2 transition-all ${
                filledChar
                  ? isSuccess
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 correct-glow'
                    : 'border-indigo-600 bg-indigo-50 text-indigo-950 scale-105'
                  : 'border-dashed border-slate-300 bg-slate-50 text-slate-400'
              }`}
            >
              {filledChar ? (
                <>
                  <div className="w-10 h-10 flex items-center justify-center">
                    <SignHandshapeIcon letter={filledChar} size="sm" />
                  </div>
                  <span className="text-lg font-black">{filledChar}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Slot {idx + 1}</span>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-300">?</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">Slot {idx + 1}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Available Letter Tiles with Sign Handshapes */}
      <div className="pt-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Available Sign Handshape Tiles:
        </div>
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
          {availableTiles.map((letter, idx) => {
            const isUsed = usedTileIndices.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleTileClick(letter, idx)}
                disabled={isUsed || isSuccess}
                className={`w-14 sm:w-16 h-20 sm:h-22 rounded-2xl border-2 font-black transition-all shadow-sm interactive-target p-1.5 flex flex-col items-center justify-between ${
                  isUsed
                    ? 'opacity-20 border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'border-slate-300 bg-white hover:border-indigo-600 hover:scale-105 active:scale-95 text-slate-800 cursor-pointer hover:shadow-md'
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <SignHandshapeIcon letter={letter} size="sm" />
                </div>
                <span className="text-sm font-black">{letter}</span>
                <span className="text-[7px] font-extrabold text-indigo-600 uppercase">Sign</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset & Status Controls */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Tiles
        </button>
        {isSuccess && (
          <span className="text-sm font-black text-emerald-600 flex items-center gap-1 animate-star-pop">
            <CheckCircle2 className="w-4 h-4" />
            Great Fingerspelling!
          </span>
        )}
      </div>
    </div>
  );
};
