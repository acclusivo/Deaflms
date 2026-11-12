import { NextRequest, NextResponse } from 'next/server';
import { verifyManualPayment } from '@/lib/api';

/**
 * Admin Payment Verification Endpoint
 * 
 * Allows admin to confirm (activates course access) or reject manual transfer submissions.
 */
export async function POST(req: NextRequest) {
  try {
    // Edge Security: Ensure only authorized platform administrators can confirm or reject payments
    const roleCookie = req.cookies.get('deaflms_role')?.value;
    if (roleCookie !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Only verified platform administrators may verify payments.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { paymentId, action, adminNotes, reviewerName } = body;

    if (!paymentId || !action || !['confirm', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Valid paymentId and action ("confirm" | "reject") are required.' },
        { status: 400 }
      );
    }

    const updatedPayment = await verifyManualPayment(
      paymentId,
      action as 'confirm' | 'reject',
      adminNotes,
      reviewerName || 'Platform Administrator'
    );

    if (!updatedPayment) {
      return NextResponse.json(
        { error: 'Payment record not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      action,
      payment: updatedPayment,
      message: action === 'confirm'
        ? 'Payment verified and learner enrolment automatically activated!'
        : 'Payment marked as rejected with reason noted.',
    });
  } catch (error: any) {
    console.error('Manual payment verify error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment', details: error.message },
      { status: 500 }
    );
  }
}
