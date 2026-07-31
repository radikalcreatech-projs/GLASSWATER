# Post-Task Audit: Hostile Code Review

You just finished writing code. You are NOT done. You are now your own worst enemy — a hostile senior reviewer who gets paid to find flaws. Your goal is to find EVERY issue, not just the obvious ones. The previous version of this workflow let you get away with fixing 2-3 things and calling it done. That stops now.

**THE RULE:** You will go through every audit phase below. For each phase, you MUST open and re-read every file you created or modified. Do not work from memory — your memory of what you wrote is unreliable. Open the actual file. Read the actual code. Line by line.

**THE LOOP:** After you fix issues from any phase, you have potentially introduced NEW issues. After completing all 6 phases, you will do a FINAL SWEEP of every file you touched during fixes to confirm you did not break anything else.

---

## AUDIT 1 — OPEN EVERY FILE AND TRACE ERROR PATHS

Open each file you created or modified. For every function that calls a server action, API, or database:

**Trace the failure path end-to-end, out loud in your response:**
- The server action throws → what does the catch block do? → does it return `{ error: '...' }`? → does the calling client component check for `.error` on the response? → does it show a toast/alert with that message? → what does the toast say — is it professional or is it developer jargon like "Network Error" or "Fetch failed"?

If at any point in that chain the answer is "nothing" or "it would crash" or "the user would see a blank screen" — that is a bug. Fix it now.

**Specifically check for these common agent failures:**
- Empty catch blocks: `catch (e) {}` or `catch { return }` — these silently eat errors. Find them.
- Catch blocks that return generic messages without logging: you MUST `console.error(error)` before returning.
- Server actions that return `{ success: false }` but the client only checks for `{ error: ... }` — mismatched response shapes.
- `toast.success()` being called even when the action failed because the agent forgot to check the response.
- Missing `try/catch` entirely — the function just assumes the DB call succeeds.

**Do not move to Audit 2 until you have traced EVERY error path in EVERY file.**

---

## AUDIT 2 — DOUBLE-CLICK, RACE CONDITIONS, AND FROZEN UI

Open each file with a form, button, or async operation. For each one:

**Test this scenario in your head:** The user is on a slow hotel WiFi. They click "Submit." Nothing happens for 3 seconds. They click again. And again.

- Is the button disabled while the operation is in progress? Look for `disabled={isPending}` or equivalent. If the button stays clickable during async work, that is a duplicate-submission bug. Fix it.
- Is there a loading indicator? A spinner in the button? A skeleton over the content area? If the user has no visual feedback that something is happening, they WILL click again. Fix it.
- After the operation succeeds, does the UI update automatically? Or does the user need to manually refresh the page to see their changes? Check that `revalidatePath()` is called and that the data is being re-fetched or that the client state is updated.
- Are there any `onClick` handlers that call async functions without `await`? This can cause the function to return immediately, re-enabling the button before the operation finishes.

**Specifically check for:**
- `useTransition` — is `isPending` actually being used to disable the button and show loading state?
- `useState` for loading — is `setLoading(false)` in a `finally` block so it always resets, even on error?
- Forms that use `onSubmit` — is `e.preventDefault()` called?
- Multiple concurrent requests to the same endpoint that could cause race conditions or stale data overwrites.

---

## AUDIT 3 — NULL, UNDEFINED, EMPTY, AND MISSING DATA

Open each file that renders data from the database. For every variable, array, and object:

**Assume the worst. The database returned garbage.**

- You render a list with `.map()` — what if the array is `null`? What if it is `undefined`? What if it is an empty array `[]`? Add null guards (`data?.map(...)` or `data ?? []`) AND render an `<EmptyState>` component for the empty case.
- You access `booking.guest.name` — what if `guest` is null because the relation was not included? This is a runtime crash. Add optional chaining AND check that the Prisma query actually includes the relation.
- You display `item.price.toFixed(2)` — what if `price` is null or undefined? `null.toFixed(2)` crashes. Guard it.
- You use `.length` on something — what if it is null? `null.length` crashes.
- You display a date with `new Date(value).toLocaleDateString()` — what if `value` is null? `new Date(null)` produces "Thu Jan 01 1970." That is wrong but won't crash, so you might miss it. Guard it.
- You conditionally render based on a boolean like `{isActive && <Component />}` — what if `isActive` is `0` instead of `false`? React will render the number `0` on screen. Use `{isActive ? <Component /> : null}` or `{!!isActive && <Component />}`.

**Specifically check for Hotel Aide Pro traps:**
- `RoomStatus` enum: the values are `AVAILABLE`, `OCCUPIED`, `CLEANING`, `MAINTENANCE`, `OUT_OF_ORDER`. NOT `NEEDS_CLEANING`, `DIRTY`, or `VACANT`. If you used a wrong enum value, the query silently returns nothing.
- `BookingStatus` enum: `ACTIVE`, `CHECKED_OUT`, `CANCELLED`, `RESERVED`. NOT `COMPLETED`.
- `GuestOrder` statuses: `pending`, `ready`, `served`. NOT `confirmed`, `rejected`.
- The `Sale` model is FLAT — one row per item. There is NO `SaleItem` child table. If you created or referenced one, delete it immediately.
- Currency is Ghana Cedis: `₵` prefix, `.toFixed(2)`. NOT `$`, not `GH₵`, not `GHS`.

---

## AUDIT 4 — FILE SIZE, ARCHITECTURE, AND SEPARATION OF CONCERNS

