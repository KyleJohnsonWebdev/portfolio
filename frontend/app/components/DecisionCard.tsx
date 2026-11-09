import Placeholder from '@/app/components/Placeholder'
import type {Decision} from '@/sanity.types'

const FIELDS = [
  {key: 'chose', label: 'Chose'},
  {key: 'insteadOf', label: 'Instead of'},
  {key: 'because', label: 'Because'},
  {key: 'cost', label: 'Cost'},
] as const

/** One key decision and its tradeoff. Bordered with `line`; no fill, no shadow. */
export default function DecisionCard({
  decision,
  preview,
}: {
  decision: Partial<Decision>
  preview: boolean
}) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-line p-6">
      <h3 className="text-h3">
        {decision.title || (preview ? <Placeholder label="Decision" /> : null)}
      </h3>
      {/* A grid on the <dl> itself: display: contents would strip list semantics in Safari. */}
      <dl className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
        {FIELDS.map(({key, label}) => (
          <div key={key}>
            <dt className="font-mono text-label uppercase text-muted">{label}</dt>
            <dd className="mt-1">
              {decision[key] || (preview ? <Placeholder label={label} /> : null)}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  )
}
