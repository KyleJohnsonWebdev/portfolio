import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'
import {Image} from 'next-sanity/image'

import Placeholder from '@/app/components/Placeholder'
import PortableText from '@/app/components/PortableText'
import {sanityFetch} from '@/sanity/lib/live'
import {aboutQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const {data: about} = await sanityFetch({query: aboutQuery, stega: false})
  return {
    title: 'About',
    description: about?.intro || undefined,
    alternates: {canonical: '/about'},
  }
}

const container = 'mx-auto w-full max-w-page px-4 md:px-6'

/** The teaching story, a headshot, and the path from classroom to design engineer. */
export default async function AboutPage() {
  const [{data: about}, {isEnabled: preview}] = await Promise.all([
    sanityFetch({query: aboutQuery}),
    draftMode(),
  ])
  if (!about && !preview) notFound()
  const missing = (label: string) =>
    preview ? (
      <p>
        <Placeholder label={label} />
      </p>
    ) : null

  return (
    <div className="flex flex-col gap-18 pt-16 pb-24">
      <section
        className={`${container} grid items-start gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]`}
      >
        <div className="flex flex-col gap-5">
          <h1 className="text-display">{about?.headline || 'About'}</h1>
          {about?.intro && <p className="max-w-reading text-lead text-muted">{about.intro}</p>}
          {about?.story?.length ? (
            <PortableText value={about.story} />
          ) : (
            missing('Story, about 250 words: one concrete moment, not a summary')
          )}
        </div>
        {about?.portrait?.asset?._ref ? (
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface">
            <Image
              src={urlForImage(about.portrait).url()}
              alt={stegaClean(about.portrait.alt) ?? ''}
              fill
              sizes="(min-width: 760px) 368px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        ) : preview ? (
          <div className="flex aspect-[4/5] items-center justify-center rounded-lg border-[1.5px] border-dashed border-border-strong bg-surface">
            <Placeholder label="Headshot — alt text required" />
          </div>
        ) : null}
      </section>

      {about?.pathEntries?.length ? (
        <section aria-labelledby="path-heading" className={`${container} flex flex-col gap-5`}>
          <h2 id="path-heading" className="text-h2">
            The path here
          </h2>
          <ol className="grid grid-cols-1 gap-6 border-t border-line pt-6 md:grid-cols-4">
            {about.pathEntries.map((entry) => (
              <li key={entry._key}>
                <p className="font-mono text-label uppercase text-muted">{entry.period}</p>
                <p className="mt-1 font-medium">{entry.title}</p>
                {entry.detail && <p className="mt-1 text-secondary text-muted">{entry.detail}</p>}
              </li>
            ))}
          </ol>
          {about.pathNote && (
            <p className="max-w-reading text-secondary text-muted">{about.pathNote}</p>
          )}
        </section>
      ) : null}
    </div>
  )
}
