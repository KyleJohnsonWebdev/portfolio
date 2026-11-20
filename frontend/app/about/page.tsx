import type {Metadata, ResolvingMetadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'
import {Image} from 'next-sanity/image'

import Button from '@/app/components/Button'
import Placeholder from '@/app/components/Placeholder'
import PortableText from '@/app/components/PortableText'
import {pageOpenGraph} from '@/lib/open-graph'
import {sanityFetch} from '@/sanity/lib/live'
import {aboutQuery, contactQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'

export async function generateMetadata(
  _props: PageProps<'/about'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const {data: about} = await sanityFetch({query: aboutQuery, stega: false})
  return {
    title: 'About',
    description: about?.intro || undefined,
    alternates: {canonical: '/about'},
    openGraph: await pageOpenGraph(parent, '/about'),
  }
}

const container = 'mx-auto w-full max-w-page px-4 md:px-6'

/** The teaching story, a headshot, and the path from classroom to design engineer. */
export default async function AboutPage() {
  const [{data: about}, {data: contact}, {isEnabled: preview}] = await Promise.all([
    sanityFetch({query: aboutQuery}),
    sanityFetch({query: contactQuery}),
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
      {/*
        Three grid items: headline + intro, headshot, story. Phones stack them in that order,
        so the photo appears right after the intro at half width instead of after the whole
        story. From 760px the headshot moves to the right column, spanning both rows.
      */}
      <section
        className={`${container} grid items-start gap-x-12 gap-y-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:grid-rows-[auto_1fr] md:gap-y-5`}
      >
        <div className="flex flex-col gap-5 md:col-start-1 md:row-start-1">
          <h1 className="text-display">{about?.headline || 'About'}</h1>
          {about?.intro && <p className="max-w-reading text-lead text-muted">{about.intro}</p>}
        </div>
        {about?.portrait?.asset?._ref ? (
          <div className="relative aspect-[4/5] w-1/2 overflow-hidden rounded-lg bg-surface md:col-start-2 md:row-span-2 md:row-start-1 md:w-full">
            <Image
              src={urlForImage(about.portrait).url()}
              alt={stegaClean(about.portrait.alt) ?? ''}
              fill
              sizes="(min-width: 760px) 368px, 50vw"
              className="object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        ) : preview ? (
          <div className="flex aspect-[4/5] w-1/2 items-center justify-center rounded-lg border-[1.5px] border-dashed border-border-strong bg-surface md:col-start-2 md:row-span-2 md:row-start-1 md:w-full">
            <Placeholder label="Headshot — alt text required" />
          </div>
        ) : null}
        <div className="md:col-start-1 md:row-start-2">
          {about?.story?.length ? (
            <PortableText value={about.story} />
          ) : (
            missing('Story, about 250 words: one concrete moment, not a summary')
          )}
        </div>
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

      {/*
        Contact closes the About story, as in the wireframe. The nav's Contact link points
        here (/about#contact) and /contact redirects here. The email is also shown as plain,
        selectable text because a mailto link can fail when no mail app is set up.
      */}
      {/* tabIndex -1: the nav moves keyboard focus here, so the next Tab reaches "Email me". */}
      <section
        id="contact"
        aria-labelledby="contact-heading"
        tabIndex={-1}
        className="bg-surface focus:outline-none"
      >
        <div className={`${container} flex flex-col gap-5 py-14`}>
          <h2 id="contact-heading" className="text-h2">
            Contact
          </h2>
          {contact?.availability && (
            <p className="max-w-reading text-muted">{contact.availability}</p>
          )}
          <ul className="flex flex-wrap gap-3">
            {contact?.email && (
              <li>
                <Button href={`mailto:${contact.email}`} variant="primary" prefetch={false}>
                  Email me
                </Button>
              </li>
            )}
            {contact?.linkedInUrl && (
              <li>
                <Button href={contact.linkedInUrl} prefetch={false}>
                  LinkedIn
                </Button>
              </li>
            )}
            {contact?.githubUrl && (
              <li>
                <Button href={contact.githubUrl} prefetch={false}>
                  GitHub
                </Button>
              </li>
            )}
          </ul>
          <p className="font-mono text-meta text-muted">
            {[contact?.email, contact?.location, contact?.timezone].filter(Boolean).join(' · ')}
          </p>
        </div>
      </section>
    </div>
  )
}
