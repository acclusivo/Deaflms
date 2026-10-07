// Deaf LMS — Keyboard Curriculum & Finger Mapping Data
// Structured for Deaf learners to master touch typing progressively:
// 1. Left Hand Home Row: A S D F
// 2. Right Hand Home Row: J K L ;
// 3. Center Reach: G H
// 4. Home Row Combined Words
// 5. Approved Computer Words (Webcam, Keyboard, Mouse, Monitor)
// 6. Deaf Tech & Communication Words

export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'left-thumb'
  | 'right-thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface FingerColor {
  name: string;
  hex: string;
  bgClass: string;
  lightBgClass: string;
  borderClass: string;
  textClass: string;
  ringClass: string;
  glowClass: string;
}

export interface FingerDefinition {
  id: FingerId;
  hand: 'left' | 'right';
  name: string;
  handName: string;
  homeKey: string;
  reachKeys?: string[];
  assignedKeys: string[];
  color: FingerColor;
}

export const FINGER_DEFINITIONS: Record<FingerId, FingerDefinition> = {
  'left-pinky': {
    id: 'left-pinky',
    hand: 'left',
    name: 'Pinky',
    handName: 'Left Hand',
    homeKey: 'A',
    assignedKeys: ['Q', 'A', 'Z', '1', '`'],
    color: {
      name: 'Coral Pink',
      hex: '#F43F5E',
      bgClass: 'bg-rose-500',
      lightBgClass: 'bg-rose-50',
      borderClass: 'border-rose-500',
      textClass: 'text-rose-700',
      ringClass: 'ring-rose-400',
      glowClass: 'shadow-rose-500/50',
    },
  },
  'left-ring': {
    id: 'left-ring',
    hand: 'left',
    name: 'Ring',
    handName: 'Left Hand',
    homeKey: 'S',
    assignedKeys: ['W', 'S', 'X', '2'],
    color: {
      name: 'Amber Orange',
      hex: '#F97316',
      bgClass: 'bg-orange-500',
      lightBgClass: 'bg-orange-50',
      borderClass: 'border-orange-500',
      textClass: 'text-orange-700',
      ringClass: 'ring-orange-400',
      glowClass: 'shadow-orange-500/50',
    },
  },
  'left-middle': {
    id: 'left-middle',
    hand: 'left',
    name: 'Middle',
    handName: 'Left Hand',
    homeKey: 'D',
    assignedKeys: ['E', 'D', 'C', '3'],
    color: {
      name: 'Emerald Green',
      hex: '#10B981',
      bgClass: 'bg-emerald-500',
      lightBgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-500',
      textClass: 'text-emerald-700',
      ringClass: 'ring-emerald-400',
      glowClass: 'shadow-emerald-500/50',
    },
  },
  'left-index': {
    id: 'left-index',
    hand: 'left',
    name: 'Index',
    handName: 'Left Hand',
    homeKey: 'F',
    reachKeys: ['G'],
    assignedKeys: ['R', 'T', 'F', 'G', 'V', 'B', '4', '5'],
    color: {
      name: 'Sky Blue',
      hex: '#0EA5E9',
      bgClass: 'bg-sky-500',
      lightBgClass: 'bg-sky-50',
      borderClass: 'border-sky-500',
      textClass: 'text-sky-700',
      ringClass: 'ring-sky-400',
      glowClass: 'shadow-sky-500/50',
    },
  },
  'left-thumb': {
    id: 'left-thumb',
    hand: 'left',
    name: 'Thumb',
    handName: 'Left Hand',
    homeKey: 'SPACE',
    assignedKeys: [' '],
    color: {
      name: 'Royal Purple',
      hex: '#8B5CF6',
      bgClass: 'bg-purple-500',
      lightBgClass: 'bg-purple-50',
      borderClass: 'border-purple-500',
      textClass: 'text-purple-700',
      ringClass: 'ring-purple-400',
      glowClass: 'shadow-purple-500/50',
    },
  },
  'right-thumb': {
    id: 'right-thumb',
    hand: 'right',
    name: 'Thumb',
    handName: 'Right Hand',
    homeKey: 'SPACE',
    assignedKeys: [' '],
    color: {
      name: 'Royal Purple',
      hex: '#8B5CF6',
      bgClass: 'bg-purple-500',
      lightBgClass: 'bg-purple-50',
      borderClass: 'border-purple-500',
      textClass: 'text-purple-700',
      ringClass: 'ring-purple-400',
      glowClass: 'shadow-purple-500/50',
    },
  },
  'right-index': {
    id: 'right-index',
    hand: 'right',
    name: 'Index',
    handName: 'Right Hand',
    homeKey: 'J',
    reachKeys: ['H'],
    assignedKeys: ['Y', 'U', 'H', 'J', 'N', 'M', '6', '7'],
    color: {
      name: 'Cobalt Blue',
      hex: '#3B82F6',
      bgClass: 'bg-blue-600',
      lightBgClass: 'bg-blue-50',
      borderClass: 'border-blue-600',
      textClass: 'text-blue-800',
      ringClass: 'ring-blue-400',
      glowClass: 'shadow-blue-600/50',
    },
  },
  'right-middle': {
    id: 'right-middle',
    hand: 'right',
    name: 'Middle',
    handName: 'Right Hand',
    homeKey: 'K',
    assignedKeys: ['I', 'K', ',', '8'],
    color: {
      name: 'Teal Green',
      hex: '#14B8A6',
      bgClass: 'bg-teal-500',
      lightBgClass: 'bg-teal-50',
      borderClass: 'border-teal-500',
      textClass: 'text-teal-700',
      ringClass: 'ring-teal-400',
      glowClass: 'shadow-teal-500/50',
    },
  },
  'right-ring': {
    id: 'right-ring',
    hand: 'right',
    name: 'Ring',
    handName: 'Right Hand',
    homeKey: 'L',
    assignedKeys: ['O', 'L', '.', '9'],
    color: {
      name: 'Warm Gold',
      hex: '#F59E0B',
      bgClass: 'bg-amber-500',
      lightBgClass: 'bg-amber-50',
      borderClass: 'border-amber-500',
      textClass: 'text-amber-700',
      ringClass: 'ring-amber-400',
      glowClass: 'shadow-amber-500/50',
    },
  },
  'right-pinky': {
    id: 'right-pinky',
    hand: 'right',
    name: 'Pinky',
    handName: 'Right Hand',
    homeKey: ';',
    assignedKeys: ['P', ';', ':', '/', '?', '-', '=', '[', ']', "'", '0'],
    color: {
      name: 'Fuchsia Magenta',
      hex: '#EC4899',
      bgClass: 'bg-pink-500',
      lightBgClass: 'bg-pink-50',
      borderClass: 'border-pink-500',
      textClass: 'text-pink-700',
      ringClass: 'ring-pink-400',
      glowClass: 'shadow-pink-500/50',
    },
  },
};

