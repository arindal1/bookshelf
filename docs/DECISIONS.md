# DECISIONS.md - Architecture Decision Records

## ADR-001: Next.js App Router + Prisma + Neon + Tailwind

**Decision:** Adopt stack exactly as specified in PRD §20.
**Rationale:** PRD mandates it; App Router gives RSC for data-heavy dashboard/search
pages while keeping motion-heavy islands client-only.

## ADR-002: Mock-data-first delivery for MVP UI phase

**Decision:** Ship the full UI (dashboard, book details, reader, search, profile,
explore) against `lib/mock-data.ts` rather than a live Neon connection.
**Rationale:** No `DATABASE_URL` / OAuth credentials were provided. Building the
Prisma schema + server action contracts now, backed by mock data behind the same
interfaces, means swapping in a live DB later is a repository-layer change only -
no UI or action-signature changes required.
**Status:** Accepted. Revisit once real Neon + OAuth credentials are supplied.

## ADR-003: Dark Neobrutalist × Data-Brutalist design direction

**Decision:** Single, committed direction (no multi-concept bake-off) given this is
a functional MVP build, not a marketing-site exploration.
**Rationale:** User explicitly specified "dark, minimal, Brutalism" - this collapses
the `immersive-web-design` skill's normal 5–6 direction fan-out to the one direction
requested, refined instead of multiplied. See [DESIGN.md](DESIGN.md).

## ADR-004: WebGL background must never block content or fail ungracefully

**Decision:** `GLBackground` is lazy, `ssr:false`, capped at 30fps, paused off-screen,
and fully replaced by a static frame under `prefers-reduced-motion` or WebGL-unsupported
contexts.
**Rationale:** Immersive-web-design skill's non-negotiable perf/a11y guardrail for
any WebGL/shader direction.

## ADR-005: Auth wired but not live

**Decision:** NextAuth config (Credentials + Google + GitHub) is implemented in full,
but requires secrets in `.env` to function. Middleware protects routes based on
NextAuth session regardless of provider being live.
**Rationale:** Matches PRD §16 functional requirement without fabricating secrets
(security requirement - never invent credentials).

## ADR-006: Demo credentials provider requires a real password check

**Decision:** The Credentials provider's `authorize` now requires the submitted
password to match `DEMO_USER_PASSWORD` (env-configurable, default `readmore-demo`)
via a constant-time comparison, instead of accepting any non-empty password.
**Rationale:** The prior implementation was an authentication bypass - any email
and any non-empty password logged the caller in as the mock reader account. This
still isn't a real per-user credential store (see ADR-002), but it closes the "no
check at all" hole while a live Neon-backed user store is pending.
**Status:** Accepted. Superseded once `authorize` is swapped for a Prisma user
lookup + bcrypt compare against real accounts.

## ADR-007: Real Prisma-backed registration and login

**Decision:** Replaced the single-shared-password demo Credentials check with a
real per-user credential store: `registerAccount` (server action) → `registerUser`
(service, bcrypt-hashes with 12 salt rounds, rejects duplicate email/username) →
`user-repository` (Prisma). `authorize` now calls `verifyCredentials`, which looks
up the user by email and `bcrypt.compare`s the password. Both the signup action and
`authorize` are rate-limited (in-memory, per-IP) against brute-force/enumeration.
**Rationale:** Sign-up was non-functional (502) because no code path ever created a
`User` row - `AuthForm` called `signIn("credentials")` directly, which only ever
matched the hardcoded `DEMO_USER_PASSWORD`. This closes that gap and finishes the
migration ADR-006 flagged as pending.
**Consequence:** `DATABASE_URL` must be provisioned and migrated
(`npx prisma migrate dev`), and `npx prisma generate` run, before login/signup work.
The demo account (seeded via `prisma/seed.ts`) now has a real bcrypt hash of
`DEMO_USER_PASSWORD` instead of being bypassed at the provider level.
**Status:** Accepted. ADR-006 is now fully superseded.

## ADR-008: Session carries real user id/username; profile page reads Prisma

**Decision:** `lib/auth.ts` now sets `jwt`/`session` callbacks so
`session.user.id`/`session.user.username` are populated from the real Prisma user
(via `verifyCredentials`), instead of NextAuth's library defaults (name/email/image
only). `app/profile/[username]/page.tsx` resolves the viewed profile via
`findUserByUsername` (Prisma) rather than the hardcoded mock `profile` object, and
`app/dashboard/page.tsx` greets `session.user.name`. A new bio-edit path
(`lib/actions/profile.ts` → `server/services/profile-service.ts` →
`user-repository.updateUserBio`) lets a signed-in user edit their own bio.
**Rationale:** Real signup/login (ADR-007) meant every non-demo user landed on a
dashboard/profile that only ever displayed the hardcoded demo profile, with no way
to set a bio at all - the User domain was auth-real but display-mock.
**Scope/consequence:** This intentionally does **not** migrate Book/Author/Shelf/
BookPage off `lib/mock-data.ts` - that remains ADR-002 (mock-data-first) as
written at the time. Explore/Search/the reader still read the mock catalog and
the reader's placeholder page generator as of this ADR; see ADR-009 for that
follow-up migration.
**Status:** Accepted.

