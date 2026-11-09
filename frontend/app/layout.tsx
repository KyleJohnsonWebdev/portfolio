import './globals.css'

import {Analytics} from '@vercel/analytics/next'
import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import SiteFooter from '@/app/components/SiteFooter'
import SiteHeader from '@/app/components/SiteHeader'
import SkipLink from '@/app/components/SkipLink'
import {getSiteUrl, isProductionSite} from '@/lib/site-url'
import {themeScript} from '@/lib/theme'
import * as demo from '@/sanity/lib/demo'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {siteSettingsQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import {handleError} from '@/app/client-utils'

/**
 * Site-wide metadata. Pages override title and description with their own generateMetadata.
 * stega: false keeps Visual Editing's invisible markers out of <title> and meta tags.
 */
export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({query: siteSettingsQuery, stega: false})
  const name = settings?.name || demo.name
  const title = settings?.jobTitle ? `${name}, ${settings.jobTitle}` : name
  const ogImage = resolveOpenGraphImage(settings?.ogImage)

  const description = settings?.seoDescription || settings?.positioning || undefined

  return {
    // Relative URLs in metadata (canonical links, images) resolve against the site's origin.
    metadataBase: getSiteUrl(),
    title: {template: `%s | ${name}`, default: title},
    description,
    openGraph: {
      type: 'website',
      siteName: name,
      locale: 'en_US',
      images: ogImage ? [ogImage] : [],
    },
    twitter: {card: 'summary_large_image'},
    // Previews stay out of search results; robots.txt also blocks crawling there.
    robots: isProductionSite() ? undefined : {index: false, follow: false},
  }
}

const onVercel = Boolean(process.env.VERCEL)

// next/font self-hosts Geist at build time: no request to Google, no layout shift.
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  const {data: settings} = await sanityFetch({query: siteSettingsQuery})

  return (
    // suppressHydrationWarning: the head script may add data-theme before React hydrates.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{__html: themeScript}} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <SiteHeader name={settings?.name || demo.name} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter
          name={settings?.name || demo.name}
          email={settings?.email}
          linkedInUrl={settings?.linkedInUrl}
          githubUrl={settings?.githubUrl}
          repoUrl={settings?.repoUrl}
        />
        {/* Toasts for Sanity Live errors (app/client-utils.ts) and Draft Mode (DraftModeToast). */}
        <Toaster />
        {isDraftMode && (
          <>
            <DraftModeToast />
            {/* Visual Editing overlays, only while Draft Mode is on. */}
            <VisualEditing />
          </>
        )}
        {/* Makes every sanityFetch call live; always rendered. */}
        <SanityLive onError={handleError} />
        {/* Real-visitor analytics and Core Web Vitals. Their scripts exist only on Vercel,
            so they are skipped locally and in CI, where they would 404. */}
        {onVercel && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}
