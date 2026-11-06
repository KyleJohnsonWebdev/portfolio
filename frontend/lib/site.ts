/**
 * Site-wide identity and contact links used by the header and footer.
 * Temporary: step 3 moves these into the siteSettings document so they are editable in the Studio.
 */
export const site = {
  name: 'Kyle Johnson',
  email: 'KyleT.Johnson@gmail.com',
  linkedInUrl: 'https://linkedin.com/in/kjohnson-dev',
  githubUrl: 'https://github.com/KyleJohnsonWebdev',
  repoUrl: 'https://github.com/KyleJohnsonWebdev/portfolio',
} as const

/** Primary navigation. `match` decides which link gets aria-current="page". */
export const primaryNav = [
  {href: '/', label: 'Work', match: (path: string) => path === '/' || path.startsWith('/work')},
  {href: '/about', label: 'About', match: (path: string) => path.startsWith('/about')},
  {href: '/resume', label: 'Resume', match: (path: string) => path.startsWith('/resume')},
  {href: '/contact', label: 'Contact', match: (path: string) => path.startsWith('/contact')},
] as const
