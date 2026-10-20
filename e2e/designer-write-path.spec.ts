import { test, expect, type Page, type FrameLocator } from '@playwright/test';
import { writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Tasarımcı yazma yolu — regresyon testi.
 *
 * Bu test, uygulamanın EN KRİTİK zincirini baştan sona doğrular:
 *
 *   eleman seçimi (liste veya iframe tıklaması)
 *     → iframe → app postMessage
 *     → stil panelinin doldurulması
 *     → handleStyleChange
 *     → XSLT kodunun yazılması
 *     → yeniden dönüştürme
 *     → önizlemede görünür değişiklik
 *
 * Regresyon notu: bu zincirin bir halkası koptuğunda (ör. stil paneli
 * dolmadan, ya da handleStyleChange yanlış yere yazdığında) uygulama sessiz
 * bir şekilde bozuk tasarım üretiyordu — kullanıcı hata nereden geldiğini
 * göremiyordu. Bu test, kırılan halkayı doğrudan işaret eder.
 *
 * Not: `/api/list-templates` dosya adındaki "_" karakterini bozluğu için
 * fixture adında alt çizgi yok.
 */

const TEMPLATE_DIR = join(process.cwd(), 'public', 'templates');
const FIXTURE_FILE = 'e2e-write-path.xslt';
const FIXTURE_LABEL = 'e2e-write-path';

const FIXTURE_XSLT = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head><meta charset="UTF-8"/><title>Write Path</title>
        <style>body { background: #fff; font-family: sans-serif; }</style>
      </head>
      <body>
        <h1 id="probe-title" style="font-size: 16px; color: #111111;">PROBE HEADING</h1>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;

const preview = (page: Page): FrameLocator =>
  page.frameLocator('iframe[title="Fatura Canlı Önizleme"]');

test.beforeAll(async () => {
  await writeFile(join(TEMPLATE_DIR, FIXTURE_FILE), FIXTURE_XSLT, 'utf-8');
});

test.afterAll(async () => {
  await unlink(join(TEMPLATE_DIR, FIXTURE_FILE)).catch(() => undefined);
});

async function loadProbe(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: `${FIXTURE_LABEL} Yükle` }).click();
  await expect(preview(page).locator('#probe-title')).toBeVisible();
}

/**
 * Tasarımcı sekmesini açar ve listeden h1'i seçer.
 *
 * ÖNEMLİ: eleman listesi, tasarımcı sekmesi açıldıktan ~350ms sonra (dönüşüm
 * asenkron olduğu için) yeniden oluşturulur. Tıklama, liste oturana kadar
 * bekletilmezse React'in listeyi yeniden oluşturması tıklamayı düşürüyor.
 */
async function selectHeadingFromList(page: Page) {
  await page.getByRole('button', { name: /Görsel Tasarımcı/ }).click();
  const pickerBtn = page.locator('button', { hasText: 'h1 · PROBE HEADING' }).first();
  await expect(pickerBtn).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(600);
  await pickerBtn.click();
  await expect(page.getByText('Düzenlenen Selector: #probe-title')).toBeVisible({ timeout: 10000 });
}

test.describe('Tasarımcı yazma yolu (seçim → stil → XSLT → önizleme)', () => {
  test('eleman listesinden seçim yapılabiliyor ve panel doluyor', async ({ page }) => {
    await loadProbe(page);
    await selectHeadingFromList(page);

    await expect(page.getByText(/H1#probe-title/)).toBeVisible();
  });

  test('renk değişikliği XSLT\'e yazılıyor ve önizlemeye yansıyor', async ({ page }) => {
    await loadProbe(page);
    await selectHeadingFromList(page);

    // Stil panelindeki renk seçici
    await page.locator('input.w-7').fill('#b45309');

    // Önizleme yeniden dönüştürülür; renk değişmiş olmalı.
    await expect
      .poll(async () => preview(page).locator('#probe-title').evaluate(
        (el) => getComputedStyle(el).color,
      ), { timeout: 15000 })
      .toBe('rgb(180, 83, 9)');
  });

  test('yazı boyutu değişikliği önizlemeye yansıyor', async ({ page }) => {
    await loadProbe(page);
    await selectHeadingFromList(page);

    await page
      .locator('xpath=//span[text()="Yazı Boyutu:"]/following::input[@type="range"][1]')
      .fill('24');

    await expect
      .poll(async () => preview(page).locator('#probe-title').evaluate(
        (el) => getComputedStyle(el).fontSize,
      ), { timeout: 15000 })
      .toBe('24px');
  });

  test('hizalama değişikliği önizlemeye yansıyor', async ({ page }) => {
    await loadProbe(page);
    await selectHeadingFromList(page);

    await page.getByRole('button', { name: 'SAĞ' }).click();

    await expect
      .poll(async () => preview(page).locator('#probe-title').evaluate(
        (el) => getComputedStyle(el).textAlign,
      ), { timeout: 15000 })
      .toBe('right');
  });

  test('iframe içine tıklayarak seçim de aynı zinciri tetikliyor', async ({ page }) => {
    await loadProbe(page);
    await page.getByRole('button', { name: /Görsel Tasarımcı/ }).click();

    await preview(page).locator('#probe-title').click();
    await expect(page.getByText(/H1#probe-title/)).toBeVisible();

    await page.locator('input.w-7').fill('#059669');

    await expect
      .poll(async () => preview(page).locator('#probe-title').evaluate(
        (el) => getComputedStyle(el).color,
      ), { timeout: 15000 })
      .toBe('rgb(5, 150, 105)');
  });
});
