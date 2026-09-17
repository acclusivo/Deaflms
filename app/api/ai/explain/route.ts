import { NextResponse } from 'next/server';
import { explainConceptWithSigny } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { term, gradeLevel, context } = body;

    if (!term) {
      return NextResponse.json({ error: 'Term is required' }, { status: 400 });
    }

    const explanation = await explainConceptWithSigny(term, gradeLevel, context);
    return NextResponse.json(explanation);
  } catch (error) {
    console.error('Error in /api/ai/explain:', error);
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
  }
}
