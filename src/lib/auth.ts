import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

// Blocked personal email domains
export const BLOCKED_DOMAINS = [
  'gmail.com', 'googlemail.com',
  'hotmail.com', 'hotmail.co.uk',
  'outlook.com', 'outlook.co.uk', 'live.com',
  'yahoo.com', 'yahoo.co.uk', 'ymail.com',
  'icloud.com', 'me.com', 'mac.com',
  'aol.com', 'aol.co.uk',
  'protonmail.com', 'protonmail.ch', 'pm.me',
  'mail.com',
  'zoho.com', 'zohomail.com',
];

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-change-in-production'
);

const SESSION_DURATION = 8 * 60 * 60; // 8 hours in seconds

/**
 * Check if email domain is blocked (personal email)
 */
export function isBlockedDomain(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1];
  if (!domain) return true;
  return BLOCKED_DOMAINS.includes(domain);
}

/**
 * Generate 8-digit verification code
 */
export function generateVerificationCode(): string {
  const code = Math.floor(10000000 + Math.random() * 90000000);
  return code.toString();
}

/**
 * Create JWT session token with 8-hour expiry
 */
export async function createSessionToken(email: string): Promise<string> {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify JWT session token
 */
export async function verifySessionToken(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { email: payload.email as string };
  } catch {
    return null;
  }
}

/**
 * Extract client IP from request headers
 */
export function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  return '127.0.0.1';
}

/**
 * Mask email for display (j***@company.com)
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return email;

  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }

  return `${localPart[0]}***@${domain}`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get session expiry date (8 hours from now)
 */
export function getSessionExpiry(): Date {
  return new Date(Date.now() + SESSION_DURATION * 1000);
}

/**
 * Get verification code expiry (10 minutes from now)
 */
export function getCodeExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000);
}
