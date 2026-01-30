import { Resend } from 'resend';

// Lazy initialization to avoid build-time errors when env vars aren't available
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@unilinkportal.com';
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'ithome@unilinkportal.com';

/**
 * Send verification code email
 */
export async function sendVerificationEmail(to: string, code: string): Promise<boolean> {
  try {
    const { error } = await getResendClient().emails.send({
      from: `Unilink Transportation <${FROM_EMAIL}>`,
      to: [to],
      subject: 'Your Carbon Footprint Portal Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
              <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
                  Unilink Transportation
                </h1>
                <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 14px;">
                  Carbon Footprint Portal
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px;">
                <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px;">
                  Verification Code
                </h2>
                <p style="color: #475569; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                  Enter the following code to complete your login to the Carbon Footprint Portal:
                </p>
                <div style="background-color: #f1f5f9; border-radius: 8px; padding: 25px; text-align: center; margin: 0 0 30px 0;">
                  <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #0f172a;">
                    ${code}
                  </span>
                </div>
                <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">
                  This code expires in <strong>10 minutes</strong>.
                </p>
                <p style="color: #64748b; margin: 0; font-size: 14px;">
                  If you did not request this code, please ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                  &copy; ${new Date().getFullYear()} Unilink Transportation. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send verification email:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

/**
 * Send login notification to IT team
 */
export async function sendLoginNotification(
  email: string,
  ip: string,
  userAgent: string
): Promise<boolean> {
  try {
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'long',
    });

    const { error } = await getResendClient().emails.send({
      from: `Unilink Transportation <${FROM_EMAIL}>`,
      to: [NOTIFICATION_EMAIL],
      subject: `[Carbon Portal] New Login: ${email}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
              <td style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">
                  Carbon Footprint Portal - Login Alert
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <p style="color: #475569; margin: 0 0 20px 0; font-size: 16px;">
                  A new user has successfully logged into the Carbon Footprint Portal.
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <td style="padding: 15px 20px; border-bottom: 1px solid #e2e8f0;">
                      <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Email</strong>
                      <p style="color: #1e293b; margin: 5px 0 0 0; font-size: 15px;">${email}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 15px 20px; border-bottom: 1px solid #e2e8f0;">
                      <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">IP Address</strong>
                      <p style="color: #1e293b; margin: 5px 0 0 0; font-size: 15px;">${ip}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 15px 20px; border-bottom: 1px solid #e2e8f0;">
                      <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Timestamp</strong>
                      <p style="color: #1e293b; margin: 5px 0 0 0; font-size: 15px;">${timestamp}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 15px 20px;">
                      <strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">User Agent</strong>
                      <p style="color: #1e293b; margin: 5px 0 0 0; font-size: 13px; word-break: break-all;">${userAgent}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                  This is an automated notification from the Carbon Footprint Portal.
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send login notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending login notification:', error);
    return false;
  }
}
