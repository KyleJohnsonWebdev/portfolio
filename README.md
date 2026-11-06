# Kyle Johnson — Portfolio

A design engineer portfolio built as a working example of its own pitch: a fast, accessible, CMS-driven website that a team can update themselves and that search engines can find.

Status: early build. The template has been stripped; design tokens, schemas and pages arrive in later steps.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)
- Tailwind CSS v4
- Sanity v5 Studio with `next-sanity`, Visual Editing and Live Content
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
| `npm run format`     | Formats the repo with Prettier                   |

The Studio reads `studio/.env`; copy `studio/.env.example` the first time. Never commit `.env*` files.

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
