import { NextResponse } from 'next/server';
import { generateAILesson } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, gradeLevel } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const lesson = await generateAILesson(topic, gradeLevel);
    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error in /api/ai/generate-lesson:', error);
    return NextResponse.json({ error: 'Failed to generate lesson' }, { status: 500 });
  }
}
