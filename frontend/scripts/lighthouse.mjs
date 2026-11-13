/**
 * Runs Lighthouse CI (mobile, 3 runs per page, median) against the production build for
 * every page in sitemap.xml, and fails if any category scores below 95.
 *
 * Run `npm run build` first. Reports are written to .lighthouseci/reports.
 * Set CHROME_PATH to use a specific Chrome; CI runners have one installed.
 */
import {spawn, spawnSync} from 'node:child_process'
import {appendFileSync, existsSync, readFileSync} from 'node:fs'

const port = Number(process.env.PORT || 3000)
const origin = `http://localhost:${port}`

const server = spawn('npx', ['next', 'start', '-p', String(port)], {stdio: 'ignore'})
const stop = () => server.kill()
process.on('exit', stop)

async function waitForServer(timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      if ((await fetch(origin)).ok) return
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`Server did not start on ${origin}`)
}

await waitForServer()

const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text()
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => origin + new URL(match[1]).pathname,
)
console.log(`Lighthouse: ${urls.length} pages from sitemap.xml\n${urls.join('\n')}\n`)

// In GitHub Actions, `::error` lines become annotations on the run, readable without
// downloading the reports. Elsewhere they are just log lines.
const annotate = (message) => console.log(`::error title=Lighthouse::${message}`)

// A page that doesn't load makes Lighthouse fail with a vague runtime error; name it up front.
for (const url of urls) {
  const {status} = await fetch(url)
  if (status !== 200) annotate(`${new URL(url).pathname} returned HTTP ${status}`)
}

const lhci = (...args) => spawnSync('npx', ['lhci', ...args], {stdio: 'inherit'}).status ?? 1

const collected = lhci('collect', ...urls.map((url) => `--url=${url}`))
const uploaded = collected === 0 ? lhci('upload') : 1
const asserted = collected === 0 ? lhci('assert') : 1

summarize()
stop()
process.exit(collected || asserted || uploaded)

/** Scores per page (median run): a table on the CI run's summary page, plus an annotation per failure. */
function summarize() {
  const manifestPath = '.lighthouseci/reports/manifest.json'
  if (!existsSync(manifestPath)) {
    annotate('no reports were produced; see the collect step in the log')
    return
  }
  const categories = ['performance', 'accessibility', 'best-practices', 'seo']
  const rows = JSON.parse(readFileSync(manifestPath, 'utf8'))
    .filter((run) => run.isRepresentativeRun)
    .map((run) => {
      const path = new URL(run.url).pathname
      const scores = categories.map((category) => Math.round((run.summary[category] ?? 0) * 100))
      scores.forEach((score, i) => {
        if (score < 95) annotate(`${path} ${categories[i]} ${score} (needs 95)`)
      })
      return `| \`${path}\` | ${scores.join(' | ')} |`
    })
  const table = [
    '### Lighthouse (mobile, median of 3 runs)',
    '',
    '| Page | Performance | Accessibility | Best practices | SEO |',
    '| --- | --- | --- | --- | --- |',
    ...rows,
    '',
  ].join('\n')
  console.log(table)
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, table)
}
