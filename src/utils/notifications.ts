/**
 * Glasswater — Telegram Notification Client
 * 
 * Fire-and-forget helper that sends events to the Vercel Serverless Function
 * proxy at /api/notify. Never blocks the user, never throws, never
 * exposes credentials. All security handled server-side.
 */

type NotificationEvent = 'contact' | 'consultation' | 'review' | 'document' | 'admin_login';

// Client-side debounce: prevent duplicate notifications within 60 seconds
const sentCache = new Map<string, number>();

/** Collects browser, device, and page context from the client */
function getClientContext(): Record<string, string> {
  const ua = navigator.userAgent;
  
  // Simple platform detection
  let platform = 'Unknown';
  if (/(iPhone|iPad|iPod)/i.test(ua)) platform = 'iPhone/iPad';
  else if (/Android/i.test(ua)) platform = 'Android';
  else if (/Windows/i.test(ua)) platform = 'Windows';
  else if (/Mac/i.test(ua)) platform = 'Mac';
  else if (/Linux/i.test(ua)) platform = 'Linux';

  // Device type
  let device = 'Desktop';
  if (/(iPhone|Android.*Mobile|iPad)/i.test(ua)) device = 'Mobile';
  else if (/iPad|Android(?!.*Mobile)/i.test(ua)) device = 'Tablet';

  // Browser detection
  let browser = 'Unknown';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/OPR|Opera/i.test(ua)) browser = 'Opera';

  const screenSize = `${window.screen.width}×${window.screen.height}`;
  const language = navigator.language || 'unknown';
  const referrer = document.referrer ? new URL(document.referrer).hostname : 'Direct';
  const pageUrl = window.location.href;
  const viewport = `${window.innerWidth}×${window.innerHeight}`;

  return { platform, device, browser, screenSize, viewport, language, referrer, pageUrl };
}

/**
 * Sends a notification event to the Telegram bot via the server proxy.
 * Fire-and-forget — never blocks the UI, never shows errors to the user.
 * 
 * @param event - The event type (contact, consultation, review, document, admin_login)
 * @param data  - Key-value pairs for the notification message
 */
export async function notify(event: NotificationEvent, data: Record<string, string>): Promise<void> {
  // Prevent duplicate notifications within 60 seconds
  const cacheKey = `${event}:${JSON.stringify(data).slice(0, 80)}`;
  const lastSent = sentCache.get(cacheKey);
  if (lastSent && Date.now() - lastSent < 60000) return;
  sentCache.set(cacheKey, Date.now());

  // Attach client context to the data
  const enrichedData = { ...data, ...getClientContext() };

  try {
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data: enrichedData }),
    });
  } catch (err) {
    console.error(`[Glasswater Notify] Failed to send ${event} notification:`, err);
  }
}