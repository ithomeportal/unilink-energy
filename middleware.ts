import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-change-in-production'
);

// Paths that don't require authentication
const PUBLIC_PATHS = [
  '/login',
  '/api/auth/initiate',
  '/api/auth/verify',
  '/api/auth/logout',
];

// Path prefixes that don't require authentication
const PUBLIC_PREFIXES = [
  '/_next',
  '/favicon',
  '/images',
  '/fonts',
];

function isPublicPath(pathname: string): boolean {
  // Check exact matches
  if (PUBLIC_PATHS.includes(pathname)) {
    return true;
  }

  // Check prefixes
  for (const prefix of PUBLIC_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return true;
    }
  }

  // Allow static files
  if (pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/)) {
    return true;
  }

  return false;
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check for auth session cookie
  const sessionToken = request.cookies.get('auth_session')?.value;

  if (!sessionToken) {
    // Redirect to login with return URL
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify the token
  const isValid = await verifyToken(sessionToken);

  if (!isValid) {
    // Token is invalid or expired, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    const response = NextResponse.redirect(loginUrl);
    // Clear the invalid cookie
    response.cookies.delete('auth_session');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
