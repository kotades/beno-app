import { NextRequest } from 'next/server';
import { sendViaGmail } from '@/lib/smtp';

/**
 * Test probe: verifies the configured Gmail app password actually authenticates
 * and delivers. GET /api/email/test?to=you@gmail.com sends a probe email.
 * Never exposes credentials in the response.
 */
export async function GET(request: NextRequest) {
  const to = request.nextUrl.searchParams.get('to');
  if (!to) {
    return Response.json({ ok: false, error: 'Missing ?to= email' }, { status: 400 });
  }

  const primary = process.env.GMAIL_USER;
  const primaryPass = process.env.GMAIL_APP_PASSWORD;
  const secondary = process.env.GMAIL_USER_2;
  const secondaryPass = process.env.GMAIL_APP_PASSWORD_2;

  const results: { user: string; configured: boolean; delivered: boolean; error?: string }[] = [];

  for (const sender of [
    { user: primary, appPassword: primaryPass },
    { user: secondary, appPassword: secondaryPass }
  ]) {
    if (!sender.user || !sender.appPassword) continue;
    const entry = { user: sender.user, configured: true, delivered: false };
    try {
      await sendViaGmail({
        fromName: 'BENO Test',
        fromEmail: sender.user,
        to,
        subject: 'BENO SMTP test — config OK',
        html: '<p>This confirms your Gmail app password works for BENO booking emails.</p>',
        user: sender.user,
        appPassword: sender.appPassword
      });
      entry.delivered = true;
    } catch (e) {
      const msg = (e as Error).message;
      console.error(`[email/test] ${sender.user} failed:`, msg);
      entry.delivered = false;
      entry.error = msg;
    }
    results.push(entry);
  }

  if (results.length === 0) {
    return Response.json(
      { ok: false, error: 'No Gmail sender configured. Set GMAIL_USER + GMAIL_APP_PASSWORD.' },
      { status: 500 }
    );
  }

  const allDelivered = results.every((r) => r.delivered);
  return Response.json(
    {
      ok: allDelivered,
      results: results.map((r) => ({ user: r.user, delivered: r.delivered, error: r.error }))
    },
    { status: allDelivered ? 200 : 500 }
  );
}
