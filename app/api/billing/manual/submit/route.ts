import { NextRequest, NextResponse } from 'next/server';
import { submitManualPaymentProof, getCourses } from '@/lib/api';

/**
 * Learner Manual Bank Transfer Payment Submission
 * 
 * Submits proof of payment (sender name, transfer date, bank, reference, receipt image).
 * Records payment as 'pending' for administrator reconciliation.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      userId,
      userEmail,
      userName,
      courseId,
      amountNgn,
      reference,
      bankName,
      senderName,
      transferDate,
      proofUrl,
    } = body;

    if (!courseId || !reference || !senderName || !bankName) {
      return NextResponse.json(
        { error: 'Missing required payment verification fields (courseId, reference, senderName, bankName)' },
        { status: 400 }
      );
    }

    // Resolve course title if not provided
    let resolvedTitle = body.courseTitle;
    if (!resolvedTitle) {
      const courses = await getCourses();
      const course = courses.find((c) => c.id === courseId);
      resolvedTitle = course ? course.title : 'DeafLMS Course Enrolment';
    }

    const payment = await submitManualPaymentProof({
      userId: userId || 'anonymous_learner',
      userEmail: userEmail || 'learner@deaflms.org',
      userName: userName || 'Learner',
      courseId,
      courseTitle: resolvedTitle,
      amountNgn: Number(amountNgn || 5000),
      reference,
      bankName,
      senderName,
      transferDate: transferDate || new Date().toISOString().split('T')[0],
      proofUrl: proofUrl || undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Payment proof submitted successfully. Pending administrator verification.',
      payment,
    });
  } catch (error: any) {
    console.error('Manual payment submit error:', error);
    return NextResponse.json(
      { error: 'Failed to record payment proof', details: error.message },
      { status: 500 }
    );
  }
}
