import { ApprovedVocabularyItem } from './types';

/**
 * Approved Vocabulary Store for DeafLMS MVP
 * 
 * Strict boundary rules:
 * 1. Only words in this catalog have approved sign language content.
 * 2. All signs are reviewed by Deaf reviewers with explicit status, language, and reviewer metadata.
 * 3. Any unapproved word requested via AI or search must NEVER have sign handshapes or movements hallucinated.
 */
export const HERO_SIGN_INTRO_VIDEO_URL = 'https://www.youtube.com/watch?v=By5O5IGPNBU';

export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export const APPROVED_COMPUTER_WORDS: Record<string, ApprovedVocabularyItem> = {
  webcam: {
    id: 'vocab-webcam',
    word: 'Webcam',
    simpleMeaning: 'A webcam is a small camera connected to a computer. It lets people see you during a video call.',
    exampleSentence: 'I use the webcam for my online class.',
    imageUrl: '/images/hardware/webcam.jpg',
    signVideoUrl: 'https://www.youtube.com/watch?v=GZvX_Q9si5M',
    signStillUrl: '/images/hardware/webcam.jpg',
    signLanguage: 'NSL',
    regionalVariant: 'Standard Nigerian Sign Language (School & Tech contexts)',
    reviewStatus: 'approved',
    reviewedBy: 'Acclusivo Deaf Review Team (Abuja, Nigeria)',
    reviewedAt: '2026-03-01',
    reviewNote: 'Reviewed and verified for clear visibility of signer hands, face, and chest space.',
    fingerspell: 'W E B C A M',
  },
  keyboard: {
    id: 'vocab-keyboard',
    word: 'Keyboard',
    simpleMeaning: 'A keyboard is a board with alphabet letters and numbers. It lets you type words on the computer.',
    exampleSentence: 'I type my homework on the keyboard.',
    imageUrl: '/images/hardware/keyboard.jpg',
    signVideoUrl: 'https://www.youtube.com/watch?v=SLwR5SNhS_8',
    signStillUrl: '/images/hardware/keyboard.jpg',
    signLanguage: 'NSL',
    regionalVariant: 'Standard Nigerian Sign Language',
    reviewStatus: 'approved',
    reviewedBy: 'Acclusivo Deaf Review Team (Abuja, Nigeria)',
    reviewedAt: '2026-03-01',
    reviewNote: 'Verified sign video showing dual-hand horizontal typing plane.',
    fingerspell: 'K E Y B O A R D',
  },
  mouse: {
    id: 'vocab-mouse',
    word: 'Mouse',
    simpleMeaning: 'A mouse is a small device you move with your hand. It lets you point and click items on the screen.',
    exampleSentence: 'I click the button using the mouse.',
    imageUrl: '/images/hardware/mouse.jpg',
    signVideoUrl: 'https://www.youtube.com/watch?v=lD-V5ThBrNs',
    signStillUrl: '/images/hardware/mouse.jpg',
    signLanguage: 'NSL',
    regionalVariant: 'Standard Nigerian Sign Language',
    reviewStatus: 'approved',
    reviewedBy: 'Acclusivo Deaf Review Team (Abuja, Nigeria)',
    reviewedAt: '2026-03-01',
    reviewNote: 'Verified sign demonstration mimicking index finger clicking on horizontal device.',
    fingerspell: 'M O U S E',
  },
  monitor: {
    id: 'vocab-monitor',
    word: 'Monitor',
    simpleMeaning: 'A monitor is the screen that shows pictures, words and videos on the computer.',
    exampleSentence: 'I watch my sign language teacher on the monitor.',
    imageUrl: '/images/hardware/monitor.jpg',
    signVideoUrl: 'https://www.youtube.com/watch?v=Bm0W3K_nEFM',
    signStillUrl: '/images/hardware/monitor.jpg',
    signLanguage: 'NSL',
    regionalVariant: 'Standard Nigerian Sign Language',
    reviewStatus: 'approved',
    reviewedBy: 'Acclusivo Deaf Review Team (Abuja, Nigeria)',
    reviewedAt: '2026-03-01',
    reviewNote: 'Verified sign video framing screen boundary in upper chest space.',
    fingerspell: 'M O N I T O R',
  },
};

