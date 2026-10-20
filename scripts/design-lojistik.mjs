// Otomatik sektör tasarımı — "bot" yaklaşımı.
// Tek komut, saniyeler içinde, tekrarlanabilir:  npm run design:lojistik
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const WM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="140" viewBox="0 0 420 140">
  <text x="210" y="95" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="bold" fill="#ea580c" text-anchor="middle" transform="rotate(-15 210 70)" opacity="0.85">İRSALİYE</text>
</svg>`;

const BASE = 'http://localhost:5173';
const SCREENS = '.openchamber/screenshots';
mkdirSync(SCREENS, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ensureServer() {
  try {
    const r = await fetch('http://localhost:5173/api/list-templates');
    if (r.ok) return;
  } catch {}
  console.log('dev sunucusu kapali, baslatiliyor...');
  const child = spawn('npm', ['run', 'dev'], { stdio: 'ignore', shell: true, detached: false });
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const r = await fetch('http://localhost:5173/api/list-templates');
      if (r.ok) { console.log('dev sunucusu ayakta'); return; }
    } catch {}
  }
  throw new Error('dev sunucusu baslatilamadi');
}

async function main() {
  const wmSvgPath = path.join(tmpdir(), 'watermark-odendi.svg');
  writeFileSync(wmSvgPath, WM_SVG, 'utf8');

  await ensureServer();
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('dialog', async (d) => { await d.accept('lojistik') });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  console.log('[1] anasayfa yuklendi');

  await page.getByRole('button', { name: /gib/ }).click();
  await page.waitForTimeout(5000);
  console.log('[2] gib sablonu yuklendi');

  await page.getByRole('button', { name: /Görsel Tasarımcı/ }).click();
  await page.waitForTimeout(400);
  console.log('[3] gorsel tasarimci acildi');

  async function selectElement(labelSubstr) {
    const btn = page.locator('button', { hasText: labelSubstr }).first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForTimeout(250);
  }
  async function setFontSize(px) {
    const slider = page.locator('xpath=//span[text()="Yazı Boyutu:"]/following::input[@type="range"][1]');
    await slider.fill(String(px));
  }
  async function setColor(hex) {
    await page.locator('input.w-7').fill(hex);
  }
  async function setBold() {
    const b = page.getByRole('button', { name: 'B (Kalın)' });
    const cls = await b.getAttribute('class');
    if (!cls || !cls.includes('bg-indigo-600')) await b.click();
  }
  async function shot(name) {
    await page.screenshot({ path: path.join(SCREENS, `${name}.png`), fullPage: false });
    console.log(`    screenshot: ${name}.png`);
  }

  // H1: e-Fatura başlığı -> kehribar, 22px, kalın
  await selectElement('h1 · e-Fatura');
  await setFontSize(22);
  await setBold();
  await setColor('#ea580c');
  await shot('lojistik-01-h1');
  console.log('[4] h1 stili uygulandi');

  // şirket unvanı -> koyu kehribar, 18px
  await selectElement('span · DEVATEK BİLİŞİM');
  await setFontSize(18);
  await setColor('#c2410c');
  await shot('lojistik-02-sirket');
  console.log('[5] sirket unvani stili uygulandi');

  // filigran: görsel yükle + XSLT'ye kaydet
  const wmFile = page.locator('label', { hasText: 'Görsel Yükle' }).locator('input[type="file"]');
  await wmFile.setInputFiles(wmSvgPath);
  await page.waitForTimeout(500);
  await page.locator('input.font-mono').fill('#ea580c');
  const rot = page.locator('xpath=//label[contains(text(),"Döndürme")]/following::input[@type="range"][1]');
  await rot.fill('-15');
  const sz = page.locator('xpath=//label[contains(text(),"Boyut")]/following::input[@type="range"][1]');
  await sz.fill('60');
  const op = page.locator('xpath=//label[contains(text(),"Opaklık")]/following::input[@type="range"][1]');
  await op.fill('15');
  const saveWm = page.getByRole('button', { name: /XSLT.*Kaydet/ });
  await saveWm.waitFor({ state: 'visible', timeout: 5000 });
  await saveWm.click();
  await page.waitForTimeout(800);
  console.log('[6] filigran XSLT ye kaydedildi');
  await shot('lojistik-03-watermark');

  // sablon olarak kaydet
  await page.getByRole('button', { name: 'Şablon Olarak Kaydet' }).click();
  await page.waitForTimeout(2000);
  await shot('lojistik-04-kaydedildi');
  console.log('[7] sablon kaydet denemesi tamamlandi');

  const res = await page.request.get(`${BASE}/api/list-templates`);
  const list = await res.json();
  const saved = list.find((t) => t.name === 'lojistik');
  if (!saved) throw new Error('lojistik sablonu kaydedilemedi. mevcut: ' + list.map((t) => t.name).join(', '));
  console.log(`[8] dogrulama OK: ${list.length} sablon, "lojistik" mevcut (${saved.size} bayt)`);

  await browser.close();
  console.log('BITTI');
}

main().catch((e) => {
  console.error('HATA:', e.message);
  process.exit(1);
});
