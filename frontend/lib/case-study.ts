import {stegaClean} from 'next-sanity'

import {formatMonthYear} from '@/lib/format'

/** "Live", "Launching Mar 2027" or "In progress", for StatusBadge. */
export function caseStudyStatusLabel(
  status: string | null | undefined,
  launchDate: string | null | undefined,
): string {
  if (stegaClean(status) === 'live') return 'Live'
  const launch = formatMonthYear(stegaClean(launchDate))
  return launch ? `Launching ${launch}` : 'In progress'
}
