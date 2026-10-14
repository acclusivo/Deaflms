'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Maximize2 } from 'lucide-react';
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
  posterUrl = '/images/posters/signed-meaning-webcam.jpg',
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
    <div className="bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-md relative flex flex-col group">
      {/* Header Bar */}
      {title && (
        <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <h3 className="font-bold text-white tracking-wide truncate">{title}</h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-300">
            Sign Language Video
          </span>
        </div>
      )}

      {/* Video Display Area */}
      <div className="relative aspect-video bg-black flex items-center justify-center">
        {youtubeId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1`}
            title={title || 'Sign Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
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
                className="absolute z-10 w-16 h-16 rounded-2xl bg-teal-700/90 hover:bg-teal-700 text-white flex items-center justify-center shadow-lg transition interactive-target"
                aria-label="Play Sign Video"
              >
                <Play className="w-8 h-8 fill-white translate-x-0.5" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Controls Bar for native video */}
      {!youtubeId && (
        <div className="p-3 bg-slate-950 flex flex-col gap-2 border-t border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-xl bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center font-bold transition interactive-target"
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
                <span>Replay</span>
              </button>
            </div>

            <button
              onClick={handleFullscreen}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition interactive-target"
              title="Full Screen"
              aria-label="Full Screen"
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
