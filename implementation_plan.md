# Implementation Plan

[Overview]
Fix all reported bugs across the Glasswater client portal and admin dashboard including broken Download/Print buttons, incomplete translations, premature success messages, unresponsive buttons requiring double-taps, missing form validation, missing error boundaries, missing loading indicators, poor mobile responsiveness, excessive whitespace, slow page loads, and the `[website link]` placeholder in auto-messages.

This implementation addresses 15 distinct issues reported in the Glasswater application. The root causes span from architectural problems (hash-based SPA routing causing double-tap issues) to missing infrastructure (no ErrorBoundary), to UX problems (success messages firing before email completion). The fixes are ordered to minimize regressions: infrastructure-first (ErrorBoundary prevents crashes), then navigation fixes (eliminates double-tap across all pages), then UX polish (form validation, loading states, translations), and finally performance/accessibility improvements. All changes are additive — no existing features are removed, only enhanced or fixed.

[Types]
New types and interfaces needed to support error boundaries, toast notifications, and form validation states across the application.

**New Types (`src/types.ts` — new file):**

```typescript
// Toast notification system
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // ms, default 4000
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

// Form validation
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
  custom?: (value: string) => string | null; // returns error message or null
};

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
```

**Modified Types in `src/context/SettingsContext.tsx`:**

Add `siteUrl` field to `WebsiteSettings`:
```typescript
export interface WebsiteSettings {
  // ... existing fields ...
  siteUrl: string; // NEW — base URL of deployed site for auto-messages
}
```
Default value: `'https://glasswater.com'` (configurable in admin settings).

**Modified Types in `src/context/NavigationContext.tsx`:**

Add `isTransitioning` state to fix double-tap:
```typescript
interface NavigationContextType {
  currentPage: Page;
  currentPostSlug: string | null;
  navigate: (page: Page, data?: string) => void;
  isTransitioning: boolean; // NEW — prevents double-clicks during navigation
}
```

[Files]
All files that will be created, modified, or referenced during implementation.

### New Files

| File | Purpose |
|---|---|
| `src/components/ErrorBoundary.tsx` | Catches unhandled React errors, shows fallback UI with retry button instead of white screen |
| `src/components/ErrorFallback.tsx` | Reusable UI for error boundary — shows error message, optional details, and "Reload Page" button |
| `src/context/ToastContext.tsx` | Global toast notification system — provides `addToast()` / `removeToast()` to entire app |
| `src/components/ToastContainer.tsx` | Renders active toasts as stacked, auto-dismissing notifications in bottom-right corner |
| `src/components/LoadingSpinner.tsx` | Reusable loading component with optional overlay mode and message prop |
| `src/components/FormField.tsx` | Reusable form input wrapper with label, validation error display, and loading state |
| `src/types.ts` | Shared TypeScript types for Toast, Validation, LoadingState (described in [Types] section) |

### Modified Files

| File | Changes |
|---|---|
| `src/App.tsx` | Wrap `<MainApp />` in `<ErrorBoundary>` and `<ToastProvider>`. Add `<ToastContainer />` to layout. |
| `src/context/NavigationContext.tsx` | Add `isTransitioning` ref to prevent duplicate navigations within 500ms. Fix hash change race condition by deferring React state after hash update. |
| `src/pages/PortalPage.tsx` | Fix Download button: better error handling with toasts, pre-warm html2pdf import on document view, retry logic. Fix Print: add comprehensive `@media print` CSS class. Fix URL code param parsing to handle hash-based queries properly. Translate all hardcoded English strings. Add loading spinner overlay during PDF generation. |
| `src/pages/AdminPage.tsx` | Extract into 6 sub-components for maintainability. Fix `[website link]` placeholder to use `settings.siteUrl`. Add loading spinners to all save operations. Add form validation with inline error messages for document editor. Fix admin download button — add direct PDF download in admin via `handleDownloadPDF`. Translate all remaining hardcoded English strings. Add `isTransitioning` checks to tab buttons. Reduce padding/spacing from `py-12` to `py-6 md:py-8`. |
| `src/pages/ContactPage.tsx` | Fix premature success message — remove `setSubmitted(true)` / `setSubmitted(false)` entirely. Replace with toast notification that fires only if mailto succeeds. Add inline field validation with red borders and error messages for required fields. |
| `src/components/WizardModal.tsx` | Fix premature success alert — move from `alert()` + mailto to toast notification after mailto opens. Add per-step field validation. Add step transition animations. Translate hardcoded strings. Add `isSubmitting` loading state. |
| `src/components/Header.tsx` | Add `isTransitioning` guard to navigation buttons to prevent double-tap. Add `disabled` visual state during transitions. |
| `src/components/Footer.tsx` | Add `isTransitioning` guard to navigation links. |
| `src/data.ts` | Add missing French translations for admin dashboard UI. Add missing portal translations (validation messages, loading text). Add toast notification translation keys. |
| `src/context/SettingsContext.tsx` | Add `siteUrl` to `WebsiteSettings` interface and `DEFAULT_SETTINGS`. Add migration for existing localStorage settings. |
| `src/index.css` | Add `@media print` styles for document printing. Add toast animation keyframes. Add responsive spacing utilities. Add `.btn-loading` and `.btn-disabled` utility classes. Add reduced-motion media query. |

