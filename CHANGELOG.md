# Changelog

All notable changes to this project are documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.3.1]

### Fixed

- `prisma/seed.ts`'s `seedBooksWithPages()` unconditionally upserted
  `generateBookPages()` placeholder content and `pageCount` on every seed run,
  silently overwriting real content previously imported via
  `scripts/import-book-content.ts` - the reader would show placeholder text
  again after any later `npx prisma db seed`. It now skips placeholder-page
  seeding entirely for books that already have `BookPage` rows, and no longer
  touches `pageCount` on update (owned by the import script once real content
  exists).
- Auth redirects (post-login/signup, proxy.ts protected-route bounce) would
  sometimes land on `http://localhost:3000` instead of the deployed origin.
  Auth.js only trusts `AUTH_URL`/`NEXTAUTH_URL` for internal callback/redirect
  URLs unless the request's Host header is explicitly trusted; added
  `trustHost: true` to the `NextAuth()` config in `lib/auth.ts`.

## [0.3.0]


### Fixed

- Explore, Search, the landing page, dashboard shelves, and the reader all read
  exclusively from `lib/mock-data.ts`'s in-memory `books`/`authors` arrays, so any
  book inserted directly into the live DB never appeared anywhere in the UI even
  though it existed. The reader's `generateBookPages()` also always synthesized
  placeholder text (capped at 40 pages) instead of ever reading real imported
  `BookPage` rows, so content pushed via `scripts/import-book-content.ts` was
  never actually served - only the description/summary placeholder, repeated.
  Added `server/repositories/book-repository.ts` (Prisma queries for
  Book/Author/BookPage) and `server/services/book-service.ts` (`getCatalog`,
  `getBookDetails`, `getBookForReader` - derives the UI-only `coverTone`/`tags`/
  `readingTimeMinutes` fields that aren't real Prisma columns, and falls back to
  `generateBookPages()` only when a book genuinely has zero imported `BookPage`
  rows). Migrated `app/explore`, `app/search` (+ new `SearchClient`), `app/(site)`
  (+ `LandingClient` now takes `trending`/`authors` as props), `app/books/[slug]`,
  `app/reader/[bookId]`, `app/sitemap.ts`, `ShelfBoard`, and `ContinueReadingRail`
  onto these. `BookGrid` now takes `authors` as a required prop instead of
  resolving them from mock data internally. Shelf/reading-progress state (which
  book) is unaffected - still `lib/mock-data.ts` per ADR-002/ADR-006, see
  ADR-009. See "Known Issues" below: real book content import now actually renders.
