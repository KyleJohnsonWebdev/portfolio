'use client'

import dynamic from 'next/dynamic'

/**
 * Loads DraftModeToast only when it renders, which is only in Draft Mode. Importing it
 * directly put ~580 KB of Sanity editing code on every page for every visitor, because
 * Next.js bundles all client components a layout imports, rendered or not.
 */
const DraftModeToast = dynamic(() => import('@/app/components/DraftModeToast'), {ssr: false})

export default function DraftModeToastLoader() {
  return <DraftModeToast />
}
