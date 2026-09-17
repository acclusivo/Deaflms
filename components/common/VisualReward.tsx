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
          colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch (e) {
        console.warn('Confetti trigger failed:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border-4 border-amber-300 relative overflow-hidden animate-star-pop">
        {/* Decorative background glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-200 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-200 rounded-full blur-3xl opacity-50 pointer-events-none" />

        {/* Trophy icon */}
        <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 rounded-3xl flex items-center justify-center border-2 border-amber-400 shadow-inner">
          <Trophy className="w-10 h-10 text-amber-600 animate-bounce" />
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
                  ? 'scale-110 text-amber-400 fill-amber-400 drop-shadow-md'
                  : 'text-slate-300'
              }`}
            >
              <Star className="w-10 h-10 fill-current" />
            </div>
          ))}
        </div>

        {/* Score readout */}
        <div className="text-sm font-bold text-slate-700 mb-8">
          Score: <span className="text-emerald-600 text-lg">{score}</span> / {totalPoints} Points
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
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-lg shadow-indigo-200 transition interactive-target"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
