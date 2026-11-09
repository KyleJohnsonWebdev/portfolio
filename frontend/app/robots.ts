import type {MetadataRoute} from 'next'

import {absoluteUrl, isProductionSite} from '@/lib/site-url'

/** Production is open to crawlers; preview deployments are not, so they never get indexed. */
export default function robots(): MetadataRoute.Robots {
  if (!isProductionSite()) {
    return {rules: {userAgent: '*', disallow: '/'}}
  }
  return {
    rules: {userAgent: '*', allow: '/', disallow: '/api/'},
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
