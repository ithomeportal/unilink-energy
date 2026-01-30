import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'K7mP9qR2sT5vW8xZ1aB4cD6eF0gH3jL9'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow these paths
  if (
    pathname === '/login' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/emissions') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next();
  }

  // Check for auth session cookie
  const sessionToken = request.cookies.get('auth_session')?.value;

  if (!sessionToken) {
    // No session - redirect to login
    const url = new URL('/login', request.url);
    url.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Verify the token
  try {
    await jwtVerify(sessionToken, JWT_SECRET);
    return NextResponse.next();
  } catch {
    // Invalid token - redirect to login
    const url = new URL('/login', request.url);
    url.searchParams.set('returnUrl', pathname);
    const response = NextResponse.redirect(url);
    response.cookies.delete('auth_session');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
