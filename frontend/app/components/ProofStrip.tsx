import {stegaClean} from 'next-sanity'

import Placeholder from '@/app/components/Placeholder'
import {formatMonthYear} from '@/lib/format'
import type {LighthouseProof} from '@/sanity.types'

const PASS_THRESHOLD = 90

const SCORES = [
  {key: 'performance', label: 'Performance'},
  {key: 'accessibility', label: 'Accessibility'},
  {key: 'bestPractices', label: 'Best practices'},
  {key: 'seo', label: 'SEO'},
] as const

const label = 'font-mono text-label uppercase text-muted'

/**
 * The signature component: Lighthouse mobile scores, a report link and the test date.
 * A score without a test date is never shown. On a published page with no tested scores
 * the strip is left out; in draft preview it shows Placeholders instead.
 */
export default function ProofStrip({
  proof,
  preview,
}: {
  proof?: LighthouseProof | null
  preview: boolean
}) {
  const testedOn = formatMonthYear(stegaClean(proof?.testedOn))
  const hasScore = SCORES.some(({key}) => typeof proof?.[key] === 'number')
  const ready = Boolean(testedOn && hasScore)
  if (!ready && !preview) return null

  const reportUrl = stegaClean(proof?.reportUrl)

  return (
    <section aria-labelledby="proof-heading" className="bg-surface">
      <div className="mx-auto flex max-w-page flex-col gap-4 px-4 py-8 md:px-6">
        <h2 id="proof-heading" className={label}>
          Proof · Lighthouse mobile · Tested {ready ? testedOn : <Placeholder label="Test date" />}
        </h2>
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-5">
          {SCORES.map(({key, label: scoreLabel}) => {
            const score = ready ? proof?.[key] : undefined
            if (typeof score !== 'number' && !preview) return null
            return (
              <div key={key}>
                <dt className={label}>{scoreLabel}</dt>
                <dd className="mt-1 font-mono text-metric tabular-nums">
                  {typeof score === 'number' ? (
                    <>
                      {score}
                      {score >= PASS_THRESHOLD && (
                        <span className="mt-1 block text-label text-pass">Pass</span>
                      )}
                    </>
                  ) : (
                    <Placeholder label="00" />
                  )}
                </dd>
              </div>
            )
          })}
          {(reportUrl || preview) && (
            <div>
              <dt className={label}>Report</dt>
              <dd className="mt-2">
                {reportUrl ? (
                  <a href={reportUrl}>Full report</a>
                ) : (
                  <Placeholder label="Report URL" />
                )}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  )
}
