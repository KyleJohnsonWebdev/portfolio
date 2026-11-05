# Editorial Proof

The design system for Kyle Johnson's portfolio: a calm, type-led site where evidence is the decoration. Built for Claude Code to implement in Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Sanity.

Positioning it serves: *I design and build fast, accessible, CMS-driven websites that teams can update themselves and that search engines can find.* Headline: *Websites your team can run, and customers can find.*

## Principles

1. **Work in the first viewport.** On a 1280×800 laptop the first case study card starts above the fold (checked at 566px in the wireframes).
2. **Evidence over adjectives.** Every claim sits next to a number, a link or a screenshot. The Proof Strip is the signature component.
3. **Placeholders are honest.** Missing facts render as a dashed mono `Placeholder`, never as an invented number. Sanity validation blocks publishing a case study while any metric lacks a value, source or date.
4. **One accent.** `accent` is for links, the primary button, focus and the active nav item. `pass` appears only inside the Proof Strip.
5. **Motion is feedback only.** 150 ms `cubic-bezier(0.2, 0, 0, 1)` on hover and focus color/border changes. Nothing animates on load. All transitions off under `prefers-reduced-motion`.
6. **Light and dark from day one.** System setting by default, manual toggle sets `data-theme` on `<html>` before paint.

## Content fundamentals (voice)

- Plain, direct, first person singular. Short sentences.
- Lead with the outcome, then the problem. "Don't bury the lede."
- Name things the way a hiring manager would: "case study", "launch", "Lighthouse score", not internal jargon.
- No superlatives, no exclamation marks, no emoji.
- Numbers carry a source and a date: `98 · Lighthouse mobile · Nov 2026`.
- Teaching is framed as an edge: "I teach, so I build things people can run without me."

## Visual foundations

- **Type:** Geist Sans for everything; Geist Mono for data, labels, badges and placeholders. Load with `next/font/google` (`Geist`, `Geist_Mono`) and expose as `--font-geist-sans` / `--font-geist-mono`. Styles: `display` 52 → `h1` 41 → `h2` 27 → `h3` 21 → `lead` 21 → `body` 17 → `secondary` 15 → `meta` 13 → `label` 12. `display` drops to 36px under 760px. Headings `text-wrap: balance`.
- **Color:** warm paper and ink with one cobalt accent. Neutrals lean warm in light, cool in dark. All text pairs pass WCAG 2.2 AA in both themes (ratios are in each token's usage note).
- **Layout:** `container-page` 1200px, gutter `space-4` on phones and `space-6` from 760px. Prose capped at `container-prose`. Sections separated by `space-16` (home) or `space-18` (case study). Flex/grid with `gap`, never sibling margins.
- **Surfaces:** borders (`line`) mark cards; `surface` fills mark bands. No shadows. No gradients.
- **Imagery:** real screenshots inside `BrowserFrame`; no device mockups, no stock photos. Alt text is a required Sanity field.

## Accessibility (WCAG 2.2 AA, non-negotiable)

- `SkipLink` is the first tab stop on every page and becomes visible on focus.
- Focus: `outline: 2px solid var(--accent); outline-offset: 3px` on `:focus-visible`.
- Buttons and toggles are at least `target-min` (44px).
- Status never by color alone: badges carry text; Proof Strip scores carry the word "Pass".
- Heading levels never skip. One `h1` per page.

## Handoff to Claude Code

1. Copy `tokens.css` (generated from `tokens.json`) into `app/tokens.css`, and import it before Tailwind in `app/globals.css`.
2. Map tokens into Tailwind v4 with `@theme inline { --color-bg: var(--bg); --color-ink: var(--ink); … --font-sans: var(--font-geist-sans); --font-mono: var(--font-geist-mono); }` so utilities like `bg-bg text-ink border-line` follow the theme.
3. `components/bundle.css` is the reference CSS for every component (`.kj-*` classes). Rebuild each as a React server component in `src/components/<Name>.tsx` with Tailwind utilities; keep the class names out of production.
4. Only the components listed here ship in v1. A new component needs Kyle's approval.
5. No raw hex values in components. No animation libraries.

## Components (v1)

SkipLink · SiteHeader (with ThemeToggle) · SiteFooter · Button · StatusBadge · Placeholder · CaseStudyCard · ProofStrip · TLDR · DecisionCard · BrowserFrame · PortableText · ResumeBlock. Each has guidelines and a live preview.
