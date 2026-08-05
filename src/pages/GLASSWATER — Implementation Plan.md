# GLASSWATER — Implementation Plan

Here's my proposed phased approach, organized by priority and grouped into logical batches to minimize rework. All fixes preserve the existing color palette, layout positions, and UX flow — they're surgical security/code-quality improvements.

---

## PHASE 1: CRITICAL Security Fixes (3 items)

### 1.1 V-02 — Remove Password Hint from Alert (5 min)
**File:** `src/pages/AdminPage.tsx` L191
- Change `alert('Invalid password (hint: admin123)')` → `alert(t('admin.invalidPassword'))` using the i18n system
- **UI impact:** None — alert still fires, just without the hint

### 1.2 V-01 — Hash Admin Password with SHA-256 (15 min)
**Files:** `src/context/SettingsContext.tsx`, `src/pages/AdminPage.tsx`
- Add a `hashPassword()` helper using the **Web Crypto API** (SubtleCrypto — no dependency needed, works in all modern browsers)
- On password save in AdminPage: hash before storing → `localStorage`
- On login check: hash the entered password and compare hashes (constant-time-ish via string comparison)
- Change default password hash from `'GWADMIN'` to its SHA-256 hash
- **Migration:** On first load, detect if existing password is plain text (< 64 chars) → auto-hash it so existing installations upgrade seamlessly
- **UI impact:** None

### 1.3 V-03 — Brute-Force Protection (20 min)
**File:** `src/pages/AdminPage.tsx`
- Track failed attempts in `localStorage` key `glasswater_admin_lockout`
- Lockout logic: 5 failed attempts → 15-minute lockout (store `{ attempts: N, lockUntil: timestamp }`)
- On each failed login: increment counter, set lock timer
- On successful login: clear the lockout state
- On lockout: disable the password input + login button, show countdown timer
- **UI impact:** New disabled state on login form with countdown (`"Too many attempts. Try again in 14:32"`) — small UX addition, no layout change

---

## PHASE 2: HIGH-Priority Fixes (3 items)

### 2.1 V-17 — Replace `dangerouslySetInnerHTML` in HomePage Hero (10 min)
**File:** `src/pages/HomePage.tsx` L48
- The hero title uses `dangerouslySetInnerHTML={{ __html: t('home.hero.title') }}` 
- Change to: parse the translation string for `<br>` or `\n` and render with JSX `{...}` splits instead
- If the only HTML in the title is line breaks, split on `<br/>` and render `<span>` fragments
- **UI impact:** None — title renders identically

### 2.2 V-10 — Validate Social/WhatsApp URLs (15 min)
**Files:** `src/App.tsx`, `src/pages/ContactPage.tsx`
- Add a `sanitizeUrl(url: string, prefix: string)` helper that returns `#` if URL doesn't start with the expected protocol
- Apply to: `settings.whatsapp` (must start with `https://wa.me/` or `https://api.whatsapp.com/`), `facebook`, `instagram`, `linkedin`, `tiktok` (must start with `https://`)
- In Admin settings panel: add `type="url"` and `pattern` attribute for basic client-side validation
- Do NOT use `dangerouslySetInnerHTML` — keep using safe `<a href>`
- **UI impact:** None — broken/malicious URLs just become no-ops

