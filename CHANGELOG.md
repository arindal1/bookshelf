# Changelog

All notable changes to this project are documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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

## [0.1.0] — 2026-09-16

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
  explore — driven by mock data (`lib/mock-data.ts`) pending live DB credentials.
- GSAP ScrollTrigger scroll reveals, Framer Motion page/route transitions and
  micro-interactions (hover, press, reader page-turn).