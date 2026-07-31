/**
 * Sanitizes a URL for use in href attributes.
 * Returns the original URL if it passes validation, or '#' (safe no-op) if not.
 *
 * @param url - The URL to validate
 * @param allowedPrefixes - Allowed URL prefixes/protocols. Default: ['https://', 'http://', '/']
 * @returns The sanitized URL or '#'
 */
export function sanitizeUrl(
  url: string | undefined | null,
  allowedPrefixes: string[] = ['https://', 'http://', '/']
): string {
  if (!url || typeof url !== 'string') return '#';

  const trimmed = url.trim();

  // Block javascript: and data: URIs
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return '#';

  // Check if it starts with an allowed prefix
  for (const prefix of allowedPrefixes) {
    if (trimmed.startsWith(prefix)) return trimmed;
  }

  // Block anything else (e.g., relative paths without '/', unknown protocols)
  return '#';
}

/**
 * Specific validator for WhatsApp links.
 * Only allows https://wa.me/ and https://api.whatsapp.com/ prefixes.
 */
export function sanitizeWhatsAppUrl(url: string | undefined | null): string {
  return sanitizeUrl(url, ['https://wa.me/', 'https://api.whatsapp.com/']);
}

/**
 * Specific validator for social media URLs (Facebook, Instagram, LinkedIn, TikTok).
 * Only allows https:// protocol to prevent mixed content and injection.
 */
export function sanitizeSocialUrl(url: string | undefined | null): string {
  return sanitizeUrl(url, ['https://']);
}