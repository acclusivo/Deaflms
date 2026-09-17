import { SignyExplanation, AILessonGeneration } from '../types';
import { getMockSignyExplanation, getMockAILessonGeneration } from './mock-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function explainConceptWithSigny(
  term: string,
  gradeLevel: string = 'Grade 3-5',
  context?: string
): Promise<SignyExplanation> {
  if (!GEMINI_API_KEY) {
    // Fallback to mock AI engine
    return getMockSignyExplanation(term);
  }

  const prompt = `
You are 'Signy', an AI visual learning assistant for Deaf and Hard-of-Hearing K-12 students.
Rules:
1. Do not use auditory analogies (never say 'sounds like', 'listen', or 'hear').
2. Use concrete visual analogies (colors, shapes, visual actions).
3. Provide a simplified 1-2 sentence definition for grade level: ${gradeLevel}.
4. Provide physical sign description guidelines: handshape, location, movement, facial expression.
5. Provide the exact fingerspelling sequence (space-separated uppercase letters).
6. Return valid JSON only with keys: term, simplifiedDefinition, visualAnalogy, fingerspell, signGuide (handshape, location, movement, facialExpression), visualPromptSuggestion.

Explain the term: "${term}". Context: "${context || 'K-12 Education'}".
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

    if (!res.ok) {
      console.warn('Gemini API request failed with status:', res.status);
      return getMockSignyExplanation(term);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      return JSON.parse(rawText) as SignyExplanation;
    }
  } catch (error) {
    console.warn('Gemini explain call failed, using mock:', error);
  }

  return getMockSignyExplanation(term);
}

export async function generateAILesson(
  topic: string,
  gradeLevel: string = 'Grade 3'
): Promise<AILessonGeneration> {
  if (!GEMINI_API_KEY) {
    return getMockAILessonGeneration(topic, gradeLevel);
  }

  const prompt = `
You are an expert Deaf Education curriculum designer.
Generate a structured, accessible lesson module for Deaf K-12 students for topic: "${topic}" and grade level: "${gradeLevel}".
Output valid JSON only with:
- lessonTitle (string)
- description (string)
- gradeLevel (string)
- category (one of 'Reading & Literacy', 'Digital Literacy', 'STEM', 'Everyday Signs')
- vocabulary (array of { word, category, signDescription, visualIcon })
- worksheet ({ title, activityType: 'picture_to_sign', pairs: array of { id, label, pictureIcon, signHint, matchId } })
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
        return JSON.parse(rawText) as AILessonGeneration;
      }
    }
  } catch (error) {
    console.warn('Gemini generate lesson failed, using mock:', error);
  }

  return getMockAILessonGeneration(topic, gradeLevel);
}