Open every file you created or modified. Count the lines. Not approximately — actually count or check the line number at the bottom.

- **Any client component (`.tsx`) over 300 lines?** Stop. Split it into sub-components in the same directory RIGHT NOW. This is not a "nice to have" — it is a hard rule. A 350-line component means your architecture is wrong.
- **Any server action file (`.ts`) over 200 lines?** Split by domain into separate files.
- **Any `page.tsx` over 80 lines?** Move queries to `lib/queries/` and UI to a client component.
- **Any raw `prisma.xxx.findMany()` inside a `page.tsx`?** Move it to a function in `lib/queries/`.
- **Any database mutation inside a client component?** Move it to a server action in `src/actions/`.
- **Any inline `<style>` tags?** Remove them. Move to a `.css` file.
- **Any `dangerouslySetInnerHTML` used for CSS?** Remove it immediately.
- **Any `any` types?** Replace with specific types. Check Prisma-generated types first.
- **Any copy-pasted auth logic?** Must use `requireSession()` from `@/lib/auth`. Delete the copy.
- **Any raw `<button>`, `<input>`, `<select>`, or `<textarea>`?** Replace with components from `src/components/ui/`.

---

## AUDIT 5 — SECURITY, TRANSACTIONS, AND DATA INTEGRITY

For every server action you wrote:

- **Does it start with `await requireSession()` (or `await requireRole([...])`) from `@/lib/auth`?** If not, ANY unauthenticated user can call this action. That is a critical security hole. Fix it.
- **Does any mutation touch more than one table?** If yes, is it wrapped in `prisma.$transaction()`? If not, you have a partial-write risk — the first table updates, the second fails, and your database is now in an inconsistent state. Wrap it.
- **Did you create an `ActivityLog` entry?** Every staff-facing mutation MUST log what happened with `action` in SCREAMING_SNAKE_CASE and `details` containing enough context to reconstruct the event.
- **Did you call `revalidatePath()` for ALL affected routes?** Not just the current page — if you updated a room, revalidate `/dashboard`, `/rooms`, and any other page that displays room data.
- **Are you returning too much data?** Use Prisma `select` to return only the fields the UI needs. Never return `pin_hash`, internal audit fields, or full staff records to the client.
- **Are you exposing sensitive information in error messages?** Error messages must be professional and vague: "We couldn't process this right now" — NOT "Prisma query failed: relation guest not found."

---

## AUDIT 6 — VISUAL QUALITY AND DESIGN CONSISTENCY (UI only)

If you built or modified any UI, open the affected pages in your mental model and compare them against 2-3 existing screens in the app:

- **Does your page look like it belongs in the same application?** Same spacing, same card styles, same header patterns, same button placement.
- **Are you using CSS variable colors everywhere?** Search your code for any hardcoded hex color (`#fff`, `#333`, `rgb(...)`) or named color (`red`, `blue`). Replace with `var(--color-name)`.
- **Does dark mode work?** Every background, text color, border, and shadow must use CSS vars that respect the theme. If you hardcoded `white` or `#000`, it will break in the opposite theme.
- **Does the layout work on mobile?** Grids with fixed column counts break on small screens. Tables with many columns overflow. Long text gets cut off. Buttons become too small to tap. Check all of these.
- **Are hover states implemented?** Every clickable element needs visual feedback on hover — a background color change, underline, opacity shift, or scale transform.
- **Are disabled states implemented?** Buttons during loading should look visibly different (grayed out, reduced opacity) so the user knows they cannot interact.
- **Is there any layout shift or content jump when data loads?** If content pops in and pushes everything down, add a skeleton with the same dimensions as the expected content.

---

## FINAL SWEEP — THE LOOP

You have now gone through 6 audit phases and potentially made fixes in each one. Those fixes may have introduced new problems.

**Open every file you touched during the audit (not just the original task — the audit fixes too). Do one final check:**

1. All imports are intact — you did not accidentally delete an import while editing.
2. No TypeScript errors — no red squiggly lines, no type mismatches, no missing properties.
3. The component still renders correctly — your fixes did not break the layout or logic.
4. Any new code you added during fixes also follows all the rules above (try/catch, loading states, null guards, etc.).

**Only after this final sweep can you present your work.**

---

## OUTPUT FORMAT

When you are done, report your findings like this:

```
## Audit Results

### Issues Found and Fixed:
1. [File: path] — [What was wrong] → [What you did to fix it]
2. [File: path] — [What was wrong] → [What you did to fix it]
...

### Issues Found During Final Sweep (post-fix):
1. [File: path] — [What was wrong] → [What you did to fix it]
...

### Remaining Concerns (if any):
- [Anything that needs user input or is outside your scope]

### Post-Flight Confirmation:
- [ ] All original imports intact
- [ ] Zero TypeScript errors
- [ ] Zero `any` types
- [ ] All Prisma queries verified against schema
- [ ] ActivityLog entries for all staff actions
- [ ] revalidatePath() for all affected routes
- [ ] PROJECT_STATUS.md updated
- [ ] BACKLOG.md updated if applicable
- [ ] All files under line limits (300/200/80)
- [ ] No inline CSS or dangerouslySetInnerHTML
- [ ] Auth uses requireSession() from @/lib/auth
- [ ] No raw HTML form elements — using component library
```

If the "Issues Found" section is empty, you are lying. Go back and look harder. Every codebase has something to improve. Your job is to find it.
