'use client';

import React, { useState } from 'react';
import {
  X,
  Eye,
  Camera,
  Hand,
  BookOpen,
  Laptop,
  CheckSquare,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { VocabularyContent } from '@/lib/types';
import { AccessibleSignVideoPlayer } from '@/components/common/AccessibleSignVideoPlayer';

interface LearnerPreviewModalProps {
  content: Partial<VocabularyContent>;
  isOpen: boolean;
  onClose: () => void;
}

export const LearnerPreviewModal: React.FC<LearnerPreviewModalProps> = ({
  content,
  isOpen,
  onClose,
}) => {
  const [previewStep, setPreviewStep] = useState<number>(1);
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null);

  if (!isOpen) return null;

  const word = content.word || 'Vocabulary Word';
  const pictureUrl = content.pictureUrl || '/images/hardware/webcam.jpg';
  const vocabSignUrl = content.vocabularySignVideoUrl || 'https://www.youtube.com/watch?v=GZvX_Q9si5M';
  const signedMeaningUrl = content.signedMeaningVideoUrl || 'https://www.youtube.com/watch?v=By5O5IGPNBU';
  const frames = content.visualExplanation || [
    {
      id: 'f-1',
      order: 1,
      imageUrl: '/images/story/webcam-frame-1.jpg',
      caption: 'I sit near the webcam.',
      altText: 'Learner near device',
    },
    {
      id: 'f-2',
      order: 2,
      imageUrl: '/images/story/webcam-frame-2.jpg',
      caption: 'The webcam shows me online.',
      altText: 'Camera displaying video',
    },
    {
      id: 'f-3',
      order: 3,
      imageUrl: '/images/story/webcam-frame-3.jpg',
      caption: 'My facilitator can see me.',
      altText: 'Facilitator sees child',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border-2 border-slate-300 shadow-2xl overflow-hidden my-8 animate-fade-in flex flex-col max-h-[90vh]">
        {/* Mandatory Preview Mode Top Banner */}
        <div className="bg-amber-500 text-slate-950 px-5 py-2.5 flex items-center justify-between text-xs font-black shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-slate-950" />
            <span>Preview Mode — This content is not yet visible to learners.</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-amber-600 transition interactive-target"
            aria-label="Close Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Header with Step Tracker */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 block">
              Learner Flow Simulation:
            </span>
            <h3 className="text-lg font-black text-slate-900">
              Previewing: {word} ({content.localVariant || 'NSL'})
            </h3>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setPreviewStep(s)}
                className={`w-7 h-7 rounded-lg text-xs font-black transition ${
                  previewStep === s
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Step 1: See */}
          {previewStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <span className="text-xs font-black uppercase text-teal-800 block">Step 1: See</span>
              <h4 className="text-xl font-black text-slate-900">Look at the picture.</h4>
              <div className="aspect-16/10 rounded-2xl bg-slate-950 flex items-center justify-center p-4">
                <img src={pictureUrl} alt={word} className="w-64 h-64 object-contain" />
              </div>
            </div>
          )}

          {/* Step 2: Vocabulary Sign Video */}
          {previewStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <span className="text-xs font-black uppercase text-teal-800 block">Step 2: Vocabulary Sign Video</span>
              <h4 className="text-xl font-black text-slate-900">Watch the sign for {word}.</h4>
              <AccessibleSignVideoPlayer
                source={{
                  provider: 'local',
                  src: vocabSignUrl,
                  fallbackSrc: vocabSignUrl,
                  posterUrl: '/images/posters/vocab-sign-webcam.jpg',
                  title: `Sign for ${word}`,
                  signLanguage: content.signLanguage || 'NSL',
                  durationSeconds: 15,
                  reviewedBy: 'Teacher Author Preview',
                  reviewStatus: 'draft',
                }}
              />
            </div>
          )}

          {/* Step 3: Signed Meaning Video */}
          {previewStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <span className="text-xs font-black uppercase text-teal-800 block">Step 3: Signed Meaning Video</span>
              <h4 className="text-xl font-black text-slate-900">What does {word} mean?</h4>
              <AccessibleSignVideoPlayer
                source={{
                  provider: 'local',
                  src: signedMeaningUrl,
                  fallbackSrc: signedMeaningUrl,
                  posterUrl: '/images/posters/signed-meaning-webcam.jpg',
                  title: `Signed Meaning: ${word}`,
                  signLanguage: content.signLanguage || 'NSL',
                  durationSeconds: 30,
                  reviewedBy: 'Teacher Author Preview',
                  reviewStatus: 'draft',
                }}
              />
            </div>
          )}

          {/* Step 4: Visual Story */}
          {previewStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <span className="text-xs font-black uppercase text-teal-800 block">Step 4: Visual Story</span>
              {frames[activeFrameIndex] && (
                <div className="space-y-3">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 relative">
                    <img
                      src={frames[activeFrameIndex].imageUrl}
                      alt={frames[activeFrameIndex].altText}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 text-white p-3 rounded-xl text-sm font-black">
                      &ldquo;{frames[activeFrameIndex].caption}&rdquo;
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setActiveFrameIndex((p) => Math.max(0, p - 1))}
                      disabled={activeFrameIndex === 0}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 disabled:opacity-40 text-xs font-bold"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-bold text-slate-500">
                      Frame {activeFrameIndex + 1} of {frames.length}
                    </span>
                    <button
                      onClick={() => setActiveFrameIndex((p) => Math.min(frames.length - 1, p + 1))}
                      disabled={activeFrameIndex === frames.length - 1}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 disabled:opacity-40 text-xs font-bold"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Practice & Retry */}
          {previewStep === 5 && (
            <div className="space-y-4 animate-fade-in">
              <span className="text-xs font-black uppercase text-teal-800 block">Step 5: Practice &amp; Retry</span>
              <h4 className="text-base font-black text-slate-900">
                What helps the facilitator see the child?
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {['Webcam', 'Keyboard', 'Mouse'].map((label) => (
                  <button
                    key={label}
                    onClick={() => setSelectedPractice(label)}
                    className={`p-3 rounded-2xl border-2 text-center text-xs font-black transition ${
                      selectedPractice === label
                        ? label === 'Webcam'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                          : 'border-rose-500 bg-rose-50 text-rose-950'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {selectedPractice === 'Webcam' && (
                <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Yes! Correct feedback demonstrated to learner.</span>
                </div>
              )}
              {selectedPractice && selectedPractice !== 'Webcam' && (
                <div className="p-3 bg-rose-50 text-rose-900 border border-rose-300 rounded-xl text-xs font-bold">
                  Not yet. Look for the small camera. (Supportive retry available)
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setPreviewStep((p) => Math.max(1, p - 1))}
            disabled={previewStep === 1}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs disabled:opacity-40 interactive-target"
          >
            ← Previous Step
          </button>

          <button
            onClick={() => setPreviewStep((p) => Math.min(5, p + 1))}
            disabled={previewStep === 5}
            className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs disabled:opacity-40 interactive-target flex items-center gap-1.5"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
