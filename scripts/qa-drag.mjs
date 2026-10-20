// Sürükle-bırak, kaydırma, ekleme fonksiyonları QA'sı.
import { chromium } from 'playwright';
import { setupQaFixture, FIXTURE_LABEL } from './qa-fixture.mjs';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';
const SCREENS = '.openchamber/screenshots';
mkdirSync(SCREENS, { recursive: true });

const results = [];
function log(ok, name, detail = '') {
  results.push({ ok, name, detail });
  console.log(`[${ok ? 'PASS' : 'FAIL'}] ${name}${detail ? '  -> ' + detail : ''}`);
}
async function step(name, fn) {
  try { await fn(); log(true, name); }
  catch (e) { log(false, name, (e.message || '').slice(0, 120)); }
}

async function main() {
  const cleanupFixture = await setupQaFixture();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: new RegExp('^' + FIXTURE_LABEL) }).click();
  await page.waitForSelector('text=Sistem Hazır', { timeout: 15000 });

  const frame = page.frameLocator('iframe[title="Fatura Canlı Önizleme"]');

  // ---------- Görsel Düzenleyici sekmesi ----------
  await page.getByRole('button', { name: 'Görsel Düzenleyici' }).click();
  await page.waitForTimeout(500);

  // ---------- Sürükle-bırak: logo 80px sağa, 60px aşağı ----------
  await step('logo surukle-birak (80,60)', async () => {
    const img = frame.locator('img').first();
    await img.waitFor({ state: 'visible', timeout: 5000 });
    const box = await img.boundingBox();
    if (!box) throw new Error('img boundingBox yok');
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 80, cy + 60, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(300);
    // pending sayacı artmalı
    const btn = page.getByRole('button', { name: /Değişiklikleri Kaydet/ });
    const label = await btn.textContent();
    if (!/Kaydet \([1-9]/.test(label || '')) throw new Error('pending artmadi: ' + label);
  });

  // ---------- Sıfırla ----------
  await step('Sıfırla butonu', async () => {
    await page.getByRole('button', { name: 'Sıfırla' }).click();
    await page.waitForTimeout(300);
    const btn = page.getByRole('button', { name: /Değişiklikleri Kaydet/ });
    const label = await btn.textContent();
    // reset sonrası pending 0 olmalı
    if (!/Kaydet \(0\)/.test(label || '')) throw new Error('reset calismadi: ' + label);
  });

  // ---------- Değişiklikleri Kaydet ----------
  await step('drag kaydet (XSLT ye yaz)', async () => {
    // tekrar sürükle
    const img = frame.locator('img').first();
    const box = await img.boundingBox();
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 40, cy + 30, { steps: 6 });
    await page.mouse.up();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /Değişiklikleri Kaydet/ }).click();
    await page.waitForTimeout(500);
  });

  // ---------- scroll test (önizleme) ----------
  await step('onizleme scroll', async () => {
    const iframeEl = page.locator('iframe[title="Fatura Canlı Önizleme"]');
    const box = await iframeEl.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(200);
    await page.mouse.wheel(0, -300);
  });

  // ---------- WYSIWYG: İçine Ekle (metin kutusu ekle) ----------
  await page.getByRole('button', { name: /Görsel Tasarımcı/ }).click();
  await page.waitForTimeout(400);
  await step('WYSIWYG element sec (h1)', async () => {
    await page.locator('button', { hasText: 'h1 · QA BAŞLIK' }).first().click();
    await page.waitForTimeout(250);
    await page.waitForSelector('text=Düzenlenen Selector: #qa-title', { timeout: 5000 });
  });
  await step('Icine Ekle (metin kutusu)', async () => {
    await page.getByRole('button', { name: 'İçine Ekle' }).first().click();
    await page.waitForTimeout(300);
  });

  // ---------- Bu Elemanı Sil ----------
  await step('Bu Elemani Sil', async () => {
    // re-select h1 first
    await page.locator('button', { hasText: 'h1 · QA BAŞLIK' }).first().click();
    await page.waitForTimeout(250);
    await page.getByRole('button', { name: 'Bu Elemanı Sil' }).first().click();
    await page.waitForTimeout(300);
  });

  await page.screenshot({ path: path.join(SCREENS, 'qa-drag-final.png'), fullPage: false });
  await browser.close();
  await cleanupFixture();

  const passed = results.filter(r => r.ok).length;
  console.log('\n========== QA-DRAG ==========');
  console.log(`Toplam: ${results.length} | PASS: ${passed} | FAIL: ${results.length - passed}`);
  results.filter(r => !r.ok).forEach(r => console.log('  -', r.name, '->', r.d));
  console.log('=============================');
  process.exit(results.some(r => !r.ok) ? 1 : 0);
}

main().catch(e => { console.error('HATA:', e.message); process.exit(1); });