export interface DemoStepItem {
  id: string;
  word: string;
  pictureUrl: string;
  signVideoUrl: string;
  simpleMeaning: string;
  exampleSentence: string;
  meaningQuestion: {
    questionText: string;
    options: { id: string; label: string; isCorrect: boolean }[];
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
    simpleMeaning: APPROVED_COMPUTER_WORDS.webcam.simpleMeaning,
    exampleSentence: APPROVED_COMPUTER_WORDS.webcam.exampleSentence,
    meaningQuestion: {
      questionText: 'Which computer part lets another person see you during a video call?',
      options: [
        { id: 'opt-webcam', label: 'Webcam', isCorrect: true },
        { id: 'opt-keyboard', label: 'Keyboard', isCorrect: false },
        { id: 'opt-mouse', label: 'Mouse', isCorrect: false },
      ],
    },
    wrongPictureAdvice: 'Repeat sign-to-picture activity: Look closely at the camera lens in the sign video.',
    wrongSpellingAdvice: 'Repeat keyboard practice: Notice the 6 letters W-E-B-C-A-M on the keys.',
    wrongMeaningAdvice: 'Repeat the simple meaning and example: Remember, a webcam lets people see you.',
    successRecommendation: 'Ready to continue to the next word: KEYBOARD',
  },
  keyboard: {
    id: 'keyboard',
    word: 'KEYBOARD',
    pictureUrl: APPROVED_COMPUTER_WORDS.keyboard.imageUrl,
    signVideoUrl: APPROVED_COMPUTER_WORDS.keyboard.signVideoUrl || '',
    simpleMeaning: APPROVED_COMPUTER_WORDS.keyboard.simpleMeaning,
    exampleSentence: APPROVED_COMPUTER_WORDS.keyboard.exampleSentence,
    meaningQuestion: {
      questionText: 'Which computer part has alphabet letter keys to type words?',
      options: [
        { id: 'opt-keyboard', label: 'Keyboard', isCorrect: true },
        { id: 'opt-webcam', label: 'Webcam', isCorrect: false },
        { id: 'opt-monitor', label: 'Monitor', isCorrect: false },
      ],
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
    simpleMeaning: APPROVED_COMPUTER_WORDS.mouse.simpleMeaning,
    exampleSentence: APPROVED_COMPUTER_WORDS.mouse.exampleSentence,
    meaningQuestion: {
      questionText: 'Which computer part do you move with your hand to click on the screen?',
      options: [
        { id: 'opt-mouse', label: 'Mouse', isCorrect: true },
        { id: 'opt-monitor', label: 'Monitor', isCorrect: false },
        { id: 'opt-keyboard', label: 'Keyboard', isCorrect: false },
      ],
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
    simpleMeaning: APPROVED_COMPUTER_WORDS.monitor.simpleMeaning,
    exampleSentence: APPROVED_COMPUTER_WORDS.monitor.exampleSentence,
    meaningQuestion: {
      questionText: 'Which computer part is the screen that shows your lesson and pictures?',
      options: [
        { id: 'opt-monitor', label: 'Monitor', isCorrect: true },
        { id: 'opt-mouse', label: 'Mouse', isCorrect: false },
        { id: 'opt-webcam', label: 'Webcam', isCorrect: false },
      ],
    },
    wrongPictureAdvice: 'Repeat sign-to-picture activity: Notice the rectangular screen shape traced in the air.',
    wrongSpellingAdvice: 'Repeat keyboard practice: Spell M-O-N-I-T-O-R on the keyboard.',
    wrongMeaningAdvice: 'Repeat simple meaning: The monitor is the screen that shows pictures and lessons.',
    successRecommendation: 'Congratulations! You completed all 4 foundational computer words.',
  },
};

/**
 * Lookup function enforcing AI & Library safety boundaries
 */
export function getApprovedWord(term: string): ApprovedVocabularyItem | null {
  if (!term) return null;
  const normalized = term.trim().toLowerCase();
  return APPROVED_COMPUTER_WORDS[normalized] || null;
}
