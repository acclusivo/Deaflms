'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Hand,
  BookOpen,
  Camera,
  CheckSquare,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  FastForward,
} from 'lucide-react';
import { AccessibleVideoSource } from '@/lib/types';
import { extractYouTubeId } from '@/lib/approved-vocabulary';

interface AccessibleSignVideoPlayerProps {
  source: AccessibleVideoSource;
  autoPlay?: boolean;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  showSkip?: boolean;
  onSkip?: () => void;
  className?: string;
  showTitle?: boolean;
  onStartDemoClick?: () => void;
  allowSimulatedPlayback?: boolean;
}

const VISUAL_STEPS = [
  { num: 1, label: 'SEE', icon: Camera, desc: 'Real picture first' },
  { num: 2, label: 'WATCH SIGN', icon: Hand, desc: 'Vocabulary sign video' },
  { num: 3, label: 'UNDERSTAND', icon: BookOpen, desc: 'Facilitator signed meaning' },
  { num: 4, label: 'SHOW ME', icon: Eye, desc: '3-frame visual story' },
  { num: 5, label: 'PRACTISE', icon: CheckSquare, desc: 'Choice with supportive retry' },
  { num: 6, label: 'ASK HELP', icon: HelpCircle, desc: 'Supervised human support' },
  { num: 7, label: 'START', icon: ArrowRight, desc: 'Try the 60-Second Demo' },
];

