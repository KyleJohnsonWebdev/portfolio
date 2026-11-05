# Editorial Proof — component guidelines

Live previews: https://claude.ai/artifact/E2zSj8JvjRWu955aq2MZ14 · Reference CSS: components.css (.kj-* classes)

## SkipLink

The first focusable element on every page; jumps to `<main id="main">`.

- Hidden off-screen until it receives keyboard focus, then shown top-left in `ink` on `bg` reversed.
- Text is always "Skip to main content".
- Required on every route (WCAG 2.4.1).

```html
<div class="kj-pad"><a class="kj-skip is-demo" href="#main">Skip to main content</a> <span class="kj-label" style="margin-left:12px">Shown on focus only</span></div>
```

## SiteHeader

Name on the left, four nav links and the ThemeToggle on the right; a `line` hairline below.

- Links: Work, About, Resume, Contact. Nothing else.
- Current page link gets `aria-current="page"` and `ink`; others `muted`.
- ThemeToggle is a real `<button>` labelled "Switch color theme", at least `target-min`. It cycles system → light → dark and sets `data-theme` on `<html>` from an inline script before paint so there is no flash.
- Wraps to two lines on phones; never a hamburger menu for four links.

```html
<header class="kj-header"><div class="kj-header__in"><a class="kj-header__name" href="#">Kyle Johnson</a><nav class="kj-nav" aria-label="Primary"><a href="#" aria-current="page">Work</a><a href="#">About</a><a href="#">Resume</a><a href="#">Contact</a><button class="kj-toggle" type="button" aria-label="Switch color theme">Theme</button></nav></div></header>
```

## SiteFooter

Copyright on the left; Email, LinkedIn, GitHub and "View this site's source" on the right.

- "View this site's source" links to the portfolio repo itself: the repo is case study zero.
- Email is shown as a link and as selectable text on the Contact page (mailto can fail).

```html
<footer class="kj-footer"><div class="kj-footer__in"><span>© 2026 Kyle Johnson</span><nav class="kj-row" aria-label="Contact" style="gap:20px"><a href="#">Email</a><a href="#">LinkedIn</a><a href="#">GitHub</a><a href="#">View this site's source</a></nav></div></footer>
```

## Button

Two variants: `primary` (accent fill) for the one main action in a view, `secondary` (border-strong outline) for everything else.

- Render as `<a>` when it navigates, `<button>` when it acts.
- Height at least `target-min`. Label states what happens: "See the work", "Download PDF".
- At most one primary per view.

```html
<div class="kj-pad kj-row"><a class="kj-btn kj-btn--primary" href="#">See the work</a><a class="kj-btn kj-btn--secondary" href="#">Resume</a></div>
```

## StatusBadge

A small mono label for project state and role: "Live", "In progress", "Launching Mar 2027", "Sanity CMS".

- Text always; never a colored dot alone.
- Neutral styling only (`border-strong` outline). Color is reserved for the Proof Strip.

```html
<div class="kj-pad kj-row" style="gap:8px"><span class="kj-badge">Live</span><span class="kj-badge">In progress</span><span class="kj-badge">Launching Mar 2027</span><span class="kj-badge">Sanity CMS</span></div>
```

## Placeholder

Marks a fact that is not in yet: `[LIGHTHOUSE SCORE]`, `[ONE OUTCOME NUMBER]`.

- Dashed `border-strong` box, mono `meta` text in brackets, uppercase description of what belongs there.
- Used in wireframes and drafts only. In production, a Sanity field that would render a Placeholder keeps the document unpublishable (validation: metrics need value, source and date).
- Never replace it with an estimate.

```html
<div class="kj-pad kj-row" style="gap:8px"><span class="kj-ph">[LIGHTHOUSE SCORE]</span><span class="kj-ph">[ONE OUTCOME NUMBER + SOURCE]</span></div>
```

## CaseStudyCard

Home page listing for one case study: screenshot, badges, title, one-line description, one outcome line.

- The whole card is ONE link (no nested links). Hover changes the border to `border-strong`.
- Exactly one outcome line in mono: a number with its unit, never an adjective.
- Three cards in a row on desktop, one column under 760px.

```html
<div class="kj-pad"><a class="kj-card" href="#"><div class="kj-frame"><div class="kj-frame__shot"><span class="kj-ph">[SCREENSHOT]</span></div></div><div class="kj-row" style="gap:8px"><span class="kj-badge">Live</span><span class="kj-badge">Sanity CMS</span></div><h3>maybespecial.com</h3><p class="kj-card__desc">A portfolio site for a working designer, built on Sanity so she updates it herself.</p><p class="kj-card__out">Lighthouse: <span class="kj-ph">[PERF / A11Y]</span></p></a></div>
```

## ProofStrip

The signature component: Lighthouse mobile scores, a report link and the test date, on a `surface` band.

