/**
 * The project's publishing rules, written as plain functions so they can be unit-tested
 * (validation.test.ts) without a running Studio. Each returns `true` when the value is
 * fine, or an error message that blocks publishing.
 *
 * - Every image needs alt text.
 * - A client case study can't publish until the client's permission is confirmed.
 * - Lighthouse scores can't publish without the date they were tested.
 * - A resume entry needs real dates or an explicit period label; never a guessed date.
 */

export type ValidationResult = true | string

type ImageLike = {asset?: {_ref?: string} | null} | null | undefined

/** Alt text is required whenever an image asset is present. */
export function altTextRequired(alt: string | undefined, image: ImageLike): ValidationResult {
  if (image?.asset?._ref && !alt?.trim()) {
    return 'Alt text is required. Describe what the image shows or proves.'
  }
  return true
}

type CaseStudyLike = {
  client?: string
  clientPermission?: {confirmed?: boolean; confirmedOn?: string} | null
}

/** If a case study names a client, the client must have said yes in writing. */
export function clientPermissionRequired(doc: CaseStudyLike | undefined): ValidationResult {
  if (!doc?.client?.trim()) return true
  if (!doc.clientPermission?.confirmed) {
    return 'This case study names a client. Confirm their written permission before publishing.'
  }
  if (!doc.clientPermission.confirmedOn) {
    return 'Add the date the client gave permission.'
  }
  return true
}

type ProofLike = {
  performance?: number
  accessibility?: number
  bestPractices?: number
  seo?: number
  testedOn?: string
} | null

/** A Lighthouse score without a test date is not shown, so it can't be published. */
export function testDateRequiredForScores(proof: ProofLike | undefined): ValidationResult {
  if (!proof) return true
  const scores = [proof.performance, proof.accessibility, proof.bestPractices, proof.seo]
  const hasScore = scores.some((score) => typeof score === 'number')
  if (hasScore && !proof.testedOn) {
    return 'Add the date these scores were tested. A score without a date is not shown.'
  }
  return true
}

/** A Lighthouse score is a whole number from 0 to 100. */
export function isLighthouseScore(value: number | undefined): ValidationResult {
  if (value === undefined) return true
  if (!Number.isInteger(value) || value < 0 || value > 100) {
    return 'Lighthouse scores are whole numbers from 0 to 100.'
  }
  return true
}

type DatedEntryLike = {start?: string; end?: string; periodLabel?: string} | undefined

/** Resume and timeline entries need a start date or an explicit label such as "7 years". */
export function startOrPeriodLabelRequired(entry: DatedEntryLike): ValidationResult {
  if (!entry?.start && !entry?.periodLabel?.trim()) {
    return 'Add a start date, or a period label such as "7 years" if the dates are not known.'
  }
  return true
}

/** End dates can't come before start dates. */
export function endNotBeforeStart(entry: DatedEntryLike): ValidationResult {
  if (entry?.start && entry.end && entry.end < entry.start) {
    return 'The end date is before the start date.'
  }
  return true
}

/** A live case study links to the live site. */
export function liveUrlRequiredWhenLive(
  liveUrl: string | undefined,
  status: string | undefined,
): ValidationResult {
  if (status === 'live' && !liveUrl) {
    return 'A live case study needs the live site URL.'
  }
  return true
}

type CaseStudyObjects = {
  heroImage?: {asset?: {_ref?: string} | null} | null
  outcome?: {value?: string} | null
  timeline?: {start?: string} | null
}

/**
 * Object fields (images, metrics, the timeline) report a missing value only as a warning,
 * even with .error(), and warnings don't block publishing. This check runs on the title,
 * which every draft has, so their absence blocks publishing too.
 */
export function caseStudyObjectsRequired(doc: CaseStudyObjects | undefined): ValidationResult {
  const missing = [
    !doc?.heroImage?.asset?._ref && 'a hero screenshot',
    !doc?.outcome?.value && 'the headline outcome',
    !doc?.timeline?.start && 'a timeline start date',
  ].filter(Boolean)
  if (missing.length === 0) return true
  return `Before publishing, add ${missing.join(', ')}.`
}
