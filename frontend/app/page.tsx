import {PortableText} from 'next-sanity'

import * as demo from '@/sanity/lib/demo'
import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {dataAttr} from '@/sanity/lib/utils'

export default async function Page() {
  const {data: settings} = await sanityFetch({query: settingsQuery})

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-semibold">{settings?.title || demo.title}</h1>
      <div
        className="mt-4 text-lg"
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
