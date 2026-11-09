/**
 * Formats a Sanity date ("2026-11-01") as "Nov 2026". Sanity dates have no time zone,
 * so they are read and formatted in UTC; otherwise a visitor west of UTC could see the
 * previous month.
 */
const monthYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatMonthYear(date: string | null | undefined): string | null {
  if (!date) return null
  const parsed = new Date(`${date}T00:00:00Z`)
  return Number.isNaN(parsed.getTime()) ? null : monthYear.format(parsed)
}

/** "Jan 2026 – present" or "Jan 2026 – Mar 2026". */
export function formatRange(start: string | null | undefined, end: string | null | undefined) {
  const from = formatMonthYear(start)
  if (!from) return null
  return `${from} – ${formatMonthYear(end) ?? 'present'}`
}

/** The host of a URL without "www.", for the browser frame's address bar. */
export function displayHost(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return null
  }
}

/** File size for download links: "84 KB", "1.2 MB". */
export function formatFileSize(bytes: number | null | undefined): string | null {
  if (!bytes || bytes < 0) return null
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
