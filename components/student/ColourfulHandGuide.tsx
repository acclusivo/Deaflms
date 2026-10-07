'use client';

import React from 'react';
import {
  FingerId,
  FingerDefinition,
  FINGER_DEFINITIONS,
  getFingerForKey,
} from '@/lib/keyboard-curriculum';
import { SignHandshapeIcon } from './SignHandshapeIcon';
import { Sparkles, Check, Info } from 'lucide-react';

interface ColourfulHandGuideProps {
  activeKey?: string | null;
  pressedKey?: string | null;
  showSignsOnFingers?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
}

export const ColourfulHandGuide: React.FC<ColourfulHandGuideProps> = ({
  activeKey,
  pressedKey,
  showSignsOnFingers = true,
  className = '',
  theme = 'light',
}) => {
  const activeFinger = activeKey ? getFingerForKey(activeKey) : null;
  const pressedFinger = pressedKey ? getFingerForKey(pressedKey) : null;

  // Finger orders for anatomical presentation (palms down, back of hands facing learner)
  // Left Hand: Pinky -> Ring -> Middle -> Index -> Thumb
  const leftFingers: FingerId[] = [
    'left-pinky',
    'left-ring',
    'left-middle',
    'left-index',
    'left-thumb',
  ];

  // Right Hand: Thumb -> Index -> Middle -> Ring -> Pinky
  const rightFingers: FingerId[] = [
    'right-thumb',
    'right-index',
    'right-middle',
    'right-ring',
    'right-pinky',
  ];

  const renderFinger = (fingerId: FingerId, isThumb = false) => {
    const finger: FingerDefinition = FINGER_DEFINITIONS[fingerId];
    const isTarget = activeFinger?.id === fingerId;
    const isRecentlyPressed = pressedFinger?.id === fingerId;

    // Finger height mapping based on realistic hand ergonomics
    const fingerHeightClasses = {
      'left-pinky': 'h-24 sm:h-28',
      'left-ring': 'h-32 sm:h-36',
      'left-middle': 'h-36 sm:h-40',
      'left-index': 'h-30 sm:h-34',
      'left-thumb': 'h-20 sm:h-22 self-end',
      'right-thumb': 'h-20 sm:h-22 self-end',
      'right-index': 'h-30 sm:h-34',
      'right-middle': 'h-36 sm:h-40',
      'right-ring': 'h-32 sm:h-36',
      'right-pinky': 'h-24 sm:h-28',
    }[fingerId];

    return (
      <div
        key={fingerId}
        className={`relative flex flex-col items-center justify-between transition-all duration-200 select-none ${
          isThumb ? 'w-10 sm:w-12' : 'w-11 sm:w-14'
        } ${fingerHeightClasses} ${
          isTarget
            ? '-translate-y-3 sm:-translate-y-4 scale-105 z-20'
            : isRecentlyPressed
            ? 'scale-95'
            : 'hover:-translate-y-1'
        }`}
        title={`${finger.handName} ${finger.name} (Home Key: ${finger.homeKey})`}
        aria-label={`${finger.handName} ${finger.name}, Home key: ${finger.homeKey}`}
      >
        {/* Active Target Banner above Finger */}
        {isTarget && (
          <div className="absolute -top-10 sm:-top-12 flex flex-col items-center z-30 animate-bounce">
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-lg flex items-center gap-1 border border-white"
              style={{ backgroundColor: finger.color.hex }}
            >
              <Sparkles className="w-3 h-3" />
              Use This!
            </span>
            <div
              className="w-0 h-0 border-x-4 border-x-transparent border-t-4"
              style={{ borderTopColor: finger.color.hex }}
            />
          </div>
        )}

        {/* Fingertip Container with Color Strip & Home Row Key */}
        <div
          className={`w-full rounded-2xl sm:rounded-3xl border-3 flex flex-col items-center justify-between p-1 sm:p-1.5 transition-all shadow-md ${
            isTarget
              ? 'ring-4 ring-offset-2 ring-white shadow-2xl scale-105'
              : 'border-slate-300'
          }`}
          style={{
            backgroundColor: isTarget
              ? finger.color.hex
              : theme === 'dark'
              ? '#1E293B'
              : '#FFFFFF',
            borderColor: finger.color.hex,
            boxShadow: isTarget ? `0 10px 25px -3px ${finger.color.hex}80` : undefined,
          }}
        >
          {/* Fingernail / Color Cap with Home Row Sign or Letter */}
          <div
            className={`w-full rounded-xl sm:rounded-2xl py-1 px-0.5 flex flex-col items-center justify-center text-center transition-colors ${
              isTarget ? 'bg-white text-slate-950' : 'text-white'
            }`}
            style={{
              backgroundColor: isTarget ? '#FFFFFF' : finger.color.hex,
              color: isTarget ? '#0F172A' : '#FFFFFF',
            }}
          >
            {/* Show Sign Handshape for the active letter or home key */}
            {showSignsOnFingers && finger.homeKey !== 'SPACE' && (
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center pointer-events-none">
                <SignHandshapeIcon
                  letter={isTarget && activeKey ? activeKey : finger.homeKey}
                  size="xs"
                  className={isTarget ? 'scale-110' : ''}
                />
              </div>
            )}

            {/* Target or Home Key Symbol */}
            <span className="font-black text-xs sm:text-sm tracking-tight leading-none mt-0.5">
              {isTarget && activeKey ? activeKey : finger.homeKey}
            </span>
          </div>

          {/* Secondary Reach Indicator (e.g. +G for F, +H for J) */}
          {finger.reachKeys && (
            <div
              className={`text-[8px] sm:text-[9px] font-black uppercase px-1 py-0.2 rounded mt-0.5 ${
                isTarget
                  ? 'bg-black/30 text-white'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              +{finger.reachKeys.join(',')}
            </div>
          )}

          {/* Finger Knuckle Ring Marks */}
          <div className="w-6 sm:w-8 h-1 my-0.5 border-t border-b border-slate-300/60 opacity-60" />

          {/* Finger Name (Pinky, Ring, etc.) */}
          <span
            className={`text-[8px] sm:text-[9px] font-black uppercase tracking-tight text-center ${
              isTarget ? 'text-white' : theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {finger.name}
          </span>
        </div>

        {/* Base connection to Palm */}
        <div
          className="w-3/4 h-2 rounded-b-md border-t-0 border-2"
          style={{ borderColor: finger.color.hex, backgroundColor: `${finger.color.hex}33` }}
        />
      </div>
    );
  };

  return (
    <div
      className={`rounded-3xl border-4 p-4 sm:p-6 transition-colors shadow-xl space-y-4 ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-800 text-white'
          : 'bg-gradient-to-b from-slate-50 via-white to-slate-100 border-slate-300 text-slate-900'
      } ${className}`}
      aria-label="Attached Colourful Hand Finger Placement Guide for Deaf Learners"
    >
      {/* Hand Guide Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black shadow-sm">
            🖐️
          </div>
          <div>
            <h4 className="font-black text-sm sm:text-base flex items-center gap-2">
              <span>Attached Colourful Hand & Finger Guide</span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-900 border border-teal-300 px-2 py-0.5 rounded-full">
                Home Row Anchors
              </span>
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Look at which finger lights up to know which finger types the letter.
            </p>
          </div>
        </div>

        {/* Real-time Guidance Pill */}
        {activeFinger && activeKey && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 text-xs font-black shadow-sm animate-pulse"
            style={{
              borderColor: activeFinger.color.hex,
              backgroundColor: `${activeFinger.color.hex}18`,
              color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
            }}
          >
            <div
              className="w-3.5 h-3.5 rounded-full ring-2 ring-white"
              style={{ backgroundColor: activeFinger.color.hex }}
            />
            <span>
              Target:{' '}
              <strong className="underline decoration-2" style={{ textDecorationColor: activeFinger.color.hex }}>
                &ldquo;{activeKey}&rdquo;
              </strong>{' '}
              → {activeFinger.handName} {activeFinger.name}
            </span>
          </div>
        )}
      </div>

      {/* Visual Alignment Ribbons (Connecting Virtual Keyboard to Attached Hands) */}
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400 px-3">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="w-2 h-2 rounded-full bg-sky-500" />
          <span>Left Hand Keys (A - S - D - F - G)</span>
        </div>
        <div className="hidden md:flex items-center gap-1 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <span>Thumbs (Spacebar)</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Right Hand Keys (H - J - K - L - ;)</span>
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="w-2 h-2 rounded-full bg-pink-500" />
        </div>
      </div>

      {/* The Two Attached Hands (Left Hand & Right Hand Side by Side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end pt-2">
        {/* ======================================================== */}
        {/* LEFT HAND CONTAINER */}
        {/* ======================================================== */}
        <div
          className={`relative rounded-3xl border-3 p-4 sm:p-5 flex flex-col items-center justify-between shadow-inner transition-colors ${
            activeFinger?.hand === 'left'
              ? 'border-indigo-400 bg-indigo-50/40 ring-2 ring-indigo-200'
              : 'border-slate-200 bg-white/80'
          }`}
        >
          {/* Hand Label Badge */}
          <div className="w-full flex items-center justify-between pb-2 mb-1 border-b border-slate-100">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <span>🤚 Left Hand</span>
              <span className="text-[10px] font-bold text-slate-500">
                (A · S · D · F + G)
              </span>
            </span>
            {activeFinger?.hand === 'left' && (
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white animate-pulse">
                Active Hand
              </span>
            )}
          </div>

          {/* Fingers Row (Pinky to Thumb) */}
          <div className="w-full flex justify-around items-end gap-1 sm:gap-2 pt-2">
            {leftFingers.map((fId) => renderFinger(fId, fId === 'left-thumb'))}
          </div>

          {/* Left Palm Cushion with Home Row Visual Sequence */}
          <div className="w-full mt-3 py-2 px-3 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="text-[10px] font-black uppercase text-slate-500">
              Left Rest Position:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                A
              </span>
              <span className="w-5 h-5 rounded-md bg-orange-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                S
              </span>
              <span className="w-5 h-5 rounded-md bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                D
              </span>
              <span className="w-5 h-5 rounded-md bg-sky-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                F
              </span>
              <span className="text-slate-400 text-[10px] font-black">+G</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT HAND CONTAINER */}
        {/* ======================================================== */}
        <div
          className={`relative rounded-3xl border-3 p-4 sm:p-5 flex flex-col items-center justify-between shadow-inner transition-colors ${
            activeFinger?.hand === 'right'
              ? 'border-indigo-400 bg-indigo-50/40 ring-2 ring-indigo-200'
              : 'border-slate-200 bg-white/80'
          }`}
        >
          {/* Hand Label Badge */}
          <div className="w-full flex items-center justify-between pb-2 mb-1 border-b border-slate-100">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <span>✋ Right Hand</span>
              <span className="text-[10px] font-bold text-slate-500">
                (H + J · K · L · ;)
              </span>
            </span>
            {activeFinger?.hand === 'right' && (
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white animate-pulse">
                Active Hand
              </span>
            )}
          </div>

          {/* Fingers Row (Thumb to Pinky) */}
          <div className="w-full flex justify-around items-end gap-1 sm:gap-2 pt-2">
            {rightFingers.map((fId) => renderFinger(fId, fId === 'right-thumb'))}
          </div>

          {/* Right Palm Cushion with Home Row Visual Sequence */}
          <div className="w-full mt-3 py-2 px-3 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="text-[10px] font-black uppercase text-slate-500">
              Right Rest Position:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[10px] font-black">H+</span>
              <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                J
              </span>
              <span className="w-5 h-5 rounded-md bg-teal-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                K
              </span>
              <span className="w-5 h-5 rounded-md bg-amber-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                L
              </span>
              <span className="w-5 h-5 rounded-md bg-pink-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                ;
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Visual Legend Pill Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-teal-600" />
          <span>Fingers rest lightly on the Home Row (A S D F — J K L ;) when typing.</span>
        </div>
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <span className="text-rose-600">● Pinky</span>
          <span className="text-orange-600">● Ring</span>
          <span className="text-emerald-600">● Middle</span>
          <span className="text-sky-600">● Index</span>
          <span className="text-purple-600">● Thumb</span>
        </div>
      </div>
    </div>
  );
};
