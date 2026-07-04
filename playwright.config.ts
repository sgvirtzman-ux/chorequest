import { existsSync } from 'node:fs'
import { defineConfig } from '@playwright/test'

// this cloud environment ships Chromium at a fixed path; elsewhere fall back
// to Playwright's own managed browser download
const PREINSTALLED_CHROMIUM = '/opt/pw-browsers/chromium'

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:4173',
    launchOptions: existsSync(PREINSTALLED_CHROMIUM)
      ? { executablePath: PREINSTALLED_CHROMIUM }
      : {},
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
})
