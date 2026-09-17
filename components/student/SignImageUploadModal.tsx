'use client';

import React, { useState } from 'react';
import {
  Upload,
  Camera,
  X,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Sparkles,
  Image as ImageIcon,
  HandMetal,
} from 'lucide-react';
import {
  STANDARD_ALPHABET_SIGNS,
  saveCustomSignImage,
  removeCustomSignImage,
  resetAllCustomSignImages,
  getCustomUploadedLetters,
  getSignImage,
} from '@/lib/fingerspell-signs';
import { SignHandshapeIcon } from './SignHandshapeIcon';

interface SignImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImagesUpdated: () => void;
}

export const SignImageUploadModal: React.FC<SignImageUploadModalProps> = ({
  isOpen,
  onClose,
  onImagesUpdated,
}) => {
  const letters = Object.keys(STANDARD_ALPHABET_SIGNS).sort();
  const [selectedLetter, setSelectedLetter] = useState<string>('A');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'browse'>('upload');

  const customLetters = typeof window !== 'undefined' ? getCustomUploadedLetters() : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreviewUrl(dataUrl);
      saveCustomSignImage(selectedLetter, dataUrl);
      setUploadSuccess(true);
      onImagesUpdated();
      setTimeout(() => setUploadSuccess(false), 2500);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCurrent = () => {
    removeCustomSignImage(selectedLetter);
    setPreviewUrl(null);
    onImagesUpdated();
  };

  const handleResetAll = () => {
    if (confirm('Are you sure you want to reset all custom sign pictures back to standard illustrations?')) {
      resetAllCustomSignImages();
      setPreviewUrl(null);
      onImagesUpdated();
    }
  };

  if (!isOpen) return null;

  const currentSign = getSignImage(selectedLetter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-4 border-indigo-200 flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">Custom Sign Picture Manager</h3>
              <p className="text-xs text-slate-400">
                Upload real photos of your hand or teacher signing each letter for the keyboard
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition interactive-target"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Letter Selector Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                Choose Letter to Update (A to Z):
              </label>
              <span className="text-[11px] font-bold text-indigo-600">
                {customLetters.length} custom photo{customLetters.length === 1 ? '' : 's'} active
              </span>
            </div>

            <div className="grid grid-cols-9 sm:grid-cols-13 gap-1.5 p-2 bg-slate-100 rounded-2xl border border-slate-200">
              {letters.map((char) => {
                const isSelected = selectedLetter === char;
                const hasCustom = customLetters.includes(char);
                return (
                  <button
                    key={char}
                    onClick={() => {
                      setSelectedLetter(char);
                      setPreviewUrl(null);
                    }}
                    className={`h-10 rounded-xl font-black text-xs transition flex flex-col items-center justify-center relative interactive-target ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md scale-105'
                        : 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-200'
                    }`}
                  >
                    <span>{char}</span>
                    {hasCustom && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Letter Preview & Upload Pane */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 items-center">
            {/* Left: Current Sign Display */}
            <div className="flex flex-col items-center justify-center text-center space-y-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-black uppercase text-slate-400">
                Letter <span className="text-indigo-600 text-lg">{selectedLetter}</span> Sign Picture:
              </div>

              <div className="w-28 h-28 rounded-2xl bg-slate-100 border-2 border-dashed border-indigo-300 flex items-center justify-center p-2 shadow-inner">
                <SignHandshapeIcon letter={selectedLetter} size="xl" />
              </div>

              <div>
                <span className="text-xs font-black text-slate-900 block">
                  {currentSign.details.name}
                </span>
                <p className="text-[11px] text-slate-500 font-medium leading-tight mt-1 max-w-xs">
                  {currentSign.details.handshapeDescription}
                </p>
              </div>

              {currentSign.type === 'custom' && (
                <button
                  onClick={handleRemoveCurrent}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1.5 border border-rose-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Revert to Vector Sign
                </button>
              )}
            </div>

            {/* Right: Upload Trigger */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-black text-slate-900 text-sm">
                  Upload Photo for Letter &quot;{selectedLetter}&quot;
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Snap a photo of your hand, a teacher, or upload a regional sign picture (NSL, ASL, KSL, SASL).
                </p>
              </div>

              {uploadSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Sign picture for &quot;{selectedLetter}&quot; saved successfully!
                </div>
              )}

              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-300 hover:border-indigo-600 rounded-2xl cursor-pointer bg-white hover:bg-indigo-50/50 transition group interactive-target">
                <Upload className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition mb-2" />
                <span className="text-xs font-black text-slate-800">
                  Click to Browse Image
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WebP supported</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Facilitator Global Reset */}
          {customLetters.length > 0 && (
            <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
              <span>Need to start over?</span>
              <button
                onClick={handleResetAll}
                className="font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All to Standard Signs
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Changes automatically apply across the keyboard and fingerspell games.
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition shadow-md interactive-target"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
