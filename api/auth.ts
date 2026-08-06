/**
 * Vercel Serverless Function — Admin Authentication
 * 
 * POST /api/auth
 * Body: { password: string }
 * Returns: { token: string } (JWT) or { error: string } (401)
 * 
 * Environment variables (set in Vercel dashboard, NO VITE_ prefix):
 *   ADMIN_PASSWORD_HASH — SHA-256 hash of the admin password
 *   JWT_SECRET         — Random secret for signing JWTs
 */

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64Encode(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return bytesToBase64(bytes);
}

function base64UrlEncode(bytes: Uint8Array): string {
  return bytesToBase64(bytes)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function bytesToBase64(bytes: Uint8Array): string {
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i];
    const b2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b3 = i + 2 < bytes.length ? bytes[i + 2] : 0;

    result += BASE64_CHARS[b1 >> 2];
    result += BASE64_CHARS[((b1 & 3) << 4) | (b2 >> 4)];

    if (i + 1 < bytes.length) {
      result += BASE64_CHARS[((b2 & 15) << 2) | (b3 >> 6)];
    } else {
      result += '=';
    }

    if (i + 2 < bytes.length) {
      result += BASE64_CHARS[b3 & 63];
    } else {
      result += '=';
    }
  }
  return result;
}

async function createToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(secret);

  const header = base64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64Encode(JSON.stringify({
    sub: 'admin',
    iat: now,
    exp: now + 8 * 60 * 60, // 8 hours
  }));

  const signingInput = `${header}.${payload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    secretKey,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));
  const signatureB64 = base64UrlEncode(new Uint8Array(signature));

  return `${signingInput}.${signatureB64}`;
}

export default async function handler(req: any, res: any) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};

  if (!password || typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({ error: 'Password is required' });
  }

  // Hash the submitted password
  const submittedHash = await sha256(password);

  // Compare against stored hash
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!storedHash) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (submittedHash !== storedHash) {
    return res.status(401).json({ error: 'Invalid password. Please try again.' });
  }

  // Create a JWT-like token
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const token = await createToken(secret);

  return res.status(200).json({ token });
}