- Shelf/reading-progress mutations (`lib/actions/shelf.ts`) previously wrote to
  a single shared in-memory mock singleton keyed to one hardcoded demo user
  (`lib/mock-data.ts`'s `currentUserId`), so every signed-in account saw and
  mutated the same shelf state, and nothing survived a server restart. Added
  `server/repositories/shelf-repository.ts` and `server/services/shelf-service.ts`
  backed by Prisma's `Shelf` table (`@@unique([userId, bookId])`), scoped to the
  authenticated session's real `userId`. `moveToShelf`/`saveReadingProgress` now
  require a session and return `{ ok: false, error }` instead of silently
  mutating mock state when unauthenticated. `app/books/[slug]`,
  `app/reader/[bookId]`, `ShelfBoard`, and `ContinueReadingRail` now resolve
  shelf data per the signed-in user via Prisma instead of the mock singleton.
  Also fixed: the profile page's "Public shelf" section previously rendered
  every book in the catalog tagged with whichever shelf status the shared mock
  singleton happened to have, regardless of which profile was being viewed - it
  now shows only the *viewed* user's actually-shelved books.

### Known Issues / Deferred

- `ReadingHistory` (page-by-page view events, distinct from `Shelf`'s
  current-page/percent snapshot) is still unused - no write path exists for it.
  Not part of any reported bug; flagged for future scope only.

## [0.2.1]

### Fixed

- Dashboard always greeted the signed-in user as the hardcoded demo profile
  (`lib/mock-data.ts`'s `profile.name`, "Marion Arlen") instead of the real
  session user, because the page never read the NextAuth session at all.
  `app/dashboard/page.tsx` now calls `auth()` and greets `session.user.name`
  (falling back to the mock name only when unauthenticated/mid-migration).
- The NextAuth session/JWT never carried the real user's `id`/`username`
  (only the library defaults: name/email/image), so no page could reliably
  identify "is this the signed-in user's own profile?" or link to it. Added
  `jwt`/`session` callbacks in `lib/auth.ts` and a `username` field on
  `verifyCredentials`'s return value to populate `session.user.id` and
  `session.user.username`; typed via `types/next-auth.d.ts`.
- There was no way to set a user's bio: the profile page only ever rendered
  the hardcoded mock profile object and had no edit affordance. Added
  `server/services/profile-service.ts` (`setUserBio`, 280-char cap) +
  `updateUserBio` repository method, a `updateBio` server action
  (`lib/actions/profile.ts`), and a `BioForm` client island rendered on a
  user's own profile page. The profile page (`app/profile/[username]/page.tsx`)
  now resolves the viewed user from Prisma (`findUserByUsername`) instead of
  the mock profile, so real registered users get a real profile page. Also
  added a "Profile" link to `NavBar` so signed-in users can reach it.
- Explore only ever rendered a "Trending" (6) and "Recently added" (4) slice
  of the catalog, so most books were unreachable from Explore even though
  Search (which scans the full catalog) could find them. Added a "Catalog /
  All books" section to `app/explore/page.tsx` showing every book.
- Three books' `coverImage` values pointed at Wikipedia *article* pages
  (`.../wiki/Some_Article#/media/File:...`, which serve HTML, not an image)
  instead of the raw file, so `BookCover`'s `onError` fallback always fired
  for them ("I Have No Mouth, and I Must Scream", "A Study in Scarlet", "The
  Hound of Baskervilles"). Repointed to Wikipedia's `Special:FilePath/<file>`
  redirect, which always resolves to the actual image.
- The B&W cover treatment used full `grayscale`, not the intended 70%. Changed
  `BookCover` to `grayscale-[70%]`.

## [0.2.0]

### Fixed

- Sign-up was completely broken (502): `AuthForm` called `signIn("credentials")` in
  signup mode with no account-creation step first, so it hit the Credentials
  provider's `authorize`, which only ever recognized the single hardcoded demo
  password - there was no code path that created a `User` row at all. Added a real
  registration path: `lib/actions/auth.ts` (`registerAccount` server action) →
  `server/services/auth-service.ts` (`registerUser`, bcrypt-hashed) →
  `server/repositories/user-repository.ts` (Prisma). `AuthForm` now calls
  `registerAccount` before `signIn` when `mode === "signup"`.
- Cover images never rendered even when a valid `coverImage`/`photoUrl` was present
  in data: `BookCover` never accepted or rendered an image `src` at all - it only
  ever painted the generated gradient panel with the title text on top. Added
  image rendering with `onError` fallback to the gradient panel (so a dead/broken
  URL degrades gracefully instead of showing a broken-image icon), and wired
  `book.coverImage` through every call site (`BookCard`, book details page,
  `LandingClient`, search results). Added `components/ui/AuthorPhoto.tsx` for the
  same reason on the book details "About the author" section.

### Security

- `lib/auth.ts`'s Credentials provider was still checking against a single shared
  `DEMO_USER_PASSWORD` for any email (ADR-006's interim fix) rather than a real
  per-user credential store - this made every login/authorize path a demo-only
  shortcut, and it was also the reason signup couldn't work. `authorize` now calls
  `verifyCredentials` (bcrypt compare against the real `User.passwordHash` column).
  See ADR-007.
- Added a shared in-memory rate limiter (`lib/rate-limit.ts`) applied to both the
  signup server action (5 requests / 15 min per IP) and the Credentials
  `authorize` callback (10 attempts / 15 min per IP) to blunt credential-stuffing
  and account-enumeration attempts. Documented as single-instance only; needs a
  shared store (Redis/Upstash) before horizontal scaling.
- Added baseline security response headers in `next.config.ts`
  (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `Strict-Transport-Security`).
- `lib/actions/shelf.ts` server actions (`saveReadingProgress`, `moveToShelf`) took
  `bookId`/`pageNumber`/`status` straight from the client with no server-side
  validation - server actions are public network-reachable endpoints regardless of
  which component calls them. Added zod validation for all three inputs.

### Added

- `lib/prisma.ts` - singleton `PrismaClient` (standard Next.js dev hot-reload
  pattern) so the new auth code path doesn't open a new connection per request.
- `server/repositories/user-repository.ts`, `server/services/auth-service.ts` -
  first real (non-mock) repository/service pair, per the `lib/actions` →
  `server/services` → `server/repositories` → Prisma layering in
  `copilot-instructions.md`.

## [0.1.1]

### Fixed

- `NavBar` had no mobile layout: the logo, 3 nav links, and sign-in/out control were
  forced into one row with no wrap handling, overflowing the viewport below the
  `md` breakpoint. Added a `md:hidden` "Menu" toggle that reveals a stacked mobile
  nav panel; the inline link row remains `md:flex`-only for larger viewports.

### Security

- Fixed an authentication bypass in the Credentials provider (`lib/auth.ts`):
  `authorize` previously accepted any non-empty password for any email. It now
  requires an exact, constant-time match against `DEMO_USER_PASSWORD` (see
  `.env.example`, `docs/DECISIONS.md` ADR-006).

### Fixed

- `docs/ARCHITECTURE.md` referenced a `middleware.ts` file that no longer exists;
  Next.js 16 renamed it to `proxy.ts`. Doc corrected to match.
- `docs/memorybank.md` referenced `tailwind.config.ts`, which this project does not
  use (Tailwind v4 CSS-first config via `@theme inline` in `app/globals.css`).

## [0.1.0] - 2026-09-16

### Added

- Initial Next.js (App Router, TS, Tailwind) project scaffold.
- Support documentation: `ARCHITECTURE.md`, `MAP.md`, `DESIGN.md`, `DECISIONS.md`,
  `memorybank.md`, `.github/copilot-instructions.md`.
- Dark neobrutalist / data-brutalist design system (tokens, type stack, motion system).
- Prisma schema modeling PRD §18 (Users, OAuth Accounts, Authors, Books, Book Pages,
  Shelves, Reading History).
- NextAuth configuration (Credentials + Google + GitHub providers), route-protection
  middleware.
- GLSL/WebGL generative background (`GLBackground`, React Three Fiber) with
  scroll/cursor-reactive flow field, reduced-motion static fallback.
- Pages: landing, login, signup, dashboard, book details, reader, profile, search,
  explore - driven by mock data (`lib/mock-data.ts`) pending live DB credentials.
- GSAP ScrollTrigger scroll reveals, Framer Motion page/route transitions and
  micro-interactions (hover, press, reader page-turn).