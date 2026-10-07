'use client';

import React, { useState } from 'react';
import { MatchingPair } from '@/lib/types';
import { CheckCircle2, Sparkles, Play, RotateCcw, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PictureToSignGameProps {
  pairs: MatchingPair[];
  onComplete: (score: number, stars: number) => void;
}

export const PictureToSignGame: React.FC<PictureToSignGameProps> = ({ pairs, onComplete }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);

  const currentPair = pairs[currentQuestionIdx];

  // Options: current pair plus up to 2 other pairs as distractors
  const options = React.useMemo(() => {
    if (!currentPair) return [];
    const others = pairs.filter((p) => p.id !== currentPair.id);
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 2);
    return [currentPair, ...shuffledOthers].sort(() => Math.random() - 0.5);
  }, [currentQuestionIdx, pairs, currentPair]);

  const handleSelectOption = (option: MatchingPair) => {
    if (selectedOptionId !== null) return; // prevent multi-click

    setSelectedOptionId(option.id);
    const isCorrect = option.id === currentPair.id;
    setIsAnsweredCorrectly(isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      } catch {
        // graceful
      }
    }

    // Auto advance after visual affirmation
    setTimeout(() => {
      if (currentQuestionIdx + 1 < pairs.length) {
        setCurrentQuestionIdx((i) => i + 1);
        setSelectedOptionId(null);
        setIsAnsweredCorrectly(null);
      } else {
        const finalScore = isCorrect ? score + 1 : score;
        const total = pairs.length;
        const stars = finalScore === total ? 3 : finalScore >= total / 2 ? 2 : 1;
        onComplete((finalScore / total) * 100, stars);
      }
    }, 1200);
  };

  if (!currentPair) return null;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 text-slate-900">
      {/* Visual Instruction Banner */}
      <div className="bg-teal-50 border-2 border-teal-200 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black">
            {currentQuestionIdx + 1}
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">Choose the Matching Sign</h4>
            <p className="text-slate-600 text-xs">
              Look at the picture, then select the sign video demonstrating this item.
            </p>
          </div>
        </div>
        <div className="text-xs font-black uppercase tracking-wider text-teal-800 bg-white px-3 py-1.5 rounded-xl border border-teal-200 shadow-xs flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Question {currentQuestionIdx + 1} of {pairs.length}
        </div>
      </div>

      {/* Target Picture Display */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-col items-center gap-3 text-center">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
          Target Real Object Picture:
        </span>
        <div className="w-44 h-44 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-inner">
          <img
            src={currentPair.leftMediaUrl}
            alt={currentPair.leftLabel}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-xs font-bold text-slate-400">
          (Which of the signs below represents this object?)
        </span>
      </div>

      {/* Visual Sign Options (Videos / Still Image Demos - NO written text spoilers!) */}
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-600 px-1 block">
          Sign Language Video Options:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            const isCorrect = opt.id === currentPair.id;

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt)}
                disabled={selectedOptionId !== null}
                className={`rounded-3xl border-4 p-3 transition-all duration-200 flex flex-col items-center gap-2 interactive-target ${
                  isSelected
                    ? isCorrect
                      ? 'border-emerald-600 bg-emerald-50 ring-4 ring-emerald-100 scale-102'
                      : 'border-rose-500 bg-rose-50'
                    : 'border-slate-200 bg-white hover:border-teal-500 hover:bg-slate-50'
                }`}
                aria-label={`Sign language demonstration option ${idx + 1}`}
              >
                {/* Sign Video/Still Display */}
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black relative border border-slate-800">
                  <img
                    src={opt.rightMediaUrl}
                    alt={`Sign Demonstration Option ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="w-10 h-10 rounded-xl bg-teal-700/80 text-white flex items-center justify-center shadow-md">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </span>
                  </div>
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                    Sign {idx + 1}
                  </span>
                </div>

                {/* State Feedback */}
                <div className="w-full flex items-center justify-between px-1 pt-1 text-xs">
                  <span className="font-bold text-slate-600">Option {idx + 1}</span>
                  {isSelected && (
                    <span className="font-black">
                      {isCorrect ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> Incorrect
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Feedback Message */}
      {isAnsweredCorrectly !== null && (
        <div
          className={`p-4 rounded-2xl border-2 flex items-center gap-3 text-xs font-bold animate-fade-in ${
            isAnsweredCorrectly
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          {isAnsweredCorrectly ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <span>
            {isAnsweredCorrectly
              ? 'Correct! You connected the real object picture with its verified sign.'
              : 'Incorrect sign selected. Review the visual demonstration.'}
          </span>
        </div>
      )}
    </div>
  );
};
