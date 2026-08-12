import { NextRequest } from 'next/server';

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

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ ok: false, error: 'RESEND_API_KEY not configured' }, { status: 500 });
  }

  let body: BookingEmailPayload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.guestEmail || !body.id) {
    return Response.json({ ok: false, error: 'guestEmail and id required' }, { status: 400 });
  }

  const addOnsList = body.addOns?.length
    ? body.addOns.map((a) => `<li style="margin:2px 0">✓ ${a}</li>`).join('')
    : '<li style="margin:2px 0;color:#999">None</li>';

  const html = `<!DOCTYPE html>
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

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'BENO Concierge <onboarding@resend.dev>',
        to: [body.guestEmail],
        subject: `Booking Confirmed — ${body.id} · ${body.serviceName}`,
        html
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ ok: false, error: errText }, { status: res.status });
    }

    const data = await res.json();
    return Response.json({ ok: true, id: (data as { id?: string }).id });
  } catch (e) {
    return Response.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
