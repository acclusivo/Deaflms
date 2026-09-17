import React from 'react';
import { Star, Sparkles } from 'lucide-react';

interface StarMeterProps {
  stars: number;
  showSparkle?: boolean;
}

export const StarMeter: React.FC<StarMeterProps> = ({ stars, showSparkle = true }) => {
  return (
    <div className="inline-flex items-center gap-2 bg-amber-50 border-2 border-amber-300 px-3 py-1.5 rounded-2xl shadow-sm">
      <div className="relative flex items-center justify-center">
        <Star className="w-5 h-5 text-amber-500 fill-amber-400 animate-star-pop" />
        {showSparkle && (
          <Sparkles className="w-3 h-3 text-amber-600 absolute -top-1.5 -right-1.5 animate-pulse" />
        )}
      </div>
      <span className="font-extrabold text-amber-900 text-base">{stars}</span>
      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Stars</span>
    </div>
  );
};
