import { ReactNode } from 'react';
import type { ValidationRules } from '../types';

interface FormFieldProps {
  label: string;
  error?: string;
  touched?: boolean;
  children: ReactNode;
  required?: boolean;
  hint?: string;
}

export function FormField({ label, error, touched, children, required, hint }: FormFieldProps) {
  const showError = touched && error;

  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !showError && (
        <p className="text-[10px] text-steel-blue mt-1">{hint}</p>
      )}
      {showError && (
        <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
          <span className="inline-block w-1 h-1 bg-red-500 rounded-full shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Validates a single field value against the provided rules.
 * Returns an error message string if validation fails, or null if the value is valid.
 */
export function validateField(value: string, rules: ValidationRules): string | null {
  const trimmed = value.trim();

  if (rules.required && !trimmed) {
    return 'This field is required.';
  }

  if (trimmed) {
    if (rules.minLength && trimmed.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters.`;
    }

    if (rules.maxLength && trimmed.length > rules.maxLength) {
      return `Must be no more than ${rules.maxLength} characters.`;
    }

    if (rules.pattern && !rules.pattern.test(trimmed)) {
      return 'Please enter a valid value.';
    }

    if (rules.custom) {
      return rules.custom(trimmed);
    }
  }

  return null;
}

/** Common validation patterns */
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s+\-()]{7,20}$/,
  url: /^https?:\/\/.+/,
};