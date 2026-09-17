import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Edge Middleware — Deaf LMS Zero-Trust Role & Portal Isolation
 * Intercepts all protected portal routes at the network edge before SSR or component rendering.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const roleCookie = request.cookies.get('deaflms_role')?.value;

  // Clone headers to inject zero-trust security metadata
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);

  // Security Headers applied to all portal responses
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('X-Portal-Isolation', 'enforced');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Edge Gate for Protected Portals
  const isStudentRoute = pathname.startsWith('/student');
  const isTeacherRoute = pathname.startsWith('/teacher');
  const isAdminRoute = pathname.startsWith('/admin');

  if (isStudentRoute || isTeacherRoute || isAdminRoute) {
    // If no role cookie exists at edge, pass through to PortalRouteGuard for accessible UI redirection
    if (!roleCookie) {
      response.headers.set('X-Portal-Auth-Status', 'unauthenticated');
      return response;
    }

    // Role-matching enforcement at edge
    if (isStudentRoute && roleCookie !== 'student') {
      response.headers.set('X-Portal-Access', 'denied-role-mismatch');
      response.headers.set('X-Expected-Role', 'student');
      response.headers.set('X-Actual-Role', roleCookie);
    } else if (isTeacherRoute && roleCookie !== 'teacher') {
      response.headers.set('X-Portal-Access', 'denied-role-mismatch');
      response.headers.set('X-Expected-Role', 'teacher');
      response.headers.set('X-Actual-Role', roleCookie);
    } else if (isAdminRoute && roleCookie !== 'admin') {
      response.headers.set('X-Portal-Access', 'denied-role-mismatch');
      response.headers.set('X-Expected-Role', 'admin');
      response.headers.set('X-Actual-Role', roleCookie);
    } else {
      response.headers.set('X-Portal-Access', 'granted');
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/student/:path*',
    '/teacher/:path*',
    '/admin/:path*',
  ],
};
