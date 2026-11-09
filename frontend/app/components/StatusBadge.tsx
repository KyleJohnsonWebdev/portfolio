import type {ReactNode} from 'react'

/** A small mono label for project state or role: "Live", "In progress", "Launching Mar 2027". Text, never color alone. */
export default function StatusBadge({children}: {children: ReactNode}) {
  return (
    <span className="inline-block rounded-sm border border-border-strong px-2 py-0.5 font-mono text-label leading-normal font-normal tracking-normal text-ink">
      {children}
    </span>
  )
}
