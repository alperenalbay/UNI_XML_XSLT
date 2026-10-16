import { test, expect, type Page, type FrameLocator } from '@playwright/test';
import { writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Tasarımcı (WYSIWYG) paneli önizleme iframe'inin İÇİNE tıklanarak çalışır.
 * Bu akış konsoldan veya ekran görüntüsünden doğrulanamaz; bu yüzden
 * gerçek tarayıcıda, iframe içine de tıklayabilen Playwright ile test ediliyor.
 *
 * Kapsanan regresyonlar:
 *  - Sandbox + srcDoc aynı commit'te değişince önizleme script'leri bloklanıyordu
 *    (barkod/QR görünmüyor, tasarımcı paneli boş kalıyordu).
 *  - Trusted/kapalı modu şablon script'lerini kaldırıyor ama tasarım
 *    etkileşimini (sütun boyutlandırma, seçim) bozmuyor.
 */

const TEMPLATE_DIR = join(process.cwd(), 'public', 'templates');
// Not: /api/list-templates dosya adındaki "_" karakterini boşluğa çeviriyor
// (`__e2e-probe` -> "  e2e-probe"), bu yüzden fixture adında alt çizgi yok.
const FIXTURE_FILE = 'e2e-probe.xslt';
const FIXTURE_LABEL = 'e2e-probe';
const RECEIPT_FILE = 'e2e-receipt.xslt';
const RECEIPT_LABEL = 'e2e-receipt';

/**
 * Fiş şablonu: `@page { size: 80mm auto }` beyanı. Önizleme artık şablonun
 * beyan ettiği genişliği kullanmalı; eskiden her şey A4'e zorlanıyordu.
 */
const RECEIPT_XSLT = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head><meta charset="UTF-8"/><title>Receipt</title>
        <style>
          body { font-family: 'Courier New', monospace; background: #fff; margin: 0; padding: 8px; }
          @page { size: 80mm auto; margin: 0; }
        </style>
      </head>
      <body><div id="receipt-body">FIŞ</div></body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;

/**
 * Test şablonu: iki seçilebilir öğe + bir script.
 * Script, çalıştığını kanıtlayan bir işaret bırakır (barkod/QR gibi).
 */
const FIXTURE_XSLT = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head><meta charset="UTF-8"/><title>E2E Probe</title></head>
      <body>
        <h1 id="probe-title" class="probe-heading" data-xslt-id="probe-title-id">PROBE HEADING</h1>
        <p id="probe-para" data-xslt-id="probe-para-id">PROBE PARAGRAPH</p>
        <script type="text/javascript">
          (function () {
            function run() {
              var m = document.createElement('div');
              m.id = 'script-ran-marker';
              m.textContent = 'SCRIPT_EXECUTED_OK';
              document.body.appendChild(m);
            }
            if (document.readyState === 'complete') { run(); }
            else { window.addEventListener('load', run); }
          })();
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;

const preview = (page: Page): FrameLocator =>
  page.frameLocator('iframe[title="Fatura Canlı Önizleme"]');

test.beforeAll(async () => {
  await writeFile(join(TEMPLATE_DIR, FIXTURE_FILE), FIXTURE_XSLT, 'utf-8');
  await writeFile(join(TEMPLATE_DIR, RECEIPT_FILE), RECEIPT_XSLT, 'utf-8');
});

test.afterAll(async () => {
  await unlink(join(TEMPLATE_DIR, FIXTURE_FILE)).catch(() => undefined);
  await unlink(join(TEMPLATE_DIR, RECEIPT_FILE)).catch(() => undefined);
});

/** Uygulamayı açar, test şablonunu yükler ve önizlemenin hazır olmasını bekler. */
async function loadProbe(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: `${FIXTURE_LABEL} Yükle` }).click();
  await expect(preview(page).locator('#probe-title')).toBeVisible();
}

/** 80mm fiş şablonunu yükler. */
async function loadReceipt(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: `${RECEIPT_LABEL} Yükle` }).click();
  await expect(preview(page).locator('#receipt-body')).toBeVisible();
}

test.describe('Önizleme script politikası', () => {
  test('varsayılan olarak şablon scriptlerini çalıştırır (barkod/QR görünür)', async ({ page }) => {
    await loadProbe(page);

    // Regresyon: sandbox'ta allow-scripts yokken bu işaret hiç oluşmuyordu.
    await expect(preview(page).locator('#script-ran-marker')).toHaveText('SCRIPT_EXECUTED_OK');
  });

  test('konsola bloklanan script hatası düşmez', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await loadProbe(page);
    await expect(preview(page).locator('#script-ran-marker')).toBeVisible();

    expect(errors.filter((e) => e.includes('Blocked script execution'))).toHaveLength(0);
  });
});

