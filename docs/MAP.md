# MAP.md - Route & Component Map

## Route tree

```
/                          Landing (guest) - hero, trending strip, CTA
/login                     Email/password + OAuth sign in
/signup                    Email/password sign up
/dashboard                 Protected - continue reading, shelves, recommended
/books/[slug]              Book details
/reader/[bookId]           Full-page reader (protected)
/profile/[username]        Public profile
/search                    Global search (books, users, authors)
/explore                   Trending / popular authors / community shelves
```

## Component map

```
components/
  ui/          Button, Card, Tag, ProgressBar, Input, Avatar, HairlineRule, Marquee,
               BookCover (image + gradient fallback), AuthorPhoto (image + fallback)
  books/       BookCard, BookGrid, BookHero, ShelfSelector
  reader/      ReaderShell, ReaderControls, PageView, ProgressHUD
  dashboard/   ContinueReadingRail, ShelfBoard, SectionHeader
  auth/        AuthForm, OAuthButtons
  visual/      GLBackground (R3F canvas), GrainOverlay, CursorDot, SplitText
```

## Server-side layers

```
lib/prisma.ts            Singleton PrismaClient
lib/rate-limit.ts         In-memory per-key rate limiter (single-instance)
lib/actions/auth.ts       registerAccount server action (signup)
lib/actions/shelf.ts      saveReadingProgress / moveToShelf server actions
server/services/          auth-service.ts (registerUser, verifyCredentials)
server/repositories/      user-repository.ts (Prisma queries)
```

## Layout hierarchy

```
app/layout.tsx                - fonts, GLBackground mount point, GrainOverlay, CursorDot
  (marketing)/layout.tsx      - public nav/footer
    page.tsx                  - landing
  (auth)/layout.tsx           - centered auth shell
    login/page.tsx
    signup/page.tsx
  dashboard/layout.tsx        - app shell nav (protected)
    page.tsx
  books/[slug]/page.tsx
  reader/[bookId]/page.tsx    - own minimal chrome (no global nav)
  profile/[username]/page.tsx
  search/page.tsx
  explore/page.tsx
```