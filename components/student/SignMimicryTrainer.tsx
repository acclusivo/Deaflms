'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  Camera,
  RotateCcw,
  Play,
  Pause,
  CheckCircle2,
  Sparkles,
  Eye,
  Heart,
  Users,
  Award,
  ChevronRight,
  HelpCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface PhraseItem {
  id: string;
  phrase: string;
  category: 'Greetings' | 'Family & Home' | 'Workplace' | 'Questions';
  englishContext: string;
  nslVideoUrl?: string;
  signBreakdown: string;
  culturalEtiquetteTip: string;
}

const CONVERSATIONAL_PHRASES: PhraseItem[] = [
  {
    id: 'ph-1',
    phrase: 'Hello, Good Morning',
    category: 'Greetings',
    englishContext: 'Used to greet Deaf friends, colleagues, or family members at start of day.',
    signBreakdown: 'Hand flat to forehead like a gentle salute outward, then non-dominant hand flat as horizon with dominant sun rising upward.',
    culturalEtiquetteTip: 'Always smile and establish direct eye contact before signing good morning. In Deaf culture, facial grammar is 50% of the message!',
  },
  {
    id: 'ph-2',
    phrase: 'My Name Is...',
    category: 'Greetings',
    englishContext: 'Standard conversational introduction followed by fingerspelling your name.',
    signBreakdown: 'Flat open palm touches chest for "MY", then "H" handshapes tap crosswise twice for "NAME". Finish by fingerspelling your first name.',
    culturalEtiquetteTip: 'Keep your fingerspelling hand steady in front of your shoulder, not bouncing with every letter. Mouth the letters silently as you spell.',
  },
  {
    id: 'ph-3',
    phrase: 'Are You Deaf? / I Am Hearing',
    category: 'Questions',
    englishContext: 'Respectful identity inquiry to establish preferred visual communication mode.',
    signBreakdown: 'Index finger touches ear then mouth for "DEAF", followed by raised eyebrows for question marking. For "HEARING", index finger circles gently near mouth.',
    culturalEtiquetteTip: 'Never apologize for being hearing or feel nervous. Deaf people appreciate hearing allies taking the initiative to communicate directly in sign language!',
  },
  {
    id: 'ph-4',
    phrase: 'Thank You Very Much',
    category: 'Greetings',
    englishContext: 'Warm gratitude expression in everyday conversations.',
    signBreakdown: 'Fingertips of dominant flat hand touch chin/lips, then move forward and slightly downward toward the person with a grateful facial expression.',
    culturalEtiquetteTip: 'Both hands can be used for deep, heartfelt appreciation. Do not blow a kiss—the hand starts at the chin and moves forward.',
  },
  {
    id: 'ph-5',
    phrase: 'Please Help Me Understand',
    category: 'Workplace',
    englishContext: 'Helpful phrase when an ally needs clarification or slower signing.',
    signBreakdown: 'Flat dominant hand palm rubs clockwise over chest for "PLEASE", then closed fist rests on flat open palm moving forward for "HELP".',
    culturalEtiquetteTip: 'It is completely normal to ask someone to sign slower! Sign "SLOW" (dominant hand brushing up the non-dominant forearm). Deaf communicators respect your honesty.',
  },
];

