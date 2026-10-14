import {
  ApprovedVocabularyItem,
  AccessibleVideoSource,
  VisualStoryFrame,
  LearnerHelpRequest,
  VocabularyContent,
} from './types';

/**
 * DeafLMS Core Educational Philosophy & Boundary Statement
 * 
 * "AI helps organise, retrieve and adapt facilitator-approved learning content.
 * Deaf educators create, sign and review the meaning."
 */
export const AI_ROLE_BOUNDARY_STATEMENT =
  'AI helps organise, retrieve and adapt facilitator-approved learning content. Deaf educators create, sign and review the meaning.';

export const HERO_SIGN_INTRO_VIDEO_URL = 'https://www.youtube.com/watch?v=By5O5IGPNBU';

export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Onboarding Signed Video Source (P0 Homepage Experience)
 * Never autoplay; clear upper body, chest, hands and face.
 */
export const ONBOARDING_VIDEO_SOURCE: AccessibleVideoSource = {
  provider: 'local',
  src: '/videos/onboarding-intro.mp4',
  fallbackSrc: 'https://www.youtube.com/watch?v=By5O5IGPNBU',
  posterUrl: '/images/posters/onboarding-poster.jpg',
  title: 'Welcome to DeafLMS — Signed How to Start Guide',
  signLanguage: 'Nigerian Sign Language (NSL)',
  regionalVariant: 'Abuja school & community variant',
  durationSeconds: 58,
  reviewedBy: 'Acclusivo Deaf Review Team (Abuja, Nigeria)',
  reviewStatus: 'approved',
};

export const ONBOARDING_SIGNED_MESSAGE = {
  naturalMeaning:
    'Welcome to DeafLMS. Here, you learn with pictures, familiar signs, written words and practice. First, see a picture. Next, watch the sign for the word. Then, watch a Deaf facilitator explain its meaning. If you need another example, tap Show Me. Practise by choosing the correct picture. If you still do not understand, tap I Need Help. Your parent or teacher can help you contact a facilitator safely. Tap Try the Demo to begin.',
  visualSteps: [
    { number: 1, label: 'SEE', desc: 'Look at the real picture first' },
    { number: 2, label: 'WATCH THE SIGN', desc: 'How to sign the individual word' },
    { number: 3, label: 'UNDERSTAND', desc: 'Deaf facilitator explains the concept' },
    { number: 4, label: 'SHOW ME', desc: 'Reviewed visual story frames' },
    { number: 5, label: 'PRACTISE', desc: 'Picture choice with supportive retry' },
    { number: 6, label: 'ASK FOR HELP', desc: 'Parent-supervised human support' },
    { number: 7, label: 'START', desc: 'Begin independent learner journey' },
  ],
};

/**
 * Approved Vocabulary Store
 * Distinguishes Vocabulary Sign (how to sign the word) from Signed Meaning (concept explanation).
 */
