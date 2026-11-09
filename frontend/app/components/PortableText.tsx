import {
  PortableText as BasePortableText,
  stegaClean,
  type PortableTextBlock,
  type PortableTextComponents,
} from 'next-sanity'

import type {RichText} from '@/sanity.types'

/**
 * Renders Sanity rich text for case study sections and the About story. Section h2s come
 * from the page, so the only heading editors can add is h3. Links are underlined so they
 * don't rely on color alone. No colors, sizes or raw HTML from the CMS.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p>{children}</p>,
    h3: ({children}) => <h3 className="mt-4 text-h3">{children}</h3>,
  },
  list: {
    bullet: ({children}) => <ul className="flex list-disc flex-col gap-2 pl-5">{children}</ul>,
    number: ({children}) => <ol className="flex list-decimal flex-col gap-2 pl-5">{children}</ol>,
  },
  marks: {
    code: ({children}) => (
      <code className="rounded-sm bg-surface px-1.5 py-px font-mono text-[0.9em]">{children}</code>
    ),
    link: ({children, value}) => {
      const href = stegaClean((value as {href?: string} | undefined)?.href)
      return href ? (
        <a href={href} className="underline underline-offset-2">
          {children}
        </a>
      ) : (
        <>{children}</>
      )
    },
  },
}

export default function PortableText({value}: {value?: RichText | null}) {
  if (!value?.length) return null
  return (
    <div className="flex max-w-reading flex-col gap-4">
      {/* TypeGen marks span children optional; the renderer handles missing children safely. */}
      <BasePortableText value={value as PortableTextBlock[]} components={components} />
    </div>
  )
}
