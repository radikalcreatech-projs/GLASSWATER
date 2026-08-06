/**
 * Vercel Serverless Function — Telegram Notification Proxy
 */

const VALID_EVENTS = ['contact', 'consultation', 'review', 'document', 'admin_login'] as const;
type Event = typeof VALID_EVENTS[number];

const AMP = String.fromCharCode(38);
const ESC_AMP = AMP + 'amp;';
const ESC_LT = AMP + 'lt;';
const ESC_GT = AMP + 'gt;';

function escapeHTML(str: string): string {
  let out = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str.charAt(i);
    if (ch === AMP) out += ESC_AMP;
    else if (ch === '<') out += ESC_LT;
    else if (ch === '>') out += ESC_GT;
    else out += ch;
  }
  return out;
}

interface GeoData {
  city: string; region: string; country: string; isp: string;
}

async function getGeoLocation(ip: string): Promise<GeoData | null> {
  if (!ip || ip === 'unknown' || ip === '127.0.0.1' || ip.startsWith('192.168.')) return null;
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=city,regionName,country,isp`);
    const data: any = await res.json().catch(() => null);
    if (data && data.status !== 'fail') {
      return { city: data.city || '', region: data.regionName || '', country: data.country || '', isp: data.isp || '' };
    }
  } catch {}
  return null;
}

async function sendTelegramMessage(botToken: string, chatId: string, text: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
    const data: any = await res.json().catch(() => ({}));
    if (res.ok && data.ok) return { ok: true };

    if (data.description && (data.description.includes('parse') || data.description.includes('entity') || data.description.includes('HTML') || data.description.includes('tag'))) {
      console.warn('[Notify] HTML parse failed, retrying as plain text:', data.description);
      const retryRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      });
      const retryData: any = await retryRes.json().catch(() => ({}));
      if (retryRes.ok && retryData.ok) return { ok: true };
      return { ok: false, error: retryData.description || 'Plain text fallback failed' };
    }
    return { ok: false, error: data.description || 'Unknown Telegram API error' };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Network error' };
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const body = req.body;
  if (!body || !body.event || !VALID_EVENTS.includes(body.event)) return res.status(400).json({ error: 'Invalid event type' });
  if (!body.data || typeof body.data !== 'object') return res.status(400).json({ error: 'Data is required' });

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return res.status(500).json({ error: 'Server configuration error' });

  const clientIP = (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown').split(',')[0].trim();
  const geoPromise = getGeoLocation(clientIP);

  let message = formatEventMessage(body.event as Event, body.data);
  const metadata = buildMetadata(body.data);
  if (metadata) message += '\n\n' + metadata;

  const geo = await geoPromise;
  if (geo) {
    const loc = [geo.city, geo.region, geo.country].filter(Boolean).join(', ');
    message += `\n<b>Location:</b> ${escapeHTML(loc)}${geo.isp ? ' — ' + escapeHTML(geo.isp) : ''}`;
  } else {
    message += `\n<b>IP:</b> <code>${escapeHTML(clientIP)}</code>`;
  }

  const result = await sendTelegramMessage(botToken, chatId, message);
  if (!result.ok) {
    console.error(`[Notify] Failed (chat ${chatId}):`, result.error);
    return res.status(502).json({ error: result.error || 'Failed to send notification' });
  }
  return res.status(200).json({ ok: true });
}

function buildMetadata(data: Record<string, string>): string {
  const parts: string[] = [];
  if (data.browser && data.device) parts.push(`<b>Device:</b> ${escapeHTML(data.browser)} on ${escapeHTML(data.platform)} (${escapeHTML(data.device)})`);
  else if (data.browser) parts.push(`<b>Device:</b> ${escapeHTML(data.browser)} on ${escapeHTML(data.platform || 'Unknown')}`);
  if (data.screenSize && data.viewport) parts.push(`<b>Display:</b> ${escapeHTML(data.screenSize)} (viewport: ${escapeHTML(data.viewport)})`);
  if (data.language) parts.push(`<b>Language:</b> ${escapeHTML(data.language)}`);
  if (data.pageUrl) parts.push(`<b>Page:</b> ${escapeHTML(data.pageUrl)}`);
  if (data.referrer && data.referrer !== 'Direct') parts.push(`<b>Referrer:</b> ${escapeHTML(data.referrer)}`);
  return parts.join('\n');
}

function formatEventMessage(event: Event, data: Record<string, string>): string {
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Accra' });
  const e = escapeHTML;

  switch (event) {
    case 'contact':
      return `<b>New Enquiry</b>\n\n<b>From:</b> ${e(data.name||'Unknown')}\n<b>Email:</b> ${e(data.email||'N/A')}\n<b>Phone:</b> ${e(data.phone||'N/A')}\n<b>Service:</b> ${e(data.service||'Not specified')}\n\n<b>Message:</b>\n${e(data.message||'No message')}\n\n<i>${timestamp} (GMT)</i>`;

    case 'consultation': {
      const services: string[] = [];
      if (data.electrical === 'true') services.push('Electrical');
      if (data.plumbing === 'true') services.push('Plumbing');
      if (data.carpentry === 'true') services.push('Carpentry');
      if (data.painting === 'true') services.push('Painting');
      const serviceLine = services.length > 0 ? services.join(', ') : 'Not specified';

      return `<b>Consultation Request</b>\n\n` +
        `<b>From:</b> ${e(data.name||'Unknown')}\n` +
        `<b>Email:</b> ${e(data.email||'N/A')}\n` +
        `<b>Phone:</b> ${e(data.phone||'N/A')}\n` +
        `<b>Contact via:</b> ${e(data.contactMethod||'email')}\n\n` +
        `<b>-- Project Details --</b>\n` +
        `<b>Type:</b> ${e(data.type||'N/A')}\n` +
        `<b>Scope:</b> ${e(data.scope||'Not specified')}\n` +
        `<b>Services Needed:</b> ${serviceLine}\n\n` +
        `<b>-- Property --</b>\n` +
        `<b>Address:</b> ${e(data.address||'N/A')}\n` +
        `<b>Area:</b> ${e(data.area||'N/A')} sqm\n` +
        `<b>Floors:</b> ${e(data.floors||'N/A')}\n` +
        `<b>Building Age:</b> ${e(data.age||'N/A')} years\n\n` +
        `<b>-- Budget & Timeline --</b>\n` +
        `<b>Budget:</b> ${e(data.budget||'Not specified')}\n` +
        `<b>Start Date:</b> ${e(data.startDate||'N/A')}\n` +
        `<b>Urgency:</b> ${e(data.urgency||'N/A')}\n\n` +
        `<i>${timestamp} (GMT)</i>`;
    }

    case 'review': {
      const stars = '⭐'.repeat(Math.min(5, parseInt(data.rating||'0')));
      return `<b>${stars} New Review</b>\n\n<b>${e(data.name||'Anonymous')}</b> rated ${data.rating||'?'}/5\n<i>"${e(data.text||'')}"</i>\n\n<i>${timestamp} (GMT)</i>`;
    }

    case 'document': {
      // Parse line items if provided (JSON string)
      let itemsStr = '';
      if (data.items) {
        try {
          const items = JSON.parse(data.items);
          if (Array.isArray(items) && items.length > 0) {
            itemsStr = '\n<b>--- Line Items ---</b>\n';
            items.forEach((item: any, i: number) => {
              const desc = e(item.description || `Item ${i+1}`);
              const qty = item.quantity || 0;
              const price = Number(item.unitPrice || 0).toFixed(2);
              const total = Number(item.total || 0).toFixed(2);
              itemsStr += `${desc} — ${qty} x GHS ${price} = <b>GHS ${total}</b>\n`;
            });
          }
        } catch {}
      }

      // Build links section
      let links = '';
      if (data.code) {
        const portalUrl = data.siteUrl || 'https://glasswater.com';
        links = `\n<b>Share with client:</b>\n${portalUrl}/#portal?code=${e(data.code)}`;
        if (data.fileUrl) {
          links += `\n<b>Download:</b> ${e(data.fileUrl)}`;
        }
      }

      let discountLine = '';
      if (data.discountType && data.discountValue) {
        const dt = data.discountType === 'percentage' ? '%' : 'GHS';
        discountLine = `\n<b>Discount:</b> ${e(data.discountValue)}${dt}`;
      }

      let notesLine = '';
      if (data.notes) {
        notesLine = `\n\n<b>Notes:</b> ${e(data.notes)}`;
      }

      return `<b>${e(data.type||'Document')} Created</b>\n\n` +
        `<b>Code:</b> <code>${e(data.code||'N/A')}</code>\n` +
        `<b>Client:</b> ${e(data.client||'N/A')}\n` +
        `<b>Title:</b> ${e(data.title||'N/A')}\n` +
        `<b>Status:</b> ${e(data.status||'Draft')}\n` +
        `<b>Amount:</b> GHS ${e(data.amount||'0')}${discountLine}` +
        itemsStr +
        notesLine +
        links + `\n\n<i>${timestamp} (GMT)</i>`;
    }

    case 'admin_login':
      return `<b>Admin Login</b>\n\n<b>Dashboard accessed</b>\n<i>${timestamp} (GMT)</i>`;

    default:
      return `<b>Glasswater Notification</b>\n\n<i>${timestamp} (GMT)</i>`;
  }
}