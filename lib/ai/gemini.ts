import { SignyExplanation, AILessonGeneration } from '../types';
import { getApprovedWord } from '../approved-vocabulary';
import { getMockSignyExplanation, getOfflineFallbackExplanation, getMockAILessonGeneration } from './mock-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

/**
 * Clarify Concept with Safety Boundaries
 * 
 * Flow:
 * 1. Validate input (reject empty or inappropriate queries).
 * 2. Check approved vocabulary store.
 * 3. If approved word: Use reviewed content and (optionally) simplify via Gemini with strict bounds.
 * 4. If unapproved word: NEVER generate a sign, handshape, movement, or facial expression.
 *    Return safe text response and state sign is not reviewed.
 * 5. If AI unavailable / network error: Return non-AI fallback.
 */
export async function explainConceptWithSigny(
  term: string,
  gradeLevel: string = 'Grade 3-5',
  context?: string
): Promise<SignyExplanation> {
  if (!term || !term.trim()) {
    return {
      term: '',
      isApprovedWord: false,
      simplifiedDefinition: 'Please enter a word to clarify.',
      fingerspell: '',
      signGuide: null,
      boundaryNotice: 'Please enter a word.',
    };
  }

  const cleanTerm = term.trim();
  const lower = cleanTerm.toLowerCase();
  const approved = getApprovedWord(lower);

  // If unapproved word, return safe text boundary immediately without calling AI to hallucinate signs
  if (!approved) {
    return getMockSignyExplanation(cleanTerm);
  }

  // If no Gemini API key is configured, use local verified content immediately
  if (!GEMINI_API_KEY) {
    return getMockSignyExplanation(cleanTerm);
  }

  // Approved word with Gemini available: ask Gemini ONLY to simplify the approved meaning or provide shorter example
  const prompt = `
You are 'Clarify This Word', an educational assistant for Deaf learners aged 9-16.
Approved word: "${approved.word}"
Approved definition: "${approved.simpleMeaning}"
Approved example: "${approved.exampleSentence}"

STRICT RULES:
1. Do NOT invent or describe sign language handshapes, movements, facial expressions, or physical directions.
2. Return ONLY valid JSON with keys:
   - "simplifiedDefinition": a shorter 1-sentence version of the approved definition using simple words
   - "exampleSentence": a familiar short sentence using the word
3. Do NOT include any sign descriptions.
`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        return {
          term: approved.word,
          isApprovedWord: true,
          simplifiedDefinition: parsed.simplifiedDefinition || approved.simpleMeaning,
          exampleSentence: parsed.exampleSentence || approved.exampleSentence,
          fingerspell: approved.fingerspell,
          signVideoUrl: approved.signVideoUrl,
          reviewStatus: approved.reviewStatus,
          reviewedBy: approved.reviewedBy,
          signLanguage: approved.signLanguage,
          signGuide: null, // Strictly null: no physical instructions
          boundaryNotice: undefined,
          visualPromptSuggestion: `Reviewed Nigerian Sign Language lesson for ${approved.word}.`,
        };
      }
    }
  } catch (error) {
    console.warn('Gemini API call failed, falling back to verified local store:', error);
  }

  // Fallback to verified local item
  return getMockSignyExplanation(cleanTerm);
}

export async function generateAILesson(
  topic: string,
  gradeLevel: string = 'Grade 3'
): Promise<AILessonGeneration> {
  return getMockAILessonGeneration(topic, gradeLevel);
}
