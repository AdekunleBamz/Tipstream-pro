/**
 * Next.js Middleware
 * 
 * Handle authentication, redirects, and request processing.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require wallet connection
const PROTECTED_ROUTES = [
  '/dashboard',
  '/settings',
  '/rewards',
  '/history',
  '/profile',
];

// Routes that should redirect to dashboard if connected
const AUTH_ROUTES = [
  // Currently none, but could add login-type pages here
];

// API routes that require authentication
const PROTECTED_API_ROUTES = [
  '/api/users',
  '/api/tips',
  '/api/subscriptions',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get wallet connection status from cookie/header
  // Note: In production, you'd verify this server-side
  const isConnected = request.cookies.get('wallet-connected')?.value === 'true';
  
  // Handle protected routes
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    // For now, allow access (client-side will handle wallet check)
    // In production with server auth, redirect to home or connect page
    return NextResponse.next();
  }
  
  // Handle auth routes (redirect to dashboard if connected)
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    if (isConnected) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  // Handle API authentication
  if (PROTECTED_API_ROUTES.some(route => pathname.startsWith(route))) {
    // For non-GET requests, could verify signature/auth
    // This is a placeholder for future implementation
  }
  
  // Add security headers
  const response = NextResponse.next();
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https: wss:",
      "frame-src 'self' https:",
    ].join('; ')
  );
  
  // Other security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
