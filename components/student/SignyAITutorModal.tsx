'use client';

import React, { useState } from 'react';
import { SignyExplanation } from '@/lib/types';
import {
  Sparkles,
  X,
  BookOpen,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Eraser,
  ShieldCheck,
} from 'lucide-react';
import { extractYouTubeId } from '@/lib/approved-vocabulary';

export const SignyAITutorModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SignyExplanation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Suggestions with both approved library words and unapproved boundary tests
  const suggestions = ['Webcam', 'Keyboard', 'Mouse', 'Monitor', 'Photosynthesis'];

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setErrorMessage('Please enter a word to clarify.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    setTerm(searchTerm);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: searchTerm }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setErrorMessage(
          'We cannot create a new explanation right now. Watch the approved lesson again or ask your facilitator for help.'
        );
      }
    } catch (e) {
      console.warn('Explain failed:', e);
      setErrorMessage(
        'We cannot create a new explanation right now. Watch the approved lesson again or ask your facilitator for help.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTerm('');
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-teal-700 hover:bg-teal-800 text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-3 font-extrabold text-sm tracking-wide border-2 border-teal-500/50 transform hover:scale-105 transition-all interactive-target"
        aria-label="Clarify This Word"
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-teal-100" />
        </div>
        <span>Clarify This Word</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clarify-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto border-2 border-teal-600/30 shadow-2xl relative space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-black shadow-md shadow-teal-200">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 id="clarify-modal-title" className="text-xl font-black text-slate-900">
                    Clarify This Word
                  </h3>
                  <p className="text-xs font-bold text-slate-600">
                    Simple explanations using reviewed learning content.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
                aria-label="Close clarify word panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="space-y-2">
              <label htmlFor="clarify-word-input" className="text-xs font-bold text-slate-700 block">
                Enter a word to clarify:
              </label>
              <div className="relative flex items-center">
                <input
                  id="clarify-word-input"
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(term)}
                  placeholder="e.g., Webcam, Keyboard, Photosynthesis..."
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl py-3 pl-4 pr-24 text-sm font-bold text-slate-900 focus:border-teal-600 focus:bg-white transition"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  {term && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="w-8 h-8 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition"
                      aria-label="Clear word"
                      title="Clear word"
                    >
                      <Eraser className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSearch(term)}
                    disabled={loading}
                    className="w-9 h-9 rounded-xl bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center transition disabled:opacity-50"
                    aria-label="Submit word"
                    title="Submit word"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500">Suggested words:</span>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSearch(s)}
                    className="text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Error / Fallback Alert */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-start gap-3 text-xs font-semibold">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* Explanation Results Display */}
            {result && (
              <div className="space-y-4 animate-star-pop">
                {/* Status Indicator */}
                {result.isApprovedWord ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-black text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Approved Sign Content ({result.signLanguage || 'NSL'})
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      {result.reviewedBy || 'Acclusivo Deaf Review Team'}
                    </span>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-black text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Word Outside Approved Sign Library
                    </div>
                    <p className="text-amber-800 font-medium leading-relaxed">
                      {result.boundaryNotice ||
                        'This word is not yet in our reviewed sign library. I can give you a simple written meaning, but I cannot create or approve its Nigerian Sign Language sign. Ask your facilitator for the reviewed local sign.'}
                    </p>
                  </div>
                )}

                {/* Word & Simplified Meaning */}
                <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl space-y-1.5">
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Concept Word:
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">{result.term}</h4>
                  <div className="text-xs font-black uppercase tracking-wider text-teal-800 pt-1">
                    Simple Meaning:
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    {result.simplifiedDefinition}
                  </p>
                  {result.exampleSentence && (
                    <div className="pt-2 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="font-extrabold text-slate-800">Example: </span>
                      <span>&ldquo;{result.exampleSentence}&rdquo;</span>
                    </div>
                  )}
                </div>

                {/* Approved Sign Demonstration (Only for approved words) */}
                {result.isApprovedWord && result.signVideoUrl && (() => {
                  const ytId = extractYouTubeId(result.signVideoUrl);
                  return (
                    <div className="bg-slate-900 rounded-2xl p-3 border-2 border-teal-600 text-white space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold px-1">
                        <span className="text-teal-300">Reviewed Sign Video ({result.term})</span>
                        {!ytId && (
                          <button
                            type="button"
                            onClick={() => {
                              const v = document.getElementById('clarify-sign-video') as HTMLVideoElement;
                              if (v) {
                                v.currentTime = 0;
                                v.play();
                              }
                            }}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 transition"
                            aria-label="Replay sign"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Replay
                          </button>
                        )}
                      </div>
                      <div className="aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
                        {ytId ? (
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&playsinline=1`}
                            title={`Sign Video: ${result.term}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        ) : (
                          <video
                            id="clarify-sign-video"
                            src={result.signVideoUrl}
                            controls
                            playsInline
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Fingerspelling Letters */}
                {result.fingerspell && (
                  <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                      Fingerspelling Letters:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.fingerspell.split(' ').map((letter, idx) => (
                        <span
                          key={idx}
                          className="w-9 h-10 rounded-xl bg-white border-2 border-teal-600/40 font-black text-slate-900 flex items-center justify-center text-sm shadow-sm"
                        >
                          {letter}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Human Facilitator Assurance */}
                <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-xl text-slate-600 text-[11px] font-medium">
                  <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>
                    DeafLMS AI never invents signs. All approved signs are verified by Deaf educators.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
