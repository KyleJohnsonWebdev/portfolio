import {stegaClean} from 'next-sanity'
import {Image} from 'next-sanity/image'

import Placeholder from '@/app/components/Placeholder'
import {urlForImage} from '@/sanity/lib/utils'
import type {AccessibleImage} from '@/sanity.types'

type BrowserFrameProps = {
  image?: AccessibleImage | null
  /** Shown in the address bar, e.g. "contextlayer.design". */
  url?: string | null
  /** Passed to next/image so the browser picks the right size. */
  sizes: string
  /** Set on the first, above-the-fold screenshot only: loads it eagerly at high priority. */
  priority?: boolean
  preview: boolean
}

/**
 * A plain browser chrome around a real screenshot. Fixed 16:10 frame so nothing shifts
 * while the image loads. No device mockups, no tilt, no shadow.
 */
export default function BrowserFrame({image, url, sizes, priority, preview}: BrowserFrameProps) {
  const hasAsset = Boolean(image?.asset?._ref)
  if (!hasAsset && !preview) return null

  const alt = stegaClean(image?.alt) ?? ''
  const hotspot = image?.hotspot
  const objectPosition = hotspot ? `${hotspot.x * 100}% ${hotspot.y * 100}%` : undefined

  return (
    <figure className="overflow-hidden rounded-md border border-line bg-surface">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2" aria-hidden="true">
        <span className="size-2 rounded-full bg-border-strong" />
        <span className="size-2 rounded-full bg-border-strong" />
        <span className="size-2 rounded-full bg-border-strong" />
        {url && <span className="ml-2 font-mono text-label font-normal text-muted">{url}</span>}
      </div>
      <div className="relative flex aspect-[16/10] items-center justify-center">
        {hasAsset && image ? (
          <Image
            src={urlForImage(image).url()}
            alt={alt}
            fill
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            className="object-cover"
            style={objectPosition ? {objectPosition} : undefined}
          />
        ) : (
          <Placeholder label="Screenshot — alt text required" />
        )}
      </div>
      {image?.caption && (
        <figcaption className="border-t border-line px-3 py-2 text-secondary text-muted">
          {image.caption}
        </figcaption>
      )}
    </figure>
  )
}