export const APPROVED_COMPUTER_WORDS: Record<string, ApprovedVocabularyItem> = {
  webcam: {
    id: 'vocab-webcam',
    word: 'Webcam',
    simpleMeaning: 'A webcam is a small camera used with a computer.',
    exampleSentence: 'I use the webcam for my online class.',
    imageUrl: '/images/hardware/webcam.jpg',
    signVideoUrl: 'https://www.youtube.com/watch?v=GZvX_Q9si5M',
    vocabularySignVideoUrl: 'https://www.youtube.com/watch?v=GZvX_Q9si5M',
    signedMeaningVideoUrl: 'https://www.youtube.com/watch?v=By5O5IGPNBU',
    signedMeaningPosterUrl: '/images/posters/signed-meaning-webcam.jpg',
    signedMeaningExplanation:
      'This is a webcam. It is a small camera connected to a computer. During an online class, it helps your teacher or facilitator see you. Look at the small camera near the computer screen.',
    visualStoryFrames: [
      {
        id: 'frame-1',
        order: 1,
        imageUrl: '/images/story/webcam-frame-1.jpg',
        caption: 'I sit near the webcam.',
        altText: 'A Nigerian Deaf child sits near a laptop and webcam',
      },
      {
        id: 'frame-2',
        order: 2,
        imageUrl: '/images/story/webcam-frame-2.jpg',
        caption: 'The webcam shows me online.',
        altText: 'The webcam captures the child and displays video on screen',
      },
      {
        id: 'frame-3',
        order: 3,
        imageUrl: '/images/story/webcam-frame-3.jpg',
        caption: 'My facilitator can see me.',
        altText: 'A Deaf facilitator sees the child on another screen in online class',
      },
    ],
    signStillUrl: '/images/posters/vocab-sign-webcam.jpg',
    signLanguage: 'NSL',
    regionalVariant: 'Nigerian Sign Language (Abuja school & community variant)',
    reviewStatus: 'approved',
    reviewedBy: 'Acclusivo Deaf Review Team (Abuja, Nigeria)',
    reviewedAt: '2026-03-01',
    reviewNote: 'Approved: clear signing space, upper body visible, distinct vocabulary sign and facilitator concept explanation.',
    fingerspell: 'W - E - B - C - A - M',
  },
  keyboard: {
    id: 'vocab-keyboard',
    word: 'Keyboard',
    simpleMeaning: 'A keyboard is a board with alphabet letters and numbers to type words on a computer.',
    exampleSentence: 'I type my homework on the keyboard.',
    imageUrl: '/images/hardware/keyboard.jpg',
    signVideoUrl: 'https://www.youtube.com/watch?v=SLwR5SNhS_8',
    vocabularySignVideoUrl: 'https://www.youtube.com/watch?v=SLwR5SNhS_8',
    signedMeaningVideoUrl: 'https://www.youtube.com/watch?v=SLwR5SNhS_8',
    signedMeaningPosterUrl: '/images/hardware/keyboard.jpg',
    signedMeaningExplanation:
      'This is a computer keyboard. It has rows of keys for letters A to Z and numbers. When you press a key with your fingers, words appear on the screen.',
    visualStoryFrames: [
      {
        id: 'frame-kb-1',
        order: 1,
        imageUrl: '/images/hardware/keyboard.jpg',
        caption: 'I place my hands on the home row keys.',
        altText: 'Hands positioned on keyboard keys',
      },
      {
        id: 'frame-kb-2',
        order: 2,
        imageUrl: '/images/hardware/keyboard.jpg',
        caption: 'My fingers press letters to type words.',
        altText: 'Typing letters on keyboard keys',
      },
      {
        id: 'frame-kb-3',
        order: 3,
        imageUrl: '/images/hardware/monitor.jpg',
        caption: 'The typed words appear on the screen.',
        altText: 'Typed sentences shown clearly on computer monitor',
      },
    ],
    signStillUrl: '/images/hardware/keyboard.jpg',
    signLanguage: 'NSL',
    regionalVariant: 'Nigerian Sign Language (Standard national variant)',
    reviewStatus: 'approved',
    reviewedBy: 'Acclusivo Deaf Review Team (Abuja, Nigeria)',
    reviewedAt: '2026-03-01',
    reviewNote: 'Verified sign video showing dual-hand horizontal typing plane.',
    fingerspell: 'K - E - Y - B - O - A - R - D',
  },
  mouse: {
    id: 'vocab-mouse',
    word: 'Mouse',
    simpleMeaning: 'A mouse is a small device you move with your hand to point and click items on the screen.',
    exampleSentence: 'I click the button using the mouse.',
    imageUrl: '/images/hardware/mouse.jpg',
    signVideoUrl: 'https://www.youtube.com/watch?v=lD-V5ThBrNs',
    vocabularySignVideoUrl: 'https://www.youtube.com/watch?v=lD-V5ThBrNs',
    signedMeaningVideoUrl: 'https://www.youtube.com/watch?v=lD-V5ThBrNs',
    signedMeaningPosterUrl: '/images/hardware/mouse.jpg',
    signedMeaningExplanation:
      'This is a computer mouse. You hold it with your hand and slide it across the table. An arrow moves on the screen, and you press the left button to select pictures.',
    visualStoryFrames: [
      {
        id: 'frame-m-1',
        order: 1,
        imageUrl: '/images/hardware/mouse.jpg',
        caption: 'I hold the mouse with my right hand.',
        altText: 'Hand resting on computer mouse',
      },
      {
        id: 'frame-m-2',
        order: 2,
        imageUrl: '/images/hardware/mouse.jpg',
        caption: 'I slide the mouse to move the pointer.',
        altText: 'Pointer moving across screen',
      },
      {
        id: 'frame-m-3',
        order: 3,
        imageUrl: '/images/hardware/monitor.jpg',
        caption: 'I click the button to open my lesson.',
        altText: 'Lesson selected on screen',
      },
    ],
    signStillUrl: '/images/hardware/mouse.jpg',
    signLanguage: 'NSL',
    regionalVariant: 'Nigerian Sign Language (Standard national variant)',
    reviewStatus: 'approved',
    reviewedBy: 'Acclusivo Deaf Review Team (Abuja, Nigeria)',
    reviewedAt: '2026-03-01',
    reviewNote: 'Verified sign demonstration mimicking index finger clicking on horizontal device.',
    fingerspell: 'M - O - U - S - E',
  },
  monitor: {
    id: 'vocab-monitor',
    word: 'Monitor',
    simpleMeaning: 'A monitor is the screen that shows pictures, words and videos on the computer.',
    exampleSentence: 'I watch my sign language teacher on the monitor.',
    imageUrl: '/images/hardware/monitor.jpg',
    signVideoUrl: 'https://www.youtube.com/watch?v=Bm0W3K_nEFM',
    vocabularySignVideoUrl: 'https://www.youtube.com/watch?v=Bm0W3K_nEFM',
    signedMeaningVideoUrl: 'https://www.youtube.com/watch?v=Bm0W3K_nEFM',
    signedMeaningPosterUrl: '/images/hardware/monitor.jpg',
    signedMeaningExplanation:
      'This is a computer monitor. It is the large screen in front of you. It lights up to show your teacher signing, colorful pictures, and reading exercises.',
    visualStoryFrames: [
      {
        id: 'frame-mon-1',
        order: 1,
        imageUrl: '/images/hardware/monitor.jpg',
        caption: 'The monitor turns on and lights up.',
        altText: 'Computer monitor displaying desktop screen',
      },
      {
        id: 'frame-mon-2',
        order: 2,
        imageUrl: '/images/hardware/monitor.jpg',
        caption: 'The monitor displays my sign video lesson.',
        altText: 'Sign language educator visible on monitor',
      },
      {
        id: 'frame-mon-3',
        order: 3,
        imageUrl: '/images/hardware/monitor.jpg',
        caption: 'I watch the educator and learn with my eyes.',
        altText: 'Student learning eye-first in front of monitor',
      },
    ],
    signStillUrl: '/images/hardware/monitor.jpg',
    signLanguage: 'NSL',
    regionalVariant: 'Nigerian Sign Language (Standard national variant)',
    reviewStatus: 'approved',
    reviewedBy: 'Acclusivo Deaf Review Team (Abuja, Nigeria)',
    reviewedAt: '2026-03-01',
    reviewNote: 'Verified sign video framing screen boundary in upper chest space.',
    fingerspell: 'M - O - N - I - T - O - R',
  },
};

