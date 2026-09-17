'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Maximize2, Sparkles, Youtube, Gauge } from 'lucide-react';
import { SpeedControls } from './SpeedControls';

interface SignVideoPlayerProps {
  videoUrl: string;
  title?: string;
  posterUrl?: string;
  autoPlay?: boolean;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export const SignVideoPlayer: React.FC<SignVideoPlayerProps> = ({
  videoUrl,
  title,
  posterUrl,
  autoPlay = false,
}) => {
  const youtubeId = extractYouTubeId(videoUrl);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [speed, setSpeed] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
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

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden border-4 border-indigo-600/30 shadow-2xl relative flex flex-col group">
      {/* Header bar */}
      {title && (
        <div className="bg-slate-950/80 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-wide truncate">{title}</h3>
          </div>

          {youtubeId ? (
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Youtube className="w-3 h-3 fill-rose-500 text-rose-500" />
              YouTube CDN (Lightweight)
            </span>
          ) : speed < 1.0 ? (
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Slow-Mo {speed}x
            </span>
          ) : null}
        </div>
      )}

      {/* Video Display Area */}
      <div className="relative aspect-video bg-black flex items-center justify-center">
        {youtubeId ? (
          /* YouTube Embed IFrame */
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1`}
            title={title || 'YouTube Sign Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          /* Native HTML5 Video */
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl}
              playsInline
              loop={isLooping}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
            />

            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute z-10 w-20 h-20 rounded-3xl bg-indigo-600/90 hover:bg-indigo-600 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transform hover:scale-110 transition interactive-target"
                aria-label="Play Sign Video"
              >
                <Play className="w-10 h-10 fill-current translate-x-1" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Controls Bar */}
      {youtubeId ? (
        <div className="p-3 bg-slate-950 flex items-center justify-between border-t border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-amber-400" />
            <span className="font-bold">
              Slow-Motion Tip: Use the YouTube player gear icon ⚙️ to set playback speed to <span className="text-amber-400 font-black">0.5x or 0.75x</span>.
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-slate-950 flex flex-col gap-2 border-t border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center font-bold transition interactive-target shadow-md shadow-indigo-600/30"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current translate-x-0.5" />
                )}
              </button>

              <button
                onClick={handleRewind5s}
                className="h-10 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition interactive-target"
                title="Rewind 5 seconds"
              >
                <RotateCcw className="w-4 h-4" />
                -5s
              </button>
            </div>

            <button
              onClick={handleFullscreen}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition interactive-target"
              title="Expand Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <SpeedControls
            currentSpeed={speed}
            onSpeedChange={handleSpeedChange}
            isLooping={isLooping}
            onToggleLoop={handleToggleLoop}
          />
        </div>
      )}
    </div>
  );
};
