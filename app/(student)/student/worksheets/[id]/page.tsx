'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getWorksheetById, submitWorksheetProgress } from '@/lib/api';
import { Worksheet } from '@/lib/types';
import { Navbar } from '@/components/common/Navbar';
import { PictureToSignGame } from '@/components/student/PictureToSignGame';
import { SignToTextGame } from '@/components/student/SignToTextGame';
import { FingerspellBuilder } from '@/components/student/FingerspellBuilder';
import { VisualReward } from '@/components/common/VisualReward';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function WorksheetRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const worksheetId = params?.id as string;

  const [worksheet, setWorksheet] = useState<Worksheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState<{ score: number; stars: number }>({ score: 0, stars: 0 });

  useEffect(() => {
    async function loadWorksheet() {
      if (!worksheetId) return;
      const data = await getWorksheetById(worksheetId);
      setWorksheet(data);
      setLoading(false);
    }
    loadWorksheet();
  }, [worksheetId]);

  const handleGameComplete = async (score: number, stars: number) => {
    setRewardData({ score, stars });
    setShowReward(true);

    if (worksheet) {
      await submitWorksheetProgress(worksheet.id, worksheet.lessonId, score, stars);
    }
  };

  const handleContinue = () => {
    setShowReward(false);
    router.push('/student/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-indigo-600 font-bold">
            <Loader2 className="w-6 h-6 animate-spin" />
            Loading Worksheet...
          </div>
        </div>
      </div>
    );
  }

  if (!worksheet) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Worksheet not found</h2>
          <Link
            href="/student/dashboard"
            className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        {/* Navigation & Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Activity Type: {worksheet.activityType.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Dynamic Game Component based on Worksheet Activity Type */}
        <div className="py-4">
          {worksheet.activityType === 'picture_to_sign' && worksheet.pairs && (
            <PictureToSignGame pairs={worksheet.pairs} onComplete={handleGameComplete} />
          )}

          {worksheet.activityType === 'sign_to_text' && worksheet.multipleChoice && (
            <SignToTextGame questions={worksheet.multipleChoice} onComplete={handleGameComplete} />
          )}

          {worksheet.activityType === 'fingerspell_builder' && worksheet.targetFingerspellWord && worksheet.availableLetterTiles && (
            <FingerspellBuilder
              targetWord={worksheet.targetFingerspellWord}
              availableTiles={worksheet.availableLetterTiles}
              onComplete={handleGameComplete}
            />
          )}
        </div>
      </main>

      {/* Visual Celebration Reward Modal */}
      <VisualReward
        isOpen={showReward}
        score={rewardData.score}
        starsEarned={rewardData.stars}
        totalPoints={worksheet.totalPoints}
        onContinue={handleContinue}
      />
    </div>
  );
}
