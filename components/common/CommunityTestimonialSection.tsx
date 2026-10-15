'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Play,
  X,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Heart,
  MessageCircle,
  Users,
  Award,
} from 'lucide-react';

interface CommunityTestimonialSectionProps {
  id?: string;
  className?: string;
}

export const CommunityTestimonialSection: React.FC<CommunityTestimonialSectionProps> = ({
  id = 'community-testimonial',
  className = '',
}) => {
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  const linkedinPostUrl =
    'https://www.linkedin.com/posts/techinclusiondeaf_tidi-deafkidstechbootcamp-deafchildrenintech-activity-7505180214138740736-Xv_1';

  return (
    <section id={id} className={`py-16 max-w-6xl mx-auto px-4 sm:px-6 space-y-6 ${className}`}>
      {/* Small Eyebrow Label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-md border border-teal-200">
            Community Impact &amp; Field Evidence
          </span>
          <span className="text-xs font-bold text-slate-500">
            Abuja, Nigeria
          </span>
        </div>

        <a
          href={linkedinPostUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 hover:underline"
        >
          <span>Official LinkedIn Source</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* ========================================================================= */}
      {/* WIDE HERO BANNER CARD */}
      {/* Rich dark teal palette, verified quotes, impact stats & photo showcase */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-10 lg:p-12 border-2 border-teal-500/30 shadow-xl overflow-hidden">
        
        {/* Subtle Background Glow Orbs */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Organization, Big Statement, Quotes & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Organization Tag */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-black uppercase tracking-wider">
                Tech Inclusion for the Deaf Initiative (TIDI)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-extrabold">
                Deaf Kids Tech Bootcamp
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                &ldquo;Deaf children should not be left out of technology.&rdquo;
              </h2>
              <p className="text-sm sm:text-base text-teal-100/90 font-medium leading-relaxed">
                &ldquo;For us, this bootcamp was not just about teaching Deaf children how to use a computer. It was about giving them the space to learn in a way they understand, try things for themselves and grow in confidence. In Nigerian Sign Language, our learners share what they enjoyed, what they learned and what they want to explore next.&rdquo;
              </p>
            </div>

            {/* Impact Metric Chips */}
            <div className="grid grid-cols-3 gap-3 pt-1 border-y border-white/10 py-4">
              <div className="space-y-0.5">
                <div className="text-xl sm:text-2xl font-black text-teal-300">100%</div>
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                  Nigerian Sign Language
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xl sm:text-2xl font-black text-emerald-300">Zero</div>
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                  Synthetic Signs
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xl sm:text-2xl font-black text-amber-300">450+</div>
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                  Verified STEM Vocabulary
                </div>
              </div>
            </div>

            {/* Community Endorsements */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-slate-200 font-medium">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>&ldquo;beautiful 👏👏👏&rdquo; — <strong>Maryam Jimoh</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-slate-200 font-medium">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>&ldquo;Aww keep going! ❤️&rdquo; — <strong>Jaycel Marie Vitor, LPT</strong></span>
              </div>
            </div>

            {/* Action Buttons: Play Video & LinkedIn Link */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/25 transition interactive-target flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Watch 2-Min Learners Video</span>
              </button>

              <a
                href={linkedinPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs border border-white/20 transition interactive-target flex items-center gap-1.5"
              >
                <span>View on LinkedIn</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Right Column: High-Res Photo Showcase Card (5 cols) */}
          <div className="lg:col-span-5">
            <div
              onClick={() => setShowVideoModal(true)}
              className="relative rounded-2xl overflow-hidden border-2 border-teal-400/40 shadow-2xl group cursor-pointer aspect-video sm:aspect-[4/3] bg-slate-950"
            >
              {/* Photo Image */}
              <img
                src="/images/posters/tidi-testimonial-poster.jpg"
                alt="Deaf children participating in the Tech Kids Bootcamp in Abuja, Nigeria"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500 brightness-95 group-hover:brightness-100"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Big Center Play Button Overlay */}
              <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-teal-500/95 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-115 transition group-hover:bg-teal-400">
                <Play className="w-7 h-7 fill-slate-950 ml-0.5" />
              </div>

              {/* Bottom Caption Pill */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-teal-300 font-extrabold text-[11px] border border-white/10">
                  Click to play (No LinkedIn login required)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/20 text-white font-mono text-[10px] backdrop-blur-md">
                  2:21
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIDEO POPUP MODAL (Clean, Zero-Distraction Player) */}
      {/* ========================================================================= */}
      {showVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="testimonial-video-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        >
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-2xl w-full border-2 border-teal-600/30 shadow-2xl relative space-y-4 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-xs">
                  TIDI
                </div>
                <div>
                  <h3 id="testimonial-video-modal-title" className="text-base font-black text-slate-900">
                    Deaf Kids Tech Bootcamp (TIDI Nigeria)
                  </h3>
                  <span className="text-[11px] font-bold text-slate-500">
                    Real Deaf learners sharing in Nigerian Sign Language • 2:21
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[9/16] sm:aspect-video max-h-[420px] flex items-center justify-center shadow-inner">
              <video
                src="/videos/tidi-deaf-learners-testimonial.mp4"
                poster="/images/posters/tidi-testimonial-poster.jpg"
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              >
                <source src="/videos/tidi-deaf-learners-testimonial.mp4" type="video/mp4" />
                <source src="https://dms.licdn.com/playlist/vid/v2/D4E05AQHE-DwmElfzPw/mp4-720p-30fp-crf28/B4EaCfBigKI0B8-/0/1789374396319?e=2147483647&v=beta&t=6viYlTcnF4DEz8c5Wv4tU095e72wtKiCtR1CXyDGjkw" type="video/mp4" />
              </video>
            </div>

            {/* Modal Quote & Safeguard Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="text-slate-700 font-semibold leading-relaxed italic">
                &ldquo;For us, this bootcamp was not just about teaching Deaf children how to use a computer. It was about giving them the space to learn in a way they understand, try things for themselves and grow in confidence.&rdquo;
              </p>
              <div className="text-teal-900 font-bold flex items-center gap-1.5 pt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Plays directly on DeafLMS — Zero LinkedIn account required.</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <a
                href={linkedinPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 hover:text-teal-900 font-black inline-flex items-center gap-1 hover:underline"
              >
                <span>View original post on LinkedIn</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition"
              >
                Done Watching
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
