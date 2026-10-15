'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  ExternalLink,
  CheckCircle2,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';

interface CommunityTestimonialSectionProps {
  id?: string;
  className?: string;
  isModal?: boolean;
  onClose?: () => void;
}

export const CommunityTestimonialSection: React.FC<CommunityTestimonialSectionProps> = ({
  id = 'community-testimonial',
  className = '',
  isModal = false,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(141); // 2m 21s
  const [viewMode, setViewMode] = useState<'direct' | 'embed'>('direct');
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const linkedinPostUrl =
    'https://www.linkedin.com/posts/techinclusiondeaf_tidi-deafkidstechbootcamp-deafchildrenintech-activity-7505180214138740736-Xv_1';

  const embedUrl =
    'https://www.linkedin.com/embed/feed/update/urn:li:activity:7505180214138740736?compact=true';

  return (
    <section id={id} className={`py-16 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-md border border-teal-200">
                Verified Field Evidence &amp; Testimonial
              </span>
              <span className="text-xs font-bold text-slate-500">
                Abuja, Nigeria
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Deaf Learners in Action: Tech Kids Bootcamp
            </h2>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Watch real Deaf children share what they enjoyed, what they learned, and what they want to explore next in <strong>Nigerian Sign Language (NSL)</strong>.
            </p>
          </div>

          {/* Quick Pitch Mode Safeguard Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 self-start md:self-auto">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-black text-emerald-900 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Instant Video • Zero LinkedIn Login Required</span>
            </div>

            {/* Toggle Player Mode (Direct vs Official Embed) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('direct')}
                className={`px-3 py-1.5 rounded-lg font-black transition ${
                  viewMode === 'direct'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fast Player
              </button>
              <button
                type="button"
                onClick={() => setViewMode('embed')}
                className={`px-3 py-1.5 rounded-lg font-black transition ${
                  viewMode === 'embed'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                LinkedIn Embed
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Video on Left, Testimonial Context on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Video Player Container (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-slate-200 p-3 sm:p-5 shadow-sm space-y-3">
            {viewMode === 'direct' ? (
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[9/16] sm:aspect-video max-h-[460px] flex items-center justify-center group shadow-inner">
                
                {/* HTML5 Video Element with primary local asset and cloud fallback */}
                <video
                  ref={videoRef}
                  poster="/images/posters/tidi-testimonial-poster.jpg"
                  playsInline
                  preload="metadata"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  onClick={togglePlay}
                  className="w-full h-full object-contain cursor-pointer"
                  aria-label="Deaf Kids Tech Bootcamp testimonial video in Nigerian Sign Language"
                >
                  <source src="/videos/tidi-deaf-learners-testimonial.mp4" type="video/mp4" />
                  <source src="https://dms.licdn.com/playlist/vid/v2/D4E05AQHE-DwmElfzPw/mp4-720p-30fp-crf28/B4EaCfBigKI0B8-/0/1789374396319?e=2147483647&v=beta&t=6viYlTcnF4DEz8c5Wv4tU095e72wtKiCtR1CXyDGjkw" type="video/mp4" />
                </video>

                {/* Big Center Play Overlay (when paused) */}
                {!isPlaying && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-teal-700/95 hover:bg-teal-600 text-white flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95 group-hover:ring-4 group-hover:ring-teal-400/50"
                    aria-label="Play testimonial video"
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white translate-x-1" />
                  </button>
                )}

                {/* Top Overlay Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Nigerian Sign Language (NSL)</span>
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-slate-200 text-[10px] font-bold">
                    2:21
                  </span>
                </div>

                {/* Bottom Custom Playback Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-3 pt-6 flex flex-col gap-2">
                  {/* Progress Slider */}
                  <input
                    type="range"
                    min={0}
                    max={duration || 141}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    aria-label="Seek video progress"
                  />

                  {/* Controls Row */}
                  <div className="flex items-center justify-between text-white text-xs font-bold">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="hover:text-teal-300 transition"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                      </button>

                      <button
                        type="button"
                        onClick={toggleMute}
                        className="hover:text-teal-300 transition"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>

                      <span className="text-[11px] font-mono text-slate-300">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-black text-teal-300 hidden sm:inline">
                        100% Native Deaf Communication
                      </span>
                      <button
                        type="button"
                        onClick={handleFullscreen}
                        className="hover:text-teal-300 transition p-1"
                        aria-label="Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* LinkedIn Embed View */
              <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-[9/16] sm:aspect-video max-h-[500px]">
                <iframe
                  src={embedUrl}
                  title="LinkedIn Embedded Post Testimonial"
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              </div>
            )}

            {/* Video Caption & Source Attribution */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 text-xs">
              <div className="text-slate-500 font-medium">
                Source: <span className="font-bold text-slate-800">Tech Inclusion for the Deaf Initiative (TIDI)</span>
              </div>
              <a
                href={linkedinPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 hover:text-teal-900 font-black inline-flex items-center gap-1 hover:underline"
              >
                <span>View original post on LinkedIn</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Story Context, Verified Quotes & Impact (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* The Organization & Purpose Card */}
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-md shadow-teal-100">
                  TIDI
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base leading-snug">
                    Tech Inclusion for the Deaf Initiative
                  </h3>
                  <span className="text-xs font-bold text-slate-500 block">
                    Deaf Kids Tech Bootcamp • Nigeria
                  </span>
                </div>
              </div>

              {/* The Core Testimonial Quote */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed italic">
                  &ldquo;For us, this bootcamp was not just about teaching Deaf children how to use a computer. It was about giving them the space to learn in a way they understand, try things for themselves and grow in confidence.&rdquo;
                </p>
                <p className="text-xs sm:text-sm text-teal-950 font-bold leading-relaxed">
                  &ldquo;Deaf children should not be left out of technology. Give them access, communication and the right support, and they will show you what they can do.&rdquo;
                </p>
              </div>

              {/* Key Validation Points */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-start gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Synthetic Hallucinations:</strong> Certified Nigerian Sign Language, recorded by Deaf educators with clear visual grammar.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Learner Autonomy:</strong> Children actively demonstrate computer parts and digital functions through signing.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Child Safeguarding:</strong> Zero personal data leakage, no unauthorized recording.</span>
                </div>
              </div>
            </div>

            {/* Community Social Proof & Engagement */}
            <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
                <span>Community Reactions</span>
                <span className="text-teal-700 font-extrabold lowercase">#DeafKidsTechBootcamp</span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900">Maryam Jimoh</span>
                    <span className="text-[10px] text-slate-400 font-bold">Community Member</span>
                  </div>
                  <p className="text-slate-600 font-medium">
                    &ldquo;beautiful 👏👏👏&rdquo;
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900">Jaycel Marie Vitor, LPT</span>
                    <span className="text-[10px] text-slate-400 font-bold">Educator</span>
                  </div>
                  <p className="text-slate-600 font-medium">
                    &ldquo;Aww keep going! ❤️&rdquo;
                  </p>
                </div>
              </div>

              {/* Pitch Day CTA */}
              <div className="pt-2">
                <Link
                  href="/demo?pitch=true"
                  className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs text-center transition block shadow-sm"
                >
                  Experience the 60-Second Visual Learning Demo →
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
