import Link from 'next/link'
import {stegaClean, type StegaBranded} from 'next-sanity'
import type {ReactNode} from 'react'

import BrowserFrame from '@/app/components/BrowserFrame'
import DecisionCard from '@/app/components/DecisionCard'
import Placeholder from '@/app/components/Placeholder'
import PortableText from '@/app/components/PortableText'
import ProofStrip from '@/app/components/ProofStrip'
import StatusBadge from '@/app/components/StatusBadge'
import TLDR from '@/app/components/TLDR'
import {displayHost, formatMonthYear} from '@/lib/format'
import type {CaseStudyQueryResult} from '@/sanity.types'

const container = 'mx-auto w-full max-w-page px-4 md:px-6'

/** One case study section: an h2 and its content, labelled for screen reader navigation. */
function Section({id, title, children}: {id: string; title: string; children: ReactNode}) {
  return (
    <section aria-labelledby={id} className={`${container} flex flex-col gap-4`}>
      <h2 id={id} className="text-h2">
        {title}
      </h2>
      {children}
    </section>
  )
}

/**
 * The case study page layout: TL;DR → Proof Strip → hero → problem → constraints →
 * decisions → outcome → what's next. Kept separate from page.tsx so it takes plain data.
 * In draft preview, missing facts show as Placeholders; on a published page they never occur.
 */
export default function CaseStudyView({
  study,
  preview,
}: {
  // Branded: strings may carry Visual Editing markers, so clean before comparing or linking.
  study: StegaBranded<NonNullable<CaseStudyQueryResult>>
  preview: boolean
}) {
  const status = stegaClean(study.status)
  const launch = formatMonthYear(stegaClean(study.launchDate))
  const statusLabel = status === 'live' ? 'Live' : launch ? `Launching ${launch}` : 'In progress'
  const liveUrl = stegaClean(study.liveUrl)
  const repoUrl = stegaClean(study.repoUrl)
  const missing = (label: string) => (preview ? <Placeholder label={label} /> : null)
  // In a section's flex column a bare Placeholder would stretch; a <p> keeps it inline-sized.
  const missingBlock = (label: string) =>
    preview ? (
      <p>
        <Placeholder label={label} />
      </p>
    ) : null

  return (
    <article className="flex flex-col gap-18 pb-24">
      <header className={`${container} flex flex-col gap-5 pt-16`}>
        <Link href="/#work" className="text-secondary">
          ← All work
        </Link>
        <div className="flex flex-wrap gap-2">
          <StatusBadge>{statusLabel}</StatusBadge>
          <StatusBadge>
            Case study {study.position} of {study.total}
          </StatusBadge>
        </div>
        <h1 className="text-display">{study.title}</h1>
        <p className="max-w-reading text-lead text-muted">
          {study.summary || missing('One-sentence summary')}
        </p>
        <div className="mt-4">
          <TLDR
            role={study.role}
            stack={study.stack}
            timeline={study.timeline}
            outcome={study.outcome}
            preview={preview}
          />
        </div>
        {(liveUrl || repoUrl) && (
          <p className="flex flex-wrap gap-x-2 text-secondary">
            {liveUrl && <a href={liveUrl}>Visit the live site</a>}
            {liveUrl && repoUrl && <span aria-hidden="true">·</span>}
            {repoUrl && <a href={repoUrl}>View the repo</a>}
          </p>
        )}
      </header>

      <ProofStrip proof={study.proof} preview={preview} />

      {study.heroImage?.asset || preview ? (
        <div className={container}>
          <BrowserFrame
            image={study.heroImage}
            url={displayHost(liveUrl) ?? study.title}
            sizes="(min-width: 1200px) 1152px, 100vw"
            priority
            preview={preview}
          />
        </div>
      ) : null}

      <Section id="problem" title="Problem">
        {study.problem?.length ? (
          <PortableText value={study.problem} />
        ) : (
          missingBlock('What was broken, and how you know')
        )}
      </Section>

      <Section id="constraints" title="Constraints">
        {study.constraints?.length ? (
          <ul className="flex max-w-reading list-disc flex-col gap-2 pl-5">
            {study.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        ) : (
          missingBlock('Time, budget, audience or tech')
        )}
      </Section>

      <Section id="decisions" title="Key decisions">
        {study.decisions?.length ? (
          <div className="flex flex-col gap-5">
            {study.decisions.map((decision) => (
              <DecisionCard key={decision._key} decision={decision} preview={preview} />
            ))}
          </div>
        ) : (
          missingBlock('Two or three decisions')
        )}
      </Section>

      <Section id="outcome" title="Outcome">
        {study.outcomeStory?.length ? (
          <PortableText value={study.outcomeStory} />
        ) : (
          missingBlock('What changed')
        )}
        {study.metrics?.length ? (
          <ul className="flex flex-col gap-2">
            {study.metrics.map((metric) => (
              <li key={metric._key}>
                <span className="font-mono">{metric.value}</span> {metric.label}
                <span className="font-mono text-meta text-muted">
                  {' · '}
                  {metric.sourceUrl ? (
                    <a href={stegaClean(metric.sourceUrl)}>{metric.source}</a>
                  ) : (
                    metric.source
                  )}
                  {' · '}
                  {formatMonthYear(stegaClean(metric.date))}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      {study.gallery?.length ? (
        <section aria-label="Screenshots" className={`${container} grid gap-6 md:grid-cols-2`}>
          {study.gallery.map((image) => (
            <BrowserFrame
              key={image._key}
              image={image}
              url={displayHost(liveUrl) ?? study.title}
              sizes="(min-width: 1200px) 564px, (min-width: 760px) 50vw, 100vw"
              preview={preview}
            />
          ))}
        </section>
      ) : null}

      {study.nextSteps?.length || preview ? (
        <Section id="next-steps" title="What's next">
          {study.nextSteps?.length ? (
            <PortableText value={study.nextSteps} />
          ) : (
            missingBlock('Date or milestone')
          )}
        </Section>
      ) : null}

      <div className={container}>
        <nav
          aria-label="More case studies"
          className="flex flex-wrap justify-between gap-4 border-t border-line pt-6"
        >
          <Link href="/#work">← All work</Link>
          {study.next && (
            <Link href={`/work/${stegaClean(study.next.slug)}`}>Next: {study.next.title} →</Link>
          )}
        </nav>
      </div>
    </article>
  )
}
