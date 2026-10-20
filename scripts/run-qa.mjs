// QA toplu koşucusu: buton, ek özellik ve sürükle-bırak testlerini sırayla
// çalıştırır, sonuçları toplar. CI'da `npm run qa` ile çağrılır.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const SCRIPTS = ['qa-buttons.mjs', 'qa-extra.mjs', 'qa-drag.mjs'];

function ensureServer() {
  return new Promise((resolve) => {
    const req = fetch('http://localhost:5173/api/list-templates');
    req
      .then((r) => (r.ok ? resolve(true) : resolve(false)))
      .catch(() => resolve(false));
  });
}

async function waitForServer() {
  for (let i = 0; i < 40; i++) {
    if (await ensureServer()) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

function run(script) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [join('scripts', script)], { stdio: 'inherit' });
    p.on('close', (code) => resolve(code === 0));
  });
}

async function main() {
  if (!(await ensureServer())) {
    console.log('dev sunucusu kapali, baslatiliyor...');
    const dev = spawn('npm', ['run', 'dev'], { stdio: 'ignore', shell: true, detached: false });
    if (!(await waitForServer())) {
      console.error('HATA: dev sunucusu baslatilamadi');
      dev.kill();
      process.exit(1);
    }
  }

  const results = [];
  for (const script of SCRIPTS) {
    if (!existsSync(join('scripts', script))) {
      console.log(`ATLANDI (dosya yok): ${script}`);
      continue;
    }
    console.log(`\n########## ${script} ##########`);
    const ok = await run(script);
    results.push({ script, ok });
  }

  console.log('\n========== QA TOPLU ==========');
  results.forEach((r) => console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.script}`));
  const failed = results.filter((r) => !r.ok);
  console.log(`Toplam: ${results.length} | PASS: ${results.length - failed.length} | FAIL: ${failed.length}`);
  console.log('==============================');
  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((e) => { console.error('HATA:', e.message); process.exit(1); });
