import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration.
 *
 * - UI tests (tests/ui, tests-js) run against https://www.saucedemo.com
 * - API tests (tests/api) run against https://reqres.in/api and set their
 *   own baseURL via `test.use({ baseURL: ... })` in the spec file.
 *
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: '.',
  testMatch: ['tests/**/*.spec.ts', 'tests-js/**/*.spec.js'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
    // saucedemo.com identifies elements with `data-test` (not the Playwright
    // default of `data-testid`), so getByTestId() is pointed at that attribute.
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
