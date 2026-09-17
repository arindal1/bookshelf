# DESIGN.md - Bookshelf Design System

**Direction:** Data-Brutalist × Neobrutalism hybrid, dark-dominant.
**Thesis:** *"A library run by a machine that respects the reader - raw structure,
exposed data (page counts, progress, timestamps), zero decoration that doesn't
carry information."*

References mined (composition/motion only, never copied verbatim): Swiss grid
posters (Müller-Brockmann) for structure; data-brutalist/technical-HUD dossier for
the reticle/coordinate motifs; neobrutalist hard-edge cards for book covers.

## 1. Palette (OKLCH-authored, off-black/off-white)

| Token | Value | Use |
|---|---|---|
| `--surface` | `#0A0A0B` | app ground |
| `--surface-raised` | `#141416` | cards, panels |
| `--ink` | `#F2EFE9` | primary text |
| `--ink-muted` | `#8B8B90` | secondary text, captions |
| `--accent` | `#C6F84E` | acid lime - signal color, used sparingly (progress, active state, focus) |
| `--line` | `#2A2A2E` | hairline borders (2px solid, brutalist hard edge) |
| `--danger` | `#FF4D4D` | destructive/error |

Tokens are declared in `app/globals.css` under `:root` and bound into Tailwind v4's
`@theme inline` block (this project has no `tailwind.config.ts` - Tailwind v4 is
CSS-first). No gradients on large surfaces. No pure `#000`/`#fff`.

## 2. Typography

- **Display:** Space Grotesk (variable) - headings, oversized numerals, section markers.
- **Text:** Inter Tight - body, UI labels.
- **Mono:** JetBrains Mono - metadata (page counts, progress %, timestamps, coordinates).

Scale uses `clamp()` fluid sizing; display tracking `-0.03em`, leading `0.9`. Body
leading `1.6`, measure 65ch.

## 3. Layout & Composition

- 12-col editorial grid with visible hairline column rules on desktop (`.grid-editorial`).
- Hard 2px borders (`border: 2px solid var(--line)`) instead of soft shadows - brutalist
  card language. No `shadow-lg`, no `backdrop-blur` as universal chrome.
- Oversized numerals (`01 - 02 - 03`) as section markers instead of icons.
- Asymmetric hero: type-led, oversized headline bleeding toward viewport edge.

## 4. The Signature Interaction - Generative GLSL Field

A full-viewport WebGL canvas (`components/visual/GLBackground.tsx`, React Three Fiber)
renders a simplex-noise flow field in `--surface`/`--accent` duotone, sitting behind the
landing hero and dashboard. It reacts to:

- Scroll velocity → distortion strength.
- Cursor position → localized ripple.
- `prefers-reduced-motion` → freezes to a single static generated frame (no animation
  loop started at all, not just paused).

Mounted once at root layout, lazy-loaded (`next/dynamic`, `ssr: false`), capped to
30fps via a manual clock, and paused via `IntersectionObserver` when off-screen.

## 5. Motion System

| Interaction | Duration | Easing | Tool |
|---|---|---|---|
| Hover (buttons, cards) | 150ms | `cubic-bezier(0.4,0,0.2,1)` | CSS / Framer Motion |
| Page transition | 400ms | `expo.out` | Framer Motion `AnimatePresence` |
| Scroll reveal (sections) | 600–900ms, staggered 60ms | GSAP ScrollTrigger | GSAP |
| Reader page turn | 250ms | `power2.out` | Framer Motion |
| GLSL field response | continuous, scroll/cursor driven | n/a | R3F / GLSL |
| Idle | subtle marquee ticker (book titles), 40s loop | linear | CSS |

All motion gated by `prefers-reduced-motion: reduce` (durations collapse to ~0,
GLSL freezes to static frame).

## 6. Components (brutalist patterns, not shadcn defaults)

- **BookCard:** hard-bordered rectangle, cover image, mono metadata row (pages ·
  progress % · status), hover = border color shifts to `--accent`, 2px translate.
- **ProgressBar:** 4px hard-edged bar, `--accent` fill, mono percentage label right-aligned.
- **Nav:** text-link nav, no pill buttons, active route underlined with `--accent`.
- **Buttons:** rectangular, 2px border, no radius, hard hover invert (bg/fg swap, 0ms
  easing - brutalist snap, not a smooth fade).

## 7. Accessibility

- All text on the GLSL background sits over a `--surface` scrim panel (never floating
  directly on high-motion noise) to guarantee contrast ≥ 4.5:1.
- Focus rings: 2px solid `--accent`, offset 2px, never removed.
- Keyboard: reader navigable via ←/→ (page), Home/End (jump), full tab order on all
  interactive chrome.