export const AccessibleSignVideoPlayer: React.FC<AccessibleSignVideoPlayerProps> = ({
  source,
  autoPlay = false,
  onEnded,
  onTimeUpdate,
  showSkip = false,
  onSkip,
  className = '',
  showTitle = true,
  onStartDemoClick,
  allowSimulatedPlayback = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(source.durationSeconds || 60);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [simulatedProgress, setSimulatedProgress] = useState<number>(0);

  const youtubeId = source.provider === 'youtube' || source.src?.includes('youtube')
    ? extractYouTubeId(source.src || source.fallbackSrc)
    : null;

  // Handle HTML5 video events
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || source.durationSeconds || 60;
      setCurrentTime(cur);
      setDuration(dur);
      if (onTimeUpdate) onTimeUpdate(cur, dur);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onEnded) onEnded();
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (videoError) {
      // In error / offline fallback, allow simulated playback of the signed message
      setIsPlaying(!isPlaying);
      return;
    }

    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // If browser blocks or media is missing, gracefully switch to simulated playback
            setIsPlaying(true);
          });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Simulated timer progression when playing without raw media file
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && (videoError || !videoRef.current || videoRef.current.paused)) {
      interval = setInterval(() => {
        setSimulatedProgress((prev) => {
          const next = prev + speed;
          if (next >= duration) {
            setIsPlaying(false);
            if (onEnded) onEnded();
            return duration;
          }
          if (onTimeUpdate) onTimeUpdate(next, duration);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, videoError, speed, duration, onEnded, onTimeUpdate]);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const handleReplay = () => {
    setSimulatedProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => { });
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
    }
  };

  const handleFullscreenToggle = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => { });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => { });
    }
  };

  const effectiveCurrentTime = videoRef.current && !videoError ? currentTime : simulatedProgress;
  const progressPercent = Math.min(100, (effectiveCurrentTime / (duration || 60)) * 100);

  return (
    <div
      ref={containerRef}
      className={`bg-slate-950 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl relative flex flex-col ${className}`}
    >
      {/* Top Meta Bar (Labels Kept Outside Signing Space) */}
      {showTitle && (
        <div className="bg-slate-900/95 px-4 py-3 flex items-center justify-between border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-extrabold text-white truncate">{source.title}</span>
          </div>

          {/* <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-0.5 rounded-md bg-teal-950 text-teal-300 border border-teal-800 font-extrabold text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>{source.signLanguage}</span>
            </span>

            {showSkip && onSkip && (
              <button
                onClick={onSkip}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition interactive-target flex items-center gap-1"
                aria-label="Skip Signed Guide and Go to Demo"
              >
                <span>Skip Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div> */}
        </div>
      )}

      {/* Video / Visual Signing Space Area */}
      <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
        {/* Case 1: Video error or network unavailable fallback — Never trap the learner */}
        {videoError ? (
          <div className="w-full h-full p-4 sm:p-6 flex flex-col justify-between bg-gradient-to-b from-slate-900 to-slate-950 text-white animate-fade-in relative">
            <img
              src={source.posterUrl}
              alt={source.title}
              className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-xs"
            />
            {/* <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Offline Visual Guide Mode Active</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Learn with Pictures &amp; Step-by-Step Practice
              </h3>
              <p className="text-xs text-slate-300 font-medium max-w-xl">
                Video streaming is paused. Follow the seven visual steps below to begin your lesson independently:
              </p>
            </div> */}

            {/* 7 Visual Steps Grid */}
            {/* <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 pt-2">
              {VISUAL_STEPS.map((step) => {
                const IconC = step.icon;
                return (
                  <div
                    key={step.num}
                    className="p-2 rounded-xl bg-slate-800/90 border border-slate-700 flex flex-col items-center text-center gap-1"
                  >
                    <IconC className="w-4 h-4 text-teal-400" />
                    <span className="text-[10px] font-black uppercase text-white truncate w-full">
                      {step.label}
                    </span>
                    <span className="text-[9px] text-slate-400 hidden sm:block truncate w-full">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div> */}

            {/* <div className="relative z-10 pt-3 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 font-medium">
                Reviewed by {source.reviewedBy}
              </span>
              {onStartDemoClick && (
                <button
                  onClick={onStartDemoClick}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs transition flex items-center gap-2 interactive-target shadow-lg shadow-teal-900"
                >
                  <span>Start Demo Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div> */}
          </div>
        ) : youtubeId ? (
          /* Case 2: YouTube Embed without brand covering (playsinline) */
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`}
            title={source.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0 object-contain"
          />
        ) : (
          /* Case 3: HTML5 Controlled Player (Supabase / Local MP4) with Poster */
          <>
            <video
              ref={videoRef}
              src={source.src}
              poster={source.posterUrl}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onError={() => {
                // If local file is missing, do not crash: fall back to visual poster + steps
                setVideoError(true);
              }}
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
            />

            {/* Poster + Large Play Button Overlay when paused */}
            {!isPlaying && (
              <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 cursor-pointer transition"
                onClick={togglePlay}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="w-20 h-20 rounded-3xl bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shadow-2xl transition transform hover:scale-105 interactive-target ring-4 ring-white/30"
                  aria-label="Play Signed Video"
                >
                  <Play className="w-10 h-10 fill-current translate-x-1" />
                </button>
                <span className="mt-3 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-white font-extrabold text-xs border border-slate-700 shadow-md">
                  Watch Signed Guide ({Math.round(duration)}s)
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 overflow-hidden">
        <div
          className="bg-teal-400 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Accessible Control Bar: Text with Icons Always */}
      <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Play/Pause, Replay */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="h-10 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold flex items-center gap-2 transition interactive-target shadow-md shadow-teal-950"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={handleReplay}
            className="h-10 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition interactive-target"
            aria-label="Replay signed video from start"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay</span>
          </button>

          <span className="hidden sm:inline-block text-slate-400 font-bold text-xs px-2">
            {Math.floor(effectiveCurrentTime)}s / {Math.round(duration)}s
          </span>
        </div>

        {/* Right: Speed Controls & Fullscreen */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl" role="group" aria-label="Playback Speed Controls">
            {[0.5, 0.75, 1.0].map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition interactive-target ${speed === s
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
                  }`}
                aria-label={`Playback speed ${s}x`}
              >
                {s}×
              </button>
            ))}
          </div>

          <button
            onClick={handleFullscreenToggle}
            className="h-10 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition interactive-target"
            aria-label={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden md:inline">Full Screen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
