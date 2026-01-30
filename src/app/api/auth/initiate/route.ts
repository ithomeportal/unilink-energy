import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import {
  isBlockedDomain,
  generateVerificationCode,
  getClientIP,
  isValidEmail,
  getCodeExpiry,
} from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

const SITE_PASSWORD = process.env.SITE_PASSWORD || 'ADv2026$$footCb**ecv';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, email } = body;

    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Validate required fields
    if (!password || !email) {
      return NextResponse.json(
        { success: false, error: 'Password and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password
    if (password !== SITE_PASSWORD) {
      // Log failed attempt
      await query(
        `INSERT INTO login_audit_logs (email, ip_address, user_agent, login_status, failure_reason)
         VALUES ($1, $2, $3, $4, $5)`,
        [email, clientIP, userAgent, 'failed', 'invalid_password']
      );

      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Check if email domain is blocked
    if (isBlockedDomain(email)) {
      // Log failed attempt
      await query(
        `INSERT INTO login_audit_logs (email, ip_address, user_agent, login_status, failure_reason)
         VALUES ($1, $2, $3, $4, $5)`,
        [email, clientIP, userAgent, 'failed', 'blocked_domain']
      );

      return NextResponse.json(
        { success: false, error: 'Personal email addresses are not allowed. Please use your corporate email.' },
        { status: 400 }
      );
    }

    // Generate verification code
    const code = generateVerificationCode();
    const codeExpiry = getCodeExpiry();

    // Store verification attempt in database
    await query(
      `INSERT INTO login_audit_logs
       (email, ip_address, user_agent, verification_code, code_sent_at, code_expires_at, login_status)
       VALUES ($1, $2, $3, $4, NOW(), $5, $6)`,
      [email, clientIP, userAgent, code, codeExpiry.toISOString(), 'pending']
    );

    // Send verification email
    const emailSent = await sendVerificationEmail(email, code);

    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      expiresAt: codeExpiry.toISOString(),
    });
  } catch (error) {
    console.error('Auth initiate error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
