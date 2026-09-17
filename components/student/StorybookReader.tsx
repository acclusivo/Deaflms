'use client';

import React, { useState } from 'react';
import { StoryPage } from '@/lib/types';
import { SignVideoPlayer } from './SignVideoPlayer';
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, HandMetal, CheckCircle } from 'lucide-react';

interface StorybookReaderProps {
  title: string;
  pages: StoryPage[];
  signVideoUrl: string;
  onComplete?: () => void;
}

export const StorybookReader: React.FC<StorybookReaderProps> = ({
  title,
  pages,
  signVideoUrl,
  onComplete,
}) => {
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [activeWordPopup, setActiveWordPopup] = useState<{ word: string; signUrl: string } | null>(null);

  const currentPage = pages[currentPageIdx];

  const handleNextPage = () => {
    if (currentPageIdx + 1 < pages.length) {
      setCurrentPageIdx((p) => p + 1);
      setActiveWordPopup(null);
    } else {
      if (onComplete) onComplete();
    }
  };

  const handlePrevPage = () => {
    if (currentPageIdx > 0) {
      setCurrentPageIdx((p) => p - 1);
      setActiveWordPopup(null);
    }
  };

  // Render text with clickable highlight words
  const renderInteractiveText = (text: string, highlightWords?: { word: string; signUrl: string }[]) => {
    if (!highlightWords || highlightWords.length === 0) {
      return <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium">{text}</p>;
    }

    const words = text.split(' ');
    return (
      <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium">
        {words.map((word, idx) => {
          const cleanWord = word.replace(/[^a-zA-Z]/g, '');
          const match = highlightWords.find((hw) => hw.word.toLowerCase() === cleanWord.toLowerCase());

          if (match) {
            return (
              <span key={idx}>
                <button
                  onClick={() => setActiveWordPopup(match)}
                  className="inline-flex items-center gap-1 font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-200 transition underline decoration-indigo-400 interactive-target mx-0.5"
                  title="Tap to see sign"
                >
                  <HandMetal className="w-3.5 h-3.5" />
                  {word}
                </button>{' '}
              </span>
            );
          }

          return <span key={idx}>{word} </span>;
        })}
      </p>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Book Title & Page Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-3xl border-2 border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-lg">{title}</h2>
            <span className="text-xs text-slate-500 font-bold">Tap colored words to reveal sign demonstrations</span>
          </div>
        </div>

        <div className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-200">
          Page {currentPageIdx + 1} of {pages.length}
        </div>
      </div>

      {/* Dual Pane Reader Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Pane: Illustrated Book Page */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm flex flex-col space-y-6 min-h-[440px]">
          {/* Storybook Illustration */}
          <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-100 shadow-inner relative">
            <img
              src={currentPage.illustrationUrl}
              alt={`Illustration for page ${currentPage.pageNumber}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-slate-950/70 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md backdrop-blur-sm">
              Page {currentPage.pageNumber}
            </div>
          </div>

          {/* Interactive Text */}
          <div className="flex-1">
            {renderInteractiveText(currentPage.textContent, currentPage.highlightWords)}
          </div>

          {/* Word Popup Card if active */}
          {activeWordPopup && (
            <div className="bg-indigo-50 border-2 border-indigo-400 p-4 rounded-2xl animate-star-pop flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                  <HandMetal className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-indigo-600 uppercase">Sign for:</div>
                  <div className="text-base font-black text-slate-900">{activeWordPopup.word}</div>
                </div>
              </div>
              <button
                onClick={() => setActiveWordPopup(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Right Pane: Sign Language Synchronized Video */}
        <div className="space-y-4">
          <SignVideoPlayer
            videoUrl={signVideoUrl}
            title={`Teacher Signing: Page ${currentPage.pageNumber}`}
            posterUrl={currentPage.illustrationUrl}
          />

          <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 text-center text-xs font-bold text-slate-500 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Watch the teacher sign the story on the right as you read along!
          </div>
        </div>

      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-sm">
        <button
          onClick={handlePrevPage}
          disabled={currentPageIdx === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition interactive-target ${
            currentPageIdx === 0
              ? 'opacity-40 text-slate-400 cursor-not-allowed'
              : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Page
        </button>

        <button
          onClick={handleNextPage}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl font-extrabold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition interactive-target"
        >
          {currentPageIdx + 1 < pages.length ? 'Next Page' : 'Finish Storybook'}
          {currentPageIdx + 1 < pages.length ? <ChevronRight className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
