import type {Metadata, ResolvingMetadata} from 'next'

type OpenGraph = NonNullable<Metadata['openGraph']>
type OpenGraphImages = NonNullable<OpenGraph['images']>

/**
 * A page's Open Graph tags: the layout's shared ones (site name, locale, default image)
 * plus the page's own URL, so link previews and crawlers get og:url.
 *
 * Next.js merges metadata shallowly: a page that sets `openGraph` replaces the layout's
 * whole object instead of adding to it. Reading the parent's resolved values keeps the
 * shared tags. `path` is relative; `metadataBase` in the layout makes it absolute.
 */
export async function pageOpenGraph(
  parent: ResolvingMetadata,
  path: string,
  page: {type?: 'website' | 'article'; images?: OpenGraphImages} = {},
): Promise<OpenGraph> {
  const shared = (await parent).openGraph
  const images = page.images ?? (shared?.images as OpenGraphImages | undefined) ?? []
  return {
    type: page.type ?? 'website',
    url: path,
    siteName: shared?.siteName,
    locale: shared?.locale,
    images,
  }
}
