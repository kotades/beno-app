import { NextRequest } from 'next/server';
import { sendViaGmail } from '@/lib/smtp';

interface BookingEmailPayload {
  id: string;
  serviceName: string;
  category: string;
  startDate: string;
  startTime: string;
  duration: string;
  totalPrice: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  addOns?: string[];
  notes?: string;
}

function buildHtml(body: BookingEmailPayload): string {
  const addOnsList = body.addOns?.length
    ? body.addOns.map((a) => `<li style="margin:2px 0">✓ ${a}</li>`).join('')
    : '<li style="margin:2px 0;color:#999">None</li>';

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;padding:32px 16px">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb">
      <div style="background:#001c22;padding:28px 32px;text-align:center">
        <div style="font-size:24px;font-weight:900;letter-spacing:2px;color:#ffffff">BENO</div>
        <div style="color:#7dd3d8;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-top:4px">Executive Booking Concierge</div>
      </div>
      <div style="padding:32px">
        <h1 style="margin:0 0 6px;font-size:20px;color:#111827">Reservation Confirmed ✅</h1>
        <p style="margin:0 0 24px;font-size:14px;color:#6b7280">Thank you, ${body.guestName}. Your luxury booking has been guaranteed.</p>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px">
          <table style="width:100%;font-size:14px;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#6b7280">Booking Ref</td><td style="padding:6px 0;font-weight:800;color:#111827;text-align:right">${body.id}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Service</td><td style="padding:6px 0;font-weight:700;color:#111827;text-align:right">${body.serviceName} (${body.category})</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Date &amp; Slot</td><td style="padding:6px 0;font-weight:700;color:#111827;text-align:right">${body.startDate} @ ${body.startTime}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Duration</td><td style="padding:6px 0;font-weight:700;color:#111827;text-align:right">${body.duration}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Contact</td><td style="padding:6px 0;font-weight:700;color:#111827;text-align:right">${body.guestPhone} · ${body.guestEmail}</td></tr>
          </table>
          <div style="border-top:1px solid #e5e7eb;margin:16px 0 12px"></div>
          <div style="font-size:12px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Add-ons</div>
          <ul style="margin:0;padding-left:18px;font-size:13px;color:#374151">${addOnsList}</ul>
          <div style="border-top:1px solid #e5e7eb;margin:16px 0 12px"></div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:14px;font-weight:800;color:#111827">Total Guaranteed</span>
            <span style="font-size:22px;font-weight:900;color:#008B9B">$${body.totalPrice.toLocaleString()}</span>
          </div>
        </div>
        ${body.notes ? `<p style="margin:16px 0 0;font-size:13px;color:#6b7280"><strong style="color:#374151">Special requests:</strong> ${body.notes}</p>` : ''}
        <p style="margin:28px 0 0;font-size:12px;color:#9ca3af;text-align:center">A VIP concierge escort will contact you shortly. Manage your reservation anytime at beno-app.vercel.app/booking/retrieve.</p>
      </div>
    </div>
  </body>
</html>`;
}

// Ordered list of Gmail senders. Primary configured now; secondary slot
// reserved for the second account once 2FA/app password is ready.
function gmailSenders(): { user: string; appPassword: string }[] {
  const list: { user: string; appPassword: string }[] = [];
  const primary = process.env.GMAIL_USER;
  const primaryPass = process.env.GMAIL_APP_PASSWORD;
  const secondary = process.env.GMAIL_USER_2;
  const secondaryPass = process.env.GMAIL_APP_PASSWORD_2;
  if (primary && primaryPass) list.push({ user: primary, appPassword: primaryPass });
  if (secondary && secondaryPass) list.push({ user: secondary, appPassword: secondaryPass });
  return list;
}

async function sendViaResend(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('No email channel configured (Gmail and Resend unset)');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'BENO Concierge <onboarding@resend.dev>',
      to: [to],
      subject,
      html
    })
  });
  if (!res.ok) throw new Error(`Resend failed (${res.status}): ${await res.text()}`);
}

export async function POST(request: NextRequest) {
  let body: BookingEmailPayload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.guestEmail || !body.id) {
    return Response.json({ ok: false, error: 'guestEmail and id required' }, { status: 400 });
  }

  const html = buildHtml(body);
  const subject = `Booking Confirmed — ${body.id} · ${body.serviceName}`;

  // Resend first — reliable from Vercel. Gmail as backup if Resend fails.
  try {
    await sendViaResend(body.guestEmail, subject, html);
    return Response.json({ ok: true, channel: 'resend' });
  } catch (e) {
    console.error('Resend failed:', (e as Error).message);
  }

  // Fallback: Gmail senders
  for (const sender of gmailSenders()) {
    try {
      await sendViaGmail({
        fromName: 'BENO Concierge',
        fromEmail: sender.user,
        to: body.guestEmail,
        subject,
        html,
        user: sender.user,
        appPassword: sender.appPassword
      });
      return Response.json({ ok: true, channel: 'gmail', from: sender.user });
    } catch (e) {
      console.error(`Gmail send failed (${sender.user}):`, (e as Error).message);
    }
  }

  return Response.json({ ok: false, error: 'All email channels failed' }, { status: 500 });
}
