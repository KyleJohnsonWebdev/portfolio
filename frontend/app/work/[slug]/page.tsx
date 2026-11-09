import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'

import CaseStudyView from './case-study-view'
import {sanityFetch} from '@/sanity/lib/live'
import {caseStudyQuery, caseStudySlugsQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage, urlForImage} from '@/sanity/lib/utils'
import {serializeJsonLd} from '@/lib/json-ld'
import {absoluteUrl} from '@/lib/site-url'

/** Prerender every published case study at build time. New ones render on first visit. */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: caseStudySlugsQuery,
    perspective: 'published',
    stega: false,
  })
  return data
}

export async function generateMetadata(props: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const params = await props.params
  const {data: study} = await sanityFetch({query: caseStudyQuery, params, stega: false})
  if (!study) return {}

  const ogImage = resolveOpenGraphImage(study.seo?.ogImage ?? study.heroImage)
  return {
    title: study.seo?.title || study.title,
    description: study.seo?.description || study.summary,
    alternates: {canonical: `/work/${study.slug}`},
    openGraph: {type: 'article', images: ogImage ? [ogImage] : []},
  }
}

export default async function CaseStudyPage(props: PageProps<'/work/[slug]'>) {
  const params = await props.params
  const [{data: study}, {isEnabled: preview}] = await Promise.all([
    sanityFetch({query: caseStudyQuery, params}),
    draftMode(),
  ])
  if (!study) notFound()

  // Structured data: this case study as a creative work by Kyle. Only real fields are used.
  const creativeWork = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    'name': study.title,
    'description': study.summary || undefined,
    'url': absoluteUrl(`/work/${stegaClean(study.slug)}`),
    'image': study.heroImage?.asset?._ref
      ? urlForImage(study.heroImage).width(1200).url()
      : undefined,
    'dateCreated': study.timeline?.start || undefined,
    'keywords': study.stack?.length ? study.stack.join(', ') : undefined,
    'author': study.author
      ? {'@type': 'Person', 'name': study.author, 'url': absoluteUrl('/')}
      : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: serializeJsonLd(creativeWork)}}
      />
      <CaseStudyView study={study} preview={preview} />
    </>
  )
}
