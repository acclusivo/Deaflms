'use client';

import React, { useState } from 'react';
import { Upload, Video, CheckCircle2, Loader2, Link2, Sparkles, Youtube } from 'lucide-react';

interface VideoUploaderProps {
  onVideoUploaded: (url: string) => void;
  initialUrl?: string;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoUploaded, initialUrl }) => {
  const [uploadMode, setUploadMode] = useState<'youtube' | 'file'>('youtube');
  const [youtubeInput, setYoutubeInput] = useState(initialUrl || '');
  const [uploading, setUploading] = useState(false);
  const [confirmedUrl, setConfirmedUrl] = useState<string | null>(initialUrl || null);

  const youtubeId = extractYouTubeId(youtubeInput);

  const handleApplyYoutube = () => {
    if (!youtubeId) return;
    const finalUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    setConfirmedUrl(finalUrl);
    onVideoUploaded(finalUrl);
  };

  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setTimeout(() => {
      const simulatedUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
      setConfirmedUrl(simulatedUrl);
      setUploading(false);
      onVideoUploaded(simulatedUrl);
    }, 1000);
  };

  const handleClear = () => {
    setConfirmedUrl(null);
    setYoutubeInput('');
  };

  return (
    <div className="space-y-4 bg-slate-50 p-5 rounded-3xl border-2 border-slate-200">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
          Teacher Sign Video Source:
        </label>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Lightweight YouTube Integration
        </span>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex gap-2 p-1 bg-white rounded-2xl border border-slate-200 w-fit">
        <button
          type="button"
          onClick={() => setUploadMode('youtube')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition interactive-target ${
            uploadMode === 'youtube'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Youtube className="w-4 h-4 text-rose-500 fill-rose-500" />
          YouTube Link (Recommended)
        </button>

        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition interactive-target ${
            uploadMode === 'file'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-4 h-4" />
          Direct Video Upload
        </button>
      </div>

      {/* Mode 1: YouTube Link Input */}
      {uploadMode === 'youtube' && !confirmedUrl && (
        <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
            <Link2 className="w-4 h-4 text-indigo-600" />
            Paste any YouTube sign video link (standard video or Short):
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={youtubeInput}
              onChange={(e) => setYoutubeInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
              className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:bg-white transition"
            />
            <button
              type="button"
              onClick={handleApplyYoutube}
              disabled={!youtubeId}
              className={`px-5 py-2.5 rounded-xl font-black text-xs transition interactive-target shrink-0 ${
                youtubeId
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Attach YouTube Video
            </button>
          </div>

          {/* Instant YouTube Preview */}
          {youtubeId && (
            <div className="pt-2 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Live Video Preview:
              </span>
              <div className="aspect-video w-full max-w-sm rounded-2xl overflow-hidden border-2 border-indigo-200 shadow-md">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title="YouTube Preview"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <p className="text-[11px] text-slate-400 font-medium">
            💡 Using YouTube links prevents heavy server storage and bandwidth costs while keeping lessons fast and responsive for students.
          </p>
        </div>
      )}

      {/* Mode 2: Direct File Upload */}
      {uploadMode === 'file' && !confirmedUrl && (
        <div className="border-4 border-dashed border-slate-200 hover:border-indigo-400 bg-white rounded-2xl p-6 text-center transition cursor-pointer relative shadow-sm">
          <input
            type="file"
            accept="video/*"
            onChange={handleSimulateFileUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            </div>
            <div className="font-extrabold text-slate-800 text-sm">
              {uploading ? 'Uploading Video to Storage...' : 'Click or Drag Video File here'}
            </div>
            <p className="text-xs text-slate-400">MP4 or WebM (Direct Hosting)</p>
          </div>
        </div>
      )}

      {/* Confirmed Video Banner */}
      {confirmedUrl && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              {confirmedUrl.includes('youtube') || confirmedUrl.includes('youtu.be') ? (
                <Youtube className="w-5 h-5 fill-current" />
              ) : (
                <Video className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="text-xs font-black text-emerald-900 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {confirmedUrl.includes('youtube') || confirmedUrl.includes('youtu.be')
                  ? 'YouTube Sign Video Attached'
                  : 'Uploaded Video File Ready'}
              </div>
              <span className="text-[11px] text-emerald-700 font-bold truncate max-w-xs block">
                {confirmedUrl}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200"
          >
            Change Video
          </button>
        </div>
      )}
    </div>
  );
};
