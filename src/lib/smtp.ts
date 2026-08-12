import tls from 'node:tls';

const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = 465; // implicit TLS

export interface MimeOptions {
  fromName: string;
  fromEmail: string;
  to: string;
  subject: string;
  html: string;
}

/**
 * Build a MIME message (base64 HTML body, RFC 2047 subject) ready for the
 * SMTP DATA phase. Line endings are CRLF per SMTP.
 */
export function buildMimeMessage({ fromName, fromEmail, to, subject, html }: MimeOptions): string {
  const bodyB64 = Buffer.from(html, 'utf8').toString('base64');
  const wrappedBody = bodyB64.match(/.{1,76}/g)?.join('\r\n') ?? '';
  const subjectEnc = `=?UTF-8?B?${Buffer.from(subject, 'utf8').toString('base64')}?=`;
  return [
    `From: ${fromName} <${fromEmail}>`,
    `To: <${to}>`,
    `Subject: ${subjectEnc}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrappedBody
  ].join('\r\n');
}

interface Waiter {
  resolve: (line: string) => void;
  reject: (err: Error) => void;
}

// Read SMTP reply lines one at a time; reject pending reads on socket close/error.
function lineReader(sock: tls.TLSSocket): () => Promise<string> {
  let buffer = '';
  const pending: Waiter[] = [];
  sock.on('data', (chunk) => {
    buffer += chunk.toString('utf8');
    let idx: number;
    while ((idx = buffer.indexOf('\r\n')) !== -1) {
      const line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const w = pending.shift();
      if (w) w.resolve(line);
    }
  });
  sock.on('error', (err) => {
    while (pending.length) pending.shift()!.reject(err);
  });
  sock.on('close', () => {
    const err = new Error('SMTP connection closed');
    while (pending.length) pending.shift()!.reject(err);
  });
  return () => new Promise<string>((resolve, reject) => pending.push({ resolve, reject }));
}

// Read one reply, consuming any multi-line (250-…250 …) continuation lines.
async function readReply(readLine: () => Promise<string>): Promise<{ code: number; text: string }> {
  let line = await readLine();
  const code = parseInt(line.slice(0, 3), 10);
  while (line.length > 3 && line[3] === '-') {
    line = await readLine();
  }
  return { code, text: line.slice(4) };
}

export interface GmailOptions extends MimeOptions {
  user: string; // e.g. inudoyin@gmail.com
  appPassword: string; // 16-char Gmail app password (requires 2FA enabled)
}

export async function sendViaGmail(opts: GmailOptions): Promise<void> {
  const sock = await new Promise<tls.TLSSocket>((resolve, reject) => {
    const s = tls.connect({ host: SMTP_HOST, port: SMTP_PORT, servername: SMTP_HOST });
    s.once('secureConnect', () => resolve(s));
    s.once('error', reject);
  });

  try {
    // Gmail can take >20s on a cold start (TLS + EHLO + AUTH on a 2-core
    // Lambda). 60s covers it; Vercel default function timeout is 300s.
    sock.setTimeout(60000, () => sock.destroy(new Error('SMTP timeout')));
    const readLine = lineReader(sock);
    const write = (s: string) => sock.write(s + '\r\n');
    const expect = async (codes: number[], what: string) => {
      const { code, text } = await readReply(readLine);
      if (!codes.includes(code)) throw new Error(`${what} failed (${code}): ${text}`);
    };

    await expect([220], 'SMTP greeting');
    write('EHLO beno-app');
    await expect([250], 'EHLO');
    write('AUTH LOGIN');
    await expect([334], 'AUTH LOGIN');
    write(Buffer.from(opts.user, 'utf8').toString('base64'));
    await expect([334], 'Username');
    write(Buffer.from(opts.appPassword, 'utf8').toString('base64'));
    await expect([235], 'Authentication');
    write(`MAIL FROM:<${opts.user}>`);
    await expect([250], 'MAIL FROM');
    write(`RCPT TO:<${opts.to}>`);
    await expect([250], 'RCPT TO');
    write('DATA');
    await expect([354], 'DATA');
    sock.write(buildMimeMessage(opts) + '\r\n.\r\n');
    await expect([250], 'Message');
    write('QUIT');
    await readReply(readLine).catch(() => {});
  } finally {
    sock.end();
  }
}
