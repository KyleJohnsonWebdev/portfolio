@AGENTS.md

# Kyle Johnson — Portfolio

Goal: land a remote design engineer role on a marketing/content-site team.
Positioning: I design and build fast, accessible, CMS-driven websites that teams can update themselves and that search engines can find.
Headline: Websites your team can run, and customers can find.

## Read first
1. docs/design-system/README.md — the "Editorial Proof" design system: principles, voice, accessibility, handoff steps
2. docs/design-system/tokens.json — every color (light + dark), type style, spacing, radius, size
3. docs/design-system/components.md + components.css — the 13 v1 components, guidelines and reference CSS
4. docs/wireframes/*.html — Home, case study template, About + Contact, Resume (open in a browser)
5. planning/brief.md — research, content model, routes, stack (planning/ is gitignored: never commit it)

## Stack
Next.js 16 App Router, TypeScript strict, Tailwind v4, Sanity v6 + next-sanity, Vercel.
Started from sanity-io/sanity-template-nextjs-clean. Delete its Post and Person types, page builder, Unsplash and AI media plugins.

## Rules
- Never invent metrics, client names or dates. Missing facts render as the Placeholder component; ask Kyle.
- Sanity validation: metrics need value, source and date; client case studies need clientPermission.confirmed; every image needs alt text.
- WCAG 2.2 AA, Lighthouse 95+ in every category. CI must pass before merge.
- No animation on load. Respect prefers-reduced-motion.
- Use only tokens. No raw hex values in components.
- Build only the 13 v1 components. New components need Kyle's approval.
- Every Sanity query uses defineQuery and is typed via TypeGen. Pass stega: false in generateMetadata.
- Keep the README current: what it is, stack, how to run, Lighthouse scores, decisions.
- Commits follow Conventional Commits (feat:, fix:, docs:, refactor:, chore:), one change per commit, subject under 72 characters, body says why.
- Never commit personal data (student or client names, emails, IDs), secrets, or anything in planning/.
- Kyle is new to Next.js (experienced in React). When you use an App Router pattern for the first time (server vs client components, layouts, metadata, caching), explain it in two or three sentences.

## Order of work (one branch + PR per step; stop for Kyle's review after each)
1. Strip template  2. Tokens + fonts + layout shell  3. Schemas + validation  4. Case study template
5. Home  6. About, Resume, Contact  7. SEO + JSON-LD + sitemap  8. CI gates (Lighthouse CI, Playwright + axe)  9. Ship v1 with 2 case studies
