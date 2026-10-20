import { describe, it, expect } from 'vitest';
import {
  updateElementStyleInXsltById,
  updateElementTextInXsltById,
  updateXsltText,
  updateImageStyleInXslt,
  getImageStyleFromXslt,
  findLineByXsltId,
  updateXsltTagAtLine,
  updateXsltStyle,
  getXsltStyleValue,
} from './xsltTransformer';

/**
 * Tasarımcı yazma yolunun çekirdek fonksiyonları.
 *
 * Bu fonksiyonlar stil panelinden gelen isteği XSLT koduna yazar; hepsi
 * daha önce testsizdi. Uygulamanın en kritik halkası olduğu için (yanlış
 * yazılırsa kullanıcı sessizce bozuk tasarım alır) burada kilitleniyor.
 *
 * `data-xslt-id` numaralandırması belge sırasına göre 1'den başlar ve
 * XSLT ad alanındaki elemanlar (xsl:*) atlanır (bkz. xsltIdUtils.ts).
 */

const SIMPLE_XSLT = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <body>
        <h1 id="title" style="font-size: 16px; color: #111111;">BASLIK</h1>
        <p id="para">PARAGRAF</p>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

describe('updateElementStyleInXsltById', () => {
  it('mevcut özelliği günceller ve !important ekler', () => {
    // id 1 = <html>, 2 = <body>, 3 = <h1>
    const result = updateElementStyleInXsltById(SIMPLE_XSLT, '3', 'color', '#b45309');
    expect(result).toContain('color: #b45309 !important');
    expect(result).toContain('font-size: 16px');
  });

  it('yeni özelliği ekler', () => {
    const result = updateElementStyleInXsltById(SIMPLE_XSLT, '3', 'font-weight', 'bold');
    expect(result).toContain('font-weight: bold');
  });

  it('!important zaten varsa tekrarlamaz', () => {
    const result = updateElementStyleInXsltById(SIMPLE_XSLT, '3', 'color', '#b45309 !important');
    expect(result.match(/color:/g)?.length).toBe(1);
  });

  it('boş değerle özelliği siler', () => {
    const result = updateElementStyleInXsltById(SIMPLE_XSLT, '3', 'color', '');
    expect(result).not.toContain('color:');
    expect(result).toContain('font-size: 16px');
  });

  it('width değişince ham width niteliğini de günceller', () => {
    const result = updateElementStyleInXsltById(SIMPLE_XSLT, '3', 'width', '150px');
    expect(result).toContain('width: 150px');
    expect(result).toContain('width="150px"');
  });

  it('white-space: nowrap içeriği <nobr> ile sarar', () => {
    const result = updateElementStyleInXsltById(SIMPLE_XSLT, '3', 'white-space', 'nowrap');
    expect(result).toContain('<nobr>');
    expect(result).toContain('BASLIK');
  });

  it('white-space: normal <nobr> sarmalayıcısını kaldırır', () => {
    const wrapped = updateElementStyleInXsltById(SIMPLE_XSLT, '3', 'white-space', 'nowrap');
    expect(wrapped).toContain('<nobr>');
    const unwrapped = updateElementStyleInXsltById(wrapped, '3', 'white-space', 'normal');
    expect(unwrapped).not.toContain('<nobr>');
    expect(unwrapped).toContain('BASLIK');
  });

  it('geçersiz XSLT veya bilinmeyen id değişiklik yapmaz', () => {
    expect(updateElementStyleInXsltById('<not-xml', '1', 'color', 'red')).toBe('<not-xml');
    expect(updateElementStyleInXsltById(SIMPLE_XSLT, '999', 'color', 'red')).toBe(SIMPLE_XSLT);
  });

  it('boş girdilerde dokunmaz', () => {
    expect(updateElementStyleInXsltById('', '1', 'color', 'red')).toBe('');
    expect(updateElementStyleInXsltById(SIMPLE_XSLT, '', 'color', 'red')).toBe(SIMPLE_XSLT);
    expect(updateElementStyleInXsltById(SIMPLE_XSLT, '1', '', 'red')).toBe(SIMPLE_XSLT);
  });
});

