// Buton/özellik QA'sı — uygulamadaki tüm ana kontrolleri dener.
// Çıktı: PASS/FAIL özeti, konsol hataları dahil. CI'da çalıştırılabilir.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = 'http://localhost:5173';
const SCREENS = '.openchamber/screenshots';
mkdirSync(SCREENS, { recursive: true });

const results = [];
const consoleErrors = [];

function log(ok, name, detail = '') {
  results.push({ ok, name, detail });
  console.log(`[${ok ? 'PASS' : 'FAIL'}] ${name}${detail ? '  -> ' + detail : ''}`);
}

async function step(name, fn, timeout = 10000) {
  try {
    await Promise.race([
      fn(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), timeout)),
    ]);
    log(true, name);
  } catch (e) {
    log(false, name, (e && e.message ? e.message : String(e)).slice(0, 100));
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(8000);
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message));

  await page.goto(BASE, { waitUntil: 'networkidle' });

  // ---------- Anasayfa ----------
  await step('anasayfa yuklendi', async () => {
    await page.getByRole('button', { name: /Şablonum Yok/ }).first().waitFor({ state: 'visible' });
  });
  for (const name of ['gib', 'koyu-tema', 'mini-fis', 'modern-mavi', 'sdandart-iskontolu', 'standart']) {
    await step(`sablon karti: ${name}`, async () => {
      await page.locator('button', { hasText: 'Yükle' })
        .filter({ hasText: name })
        .first()
        .waitFor({ state: 'visible', timeout: 5000 });
    });
  }

  // ---------- Sablon yukle ----------
  await step('gib sablonu yuklendi', async () => {
    await page.getByRole('button', { name: /gib/ }).click();
    await page.waitForFunction(() => document.body.innerText.includes('Sistem Hazır'), { timeout: 15000 });
  });

  // ---------- Sekmeler ----------
  for (const tab of ['Önizleme', 'HTML Çıktısı', 'Sistem Raporu']) {
    await step(`sekme: ${tab}`, async () => {
      await page.getByRole('button', { name: tab }).click();
      await page.waitForTimeout(150);
    });
  }
  // Önizleme sekmesine geri dön: önizleme panelinin kontrolleri (Koda Git,
  // Script'ler, zoom) yalnızca bu sekmede görünür.
  await step('onizleme sekmesine donuldu', async () => {
    await page.getByRole('button', { name: 'Önizleme' }).click();
    await page.waitForTimeout(300);
  });
  await step('Koda Git butonu', async () => {
    const btn = page.locator('button', { hasText: 'Koda Git' }).first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await page.waitForTimeout(150);
  });

  // ---------- Gorsel tasarimci ----------
  await step('gorsel tasarimci acildi', async () => {
    await page.getByRole('button', { name: /Görsel Tasarımcı/ }).click();
    await page.waitForTimeout(400);
  });

  // ---------- Eleman secimi ----------
  await step('eleman listesi doldu', async () => {
    const btn = page.locator('button', { hasText: 'h1 · ' }).first();
    await btn.waitFor({ state: 'visible', timeout: 8000 });
  });
  await step('eleman secimi paneli doldurdu', async () => {
    const btn = page.locator('button', { hasText: 'h1 · ' }).first();
    await page.waitForTimeout(600);
    await btn.click();
    await page.waitForSelector('text=Düzenlenen Selector:', { timeout: 5000 });
  });

  // ---------- Stil kontrolleri ----------
  await step('yazi boyutu slider', async () => {
    await page.locator('xpath=//span[text()="Yazı Boyutu:"]/following::input[@type="range"][1]').fill('20');
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
    await page.getByRole('button', { name: 'İçine Ekle' }).first().click();
    await page.waitForTimeout(150);
  });
  await step('metni duzenle', async () => {
    await page.getByRole('button', { name: 'Metni Düzenle' }).first().click();
    await page.waitForTimeout(200);
    await page.keyboard.press('Escape');
  });
  await step('secimi sifirla', async () => {
    await page.getByRole('button', { name: 'Seçimi Sıfırla' }).click();
    await page.waitForTimeout(150);
  });

  // ---------- Tablo izgarasi ----------
  await step('tablo izgarasi toggle', async () => {
    const cb = page.locator('input.text-indigo-600');
    await cb.click();
    await page.waitForTimeout(150);
    await cb.click();
  });

  // ---------- Filigran ----------
  await step('filigran metin', async () => {
    await page.locator('xpath=//label[text()="Metin Etiketi"]/following::input[1]').fill('TEST');
  });
  await step('filigran renk', async () => {
    await page.locator('input.font-mono').fill('#ff0000');
  });
  await step('filigran dondurme', async () => {
    await page.locator('xpath=//label[contains(text(),"Döndürme")]/following::input[@type="range"][1]').fill('30');
  });
  await step('filigran boyut', async () => {
    await page.locator('xpath=//label[contains(text(),"Boyut")]/following::input[@type="range"][1]').fill('40');
  });
  await step('filigran opaklik', async () => {
    await page.locator('xpath=//label[contains(text(),"Opaklık")]/following::input[@type="range"][1]').fill('25');
  });

  // ---------- Script toggle / zoom ----------
  await step('script toggle', async () => {
    const btn = page.getByRole('button', { name: /Script'ler:/ });
    const before = await btn.textContent();
    await btn.click();
    await page.waitForTimeout(250);
    const after = await btn.textContent();
    if (before === after) throw new Error('degismedi');
    await btn.click();
    await page.waitForTimeout(150);
  });
  await step('zoom genislige sigdir', async () => {
    await page.getByRole('button', { name: 'Genişliğe Sığdır' }).click();
    await page.waitForTimeout(150);
  });

  // ---------- Gorsel duzenleyici ----------
  await step('gorsel duzenleyici sekmesi', async () => {
    await page.getByRole('button', { name: 'Görsel Düzenleyici' }).click();
    await page.waitForTimeout(300);
    await page.waitForSelector('text=Görsel Düzenleyici (Sürükle-Bırak)');
  });
  await step('yeni gorsel ekle', async () => {
    await page.getByRole('button', { name: 'Yeni Görsel Ekle' }).click();
    await page.waitForTimeout(150);
  });

  // ---------- HTML cikti ----------
  await step('HTML çıktısı sekmesi', async () => {
    await page.getByRole('button', { name: 'HTML Çıktısı' }).click();
    await page.waitForTimeout(200);
  });

  // ---------- Sablon kaydetme ----------
  await step('sablon olarak kaydet', async () => {
    page.once('dialog', async (d) => { await d.accept('qa-test-template') });
    await page.getByRole('button', { name: 'Şablon Olarak Kaydet' }).click();
    await page.waitForTimeout(1500);
    const res = await page.request.get(`${BASE}/api/list-templates`);
    const list = await res.json();
    if (!list.some((t) => t.name === 'qa-test-template')) throw new Error('kaydedilemedi');
  });

  await page.screenshot({ path: join(SCREENS, 'qa-buttons.png'), fullPage: false });
  await browser.close();

  // Test şablonunu temizle (public/templates KVKK klasörü — artık bırakılmamalı).
  await unlink(join('public', 'templates', 'qa-test-template.xslt')).catch(() => undefined);

  const passed = results.filter((r) => r.ok).length;
  console.log('\n========== QA-BUTTONS ==========');
  console.log(`Toplam: ${results.length} | PASS: ${passed} | FAIL: ${results.length - passed}`);
  results.filter((r) => !r.ok).forEach((r) => console.log(`  - ${r.name}: ${r.detail}`));
  console.log(`Console error: ${consoleErrors.length}`);
  if (consoleErrors.length) [...new Set(consoleErrors)].slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 160)));
  console.log('================================');
  process.exit(results.some((r) => !r.ok) ? 1 : 0);
}

main().catch((e) => { console.error('HATA:', e.message); process.exit(1); });
