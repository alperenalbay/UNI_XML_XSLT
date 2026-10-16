#!/usr/bin/env node
/**
 * toggle-feature — XSLT şablonlarındaki FEATURE bölgelerini adıyla aç/kapar.
 *
 * Kullanım:
 *   node scripts/toggle-feature.mjs list [--file gib.xslt]
 *   node scripts/toggle-feature.mjs toggle <adi> [--file gib.xslt]
 *   node scripts/toggle-feature.mjs on|off <adi> [--file gib.xslt]
 *
 * Marker biçimi (XSLT içinde):
 *   Kapalı: <!--FEATURE adi OFF ...blok... FEATURE adi END-->
 *   Açık:  <!--FEATURE adi ON--> ...blok... <!--FEATURE adi END-->
 * Aynı ada sahip tüm bölgeler (başlık + satır) hep birlikke döner.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listFeatures, setFeatureState, toggleFeature } from '../src/utils/featureToggle.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const templateDir = join(root, 'public', 'templates');

const args = process.argv.slice(2);
const fileArgIdx = args.indexOf('--file');
const fileName = fileArgIdx !== -1 ? args[fileArgIdx + 1] : undefined;
if (fileArgIdx !== -1) args.splice(fileArgIdx, 2);

const command = args[0];
const featureName = args[1];

const stateLabel = { on: 'açık', off: 'kapalı' };

function targetFiles() {
  if (fileName) {
    const path = join(templateDir, fileName);
    try {
      readFileSync(path, 'utf8');
    } catch {
      console.error(`Dosya bulunamadı: ${fileName}`);
      process.exit(1);
    }
    return [{ name: fileName, path }];
  }
  return readdirSync(templateDir)
    .filter((f) => f.endsWith('.xslt') || f.endsWith('.xsl'))
    .map((f) => ({ name: f, path: join(templateDir, f) }));
}

function usage() {
  console.log(`Kullanım:
  node scripts/toggle-feature.mjs list [--file gib.xslt]
  node scripts/toggle-feature.mjs toggle <adi> [--file gib.xslt]
  node scripts/toggle-feature.mjs on|off <adi> [--file gib.xslt]`);
}

if (!command || !['list', 'toggle', 'on', 'off'].includes(command)) {
  usage();
  process.exit(1);
}

if (command === 'list') {
  for (const file of targetFiles()) {
    const features = listFeatures(readFileSync(file.path, 'utf8'));
    const entries = Object.entries(features);
    console.log(`\n${file.name}:`);
    if (entries.length === 0) {
      console.log('  (FEATURE bulunamadı)');
    } else {
      for (const [name, state] of entries) {
        console.log(`  ${name.padEnd(16)} ${stateLabel[state]}`);
      }
    }
  }
  process.exit(0);
}

if (!featureName) {
  console.error('Özellik adı gerekli.');
  usage();
  process.exit(1);
}

for (const file of targetFiles()) {
  const original = readFileSync(file.path, 'utf8');
  try {
    const result =
      command === 'toggle'
        ? toggleFeature(original, featureName)
        : setFeatureState(original, featureName, command);
    const state = command === 'toggle' ? result.state : command;
    if (result.changed > 0) {
      writeFileSync(file.path, result.content, 'utf8');
      console.log(`${file.name}: ${featureName} ${stateLabel[state]} yapıldı (${result.changed} bölge)`);
    } else {
      console.log(`${file.name}: ${featureName} zaten ${stateLabel[state]}`);
    }
  } catch (e) {
    console.error(`${file.name}: ${e.message}`);
  }
}
