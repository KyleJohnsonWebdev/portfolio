import * as demo from '@/sanity/lib/demo'
import {sanityFetch} from '@/sanity/lib/live'
import {siteSettingsQuery} from '@/sanity/lib/queries'

/** Placeholder home until step 5 builds the real one. */
export default async function Page() {
  const {data: settings} = await sanityFetch({query: siteSettingsQuery})

  return (
    <div className="mx-auto flex max-w-page flex-col gap-5 px-4 pt-14 pb-12 md:px-6">
      <h1 className="text-display">{settings?.headline || settings?.name || demo.name}</h1>
      {settings?.positioning && (
        <p className="max-w-reading text-lead text-muted">{settings.positioning}</p>
      )}
    </div>
  )
}
