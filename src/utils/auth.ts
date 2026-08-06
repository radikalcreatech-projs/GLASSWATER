/**
 * Admin authentication
 */

const AUTH_API = '/api/auth';
const TOKEN_KEY = 'glasswater_admin_token';
const TOKEN_TIME_KEY = 'glasswater_admin_token_time';
const LOCKOUT_KEY = 'glasswater_admin_lockout';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
 * Attempts to log in via the server API endpoint.
 * If the server is unreachable or returns a non-JSON response,
 * falls back to comparing against the stored admin password hash.
 */
export async function login(password: string, storedHash?: string): Promise<{ success: true } | { success: false; error: string }> {
  let apiError: string | null = null;

  try {
    const res = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    let data: { token?: string; error?: string } = {};
    const contentType = res.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      try {
        data = await res.json();
      } catch {
        apiError = `Server returned an unexpected response (HTTP ${res.status}). Please check the API configuration.`;
      }
    } else {
      const text = await res.text().catch(() => '');
      console.error(`[Glasswater Auth] Non-JSON response (${res.status}):`, text.slice(0, 200));
      apiError = `Server is not responding correctly (HTTP ${res.status}).`;
    }

    if (!apiError && res.ok && data.token) {
      sessionStorage.setItem(TOKEN_KEY, data.token);
      sessionStorage.setItem(TOKEN_TIME_KEY, Date.now().toString());
      sessionStorage.removeItem(LOCKOUT_KEY);
      return { success: true };
    }

    if (!apiError && data.error) {
      apiError = data.error;
    }
  } catch (err) {
    console.error('[Glasswater Auth] Network error:', err);
    apiError = 'Unable to reach the authentication server.';
  }

  if (apiError && storedHash) {
    try {
      const submittedHash = await sha256(password);
      if (submittedHash === storedHash) {
        const fallbackToken = 'client-' + btoa(Date.now().toString(36) + Math.random().toString(36));
        sessionStorage.setItem(TOKEN_KEY, fallbackToken);
        sessionStorage.setItem(TOKEN_TIME_KEY, Date.now().toString());
        sessionStorage.removeItem(LOCKOUT_KEY);
        return { success: true };
      }
      apiError = 'Invalid password. Please try again.';
    } catch (err) {
      console.error('[Glasswater Auth] SHA-256 hashing failed:', err);
    }
  }

  if (apiError) {
    const lockoutData = sessionStorage.getItem(LOCKOUT_KEY);
    let attempts = 1;
    if (lockoutData) {
      try {
        const lock = JSON.parse(lockoutData);
        if (lock.lockUntil && Date.now() > lock.lockUntil) {
          attempts = 1;
          sessionStorage.removeItem(LOCKOUT_KEY);
        } else {
          attempts = (lock.attempts || 0) + 1;
        }
      } catch {
        attempts = 1;
        sessionStorage.removeItem(LOCKOUT_KEY);
      }
    }

    if (attempts >= 5) {
      const lockUntil = Date.now() + 15 * 60 * 1000;
      sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify({ attempts, lockUntil }));
      return { success: false, error: 'Too many failed attempts. Please wait 15 minutes.' };
    }

    sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify({ attempts }));
  }

  return { success: false, error: apiError || 'Login failed. Please try again.' };
}

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_TIME_KEY);
}

export function isAuthenticated(): boolean {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) return false;
  
  // Check session age — expire after 30 minutes of inactivity
  const tokenTime = sessionStorage.getItem(TOKEN_TIME_KEY);
  if (tokenTime) {
    const elapsed = Date.now() - parseInt(tokenTime, 10);
    if (elapsed > SESSION_TIMEOUT) {
      logout();
      return false;
    }
  }
  
  // Refresh timestamp on activity
  sessionStorage.setItem(TOKEN_TIME_KEY, Date.now().toString());
  return true;
}

export function isLockedOut(): { locked: boolean; remainingSeconds: number } {
  const lockoutData = sessionStorage.getItem(LOCKOUT_KEY);
  if (!lockoutData) return { locked: false, remainingSeconds: 0 };
  try {
    const lock = JSON.parse(lockoutData);
    if (lock.lockUntil && Date.now() < lock.lockUntil) {
      return { locked: true, remainingSeconds: Math.ceil((lock.lockUntil - Date.now()) / 1000) };
    }
  } catch (err) {
    console.error('[Glasswater Auth] Lockout state parse error:', err);
    sessionStorage.removeItem(LOCKOUT_KEY);
  }
  return { locked: false, remainingSeconds: 0 };
}

export function clearLockout() {
  sessionStorage.removeItem(LOCKOUT_KEY);
}