import {stegaClean} from 'next-sanity'

import Placeholder from '@/app/components/Placeholder'
import {formatMonthYear, formatRange} from '@/lib/format'
import type {Metric} from '@/sanity.types'

type TLDRProps = {
  role?: string | null
  stack?: string[] | null
  timeline?: {start?: string; end?: string} | null
  outcome?: Partial<Metric> | null
  /** Draft preview: show a Placeholder where a fact is missing. */
  preview: boolean
}

const label = 'font-mono text-label uppercase text-muted'

/** The four facts at the top of every case study: Role, Stack, Timeline, Outcome. */
export default function TLDR({role, stack, timeline, outcome, preview}: TLDRProps) {
  const range = formatRange(stegaClean(timeline?.start), stegaClean(timeline?.end))
  const outcomeDate = formatMonthYear(stegaClean(outcome?.date))
  const missing = (text: string) => (preview ? <Placeholder label={text} /> : null)

  return (
    <dl className="grid grid-cols-1 gap-6 border-t border-line pt-6 md:grid-cols-4">
      <div>
        <dt className={label}>Role</dt>
        <dd className="mt-1">{role || missing('Role')}</dd>
      </div>
      <div>
        <dt className={label}>Stack</dt>
        <dd className="mt-1">{stack?.length ? stack.join(', ') : missing('Stack')}</dd>
      </div>
      <div>
        <dt className={label}>Timeline</dt>
        <dd className="mt-1">{range || missing('Start date')}</dd>
      </div>
      <div>
        <dt className={label}>Outcome</dt>
        <dd className="mt-1">
          {outcome?.value && outcome.label ? (
            <>
              <span className="font-mono">{outcome.value}</span> {outcome.label}
              {outcome.source && (
                <span className="block font-mono text-meta text-muted">
                  {[outcome.source, outcomeDate].filter(Boolean).join(' · ')}
                </span>
              )}
            </>
          ) : (
            missing('One number + source')
          )}
        </dd>
      </div>
    </dl>
  )
}
