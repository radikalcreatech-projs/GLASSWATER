/**
 * Sanitizes a URL for use in CSS `url()` values (e.g., `background-image`).
 * Strips dangerous characters and validates the URL starts with a safe protocol.
 * Returns a transparent placeholder data URI if the URL is invalid.
 *
 * @param url - The URL to sanitize
 * @returns A safe CSS url() string
 */
export function safeCssUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  const trimmed = url.trim();

  // Block javascript: and data: URIs in CSS (data URIs can be used for XSS in some contexts)
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }

  // Strip dangerous characters that could break out of CSS url() context
  const sanitized = trimmed.replace(/['"();]/g, '');

  // Only allow https and relative paths starting with /
  if (sanitized.startsWith('https://') || sanitized.startsWith('http://') || sanitized.startsWith('/')) {
    return sanitized;
  }

  // Return transparent placeholder for anything else
  return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
}