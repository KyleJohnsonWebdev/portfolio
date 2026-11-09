import type {APIRequestContext} from '@playwright/test'

/**
 * Every published page, read from the site's own sitemap.xml. New case studies are tested
 * as soon as they are published, without editing the tests.
 */
export async function publishedRoutes(request: APIRequestContext): Promise<string[]> {
  const response = await request.get('/sitemap.xml')
  if (!response.ok()) throw new Error(`sitemap.xml returned ${response.status()}`)
  const xml = await response.text()
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname)
  return [...new Set(paths)]
}
