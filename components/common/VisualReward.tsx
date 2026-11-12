'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, ArrowRight, RotateCcw } from 'lucide-react';

interface VisualRewardProps {
  isOpen: boolean;
  starsEarned: number;
  score: number;
  totalPoints: number;
  onContinue: () => void;
  onRetry?: () => void;
  title?: string;
  subtitle?: string;
}

export const VisualReward: React.FC<VisualRewardProps> = ({
  isOpen,
  starsEarned,
  score,
  totalPoints,
  onContinue,
  onRetry,
  title = 'Outstanding Job!',
  subtitle = 'You mastered this visual sign exercise!',
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire visual confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00177D', '#1B4EA7', '#087F8C', '#F4B942', '#3847AF'],
        });
      } catch (e) {
        console.warn('Confetti trigger failed:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border-4 border-[#F4B942] relative overflow-hidden animate-star-pop">
        {/* Decorative background glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#FEF7E8] rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#E6F4F6] rounded-full blur-3xl opacity-60 pointer-events-none" />

        {/* Trophy icon */}
        <div className="w-20 h-20 mx-auto mb-4 bg-[#FEF7E8] rounded-3xl flex items-center justify-center border-2 border-[#F4B942] shadow-inner">
          <Trophy className="w-10 h-10 text-[#8F6010] animate-bounce" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">{title}</h2>
        <p className="text-slate-600 text-sm mb-6">{subtitle}</p>

        {/* Visual Stars Section */}
        <div className="flex justify-center items-center gap-3 mb-6 bg-slate-50 py-4 px-6 rounded-2xl border border-slate-200">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`transition-all duration-500 transform ${
                starIdx <= starsEarned
                  ? 'scale-110 text-[#F4B942] fill-[#F4B942] drop-shadow-md'
                  : 'text-slate-300'
              }`}
            >
              <Star className="w-10 h-10 fill-current" />
            </div>
          ))}
        </div>

        {/* Score readout */}
        <div className="text-sm font-bold text-slate-700 mb-8">
          Score: <span className="text-[#15803D] text-lg font-black">{score}</span> / {totalPoints} Points
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border-2 border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition interactive-target"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          )}
          <button
            onClick={onContinue}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#1B4EA7] hover:bg-[#00177D] text-white font-extrabold shadow-md transition interactive-target"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
