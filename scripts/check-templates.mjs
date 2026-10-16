#!/usr/bin/env node
/**
 * Şablon bütünlük denetimi.
 *
 * Kullanıcının ilk şikayeti buydu: bir tablonun başlık hücresi ile veri
 * hücresi birbirinden ayrı yorumlanınca satırlar bir sütun kayıyor ve
 * "Tutar" değerleri yanlış başlığın altında görünüyor. Elle yorum
 * açıp kapamak bu hatayı sessizce üretiyordu.
 *
 * Bu denetim iki şeyi yakalar:
 *   1. XML yorumlarının açılış/kapanış dengesi (yetim `-->` veya açılmamış
 *      `<!--` bir şablonu sessizce bozar).
 *   2. Kalem tablosunda canlı başlık hücresi sayısı == canlı veri hücresi
 *      sayısı (kayma yok).
 *
 * Kullanım:  npm run check:templates
 * Çıkış kodu 0 = temiz, 1 = sorun var.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const TEMPLATE_DIR = join(process.cwd(), 'public', 'templates');

/** XML yorumlarını temizlenmiş satırlara ayırır. */
function stripComments(xslt) {
  const out = [];
  let inComment = false;
  for (const line of xslt.split(/\r?\n/)) {
    let rest = line;
    let live = '';
    while (rest.length) {
      if (!inComment) {
        const i = rest.indexOf('<!--');
        if (i === -1) {
          live += rest;
          rest = '';
        } else {
          live += rest.slice(0, i);
          inComment = true;
          rest = rest.slice(i + 4);
        }
      } else {
        const i = rest.indexOf('-->');
        if (i === -1) rest = '';
        else {
          inComment = false;
          rest = rest.slice(i + 3);
        }
      }
    }
    out.push(live);
  }
  return { lines: out, endedInComment: inComment };
}

function checkComments(xslt) {
  const problems = [];
  let depth = 0;
  xslt.split(/\r?\n/).forEach((line, i) => {
    depth += (line.match(/<!--/g) || []).length - (line.match(/-->/g) || []).length;
    if (depth < 0) {
      problems.push(`satir ${i + 1}: yetim "-->" — onceki satirlarda acilan yorum yok`);
      depth = 0;
    }
  });
  if (depth > 0) problems.push(`dosya sonunda kapanmamis ${depth} yorum var`);
  return problems;
}

function checkColumns(liveLines) {
  const heads = liveLines.filter((l) => l.includes('id="lineTableHead"')).length;
  const cells = liveLines.filter((l) => l.includes('id="lineTableTd"')).length;
  if (heads === 0 && cells === 0) return null; // bu şablonda kalem tablosu yok
  return heads === cells ? null : `baslik ${heads} hucre ama veri ${cells} hucre — SUTUN KAYMASI var`;
}

let failed = 0;
const files = readdirSync(TEMPLATE_DIR).filter((f) => f.endsWith('.xslt')).sort();

if (files.length === 0) {
  console.log('public/templates altinda .xslt dosyasi yok — denetim icin bir sey yok.');
  process.exit(0);
}

for (const file of files) {
  const xslt = readFileSync(join(TEMPLATE_DIR, file), 'utf8');
  const commentProblems = checkComments(xslt);
  const { lines } = stripComments(xslt);
  const columnProblem = checkColumns(lines);

  const problems = [...commentProblems, ...(columnProblem ? [columnProblem] : [])];
  if (problems.length === 0) {
    console.log(`  OK    ${file}`);
  } else {
    failed += 1;
    console.log(`  HATA  ${file}`);
    problems.forEach((p) => console.log(`          - ${p}`));
  }
}

console.log('');
if (failed === 0) {
  console.log(`Tum ${files.length} sablon temiz.`);
} else {
  console.log(`${failed}/${files.length} sablon hatali.`);
}
process.exit(failed === 0 ? 0 : 1);