### Deleted Files

None. All changes are additive.

[Functions]
New and modified functions across the codebase.

### New Functions

| Function | File | Signature | Purpose |
|---|---|---|---|
| `ErrorFallback` | `src/components/ErrorFallback.tsx` | `(props: { error: Error; resetError: () => void }) => JSX.Element` | Renders fallback UI when error boundary catches error |
| `useToast` | `src/context/ToastContext.tsx` | `() => ToastContextType` | Hook to access toast system from any component |
| `ToastProvider` | `src/context/ToastContext.tsx` | `(props: { children: ReactNode }) => JSX.Element` | Context provider managing toast queue with auto-dismiss |
| `ToastContainer` | `src/components/ToastContainer.tsx` | `() => JSX.Element` | Renders all active toasts |
| `LoadingSpinner` | `src/components/LoadingSpinner.tsx` | `(props: { message?: string; overlay?: boolean; size?: 'sm' \| 'md' \| 'lg' }) => JSX.Element` | Reusable spinner |
| `FormField` | `src/components/FormField.tsx` | `(props: { label: string; error?: string; touched?: boolean; children: ReactNode; required?: boolean }) => JSX.Element` | Wraps form inputs with labels and error display |
| `validateField` | `src/components/FormField.tsx` | `(value: string, rules: ValidationRules) => string \| null` | Validates a single field, returns error message or null |
| `handleDownloadPDF` | `src/pages/PortalPage.tsx` | `async (retrievedDoc: ClientDocument) => Promise<void>` | Refactored PDF download with retry logic, toast feedback, and loading overlay |
| `parsePortalCode` | `src/pages/PortalPage.tsx` | `(hash: string) => string \| null` | Extracts `?code=` param from hash-based URL reliably |

### Modified Functions

| Function | File | Changes |
|---|---|---|
| `navigate` | `src/context/NavigationContext.tsx:35-44` | Add `isTransitioning` ref guard — if called within 500ms of last call, ignore. Reverse order: update hash first, then React state. |
| `handleSubmit` | `src/pages/ContactPage.tsx:13-40` | Remove `setSubmitted(true/false)`. Replace with toast on success. Add per-field validation before opening mailto. |
| `handleSubmit` | `src/components/WizardModal.tsx:22-72` | Remove `alert()` call. Replace with toast notification. Add `isSubmitting` state to disable button. |
| `handleDownloadPDF` | `src/pages/PortalPage.tsx:40-68` | Add toast error/success feedback. Preload html2pdf on document view. Add DOM readiness check with retry (up to 3 attempts with 100ms intervals). Add loading overlay. |
| `handlePrint` | `src/pages/PortalPage.tsx:95-97` | Add toast confirmation. Ensure print CSS is loaded before calling `window.print()`. |
| `handleDocSubmit` | `src/pages/AdminPage.tsx:152-183` | Add `isSaving` loading state. Replace `alert(validationError)` with inline field errors. Use `settings.siteUrl` instead of `[website link]` placeholder. |
| `handleLogin` | `src/pages/AdminPage.tsx:260-287` | Add disabled state during login. Show specific error toast instead of inline message only. |
| `handleSearch` | `src/pages/PortalPage.tsx:70-87` | Use `parsePortalCode()` for reliable URL parsing. |
| `useEffect` (code param) | `src/pages/PortalPage.tsx:25-38` | Use `parsePortalCode()` for reliable URL parsing. Handle edge case where hash already changed by NavigationContext. |

### Removed Functions

None. All existing functions preserved.

[Classes]
This project uses functional React components exclusively — no class-based components exist. Component modifications are described in [Files] and [Functions].

### New Components

| Component | File | Key Props | Description |
|---|---|---|---|
| `ErrorBoundary` | `src/components/ErrorBoundary.tsx` | `children: ReactNode; fallback?: ReactNode` | Class component wrapping children in `componentDidCatch` |
| `ToastContainer` | `src/components/ToastContainer.tsx` | None (uses `useToast` hook) | Positions toasts in bottom-right, handles enter/exit animations |
| `LoadingSpinner` | `src/components/LoadingSpinner.tsx` | `message?, overlay?, size?` | Tailwind-animated spinner with optional dark overlay |
| `FormField` | `src/components/FormField.tsx` | `label, error?, touched?, children, required?, hint?` | Wraps input with label, red border on error, error message below |

