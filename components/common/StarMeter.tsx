import React from 'react';
import { Star, Sparkles } from 'lucide-react';

interface StarMeterProps {
  stars: number;
  showSparkle?: boolean;
}

export const StarMeter: React.FC<StarMeterProps> = ({ stars, showSparkle = true }) => {
  return (
    <div className="inline-flex items-center gap-2 bg-[#FEF7E8] border-2 border-[#F4B942]/60 px-3 py-1.5 rounded-2xl shadow-xs">
      <div className="relative flex items-center justify-center">
        <Star className="w-5 h-5 text-[#E09F2B] fill-[#F4B942] animate-star-pop" />
        {showSparkle && (
          <Sparkles className="w-3 h-3 text-[#B45309] absolute -top-1.5 -right-1.5 animate-pulse" />
        )}
      </div>
      <span className="font-extrabold text-[#1F2937] text-base">{stars}</span>
      <span className="text-xs font-bold text-[#8F6010] uppercase tracking-wider">Stars</span>
    </div>
  );
};
