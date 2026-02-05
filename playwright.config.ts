import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config'; // Make sure this is here to read .env

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  // SERVER ORCHESTRATION
  webServer: {
    command: 'npx ts-node server.ts', 
    url: 'http://localhost:3000',     
    reuseExistingServer: !process.env.CI, // Locally, use the one you started. In CI, start a new one.
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120 * 1000, 
  },

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});