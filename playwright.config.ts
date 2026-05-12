import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:4173/ae-bootcamp-capstone/';
const videoMode = process.env.PW_VIDEO ?? 'retain-on-failure';
const traceMode = process.env.PW_TRACE ?? 'retain-on-failure';
const headless = process.env.PW_HEADLESS ? process.env.PW_HEADLESS !== 'false' : true;

export default defineConfig({
  testDir: './tests/e2e/playwright',
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL,
    headless,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: videoMode,
    trace: traceMode,
  },
  webServer: {
    command: 'npm run build && npm run preview -- --host --port 4173',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
