/**
 * Generates app/tokens.css from docs/design-system/tokens.json, so the JSON stays the
 * single source of truth for the Editorial Proof design system.
 *
 * Run from the repo root: npm run tokens --workspace=frontend
 * The output is committed; the build does not run this script.
 */

import {readFileSync, writeFileSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const source = resolve(here, '../../docs/design-system/tokens.json')
const target = resolve(here, '../app/tokens.css')

const tokens = JSON.parse(readFileSync(source, 'utf8'))

const pxToRem = (px) => `${parseFloat(px) / 16}rem`

// Tailwind's spacing scale is 4px per step (p-4 = 16px), so the space-N tokens map onto
// it by number. Fail loudly if tokens.json ever stops matching that scale.
for (const {name, value} of tokens.spacing.tokens) {
  const step = Number(name.replace('space-', ''))
  if (parseFloat(value) !== step * 4) {
    throw new Error(`${name} is ${value}; expected ${step * 4}px to match Tailwind's spacing scale`)
  }
}

const sizeByName = Object.fromEntries(tokens.size.tokens.map((t) => [t.name, t.value]))

const theme = [
  // Clear Tailwind's defaults so only design-system tokens produce utilities.
  '  --color-*: initial;',
  '  --text-*: initial;',
  '  --radius-*: initial;',
  '  --shadow-*: initial;',
  '  --inset-shadow-*: initial;',
  '  --drop-shadow-*: initial;',
  '  --container-*: initial;',
  '',
  "  /* Breakpoint: layouts change at 760px (design system), not Tailwind's 768px. */",
  '  --breakpoint-md: 47.5rem;',
  '',
  '  /* Type styles: text-display, text-h1 … text-label */',
]

for (const group of tokens.type.groups) {
  for (const style of group.styles) {
    theme.push(`  --text-${style.name}: ${pxToRem(style.fontSize)};`)
    theme.push(`  --text-${style.name}--line-height: ${style.lineHeight};`)
    theme.push(`  --text-${style.name}--font-weight: ${style.fontWeight};`)
    if (style.letterSpacing) {
      theme.push(`  --text-${style.name}--letter-spacing: ${style.letterSpacing};`)
    }
  }
}

theme.push('', '  /* Radius: rounded-sm, rounded-md, rounded-lg, rounded-full */')
for (const {name, value} of tokens.radius.tokens) {
  theme.push(`  --${name}: ${value};`)
}

// Widths. container-prose is exposed as max-w-reading because Tailwind's built-in
// max-w-prose (a fixed 65ch) can't be overridden and would silently win.
const widthUtilities = {
  'container-page': 'page',
  'container-prose': 'reading',
  'container-resume': 'resume',
}
theme.push('', '  /* Widths: max-w-page, max-w-reading (container-prose), max-w-resume */')
for (const [token, utility] of Object.entries(widthUtilities)) {
  theme.push(`  --container-${utility}: ${sizeByName[token]};`)
}

theme.push('', '  /* Minimum target: min-h-target, min-w-target */')
theme.push(`  --spacing-target: ${sizeByName['target-min']};`)

const colors = (themeId) =>
  tokens.color.tokens.map(({name, value}) => `  --${name}: ${value[themeId]};`).join('\n')

const css = `/* Generated from docs/design-system/tokens.json by scripts/build-tokens.mjs. Do not edit by hand. */

@theme {
${theme.join('\n')}
}

/* Display drops to 36px under 760px. */
@media (width < 47.5rem) {
  :root {
    --text-display: ${pxToRem('36px')};
  }
}

/* Color tokens. Light by default; dark follows the system unless the visitor picked light,
   and data-theme="dark" forces dark. globals.css maps these into Tailwind (bg-bg, text-ink …). */
:root {
  color-scheme: light;
${colors('light')}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    color-scheme: dark;
${colors('dark').replace(/^/gm, '  ')}
  }
}

:root[data-theme='dark'] {
  color-scheme: dark;
${colors('dark')}
}
`

writeFileSync(target, css)
console.log(`Wrote ${target}`)
