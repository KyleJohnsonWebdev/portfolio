import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {stegaClean} from 'next-sanity'
import {Image} from 'next-sanity/image'
import Link from 'next/link'

import Button from '@/app/components/Button'
import CaseStudyCard from '@/app/components/CaseStudyCard'
import Placeholder from '@/app/components/Placeholder'
import {formatMonthYear} from '@/lib/format'
import {serializeJsonLd} from '@/lib/json-ld'
import {absoluteUrl} from '@/lib/site-url'
import * as demo from '@/sanity/lib/demo'
import {sanityFetch} from '@/sanity/lib/live'
import {homeQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'

export const metadata: Metadata = {alternates: {canonical: '/'}}

const container = 'mx-auto w-full max-w-page px-4 md:px-6'
const WORK_MODE: Record<string, string> = {remote: 'Remote', hybrid: 'Hybrid', onsite: 'On-site'}

/** Home: the headline, then the work in the first viewport, then stats and the About teaser. */
export default async function HomePage() {
  const [{data}, {isEnabled: preview}] = await Promise.all([
    sanityFetch({query: homeQuery}),
    draftMode(),
  ])
  const {settings, caseStudies, about} = data
  const missing = (label: string) => (preview ? <Placeholder label={label} /> : null)

  const metaLine = [
    settings?.jobTitle,
    settings?.location,
    WORK_MODE[stegaClean(settings?.workMode) ?? ''],
  ].filter(Boolean)

  // Structured data for search engines: who this site is about. Facts come from Site settings.
  const person = settings?.name
    ? {
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': settings.name,
        'jobTitle': settings.jobTitle || undefined,
        'url': absoluteUrl('/'),
        'email': settings.email ? `mailto:${settings.email}` : undefined,
        'address': settings.location || undefined,
        'sameAs': [settings.linkedInUrl, settings.githubUrl].filter(Boolean),
      }
    : null

  return (
    <>
      {person && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: serializeJsonLd(person)}}
        />
      )}
      <section className={`${container} flex flex-col gap-5 pt-14 pb-12`}>
        {metaLine.length > 0 && (
          <p className="font-mono text-meta tracking-[0.02em] text-muted uppercase">
            {metaLine.join(' · ')}
          </p>
        )}
        <h1 className="max-w-[16em] text-display">{settings?.headline || demo.name}</h1>
        {settings?.positioning && (
          <p className="max-w-reading text-lead text-muted">{settings.positioning}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-3">
          <Button href="#work" variant="primary">
            See the work
          </Button>
          <Button href="/resume">Resume</Button>
        </div>
      </section>

      <section
        id="work"
        aria-labelledby="work-heading"
        className={`${container} flex flex-col gap-6 pb-16`}
      >
        <h2 id="work-heading" className="text-h2">
          Selected work
        </h2>
        {caseStudies.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study._id} {...study} preview={preview} />
            ))}
          </div>
        ) : (
          <p className="text-muted">No case studies are published yet.</p>
        )}
      </section>

      {settings?.stats?.length ? (
        <section aria-label="At a glance" className={`${container} pb-18`}>
          <dl className="grid grid-cols-2 border-y border-line md:grid-cols-4">
            {settings.stats.map((stat) => (
              <div key={stat._key} className="py-5 pr-4">
                <dt className="font-mono text-label uppercase text-muted">{stat.label}</dt>
                <dd className="mt-1 font-mono text-metric tabular-nums">{stat.value}</dd>
                <dd className="mt-1 font-mono text-label font-normal text-muted">
                  {[stat.source, formatMonthYear(stegaClean(stat.date))]
                    .filter(Boolean)
                    .join(' · ')}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : preview ? (
        <section aria-label="At a glance" className={`${container} pb-18`}>
          <Placeholder label="Up to four numbers, each with a source and date" />
        </section>
      ) : null}

      {about?.teaserTitle || preview ? (
        <section aria-labelledby="about-heading" className="bg-surface">
          <div className={`${container} flex flex-wrap items-center gap-10 py-16`}>
            <div className="relative flex size-30 shrink-0 items-center justify-center overflow-hidden rounded-full">
              {about?.portrait?.asset?._ref ? (
                <Image
                  src={urlForImage(about.portrait).url()}
                  alt={stegaClean(about.portrait.alt) ?? ''}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              ) : (
                missing('Headshot')
              )}
            </div>
            <div className="flex min-w-0 flex-[999_1_30rem] flex-col gap-3">
              <h2 id="about-heading" className="text-h2">
                {about?.teaserTitle || missing('Teaser title')}
              </h2>
              {about?.teaserText ? (
                <p className="max-w-reading text-muted">{about.teaserText}</p>
              ) : (
                missing('Teaser text')
              )}
              <Link href="/about" className="font-medium">
                More about me
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
