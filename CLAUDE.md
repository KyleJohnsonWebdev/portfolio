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
5. planning/brief.md — research, content model, routes, stack
6. planning/status.md — current decisions, case study lineup, open items
planning/ is gitignored: read it, never commit it, never quote it in commits, PRs or the README.

## Project setup (already done — don't redo)
- Monorepo from sanity-io/sanity-template-nextjs-clean: `frontend/` (Next.js 16, Turbopack) and `studio/` (Sanity v6), npm workspaces + turbo. Run commands from the repo root unless a step says otherwise.
- Node 22 (`.nvmrc`). Git identity is set to Kyle's GitHub noreply address.
- Sanity project and dataset come from `frontend/.env.local` and `studio/.env*`. Never commit `.env*` files and never print token values.
- Vercel: Hobby plan, Root Directory `frontend`, env vars set in the project for Production + Preview. Every push to a branch creates a preview deploy; Sanity CORS already allows the preview URLs.
- The Studio runs locally on :3333 and is not deployed yet (`npx sanity deploy` comes later, then set NEXT_PUBLIC_SANITY_STUDIO_URL).
- Sanity MCP is configured. Use it to READ schemas and content. Ask Kyle before creating, editing or deleting any document in the dataset. There is no write token; don't create one.

## Stack
Next.js 16 App Router, TypeScript strict, Tailwind v4, Sanity v6 + next-sanity, Vercel.

## Rules
- Never invent metrics, client names or dates. Missing facts render as the Placeholder component; ask Kyle.
- Sanity validation: metrics need value, source and date; client case studies need clientPermission.confirmed; every image needs alt text.
- WCAG 2.2 AA, Lighthouse 95+ in every category. CI must pass before merge.
- No animation on load. Respect prefers-reduced-motion.
- Use only tokens. No raw hex values in components.
- Build only the 13 v1 components. New components need Kyle's approval.
- Every Sanity query uses defineQuery and is typed via TypeGen. Pass stega: false in generateMetadata.
- No third-party scripts besides Vercel Analytics and Speed Insights. Never render raw HTML from Sanity; use PortableText.
- Keep the README current: what it is, stack, how to run, Lighthouse scores, decisions.
- Commits follow Conventional Commits (feat:, fix:, docs:, refactor:, chore:), one change per commit, subject under 72 characters, body says why.
- Never commit personal data (student or client names, emails, IDs), secrets, or anything in planning/.
- Kyle is new to Next.js (experienced in React). When you use an App Router pattern for the first time (server vs client components, layouts, metadata, caching), explain it in two or three sentences.

## Workflow
- One branch + PR per step. Push the branch so Vercel builds a preview; include the preview URL in your summary.
- Stop after each step and summarize: what changed, what you were unsure about, what Kyle should check in the preview.
- Never push to main directly or force-push.

## Order of work
1. Strip template + fix setup warnings  2. Tokens + fonts + layout shell  3. Schemas + validation  4. Case study template
5. Home  6. About, Resume, Contact  7. SEO + JSON-LD + sitemap  8. CI gates (Lighthouse CI, Playwright + axe)  9. Ship v1 with 2 case studies