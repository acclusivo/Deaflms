'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle } from 'lucide-react';

interface MultipleChoiceItem {
  id: string;
  promptSignUrl: string;
  questionText: string;
  options: { id: string; label: string; imageUrl?: string; isCorrect: boolean }[];
}

interface SignToTextGameProps {
  questions: MultipleChoiceItem[];
  onComplete: (score: number, stars: number) => void;
}

export const SignToTextGame: React.FC<SignToTextGameProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (hasAnswered) return;
    setSelectedOptionId(optionId);
    setHasAnswered(true);

    const isCorrect = currentQ.options.find((o) => o.id === optionId)?.isCorrect;
    if (isCorrect) {
      setScore((s) => s + 10);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOptionId(null);
      setHasAnswered(false);
    } else {
      const finalScore = score + (selectedOptionId && currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect ? 0 : 0);
      const stars = finalScore >= 20 ? 3 : finalScore >= 10 ? 2 : 1;
      onComplete(finalScore, stars);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span className="text-indigo-600 font-extrabold">{score} Points Earned</span>
      </div>
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-indigo-600 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Sign Prompt Display */}
      <div className="bg-indigo-50/70 border-2 border-indigo-200 rounded-2xl p-5 text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          Watch the Sign:
        </div>
        <div className="text-lg font-black text-slate-900 max-w-lg mx-auto">
          {currentQ.questionText}
        </div>
      </div>

      {/* Written Text Options */}
      <div className="grid grid-cols-1 gap-3">
        {currentQ.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          let buttonStyle = 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-slate-100 text-slate-800';

          if (hasAnswered) {
            if (option.isCorrect) {
              buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black correct-glow';
            } else if (isSelected && !option.isCorrect) {
              buttonStyle = 'bg-rose-50 border-rose-500 text-rose-950 incorrect-glow animate-wiggle';
            } else {
              buttonStyle = 'opacity-40 bg-slate-50 border-slate-200 text-slate-400';
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option.id)}
              disabled={hasAnswered}
              className={`p-4 rounded-2xl border-4 text-left font-bold text-lg flex items-center justify-between transition-all interactive-target ${buttonStyle}`}
            >
              <span>{option.label}</span>
              {hasAnswered && option.isCorrect && (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              )}
              {hasAnswered && isSelected && !option.isCorrect && (
                <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Next Question Button */}
      {hasAnswered && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md shadow-indigo-200 transition interactive-target animate-fade-in"
          >
            {currentIndex + 1 < questions.length ? 'Next Word' : 'Complete Game'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
