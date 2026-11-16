import {expect, test} from '@playwright/test'

import {publishedRoutes} from './routes'

test('every published page loads with one h1, no skipped headings and no sideways scroll', async ({
  page,
  request,
}) => {
  const routes = await publishedRoutes(request)
  expect(routes, 'the sitemap lists the home page').toContain('/')

  for (const route of routes) {
    await test.step(route, async () => {
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)

      await expect(page.locator('h1')).toHaveCount(1)

      const levels = await page
        .locator('main h1, main h2, main h3, main h4')
        .evaluateAll((headings) => headings.map((h) => Number(h.tagName[1])))
      levels.forEach((level, i) => {
        if (i > 0)
          expect(level - levels[i - 1], `heading after h${levels[i - 1]}`).toBeLessThanOrEqual(1)
      })

      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      )
      expect(overflows, 'horizontal scroll').toBe(false)
    })
  }
})

test('unknown case studies return a 404', async ({page}) => {
  const response = await page.goto('/work/this-page-does-not-exist')
  expect(response?.status()).toBe(404)
})

test('the skip link is the first tab stop and moves focus to main', async ({page, isMobile}) => {
  test.skip(isMobile, 'keyboard navigation is checked on desktop')
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skipLink = page.getByRole('link', {name: 'Skip to main content'})
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
})

test('a saved theme applies before first paint and the toggle cycles', async ({page}) => {
  await page.emulateMedia({colorScheme: 'light'})
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('theme', 'dark')
      sessionStorage.setItem('seeded', '1')
    }
    document.addEventListener('DOMContentLoaded', () => {
      ;(window as unknown as {themeAtDCL: string | null}).themeAtDCL =
        document.documentElement.getAttribute('data-theme')
    })
  })
  await page.goto('/')
  const themeAtDCL = await page.evaluate(
    () => (window as unknown as {themeAtDCL: string | null}).themeAtDCL,
  )
  expect(themeAtDCL, 'data-theme set by the head script, before hydration').toBe('dark')

  const toggle = page.getByRole('button', {name: /switch color theme/i})
  await expect(toggle).toHaveAccessibleName(/current: dark/i)
  await toggle.click()
  await expect(page.locator('html')).not.toHaveAttribute('data-theme')
  await expect(toggle).toHaveAccessibleName(/current: system/i)
})

test('robots.txt and sitemap.xml are served', async ({request}) => {
  expect((await request.get('/robots.txt')).ok()).toBe(true)
  expect((await request.get('/sitemap.xml')).ok()).toBe(true)
})

test('/contact redirects permanently to the contact section on About', async ({request}) => {
  const response = await request.get('/contact', {maxRedirects: 0})
  expect(response.status()).toBe(308)
  expect(response.headers()['location']).toBe('/about#contact')
})

test('the nav highlights Contact on the contact section and About above it', async ({page}) => {
  const nav = page.getByRole('navigation', {name: 'Primary'})
  const about = nav.getByRole('link', {name: 'About', exact: true})
  const contact = nav.getByRole('link', {name: 'Contact', exact: true})

  // Arriving through the Contact link: Contact is the current location.
  await page.goto('/about#contact')
  await expect(contact).toHaveAttribute('aria-current', 'location')
  await expect(about).toHaveAttribute('aria-current', 'page')

  // Scrolling back up to the story: Contact is no longer highlighted.
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(contact).not.toHaveAttribute('aria-current', 'location')
  await expect(about).toHaveAttribute('aria-current', 'page')
})

test('after jumping to the contact section, Tab reaches the email button first', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'keyboard navigation is checked on desktop')
  const contactLink = page
    .getByRole('navigation', {name: 'Primary'})
    .getByRole('link', {name: 'Contact', exact: true})

  // From another page, and from the top of About itself.
  for (const start of ['/', '/about']) {
    await test.step(`from ${start}`, async () => {
      await page.goto(start)
      await contactLink.click()
      await expect(page).toHaveURL(/\/about#contact$/)
      await page.keyboard.press('Tab')
      await expect(page.getByRole('link', {name: 'Email me'})).toBeFocused()
    })
  }
})
