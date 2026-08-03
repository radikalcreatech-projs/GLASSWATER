/**
 * Admin authentication — 
 */

const AUTH_API = '/api/auth';
const TOKEN_KEY = 'glasswater_admin_token';
const LOCKOUT_KEY = 'glasswater_admin_lockout';

export async function login(password: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const res = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      sessionStorage.setItem(TOKEN_KEY, data.token);
      sessionStorage.removeItem(LOCKOUT_KEY);
      return { success: true };
    }

    // Track failed attempts with expiry check
    const lockoutData = sessionStorage.getItem(LOCKOUT_KEY);
    let attempts = 1;
    if (lockoutData) {
      try {
        const lock = JSON.parse(lockoutData);
        // If lockout has fully expired, reset counter
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
    return { success: false, error: data.error || 'Invalid password. Please try again.' };
  } catch (err) {
    console.error('[Glasswater Auth] Login network error:', err);
    return { success: false, error: 'Unable to connect to server. Check your connection or try again later.' };
  }
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!sessionStorage.getItem(TOKEN_KEY);
}

export function isLockedOut(): { locked: boolean; remainingSeconds: number } {
  const lockoutData = sessionStorage.getItem(LOCKOUT_KEY);
  if (!lockoutData) return { locked: false, remainingSeconds: 0 };
  try {
    const lock = JSON.parse(lockoutData);
    if (lock.lockUntil && Date.now() < lock.lockUntil) {
      return { locked: true, remainingSeconds: Math.ceil((lock.lockUntil - Date.now()) / 1000) };
    }
  } catch { /* ignore */ }
  return { locked: false, remainingSeconds: 0 };
}

export function clearLockout() {
  sessionStorage.removeItem(LOCKOUT_KEY);
}