describe('updateElementTextInXsltById', () => {
  it('eleman metnini değiştirir', () => {
    const result = updateElementTextInXsltById(SIMPLE_XSLT, '3', 'YENİ BAŞLIK');
    expect(result).toContain('YENİ BAŞLIK');
    expect(result).not.toContain('BASLIK');
  });

  it('geçersiz XSLT veya bilinmeyen id değişiklik yapmaz', () => {
    expect(updateElementTextInXsltById('<not-xml', '1', 'X')).toBe('<not-xml');
    expect(updateElementTextInXsltById(SIMPLE_XSLT, '999', 'X')).toBe(SIMPLE_XSLT);
  });
});

describe('updateXsltText', () => {
  it('statik metni değiştirir', () => {
    const result = updateXsltText(SIMPLE_XSLT, 'BASLIK', 'DEĞİŞTİ');
    expect(result).toContain('DEĞİŞTİ');
  });

  it('olmayan metne dokunmaz', () => {
    expect(updateXsltText(SIMPLE_XSLT, 'YOK', 'X')).toBe(SIMPLE_XSLT);
  });
});

describe('updateImageStyleInXslt / getImageStyleFromXslt', () => {
  const withImage = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html><body>
      <div style="text-align: center;"><img src="logo.png" alt="L" style="width: 300px;" /></div>
    </body></html>
  </xsl:template>
</xsl:stylesheet>`;

  it('görselin stilini günceller', () => {
    const result = updateImageStyleInXslt(withImage, 'logo.png', 'width', '150px');
    expect(result).toContain('width: 150px');
    expect(result).not.toContain('width: 300px');
  });

  it('görselin mevcut stilini okur', () => {
    expect(getImageStyleFromXslt(withImage, 'logo.png', 'width')).toBe('300px');
  });

  it('olmayan görselde dokunmaz', () => {
    expect(updateImageStyleInXslt(withImage, 'yok.png', 'width', '150px')).toBe(withImage);
  });
});

describe('findLineByXsltId', () => {
  it('elemanın satır numarasını bulur', () => {
    // <h1> satır 6, <p> satır 7 (1 tabanlı)
    expect(findLineByXsltId(SIMPLE_XSLT, '3')).toBe(6);
    expect(findLineByXsltId(SIMPLE_XSLT, '4')).toBe(7);
  });

  it('bulunamayan id 0 döner', () => {
    // NOT: findLineByXsltId, XSLT döngülerinde aynı etiketin birden çok DOM
    // kopyası üretmesi nedeniyle sayaç büyükse modulo ile sarar. Bu yüzden
    // "olmayan id" her zaman 0 dönmez; boş girdiler 0 döner.
    expect(findLineByXsltId('', '1')).toBe(0);
    expect(findLineByXsltId(SIMPLE_XSLT, '')).toBe(0);
  });

  it('döngü kopyaları için modulo ile sarar', () => {
    // 4 gerçek eleman var; 999 -> ((999-1) % 4) + 1 = 3 -> <h1> satırı
    expect(findLineByXsltId(SIMPLE_XSLT, '999')).toBe(findLineByXsltId(SIMPLE_XSLT, '3'));
  });
});

describe('updateXsltTagAtLine / updateXsltStyle / getXsltStyleValue', () => {
  const withStyle = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <head>
        <style>
          .baslik { font-size: 12px; color: red; }
        </style>
      </head>
      <body>
        <h1>BASLIK</h1>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

  it('satırdaki etiketin stilini günceller', () => {
    // <h1> 11. satırda kendi satırında başlıyor (fonksiyon 1 tabanlı)
    const result = updateXsltTagAtLine(withStyle, 11, 'font-size', '20px');
    expect(result).toContain('font-size: 20px');
  });

  it('stil bloğundaki özelliği günceller', () => {
    const result = updateXsltStyle(withStyle, '.baslik', 'color', 'blue');
    expect(result).toContain('color: blue');
  });

  it('stil bloğundaki değeri okur', () => {
    expect(getXsltStyleValue(withStyle, '.baslik', 'font-size')).toBe('12px');
  });

  it('olmayan seçici için boş döner', () => {
    expect(getXsltStyleValue(withStyle, '.yok', 'color')).toBe('');
  });
});
