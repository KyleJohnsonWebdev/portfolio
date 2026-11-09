import {defineConfig, devices} from '@playwright/test'

const port = Number(process.env.PORT || 3000)

// Optional: point at an already-installed Chromium instead of downloading one.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined

/**
 * Browser tests run against the production build (`npm run build` first), not the dev
 * server, so they check what visitors actually get.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', {open: 'never'}]] : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure',
    launchOptions: {executablePath},
  },
  projects: [
    {name: 'desktop', use: {...devices['Desktop Chrome'], launchOptions: {executablePath}}},
    {name: 'phone', use: {...devices['Pixel 7'], launchOptions: {executablePath}}},
  ],
  webServer: {
    command: `npx next start -p ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
