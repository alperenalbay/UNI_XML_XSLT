// QA: uygulamanın tüm buton/özelliklerini otomatik olarak dener.
// Her adımı izole eder; console hatalarını toplar; özet raporlar.
// Çalıştırma: node scripts/qa-buttons.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';
const SCREENS = '.openchamber/screenshots';
mkdirSync(SCREENS, { recursive: true });

const results = [];
const consoleErrors = [];
const consoleWarnings = [];

function log(ok, name, detail = '') {
  const tag = ok ? 'PASS' : 'FAIL';
  results.push({ ok, name, detail });
  console.log(`[${tag}] ${name}${detail ? '  -> ' + detail : ''}`);
}

async function step(name, fn, timeout = 8000) {
  try {
    await Promise.race([
      fn(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT ' + timeout + 'ms')), timeout)),
    ]);
    log(true, name);
  } catch (e) {
    log(false, name, (e && e.message ? e.message : String(e)).slice(0, 100));
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.setDefaultTimeout(8000);
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
    if (m.type() === 'warning' && /key/i.test(m.text())) consoleWarnings.push(m.text());
  });
  page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message));

  await page.goto(BASE, { waitUntil: 'networkidle' });

  // ---------- 1. Anasayfa ----------
  await step('anasayfa acildi', async () => {
    await page.waitForSelector('text=Şablon Kütüphanesi', { timeout: 8000 });
  });
  for (const name of ['gib', 'koyu-tema', 'mini-fis', 'modern-mavi', 'sdandart-iskontolu', 'standart']) {
    await step(`sablon karti: ${name}`, async () => {
      await page.locator('button', { hasText: new RegExp('^' + name + '\\s+Yükle$') }).waitFor({ state: 'visible', timeout: 5000 });
    });
  }

  // ---------- 2. gib yükle ----------
  await step('gib yukle', async () => {
    await page.getByRole('button', { name: /gib/ }).click();
    await page.waitForSelector('text=Sistem Hazır', { timeout: 10000 });
  });

  // ---------- 3. Sekmeler ----------
  for (const tab of ['Önizleme', 'HTML Çıktısı', 'Sistem Raporu']) {
    await step(`sekme: ${tab}`, async () => {
      await page.getByRole('button', { name: tab }).click();
      await page.waitForTimeout(150);
    });
  }
  await step('Koda Git butonu', async () => {
    await page.locator('button', { hasText: 'Koda Git' }).click();
    await page.waitForTimeout(150);
  });

  // ---------- 4. Görsel tasarımcı ----------
  await step('gorsel tasarimci ac', async () => {
    await page.getByRole('button', { name: /Görsel Tasarımcı/ }).click();
    await page.waitForTimeout(400);
  });

  // ---------- 5. Eleman seçimi ----------
  await step('eleman picker listesi (150+ eleman)', async () => {
    const btn = page.locator('button', { hasText: 'h1 · e-Fatura' }).first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
  });
  await step('h1 secimi -> panel doldu', async () => {
    await page.locator('button', { hasText: 'h1 · e-Fatura' }).first().click();
    await page.waitForSelector('text=Düzenlenen Selector: h1', { timeout: 5000 });
  });

  // ---------- 6. Stil kontrolleri ----------
  await step('yazi boyutu slider', async () => {
    const s = page.locator('xpath=//span[text()="Yazı Boyutu:"]/following::input[@type="range"][1]');
    await s.fill('20');
  });
  await step('kalin (B)', async () => {
    await page.getByRole('button', { name: 'B (Kalın)' }).click();
  });
  await step('renk (color picker)', async () => {
    await page.locator('input.w-7').fill('#123456');
  });
  await step('hizalama ORT', async () => {
    await page.getByRole('button', { name: 'ORT' }).click();
  });
  await step('genislik 30%', async () => {
    await page.getByRole('button', { name: '30%' }).click();
  });
  await step('metin akisi', async () => {
    await page.getByRole('button', { name: /Normal \(Kayabilir\)|Tek Satırda Tut/ }).click();
  });
  await step('icinde ekle', async () => {
    await page.getByRole('button', { name: 'İçine Ekle' }).click();
    await page.waitForTimeout(150);
  });
  await step('metni duzenle butonu', async () => {
    await page.getByRole('button', { name: 'Metni Düzenle' }).click();
    await page.waitForTimeout(200);
    await page.keyboard.press('Escape');
  });
  await step('secimi sifirla', async () => {
    await page.getByRole('button', { name: 'Seçimi Sıfırla' }).click();
    await page.waitForTimeout(150);
  });

  // ---------- 7. Tablo izgarasi ----------
  await step('tablo izgarasi toggle', async () => {
    await page.locator('input.text-indigo-600').click();
    await page.waitForTimeout(150);
    await page.locator('input.text-indigo-600').click();
  });

  // ---------- 8. Filigran paneli ----------
  await step('filigran metin', async () => {
    const t = page.locator('xpath=//label[text()="Metin Etiketi"]/following::input[1]');
    await t.fill('TEST');
  });
  await step('filigran renk', async () => {
    await page.locator('input.font-mono').fill('#ff0000');
  });
  await step('filigran dondurme', async () => {
    const r = page.locator('xpath=//label[contains(text(),"Döndürme")]/following::input[@type="range"][1]');
    await r.fill('30');
  });
  await step('filigran boyut', async () => {
    const s = page.locator('xpath=//label[contains(text(),"Boyut")]/following::input[@type="range"][1]');
    await s.fill('40');
  });
  await step('filigran opaklik', async () => {
    const o = page.locator('xpath=//label[contains(text(),"Opaklık")]/following::input[@type="range"][1]');
    await o.fill('25');
  });

  // ---------- 9. Script toggle ----------
  await step('script toggle', async () => {
    const btn = page.getByRole('button', { name: /Script'ler:/ });
    const before = await btn.textContent();
    await btn.click();
    await page.waitForTimeout(200);
    const after = await btn.textContent();
    if (before === after) throw new Error('degismedi');
    await btn.click();
    await page.waitForTimeout(150);
  });

  // ---------- 10. Zoom ----------
  await step('zoom genislige sigdir', async () => {
    await page.getByRole('button', { name: 'Genişliğe Sığdır' }).click();
    await page.waitForTimeout(150);
  });

  // ---------- 11. Gorsel duzenleyici ----------
  await step('gorsel duzenleyici sekmesi', async () => {
    await page.getByRole('button', { name: 'Görsel Düzenleyici' }).click();
    await page.waitForTimeout(300);
    await page.waitForSelector('text=Görsel Düzenleyici (Sürükle-Bırak)');
  });
  await step('yeni gorsel ekle butonu', async () => {
    await page.getByRole('button', { name: 'Yeni Görsel Ekle' }).click();
    await page.waitForTimeout(150);
  });

  // ---------- 12. HTML cikti sekmesi ----------
  await step('HTML çıktısı sekmesi', async () => {
    await page.getByRole('button', { name: 'HTML Çıktısı' }).click();
    await page.waitForTimeout(200);
  });

  // ---------- 13. Sablon olarak kaydet ----------
  await step('sablon olarak kaydet', async () => {
    page.once('dialog', async (d) => { await d.accept('qa-test-template') });
    await page.getByRole('button', { name: 'Şablon Olarak Kaydet' }).click();
    await page.waitForTimeout(1500);
    const res = await page.request.get(`${BASE}/api/list-templates`);
    const list = await res.json();
    if (!list.some((t) => t.name === 'qa-test-template')) throw new Error('kaydedilemedi');
  });

  await page.screenshot({ path: path.join(SCREENS, 'qa-final.png'), fullPage: false });
  await browser.close();

  console.log('\n========== QA RAPORU ==========');
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);
  console.log(`Toplam: ${results.length}  |  PASS: ${passed}  |  FAIL: ${failed.length}`);
  if (failed.length) {
    console.log('\nBAŞARISIZ:');
    failed.forEach((r) => console.log(`  - ${r.name}: ${r.detail}`));
  }
  console.log('Console error:', consoleErrors.length, '| key-uyarı:', consoleWarnings.length);
  if (consoleErrors.length) {
    [...new Set(consoleErrors)].slice(0, 8).forEach((e) => console.log('  ! ' + e.slice(0, 160)));
  }
  console.log('================================');
  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error('HATA:', e.message);
  process.exit(1);
});
