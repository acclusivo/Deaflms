import { NextRequest, NextResponse } from 'next/server';
import { processSelarInstantPayment, getCourses } from '@/lib/api';

// Cache to prevent duplicate processing of the same transaction (Anti-Replay / Idempotent)
const processedReferences = new Set<string>();

/**
 * Selar Instant Payment Webhook Endpoint
 * 
 * Invoked by Selar upon successful payment (Cards, USSD, Instant Bank Transfer, Apple Pay).
 * Idempotently verifies and automatically activates learner enrolment in real time.
 */
export async function POST(req: NextRequest) {
  try {
    // Production Defense: Enforce webhook token authentication if configured in environment
    const configuredSecret = process.env.SELAR_WEBHOOK_SECRET;
    if (configuredSecret) {
      const incomingSecret =
        req.headers.get('x-selar-secret') ||
        req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
        req.nextUrl.searchParams.get('secret');

      if (incomingSecret !== configuredSecret) {
        return NextResponse.json(
          { error: 'Unauthorized: Invalid Selar webhook secret token' },
          { status: 401 }
        );
      }
    }

    const body = await req.json();

    // Selar sends transaction details under data or top-level payload
    const data = body.data || body;
    const reference = data.reference || data.payment_reference || data.id || `SELAR_${Date.now()}`;
    const userEmail = data.customer?.email || data.email;
    const userName = data.customer?.name || data.name || userEmail?.split('@')[0] || 'Learner';
    const amount = Number(data.amount || data.amount_paid || 5000);

    // Extract Course ID from Selar custom fields or metadata
    const courseId =
      data.custom_fields?.course_id ||
      data.metadata?.course_id ||
      data.course_id ||
      'course-frontend-web-1';

    // Idempotency check: Skip duplicate webhook delivery
    if (processedReferences.has(reference)) {
      return NextResponse.json({
        received: true,
        status: 'already_processed',
        reference,
      });
    }

    processedReferences.add(reference);

    // Fetch course title for clean record keeping
    const courses = await getCourses();
    const course = courses.find((c) => c.id === courseId);
    const courseTitle = course ? course.title : 'DeafLMS Course Enrollment';

    // Automatically activate enrolment
    const { payment, enrollment } = await processSelarInstantPayment({
      userId: data.user_id || `user_${Date.now()}`,
      userEmail: userEmail || 'learner@deaflms.org',
      userName,
      courseId,
      courseTitle,
      amountNgn: amount,
      selarTransactionId: String(data.id || reference),
      reference: String(reference),
    });

    return NextResponse.json({
      received: true,
      status: 'confirmed',
      enrolled: true,
      reference: payment.reference,
      amount: payment.amountNgn,
      userEmail: payment.userEmail,
      userName: payment.userName,
      enrollmentId: enrollment.id,
      courseTitle,
      paymentId: payment.id,
    });
  } catch (error: any) {
    console.error('Selar webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process Selar webhook', details: error.message },
      { status: 500 }
    );
  }
}
