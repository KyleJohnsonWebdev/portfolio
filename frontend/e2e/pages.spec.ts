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