// Map any key character to its designated finger
export function getFingerForKey(char: string): FingerDefinition | null {
  const upper = char.toUpperCase();
  for (const finger of Object.values(FINGER_DEFINITIONS)) {
    if (finger.assignedKeys.includes(upper)) {
      return finger;
    }
  }
  return null;
}

export interface KeyboardLessonDrill {
  id: string;
  title: string;
  targetSequence: string; // e.g. "ASDF"
  description: string;
  focusKeys: string[];
}

export interface KeyboardLessonStage {
  id: string;
  stageNumber: number;
  title: string;
  shortLabel: string;
  badge: string;
  description: string;
  iconName: string;
  drills: KeyboardLessonDrill[];
}

export const KEYBOARD_CURRICULUM_STAGES: KeyboardLessonStage[] = [
  {
    id: 'stage-asdf',
    stageNumber: 1,
    title: 'Left Hand Home Row (A - S - D - F)',
    shortLabel: '1. Left Hand (ASDF)',
    badge: 'Foundation',
    description:
      'Anchor your left hand fingers on the home keys: Pinky on A, Ring on S, Middle on D, and Index on F.',
    iconName: 'Hand',
    drills: [
      {
        id: 'drill-asdf-anchor',
        title: 'Home Row Anchor Order',
        targetSequence: 'ASDF',
        description: 'Press from pinky to index finger in forward order: A → S → D → F',
        focusKeys: ['A', 'S', 'D', 'F'],
      },
      {
        id: 'drill-asdf-reverse',
        title: 'Reverse Anchor Order',
        targetSequence: 'FDSA',
        description: 'Press backward from index to pinky: F → D → S → A',
        focusKeys: ['F', 'D', 'S', 'A'],
      },
      {
        id: 'drill-asdf-pairs',
        title: 'Finger Pair Combinations',
        targetSequence: 'ASDFASDF',
        description: 'Double cycle to build muscle memory across all 4 left hand fingers',
        focusKeys: ['A', 'S', 'D', 'F'],
      },
      {
        id: 'drill-asdf-words',
        title: 'First Words (ASDF Only)',
        targetSequence: 'SAD',
        description: 'Type real words made solely from left-hand home keys: S-A-D',
        focusKeys: ['S', 'A', 'D'],
      },
      {
        id: 'drill-asdf-dad',
        title: 'Second Word (DAD)',
        targetSequence: 'DAD',
        description: 'Middle finger to pinky to middle finger: D-A-D',
        focusKeys: ['D', 'A'],
      },
    ],
  },
  {
    id: 'stage-jkl',
    stageNumber: 2,
    title: 'Right Hand Home Row (J - K - L - ;)',
    shortLabel: '2. Right Hand (JKL;)',
    badge: 'Home Balance',
    description:
      'Rest your right hand fingers on their anchor keys: Index on J, Middle on K, Ring on L, and Pinky on ; (semicolon).',
    iconName: 'Hand',
    drills: [
      {
        id: 'drill-jkl-anchor',
        title: 'Right Hand Anchor Order',
        targetSequence: 'JKL',
        description: 'Index to ring finger: J → K → L',
        focusKeys: ['J', 'K', 'L'],
      },
      {
        id: 'drill-jkl-reverse',
        title: 'Right Hand Reverse',
        targetSequence: 'LKJ',
        description: 'Ring to index: L → K → J',
        focusKeys: ['L', 'K', 'J'],
      },
      {
        id: 'drill-jkl-cycle',
        title: 'Right Hand Double Cycle',
        targetSequence: 'JKLJKL',
        description: 'Repeat right hand sequence to lock in right side balance',
        focusKeys: ['J', 'K', 'L'],
      },
      {
        id: 'drill-jkl-ask',
        title: 'Combined Hands Word: ASK',
        targetSequence: 'ASK',
        description: 'Left pinky (A), Left ring (S), Right middle (K) — both hands working together!',
        focusKeys: ['A', 'S', 'K'],
      },
      {
        id: 'drill-jkl-all',
        title: 'Combined Word: ALL',
        targetSequence: 'ALL',
        description: 'Left pinky (A), Right ring twice (L-L)',
        focusKeys: ['A', 'L'],
      },
    ],
  },
  {
    id: 'stage-gh',
    stageNumber: 3,
    title: 'Center Keys Reach (G - H)',
    shortLabel: '3. Center Reach (GH)',
    badge: 'Finger Agility',
    description:
      'Extend index fingers into the center column: Left Index reaches from F to G, Right Index reaches from J to H.',
    iconName: 'Target',
    drills: [
      {
        id: 'drill-gh-reach',
        title: 'Center Pair Reach',
        targetSequence: 'GH',
        description: 'Reach Left Index to G, then Right Index to H',
        focusKeys: ['G', 'H'],
      },
      {
        id: 'drill-fg-hj',
        title: 'Home to Center Reach & Return',
        targetSequence: 'FGHJ',
        description: 'Left Home (F) → Reach (G) → Right Reach (H) → Right Home (J)',
        focusKeys: ['F', 'G', 'H', 'J'],
      },
      {
        id: 'drill-full-home',
        title: 'Complete Home Row Sweep',
        targetSequence: 'ASDFGHJKL',
        description: 'The entire 9-key home row from left pinky to right ring finger!',
        focusKeys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      },
      {
        id: 'drill-gh-glad',
        title: 'Word with G: GLAD',
        targetSequence: 'GLAD',
        description: 'Reach G with Left Index, then Right Ring (L), Left Pinky (A), Left Middle (D)',
        focusKeys: ['G', 'L', 'A', 'D'],
      },
      {
        id: 'drill-gh-half',
        title: 'Word with H: HALF',
        targetSequence: 'HALF',
        description: 'Reach H with Right Index, then Left Pinky (A), Right Ring (L), Left Index (F)',
        focusKeys: ['H', 'A', 'L', 'F'],
      },
      {
        id: 'drill-gh-flash',
        title: 'Home Mastery Word: FLASH',
        targetSequence: 'FLASH',
        description: 'Combines Left Index, Right Ring, Left Pinky, Left Ring, and Right Index reach!',
        focusKeys: ['F', 'L', 'A', 'S', 'H'],
      },
    ],
  },
  {
    id: 'stage-computer-words',
    stageNumber: 4,
    title: 'Approved Computer Words (ACE MVP)',
    shortLabel: '4. Computer Vocab',
    badge: 'Vocab Master',
    description:
      'Master the four approved computer literacy words verified for the ACE Startup Academy competition pitch.',
    iconName: 'Laptop',
    drills: [
      {
        id: 'drill-vocab-webcam',
        title: 'Word 1: WEBCAM',
        targetSequence: 'WEBCAM',
        description: 'The video camera used for sign language communication on laptops',
        focusKeys: ['W', 'E', 'B', 'C', 'A', 'M'],
      },
      {
        id: 'drill-vocab-keyboard',
        title: 'Word 2: KEYBOARD',
        targetSequence: 'KEYBOARD',
        description: 'The input board with letter keys for fingerspelling and typing',
        focusKeys: ['K', 'E', 'Y', 'B', 'O', 'A', 'R', 'D'],
      },
      {
        id: 'drill-vocab-mouse',
        title: 'Word 3: MOUSE',
        targetSequence: 'MOUSE',
        description: 'The hand-held pointing tool to navigate and click items',
        focusKeys: ['M', 'O', 'U', 'S', 'E'],
      },
      {
        id: 'drill-vocab-monitor',
        title: 'Word 4: MONITOR',
        targetSequence: 'MONITOR',
        description: 'The visual display screen showing signs, pictures, and text',
        focusKeys: ['M', 'O', 'N', 'I', 'T', 'O', 'R'],
      },
    ],
  },
  {
    id: 'stage-deaf-tech',
    stageNumber: 5,
    title: 'Everyday Deaf Tech & Signing Words',
    shortLabel: '5. Deaf Tech Words',
    badge: 'Speed Practice',
    description:
      'Fluency practice with everyday words used by Deaf students in online learning and digital classrooms.',
    iconName: 'MessageSquare',
    drills: [
      {
        id: 'drill-tech-chat',
        title: 'Word: CHAT',
        targetSequence: 'CHAT',
        description: 'Text messaging and conversational typing in visual meetings',
        focusKeys: ['C', 'H', 'A', 'T'],
      },
      {
        id: 'drill-tech-sign',
        title: 'Word: SIGN',
        targetSequence: 'SIGN',
        description: 'Sign language expression through visual hand gestures',
        focusKeys: ['S', 'I', 'G', 'N'],
      },
      {
        id: 'drill-tech-link',
        title: 'Word: LINK',
        targetSequence: 'LINK',
        description: 'A clickable digital bridge connecting lessons and resources',
        focusKeys: ['L', 'I', 'N', 'K'],
      },
      {
        id: 'drill-tech-deaf',
        title: 'Word: DEAF',
        targetSequence: 'DEAF',
        description: 'Community identity celebrating visual culture and visual learning',
        focusKeys: ['D', 'E', 'A', 'F'],
      },
      {
        id: 'drill-tech-brain',
        title: 'Word: BRAIN',
        targetSequence: 'BRAIN',
        description: 'Strengthening visual memory and bilateral finger motor skills',
        focusKeys: ['B', 'R', 'A', 'I', 'N'],
      },
    ],
  },
];
