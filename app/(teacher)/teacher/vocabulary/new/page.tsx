'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { VideoUploader } from '@/components/teacher/VideoUploader';
import { LearnerPreviewModal } from '@/components/teacher/LearnerPreviewModal';
import { createOrUpdateVocabularyContent } from '@/lib/api';
import { VocabularyContent, ContentReviewStatus, VisualStoryFrame } from '@/lib/types';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Upload,
  Camera,
  Layers,
  Sparkles,
  Info,
  Clock,
  ShieldCheck,
  Video,
  Hand,
} from 'lucide-react';

export default function NewVocabularyAuthoringPage() {
  const router = useRouter();

  // Basic Details
  const [word, setWord] = useState('');
  const [displayWord, setDisplayWord] = useState('');
  const [fingerspelling, setFingerspelling] = useState('');
  const [writtenMeaning, setWrittenMeaning] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState<'beginner' | 'developing' | 'independent'>('beginner');
  const [ageMin, setAgeMin] = useState(8);
  const [ageMax, setAgeMax] = useState(16);

  // Language & Regional Variant
  const [signLanguage, setSignLanguage] = useState('Nigerian Sign Language (NSL)');
  const [country, setCountry] = useState('Nigeria');
  const [region, setRegion] = useState('Abuja Federal Capital Territory');
  const [localVariant, setLocalVariant] = useState('Abuja school & community variant');

  // Media
  const [pictureUrl, setPictureUrl] = useState('/images/hardware/webcam.jpg');
  const [pictureAlt, setPictureAlt] = useState('Real physical webcam hardware camera');
  const [vocabularySignVideoUrl, setVocabularySignVideoUrl] = useState('');
  const [signedMeaningVideoUrl, setSignedMeaningVideoUrl] = useState('');
  const [signedExampleVideoUrl, setSignedExampleVideoUrl] = useState('');
  const [updateReason, setUpdateReason] = useState('');

  // 3-Frame Visual Story
  const [frames, setFrames] = useState<VisualStoryFrame[]>([
    {
      id: 'f-1',
      order: 1,
      imageUrl: '/images/story/webcam-frame-1.jpg',
      caption: 'I sit near the webcam.',
      altText: 'A Nigerian Deaf child sits near a laptop and webcam',
    },
    {
      id: 'f-2',
      order: 2,
      imageUrl: '/images/story/webcam-frame-2.jpg',
      caption: 'The webcam shows me online.',
      altText: 'The webcam captures the child',
    },
    {
      id: 'f-3',
      order: 3,
      imageUrl: '/images/story/webcam-frame-3.jpg',
      caption: 'My facilitator can see me.',
      altText: 'A Deaf facilitator sees the child on another screen',
    },
  ]);

  // Review & Publishing
  const [status, setStatus] = useState<ContentReviewStatus>('draft');
  const [notes, setNotes] = useState('Created for elementary digital literacy cohort.');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (targetStatus: ContentReviewStatus) => {
    if (!word.trim()) return;

    setStatus(targetStatus);
    await createOrUpdateVocabularyContent({
      word: word.trim(),
      slug: word.toLowerCase().trim().replace(/\s+/g, '-'),
      courseId: 'course-digital-literacy-1',
      moduleId: 'mod-1',
      lessonId: 'lesson-hardware-1',
      pictureUrl: pictureUrl || '/images/hardware/webcam.jpg',
      pictureAlt: pictureAlt || `Photo of ${word}`,
      vocabularySignVideoUrl: vocabularySignVideoUrl || 'https://www.youtube.com/watch?v=GZvX_Q9si5M',
      signedMeaningVideoUrl: signedMeaningVideoUrl || 'https://www.youtube.com/watch?v=By5O5IGPNBU',
      signedExampleVideoUrl: signedExampleVideoUrl || undefined,
      writtenMeaning: writtenMeaning || 'A small camera used with a computer.',
      exampleSentence: exampleSentence || 'I use it for my online class.',
      fingerspelling: fingerspelling || word.toUpperCase().split('').join(' - '),
      signLanguage,
      country,
      region,
      localVariant,
      visualExplanation: frames,
      ageMin,
      ageMax,
      difficultyLevel,
      status: targetStatus,
      version: 1,
      createdBy: 'Facilitator — Sample Account',
      reviewedBy: ['Deaf Reviewer (Abuja)', 'Education Reviewer (Nigeria)'],
      updateReason: updateReason || undefined,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      router.push('/teacher/dashboard');
    }, 1200);
  };

  const previewContent: Partial<VocabularyContent> = {
    word: word || 'Webcam',
    pictureUrl: pictureUrl || '/images/hardware/webcam.jpg',
    vocabularySignVideoUrl,
    signedMeaningVideoUrl,
    writtenMeaning,
    fingerspelling: fingerspelling || word.toUpperCase().split('').join(' - '),
    signLanguage,
    localVariant,
    visualExplanation: frames,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentRole="teacher" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/teacher/dashboard"
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 transition shadow-xs"
              aria-label="Back to Facilitator Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">
                  Vocabulary Content Studio
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[10px] font-black uppercase">
                  Facilitator Authoring
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Add and version approved Nigerian Sign Language vocabulary without editing source code.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white border-2 border-teal-600 text-teal-800 hover:bg-teal-50 font-black text-xs transition interactive-target flex items-center gap-1.5 shadow-xs"
            >
              <Eye className="w-4 h-4" />
              <span>Preview as Learner</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave('draft')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition interactive-target flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave('needs_review')}
              className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition interactive-target flex items-center gap-1.5 shadow-md shadow-teal-200"
            >
              <Send className="w-4 h-4" />
              <span>Submit for Review</span>
            </button>
          </div>
        </div>

        {/* Success Feedback Alert */}
        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-950 rounded-2xl text-xs font-black flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Vocabulary content saved successfully! Redirecting to Facilitator Studio...</span>
          </div>
        )}

        {/* Mandatory Safeguarding & Upload Rules Banner */}
        <div className="p-4 rounded-2xl bg-teal-50 border-2 border-teal-200 text-xs text-teal-950 space-y-1">
          <div className="flex items-center gap-2 font-black uppercase tracking-wider text-teal-900">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Intellectual Property &amp; Content Mandate:</span>
          </div>
          <p className="font-semibold leading-relaxed">
            Only upload content you created or have permission to use. AI organises content; Deaf educators sign and review the meaning.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave('needs_review'); }} className="space-y-8">
          
          {/* Section 1: Vocabulary & Written Connection */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-slate-900">1. Vocabulary Word &amp; Written Connection</h2>
              <p className="text-xs text-slate-500 font-medium">Standard English terminology, fingerspelling, and optional simple meaning.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">Vocabulary Word:</label>
                <input
                  type="text"
                  required
                  value={word}
                  onChange={(e) => {
                    setWord(e.target.value);
                    if (!displayWord) setDisplayWord(e.target.value.toUpperCase());
                    if (!fingerspelling) setFingerspelling(e.target.value.toUpperCase().split('').join(' - '));
                  }}
                  placeholder="e.g. Webcam"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 focus:border-teal-700 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">Display Word (Uppercase):</label>
                <input
                  type="text"
                  value={displayWord}
                  onChange={(e) => setDisplayWord(e.target.value)}
                  placeholder="e.g. WEBCAM"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 focus:border-teal-700 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">Fingerspelling Letters:</label>
              <input
                type="text"
                value={fingerspelling}
                onChange={(e) => setFingerspelling(e.target.value)}
                placeholder="W - E - B - C - A - M"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 focus:border-teal-700 focus:bg-white transition"
              />
              <span className="text-[11px] text-slate-500 font-medium">Hyphen-separated letters for visual tile matches.</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                Optional Short Written Meaning (behind &ldquo;Read the Meaning&rdquo;):
              </label>
              <textarea
                rows={2}
                value={writtenMeaning}
                onChange={(e) => setWrittenMeaning(e.target.value)}
                placeholder="A webcam is a small camera used with a computer."
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium text-slate-900 focus:border-teal-700 focus:bg-white transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">Difficulty Level:</label>
                <select
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value as any)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 focus:border-teal-700 focus:bg-white transition"
                >
                  <option value="beginner">Beginner (Foundational)</option>
                  <option value="developing">Developing</option>
                  <option value="independent">Independent</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">Target Age Min:</label>
                <input
                  type="number"
                  value={ageMin}
                  onChange={(e) => setAgeMin(Number(e.target.value))}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 focus:border-teal-700 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">Target Age Max:</label>
                <input
                  type="number"
                  value={ageMax}
                  onChange={(e) => setAgeMax(Number(e.target.value))}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 focus:border-teal-700 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Language & Regional Variant */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-slate-900">2. Sign Language &amp; Regional Variant</h2>
              <p className="text-xs text-slate-500 font-medium">
                Support regional signs without labeling community variants as wrong.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">Sign Language System:</label>
                <input
                  type="text"
                  value={signLanguage}
                  onChange={(e) => setSignLanguage(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 focus:border-teal-700 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">Country &amp; State / Region:</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Abuja Federal Capital Territory"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 focus:border-teal-700 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">Local Dialect / Variant Label:</label>
              <select
                value={localVariant}
                onChange={(e) => setLocalVariant(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-900 focus:border-teal-700 focus:bg-white transition"
              >
                <option value="Abuja school & community variant">Abuja school &amp; community variant</option>
                <option value="Kogi variant">Kogi variant</option>
                <option value="Lagos variant">Lagos variant</option>
                <option value="School-specific sign">School-specific sign</option>
                <option value="Fingerspelled technical word">Fingerspelled technical word</option>
              </select>
            </div>
          </div>

          {/* Section 3: Dual Video Fields & Media Assets */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">3. Distinct Media &amp; Video Streams</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Mandatory distinction: Vocabulary Sign Video vs. Signed Meaning Video. Never combine.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                Zero Ambiguity Rule
              </span>
            </div>

            {/* Recording Checklist Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
              <span className="font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-teal-700" />
                Facilitator Recording Checklist:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                <div>✓ Plain neutral background</div>
                <div>✓ Even lighting, no back-glare</div>
                <div>✓ Face, hands and upper body fully visible</div>
                <div>✓ Contrasting dark clothing</div>
                <div>✓ No captions or graphics over hands</div>
                <div>✓ One idea at a time (clear pauses)</div>
              </div>
            </div>

            {/* Main Picture Upload */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                Step 1: Main Physical Object Picture:
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={pictureUrl}
                  onChange={(e) => setPictureUrl(e.target.value)}
                  placeholder="/images/hardware/webcam.jpg"
                  className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Video Stream 1: Vocabulary Sign Video */}
            <div className="space-y-2 p-5 bg-teal-50/50 rounded-2xl border border-teal-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                  <Hand className="w-4 h-4 text-teal-700" />
                  Stream A: Vocabulary Sign Video (5–15 seconds)
                </label>
                <span className="text-[10px] text-teal-800 font-bold">Word Gesture Demonstration</span>
              </div>
              <VideoUploader
                initialUrl={vocabularySignVideoUrl}
                onVideoUploaded={(url) => setVocabularySignVideoUrl(url)}
              />
            </div>

            {/* Video Stream 2: Signed Meaning Video */}
            <div className="space-y-2 p-5 bg-amber-50/50 rounded-2xl border border-amber-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-amber-700" />
                  Stream B: Signed Meaning Video (15–45 seconds)
                </label>
                <span className="text-[10px] text-amber-800 font-bold">Facilitator Concept Explanation</span>
              </div>
              <VideoUploader
                initialUrl={signedMeaningVideoUrl}
                onVideoUploaded={(url) => setSignedMeaningVideoUrl(url)}
              />
            </div>
          </div>

          {/* Section 4: 3-Frame Visual Story Configuration */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-slate-900">4. Three-Frame Visual Story (&ldquo;Show Me&rdquo;)</h2>
              <p className="text-xs text-slate-500 font-medium">
                Structured 3-part contextual story. Use local reviewed photography or illustrations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {frames.map((frame, idx) => (
                <div key={frame.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <span className="text-xs font-black uppercase text-teal-800 block">
                    Frame {idx + 1}:
                  </span>
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                    <img src={frame.imageUrl} alt={frame.altText} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Caption:</label>
                    <input
                      type="text"
                      value={frame.caption}
                      onChange={(e) => {
                        const updated = [...frames];
                        updated[idx].caption = e.target.value;
                        setFrames(updated);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Versioning & Update Reason */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">5. Version Control &amp; Update Reason</h2>
                <p className="text-xs text-slate-500 font-medium">
                  When modifying an approved sign or meaning video, the current published version remains live until new version is reviewed.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-black">
                Version 1.0 (Draft)
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">Update Reason / Reviewer Notes:</label>
              <input
                type="text"
                value={updateReason}
                onChange={(e) => setUpdateReason(e.target.value)}
                placeholder="e.g. Initial creation of Abuja regional variant for elementary pilot cohort."
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-xs font-bold text-slate-900 focus:border-teal-700 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Form Bottom Submission Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-white border-2 border-teal-700 text-teal-800 hover:bg-teal-50 font-black text-sm transition interactive-target flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview as Learner</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSave('draft')}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition interactive-target"
              >
                Save Draft
              </button>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-xl shadow-teal-200 transition interactive-target flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit for Review</span>
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* Learner Preview Modal */}
      <LearnerPreviewModal
        content={previewContent}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
