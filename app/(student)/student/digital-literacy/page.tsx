'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { ComputerHotspotGame } from '@/components/student/ComputerHotspotGame';
import { KeyboardTrainer } from '@/components/student/KeyboardTrainer';
import { VisualReward } from '@/components/common/VisualReward';
import { Laptop, Keyboard, Video, Eye, Sun, MessageSquare, Subtitles } from 'lucide-react';

export default function DigitalLiteracyHubPage() {
  const [activeTab, setActiveTab] = useState<'hardware' | 'keyboard' | 'video-calls'>('hardware');
  const [showReward, setShowReward] = useState(false);
  const [rewardScore, setRewardScore] = useState(0);

  const handleGameComplete = (score: number, stars: number) => {
    setRewardScore(score);
    setShowReward(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentRole="student" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Page Hero Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-2 relative z-10">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-indigo-100 inline-block">
              Digital & Computer Literacy Track
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Computer Skills for Deaf Learners
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base">
              Learn computer hardware, practice fingerspell typing, and master video call signing skills with interactive visual games!
            </p>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border-2 border-slate-200 shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('hardware')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm transition interactive-target ${
              activeTab === 'hardware'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Laptop className="w-4 h-4" />
            1. Hardware Explorer
          </button>

          <button
            onClick={() => setActiveTab('keyboard')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm transition interactive-target ${
              activeTab === 'keyboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            2. Keyboard & Fingerspelling
          </button>

          <button
            onClick={() => setActiveTab('video-calls')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm transition interactive-target ${
              activeTab === 'video-calls'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Video className="w-4 h-4" />
            3. Video Call Sign Etiquette
          </button>
        </div>

        {/* Active Tab Content */}
        <div className="pt-2">
          {activeTab === 'hardware' && (
            <ComputerHotspotGame onComplete={(score, stars) => handleGameComplete(score, stars)} />
          )}

          {activeTab === 'keyboard' && (
            <KeyboardTrainer onComplete={(score, stars) => handleGameComplete(score, stars)} />
          )}

          {activeTab === 'video-calls' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sun className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">1. Clear Lighting on Signing Hands</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Always have your primary light source in front of you, not behind you. If light is behind you, your face and hands will appear dark like a silhouette, making signs hard for your teacher to read!
                </p>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs font-bold text-amber-900">
                  Tip: Put a lamp behind your computer monitor pointing toward your hands.
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">2. Camera Framing & Signing Space</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Make sure your webcam captures from the top of your head down to your waist. This ensures your complete "signing bubble" and facial expressions are visible to everyone in class.
                </p>
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200 text-xs font-bold text-indigo-900">
                  Tip: Sit about an arm’s length away from your screen.
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Subtitles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">3. Enable Live Captions (CC)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Always click the "CC" button on video calls (Zoom, Meet, Teams). Captions turn spoken words into instant written text so you never miss a teacher instruction or classmate question.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">4. Use In-Call Chat for Fast Clarifications</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Keep your chat window open. If video stutters or a sign is unclear, type a quick message in chat so the teacher knows immediately.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Visual Celebration Reward */}
      <VisualReward
        isOpen={showReward}
        score={rewardScore}
        starsEarned={3}
        totalPoints={40}
        onContinue={() => setShowReward(false)}
        title="Tech Skills Mastered!"
        subtitle="You are a certified Digital Navigator!"
      />
    </div>
  );
}
