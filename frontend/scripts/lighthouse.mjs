/**
 * Runs Lighthouse CI (mobile, 3 runs per page, median) against the production build for
 * every page in sitemap.xml, and fails if any category scores below 95.
 *
 * Run `npm run build` first. Reports are written to .lighthouseci/reports.
 * Set CHROME_PATH to use a specific Chrome; CI runners have one installed.
 */
import {spawn, spawnSync} from 'node:child_process'

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

const lhci = (...args) => spawnSync('npx', ['lhci', ...args], {stdio: 'inherit'}).status ?? 1

const collected = lhci('collect', ...urls.map((url) => `--url=${url}`))
const uploaded = collected === 0 ? lhci('upload') : 1
const asserted = collected === 0 ? lhci('assert') : 1

stop()
process.exit(collected || asserted || uploaded)
