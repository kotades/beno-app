export async function sendViaBrevo(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY not configured');

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: 'BENO Concierge', email: 'noreply@beno.app' },
      to: [{ email: to }],
      subject,
      htmlContent: html
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Brevo failed (${res.status}): ${errorText}`);
  }
}