export interface DemoStepItem {
  id: string;
  word: string;
  pictureUrl: string;
  signVideoUrl: string;
  vocabularySignVideoUrl: string;
  vocabularySignPosterUrl: string;
  signedMeaningVideoUrl: string;
  signedMeaningPosterUrl: string;
  signedMeaningText: string;
  simpleMeaning: string;
  exampleSentence: string;
  fingerspelling: string;
  regionalVariant: string;
  reviewedBy: string;
  visualStoryFrames: VisualStoryFrame[];
  meaningQuestion: {
    questionText: string;
    options: { id: string; label: string; imageUrl?: string; isCorrect: boolean }[];
    wrongFeedback: string;
    correctFeedback: string;
  };
  wrongPictureAdvice: string;
  wrongSpellingAdvice: string;
  wrongMeaningAdvice: string;
  successRecommendation: string;
}

export const DEMO_WORDS_STEPS: Record<string, DemoStepItem> = {
  webcam: {
    id: 'webcam',
    word: 'WEBCAM',
    pictureUrl: APPROVED_COMPUTER_WORDS.webcam.imageUrl,
    signVideoUrl: APPROVED_COMPUTER_WORDS.webcam.signVideoUrl || '',
    vocabularySignVideoUrl: APPROVED_COMPUTER_WORDS.webcam.vocabularySignVideoUrl || '',
    vocabularySignPosterUrl: '/images/posters/vocab-sign-webcam.jpg',
    signedMeaningVideoUrl: APPROVED_COMPUTER_WORDS.webcam.signedMeaningVideoUrl || '',
    signedMeaningPosterUrl: '/images/posters/signed-meaning-webcam.jpg',
    signedMeaningText: APPROVED_COMPUTER_WORDS.webcam.signedMeaningExplanation || '',
    simpleMeaning: APPROVED_COMPUTER_WORDS.webcam.simpleMeaning,
    exampleSentence: APPROVED_COMPUTER_WORDS.webcam.exampleSentence,
    fingerspelling: APPROVED_COMPUTER_WORDS.webcam.fingerspell,
    regionalVariant: APPROVED_COMPUTER_WORDS.webcam.regionalVariant || 'Nigerian Sign Language',
    reviewedBy: APPROVED_COMPUTER_WORDS.webcam.reviewedBy || 'Acclusivo Deaf Review Team',
    visualStoryFrames: APPROVED_COMPUTER_WORDS.webcam.visualStoryFrames || [],
    meaningQuestion: {
      questionText: 'What helps the facilitator see the child?',
      options: [
        { id: 'opt-webcam', label: 'Webcam', imageUrl: '/images/hardware/webcam.jpg', isCorrect: true },
        { id: 'opt-keyboard', label: 'Keyboard', imageUrl: '/images/hardware/keyboard.jpg', isCorrect: false },
        { id: 'opt-mouse', label: 'Mouse', imageUrl: '/images/hardware/mouse.jpg', isCorrect: false },
      ],
      wrongFeedback: 'Not yet. Look for the small camera.',
      correctFeedback: 'Yes! The webcam helps them see each other.',
    },
    wrongPictureAdvice: 'Repeat sign-to-picture activity: Look closely at the small camera near the computer screen.',
    wrongSpellingAdvice: 'Repeat keyboard practice: Notice the 6 letters W-E-B-C-A-M on the keys.',
    wrongMeaningAdvice: 'Repeat the signed meaning: The webcam helps your teacher see you during online class.',
    successRecommendation: 'Ready to continue to the next word: KEYBOARD',
  },
  keyboard: {
    id: 'keyboard',
    word: 'KEYBOARD',
    pictureUrl: APPROVED_COMPUTER_WORDS.keyboard.imageUrl,
    signVideoUrl: APPROVED_COMPUTER_WORDS.keyboard.signVideoUrl || '',
    vocabularySignVideoUrl: APPROVED_COMPUTER_WORDS.keyboard.vocabularySignVideoUrl || '',
    vocabularySignPosterUrl: '/images/hardware/keyboard.jpg',
    signedMeaningVideoUrl: APPROVED_COMPUTER_WORDS.keyboard.signedMeaningVideoUrl || '',
    signedMeaningPosterUrl: '/images/hardware/keyboard.jpg',
    signedMeaningText: APPROVED_COMPUTER_WORDS.keyboard.signedMeaningExplanation || '',
    simpleMeaning: APPROVED_COMPUTER_WORDS.keyboard.simpleMeaning,
    exampleSentence: APPROVED_COMPUTER_WORDS.keyboard.exampleSentence,
    fingerspelling: APPROVED_COMPUTER_WORDS.keyboard.fingerspell,
    regionalVariant: APPROVED_COMPUTER_WORDS.keyboard.regionalVariant || 'Nigerian Sign Language',
    reviewedBy: APPROVED_COMPUTER_WORDS.keyboard.reviewedBy || 'Acclusivo Deaf Review Team',
    visualStoryFrames: APPROVED_COMPUTER_WORDS.keyboard.visualStoryFrames || [],
    meaningQuestion: {
      questionText: 'Which computer part has alphabet letter keys to type words?',
      options: [
        { id: 'opt-keyboard', label: 'Keyboard', imageUrl: '/images/hardware/keyboard.jpg', isCorrect: true },
        { id: 'opt-webcam', label: 'Webcam', imageUrl: '/images/hardware/webcam.jpg', isCorrect: false },
        { id: 'opt-monitor', label: 'Monitor', imageUrl: '/images/hardware/monitor.jpg', isCorrect: false },
      ],
      wrongFeedback: 'Not yet. Look for the board with letter keys.',
      correctFeedback: 'Yes! The keyboard has keys to type words.',
    },
    wrongPictureAdvice: 'Repeat sign-to-picture activity: Watch how both hands gesture typing on a flat desk.',
    wrongSpellingAdvice: 'Repeat keyboard practice: Follow the letters K-E-Y-B-O-A-R-D step by step.',
    wrongMeaningAdvice: 'Repeat simple meaning: A keyboard lets you type words on the computer.',
    successRecommendation: 'Ready to continue to the next word: MOUSE',
  },
  mouse: {
    id: 'mouse',
    word: 'MOUSE',
    pictureUrl: APPROVED_COMPUTER_WORDS.mouse.imageUrl,
    signVideoUrl: APPROVED_COMPUTER_WORDS.mouse.signVideoUrl || '',
    vocabularySignVideoUrl: APPROVED_COMPUTER_WORDS.mouse.vocabularySignVideoUrl || '',
    vocabularySignPosterUrl: '/images/hardware/mouse.jpg',
    signedMeaningVideoUrl: APPROVED_COMPUTER_WORDS.mouse.signedMeaningVideoUrl || '',
    signedMeaningPosterUrl: '/images/hardware/mouse.jpg',
    signedMeaningText: APPROVED_COMPUTER_WORDS.mouse.signedMeaningExplanation || '',
    simpleMeaning: APPROVED_COMPUTER_WORDS.mouse.simpleMeaning,
    exampleSentence: APPROVED_COMPUTER_WORDS.mouse.exampleSentence,
    fingerspelling: APPROVED_COMPUTER_WORDS.mouse.fingerspell,
    regionalVariant: APPROVED_COMPUTER_WORDS.mouse.regionalVariant || 'Nigerian Sign Language',
    reviewedBy: APPROVED_COMPUTER_WORDS.mouse.reviewedBy || 'Acclusivo Deaf Review Team',
    visualStoryFrames: APPROVED_COMPUTER_WORDS.mouse.visualStoryFrames || [],
    meaningQuestion: {
      questionText: 'Which computer part do you move with your hand to click on the screen?',
      options: [
        { id: 'opt-mouse', label: 'Mouse', imageUrl: '/images/hardware/mouse.jpg', isCorrect: true },
        { id: 'opt-monitor', label: 'Monitor', imageUrl: '/images/hardware/monitor.jpg', isCorrect: false },
        { id: 'opt-keyboard', label: 'Keyboard', imageUrl: '/images/hardware/keyboard.jpg', isCorrect: false },
      ],
      wrongFeedback: 'Not yet. Look for the small handheld device you click.',
      correctFeedback: 'Yes! The mouse points and clicks items on screen.',
    },
    wrongPictureAdvice: 'Repeat sign-to-picture activity: Observe the finger clicking gesture.',
    wrongSpellingAdvice: 'Repeat keyboard practice: Spell M-O-U-S-E carefully.',
    wrongMeaningAdvice: 'Repeat simple meaning: The mouse points and clicks items on screen.',
    successRecommendation: 'Ready to continue to the next word: MONITOR',
  },
  monitor: {
    id: 'monitor',
    word: 'MONITOR',
    pictureUrl: APPROVED_COMPUTER_WORDS.monitor.imageUrl,
    signVideoUrl: APPROVED_COMPUTER_WORDS.monitor.signVideoUrl || '',
    vocabularySignVideoUrl: APPROVED_COMPUTER_WORDS.monitor.vocabularySignVideoUrl || '',
    vocabularySignPosterUrl: '/images/hardware/monitor.jpg',
    signedMeaningVideoUrl: APPROVED_COMPUTER_WORDS.monitor.signedMeaningVideoUrl || '',
    signedMeaningPosterUrl: '/images/hardware/monitor.jpg',
    signedMeaningText: APPROVED_COMPUTER_WORDS.monitor.signedMeaningExplanation || '',
    simpleMeaning: APPROVED_COMPUTER_WORDS.monitor.simpleMeaning,
    exampleSentence: APPROVED_COMPUTER_WORDS.monitor.exampleSentence,
    fingerspelling: APPROVED_COMPUTER_WORDS.monitor.fingerspell,
    regionalVariant: APPROVED_COMPUTER_WORDS.monitor.regionalVariant || 'Nigerian Sign Language',
    reviewedBy: APPROVED_COMPUTER_WORDS.monitor.reviewedBy || 'Acclusivo Deaf Review Team',
    visualStoryFrames: APPROVED_COMPUTER_WORDS.monitor.visualStoryFrames || [],
    meaningQuestion: {
      questionText: 'Which computer part is the screen that shows your lesson and pictures?',
      options: [
        { id: 'opt-monitor', label: 'Monitor', imageUrl: '/images/hardware/monitor.jpg', isCorrect: true },
        { id: 'opt-mouse', label: 'Mouse', imageUrl: '/images/hardware/mouse.jpg', isCorrect: false },
        { id: 'opt-webcam', label: 'Webcam', imageUrl: '/images/hardware/webcam.jpg', isCorrect: false },
      ],
      wrongFeedback: 'Not yet. Look for the large glass screen display.',
      correctFeedback: 'Yes! The monitor shows pictures and sign lessons.',
    },
    wrongPictureAdvice: 'Repeat sign-to-picture activity: Notice the rectangular screen shape traced in the air.',
    wrongSpellingAdvice: 'Repeat keyboard practice: Spell M-O-N-I-T-O-R on the keyboard.',
    wrongMeaningAdvice: 'Repeat simple meaning: The monitor is the screen that shows pictures and lessons.',
    successRecommendation: 'Congratulations! You completed all 4 foundational computer words.',
  },
};

