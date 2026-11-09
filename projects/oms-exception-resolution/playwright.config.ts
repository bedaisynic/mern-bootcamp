import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig } from '@playwright/test';

const external = process.env.OMS_E2E_URL;
const baseURL = external ?? 'http://127.0.0.1:5173';
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  workers: 1,
  use: {
    baseURL, viewport: {width: 1440, height: 940},
    trace: 'retain-on-failure', screenshot: 'only-on-failure',
    launchOptions: process.env.CHROME_PATH ? {executablePath: process.env.CHROME_PATH} : undefined,
  },
  webServer: external ? undefined : {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: false,
    env: {AI_MODE: 'mock', STORAGE_MODE: 'file', EVENT_MODE: 'http', DEMO_AUTH: 'true', DEMO_DATA_DIR: mkdtempSync(join(tmpdir(), 'oms-e2e-'))},
  },
});
