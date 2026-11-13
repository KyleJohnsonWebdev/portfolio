# Kyle Johnson — Portfolio

A design engineer portfolio built as a working example of its own pitch: a fast, accessible, CMS-driven website that a team can update themselves and that search engines can find.

Status: all v1 pages are built, with SEO metadata and CI quality gates. Next: publish two finished case studies and ship v1.

## Design

**"Editorial Proof": a calm, type-led site where evidence is the decoration.** The visual feature is proof (Lighthouse scores, sourced numbers, real screenshots), not illustration or motion.

- **Type does the work.** Geist for everything, Geist Mono for data and labels. One scale from a 17px body, prose capped at 68 characters.
- **One accent.** Cobalt is reserved for links, the primary button and focus. Green appears only in the Proof Strip, next to the word "Pass", never as color alone.
- **Warm paper and ink, light and dark from day one.** The theme follows the system setting, with a toggle that never flashes the wrong theme. Every text color passes WCAG 2.2 AA in both modes.
- **No shadows, gradients or load animation.** Borders mark cards and tinted bands mark sections. Motion is 150ms feedback on hover and focus, and it turns off under reduced motion.
- **Real screenshots in a plain browser frame.** Fixed 16:10, so nothing shifts while loading. No device mockups.
- **Honest placeholders.** A missing fact shows as a dashed `[PLACEHOLDER]` in drafts, never as an invented number.

Full principles, tokens, contrast ratios, component inventory and design decisions: [`docs/design-system/`](docs/design-system/).

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)
- Tailwind CSS v4
- Sanity v6 Studio with `next-sanity`, Visual Editing and Live Content
- Sanity TypeGen for typed GROQ queries
- Vercel (site, Analytics, Speed Insights)
- npm workspaces + Turborepo: `frontend/` (the site) and `studio/` (Sanity Studio)

## Run locally

Requires Node 22 (`nvm use` reads `.nvmrc`).

```shell
npm install
cp frontend/.env.example frontend/.env.local   # then fill in the Sanity values
npm run dev
```

- Site: http://localhost:3000
- Studio: http://localhost:3333

Other scripts, all from the repo root:

| Command                          | What it does                                                       |
| -------------------------------- | ------------------------------------------------------------------ |
| `npm run build`                  | Builds the site and the Studio through Turborepo                   |
| `npm run type-check`             | Runs `tsc` in both workspaces                                      |
| `npm run lint`                   | Lints the site and the Studio                                      |
| `npm test`                       | Runs the Studio's validation rule tests                            |
| `npm run format:check`           | Fails on unformatted files (what CI runs)                          |
| `npm run test:e2e -w frontend`   | Playwright + axe browser tests (after `npm run build`)             |
| `npm run lighthouse -w frontend` | Lighthouse CI on every page in the sitemap (after `npm run build`) |
| `npm run format`                 | Formats the repo with Prettier                                     |

The Studio reads `studio/.env`; copy `studio/.env.example` the first time. Never commit `.env*` files.

### Design tokens

`docs/design-system/tokens.json` is the source of truth. After editing it, regenerate the CSS and commit both files:

```shell
npm run tokens --workspace=frontend   # writes frontend/app/tokens.css
```

`frontend/app/globals.css` maps the tokens into Tailwind and clears Tailwind's default palette, radii, shadows, widths and type scale, so only token utilities exist: `bg-bg`, `text-ink`, `border-line`, `text-display` … `text-label`, `rounded-sm|md|lg`, `max-w-page`, `max-w-reading` (the 68ch prose width), `min-h-target`. Spacing uses Tailwind's 4px scale, which the `space-N` tokens match by number (`p-6` = `space-6` = 24px); the generator fails if they ever drift apart.

## Content model

Edited in the Studio (`studio/`):

| Type           | Kind       | What it holds                                                           |
| -------------- | ---------- | ----------------------------------------------------------------------- |
| `siteSettings` | Singleton  | Name, job title, home headline, contact links, resume PDF, SEO defaults |
| `about`        | Singleton  | About page story, portrait, "The path here" timeline, home teaser       |
| `resume`       | Singleton  | Tagline, summary, experience, skills, education                         |
| `caseStudy`    | Collection | TL;DR, Lighthouse proof, problem, constraints, decisions, outcome, next |

The Studio enforces the site's honesty rules. A document can't be published while it breaks one:

- Every number (`metric`) has a value, a source and a date.
- A case study that names a client needs confirmed, dated written permission.
- Lighthouse scores need the date they were tested.
- Every image has alt text.
- Each case study has two or three decisions, and every decision names its cost.
- Meta descriptions stay within 160 characters.

