'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'

import ThemeToggle from '@/app/components/ThemeToggle'
import {primaryNav} from '@/lib/site'

/**
 * Moves keyboard focus to a section without scrolling. Next.js scrolls to #hash targets
 * itself, which leaves focus on the link; this puts the next Tab inside the section.
 */
function focusSection(id: string) {
  document.getElementById(id)?.focus({preventScroll: true})
}

/**
 * Whether an element is mostly on screen. Used for the Contact section at the bottom of
 * About, so the nav highlights what the visitor is actually looking at.
 */
function useSectionInView(id: string | null) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = id ? document.getElementById(id) : null
    if (!element) return
    // Arriving from another page through the section's link: give it keyboard focus.
    if (window.location.hash === `#${id}`) element.focus({preventScroll: true})
    // The observer reports the current state as soon as it starts, then on every change.
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.4,
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [id])

  return inView
}

/** Name on the left, four nav links and the ThemeToggle on the right. Wraps on phones; no hamburger. */
export default function SiteHeader({name}: {name: string}) {
  const pathname = usePathname()

  // Contact is a section of About. While it's on screen, Contact is highlighted instead of About.
  const contactSection = primaryNav.find((item) => 'section' in item)?.section
  const onSectionPage = Boolean(contactSection && pathname === contactSection.page)
  const sectionInView = useSectionInView(onSectionPage && contactSection ? contactSection.id : null)
  const contactActive = onSectionPage && sectionInView

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-4 px-4 py-5 md:px-6">
        <Link href="/" className="font-semibold text-ink no-underline hover:text-ink">
          {name}
        </Link>
        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 text-secondary md:gap-6"
        >
          {primaryNav.map((item) => {
            const isSection = 'section' in item
            // Screen readers: the page stays "current page"; the section is the "current location".
            const isPage = item.match(pathname)
            const isLocation = isSection && contactActive
            const highlighted = isSection ? contactActive : isPage && !contactActive
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isLocation ? 'location' : isPage ? 'page' : undefined}
                onClick={
                  // Already on the page: the effect above won't re-run, so focus here.
                  isSection && onSectionPage
                    ? () => requestAnimationFrame(() => focusSection(item.section.id))
                    : undefined
                }
                className={highlighted ? 'text-ink' : 'text-muted hover:text-ink'}
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
