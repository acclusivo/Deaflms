'use client';

import React from 'react';
import { Gauge, Repeat } from 'lucide-react';

interface SpeedControlsProps {
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  isLooping: boolean;
  onToggleLoop: () => void;
}

export const SpeedControls: React.FC<SpeedControlsProps> = ({
  currentSpeed,
  onSpeedChange,
  isLooping,
  onToggleLoop,
}) => {
  const speeds = [0.5, 0.75, 1.0];

  return (
    <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700">
      <div className="flex items-center gap-1.5 px-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
        <Gauge className="w-3.5 h-3.5 text-indigo-400" />
        <span>Sign Speed:</span>
      </div>

      <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`px-2.5 py-1 text-xs font-black rounded-lg transition interactive-target ${
              currentSpeed === s
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {s === 1.0 ? '1.0x Normal' : `${s}x Slow`}
          </button>
        ))}
      </div>

      {/* Segment Loop Button */}
      <button
        onClick={onToggleLoop}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition interactive-target ml-auto ${
          isLooping
            ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
            : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
        }`}
        title="Repeat sign segment continuously"
      >
        <Repeat className={`w-3.5 h-3.5 ${isLooping ? 'animate-spin' : ''}`} />
        <span>{isLooping ? 'Loop Active' : 'Loop Sign'}</span>
      </button>
    </div>
  );
};
