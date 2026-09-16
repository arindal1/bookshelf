# Bookshelf

A personal digital library — build a shelf, read books in the browser, track
progress, and discover other readers. See [docs/PRD.md](docs/PRD.md) for the full
product spec and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how it's built.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Prisma · Neon PostgreSQL ·
NextAuth.js (Auth.js v5) · GSAP · Framer Motion · React Three Fiber (GLSL).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real secrets before enabling live auth/DB
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app runs fully against
mock data (`lib/mock-data.ts`) out of the box — no database is required to
explore the UI. Credentials sign-in works against a mock account; Google/GitHub
OAuth activate automatically once their env vars are set.

## Database (optional, for live data)

```bash
npx prisma generate
npx prisma migrate dev
```

## Docs

- [docs/PRD.md](docs/PRD.md) — product requirements
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — layering, rendering, auth/data flow
- [docs/MAP.md](docs/MAP.md) — route and component map
- [docs/DESIGN.md](docs/DESIGN.md) — design system (dark neobrutalist/data-brutalist)
- [docs/DECISIONS.md](docs/DECISIONS.md) — ADR log
- [docs/memorybank.md](docs/memorybank.md) — institutional memory
- [CHANGELOG.md](CHANGELOG.md)