export const SignMimicryTrainer: React.FC = () => {
  const [selectedPhrase, setSelectedPhrase] = useState<PhraseItem>(CONVERSATIONAL_PHRASES[0]);
  const [speed, setSpeed] = useState<number>(1.0);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [practiceCount, setPracticeCount] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);

  // Toggle Camera Mirror Mode
  const toggleCamera = async () => {
    if (cameraActive) {
      if (webcamRef.current && webcamRef.current.srcObject) {
        const stream = webcamRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        webcamRef.current.srcObject = null;
      }
      setCameraActive(false);
      setCameraError(null);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false,
        });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
        setCameraActive(true);
        setCameraError(null);
      } catch (e: any) {
        console.warn('Webcam permission not granted or unavailable:', e);
        setCameraError('Camera access not granted or unavailable. You can still practice with the simulated mirror guide below.');
        setCameraActive(false);
      }
    }
  };

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (webcamRef.current && webcamRef.current.srcObject) {
        const stream = webcamRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSelectPhrase = (phrase: PhraseItem) => {
    setSelectedPhrase(phrase);
    setPracticeCount(0);
    setShowCelebration(false);
  };

  const handlePracticeRepetition = () => {
    const nextCount = practiceCount + 1;
    setPracticeCount(nextCount);
    if (nextCount % 3 === 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm space-y-0">
      {/* Header Bar */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-black border border-teal-500/30 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded">
                Sign Mimicry &amp; Mirror
              </span>
              <span className="text-xs text-slate-400 font-medium">Hearing Allies &amp; Family Track</span>
            </div>
            <h2 className="text-lg font-black text-white">{selectedPhrase.phrase}</h2>
          </div>
        </div>

        {/* Speed Controls for Hearing Learners */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
          <span className="text-[10px] font-black text-slate-400 uppercase px-2">Speed:</span>
          {[0.5, 0.75, 1.0].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition ${
                speed === s
                  ? 'bg-teal-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {s}x {s === 0.5 ? '(Slow-Mo)' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Phrase Navigation Tabs */}
      <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
        {CONVERSATIONAL_PHRASES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSelectPhrase(item)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition shrink-0 flex items-center gap-1.5 ${
              selectedPhrase.id === item.id
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <span>{item.phrase}</span>
          </button>
        ))}
      </div>

      {/* Dual Split Screen: Native Signer vs Camera Mirror */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-slate-950">
        {/* VIEW 1: Certified NSL Signer Instruction */}
        <div className="p-4 sm:p-6 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-teal-400 font-bold">
              <span className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-teal-400" />
                Accredited NSL Video Model
              </span>
              <span className="text-[10px] uppercase font-black bg-teal-900/60 text-teal-200 px-2 py-0.5 rounded border border-teal-800">
                Play at {speed}x
              </span>
            </div>

            {/* Video Container */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                alt="NSL Sign Demonstration"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-black text-sm">{selectedPhrase.phrase}</span>
                <span className="text-teal-300 text-xs font-medium">{selectedPhrase.englishContext}</span>
              </div>
            </div>
          </div>

          {/* Breakdown Notes */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
            <span className="font-black text-teal-400 uppercase tracking-wider text-[10px] block">
              Handshape &amp; Motion Breakdown:
            </span>
            <p className="leading-relaxed">{selectedPhrase.signBreakdown}</p>
          </div>
        </div>

        {/* VIEW 2: Learner Camera Mirror */}
        <div className="p-4 sm:p-6 space-y-3 flex flex-col justify-between bg-slate-900">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-400" />
                Your Practice Mirror (Self Check)
              </span>
              <button
                type="button"
                onClick={toggleCamera}
                className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                  cameraActive
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                {cameraActive ? 'Turn Off Camera' : 'Turn On Camera Mirror'}
              </button>
            </div>

            {/* Webcam / Fallback Container */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative flex items-center justify-center">
              <video
                ref={webcamRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover -scale-x-100 ${cameraActive ? 'block' : 'hidden'}`}
              />

              {!cameraActive && (
                <div className="text-center p-6 space-y-3 max-w-xs">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto border border-slate-700">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">Camera Mirror Inactive</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Turn on your webcam to check your hand position, face expression, and sign space side-by-side with the teacher.
                    </p>
                  </div>
                </div>
              )}

              {cameraError && (
                <div className="absolute inset-0 bg-slate-950/90 p-4 flex items-center justify-center text-center">
                  <p className="text-xs text-amber-300 font-medium">{cameraError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Repetition Practice Counter & Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold">Times Practiced This Session:</span>
              <span className="font-black text-teal-400 text-sm">{practiceCount} Repetitions</span>
            </div>

            <button
              type="button"
              onClick={handlePracticeRepetition}
              className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 fill-current" />
              <span>I Signed This! (Log Practice Repetition)</span>
            </button>

            {showCelebration && (
              <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold text-center animate-fade-in flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>3 Repetitions Completed! Great muscle memory! ⭐</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cultural Etiquette Card */}
      <div className="p-4 sm:p-5 bg-amber-50 border-t border-amber-200 flex items-start gap-3 text-xs text-amber-950">
        <Heart className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black uppercase tracking-wider text-amber-900 block text-[11px]">
            Deaf Culture &amp; Communication Etiquette:
          </span>
          <p className="mt-0.5 leading-relaxed font-medium">
            {selectedPhrase.culturalEtiquetteTip}
          </p>
        </div>
      </div>
    </div>
  );
};
