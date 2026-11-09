import AxeBuilder from '@axe-core/playwright'
import {expect, test} from '@playwright/test'

import {publishedRoutes} from './routes'

// WCAG 2.2 AA, the project's bar, plus the earlier levels it includes.
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

for (const colorScheme of ['light', 'dark'] as const) {
  test(`every published page passes axe in ${colorScheme} mode`, async ({page, request}) => {
    await page.emulateMedia({colorScheme})
    const routes = [...(await publishedRoutes(request)), '/work/this-page-does-not-exist']

    for (const route of routes) {
      await test.step(route, async () => {
        await page.goto(route)
        const results = await new AxeBuilder({page}).withTags(WCAG_TAGS).analyze()
        expect(
          results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`),
          `axe violations on ${route}`,
        ).toEqual([])
      })
    }
  })
}
