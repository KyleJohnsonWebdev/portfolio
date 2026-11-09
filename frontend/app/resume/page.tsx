import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'

import Button from '@/app/components/Button'
import Placeholder from '@/app/components/Placeholder'
import ResumeBlock from '@/app/components/ResumeBlock'
import {formatFileSize, formatRange} from '@/lib/format'
import * as demo from '@/sanity/lib/demo'
import {sanityFetch} from '@/sanity/lib/live'
import {resumeQuery} from '@/sanity/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({query: resumeQuery, stega: false})
  return {
    title: 'Resume',
    description: data.resume?.summary || undefined,
    alternates: {canonical: '/resume'},
  }
}

/** "Jul 2017 – Present", "Mar 2020 – Sep 2022", or a label such as "7 years". */
function period(entry: {start?: string; end?: string; periodLabel?: string}) {
  const range = formatRange(stegaClean(entry.start), stegaClean(entry.end))
  return range ? range.replace(/present$/, 'Present') : entry.periodLabel || null
}

/** The web resume. It mirrors the PDF, which downloads from the button at the top. */
export default async function ResumePage() {
  const [{data}, {isEnabled: preview}] = await Promise.all([
    sanityFetch({query: resumeQuery}),
    draftMode(),
  ])
  const {resume, settings} = data
  if (!resume && !preview) notFound()

  const pdfUrl = stegaClean(settings?.pdf?.url)
  const pdfSize = formatFileSize(settings?.pdf?.size)

  return (
    <div className="mx-auto flex w-full max-w-resume flex-col gap-10 px-4 pt-14 pb-24 md:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h1">{settings?.name || demo.name}</h1>
          {resume?.tagline && <p className="mt-1.5 text-muted">{resume.tagline}</p>}
        </div>
        {pdfUrl ? (
          <Button href={`${pdfUrl}?dl=Kyle-Johnson-Resume.pdf`} variant="primary" prefetch={false}>
            Download PDF
            {pdfSize && <span className="ml-2 text-meta opacity-90">(PDF, {pdfSize})</span>}
          </Button>
        ) : preview ? (
          <Placeholder label="Resume PDF in Site settings" />
        ) : null}
      </header>

      {resume?.summary && (
        <ResumeBlock id="summary" title="Summary">
          <p className="text-secondary">{resume.summary}</p>
        </ResumeBlock>
      )}

      {resume?.experience?.length ? (
        <ResumeBlock id="experience" title="Experience">
          {resume.experience.map((job) => (
            <article key={job._key} className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">
                  {[job.role, job.organization].filter(Boolean).join(' · ')}
                </h3>
                <span className="font-mono text-label uppercase text-muted">
                  {[period(job), job.location].filter(Boolean).join(' · ')}
                </span>
              </div>
              {job.bullets?.length ? (
                <ul className="flex list-disc flex-col gap-1 pl-5 text-secondary">
                  {job.bullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </ResumeBlock>
      ) : null}

      {resume?.skills?.length ? (
        <ResumeBlock id="skills" title="Skills">
          <dl className="flex flex-col gap-2 text-secondary">
            {resume.skills.map((group) => (
              <div key={group._key}>
                <dt className="inline font-semibold">{group.group}: </dt>
                <dd className="inline">{group.items?.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </ResumeBlock>
      ) : null}

      {resume?.education?.length ? (
        <ResumeBlock id="education" title="Education">
          <div className="flex flex-col gap-2 text-secondary">
            {resume.education.map((entry) => (
              <p key={entry._key}>
                <strong className="font-semibold">{entry.credential}</strong>
                {[entry.school, entry.year, entry.honors]
                  .filter(Boolean)
                  .map((part) => ` · ${part}`)
                  .join('')}
              </p>
            ))}
          </div>
        </ResumeBlock>
      ) : null}
    </div>
  )
}
