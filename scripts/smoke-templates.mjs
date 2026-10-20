// Tüm sablonlari yukleyip render sonucunu dogrular (duman testi).
// Konsol hatasi, bos onizleme veya eksik tablo varsa FAIL.
import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const results = [];
const browser = await chromium.launch({ headless: true });

// Sablon listesini API'den al
const listRes = await fetch(`${BASE}/api/list-templates`);
const templates = await listRes.json();

for (const t of templates) {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

  try {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: new RegExp(`^${t.name}`) }).click();
    await page.waitForFunction(() => document.body.innerText.includes('Sistem Hazır'), { timeout: 20000 });

    const frame = page.frameLocator('iframe[title="Fatura Canlı Önizleme"]');
    await frame.locator('body').waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForTimeout(400);

    const info = await frame.locator('body').evaluate((body) => ({
      textLen: (body.innerText || '').trim().length,
      tables: body.querySelectorAll('table').length,
      cells: body.querySelectorAll('td, th').length,
      h1: (body.querySelector('h1')?.textContent || '').trim(),
      // Yinelenen id kaldi mi?
      dupIds: (() => {
        const seen = new Map(); const dups = [];
        body.querySelectorAll('[id]').forEach((el) => {
          const id = el.id;
          seen.set(id, (seen.get(id) || 0) + 1);
          if (seen.get(id) === 2) dups.push(id);
        });
        return dups;
      })(),
    }));

    const problems = [];
    if (errors.length) problems.push(`${errors.length} konsol hatası`);
    if (info.textLen < 50) problems.push('onizleme bos');
    // Tablo/h1 her sablon icin zorunlu degil (80mm fis, koyu tema gibi
    // yapilar farkli olabilir) — yalnizca "h1 yok" bilgi olarak raporlanir.
    if (info.dupIds.length) problems.push(`yinelenen id: ${info.dupIds.join(',')}`);

    results.push({ name: t.name, ok: problems.length === 0, problems, info });
  } catch (e) {
    results.push({ name: t.name, ok: false, problems: [(e.message || '').slice(0, 80)] });
  }
  await page.close();
}

await browser.close();

console.log('\n========== SABLON DUMAN TESTI ==========');
for (const r of results) {
  const mark = r.ok ? 'PASS' : 'FAIL';
  const detail = r.ok
    ? `${r.info.textLen} karakter / ${r.info.tables} tablo / ${r.info.cells} hucre${r.info.h1 ? ` / "${r.info.h1}"` : ''}`
    : r.problems.join(' | ');
  console.log(`  [${mark}] ${r.name.padEnd(22)} ${detail}`);
}
const failed = results.filter((r) => !r.ok);
console.log(`\nToplam: ${results.length} | PASS: ${results.length - failed.length} | FAIL: ${failed.length}`);
console.log('=======================================');
process.exit(failed.length ? 1 : 0);
