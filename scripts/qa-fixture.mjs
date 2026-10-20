// QA betikleri icin kendi sablon fixture'i.
//
// Neden: public/templates/ .gitignore'dadir (KVKK - fatura verisi icerir) ve
// CI'da bos gelir. QA betikleri kullaniciya ait sablonlara (gib vb.)
// baglanirsa CI'da calismaz. Bu yuzden her QA betigi kendi kucuk fixture'ini
// yazar, onu yukler ve test sonunda siler.
import { writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';

const TEMPLATE_DIR = join(process.cwd(), 'public', 'templates');

export const FIXTURE_FILE = 'qa-fixture.xslt';
export const FIXTURE_LABEL = 'qa-fixture';

// 1x1 saydam PNG
const TINY_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const FIXTURE_XSLT = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <meta charset="UTF-8"/>
        <title>QA Fixture</title>
        <style>
          body { background: #ffffff; font-family: sans-serif; margin: 0; padding: 16px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #cbd5e1; padding: 4px; }
        </style>
      </head>
      <body>
        <h1 id="qa-title">QA BAŞLIK</h1>
        <table id="qa-table">
          <tr>
            <th>Ürün/Hizmet Adı</th>
            <th>Miktar</th>
            <th>Tutar</th>
          </tr>
          <tr>
            <td>Deneme Kalemi</td>
            <td>2</td>
            <td>500,00</td>
          </tr>
        </table>
        <div style="text-align: center;">
          <img src="${TINY_PNG}" alt="QA Logo" style="width: 60px;" />
        </div>
        <p>QA paragraf metni.</p>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;

/** Fixture sablonunu yazar. Test sonunda cleanup() cagrilmalidir. */
export async function setupQaFixture() {
  await writeFile(join(TEMPLATE_DIR, FIXTURE_FILE), FIXTURE_XSLT, 'utf-8');
  return async function cleanup() {
    await unlink(join(TEMPLATE_DIR, FIXTURE_FILE)).catch(() => undefined);
  };
}
