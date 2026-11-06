import {site} from '@/lib/site'

/** Copyright on the left; contact links and this site's source on the right. */
export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-page flex-wrap justify-between gap-6 px-4 pt-8 pb-10 text-secondary md:px-6">
        <span className="text-muted">
          © {new Date().getFullYear()} {site.name}
        </span>
        <nav aria-label="Contact" className="flex flex-wrap gap-5">
          <a href={`mailto:${site.email}`}>Email</a>
          <a href={site.linkedInUrl}>LinkedIn</a>
          <a href={site.githubUrl}>GitHub</a>
          <a href={site.repoUrl}>View this site&apos;s source</a>
        </nav>
      </div>
    </footer>
  )
}
