import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { createSessionToken, getClientIP, getSessionExpiry } from '@/lib/auth';
import { sendLoginNotification } from '@/lib/email';

interface AuditLog {
  id: number;
  email: string;
  verification_code: string;
  code_expires_at: Date;
  code_attempts: number;
  login_status: string;
}

const MAX_ATTEMPTS = 3;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Validate required fields
    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // Find the most recent pending verification for this email
    const auditLog = await queryOne<AuditLog>(
      `SELECT id, email, verification_code, code_expires_at, code_attempts, login_status
       FROM login_audit_logs
       WHERE email = $1 AND login_status = 'pending'
       ORDER BY created_at DESC
       LIMIT 1`,
      [email]
    );

    if (!auditLog) {
      return NextResponse.json(
        { success: false, error: 'No pending verification found. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check if code has expired
    const now = new Date();
    const expiresAt = new Date(auditLog.code_expires_at);
    if (now > expiresAt) {
      await query(
        `UPDATE login_audit_logs SET login_status = 'expired' WHERE id = $1`,
        [auditLog.id]
      );
      return NextResponse.json(
        { success: false, error: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check attempt count
    if (auditLog.code_attempts >= MAX_ATTEMPTS) {
      await query(
        `UPDATE login_audit_logs SET login_status = 'max_attempts' WHERE id = $1`,
        [auditLog.id]
      );
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please request a new code.' },
        { status: 400 }
      );
    }

    // Increment attempt count
    await query(
      `UPDATE login_audit_logs SET code_attempts = code_attempts + 1 WHERE id = $1`,
      [auditLog.id]
    );

    // Verify the code
    if (code !== auditLog.verification_code) {
      const attemptsLeft = MAX_ATTEMPTS - auditLog.code_attempts - 1;
      return NextResponse.json(
        {
          success: false,
          error: attemptsLeft > 0
            ? `Invalid code. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining.`
            : 'Invalid code. No attempts remaining. Please request a new code.'
        },
        { status: 400 }
      );
    }

    // Code is valid - create session token
    const sessionToken = await createSessionToken(email);
    const sessionExpiry = getSessionExpiry();

    // Update audit log to verified
    await query(
      `UPDATE login_audit_logs
       SET login_status = 'verified',
           session_token = $1,
           session_expires_at = $2
       WHERE id = $3`,
      [sessionToken, sessionExpiry.toISOString(), auditLog.id]
    );

    // Send notification to IT team (don't block on this)
    sendLoginNotification(email, clientIP, userAgent)
      .then((sent) => {
        if (sent) {
          query(
            `UPDATE login_audit_logs SET notification_sent = true WHERE id = $1`,
            [auditLog.id]
          ).catch(console.error);
        }
      })
      .catch(console.error);

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
    });

    // Set HTTP-only secure cookie
    response.cookies.set('auth_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: sessionExpiry,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Auth verify error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
