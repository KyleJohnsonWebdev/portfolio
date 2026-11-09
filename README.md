# Kyle Johnson — Portfolio

A design engineer portfolio built as a working example of its own pitch: a fast, accessible, CMS-driven website that a team can update themselves and that search engines can find.

Status: early build. Design tokens, the layout shell, the content model and the case study template (`/work/[slug]`) are in; Home, About, Resume and Contact come next.

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

| Command              | What it does                                     |
| -------------------- | ------------------------------------------------ |
| `npm run build`      | Builds the site and the Studio through Turborepo |
| `npm run type-check` | Runs `tsc` in both workspaces                    |
| `npm run lint`       | Lints the frontend                               |
| `npm test`           | Runs the Studio's validation rule tests          |
| `npm run format`     | Formats the repo with Prettier                   |

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

## Quality bar

WCAG 2.2 AA and Lighthouse 95+ in every category, enforced in CI once step 8 lands.

| Category       | Score            |
| -------------- | ---------------- |
| Performance    | Not measured yet |
| Accessibility  | Not measured yet |
| Best practices | Not measured yet |
| SEO            | Not measured yet |

## Decisions

- Started from `sanity-io/sanity-template-nextjs-clean`, then removed the Post and Person types, the page builder and the Unsplash and AI media plugins. A fixed content model is faster and easier to test than a drag-and-drop one.
- Kept the Settings singleton, Draft Mode, Visual Editing and Live Content wiring, since the real content model needs them.
- Design system docs live in `docs/design-system/`; wireframes in `docs/wireframes/`.
- Theme follows the system setting; the header toggle cycles System → Light → Dark. An inline script in `<head>` applies a saved choice before first paint, so there is no flash of the wrong theme.
- Cross-field rules (client permission, test dates, live URL, date order) sit on a field that always has a value when the rule matters, and every custom rule ends in `.error()`. In testing against the real schema, rules on a whole object or document came back as warnings, and warnings don't block publishing. The same goes for `required()` on object fields (hero image, headline outcome, timeline), so a rule on the case study title lists any of those that are missing.
- Case study screenshots go through `next-sanity/image`, which resizes on Sanity's image CDN instead of Vercel's image optimizer, keeping the Hobby plan's image quota free.
- Geist and Geist Mono load through `next/font`, which self-hosts them at build time: no request to Google and no layout shift.
