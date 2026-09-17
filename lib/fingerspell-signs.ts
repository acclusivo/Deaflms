// Deaf LMS — Visual Fingerspelling Handshape Library
// Generates accessible SVG diagrams for all 26 letters (A-Z) with support for custom uploaded teacher/facilitator photos.

export interface SignLetterData {
  letter: string;
  name: string;
  handshapeDescription: string;
  fingersSummary: string;
  svgPath: string; // High-contrast visual vector representation
}

// Visual handshape descriptions and SVG vectors for ASL / NSL alphabet
export const STANDARD_ALPHABET_SIGNS: Record<string, SignLetterData> = {
  A: {
    letter: 'A',
    name: 'Fist with thumb beside',
    handshapeDescription: 'Fist with fingers curled into palm, thumb resting straight along the side of the index finger.',
    fingersSummary: 'Curled 4 fingers, thumb upright along side',
    svgPath: '<rect x="18" y="24" width="28" height="32" rx="8" fill="#4f46e5" fill-opacity="0.15" stroke="#4f46e5" stroke-width="3"/><circle cx="22" cy="38" r="7" fill="#818cf8"/><rect x="24" y="22" width="20" height="12" rx="6" fill="#4f46e5"/>',
  },
  B: {
    letter: 'B',
    name: 'Flat hand, thumb tucked',
    handshapeDescription: 'Four fingers straight up side-by-side, thumb folded across the front of the palm.',
    fingersSummary: '4 fingers tall, thumb across palm',
    svgPath: '<rect x="20" y="10" width="24" height="46" rx="6" fill="#4f46e5" fill-opacity="0.15" stroke="#4f46e5" stroke-width="3"/><line x1="26" y1="12" x2="26" y2="34" stroke="#4f46e5" stroke-width="2"/><line x1="32" y1="12" x2="32" y2="34" stroke="#4f46e5" stroke-width="2"/><line x1="38" y1="12" x2="38" y2="34" stroke="#4f46e5" stroke-width="2"/><path d="M18 42 C 24 38, 36 38, 40 44" stroke="#818cf8" stroke-width="4" stroke-linecap="round"/>',
  },
  C: {
    letter: 'C',
    name: 'Curved C-shape',
    handshapeDescription: 'Fingers curved into an arch and thumb curved below, forming the letter C.',
    fingersSummary: 'Curved arch like letter C',
    svgPath: '<path d="M 44 18 C 22 14, 16 50, 44 48" fill="none" stroke="#4f46e5" stroke-width="8" stroke-linecap="round"/>',
  },
  D: {
    letter: 'D',
    name: 'Index pointing up, O-ring base',
    handshapeDescription: 'Index finger points straight up, middle, ring, and pinky curl to touch the thumb tip in an O ring.',
    fingersSummary: '1 index finger up, circle below',
    svgPath: '<rect x="28" y="10" width="8" height="34" rx="4" fill="#4f46e5"/><circle cx="26" cy="40" r="12" fill="#4f46e5" fill-opacity="0.2" stroke="#4f46e5" stroke-width="3"/>',
  },
  E: {
    letter: 'E',
    name: 'Clawed fingertips on thumb',
    handshapeDescription: 'All 4 fingertips curled down tightly, resting directly on top of the thumb.',
    fingersSummary: 'Curled fingers resting on thumb',
    svgPath: '<rect x="18" y="24" width="28" height="28" rx="8" fill="#4f46e5" fill-opacity="0.15" stroke="#4f46e5" stroke-width="3"/><line x1="22" y1="30" x2="42" y2="30" stroke="#4f46e5" stroke-width="4" stroke-linecap="round"/><line x1="22" y1="38" x2="42" y2="38" stroke="#818cf8" stroke-width="4" stroke-linecap="round"/>',
  },
  F: {
    letter: 'F',
    name: 'OK sign: index & thumb touch, 3 up',
    handshapeDescription: 'Index finger and thumb touch tips in a circle; middle, ring, and pinky fan straight up.',
    fingersSummary: 'Circle pinch with 3 fingers standing',
    svgPath: '<circle cx="24" cy="38" r="8" fill="#4f46e5" fill-opacity="0.2" stroke="#4f46e5" stroke-width="3"/><rect x="30" y="12" width="6" height="32" rx="3" fill="#4f46e5"/><rect x="38" y="14" width="6" height="30" rx="3" fill="#4f46e5"/><rect x="46" y="18" width="5" height="26" rx="2.5" fill="#4f46e5"/>',
  },
  G: {
    letter: 'G',
    name: 'Index and thumb pointing sideways',
    handshapeDescription: 'Index finger points horizontally, thumb extends parallel like a horizontal pinch.',
    fingersSummary: 'Horizontal index finger pointing sideways',
    svgPath: '<rect x="16" y="28" width="18" height="22" rx="6" fill="#4f46e5" fill-opacity="0.2"/><path d="M 28 32 L 50 32" stroke="#4f46e5" stroke-width="6" stroke-linecap="round"/><path d="M 28 42 L 44 42" stroke="#818cf8" stroke-width="5" stroke-linecap="round"/>',
  },
  H: {
    letter: 'H',
    name: 'Index and middle fingers sideways',
    handshapeDescription: 'Index and middle fingers extend together horizontally, other fingers curled in.',
    fingersSummary: 'Two fingers pointing horizontally',
    svgPath: '<rect x="16" y="26" width="16" height="24" rx="6" fill="#4f46e5" fill-opacity="0.2"/><path d="M 28 30 L 52 30" stroke="#4f46e5" stroke-width="5" stroke-linecap="round"/><path d="M 28 38 L 52 38" stroke="#4f46e5" stroke-width="5" stroke-linecap="round"/>',
  },
  I: {
    letter: 'I',
    name: 'Pinky finger straight up',
    handshapeDescription: 'Pinky finger extends straight up, other three fingers form a fist wrapped by thumb.',
    fingersSummary: 'Only pinky finger standing tall',
    svgPath: '<rect x="18" y="28" width="24" height="26" rx="8" fill="#4f46e5" fill-opacity="0.15" stroke="#4f46e5" stroke-width="3"/><rect x="36" y="12" width="6" height="32" rx="3" fill="#4f46e5"/>',
  },
  J: {
    letter: 'J',
    name: 'Pinky tracing a J curve',
    handshapeDescription: 'Pinky finger up, tracing a downward curve like the letter J in the air.',
    fingersSummary: 'Pinky tracing letter J hook',
    svgPath: '<rect x="18" y="28" width="22" height="24" rx="6" fill="#4f46e5" fill-opacity="0.15"/><path d="M 38 12 L 38 42 C 38 52, 24 52, 22 46" fill="none" stroke="#4f46e5" stroke-width="5" stroke-linecap="round"/>',
  },
  K: {
    letter: 'K',
    name: 'V shape with thumb in middle',
    handshapeDescription: 'Index finger straight up, middle finger forward, thumb placed between them.',
    fingersSummary: 'V-sign with thumb between index & middle',
    svgPath: '<rect x="24" y="12" width="6" height="36" rx="3" fill="#4f46e5"/><path d="M 28 34 L 44 20" stroke="#4f46e5" stroke-width="6" stroke-linecap="round"/><circle cx="28" cy="38" r="6" fill="#818cf8"/>',
  },
  L: {
    letter: 'L',
    name: 'L-shape with index & thumb',
    handshapeDescription: 'Index finger points straight up, thumb extends out at right angle forming an L.',
    fingersSummary: 'Letter L formed by index and thumb',
    svgPath: '<path d="M 24 12 L 24 46 L 48 46" fill="none" stroke="#4f46e5" stroke-width="7" stroke-linecap="round"/>',
  },
  M: {
    letter: 'M',
    name: 'Three fingers over thumb',
    handshapeDescription: 'Index, middle, and ring fingers folded over the thumb tip in a fist.',
    fingersSummary: '3 fingers draped over thumb',
    svgPath: '<rect x="18" y="24" width="28" height="30" rx="8" fill="#4f46e5" fill-opacity="0.15" stroke="#4f46e5" stroke-width="3"/><line x1="25" y1="24" x2="25" y2="40" stroke="#4f46e5" stroke-width="3"/><line x1="32" y1="24" x2="32" y2="40" stroke="#4f46e5" stroke-width="3"/><line x1="39" y1="24" x2="39" y2="40" stroke="#4f46e5" stroke-width="3"/><circle cx="32" cy="46" r="4" fill="#818cf8"/>',
  },
  N: {
    letter: 'N',
    name: 'Two fingers over thumb',
    handshapeDescription: 'Index and middle fingers folded over thumb tip, ring and pinky curled into palm.',
    fingersSummary: '2 fingers draped over thumb',
    svgPath: '<rect x="18" y="24" width="28" height="30" rx="8" fill="#4f46e5" fill-opacity="0.15" stroke="#4f46e5" stroke-width="3"/><line x1="28" y1="24" x2="28" y2="40" stroke="#4f46e5" stroke-width="4"/><line x1="36" y1="24" x2="36" y2="40" stroke="#4f46e5" stroke-width="4"/><circle cx="32" cy="46" r="4" fill="#818cf8"/>',
  },
  O: {
    letter: 'O',
    name: 'O-ring with all fingers',
    handshapeDescription: 'All fingers curved down to meet the thumb tip, creating an O circle shape.',
    fingersSummary: 'All fingers curved into letter O',
    svgPath: '<circle cx="32" cy="32" r="16" fill="#4f46e5" fill-opacity="0.15" stroke="#4f46e5" stroke-width="7"/>',
  },
  P: {
    letter: 'P',
    name: 'Downward K-shape',
    handshapeDescription: 'Like a letter K, but the hand is tilted downwards with index finger pointing down.',
    fingersSummary: 'Downward pointing K-sign',
    svgPath: '<rect x="24" y="22" width="6" height="34" rx="3" fill="#4f46e5"/><path d="M 28 32 L 44 44" stroke="#4f46e5" stroke-width="6" stroke-linecap="round"/><circle cx="28" cy="28" r="6" fill="#818cf8"/>',
  },
  Q: {
    letter: 'Q',
    name: 'Downward pointing index & thumb',
    handshapeDescription: 'Like a letter G, but pointing downwards toward the ground.',
    fingersSummary: 'Index & thumb pointing down',
    svgPath: '<path d="M 26 20 L 26 48" stroke="#4f46e5" stroke-width="6" stroke-linecap="round"/><path d="M 36 24 L 36 42" stroke="#818cf8" stroke-width="5" stroke-linecap="round"/>',
  },
  R: {
    letter: 'R',
    name: 'Crossed index & middle fingers',
    handshapeDescription: 'Middle finger crossed over index finger (like wishing for good luck).',
    fingersSummary: 'Crossed fingers (wishing pose)',
    svgPath: '<path d="M 26 12 L 36 48" stroke="#4f46e5" stroke-width="5" stroke-linecap="round"/><path d="M 36 12 L 26 48" stroke="#818cf8" stroke-width="5" stroke-linecap="round"/><rect x="20" y="32" width="24" height="20" rx="6" fill="#4f46e5" fill-opacity="0.2"/>',
  },
  S: {
    letter: 'S',
    name: 'Fist with thumb over front',
    handshapeDescription: 'Fist with all 4 fingers closed tightly and thumb wrapped across the front of the fingers.',
    fingersSummary: 'Fist with thumb locked across front',
    svgPath: '<circle cx="32" cy="34" r="16" fill="#4f46e5" fill-opacity="0.2" stroke="#4f46e5" stroke-width="3"/><rect x="20" y="28" width="24" height="10" rx="5" fill="#4f46e5"/>',
  },
  T: {
    letter: 'T',
    name: 'Thumb between index & middle',
    handshapeDescription: 'Fist with thumb tucked between index and middle fingers.',
    fingersSummary: 'Thumb popping between 1st & 2nd finger',
    svgPath: '<rect x="18" y="24" width="28" height="28" rx="8" fill="#4f46e5" fill-opacity="0.15" stroke="#4f46e5" stroke-width="3"/><circle cx="28" cy="28" r="6" fill="#818cf8"/><rect x="24" y="24" width="16" height="8" rx="4" fill="#4f46e5"/>',
  },
  U: {
    letter: 'U',
    name: 'Index & middle fingers straight together',
    handshapeDescription: 'Index and middle fingers extended straight up touching each other; thumb holds other two fingers.',
    fingersSummary: 'Two fingers straight up side-by-side',
    svgPath: '<rect x="24" y="12" width="7" height="36" rx="3.5" fill="#4f46e5"/><rect x="33" y="12" width="7" height="36" rx="3.5" fill="#4f46e5"/><rect x="18" y="34" width="28" height="18" rx="6" fill="#4f46e5" fill-opacity="0.2"/>',
  },
  V: {
    letter: 'V',
    name: 'Peace sign / V-shape',
    handshapeDescription: 'Index and middle fingers spread apart in a V peace sign; other fingers curled in.',
    fingersSummary: 'V-sign: two fingers spread apart',
    svgPath: '<path d="M 22 12 L 30 46" stroke="#4f46e5" stroke-width="6" stroke-linecap="round"/><path d="M 42 12 L 34 46" stroke="#4f46e5" stroke-width="6" stroke-linecap="round"/><rect x="20" y="34" width="24" height="18" rx="6" fill="#4f46e5" fill-opacity="0.2"/>',
  },
  W: {
    letter: 'W',
    name: 'Three fingers open in W shape',
    handshapeDescription: 'Index, middle, and ring fingers spread apart pointing up forming a W; thumb holds pinky.',
    fingersSummary: '3 fingers fanned like letter W',
    svgPath: '<path d="M 20 12 L 26 46" stroke="#4f46e5" stroke-width="5" stroke-linecap="round"/><path d="M 32 12 L 32 46" stroke="#4f46e5" stroke-width="5" stroke-linecap="round"/><path d="M 44 12 L 38 46" stroke="#4f46e5" stroke-width="5" stroke-linecap="round"/>',
  },
  X: {
    letter: 'X',
    name: 'Curved hooked index finger',
    handshapeDescription: 'Fist with index finger crooked like a hook (pirate hook gesture).',
    fingersSummary: 'Index finger curled like a hook',
    svgPath: '<rect x="18" y="28" width="26" height="24" rx="6" fill="#4f46e5" fill-opacity="0.15"/><path d="M 24 32 C 24 16, 40 16, 38 28" fill="none" stroke="#4f46e5" stroke-width="6" stroke-linecap="round"/>',
  },
  Y: {
    letter: 'Y',
    name: 'Thumb and pinky out (hang loose)',
    handshapeDescription: 'Thumb and pinky extended out, middle three fingers folded into palm (phone / shaka sign).',
    fingersSummary: 'Thumb and pinky outstretched',
    svgPath: '<path d="M 14 20 L 26 40" stroke="#4f46e5" stroke-width="6" stroke-linecap="round"/><path d="M 50 18 L 38 40" stroke="#4f46e5" stroke-width="6" stroke-linecap="round"/><rect x="24" y="32" width="16" height="20" rx="6" fill="#4f46e5" fill-opacity="0.2"/>',
  },
  Z: {
    letter: 'Z',
    name: 'Index finger drawing letter Z',
    handshapeDescription: 'Index finger extended, tracing the shape of the letter Z in the air.',
    fingersSummary: 'Index finger tracing letter Z',
    svgPath: '<path d="M 20 18 L 44 18 L 20 46 L 44 46" fill="none" stroke="#4f46e5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',
  },
};

