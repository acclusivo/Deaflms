'use client';

import React, { useState } from 'react';
import { CheckCircle2, Sparkles, HelpCircle, Monitor, Camera, Keyboard as KeyboardIcon, Mouse, Usb } from 'lucide-react';

interface HardwareItem {
  id: string;
  name: string;
  signDescription: string;
  icon: React.ReactNode;
  hint: string;
}

interface ComputerHotspotGameProps {
  onComplete?: (score: number, stars: number) => void;
}

export const ComputerHotspotGame: React.FC<ComputerHotspotGameProps> = ({ onComplete }) => {
  const hardwareItems: HardwareItem[] = [
    {
      id: 'webcam',
      name: 'Webcam',
      signDescription: 'Sign: Hand shapes camera lens pointing outward at hands',
      icon: <Camera className="w-6 h-6" />,
      hint: 'Look at the very top center of the computer screen!',
    },
    {
      id: 'monitor',
      name: 'Monitor (Screen)',
      signDescription: 'Sign: L-hands trace a glowing wide rectangle',
      icon: <Monitor className="w-6 h-6" />,
      hint: 'The large display in the center where videos and signs appear!',
    },
    {
      id: 'keyboard',
      name: 'Keyboard',
      signDescription: 'Sign: Fingers wiggling across keys on desk',
      icon: <KeyboardIcon className="w-6 h-6" />,
      hint: 'The flat board with alphabet letters on the table!',
    },
    {
      id: 'mouse',
      name: 'Mouse',
      signDescription: 'Sign: Curved index finger clicking twice',
      icon: <Mouse className="w-6 h-6" />,
      hint: 'The handheld device next to the keyboard for pointing and clicking!',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ id: string; correct: boolean } | null>(null);

  const currentTarget = hardwareItems[currentIndex];

  const handleHotspotClick = (clickedId: string) => {
    if (completedItems.includes(clickedId)) return;

    if (clickedId === currentTarget.id) {
      setFeedback({ id: clickedId, correct: true });
      const nextCompleted = [...completedItems, clickedId];
      setCompletedItems(nextCompleted);

      setTimeout(() => {
        setFeedback(null);
        if (currentIndex + 1 < hardwareItems.length) {
          setCurrentIndex((i) => i + 1);
        } else {
          if (onComplete) onComplete(40, 3);
        }
      }, 900);
    } else {
      setFeedback({ id: clickedId, correct: false });
      setTimeout(() => setFeedback(null), 700);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
      {/* Target Prompt Box */}
      <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-200">
            {currentTarget.icon}
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-indigo-700">Find on the Computer:</div>
            <h3 className="text-2xl font-black text-slate-900">{currentTarget.name}</h3>
            <p className="text-xs font-bold text-slate-600 mt-0.5">{currentTarget.signDescription}</p>
          </div>
        </div>

        <div className="bg-white px-4 py-2 rounded-xl border border-indigo-100 shadow-sm text-xs font-extrabold text-indigo-800 flex items-center gap-1.5 shrink-0">
          <Sparkles className="w-4 h-4 text-amber-500" />
          {completedItems.length} / {hardwareItems.length} Discovered
        </div>
      </div>

      {/* Interactive Visual Computer Setup Diagram */}
      <div className="relative bg-slate-900 rounded-3xl p-8 border-4 border-slate-800 overflow-hidden flex flex-col items-center justify-center min-h-[380px] shadow-2xl">
        
        {/* WEBCAM HOTSPOT (Top of Monitor) */}
        <button
          onClick={() => handleHotspotClick('webcam')}
          className={`z-20 mb-1 px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all transform hover:scale-110 interactive-target ${
            completedItems.includes('webcam')
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40'
              : feedback?.id === 'webcam' && !feedback.correct
              ? 'bg-rose-500 text-white animate-wiggle'
              : currentTarget.id === 'webcam'
              ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300/50 animate-bounce'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          {completedItems.includes('webcam') ? '✓ Webcam' : 'Webcam Lens'}
        </button>

        {/* MONITOR DISPLAY HOTSPOT */}
        <button
          onClick={() => handleHotspotClick('monitor')}
          className={`w-72 sm:w-96 h-48 rounded-2xl border-4 transition-all flex flex-col items-center justify-center p-4 relative interactive-target ${
            completedItems.includes('monitor')
              ? 'bg-slate-800 border-emerald-500 text-emerald-400'
              : feedback?.id === 'monitor' && !feedback.correct
              ? 'bg-slate-800 border-rose-500 animate-wiggle'
              : currentTarget.id === 'monitor'
              ? 'bg-slate-800 border-amber-400 ring-4 ring-amber-300/40'
              : 'bg-slate-800/90 border-slate-600 hover:border-indigo-400'
          }`}
        >
          <Monitor className="w-12 h-12 text-slate-400 mb-2" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
            {completedItems.includes('monitor') ? '✓ Monitor Screen' : 'Computer Monitor'}
          </span>
          <span className="text-[10px] text-slate-500 mt-1">Shows your videos & sign lessons</span>
        </button>

        {/* Monitor Stand */}
        <div className="w-16 h-8 bg-slate-700 mx-auto" />
        <div className="w-32 h-3 bg-slate-600 rounded-full mb-4 shadow-md" />

        {/* DESK LEVEL: KEYBOARD & MOUSE */}
        <div className="flex items-center gap-4 z-10">
          {/* KEYBOARD HOTSPOT */}
          <button
            onClick={() => handleHotspotClick('keyboard')}
            className={`px-8 py-3 rounded-2xl border-4 transition-all flex items-center gap-2 interactive-target ${
              completedItems.includes('keyboard')
                ? 'bg-slate-800 border-emerald-500 text-emerald-400'
                : feedback?.id === 'keyboard' && !feedback.correct
                ? 'bg-slate-800 border-rose-500 animate-wiggle'
                : currentTarget.id === 'keyboard'
                ? 'bg-slate-800 border-amber-400 ring-4 ring-amber-300/40 animate-pulse'
                : 'bg-slate-800 border-slate-600 hover:border-indigo-400 text-slate-300'
            }`}
          >
            <KeyboardIcon className="w-5 h-5" />
            <span className="text-xs font-extrabold uppercase">
              {completedItems.includes('keyboard') ? '✓ Keyboard' : 'Keyboard'}
            </span>
          </button>

          {/* MOUSE HOTSPOT */}
          <button
            onClick={() => handleHotspotClick('mouse')}
            className={`w-14 h-16 rounded-3xl border-4 transition-all flex flex-col items-center justify-center interactive-target ${
              completedItems.includes('mouse')
                ? 'bg-slate-800 border-emerald-500 text-emerald-400'
                : feedback?.id === 'mouse' && !feedback.correct
                ? 'bg-slate-800 border-rose-500 animate-wiggle'
                : currentTarget.id === 'mouse'
                ? 'bg-slate-800 border-amber-400 ring-4 ring-amber-300/40 animate-pulse'
                : 'bg-slate-800 border-slate-600 hover:border-indigo-400 text-slate-300'
            }`}
          >
            <Mouse className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase mt-1">
              {completedItems.includes('mouse') ? '✓' : 'Mouse'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