/**
 * Initial Simulated Pitch Help Queue Request (P0 & P1)
 * Aligns with Pitch specifications:
 * - Learner: Demo Learner
 * - Lesson: Computer Basics
 * - Word: Webcam
 * - Difficulty: Meaning
 * - Attempts: 2
 * - Preferred support: Short supervised video call
 * - Approval: Parent approved
 * - Status: Waiting for facilitator
 */
export const INITIAL_HELP_REQUESTS: LearnerHelpRequest[] = [
  {
    id: 'req-pitch-webcam-1',
    learnerId: 'user-student-1',
    learnerName: 'Demo Learner (Amina)',
    lessonTitle: 'Computer Basics',
    word: 'Webcam',
    difficultyStage: 'meaning',
    difficultyDescription: 'Struggled with written sentence connection after watching sign; viewed Show Me visual story.',
    attemptsCount: 2,
    showMeViewed: true,
    preferredSupport: 'short_video_call',
    approvalStatus: 'parent_approved',
    approvalContact: 'Parent / Guardian Confirmed via Device',
    status: 'waiting_for_facilitator',
    requestedAt: '2026-10-13T10:15:00Z',
    facilitatorNotes: 'Pitch demonstration request awaiting supervised facilitator connection.',
  },
];

/**
 * In-Memory Help Request Store
 */