The rules live in `studio/src/schemaTypes/validation.ts` as plain functions with unit tests.

### Drafts and placeholders

A published case study never has a gap: missing required facts block publishing. In draft preview (Presentation in the Studio), each missing fact renders as a dashed `[PLACEHOLDER]` naming what belongs there, so the page shows what is still needed instead of an invented number. Optional sections with no content, such as untested Lighthouse scores, are left out of published pages entirely.

## Publishing updates

Pages are static for speed. When content is published, unpublished or deleted in the Studio, a Sanity webhook calls `/api/revalidate`, which marks every page for regeneration so the change shows on the next visit. Sanity Live also updates pages that are open at the time.

Setup (once):

1. Generate a secret, e.g. `openssl rand -hex 32`.
2. In Vercel, add `SANITY_REVALIDATE_SECRET` with that value (Production).
3. At sanity.io/manage → API → Webhooks, create a webhook: URL `https://<production domain>/api/revalidate`, dataset `production`, triggers create, update and delete, filter `_type in ["siteSettings", "about", "resume", "caseStudy"]`, drafts off, method POST, and the same secret.

Requests without a valid signature are rejected with 401.

## SEO

- Every page has a title, description and canonical link. Case studies use their SEO fields, then fall back to the title, summary and hero screenshot.
- JSON-LD: `Person` on the home page and `CreativeWork` on each case study, built only from Sanity fields.
- `/sitemap.xml` lists published pages and case studies with their last edit dates; About and Resume appear once published.
- `/robots.txt` allows crawling on production only. Preview deployments also send `noindex`, so they never show up in search.
- Set `NEXT_PUBLIC_SITE_URL` in Vercel (Production) when the custom domain is live; until then the Vercel production URL is used.

## Quality bar

WCAG 2.2 AA and Lighthouse 95+ in every category, enforced in CI (`.github/workflows/ci.yml`) on every push to every branch, so pull requests show the results:

- **Checks:** Prettier, ESLint (site and Studio), TypeScript and the Studio validation tests.
- **Browser tests:** Playwright on desktop and phone, against the production build. Every page in `sitemap.xml` is checked with axe for WCAG 2.2 AA in light and dark mode, plus one `h1`, no skipped heading levels, no sideways scroll, the skip link, the theme toggle with no flash, and 404s for unknown case studies.
- **Lighthouse CI:** mobile, three runs per page, median score; any category under 95 fails. Reports are attached to each run.

Pages come from the sitemap, so new case studies are tested as soon as they are published.

Latest Lighthouse (mobile, local production build, Nov 9, 2026; Home and Contact, the published pages so far):

| Category       | Score |
| -------------- | ----- |
| Performance    | 100   |
| Accessibility  | 100   |
| Best practices | 100   |
| SEO            | 100   |

## Decisions

- Started from `sanity-io/sanity-template-nextjs-clean`, then removed the Post and Person types, the page builder and the Unsplash and AI media plugins. A fixed content model is faster and easier to test than a drag-and-drop one.
- Kept the Settings singleton, Draft Mode, Visual Editing and Live Content wiring, since the real content model needs them.
- Design system docs live in `docs/design-system/`; wireframes in `docs/wireframes/`.
- Theme follows the system setting; the header toggle cycles System → Light → Dark. An inline script in `<head>` applies a saved choice before first paint, so there is no flash of the wrong theme.
- Cross-field rules (client permission, test dates, live URL, date order) sit on a field that always has a value when the rule matters, and every custom rule ends in `.error()`. In testing against the real schema, rules on a whole object or document came back as warnings, and warnings don't block publishing. The same goes for `required()` on object fields (hero image, headline outcome, timeline), so a rule on the case study title lists any of those that are missing.
- Case study screenshots go through `next-sanity/image`, which resizes on Sanity's image CDN, keeping Vercel's image allowance for where it matters. The exception is the home page cards: on a phone the first card's screenshot is the largest element, and loading it from a second domain cost about 5 Lighthouse performance points, so cards use Next.js's image optimizer on the site's own domain.
- Visitors don't load Sanity Live, Visual Editing or the draft-mode toasts; those load only in Draft Mode. Published changes reach visitors through the publish webhook instead. Removing them from normal visits cut about 590 KB of JavaScript from every page.
- Geist and Geist Mono load through `next/font`, which self-hosts them at build time: no request to Google and no layout shift.
