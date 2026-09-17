'use client';

import React, { useState } from 'react';
import { MatchingPair } from '@/lib/types';
import { CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

interface PictureToSignGameProps {
  pairs: MatchingPair[];
  onComplete: (score: number, stars: number) => void;
}

export const PictureToSignGame: React.FC<PictureToSignGameProps> = ({ pairs, onComplete }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [errorPair, setErrorPair] = useState<{ left: string; right: string } | null>(null);
  const [shuffledRight] = useState(() => [...pairs].sort(() => Math.random() - 0.5));

  const handleLeftClick = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setSelectedLeft(id);
    setErrorPair(null);
  };

  const handleRightClick = (id: string) => {
    if (!selectedLeft || matchedPairs.includes(id)) return;

    if (selectedLeft === id) {
      // Correct match!
      const newMatched = [...matchedPairs, id];
      setMatchedPairs(newMatched);
      setSelectedLeft(null);
      setErrorPair(null);

      // Check if all matched
      if (newMatched.length === pairs.length) {
        setTimeout(() => {
          onComplete(100, 3);
        }, 600);
      }
    } else {
      // Incorrect match
      setErrorPair({ left: selectedLeft, right: id });
      setTimeout(() => {
        setErrorPair(null);
        setSelectedLeft(null);
      }, 700);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Visual Instruction Banner */}
      <div className="bg-indigo-50 border-2 border-indigo-200 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
            1
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">Picture ➔ Sign Match</h4>
            <p className="text-slate-600 text-xs">Tap a picture card on the left, then tap its sign card on the right.</p>
          </div>
        </div>
        <div className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-white px-3 py-1.5 rounded-xl border border-indigo-100 shadow-sm flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          {matchedPairs.length} / {pairs.length} Matched
        </div>
      </div>

      {/* Matching Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Pictures / Real Objects */}
        <div className="space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
            Real Objects / Concept Pictures
          </div>
          {pairs.map((item) => {
            const isMatched = matchedPairs.includes(item.id);
            const isSelected = selectedLeft === item.id;
            const isError = errorPair?.left === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleLeftClick(item.id)}
                className={`p-3 rounded-2xl border-4 transition-all duration-200 flex items-center gap-4 interactive-target ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-400 opacity-80 cursor-default'
                    : isError
                    ? 'bg-rose-50 border-rose-500 animate-wiggle'
                    : isSelected
                    ? 'bg-indigo-50 border-indigo-600 shadow-lg scale-102 cursor-pointer'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50 cursor-pointer'
                }`}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img src={item.leftMediaUrl} alt={item.leftLabel} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="font-black text-slate-900 text-base">{item.leftLabel}</div>
                  <span className="text-[11px] font-bold text-slate-500">Tap to select</span>
                </div>
                {isMatched && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* Right Column: Sign Descriptions / Clips */}
        <div className="space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
            Sign Language Demonstrations
          </div>
          {shuffledRight.map((item) => {
            const isMatched = matchedPairs.includes(item.id);
            const isError = errorPair?.right === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleRightClick(item.id)}
                className={`p-3 rounded-2xl border-4 transition-all duration-200 flex items-center gap-4 interactive-target ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-400 opacity-80 cursor-default'
                    : isError
                    ? 'bg-rose-50 border-rose-500 animate-wiggle'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50 cursor-pointer'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black shrink-0 border border-indigo-200">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-sm leading-snug">{item.rightLabel}</div>
                  {item.signHint && (
                    <div className="text-[11px] text-indigo-600 font-bold mt-0.5">{item.signHint}</div>
                  )}
                </div>
                {isMatched && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