## ADR-009: Book/Author/BookPage domain migrated to Prisma; Shelf/progress remain mock

**Decision:** Added `server/repositories/book-repository.ts` (thin Prisma queries)
and `server/services/book-service.ts` (`getCatalog`, `getBookDetails`,
`getBookForReader`), and migrated every book-listing surface (`app/explore`,
`app/search`, `app/(site)` landing, `app/books/[slug]`, `app/reader/[bookId]`,
`app/sitemap.ts`, `ShelfBoard`, `ContinueReadingRail`) from `lib/mock-data.ts`'s
`books`/`authors` arrays onto it. `BookGrid` now takes `authors` as a required
prop instead of resolving them internally from mock data. The reader now prefers
real imported `BookPage` rows (`scripts/import-book-content.ts`) and only falls
back to `generateBookPages()`'s placeholder text when a book has zero imported
pages.
**Rationale:** Books/authors inserted directly into the live DB were invisible
everywhere in the UI (every book-listing page only ever read the static mock
arrays), and real imported book content was never served - the reader always
regenerated ≤40 placeholder pages regardless of what was in `BookPage`. This
reverses the book-domain portion of ADR-002; ADR-002 remains in effect for
Shelf/ReadingHistory (see below).
**Consequence:** The Prisma `Book` model has no `tags`/`coverTone`/
`readingTimeMinutes` columns - those were UI-only concerns invented for the
mock-data phase. Rather than a schema migration, `book-service.ts` derives them
deterministically from real columns (`genre` → single-tag list, a hash of `id` →
cover tone, `pageCount` → estimated reading time) so any DB-inserted book renders
correctly with zero additional setup.
**Scope:** Shelf/reading-progress mutations (`lib/actions/shelf.ts`,
`setShelfStatus`, `setReadingProgress`) still target the in-memory mock
singleton, not Prisma's `Shelf`/`ReadingHistory` tables - out of scope for this
ADR, superseded by ADR-010 below.
**Status:** Accepted.

## ADR-010: Shelf/reading-progress migrated to Prisma, scoped per real user

**Decision:** Added `server/repositories/shelf-repository.ts` and
`server/services/shelf-service.ts`, backed by Prisma's `Shelf` table
(`@@unique([userId, bookId])`). `lib/actions/shelf.ts`'s `moveToShelf` and
`saveReadingProgress` now resolve the real signed-in `userId` via `auth()` and
persist there instead of mutating `lib/mock-data.ts`'s single shared
`shelves` array (which was always keyed to one hardcoded `currentUserId`).
Both actions return `{ ok: false, error }` when there is no session, rather
than silently mutating shared mock state. `app/books/[slug]`,
`app/reader/[bookId]`, `ShelfBoard`, and `ContinueReadingRail` now read shelf
state per the authenticated session's `userId` from Prisma; the profile page's
"Public shelf" section reads the *viewed* user's shelf (previously it rendered
every catalog book tagged with whichever status the one shared singleton had,
regardless of which profile page was open).
**Rationale:** Every account that signed in (post ADR-007 real auth) shared one
demo account's shelf state - moving a book to a shelf as one user was visible
to, and overwritable by, every other user, and none of it survived a server
restart. This was the last book-adjacent domain still on ADR-002's mock-data
singleton.
**Consequence:** `ReadingHistory` (per-view-event history, distinct from
`Shelf`'s current-page/percent snapshot) remains unused; no functional
requirement currently needs it. `lib/mock-data.ts`'s shelf mutator/getter
functions (`getShelfForBook`, `getShelvesByStatus`, `setShelfStatus`,
`setReadingProgress`, `getBookById`) were removed as dead code - no remaining
caller after this migration. `prisma/seed.ts` still seeds the mock `shelves`
array's rows for the demo account on `db seed`, which is a legitimate one-time
bootstrap, not a runtime dependency on mock data.
**Status:** Accepted. ADR-002 no longer applies to any part of the book/shelf
domain; it now only governs `lib/mock-data.ts`'s `profile.favoriteGenres`
display fallback (see `app/profile/[username]/page.tsx`).