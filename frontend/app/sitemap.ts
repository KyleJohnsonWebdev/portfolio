import type {MetadataRoute} from 'next'

import {absoluteUrl} from '@/lib/site-url'
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapQuery} from '@/sanity/lib/queries'

/**
 * sitemap.xml: every published page, with the date its content last changed in Sanity.
 * About and Resume are listed only once they are published, so the sitemap never points
 * at a 404.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const {data} = await sanityFetch({query: sitemapQuery, perspective: 'published', stega: false})

  const pages: MetadataRoute.Sitemap = [
    {url: absoluteUrl('/'), lastModified: data.settings ?? undefined, priority: 1},
    ...(data.about ? [{url: absoluteUrl('/about'), lastModified: data.about}] : []),
    ...(data.resume ? [{url: absoluteUrl('/resume'), lastModified: data.resume}] : []),
    {url: absoluteUrl('/contact'), lastModified: data.settings ?? undefined},
  ]

  const caseStudies = data.caseStudies.map((study) => ({
    url: absoluteUrl(`/work/${study.slug}`),
    lastModified: study._updatedAt,
    priority: 0.8,
  }))

  return [...pages, ...caseStudies]
}
