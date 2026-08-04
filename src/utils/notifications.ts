/**
 * Glasswater — Telegram Notification Client
 * 
 * Fire-and-forget helper that sends events to the Vercel Edge Function
 * proxy at /api/notify. Never blocks the user, never throws, never
 * exposes credentials. All security handled server-side.
 */

type NotificationEvent = 'contact' | 'consultation' | 'review' | 'document' | 'admin_login';

// Client-side debounce: prevent duplicate notifications within 60 seconds
const sentCache = new Map<string, number>();

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

  try {
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data }),
    });
  } catch (err) {
    console.error(`[Glasswater Notify] Failed to send ${event} notification:`, err);
  }
}