type SiteFooterProps = {
  name: string
  email?: string | null
  linkedInUrl?: string | null
  githubUrl?: string | null
  repoUrl?: string | null
}

/**
 * Copyright on the left; contact links and this site's source on the right.
 * Links come from Site settings; any that are not filled in yet are left out.
 */
export default function SiteFooter({
  name,
  email,
  linkedInUrl,
  githubUrl,
  repoUrl,
}: SiteFooterProps) {
  const links = [
    email && {href: `mailto:${email}`, label: 'Email'},
    linkedInUrl && {href: linkedInUrl, label: 'LinkedIn'},
    githubUrl && {href: githubUrl, label: 'GitHub'},
    repoUrl && {href: repoUrl, label: "View this site's source"},
  ].filter((link): link is {href: string; label: string} => Boolean(link))

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-page flex-wrap justify-between gap-6 px-4 pt-8 pb-10 text-secondary md:px-6">
        <span className="text-muted">
          © {new Date().getFullYear()} {name}
        </span>
        {links.length > 0 && (
          <nav aria-label="Contact" className="flex flex-wrap gap-5">
            {links.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  )
}
