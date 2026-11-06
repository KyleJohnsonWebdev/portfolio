'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import ThemeToggle from '@/app/components/ThemeToggle'
import {primaryNav, site} from '@/lib/site'

/** Name on the left, four nav links and the ThemeToggle on the right. Wraps on phones; no hamburger. */
export default function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-4 px-4 py-5 md:px-6">
        <Link href="/" className="font-semibold text-ink no-underline hover:text-ink">
          {site.name}
        </Link>
        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 text-secondary md:gap-6"
        >
          {primaryNav.map((item) => {
            const isCurrent = item.match(pathname)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent ? 'page' : undefined}
                className={isCurrent ? 'text-ink' : 'text-muted hover:text-ink'}
              >
                {item.label}
              </Link>
            )
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
