/**
 * Vercel Serverless Function — Telegram Notification Proxy
 * 
 * POST /api/notify
 * Body: { event: string, data: Record<string, string> }
 * 
 * Environment variables (set in Vercel dashboard, NO VITE_ prefix):
 *   TELEGRAM_BOT_TOKEN — Your bot token from @BotFather
 *   TELEGRAM_CHAT_ID   — Your chat ID from getUpdates
 */

// Rate limit: prevent duplicate notifications for the same event within 60 seconds
const rateLimitMap = new Map<string, number>();

const VALID_EVENTS = ['contact', 'consultation', 'review', 'document', 'admin_login'] as const;
type Event = typeof VALID_EVENTS[number];

export default async function handler(req: any, res: any) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse and validate body
  const body = req.body;
  if (!body || !body.event || !VALID_EVENTS.includes(body.event)) {
    return res.status(400).json({ error: 'Invalid event type' });
  }

  if (!body.data || typeof body.data !== 'object') {
    return res.status(400).json({ error: 'Data is required' });
  }

  // Check env vars
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Rate limiting: same event + same client IP can't fire more than once per 60s
  const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
  const rateKey = `${body.event}:${clientIP}:${JSON.stringify(body.data).slice(0, 50)}`;

  const lastSent = rateLimitMap.get(rateKey);
  if (lastSent && Date.now() - lastSent < 60000) {
    return res.status(200).json({ ok: true, throttled: true });
  }
  rateLimitMap.set(rateKey, Date.now());

  // Build formatted message
  const message = formatEventMessage(body.event as Event, body.data);

  // Send to Telegram
  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }
    );

    const tgData: any = await tgRes.json().catch(() => ({}));

    if (!tgRes.ok || !tgData.ok) {
      console.error('[Notify] Telegram API error:', tgData);
      return res.status(502).json({ error: 'Failed to send notification' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[Notify] Network error:', err);
    return res.status(502).json({ error: 'Notification service unavailable' });
  }
}

function formatEventMessage(event: Event, data: Record<string, string>): string {
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Accra' });

  const sanitize = (str: string) =>
    str.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');

  switch (event) {
    case 'contact':
      return `<b>📬 New Enquiry</b>\n\n` +
        `<b>From:</b> ${sanitize(data.name || 'Unknown')}\n` +
        `<b>Email:</b> ${sanitize(data.email || 'N/A')}\n` +
        `<b>Phone:</b> ${sanitize(data.phone || 'N/A')}\n` +
        `<b>Service:</b> ${sanitize(data.service || 'Not specified')}\n\n` +
        `<b>Message:</b>\n${sanitize(data.message || 'No message')}\n\n` +
        `<i>${timestamp} (GMT)</i>`;

    case 'consultation':
      return `<b>📋 Consultation Request</b>\n\n` +
        `<b>From:</b> ${sanitize(data.name || 'Unknown')}\n` +
        `<b>Type:</b> ${sanitize(data.type || 'N/A')}\n` +
        `<b>Budget:</b> ${sanitize(data.budget || 'Not specified')}\n` +
        `<b>Urgency:</b> ${sanitize(data.urgency || 'N/A')}\n` +
        `<b>Address:</b> ${sanitize(data.address || 'N/A')}\n\n` +
        `<i>${timestamp} (GMT)</i>`;

    case 'review':
      const stars = '⭐'.repeat(Math.min(5, parseInt(data.rating || '0')));
      return `<b>${stars} New Review</b>\n\n` +
        `<b>${sanitize(data.name || 'Anonymous')}</b> rated ${data.rating || '?'}/5\n` +
        `<i>"${sanitize(data.text || '')}"</i>\n\n` +
        `<i>${timestamp} (GMT)</i>`;

    case 'document':
      return `<b>📄 Document Created</b>\n\n` +
        `<b>Type:</b> ${sanitize(data.type || 'N/A')}\n` +
        `<b>Code:</b> <code>${sanitize(data.code || 'N/A')}</code>\n` +
        `<b>Client:</b> ${sanitize(data.client || 'N/A')}\n` +
        `<b>Amount:</b> GHS ${sanitize(data.amount || '0')}\n\n` +
        `<i>${timestamp} (GMT)</i>`;

    case 'admin_login':
      return `<b>🔐 Admin Login</b>\n\n` +
        `<b>Dashboard accessed</b>\n` +
        `<i>${timestamp} (GMT)</i>`;

    default:
      return `<b>🔔 Glasswater Notification</b>\n\n<i>${timestamp} (GMT)</i>`;
  }
}