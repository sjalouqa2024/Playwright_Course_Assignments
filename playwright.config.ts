import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  // ✅ GLOBAL TIMEOUTS
  timeout: 60000,  // 60 seconds per test
  expect: {
    timeout: 10000  // 10 seconds for expect assertions
  },

  /* Shared settings for all projects */
  use: {
    // ✅ ACTION TIMEOUT
    actionTimeout: 10000,
    navigationTimeout: 30000,
   // baseURL: 'https://rahulshettyacademy.com/client',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Run tests in files in parallel */
  fullyParallel: false,  // Start with false while debugging
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,  // Single worker while debugging
  reporter: 'html',

  /* Configure projects for major browsers */
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

  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});