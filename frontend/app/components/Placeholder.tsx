/**
 * Marks a fact that is not in yet, e.g. [LIGHTHOUSE SCORE]. Shown only in draft preview:
 * a published page never has a gap, because missing required facts block publishing.
 * Never replace it with an estimate.
 */
export default function Placeholder({label}: {label: string}) {
  return (
    <span className="inline-block rounded-sm border-[1.5px] border-dashed border-border-strong bg-surface px-2 py-0.5 font-mono text-meta text-muted">
      [{label.toUpperCase()}]
    </span>
  )
}
