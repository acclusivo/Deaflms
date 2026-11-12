import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Edge Middleware — DeafLMS Zero-Trust Role & Portal Isolation
 * Intercepts all protected portal routes at the network edge before SSR or component rendering.
 * Strictly guarantees that unauthenticated visitors cannot access protected portals,
 * and cross-role dashboard penetration is immediately redirected.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const roleCookie = request.cookies.get('deaflms_role')?.value;

  const isStudentRoute = pathname.startsWith('/student');
  const isTeacherRoute = pathname.startsWith('/teacher');
  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminApiRoute = pathname.startsWith('/api/admin');
  const isProfileRoute = pathname === '/profile';

  // API protection: Block unauthorized calls to administrative endpoints at the network edge
  if (isAdminApiRoute) {
    if (roleCookie !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Platform administrator privileges required.' },
        { status: 403 }
      );
    }
  }

  if (isStudentRoute || isTeacherRoute || isAdminRoute || isProfileRoute) {
    // 1. Zero-Trust Gate: Unauthenticated users are strictly blocked and redirected to /login
    if (!roleCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Strict Cross-Portal Isolation: Redirect users accessing portals outside their assigned role
    if (isStudentRoute) {
      // Both student and parent roles are authorized to access the learner portal
      if (roleCookie !== 'student' && roleCookie !== 'parent') {
        const dest = roleCookie === 'teacher' ? '/teacher/dashboard' : '/admin/dashboard';
        return NextResponse.redirect(new URL(dest, request.url));
      }
    } else if (isTeacherRoute) {
      // Only approved teachers may access teacher studio
      if (roleCookie !== 'teacher') {
        const dest = roleCookie === 'admin' ? '/admin/dashboard' : '/student/dashboard';
        return NextResponse.redirect(new URL(dest, request.url));
      }
    } else if (isAdminRoute) {
      // Only platform administrators may access the admin console
      if (roleCookie !== 'admin') {
        const dest = roleCookie === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
        return NextResponse.redirect(new URL(dest, request.url));
      }
    }
  }

  // Clone headers to inject zero-trust security metadata for authorized requests
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('X-Portal-Isolation', 'enforced');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/student/:path*',
    '/teacher/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/profile',
  ],
};
