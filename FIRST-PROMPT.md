Paste this into Claude Code from the repo root (copy only the part below the line):

---
Read CLAUDE.md and every file it lists under "Read first". Then do step 1 only, on a new branch named chore/strip-template:

1. Confirm planning/ and .DS_Store are in .gitignore.
2. Remove the template's Post and Person schema types, the page builder, and the Unsplash and AI media plugins, plus every query, component, route and type that references them. Keep the Page/Settings wiring only if a later step needs it; say what you kept and why.
3. Confirm TypeScript strict mode is on in frontend and studio; turn it on if not.
4. Fix the setup warnings:
   - studio/sanity.cli.ts: move `autoUpdates: true` to `deployment: {autoUpdates: true}`.
   - Typegen can't find `@sanity/prettier-config`: install it as a dev dependency or point the prettier config at an installed one.
   - turbo.json has no `build` task (Vercel warns): add one that matches the workspaces.
   - Run `npx update-browserslist-db@latest`.
5. Make sure `npm run dev` and `npm run build` both pass with no errors.
6. Write a short README stub: what this is, stack, how to run locally.

Commit with Conventional Commits (one change per commit), push the branch, then stop and summarize: what you removed, what you kept, anything you were unsure about, and the Vercel preview URL.
