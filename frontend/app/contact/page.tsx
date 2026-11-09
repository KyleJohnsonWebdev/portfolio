import type {Metadata} from 'next'

import Button from '@/app/components/Button'
import {sanityFetch} from '@/sanity/lib/live'
import {contactQuery} from '@/sanity/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({query: contactQuery, stega: false})
  return {title: 'Contact', description: data?.availability || undefined}
}

/**
 * Email, LinkedIn and GitHub. The email is also shown as plain, selectable text because
 * a mailto link can fail when no mail app is set up. No form in v1.
 */
export default async function ContactPage() {
  const {data: contact} = await sanityFetch({query: contactQuery})

  return (
    <div className="pb-24">
      <section className="bg-surface">
        <div className="mx-auto flex w-full max-w-page flex-col gap-5 px-4 py-14 md:px-6">
          <h1 className="text-h1">Contact</h1>
          {contact?.availability && (
            <p className="max-w-reading text-lead text-muted">{contact.availability}</p>
          )}
          <ul className="flex flex-wrap gap-3">
            {contact?.email && (
              <li>
                <Button href={`mailto:${contact.email}`} variant="primary" prefetch={false}>
                  Email me
                </Button>
              </li>
            )}
            {contact?.linkedInUrl && (
              <li>
                <Button href={contact.linkedInUrl} prefetch={false}>
                  LinkedIn
                </Button>
              </li>
            )}
            {contact?.githubUrl && (
              <li>
                <Button href={contact.githubUrl} prefetch={false}>
                  GitHub
                </Button>
              </li>
            )}
          </ul>
          <p className="font-mono text-meta text-muted">
            {[contact?.email, contact?.location, contact?.timezone].filter(Boolean).join(' · ')}
          </p>
        </div>
      </section>
    </div>
  )
}
