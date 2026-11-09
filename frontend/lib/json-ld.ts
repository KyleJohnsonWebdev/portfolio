import {stegaClean} from 'next-sanity'

/**
 * Serializes structured data for a <script type="application/ld+json"> tag. Visual Editing
 * markers are stripped, and "<" is escaped so content can never close the script tag early
 * (the XSS guard from the Next.js JSON-LD guide).
 */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(stegaClean(data)).replace(/</g, '\\u003c')
}