### 2.3 V-04 — Move Firebase Config to Environment Variables (10 min)
**File:** `vite.config.ts`, new `.env` file, `.gitignore`
- Move API key, appId, OAuth client ID from `firebase-applet-config.json` → `.env` (Vite's `VITE_` prefixed vars)
- Create a `.env.example` with placeholder values
- Add `firebase-applet-config.json` to `.gitignore` (keep file locally for existing builds)
- Create `src/config/firebase.ts` that reads from `import.meta.env` with fallback to the JSON for backward compat
- **UI impact:** None

---

## PHASE 3: MEDIUM-Priority Fixes (4 items)

### 3.1 V-07 — Input Validation on Admin Document Fields (25 min)
**File:** `src/pages/AdminPage.tsx`
- Add a `validateDocumentItem(item: DocumentItem): string[]` function
- Rules: quantity ≥ 1, unitPrice ≥ 0, description min 3 chars, discountValue ≥ 0, discount ≤ 100 when percentage
- Show inline validation errors in the document editor modal (red border + helper text)
- Prevent save when validation fails
- **UI impact:** Minor — red highlights on invalid fields, error messages below inputs — stays within design system

### 3.2 V-08 — Fix Dead Code in Document Save Logic (10 min)
**File:** `src/pages/AdminPage.tsx` L132-150
- Rewrite the save handler:
  - If `isEditingOriginal` (code already exists): call `updateDocument()`
  - If code doesn't exist: call `addDocument()` (which internally checks for duplicates)
  - Remove the unreachable inner `codeExists` check
- OR: simply deduplicate by moving the collision check into `addDocument()` itself
- **UI impact:** None

### 3.3 V-18 — Validate Image URLs for CSS `url()` Injection (15 min)
**Files:** `HomePage.tsx`, `ProjectsPage.tsx`, `InsightsPage.tsx`, any other page using inline `backgroundImage`
- Create a `safeCssUrl(url: string): string` helper that:
  - Returns a placeholder image URL if the input doesn't start with `https://` or `/`
  - Strips dangerous characters: `'`, `"`, `(`, `)`, `;`
- Apply to all `style={{ backgroundImage: \`url('${...}')\` }}` patterns
- **UI impact:** None — malicious URLs become placeholder, valid ones render

### 3.4 V-19 — Fix `useState<any[]>([lang])` Bug (5 min)
**File:** `src/pages/HomePage.tsx` L11
- Change `useState<any[]>([lang])` → `useState<any[]>([])`
- Verify the reviews are loaded from localStorage on mount (already happening)
- **UI impact:** Fixes potential crash/broken first review, no visual change

---

## PHASE 4: LOW-Priority Fixes (8 items)

### 4.1 V-11 — File Upload in Wizard: Replace with Info Message (15 min)
**File:** `src/components/WizardModal.tsx` L175
- Replace the non-functional file upload input with text:
  - `"Please email your files to {settings.email} after submitting this quote. Reference your name in the subject line."`
- Add this note to the `mailto:` body as well
- **UI impact:** File input replaced with informative text block — small layout change, same step

### 4.2 V-12 — Wire Wizard Checkboxes to `formData` (15 min)
**File:** `src/components/WizardModal.tsx` L125-129
- Add checkbox boolean fields to `formData` state: `electrical`, `plumbing`, `carpentry`, `painting`
- Add `onChange` handlers: `(e) => setFormData({ ...formData, [name]: e.target.checked })`
- Include checkbox values in the `mailto:` body
- **UI impact:** None — checkboxes look identical, they just actually work now

### 4.3 V-13 — Stronger Document Reference Codes (10 min)
**File:** `src/pages/AdminPage.tsx` L114
- Change from `GW-${1000-9999}` → `GW-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
- 8 hex chars = 4 billion+ possibilities, virtually eliminates collisions
- **UI impact:** Document codes become 11 chars instead of 7 — minor, fits in all layouts

### 4.4 V-14 — Clean Up Root Directory Fix Scripts (5 min)
**Action:** Move all `fix_*.cjs` files to `scripts/migrations/` directory (or delete if confirmed unused)
- Create `scripts/migrations/` directory
- Move all 60+ scripts there
- **UI impact:** None (repository hygiene)

### 4.5 V-15/V-16 — Clean Up `package.json` Dependencies (10 min)
**File:** `package.json`
- Remove from `dependencies`: `@google/genai`, `express`, `dotenv`, `google-drive-downloader`
- Move `vite` from `dependencies` → `devDependencies` only (it's duplicated)
- Run `npm install` / `bun install` to update lockfile
- **UI impact:** None (smaller bundle)

### 4.6 V-20/V-23 — Replace Empty Catch Blocks with Error Logging (20 min)
**Files:** `HomePage.tsx`, `ProjectsPage.tsx`, `InsightsPage.tsx`, `ReviewsPage.tsx`, `AdminPage.tsx`
- Replace all `catch (e) {}` with `catch (e) { console.error('Failed to load X from localStorage:', e); }`
- Add fallback to default data where appropriate
- **UI impact:** None

### 4.7 V-21 — Use Settings Email in Wizard mailto: (5 min)
**File:** `src/components/WizardModal.tsx` L45
- Change `glasswaterfits@gmail.com` → read from `settings.email` (already available via context)
- Add fallback to the hardcoded email if settings email is empty
- **UI impact:** None

### 4.8 Code Quality — Replace `any` Types (ongoing, ~30 min)
**Files:** `AdminPage.tsx`, `HomePage.tsx`, other pages
- Define proper interfaces: `Review`, `Project`, `Post`, `DocumentItem` (some may already exist)
- Replace all `any[]` and `any` state types with proper types
- Remove `as any` assertions on L712, L726
- **UI impact:** None

---

## PHASE 5: Architectural Enhancement (Optional — Largest Impact)

### 5.1 V-09 — Add Firebase Firestore Backend (2-3 hours)
**Files:** New `src/services/firebase.ts`, updates to `SettingsContext.tsx`, `AdminPage.tsx`, all page components
- Sync settings + documents to Firestore (read/write)
- Keep localStorage as offline cache + fallback
- Enable true multi-device document sharing (Portal codes work across browsers)
- Add Firestore security rules so only admin can write
- **UI impact:** None — transparent persistence upgrade

This is the most impactful fix but also the largest. I recommend doing this last, after all other fixes are stable.

---

## Execution Order & Estimated Time

| Phase | Items | Est. Time |
|-------|-------|-----------|
| Phase 1 (CRITICAL) | V-02, V-01, V-03 | ~40 min |
| Phase 2 (HIGH) | V-17, V-10, V-04 | ~35 min |
| Phase 3 (MEDIUM) | V-07, V-08, V-18, V-19 | ~55 min |
| Phase 4 (LOW) | V-11–V-24, code quality | ~2 hours |
| **Core fixes total** | | **~4 hours** |
| Phase 5 (optional) | Firestore backend | ~2-3 hours |

---

## What Stays Unchanged

- ✅ All TailwindCSS v4 utility classes and color tokens
- ✅ All Motion/Framer Motion animations
- ✅ All Lucide React icon usage
- ✅ Hash-based routing system
- ✅ i18n translation system (EN/FR)
- ✅ PDF export with html2pdf.js
- ✅ All page layouts, component positions, spacing
- ✅ `mailto:` contact form approach
- ✅ Floating action buttons on home page
- ✅ Firebase config for existing deployments

---

Would you like me to proceed? If this plan looks good, toggle to **ACT MODE** and I'll work through Phase 1 first, then continue through each phase, reporting progress as I go.