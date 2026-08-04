/**
 * Vercel Edge Function — Telegram Notification Proxy
 * 
 * POST /api/notify
 * Body: { event: string, data: Record<string, string> }
 * 
 * Environment variables (set in Vercel dashboard, NO VITE_ prefix):
 *   TELEGRAM_BOT_TOKEN — Your bot token from @BotFather
 *   TELEGRAM_CHAT_ID   — Your chat ID from getUpdates
 */

interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}

// Rate limit: prevent duplicate notifications for the same event within 60 seconds
const rateLimitMap = new Map<string, number>();

const VALID_EVENTS = ['contact', 'consultation', 'review', 'document', 'admin_login'] as const;
type Event = typeof VALID_EVENTS[number];

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  // Only accept POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Parse and validate body
  let body: { event?: string; data?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate event type
  if (!body.event || !VALID_EVENTS.includes(body.event as Event)) {
    return new Response(JSON.stringify({ error: 'Invalid event type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate data exists
  if (!body.data || typeof body.data !== 'object') {
    return new Response(JSON.stringify({ error: 'Data is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check env vars
  const botToken = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Rate limiting: same event + same client IP can't fire more than once per 60s
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rateKey = `${body.event}:${clientIP}:${JSON.stringify(body.data).slice(0, 50)}`;

  const lastSent = rateLimitMap.get(rateKey);
  if (lastSent && Date.now() - lastSent < 60000) {
    return new Response(JSON.stringify({ ok: true, throttled: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
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
      return new Response(JSON.stringify({ error: 'Failed to send notification' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[Notify] Network error:', err);
    return new Response(JSON.stringify({ error: 'Notification service unavailable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
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