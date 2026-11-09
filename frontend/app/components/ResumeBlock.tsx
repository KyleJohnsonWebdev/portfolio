import type {ReactNode} from 'react'

/**
 * One section of the web resume: a mono section label over a hairline, then its entries.
 * Content comes from the Sanity resume singleton and mirrors the PDF.
 */
export default function ResumeBlock({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-6">
      <h2
        id={id}
        className="border-b border-line pb-2 font-mono text-meta font-medium tracking-[0.04em] text-muted uppercase"
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
