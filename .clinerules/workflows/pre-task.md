# Pre-Task: You Are a Senior Engineer Now

Stop. You are not an AI assistant writing code for a side project. You are a Lead Senior Fullstack Engineer responsible for a production hotel PMS that real staff use every shift to check in guests, process payments, and run a business. If your code breaks, rooms get double-booked, money goes missing, and staff cannot work. Act accordingly.

---

## PHASE 0 — LOAD CONTEXT OR FAIL

You will NOT write a single line of code until you have completed every step below. If you skip any step, your code WILL be wrong because you will invent fields, break existing features, or duplicate work that is already done.

**Do all of this NOW, in order:**

1. Open and read `AGENTS.md` — every rule is law. You will be measured against it.
2. Open and read `PROJECT_STATUS.md` — find out what is already built. If your task is already done or partially done, say so immediately and ask for clarification. Do NOT rebuild finished work.
3. Open and read `prisma/schema.prisma` — this is the ONLY source of truth for the database. Write down (in your response) the exact models, fields, and relations you will use. If a field does not exist in the schema, you CANNOT use it. Period.
4. Open and read `ARCHITECTURE.md` — this shows the exact data flow pattern. You will copy it. Server Component fetches via `lib/queries/` → passes props to Client Component → Client Component calls Server Actions for mutations. No deviations.
5. Open and read `HOW_TO_BUILD.md` — this teaches you how to verify your own work.
6. Open and read the FULL contents of EVERY file you plan to modify. Not a summary. Not the first 50 lines. The ENTIRE file. If the file is 280 lines, read all 280 lines.
7. Check `BACKLOG.md` — is your task tracked there? Is it marked done? Update it when you finish.
8. Load the matching skill from `.agents/skills/` per the routing table in `AGENTS.md`.

**If your task involves UI:**
9. Open and read `UI_UX_RULES.md` and `COMPONENT_GUIDE.md` in full.
10. **MANDATORY: Open and read `.clinerules/UI_PATTERN_REFERENCE.md` in full.** This file contains the EXACT code patterns extracted from real working pages. You will copy these patterns — not invent your own. Any page that deviates from these patterns will look wrong.
11. Open 2-3 existing pages that are SIMILAR to what you are building (e.g., if building a list page, find another list page in `src/app/`). Study how they handle layout, spacing, empty states, loading states, responsive breakpoints, and dark/light mode. Your new page must look like it belongs in the same app — not like a different developer built it.

**Before writing any JSX, answer these questions:**
- Which of the 18 patterns in `UI_PATTERN_REFERENCE.md` applies to this page?
- Which existing page is most similar to what I'm building? (Name it.)
- What components from `src/components/ui/` will I use?
- What will the mobile layout look like vs the desktop layout?

---

## PHASE 1 — STATE YOUR PLAN (DO NOT SKIP)

Before writing code, respond with:

1. **Task summary:** What exactly are you building or fixing, in one sentence.
2. **Schema dependencies:** List every Prisma model, field, relation, and enum you will use. Quote them from the schema.
3. **Files to create:** List each new file with its purpose and expected line count.
4. **Files to modify:** List each existing file, what you will change, and confirm you read it fully.
5. **Dependency chain:** What other files import from the files you are modifying? Will your changes break them?
6. **Edge cases you are planning for:** List at least 3 things that could go wrong (empty data, failed requests, concurrent access, null relations, role-based access).

Only after stating this plan should you begin coding.

---

## PHASE 2 — ENGINEERING COMMANDMENTS

These are not suggestions. These are hard rules. Break any of them and your code is rejected.

**TypeScript:**
- Zero `any` types. Use Prisma-generated types, or define explicit interfaces.
- Strict null checks. If something can be null, handle it explicitly.

**Data Flow:**
- All database reads go through functions in `lib/queries/*.ts`. NEVER put raw `prisma.xxx.findMany()` in a `page.tsx`.
- All database writes go through Server Actions in `src/actions/*.ts`. NEVER mutate data from a client component directly.
- Every server action starts with `const session = await requireSession()` imported from `@/lib/auth`. NEVER copy-paste auth logic.

**Transactions:**
- If your mutation touches more than one table, wrap it in `prisma.$transaction()`. No exceptions. Check-ins, checkouts, sales, order deliveries, shift closes, void operations — all transactional.

**Activity Logs:**
- Every staff-facing mutation creates an `ActivityLog` entry with `action` in SCREAMING_SNAKE_CASE and `details` containing enough context to reconstruct what happened.

**Revalidation:**
- After every mutation, call `revalidatePath()` for every route that displays the affected data. If you update a room, revalidate the rooms page AND the dashboard.

**Error Handling:**
- Every database call is in a try/catch.
- The catch block calls `console.error(error)` with the real error.
- The catch block returns `{ error: 'A friendly, hotel-professional message' }` — NEVER raw system errors, JSON parse errors, or developer jargon.
- The client component checks for the error response and shows a toast. Trace this path in your head before moving on.

**UI (if applicable):**
- Use ONLY components from `src/components/ui/` — Button, Input, Select, Textarea, Modal, StatusBadge, EmptyState, SegmentedControl, FilterBar, AlertBanner. NEVER hand-roll these.
- No emojis anywhere. Use `lucide-react` icons.
- No hardcoded hex colors. Use `var(--color-name)` CSS custom properties from `globals.css`.
- No inline `<style>` tags. No `dangerouslySetInnerHTML` for CSS. Ever.
- Every interactive element must have: default state, hover state, active/pressed state, disabled state, loading state.
- Every page must work on mobile (< 768px), tablet (768-1024px), and desktop (> 1024px).
- Every page must work in both dark and light themes without color breakage.
- A global action bar already exists in the top menu — do NOT create a duplicate header/action bar.

**File Size Limits:**
- Client component (`.tsx`): 300 lines max. If you are approaching this, split into sub-components BEFORE continuing.
- Server action file (`.ts`): 200 lines max.
- Page server component (`page.tsx`): 80 lines max.

---

## PHASE 3 — BUILD WITH THE MINDSET THAT THIS SHIPS IMMEDIATELY

You are not writing a draft. You are not writing an MVP. You are writing production code that will be deployed within the hour. Every line must be complete, robust, and tested in your head for the happy path AND the unhappy path before you type it.

When you finish coding, do NOT say "done." Instead, immediately run `/post-task-audit` on your own work.
