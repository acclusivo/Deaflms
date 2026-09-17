'use client';

import React, { useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Repeat,
  Sparkles,
  Maximize2,
  HandMetal,
  VolumeX,
  CheckCircle2,
  Eye,
  Smile,
  Move,
  Gauge,
  Youtube,
} from 'lucide-react';
import { extractYouTubeId } from '../student/SignVideoPlayer';

export interface SignExplainerCardProps {
  id?: string;
  title: string;
  signTitle?: string;
  badgeText?: string;
  videoUrl?: string;
  posterUrl?: string;
  conceptWord?: string;
  fingerspell?: string;
  signGuide?: {
    handshape?: string;
    movement?: string;
    facialExpression?: string;
  };
  description: string;
  tags?: string[];
  accentColor?: 'indigo' | 'emerald' | 'amber' | 'purple';
  compact?: boolean;
  onPracticeComplete?: () => void;
  className?: string;
  showPracticeButton?: boolean;
}

export const SignExplainerCard: React.FC<SignExplainerCardProps> = ({
  id,
  title,
  signTitle,
  badgeText = '🇳🇬 Nigerian Sign Language (NSL) & ASL',
  videoUrl,
  posterUrl,
  conceptWord,
  fingerspell,
  signGuide,
  description,
  tags = ['Visual First', 'Slow-Mo Friendly', 'Zero Audio'],
  accentColor = 'indigo',
  compact = false,
  onPracticeComplete,
  className = '',
  showPracticeButton = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [practiced, setPracticed] = useState<boolean>(false);
  const [activeFingerspellChar, setActiveFingerspellChar] = useState<string | null>(null);

  const youtubeId = videoUrl ? extractYouTubeId(videoUrl) : null;

  const colorStyles = {
    indigo: {
      border: 'border-indigo-500/30 hover:border-indigo-500',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      glow: 'shadow-indigo-500/10',
      activeTab: 'bg-indigo-600 text-white',
    },
    emerald: {
      border: 'border-emerald-500/30 hover:border-emerald-500',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      glow: 'shadow-emerald-500/10',
      activeTab: 'bg-emerald-600 text-white',
    },
    amber: {
      border: 'border-amber-500/30 hover:border-amber-500',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white',
      glow: 'shadow-amber-500/10',
      activeTab: 'bg-amber-600 text-white',
    },
    purple: {
      border: 'border-purple-500/30 hover:border-purple-500',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      buttonBg: 'bg-purple-600 hover:bg-purple-700 text-white',
      glow: 'shadow-purple-500/10',
      activeTab: 'bg-purple-600 text-white',
    },
  }[accentColor];

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const handleToggleLoop = () => {
    const nextLoop = !isLooping;
    setIsLooping(nextLoop);
    if (videoRef.current) {
      videoRef.current.loop = nextLoop;
    }
  };

  const handleRewind5s = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handlePracticeClick = () => {
    setPracticed(true);
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#059669', '#4f46e5', '#f59e0b', '#10b981'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
    if (onPracticeComplete) {
      onPracticeComplete();
    }
  };

  const letters = fingerspell ? fingerspell.split(' ').filter(Boolean) : [];

  return (
    <div
      id={id}
      className={`bg-white rounded-3xl border-2 ${colorStyles.border} shadow-lg ${colorStyles.glow} overflow-hidden transition-all duration-300 flex flex-col ${className}`}
    >
      {/* Top Header Badge */}
      <div className="bg-slate-900 px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-black tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
            <HandMetal className="w-3.5 h-3.5" />
            {badgeText}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md">
            <VolumeX className="w-3 h-3 text-rose-400" />
            Zero Audio Needed
          </span>
          {speed < 1.0 && (
            <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/40">
              Slow-Mo {speed}x
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Video Player + Visual Signing Guides */}
      <div className={`grid grid-cols-1 ${compact ? '' : 'lg:grid-cols-12'} gap-0 flex-1`}>
        {/* Left / Top: Video Player Frame */}
        <div className={`${compact ? 'w-full' : 'lg:col-span-7'} bg-black relative flex flex-col justify-between`}>
          <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
            {youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  poster={posterUrl}
                  playsInline
                  loop={isLooping}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={togglePlay}
                />
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-indigo-600/90 hover:bg-indigo-600 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transform hover:scale-110 transition interactive-target"
                    aria-label={`Play sign video for ${title}`}
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-1" />
                  </button>
                )}
              </>
            ) : (
              /* High-Quality Visual Signing Fallback Animation Card */
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative z-10 space-y-3 max-w-sm">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-600/20 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner animate-pulse">
                    <HandMetal className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-800">
                      Sign Demonstration Preview
                    </span>
                    <h4 className="text-white font-black text-lg mt-2">{signTitle || title}</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      Tap practice below or follow the visual sign steps to master this sign!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* In-Video Watermark Tag */}
            <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-slate-200 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                <Eye className="w-3 h-3 text-emerald-400" />
                Signer Demonstration
              </span>
            </div>
          </div>

          {/* Child-Friendly Speed & Video Controls */}
          {videoUrl && !youtubeId && (
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center font-bold transition shadow-sm interactive-target"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current translate-x-0.5" />
                  )}
                </button>

                <button
                  onClick={handleRewind5s}
                  className="h-9 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition interactive-target"
                  title="Rewind 5 seconds"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[11px]">-5s</span>
                </button>

                <button
                  onClick={handleToggleLoop}
                  className={`h-9 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition interactive-target ${
                    isLooping
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Looping sign demonstration continuously"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Loop</span>
                </button>
              </div>

              {/* Speed Toggles for Delicate Fingerspelling */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5" />
                {[0.5, 0.75, 1.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-black transition interactive-target ${
                      speed === s
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <button
                onClick={handleFullscreen}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition interactive-target"
                title="Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* YouTube Slow-Mo helper */}
          {youtubeId && (
            <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span className="flex items-center gap-1 text-rose-400">
                <Youtube className="w-3.5 h-3.5 fill-current" /> YouTube Video Stream
              </span>
              <span className="text-amber-400">Tap ⚙️ in video for 0.5x Slow-Mo</span>
            </div>
          )}
        </div>

        {/* Right / Bottom: Pedagogical Sign Guide & Vocabulary Details */}
        <div className={`${compact ? 'w-full' : 'lg:col-span-5'} p-5 sm:p-6 flex flex-col justify-between space-y-4 bg-white`}>
          <div className="space-y-4">
            {/* Title & Concept Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border ${colorStyles.badgeBg}`}>
                  {signTitle || 'Sign Guide'}
                </span>
                {conceptWord && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    Word: {conceptWord}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
              <p className="text-slate-600 text-xs font-medium leading-relaxed mt-1">
                {description}
              </p>
            </div>

            {/* Visual Sign Anatomy (Handshape, Movement, Expression) */}
            {signGuide && (
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  How to Produce This Sign
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs">
                  {signGuide.handshape && (
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                        <HandMetal className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-800">Handshape: </span>
                        <span className="text-slate-600 font-medium">{signGuide.handshape}</span>
                      </div>
                    </div>
                  )}

                  {signGuide.movement && (
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Move className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-800">Movement: </span>
                        <span className="text-slate-600 font-medium">{signGuide.movement}</span>
                      </div>
                    </div>
                  )}

                  {signGuide.facialExpression && (
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Smile className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-800">Facial Cue (NMM): </span>
                        <span className="text-slate-600 font-medium">{signGuide.facialExpression}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Interactive Fingerspell Letter Tiles */}
            {letters.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Fingerspell Sequence:
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">Tap tile to inspect</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {letters.map((char, idx) => {
                    const isSelected = activeFingerspellChar === `${char}-${idx}`;
                    return (
                      <button
                        key={`${char}-${idx}`}
                        onClick={() =>
                          setActiveFingerspellChar(isSelected ? null : `${char}-${idx}`)
                        }
                        className={`w-8 h-9 rounded-xl font-black text-sm transition-all transform interactive-target flex items-center justify-center shadow-sm border ${
                          isSelected
                            ? 'bg-indigo-600 text-white scale-110 border-indigo-700 -translate-y-1 shadow-md'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                        }`}
                        title={`Letter ${char}`}
                      >
                        {char}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Feature Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-extrabold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Affirmation / Practice Button */}
          {showPracticeButton && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handlePracticeClick}
                className={`w-full py-3 px-4 rounded-2xl font-black text-sm transition flex items-center justify-center gap-2 shadow-md interactive-target ${
                  practiced
                    ? 'bg-emerald-500 text-white shadow-emerald-200'
                    : `${colorStyles.buttonBg} shadow-slate-200`
                }`}
              >
                {practiced ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Great Job! You Practiced This Sign! ⭐
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    I Signed This! (Practice Check)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
