/**
 * The public origin of the site, for canonical links, the sitemap, robots.txt and JSON-LD.
 *
 * 1. NEXT_PUBLIC_SITE_URL, once the custom domain is set (e.g. https://kyletjohnson.dev).
 * 2. On Vercel production, the project's production domain.
 * 3. On Vercel previews, the branch URL.
 * 4. Locally, http://localhost:3000.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return new URL(explicit)

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (process.env.VERCEL_ENV === 'production' && production) return new URL(`https://${production}`)

  const preview = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL
  if (preview) return new URL(`https://${preview}`)

  return new URL(`http://localhost:${process.env.PORT || 3000}`)
}

/** True only on the production deployment, so previews are never indexed. */
export function isProductionSite(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SITE_URL) || process.env.VERCEL_ENV === 'production'
}

/** An absolute URL for a path on this site. */
export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString()
}