const CUSTOM_SIGNS_STORAGE_KEY = 'deaflms_custom_fingerspell_images';

// Retrieve custom uploaded sign image or fall back to standard SVG
export function getSignImage(letter: string): { type: 'custom' | 'svg'; value: string; details: SignLetterData } {
  const upper = letter.toUpperCase();
  const defaultData = STANDARD_ALPHABET_SIGNS[upper] || STANDARD_ALPHABET_SIGNS['A'];

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(CUSTOM_SIGNS_STORAGE_KEY);
      if (stored) {
        const customMap = JSON.parse(stored);
        if (customMap[upper]) {
          return {
            type: 'custom',
            value: customMap[upper],
            details: defaultData,
          };
        }
      }
    } catch (e) {
      // Fallback
    }
  }

  return {
    type: 'svg',
    value: defaultData.svgPath,
    details: defaultData,
  };
}

// Upload/Save a custom picture for a specific letter (e.g. from local file or teacher photo)
export function saveCustomSignImage(letter: string, dataUrl: string): void {
  if (typeof window === 'undefined') return;
  try {
    const upper = letter.toUpperCase();
    const stored = localStorage.getItem(CUSTOM_SIGNS_STORAGE_KEY);
    const customMap = stored ? JSON.parse(stored) : {};
    customMap[upper] = dataUrl;
    localStorage.setItem(CUSTOM_SIGNS_STORAGE_KEY, JSON.stringify(customMap));
  } catch (e) {
    console.warn('Failed to save custom sign image:', e);
  }
}

// Remove custom picture for a letter, reverting to standard illustration
export function removeCustomSignImage(letter: string): void {
  if (typeof window === 'undefined') return;
  try {
    const upper = letter.toUpperCase();
    const stored = localStorage.getItem(CUSTOM_SIGNS_STORAGE_KEY);
    if (!stored) return;
    const customMap = JSON.parse(stored);
    delete customMap[upper];
    localStorage.setItem(CUSTOM_SIGNS_STORAGE_KEY, JSON.stringify(customMap));
  } catch (e) {
    console.warn('Failed to remove custom sign image:', e);
  }
}

// Get all letters that currently have custom pictures uploaded
export function getCustomUploadedLetters(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CUSTOM_SIGNS_STORAGE_KEY);
    if (!stored) return [];
    return Object.keys(JSON.parse(stored));
  } catch (e) {
    return [];
  }
}

// Reset all custom pictures back to default
export function resetAllCustomSignImages(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CUSTOM_SIGNS_STORAGE_KEY);
  } catch (e) {
    console.warn('Reset error:', e);
  }
}
