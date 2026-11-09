import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'

import CaseStudyView from './case-study-view'
import {sanityFetch} from '@/sanity/lib/live'
import {caseStudyQuery, caseStudySlugsQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

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
    openGraph: {images: ogImage ? [ogImage] : []},
  }
}

export default async function CaseStudyPage(props: PageProps<'/work/[slug]'>) {
  const params = await props.params
  const [{data: study}, {isEnabled: preview}] = await Promise.all([
    sanityFetch({query: caseStudyQuery, params}),
    draftMode(),
  ])
  if (!study) notFound()

  return <CaseStudyView study={study} preview={preview} />
}
