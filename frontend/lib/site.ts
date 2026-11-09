/** Primary navigation. `match` decides which link gets aria-current="page". */
export const primaryNav = [
  {href: '/', label: 'Work', match: (path: string) => path === '/' || path.startsWith('/work')},
  {href: '/about', label: 'About', match: (path: string) => path.startsWith('/about')},
  {href: '/resume', label: 'Resume', match: (path: string) => path.startsWith('/resume')},
  {href: '/contact', label: 'Contact', match: (path: string) => path.startsWith('/contact')},
] as const