test.describe('Görsel Tasarımcı seçim akışı', () => {
  test('tasarımcı sekmesine geçince iframe içindeki tıklama hemen çalışır', async ({ page }) => {
    await loadProbe(page);
    await page.getByRole('button', { name: /Görsel Tasarımcı/ }).click();

    // Regresyon: sandbox/srcDoc yarışı yüzünden iframe eski bayraklarla
    // yükleniyor ve tıklama dinleyicisi hiç bağlanmıyordu. Ek bir yenileme
    // (ör. başka bir ayarı değiştirmek) gerekiyordu.
    await preview(page).locator('#probe-title').click();

    await expect(page.getByText('Seçilen CSS Sınıfı:')).toBeVisible();
    await expect(page.getByText(/H1#probe-title/)).toBeVisible();
  });

  test('iframe içinde farklı bir öğeye tıklamak seçimi günceller', async ({ page }) => {
    await loadProbe(page);
    await page.getByRole('button', { name: /Görsel Tasarımcı/ }).click();

    await preview(page).locator('#probe-title').click();
    await expect(page.getByText(/H1#probe-title/)).toBeVisible();

    await preview(page).locator('#probe-para').click();
    await expect(page.getByText(/P#probe-para/)).toBeVisible();
  });

  test('scriptler kapalıyken tasarım seçimi yine çalışır', async ({ page }) => {
    await loadProbe(page);
    await page.getByRole('button', { name: /Script'ler/ }).click();

    // Şablon scriptleri kaldırıldı ve kullanıcıya sebep bildirildi.
    await expect(preview(page).locator('#script-ran-marker')).toHaveCount(0);
    await expect(preview(page).locator('#uni-script-disabled-notice')).toBeVisible();

    // ...ama uygulamanın kendi etkileşimi etkilenmiyor.
    await page.getByRole('button', { name: /Görsel Tasarımcı/ }).click();
    await preview(page).locator('#probe-title').click();
    await expect(page.getByText(/H1#probe-title/)).toBeVisible();
  });
});

test.describe('Sayfa boyutu algılama', () => {
  /**
   * Önizleme gövdesine uyguladığımız GERÇEK sayfa genişliği.
   * getBoundingClientRect() transform + padding yüzünden ölçekli/padding'li
   * değer döndürür; bizim kontrol ettiğimiz değer inline stildir.
   */
  async function sheetWidth(page: Page): Promise<string> {
    const frame = page.frames().find((f) => f !== page.mainFrame());
    expect(frame, 'önizleme iframe bulunamadı').toBeTruthy();
    return frame!.evaluate(() => document.body.style.width);
  }

  async function zoomPercent(page: Page): Promise<number> {
    const zoom = await page.locator('input.w-24').first().inputValue();
    return Number(zoom);
  }

  test('A4 varsayılan kalır', async ({ page }) => {
    await loadProbe(page);
    await expect(page.getByText(/Önizleme A4 baskı/)).toBeVisible();
    expect(await sheetWidth(page)).toBe('210mm');
  });

  test('80mm fiş şablonu A4 yerine kendi genişliğinde gösterilir', async ({ page }) => {
    await loadReceipt(page);

    await expect(page.getByText(/Önizleme 80mm baskı/)).toBeVisible();
    // Eskiden her şey 210mm'e zorlanıyordu; fiş ekranda küçük bir
    // dikdörtgen olarak kalıyordu.
    expect(await sheetWidth(page)).toBe('80mm');
  });

  test('dar şablon "Genişliğe Sığdır" ile büyütülür', async ({ page }) => {
    await loadProbe(page);
    const a4Zoom = await zoomPercent(page);

    await loadReceipt(page);
    const receiptZoom = await zoomPercent(page);

    // Ölçek artık 794px'e göre değil gerçek sayfa genişliğine göre hesaplanıyor:
    // dar fiş, aynı panelde A4'ten daha büyük görünmeli (elle büyütmeye gerek kalmaz).
    expect(receiptZoom).toBeGreaterThan(a4Zoom);
    expect(a4Zoom).toBeLessThanOrEqual(100);
  });
});
