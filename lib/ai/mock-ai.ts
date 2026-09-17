import { SignyExplanation, AILessonGeneration, CourseCategory } from '../types';

export const MOCK_SIGNY_EXPLANATIONS: Record<string, SignyExplanation> = {
  webcam: {
    term: 'Webcam',
    simplifiedDefinition: 'A small camera on your computer that captures video of your signing hands and face.',
    visualAnalogy: 'Like a digital eye on your computer screen that lets your teacher see your hands signing across the internet.',
    fingerspell: 'W E B C A M',
    signGuide: {
      handshape: "Curved 'C' hand shape mimicking a circular camera lens",
      location: 'Held outward in signing space directly facing the webcam',
      movement: 'Twist slightly like focusing a camera lens, then point toward screen',
      facialExpression: 'Focused gaze forward into the camera lens',
    },
    visualPromptSuggestion: 'A computer screen with a glowing green webcam light showing smiling hands signing hello.',
  },
  keyboard: {
    term: 'Keyboard',
    simplifiedDefinition: 'The flat rectangular board with alphabet letter keys used to type words and message teachers.',
    visualAnalogy: 'Like a magic piano where each key presses a letter onto your glowing screen.',
    fingerspell: 'K E Y B O A R D',
    signGuide: {
      handshape: 'Both hands open with fingers bent and wiggling',
      location: 'Horizontal plane in front of stomach/waist height',
      movement: 'Rapid fluttering downward taps across the invisible desk',
      facialExpression: 'Neutral, looking slightly down at signing hands',
    },
    visualPromptSuggestion: 'Colorful mechanical keyboard with glowing RGB keys and ASL alphabet symbols.',
  },
  monitor: {
    term: 'Monitor (Screen)',
    simplifiedDefinition: 'The large visual display of the computer where storybooks, videos, and signs are shown.',
    visualAnalogy: 'Like a digital picture frame that moves and displays signing lessons.',
    fingerspell: 'M O N I T O R',
    signGuide: {
      handshape: "Both index fingers and thumbs form 'L' shapes",
      location: 'In front of chest',
      movement: 'Trace the top, sides, and bottom of a wide rectangle in the air',
      facialExpression: 'Attentive, eyes open wide',
    },
    visualPromptSuggestion: 'Wide crystal-clear computer monitor showing sign language video lesson with captions.',
  },
};

export function getMockSignyExplanation(term: string): SignyExplanation {
  const normalized = term.toLowerCase().trim();
  if (MOCK_SIGNY_EXPLANATIONS[normalized]) {
    return MOCK_SIGNY_EXPLANATIONS[normalized];
  }

  // Fallback dynamic generator
  const fingerspelling = term.toUpperCase().split('').join(' ');
  return {
    term,
    simplifiedDefinition: `A visual learning concept in sign language: '${term}'.`,
    visualAnalogy: `Think of ${term} as a clear visual image that connects to a physical handshape.`,
    fingerspell: fingerspelling,
    signGuide: {
      handshape: 'Open hand with thumb extended or dominant handshape',
      location: 'Center of neutral signing space in front of upper chest',
      movement: 'Gentle forward arc movement indicating clarity',
      facialExpression: 'Engaged and nodding slightly',
    },
    visualPromptSuggestion: `A clean visual illustration representing '${term}' with clear signing hand cues.`,
  };
}

export function getMockAILessonGeneration(topic: string, gradeLevel: string = 'Grade 3'): AILessonGeneration {
  return {
    lessonTitle: `${topic}: Sign Language & Visual Mastery`,
    description: `An engaging visual curriculum unit on ${topic}, designed for Deaf and Hard-of-Hearing students.`,
    gradeLevel,
    category: topic.toLowerCase().includes('computer') || topic.toLowerCase().includes('tech')
      ? 'Digital Literacy'
      : 'Reading & Literacy',
    vocabulary: [
      {
        word: `${topic} Item 1`,
        category: 'Core Vocabulary',
        signDescription: 'Form primary handshape and sign with outward movement.',
        visualIcon: 'star',
      },
      {
        word: `${topic} Item 2`,
        category: 'Core Vocabulary',
        signDescription: 'Both hands move in symmetry across the signing area.',
        visualIcon: 'sparkles',
      },
      {
        word: `${topic} Item 3`,
        category: 'Action Sign',
        signDescription: 'Dominant hand gestures toward the visual context anchor.',
        visualIcon: 'hand',
      },
    ],
    worksheet: {
      title: `${topic} Visual Challenge`,
      activityType: 'picture_to_sign',
      pairs: [
        {
          id: 'p-ai-1',
          label: `${topic} Part A`,
          pictureIcon: 'laptop',
          signHint: 'Two-hand symmetric sign',
          matchId: 'm-ai-1',
        },
        {
          id: 'p-ai-2',
          label: `${topic} Part B`,
          pictureIcon: 'book',
          signHint: 'Fingerspell anchor sign',
          matchId: 'm-ai-2',
        },
      ],
    },
  };
}
