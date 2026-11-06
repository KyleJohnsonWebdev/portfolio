import {PortableText} from 'next-sanity'

import * as demo from '@/sanity/lib/demo'
import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {dataAttr} from '@/sanity/lib/utils'

/** Placeholder home until step 5 builds the real one. */
export default async function Page() {
  const {data: settings} = await sanityFetch({query: settingsQuery})

  return (
    <div className="mx-auto flex max-w-page flex-col gap-5 px-4 pt-14 pb-12 md:px-6">
      <h1 className="text-display">{settings?.title || demo.title}</h1>
      <div
        className="max-w-reading text-lead text-muted"
        data-sanity={
          settings?._id
            ? dataAttr({id: settings._id, type: 'settings', path: 'description'}).toString()
            : undefined
        }
      >
        {settings?.description ? (
          <PortableText value={settings.description} />
        ) : (
          <p>{demo.description}</p>
        )}
      </div>
    </div>
  )
}
