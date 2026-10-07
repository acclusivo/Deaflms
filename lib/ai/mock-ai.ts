import { SignyExplanation, AILessonGeneration } from '../types';
import { APPROVED_COMPUTER_WORDS, getApprovedWord } from '../approved-vocabulary';

/**
 * Safe, Grounded Clarification Engine (Mock & Fallback)
 * 
 * Complies with Section 10 of DeafLMS Master Specification:
 * - AI must retrieve content from approved vocabulary list before answering.
 * - Never invent a sign.
 * - Never generate physical sign instructions (handshape/location/movement/expression).
 * - Never claim generated handshapes are NSL.
 * - Never diagnose a learner.
 * - Unapproved words return explicit safety disclaimer.
 */

// Dictionary of safe, simple written definitions for common unapproved words (NO SIGNS)
const UNAPPROVED_SAFE_DEFINITIONS: Record<string, string> = {
  photosynthesis: 'Photosynthesis is the way green plants use light from the sun to make food from water and air.',
  cryptocurrency: 'Cryptocurrency is digital money that exists only on computers and the internet.',
  internet: 'The internet is a global network that connects computers together so people can share information.',
  computer: 'A computer is an electronic machine that helps you work, write, draw, and communicate with others.',
  book: 'A book has pages with words and pictures that you read to learn or enjoy stories.',
  teacher: 'A teacher is a person who helps students learn new skills and ideas.',
  school: 'A school is a safe place where learners gather to study, make friends, and discover new things.',
};

const INAPPROPRIATE_KEYWORDS = ['kill', 'weapon', 'violence', 'hate', 'bomb', 'harm'];

export function getMockSignyExplanation(term: string): SignyExplanation {
  if (!term || !term.trim()) {
    return {
      term: '',
      isApprovedWord: false,
      simplifiedDefinition: 'Please enter a word to clarify.',
      fingerspell: '',
      signGuide: null,
      boundaryNotice: 'Please provide a valid vocabulary word.',
    };
  }

  const cleanTerm = term.trim();
  const lower = cleanTerm.toLowerCase();

  // Inappropriate content guardrail
  if (INAPPROPRIATE_KEYWORDS.some((bad) => lower.includes(bad))) {
    return {
      term: cleanTerm,
      isApprovedWord: false,
      simplifiedDefinition: 'This term cannot be displayed. DeafLMS is a safe, focused learning platform for children.',
      fingerspell: '',
      signGuide: null,
      boundaryNotice: 'Inappropriate or harmful request blocked by child safeguarding filter.',
    };
  }

  // 1. Check approved vocabulary store first
  const approvedItem = getApprovedWord(lower);

  if (approvedItem) {
    return {
      term: approvedItem.word,
      isApprovedWord: true,
      simplifiedDefinition: approvedItem.simpleMeaning,
      exampleSentence: approvedItem.exampleSentence,
      fingerspell: approvedItem.fingerspell,
      signVideoUrl: approvedItem.signVideoUrl,
      reviewStatus: approvedItem.reviewStatus,
      reviewedBy: approvedItem.reviewedBy,
      signLanguage: approvedItem.signLanguage,
      signGuide: null, // Strictly null: we do NOT generate arbitrary text descriptions
      boundaryNotice: undefined,
      visualPromptSuggestion: `Reviewed Nigerian Sign Language lesson for ${approvedItem.word}.`,
    };
  }

  // 2. Unapproved word processing
  // Must NOT generate handshape, location, movement, or facial expression
  const safeDefinition =
    UNAPPROVED_SAFE_DEFINITIONS[lower] ||
    `"${cleanTerm}" is a written word. Here is a simple meaning to help you understand its use in sentences.`;

  return {
    term: cleanTerm,
    isApprovedWord: false,
    simplifiedDefinition: safeDefinition,
    exampleSentence: undefined,
    fingerspell: cleanTerm.toUpperCase().split('').join(' '),
    signVideoUrl: undefined,
    reviewStatus: undefined,
    signLanguage: undefined,
    signGuide: null, // Strictly null: NEVER hallucinate signs!
    boundaryNotice:
      'This word is not yet in our reviewed sign library. I can give you a simple written meaning, but I cannot create or approve its Nigerian Sign Language sign. Ask your facilitator for the reviewed local sign.',
    visualPromptSuggestion: undefined,
  };
}

/**
 * Non-AI Offline Fallback
 * Guaranteed to return safe content even during total API/AI disconnection.
 */
export function getOfflineFallbackExplanation(term: string): SignyExplanation {
  const approved = getApprovedWord(term);
  if (approved) {
    return {
      term: approved.word,
      isApprovedWord: true,
      simplifiedDefinition: approved.simpleMeaning,
      exampleSentence: approved.exampleSentence,
      fingerspell: approved.fingerspell,
      signVideoUrl: approved.signVideoUrl,
      reviewStatus: approved.reviewStatus,
      reviewedBy: approved.reviewedBy,
      signLanguage: approved.signLanguage,
      signGuide: null,
      boundaryNotice: 'Offline Mode: Displaying pre-reviewed curriculum content.',
    };
  }

  return {
    term: term || 'Offline Word',
    isApprovedWord: false,
    simplifiedDefinition:
      'We cannot create a new explanation right now. Watch the approved lesson again or ask your facilitator for help.',
    fingerspell: (term || '').toUpperCase().split('').join(' '),
    signGuide: null,
    boundaryNotice:
      'We cannot create a new explanation right now. Watch the approved lesson again or ask your facilitator for help.',
  };
}

export function getMockAILessonGeneration(topic: string, gradeLevel: string = 'Grade 3'): AILessonGeneration {
  return {
    lessonTitle: `${topic}: Approved Visual Literacy Unit`,
    description: `Structured curriculum unit on ${topic}, designed for Deaf and Hard-of-Hearing students with human review safeguards.`,
    gradeLevel,
    category: topic.toLowerCase().includes('computer') || topic.toLowerCase().includes('tech')
      ? 'Digital Literacy'
      : 'Reading & Literacy',
    vocabulary: [
      {
        word: 'Webcam',
        category: 'Hardware',
        signDescription: 'Reviewed NSL sign available in library.',
        visualIcon: 'camera',
      },
      {
        word: 'Keyboard',
        category: 'Hardware',
        signDescription: 'Reviewed NSL sign available in library.',
        visualIcon: 'laptop',
      },
      {
        word: 'Monitor',
        category: 'Hardware',
        signDescription: 'Reviewed NSL sign available in library.',
        visualIcon: 'monitor',
      },
    ],
    worksheet: {
      title: `${topic} Visual Review`,
      activityType: 'picture_to_sign',
      pairs: [
        {
          id: 'p-ai-1',
          label: 'Webcam',
          pictureIcon: 'camera',
          signHint: 'Approved camera sign',
          matchId: 'm-ai-1',
        },
        {
          id: 'p-ai-2',
          label: 'Keyboard',
          pictureIcon: 'laptop',
          signHint: 'Approved typing sign',
          matchId: 'm-ai-2',
        },
      ],
    },
  };
}
