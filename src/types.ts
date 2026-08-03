// Shared TypeScript types for Glasswater application

// ── Toast Notification System ──────────────────────────────────

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // ms, default 4000
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => string;
  removeToast: (id: string) => void;
}

// ── Form Validation ────────────────────────────────────────────

export interface FieldValidation {
  valid: boolean;
  message: string;
  touched: boolean;
}

export type ValidationRules = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
};

// ── Loading States ─────────────────────────────────────────────

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';