let inMemoryHelpRequests: LearnerHelpRequest[] = [...INITIAL_HELP_REQUESTS];

export function getHelpRequests(): LearnerHelpRequest[] {
  return inMemoryHelpRequests;
}

export function submitHelpRequest(
  request: Omit<LearnerHelpRequest, 'id' | 'requestedAt' | 'status'>
): LearnerHelpRequest {
  const newReq: LearnerHelpRequest = {
    ...request,
    id: `req-${Date.now()}`,
    requestedAt: new Date().toISOString(),
    status: 'waiting_for_facilitator',
  };
  inMemoryHelpRequests.unshift(newReq);
  return newReq;
}

export function updateHelpRequestStatus(
  id: string,
  status: LearnerHelpRequest['status'],
  notes?: string
): boolean {
  const req = inMemoryHelpRequests.find((r) => r.id === id);
  if (req) {
    req.status = status;
    if (notes) req.facilitatorNotes = notes;
    if (status === 'resolved') req.resolvedAt = new Date().toISOString();
    return true;
  }
  return false;
}

/**
 * Lookup function enforcing AI & Library safety boundaries
 */
export function getApprovedWord(term: string): ApprovedVocabularyItem | null {
  if (!term) return null;
  const normalized = term.trim().toLowerCase();
  return APPROVED_COMPUTER_WORDS[normalized] || null;
}
