import { NextResponse } from 'next/server';
import { explainConceptWithSigny } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { term, gradeLevel, context } = body;

    if (!term || !term.trim()) {
      return NextResponse.json({
        term: '',
        isApprovedWord: false,
        simplifiedDefinition: 'Please enter a word to clarify.',
        fingerspell: '',
        signGuide: null,
        boundaryNotice: 'Please enter a word.',
      }, { status: 400 });
    }

    const explanation = await explainConceptWithSigny(term, gradeLevel, context);
    return NextResponse.json(explanation);
  } catch (error) {
    console.warn('Error in /api/ai/explain, returning safe fallback:', error);
    return NextResponse.json({
      term: 'Clarify Service',
      isApprovedWord: false,
      simplifiedDefinition: 'We cannot create a new explanation right now. Watch the approved lesson again or ask your facilitator for help.',
      fingerspell: '',
      signGuide: null,
      boundaryNotice: 'We cannot create a new explanation right now. Watch the approved lesson again or ask your facilitator for help.',
    }, { status: 200 });
  }
}
