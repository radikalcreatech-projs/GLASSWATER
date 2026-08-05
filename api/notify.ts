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

interface GeoData {
  city: string;
  region: string;
  country: string;
  isp: string;
}

async function getGeoLocation(ip: string): Promise<GeoData | null> {
  if (!ip || ip === 'unknown' || ip === '127.0.0.1' || ip.startsWith('192.168.')) return null;
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=city,regionName,country,isp`);
    const data: any = await res.json().catch(() => null);
    if (data && data.status !== 'fail') {
      return {
        city: data.city || '',
        region: data.regionName || '',
        country: data.country || '',
        isp: data.isp || '',
      };
    }
  } catch { /* geo lookup failed — non-critical */ }
  return null;
}

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

  // Get client IP for geolocation
  const clientIP = (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown').split(',')[0].trim();

  // Rate limiting: same event + same client IP can't fire more than once per 60s
  const rateKey = `${body.event}:${clientIP}:${JSON.stringify(body.data).slice(0, 50)}`;

  const lastSent = rateLimitMap.get(rateKey);
  if (lastSent && Date.now() - lastSent < 60000) {
    return res.status(200).json({ ok: true, throttled: true });
  }
  rateLimitMap.set(rateKey, Date.now());

  // Get geolocation data in parallel with message building
  const geoPromise = getGeoLocation(clientIP);

  // Build formatted message (without geo first)
  let message = formatEventMessage(body.event as Event, body.data);

  // Append device/location metadata if available
  const metadata = buildMetadata(body.data);
  if (metadata) {
    message += '\n\n' + metadata;
  }

  // Append geolocation
  const geo = await geoPromise;
  if (geo) {
    const locationParts = [geo.city, geo.region, geo.country].filter(Boolean).join(', ');
    const geoLine = `\n<b>📍 Location:</b> ${locationParts}${geo.isp ? ` — ${geo.isp}` : ''}`;
    message += geoLine;
  } else {
    // Show IP as fallback
    message += `\n<b>🌐 IP:</b> <code>${clientIP}</code>`;
  }

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

/** Builds a device/browser/referrer metadata line from client context */
function buildMetadata(data: Record<string, string>): string {
  const parts: string[] = [];

  if (data.browser && data.device) {
    parts.push(`<b>📱 Device:</b> ${data.browser} on ${data.platform} (${data.device})`);
  } else if (data.browser) {
    parts.push(`<b>📱 Device:</b> ${data.browser} on ${data.platform || 'Unknown'}`);
  }

  if (data.screenSize && data.viewport) {
    parts.push(`<b>🖥️ Display:</b> ${data.screenSize} (viewport: ${data.viewport})`);
  }

  if (data.language) {
    parts.push(`<b>🌐 Language:</b> ${data.language}`);
  }

  if (data.pageUrl) {
    parts.push(`<b>📄 Page:</b> ${data.pageUrl}`);
  }

  if (data.referrer && data.referrer !== 'Direct') {
    parts.push(`<b>🔗 Referrer:</b> ${data.referrer}`);
  }

  return parts.join('\n');
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
      let loginMsg = `<b>🔐 Admin Login</b>\n\n` +
        `<b>Dashboard accessed</b>\n` +
        `<i>${timestamp} (GMT)</i>`;
      return loginMsg;

    default:
      return `<b>🔔 Glasswater Notification</b>\n\n<i>${timestamp} (GMT)</i>`;
  }
}