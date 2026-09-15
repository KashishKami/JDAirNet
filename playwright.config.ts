import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load .env.test explicitly (fallback to .env.example if .env.test is not created)
const envTestPath = path.resolve(__dirname, '.env.test')
const envExamplePath = path.resolve(__dirname, '.env.example')
if (fs.existsSync(envTestPath)) {
  dotenv.config({ path: envTestPath })
} else if (fs.existsSync(envExamplePath)) {
  dotenv.config({ path: envExamplePath })
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3007',
    trace: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 20_000,
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3007',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
})