[Dependencies]
No new npm packages are required. All fixes use existing dependencies (`react`, `lucide-react`, `html2pdf.js`, `motion`). The `motion` library (already installed) will be used for toast enter/exit animations.

Existing dependency usage changes:
- `html2pdf.js`: Keep but add pre-warming on document view to reduce perceived latency
- `lucide-react`: Use existing `AlertTriangle`, `CheckCircle`, `XCircle` icons for toasts
- `motion`: Use `AnimatePresence` for toast animations

[Testing]
Manual verification checklist for each fix.

### Test Scenarios

1. **Error Boundary:**
   - Intentionally throw in a lazy-loaded page → confirm fallback UI appears with "Reload" button
   - Click "Reload" → confirm page reloads to current hash route
   - Navigate to another page → confirm normal rendering resumes

2. **Double-tap fix:**
   - Rapidly click navigation tabs in admin (x5) → confirm only one navigation fires
   - Rapidly click header navigation links → confirm no duplicate renders
   - Click admin tab buttons rapidly → confirm active tab changes correctly on first click

3. **Download button:**
   - View a document → click Download → confirm spinner appears, PDF downloads
   - If html2pdf fails to load → confirm error toast appears with "Try Print instead" message
   - Mobile browser → confirm download works or shows appropriate message

4. **Print button:**
   - View a document → click Print → confirm browser print dialog opens
   - Print preview → confirm document is styled correctly (no buttons visible, proper margins)
   - Confirm print layout matches document card layout

5. **Form validation:**
   - Submit contact form with empty fields → confirm red borders and error messages appear
   - Type invalid email → confirm email validation error
   - Fill all fields correctly → confirm form submits without errors

6. **Success message timing:**
   - Submit contact form → confirm success message appears only after mailto opens (not before)
   - Submit wizard → confirm no premature alert, toast appears after mailto URL is set
   - If mailto fails → confirm error toast appears instead of success

7. **Translations:**
   - Switch to French → confirm ALL admin page text translates (tab labels, form labels, buttons)
   - Switch to French → confirm portal validation messages translate
   - Switch to French → confirm toast notifications appear in French

8. **Loading indicators:**
   - Save website settings → confirm spinner appears during save
   - Save client document → confirm spinner on save button
   - Login → confirm spinner on login button
   - Delete item → confirm spinner during delete operation

9. **Auto-message:**
   - Save a client document → confirm auto-message shows actual website URL, not `[website link]`
   - Copy auto-message → confirm clipboard contains real URL

10. **Admin download:**
    - Click Download button in admin doc list → confirm PDF generates or navigates to correct portal URL with code
    - Verify code parameter is preserved in URL

11. **Mobile responsiveness:**
    - View admin page on 375px width → confirm tab bar scrolls horizontally, no overflow
    - View document editor on mobile → confirm line items table is scrollable, inputs are usable
    - Confirm spacing is reasonable on mobile (no excessive whitespace)

12. **Session timeout:**
    - Leave admin page idle for 31 minutes → confirm session expires and redirects to login
    - Active usage → confirm session does not expire prematurely

[Implementation Order]
All changes applied in dependency order to minimize conflicts and allow incremental testing.

1. **Create `src/types.ts`** — Shared type definitions needed by all subsequent files
2. **Create `src/context/ToastContext.tsx`** — Toast system (no dependencies on other new code)
3. **Create `src/components/ToastContainer.tsx`** — Toast UI (depends on ToastContext)
4. **Create `src/components/LoadingSpinner.tsx`** — Reusable spinner (no dependencies)
5. **Create `src/components/ErrorBoundary.tsx`** + **`src/components/ErrorFallback.tsx`** — Prevents crashes (no dependencies)
6. **Create `src/components/FormField.tsx`** — Reusable form input (depends on types.ts)
7. **Modify `src/context/NavigationContext.tsx`** — Fix double-tap at the routing level (root cause fix)
8. **Modify `src/App.tsx`** — Add ErrorBoundary, ToastProvider, ToastContainer wrappers
9. **Modify `src/context/SettingsContext.tsx`** — Add `siteUrl` field and migration
10. **Modify `src/data.ts`** — Add missing French translations and new translation keys
11. **Modify `src/index.css`** — Add print styles, toast animations, utility classes
12. **Modify `src/pages/PortalPage.tsx`** — Fix Download, Print, URL parsing, translations
13. **Modify `src/pages/ContactPage.tsx`** — Fix success timing, add field validation
14. **Modify `src/components/WizardModal.tsx`** — Fix success timing, add validation, add loading state
15. **Modify `src/pages/AdminPage.tsx`** — Fix `[website link]`, add loading spinners, add validation, add translations, fix admin download, reduce spacing, add transition guards
16. **Modify `src/components/Header.tsx`** — Add transition guards to navigation buttons
17. **Modify `src/components/Footer.tsx`** — Add transition guards to navigation links
18. **Test all scenarios** — Run through the testing checklist above