- Values come from Sanity (`proof.performance`, `accessibility`, `bestPractices`, `seo`, `testedOn`, `reportUrl`). Never hard-coded.
- A `<dl>`: `dt` in `label`, `dd` in `metric` with tabular numerals.
- Scores 90+ add the word "Pass" in `pass` under the number. Color never carries the meaning alone.
- Always shows the test date; a score without a date is not shown.

```html
<section class="kj-proof"><p class="kj-label">Proof · Lighthouse mobile · Tested Nov 2026</p><dl><div><dt class="kj-label">Performance</dt><dd>98<span class="kj-proof__pass">PASS</span></dd></div><div><dt class="kj-label">Accessibility</dt><dd>100<span class="kj-proof__pass">PASS</span></dd></div><div><dt class="kj-label">Best practices</dt><dd>100<span class="kj-proof__pass">PASS</span></dd></div><div><dt class="kj-label">SEO</dt><dd><span class="kj-ph">[00]</span></dd></div><div><dt class="kj-label">Report</dt><dd style="font-size:15px;font-family:var(--font-sans)"><a href="#">Full report</a></dd></div></dl><p class="kj-mono" style="margin:0;font-size:12px;color:var(--muted)">Sample values shown for layout only.</p></section>
```

## TLDR

The four facts at the top of every case study: Role, Stack, Timeline, Outcome.

- A `<dl>` in a 4-column grid, one column on phones.
- Outcome is one number with its source. If it is missing, the case study stays unpublished.

```html
<div class="kj-pad"><dl class="kj-tldr"><div><dt class="kj-label">Role</dt><dd>Designer and developer</dd></div><div><dt class="kj-label">Stack</dt><dd>Next.js, Sanity</dd></div><div><dt class="kj-label">Timeline</dt><dd><span class="kj-ph">[START] – present</span></dd></div><div><dt class="kj-label">Outcome</dt><dd><span class="kj-ph">[NUMBER + SOURCE]</span></dd></div></dl></div>
```

## DecisionCard

One key decision and its tradeoff: Chose / Instead of / Because / Cost. Two or three per case study.

- Title states the decision as an action ("Break every concept down three ways").
- "Cost" is required: what was given up. A decision with no cost reads as marketing.
- Bordered with `line`; no fill, no shadow.

```html
<div class="kj-pad"><article class="kj-dec"><h3>Let the client edit in Sanity, not in code</h3><div><p class="kj-label">Chose</p><p>Fixed page templates with editable fields</p></div><div><p class="kj-label">Instead of</p><p>A drag-and-drop page builder</p></div><div><p class="kj-label">Because</p><p><span class="kj-ph">[REASON]</span></p></div><div><p class="kj-label">Cost</p><p><span class="kj-ph">[WHAT WAS GIVEN UP]</span></p></div></article></div>
```

## BrowserFrame

A plain browser chrome around a real screenshot: three neutral dots and the URL in mono.

- Wraps `next/image` with fixed aspect ratio (16:10) so nothing shifts on load.
- Alt text is required from Sanity and describes what the screenshot proves.
- No device mockups, no tilt, no shadow.

```html
<div class="kj-pad" style="max-width:520px"><figure class="kj-frame" style="margin:0"><div class="kj-frame__bar" aria-hidden="true"><span class="kj-frame__dot"></span><span class="kj-frame__dot"></span><span class="kj-frame__dot"></span><span class="kj-frame__url">contextlayer.design</span></div><div class="kj-frame__shot"><span class="kj-ph">[SCREENSHOT — alt text required]</span></div></figure></div>
```

## PortableText

Renders Sanity rich text for case study bodies and the About story.

- Maps blocks to `h2`/`h3` (never `h1`, never skipping), paragraphs, bullet lists, links and inline code.
- Capped at `container-prose`.
- No custom colors or inline styles from the CMS.

```html
<div class="kj-pad"><div class="kj-prose"><h2>Problem</h2><p>Design Is Oxygen was retired in October 2026. <span class="kj-ph">[WHAT THAT COST STUDENTS]</span></p><h3>Constraints</h3><ul><li>Built on approved work time, needing a director pitch before adoption.</li><li>Every concept taught three ways: design, <code>code</code> and an AI prompt.</li></ul></div></div>
```

## ResumeBlock

One section of the web resume: a mono section label, then entries with title, dates and bullets.

- Content comes from the Sanity `resume` singleton and mirrors the PDF exactly.
- The page carries one "Download PDF" primary Button with file type and size.

```html
<div class="kj-pad kj-resume" style="max-width:720px"><h2>EXPERIENCE</h2><article class="kj-job"><div class="kj-job__head"><h3>Web Developer and SEO Consultant · Part Time Design Co</h3><span class="kj-label">Jul 2017 – Present</span></div><ul><li>Advised 10+ clients on SEO since 2017; several remain ongoing clients.</li><li>Launched 5 websites since 2022 and continue to maintain 4.</li></ul></article></div>
```
