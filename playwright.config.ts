import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', 
  timeout: 30 * 1000, 
  retries: 0, 
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'off', 
    screenshot: 'only-on-failure',
    baseURL: 'https://sport.ceskatelevize.cz/',
  },
});