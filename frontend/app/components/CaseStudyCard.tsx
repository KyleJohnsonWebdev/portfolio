import {stegaClean} from 'next-sanity'
import {Image} from 'next-sanity/image'
import Link from 'next/link'

import Placeholder from '@/app/components/Placeholder'
import StatusBadge from '@/app/components/StatusBadge'
import {caseStudyStatusLabel} from '@/lib/case-study'
import {urlForImage} from '@/sanity/lib/utils'
import type {AccessibleImage, Metric} from '@/sanity.types'

type CaseStudyCardProps = {
  title: string
  slug: string
  summary?: string | null
  status?: string | null
  launchDate?: string | null
  tag?: string | null
  outcome?: Partial<Metric> | null
  heroImage?: AccessibleImage | null
  preview: boolean
}

/**
 * Home page listing for one case study. The whole card is one link, so there are no
 * nested links. The screenshot is decorative here (alt=""): the title names the work,
 * and the case study page carries the descriptive alt text.
 */
export default function CaseStudyCard({
  title,
  slug,
  summary,
  status,
  launchDate,
  tag,
  outcome,
  heroImage,
  preview,
}: CaseStudyCardProps) {
  const hotspot = heroImage?.hotspot
  const missing = (label: string) => (preview ? <Placeholder label={label} /> : null)

  return (
    <Link
      href={`/work/${stegaClean(slug)}`}
      className="flex flex-col gap-4 rounded-lg border border-line bg-bg p-6 text-ink no-underline transition-colors hover:border-border-strong hover:text-ink"
    >
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-md border border-line bg-surface">
        {heroImage?.asset?._ref ? (
          <Image
            src={urlForImage(heroImage).url()}
            alt=""
            fill
            sizes="(min-width: 1200px) 368px, (min-width: 760px) 33vw, 100vw"
            className="object-cover"
            style={
              hotspot ? {objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%`} : undefined
            }
          />
        ) : (
          missing('Screenshot')
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <StatusBadge>{caseStudyStatusLabel(status, launchDate)}</StatusBadge>
        {tag && <StatusBadge>{tag}</StatusBadge>}
      </div>
      <h3 className="text-h3">{title}</h3>
      {summary && <p className="text-secondary text-muted">{summary}</p>}
      <p className="font-mono text-meta">
        {outcome?.value ? (
          <>
            Outcome: {outcome.value} {outcome.label}
          </>
        ) : (
          missing('One outcome number')
        )}
      </p>
    </Link>
  )
}
