// Deaf LMS — Visual Fingerspelling Handshape Library
// Grounded in authentic ASL handshape imagery from AnySign (https://www.anysign.app/en/asl-alphabet)
// with full support for custom uploaded teacher/school/regional photos.

export interface SignLetterData {
  letter: string;
  name: string;
  handshapeDescription: string;
  fingersSummary: string;
  imagePath: string; // AnySign official WebP image path
  svgPath: string;   // High-contrast SVG vector fallback
}

// Complete ASL Alphabet data with AnySign handshape images
export const STANDARD_ALPHABET_SIGNS: Record<string, SignLetterData> = {
  A: {
    letter: 'A',
    name: 'Fist with thumb resting beside',
    handshapeDescription: 'Fingers curled into a tight fist, thumb resting upright along the side of the index finger.',
    fingersSummary: 'Curled fingers, upright thumb along side',
    imagePath: '/images/asl/asl-alphabet-letter-a.webp',
    svgPath: '<rect x="18" y="24" width="28" height="32" rx="8" fill="#4f46e5" fill-opacity="0.15" stroke="#4f46e5" stroke-width="3"/><circle cx="22" cy="38" r="7" fill="#818cf8"/><rect x="24" y="22" width="20" height="12" rx="6" fill="#4f46e5"/>',
  },
  B: {
    letter: 'B',
    name: 'Flat hand, thumb tucked across',
    handshapeDescription: 'Four fingers held straight and upright together, thumb folded flat across the front of the palm.',
    fingersSummary: '4 straight fingers, thumb across palm',
    imagePath: '/images/asl/asl-alphabet-letter-b.webp',
    svgPath: '<rect x="20" y="10" width="24" height="46" rx="6" fill="#4f46e5" fill-opacity="0.15" stroke="#4f46e5" stroke-width="3"/><line x1="26" y1="12" x2="26" y2="34" stroke="#4f46e5" stroke-width="2"/><line x1="32" y1="12" x2="32" y2="34" stroke="#4f46e5" stroke-width="2"/><line x1="38" y1="12" x2="38" y2="34" stroke="#4f46e5" stroke-width="2"/><path d="M18 42 C 24 38, 36 38, 40 44" stroke="#818cf8" stroke-width="4" stroke-linecap="round"/>',
  },
  C: {
    letter: 'C',
    name: 'Curved C-shape hand',
    handshapeDescription: 'Fingers arched curved downward and thumb curved below, forming the clear shape of letter C.',
    fingersSummary: 'Curved arch like letter C',
    imagePath: '/images/asl/asl-alphabet-letter-c.webp',
    svgPath: '<path d="M 44 18 C 22 14, 16 50, 44 48" fill="none" stroke="#4f46e5" stroke-width="8" stroke-linecap="round"/>',
  },
  D: {
    letter: 'D',
    name: 'Index upright, circular O-base',
    handshapeDescription: 'Index finger pointing straight up, while middle, ring, and pinky touch the thumb to form a circle.',
    fingersSummary: '1 index upright, O-circle below',
    imagePath: '/images/asl/asl-alphabet-letter-d.webp',
    svgPath: '<rect x="28" y="10" width="8" height="34" rx="4" fill="#4f46e5"/><circle cx="26" cy="40" r="12" fill="#4f46e5" fill-opacity="0.2" stroke="#4f46e5" stroke-width="3"/>',
  },
  E: {
    letter: 'E',
    name: 'Clawed fingertips curled over thumb',
    handshapeDescription: 'All four fingertips curved down tightly, resting directly on top of the tucked thumb.',
    fingersSummary: 'Curled tips resting on tucked thumb',
    imagePath: '/images/asl/asl-alphabet-letter-e.webp',
    svgPath: '<rect x="18" y="24" width="28" height="28" rx="8" fill="#4f46e5" fill-opacity="0.15" stroke="#4f46e5" stroke-width="3"/><line x1="22" y1="30" x2="42" y2="30" stroke="#4f46e5" stroke-width="4" stroke-linecap="round"/><line x1="22" y1="38" x2="42" y2="38" stroke="#818cf8" stroke-width="4" stroke-linecap="round"/>',
  },
  F: {
    letter: 'F',
    name: 'OK pinch circle, 3 fingers standing',
    handshapeDescription: 'Index finger and thumb touch tips in a circle; middle, ring, and pinky extended upright.',
    fingersSummary: 'Index-thumb pinch with 3 fingers standing',
    imagePath: '/images/asl/asl-alphabet-letter-f.webp',
    svgPath: '<circle cx="24" cy="38" r="8" fill="#4f46e5" fill-opacity="0.2" stroke="#4f46e5" stroke-width="3"/><rect x="30" y="12" width="6" height="32" rx="3" fill="#4f46e5"/><rect x="38" y="14" width="6" height="30" rx="3" fill="#4f46e5"/><rect x="46" y="18" width="5" height="26" rx="2.5" fill="#4f46e5"/>',
  },
  G: {
    letter: 'G',
    name: 'Index and thumb pointing sideways',
    handshapeDescription: 'Index finger points horizontally sideways, thumb extends parallel with a small gap.',
    fingersSummary: 'Horizontal index finger pointing sideways',
    imagePath: '/images/asl/asl-alphabet-letter-g.webp',
    svgPath: '<rect x="16" y="24" width="34" height="8" rx="4" fill="#4f46e5"/><rect x="16" y="36" width="24" height="8" rx="4" fill="#818cf8"/>',
  },
  H: {
    letter: 'H',
    name: 'Two horizontal fingers together',
    handshapeDescription: 'Index and middle fingers held straight and together horizontally, pointing sideways.',
    fingersSummary: '2 fingers extended horizontally',
    imagePath: '/images/asl/asl-alphabet-letter-h.webp',
    svgPath: '<rect x="14" y="22" width="38" height="7" rx="3.5" fill="#4f46e5"/><rect x="14" y="32" width="38" height="7" rx="3.5" fill="#4f46e5"/>',
  },
  I: {
    letter: 'I',
    name: 'Pinky finger straight up',
    handshapeDescription: 'Fingers curled into a fist with only the pinky finger pointing straight up, thumb folded over.',
    fingersSummary: 'Single pinky finger pointing straight up',
    imagePath: '/images/asl/asl-alphabet-letter-i.webp',
    svgPath: '<rect x="38" y="10" width="7" height="46" rx="3.5" fill="#4f46e5"/><rect x="16" y="26" width="24" height="30" rx="6" fill="#4f46e5" fill-opacity="0.2" stroke="#4f46e5" stroke-width="2"/>',
  },
  J: {
    letter: 'J',
    name: 'Pinky tracing a J hook curve',
    handshapeDescription: 'Pinky finger starts upright and traces the curved hook of the letter J in the air.',
    fingersSummary: 'Pinky finger drawing a J hook motion',
    imagePath: '/images/asl/asl-alphabet-letter-j.webp',
    svgPath: '<path d="M 38 12 L 38 42 C 38 52, 22 52, 20 42" fill="none" stroke="#4f46e5" stroke-width="7" stroke-linecap="round"/>',
  },
  K: {
    letter: 'K',
    name: 'V shape with thumb in between',
    handshapeDescription: 'Index and middle finger form an upright V; thumb is held upright between them.',
    fingersSummary: 'V-split fingers with thumb between them',
    imagePath: '/images/asl/asl-alphabet-letter-k.webp',
    svgPath: '<rect x="20" y="12" width="7" height="42" rx="3.5" transform="rotate(-15 20 12)" fill="#4f46e5"/><rect x="34" y="12" width="7" height="42" rx="3.5" transform="rotate(15 34 12)" fill="#4f46e5"/><circle cx="28" cy="34" r="6" fill="#818cf8"/>',
  },
  L: {
    letter: 'L',
    name: 'Index and thumb forming letter L',
    handshapeDescription: 'Index finger pointing straight up and thumb pointing horizontally, forming an L shape.',
    fingersSummary: 'Clear L shape with index & thumb',
    imagePath: '/images/asl/asl-alphabet-letter-l.webp',
    svgPath: '<rect x="20" y="12" width="8" height="42" rx="4" fill="#4f46e5"/><rect x="20" y="46" width="34" height="8" rx="4" fill="#4f46e5"/>',
  },
  M: {
    letter: 'M',
    name: 'Three fingers over thumb',
    handshapeDescription: 'Index, middle, and ring fingers folded over the thumb, which peeks between ring and pinky.',
    fingersSummary: '3 fingers draped over thumb',
    imagePath: '/images/asl/asl-alphabet-letter-m.webp',
    svgPath: '<rect x="18" y="24" width="30" height="28" rx="6" fill="#4f46e5" fill-opacity="0.15" stroke="#4f46e5" stroke-width="3"/><circle cx="24" cy="24" r="4" fill="#4f46e5"/><circle cx="32" cy="24" r="4" fill="#4f46e5"/><circle cx="40" cy="24" r="4" fill="#4f46e5"/>',
  },
  N: {
    letter: 'N',
    name: 'Two fingers over thumb',
    handshapeDescription: 'Index and middle fingers folded down over the thumb, which peeks between middle and ring.',
    fingersSummary: '2 fingers draped over thumb',
    imagePath: '/images/asl/asl-alphabet-letter-n.webp',
    svgPath: '<rect x="18" y="24" width="30" height="28" rx="6" fill="#4f46e5" fill-opacity="0.15" stroke="#4f46e5" stroke-width="3"/><circle cx="26" cy="24" r="5" fill="#4f46e5"/><circle cx="38" cy="24" r="5" fill="#4f46e5"/>',
  },
  O: {
    letter: 'O',
    name: 'All fingertips touching thumb in O ring',
    handshapeDescription: 'All four fingertips curved to touch the tip of the curved thumb, forming an O.',
    fingersSummary: 'Complete O ring circle',
    imagePath: '/images/asl/asl-alphabet-letter-o.webp',
    svgPath: '<circle cx="32" cy="32" r="18" fill="none" stroke="#4f46e5" stroke-width="8"/>',
  },
  P: {
    letter: 'P',
    name: 'Downwards K shape',
    handshapeDescription: 'Similar to K, with index pointing forward/down and middle finger bent downward, thumb between.',
    fingersSummary: 'Downward pointing K handshape',
    imagePath: '/images/asl/asl-alphabet-letter-p.webp',
    svgPath: '<rect x="18" y="20" width="7" height="36" rx="3.5" fill="#4f46e5"/><circle cx="32" cy="28" r="9" fill="#4f46e5" fill-opacity="0.2" stroke="#4f46e5" stroke-width="3"/>',
  },
  Q: {
    letter: 'Q',
    name: 'Downwards G pinch',
    handshapeDescription: 'Index finger and thumb pointing downward like a downward pinch, other fingers curled.',
    fingersSummary: 'Downwards index and thumb pinch',
    imagePath: '/images/asl/asl-alphabet-letter-q.webp',
    svgPath: '<rect x="22" y="20" width="7" height="34" rx="3.5" fill="#4f46e5"/><rect x="32" y="20" width="7" height="24" rx="3.5" fill="#818cf8"/>',
  },
  R: {
    letter: 'R',
    name: 'Crossed fingers (index and middle)',
    handshapeDescription: 'Index finger and middle finger crossed over each other like "fingers crossed" for good luck.',
    fingersSummary: 'Crossed index and middle fingers',
    imagePath: '/images/asl/asl-alphabet-letter-r.webp',
    svgPath: '<path d="M 26 12 L 36 50 M 36 12 L 26 50" stroke="#4f46e5" stroke-width="6" stroke-linecap="round"/>',
  },
  S: {
    letter: 'S',
    name: 'Fist with thumb across front',
    handshapeDescription: 'Tightly closed fist with the thumb wrapped firmly across the front of the curled fingers.',
    fingersSummary: 'Fist with thumb wrapped across front',
    imagePath: '/images/asl/asl-alphabet-letter-s.webp',
    svgPath: '<rect x="18" y="20" width="28" height="34" rx="8" fill="#4f46e5" fill-opacity="0.15" stroke="#4f46e5" stroke-width="3"/><rect x="16" y="30" width="32" height="12" rx="6" fill="#4f46e5"/>',
  },
  T: {
    letter: 'T',
    name: 'Thumb between index and middle',
    handshapeDescription: 'Fist with thumb tucked between index and middle fingers, poking out slightly.',
    fingersSummary: 'Thumb tucked under index finger',
    imagePath: '/images/asl/asl-alphabet-letter-t.webp',
    svgPath: '<rect x="18" y="20" width="28" height="34" rx="8" fill="#4f46e5" fill-opacity="0.15" stroke="#4f46e5" stroke-width="3"/><circle cx="28" cy="24" r="5" fill="#818cf8"/>',
  },
  U: {
    letter: 'U',
    name: 'Two upright fingers held together',
    handshapeDescription: 'Index and middle fingers held straight up and pressed tightly together side-by-side.',
    fingersSummary: '2 upright fingers held together',
    imagePath: '/images/asl/asl-alphabet-letter-u.webp',
    svgPath: '<rect x="22" y="10" width="9" height="42" rx="4" fill="#4f46e5"/><rect x="33" y="10" width="9" height="42" rx="4" fill="#4f46e5"/>',
  },
  V: {
    letter: 'V',
    name: 'Peace sign / V shape separated',
    handshapeDescription: 'Index and middle fingers held straight up and spread apart in a clear V shape.',
    fingersSummary: 'V-sign with 2 fingers spread apart',
    imagePath: '/images/asl/asl-alphabet-letter-v.webp',
    svgPath: '<rect x="18" y="10" width="7" height="44" rx="3.5" transform="rotate(-18 18 10)" fill="#4f46e5"/><rect x="38" y="10" width="7" height="44" rx="3.5" transform="rotate(18 38 10)" fill="#4f46e5"/>',
  },
  W: {
    letter: 'W',
    name: 'Three upright fingers spread in W',
    handshapeDescription: 'Index, middle, and ring fingers spread apart pointing straight up, thumb holds pinky down.',
    fingersSummary: '3 fingers spread upright in W shape',
    imagePath: '/images/asl/asl-alphabet-letter-w.webp',
    svgPath: '<rect x="16" y="12" width="7" height="42" rx="3.5" transform="rotate(-20 16 12)" fill="#4f46e5"/><rect x="28" y="10" width="7" height="44" rx="3.5" fill="#4f46e5"/><rect x="40" y="12" width="7" height="42" rx="3.5" transform="rotate(20 40 12)" fill="#4f46e5"/>',
  },
  X: {
    letter: 'X',
    name: 'Index finger curled like a hook',
    handshapeDescription: 'Fist with index finger bent into a curved hook, reminiscent of Captain Hook.',
    fingersSummary: 'Curved hook index finger',
    imagePath: '/images/asl/asl-alphabet-letter-x.webp',
    svgPath: '<path d="M 24 48 L 24 24 C 24 14, 38 14, 38 24 L 38 30" fill="none" stroke="#4f46e5" stroke-width="7" stroke-linecap="round"/>',
  },
  Y: {
    letter: 'Y',
    name: 'Thumb and pinky extended ("Hang Loose")',
    handshapeDescription: 'Thumb and pinky extended straight out to sides, three middle fingers curled into palm.',
    fingersSummary: 'Thumb and pinky extended out',
    imagePath: '/images/asl/asl-alphabet-letter-y.webp',
    svgPath: '<rect x="10" y="24" width="8" height="24" rx="4" transform="rotate(-40 10 24)" fill="#4f46e5"/><rect x="46" y="24" width="8" height="24" rx="4" transform="rotate(40 46 24)" fill="#4f46e5"/><rect x="20" y="28" width="24" height="26" rx="6" fill="#4f46e5" fill-opacity="0.2" stroke="#4f46e5" stroke-width="2"/>',
  },
  Z: {
    letter: 'Z',
    name: 'Index finger tracing letter Z',
    handshapeDescription: 'Index finger pointing forward, drawing the zigzag lines of letter Z through the air.',
    fingersSummary: 'Index finger drawing a Z zigzag',
    imagePath: '/images/asl/asl-alphabet-letter-z.webp',
    svgPath: '<path d="M 18 18 L 46 18 L 18 46 L 46 46" fill="none" stroke="#4f46e5" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>',
  },
};

const CUSTOM_SIGNS_STORAGE_KEY = 'deaflms_custom_fingerspell_images';

// Retrieve active sign image: custom uploaded photo, or official AnySign ASL photo, or SVG fallback
export function getSignImage(letter: string): {
  type: 'custom' | 'photo' | 'svg';
  value: string;
  details: SignLetterData;
} {
  const upper = letter.toUpperCase();
  const defaultData = STANDARD_ALPHABET_SIGNS[upper] || STANDARD_ALPHABET_SIGNS['A'];

  // Check if custom image uploaded for this letter
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
      console.warn('Could not read custom signs storage:', e);
    }
  }

  // Use official AnySign ASL WebP photo
  if (defaultData.imagePath) {
    return {
      type: 'photo',
      value: defaultData.imagePath,
      details: defaultData,
    };
  }

  // SVG Fallback
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

// Remove custom picture for a letter, reverting to AnySign ASL photo
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

// Reset all custom pictures back to AnySign ASL photos
export function resetAllCustomSignImages(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CUSTOM_SIGNS_STORAGE_KEY);
  } catch (e) {
    console.warn('Reset error:', e);
  }
}
