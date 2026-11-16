/**
 * Primary navigation. `match` decides which link marks the current page. Contact is a
 * section at the bottom of About, so it has a `section` id instead: the header highlights
 * it while that section is on screen (see SiteHeader).
 */
export const primaryNav = [
  {href: '/', label: 'Work', match: (path: string) => path === '/' || path.startsWith('/work')},
  {href: '/about', label: 'About', match: (path: string) => path.startsWith('/about')},
  {href: '/resume', label: 'Resume', match: (path: string) => path.startsWith('/resume')},
  {
    href: '/about#contact',
    label: 'Contact',
    match: () => false,
    section: {page: '/about', id: 'contact'},
  },
] as const
