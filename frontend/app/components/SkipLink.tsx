/** First tab stop on every page. Hidden until focused, then shown top-left (WCAG 2.4.1). */
export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-10 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2.5 focus:font-medium focus:text-bg focus:no-underline"
    >
      Skip to main content
    </a>
  )
}
