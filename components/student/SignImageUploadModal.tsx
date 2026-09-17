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
  ExternalLink,
  ShieldCheck,
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
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const customLetters = typeof window !== 'undefined' ? getCustomUploadedLetters() : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      saveCustomSignImage(selectedLetter, dataUrl);
      setUploadSuccess(true);
      onImagesUpdated();
      setTimeout(() => setUploadSuccess(false), 2500);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCurrent = () => {
    removeCustomSignImage(selectedLetter);
    onImagesUpdated();
  };

  const handleResetAll = () => {
    if (
      confirm(
        'Reset all custom photos back to the default AnySign ASL Alphabet pictures?'
      )
    ) {
      resetAllCustomSignImages();
      onImagesUpdated();
    }
  };

  if (!isOpen) return null;

  const currentSign = getSignImage(selectedLetter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl border-4 border-indigo-200 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg">
                  ASL Sign Picture & Match Manager
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> AnySign Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official AnySign ASL alphabet handshapes matched to every letter, with custom upload capability
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
                Select Letter to Inspect or Customize (A–Z):
              </label>
              <span className="text-[11px] font-bold text-indigo-600">
                {customLetters.length === 0
                  ? 'All 26 letters using AnySign ASL photos'
                  : `${customLetters.length} custom school photo${
                      customLetters.length === 1 ? '' : 's'
                    } active`}
              </span>
            </div>

            <div className="grid grid-cols-9 sm:grid-cols-13 gap-1.5 p-2 bg-slate-100 rounded-2xl border border-slate-200">
              {letters.map((char) => {
                const isSelected = selectedLetter === char;
                const hasCustom = customLetters.includes(char);
                return (
                  <button
                    key={char}
                    onClick={() => setSelectedLetter(char)}
                    className={`h-11 rounded-xl font-black text-xs transition flex flex-col items-center justify-center relative interactive-target ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md scale-105 ring-2 ring-indigo-300'
                        : 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-200'
                    }`}
                  >
                    <span>{char}</span>
                    {hasCustom ? (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    ) : (
                      <span className="text-[7px] text-slate-400 font-semibold">ASL</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Letter Match Preview & Upload Pane */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 items-center">
            {/* Left: Active Sign Image Display */}
            <div className="flex flex-col items-center justify-center text-center space-y-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-500">
                <span>Letter</span>
                <span className="text-indigo-600 text-xl font-black">{selectedLetter}</span>
                <span>Handshape Match</span>
              </div>

              {/* Handshape Picture Box */}
              <div className="w-32 h-32 rounded-2xl bg-white border-2 border-indigo-200 flex items-center justify-center p-2 shadow-inner overflow-hidden relative">
                <SignHandshapeIcon letter={selectedLetter} size="xl" />
              </div>

              {/* Source Badge */}
              <div>
                {currentSign.type === 'custom' ? (
                  <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                    Custom Upload Active
                  </span>
                ) : (
                  <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase">
                    AnySign Official ASL Photo
                  </span>
                )}
                <span className="text-xs font-black text-slate-900 block mt-1">
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
                  Revert to AnySign Photo
                </button>
              )}
            </div>

            {/* Right: Custom Upload Option */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-black text-slate-900 text-sm">
                  Upload Custom Sign for &quot;{selectedLetter}&quot;
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Need a local variation (e.g. Nigerian Sign Language, Kenyan Sign Language, South African Sign Language)? Upload a photo of your school facilitator or teacher signing letter &quot;{selectedLetter}&quot;.
                </p>
              </div>

              {uploadSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Custom photo for letter &quot;{selectedLetter}&quot; saved!
                </div>
              )}

              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-300 hover:border-indigo-600 rounded-2xl cursor-pointer bg-white hover:bg-indigo-50/50 transition group interactive-target">
                <Upload className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition mb-2" />
                <span className="text-xs font-black text-slate-800">
                  Upload New Photo for &quot;{selectedLetter}&quot;
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  PNG, JPG, WebP supported
                </span>
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
              <span>Have custom photos you want to clear?</span>
              <button
                onClick={handleResetAll}
                className="font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All to AnySign ASL Photos
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Handshape reference: AnySign ASL Fingerspelling System</span>
          </div>
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
