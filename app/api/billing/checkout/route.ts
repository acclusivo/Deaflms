import { NextRequest, NextResponse } from 'next/server';
import { PLANS_CATALOG } from '@/lib/plans';
import { MembershipTier } from '@/lib/types';

/**
 * Server-Side Checkout Session Boundary
 * Validates plan against trusted server-side catalog.
 * NEVER accepts prices or entitlements from the client.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, returnUrl } = body;

    // Validate planId strictly against catalog
    if (!planId || !(planId in PLANS_CATALOG)) {
      return NextResponse.json(
        { error: 'Invalid plan identifier' },
        { status: 400 }
      );
    }

    const plan = PLANS_CATALOG[planId as MembershipTier];

    if (!plan.isPaid) {
      return NextResponse.json(
        { error: 'Free plan does not require checkout' },
        { status: 400 }
      );
    }

    // Generate stable, secure session reference
    const sessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // If production payment credentials (Paystack / Stripe) are configured:
    // e.g. if (process.env.PAYSTACK_SECRET_KEY) { ... }
    // For development / test integration boundary:
    const checkoutUrl = `/checkout?session_id=${sessionId}&plan=${plan.id}&amount=${plan.price.amountNgn}`;

    return NextResponse.json({
      sessionId,
      checkoutUrl,
      plan: {
        id: plan.id,
        name: plan.name,
        priceFormatted: plan.price.formatted,
        billingInterval: plan.price.billingInterval,
      },
      mode: 'test_boundary',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to initialize checkout session' },
      { status: 500 }
    );
  }
}
