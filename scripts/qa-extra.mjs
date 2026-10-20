// Hızlı buton QA — kanıtlanmış seçicilerle, 5s timeout, izole adımlar.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';
const SCREENS = '.openchamber/screenshots';
mkdirSync(SCREENS, { recursive: true });

const results = [];
const consoleErrors = [];
async function step(name, fn) {
  try { await fn(); results.push({ ok: true, name }); console.log('[PASS]', name); }
  catch (e) { results.push({ ok: false, name, d: (e.message||'').slice(0,90) }); console.log('[FAIL]', name, '->', (e.message||'').slice(0,90)); }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(5000);
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /gib/ }).click();
  await page.waitForSelector('text=Sistem Hazır', { timeout: 10000 });
  await page.getByRole('button', { name: /Görsel Tasarımcı/ }).click();
  await page.waitForTimeout(400);

  // seç bir element ki stil paneli dolu olsun
  await page.locator('button', { hasText: 'h1 · e-Fatura' }).first().click();
  await page.waitForTimeout(250);

  await step('script toggle AÇIK->KAPALI->AÇIK', async () => {
    const btn = page.getByRole('button', { name: /Script'ler:/ });
    const before = await btn.textContent();
    await btn.click(); await page.waitForTimeout(200);
    const after = await btn.textContent();
    if (before === after) throw new Error('değişmedi');
    await btn.click(); await page.waitForTimeout(150);
  });
  await step('zoom genişliğe sığdır', async () => {
    await page.getByRole('button', { name: 'Genişliğe Sığdır' }).click();
    await page.waitForTimeout(150);
  });
  await step('tablo izgarası toggle', async () => {
    const cb = page.locator('input.text-indigo-600');
    await cb.click(); await page.waitForTimeout(150);
    await cb.click();
  });
  await step('metni düzenle butonu', async () => {
    await page.getByRole('button', { name: 'Metni Düzenle' }).first().click();
    await page.waitForTimeout(200);
    await page.keyboard.press('Escape');
  });
  await step('içine ekle butonu', async () => {
    await page.getByRole('button', { name: 'İçine Ekle' }).first().click();
    await page.waitForTimeout(150);
  });
  await step('seçimi sıfırla', async () => {
    await page.getByRole('button', { name: 'Seçimi Sıfırla' }).click();
    await page.waitForTimeout(150);
  });
  await step('HTML Çıktısı sekmesi', async () => {
    await page.getByRole('button', { name: 'HTML Çıktısı' }).click();
    await page.waitForTimeout(200);
  });
  await step('görsel düzenleyici sekmesi + yeni görsel ekle', async () => {
    await page.getByRole('button', { name: 'Görsel Düzenleyici' }).click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Yeni Görsel Ekle' }).click();
    await page.waitForTimeout(150);
  });
  await step('Koda Git butonu', async () => {
    const btn = page.locator('button', { hasText: 'Koda Git' }).first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await page.waitForTimeout(300);
  });

  await page.screenshot({ path: path.join(SCREENS, 'qa-extra.png'), fullPage: false });
  await browser.close();

  const passed = results.filter(r => r.ok).length;
  console.log('\n========== QA-EXTRA ==========');
  console.log(`Toplam: ${results.length} | PASS: ${passed} | FAIL: ${results.length - passed}`);
  results.filter(r => !r.ok).forEach(r => console.log('  -', r.name, '->', r.d));
  console.log('Console error:', consoleErrors.length);
  if (consoleErrors.length) [...new Set(consoleErrors)].slice(0,5).forEach(e => console.log('  !', e.slice(0,160)));
  console.log('==============================');
  process.exit(results.some(r => !r.ok) ? 1 : 0);
}

main().catch(e => { console.error('HATA:', e.message); process.exit(1); });
