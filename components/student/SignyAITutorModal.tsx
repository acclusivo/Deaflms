'use client';

import React, { useState } from 'react';
import { SignyExplanation } from '@/lib/types';
import { Sparkles, X, HandMetal, Eye, Lightbulb, Search, Loader2 } from 'lucide-react';

export const SignyAITutorModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SignyExplanation | null>(null);

  const quickSuggestions = ['Webcam', 'Keyboard', 'Monitor', 'Internet', 'Fox'];

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
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
      }
    } catch (e) {
      console.warn('Explain failed:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Mascot Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-3 font-black text-sm tracking-wide border-2 border-indigo-400/50 transform hover:scale-105 transition-all interactive-target"
        aria-label="Ask Signy Visual AI Tutor"
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-amber-300" />
        </div>
        <span>Ask Signy (AI Tutor)</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto border-4 border-indigo-200 shadow-2xl relative space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-200">
                  <HandMetal className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Signy Visual AI Tutor</h3>
                  <p className="text-xs font-bold text-slate-500">Visual analogies & sign guides for any word</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(term)}
                  placeholder="Type any word (e.g. Webcam, Bear, Mouse)..."
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-4 pr-12 text-sm font-bold text-slate-900 focus:border-indigo-600 focus:bg-white transition"
                />
                <button
                  onClick={() => handleSearch(term)}
                  disabled={loading}
                  className="absolute right-2 top-2 w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400">Suggestions:</span>
                {quickSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSearch(s)}
                    className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Explanation Results Display */}
            {result && (
              <div className="space-y-4 animate-star-pop">
                {/* Word & Simplified Definition */}
                <div className="bg-indigo-50/70 border-2 border-indigo-200 p-4 rounded-2xl space-y-1">
                  <div className="text-xs font-black uppercase tracking-wider text-indigo-700">Concept:</div>
                  <h4 className="text-xl font-black text-slate-900">{result.term}</h4>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {result.simplifiedDefinition}
                  </p>
                </div>

                {/* Visual Analogy */}
                <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-amber-800">Visual Analogy:</div>
                    <p className="text-xs font-bold text-amber-900 mt-0.5 leading-relaxed">{result.visualAnalogy}</p>
                  </div>
                </div>

                {/* Fingerspelling Sequence */}
                <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                    Fingerspelling Practice:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.fingerspell.split(' ').map((letter, idx) => (
                      <span
                        key={idx}
                        className="w-9 h-11 rounded-xl bg-white border-2 border-indigo-300 font-black text-indigo-900 flex items-center justify-center text-base shadow-sm"
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sign Physical Guide */}
                {result.signGuide && (
                  <div className="bg-white border-2 border-slate-200 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700">
                      <Eye className="w-4 h-4 text-indigo-600" />
                      Physical Sign Description:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="font-extrabold text-slate-900 block">Handshape:</span>
                        <span className="text-slate-600">{result.signGuide.handshape}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="font-extrabold text-slate-900 block">Location:</span>
                        <span className="text-slate-600">{result.signGuide.location}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="font-extrabold text-slate-900 block">Movement:</span>
                        <span className="text-slate-600">{result.signGuide.movement}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="font-extrabold text-slate-900 block">Expression:</span>
                        <span className="text-slate-600">{result.signGuide.facialExpression}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};
