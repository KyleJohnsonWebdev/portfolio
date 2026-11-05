Paste this into Claude Code from the repo root, after the template is installed and these files are copied in:

---
Read CLAUDE.md and every file it lists under "Read first". Then do step 1 only:

1. Add planning/ to .gitignore (skip if it's already there).
2. Remove the template's Post and Person schema types, the page builder, and the Unsplash and AI media plugins, plus any code that references them.
3. Confirm TypeScript strict mode is on; turn it on if not.
4. In studio/sanity.cli.ts, move `autoUpdates: true` to `deployment: {autoUpdates: true}` (the CLI warns about it).
5. Make sure `npm run dev` and `npm run build` both pass.
6. Write a short README stub: what this is, stack, how to run.

Commit with Conventional Commits on a branch named chore/strip-template, then stop and summarize what you removed, what you kept, and anything in the template you were unsure about.