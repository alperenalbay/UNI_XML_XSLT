import { defineConfig, devices } from '@playwright/test';

/**
 * Uçtan uca testler.
 *
 * Neden gerekli: Tasarımcı (WYSIGWYG) paneli, önizleme iframe'inin İÇİNE
 * tıklanarak çalışıyor. Bu yüzden tarayıcı konsolundan/ekran görüntüsünden
 * doğrulanamıyor; gerçek bir tarayıcı sürücüsü gerekiyor.
 *
 * `npm run test:e2e`
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    // Testler kendi şablonlarını public/templates altına yazar (KVKK için
    // klasör .gitignore'da); test sonunda silinir.
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
