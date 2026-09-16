# DECISIONS.md — Architecture Decision Records

## ADR-001: Next.js App Router + Prisma + Neon + Tailwind

**Decision:** Adopt stack exactly as specified in PRD §20.
**Rationale:** PRD mandates it; App Router gives RSC for data-heavy dashboard/search
pages while keeping motion-heavy islands client-only.

## ADR-002: Mock-data-first delivery for MVP UI phase

**Decision:** Ship the full UI (dashboard, book details, reader, search, profile,
explore) against `lib/mock-data.ts` rather than a live Neon connection.
**Rationale:** No `DATABASE_URL` / OAuth credentials were provided. Building the
Prisma schema + server action contracts now, backed by mock data behind the same
interfaces, means swapping in a live DB later is a repository-layer change only —
no UI or action-signature changes required.
**Status:** Accepted. Revisit once real Neon + OAuth credentials are supplied.

## ADR-003: Dark Neobrutalist × Data-Brutalist design direction

**Decision:** Single, committed direction (no multi-concept bake-off) given this is
a functional MVP build, not a marketing-site exploration.
**Rationale:** User explicitly specified "dark, minimal, Brutalism" — this collapses
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
(security requirement — never invent credentials).

## ADR-006: Demo credentials provider requires a real password check

**Decision:** The Credentials provider's `authorize` now requires the submitted
password to match `DEMO_USER_PASSWORD` (env-configurable, default `readmore-demo`)
via a constant-time comparison, instead of accepting any non-empty password.
**Rationale:** The prior implementation was an authentication bypass — any email
and any non-empty password logged the caller in as the mock reader account. This
still isn't a real per-user credential store (see ADR-002), but it closes the "no
check at all" hole while a live Neon-backed user store is pending.
**Status:** Accepted. Superseded once `authorize` is swapped for a Prisma user
lookup + bcrypt compare against real accounts.