// XSLT kaynak kodu içinde bir elemanın satırını bulma yardımcıları.
// App.tsx'ten ayrılarak saf fonksiyonlar haline getirildi; hem inspector
// mesaj işleyicisi hem de "hızlı atlama" menüsü bunları kullanır.

/**
 * Arama terimlerine göre XSLT kodunda eşleşen satırı bulur.
 *
 * Terim öncelik sırası: id → class → ham metin → tag adı.
 * Her terim için önce birebir (case-sensitive) eşleşme, sonra tüm dosyada
 * bulunamazsa case-insensitive fallback denenir.
 */
export function findLineInCode(code: string, searchTerms: string[]): number {
  const lines = code.split('\n');

  const matchesTerm = (lineContent: string, term: string): boolean => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return false;

    // 1. Terim bir class ise (.company-name / class="company-name" / class='company-name')
    let className = '';
    if (trimmedTerm.startsWith('.')) {
      className = trimmedTerm.substring(1);
    } else if (trimmedTerm.startsWith('class="') && trimmedTerm.endsWith('"')) {
      className = trimmedTerm.substring(7, trimmedTerm.length - 1);
    } else if (trimmedTerm.startsWith("class='") && trimmedTerm.endsWith("'")) {
      className = trimmedTerm.substring(7, trimmedTerm.length - 1);
    }

    if (className) {
      const regex = /class\s*=\s*['"]([^'"]*)['"]/gi;
      let match;
      regex.lastIndex = 0;
      while ((match = regex.exec(lineContent)) !== null) {
        const classValue = match[1] || '';
        const classes = classValue.split(/\s+/).map((c) => c.trim()).filter(Boolean);
        if (classes.includes(className)) {
          return true;
        }
      }
      return false;
    }

    // 2. Terim bir id ise (#logo / id="logo" / id='logo')
    let idName = '';
    if (trimmedTerm.startsWith('#')) {
      idName = trimmedTerm.substring(1);
    } else if (trimmedTerm.startsWith('id="') && trimmedTerm.endsWith('"')) {
      idName = trimmedTerm.substring(4, trimmedTerm.length - 1);
    } else if (trimmedTerm.startsWith("id='") && trimmedTerm.endsWith("'")) {
      idName = trimmedTerm.substring(4, trimmedTerm.length - 1);
    }

    if (idName) {
      const regex = /id\s*=\s*['"]([^'"]*)['"]/gi;
      let match;
      regex.lastIndex = 0;
      while ((match = regex.exec(lineContent)) !== null) {
        const idValue = (match[1] || '').trim();
        if (idValue === idName) {
          return true;
        }
      }
      return false;
    }

    // 3. Varsayılan: birebir, case-sensitive eşleşme
    return lineContent.includes(term);
  };

  // 1. İlk geçiş: terimleri sırayla dene (yüksek öncelikli önce)
  for (const term of searchTerms) {
    for (let i = 0; i < lines.length; i++) {
      if (matchesTerm(lines[i], term)) {
        return i + 1;
      }
    }
  }

  // 2. İkinci geçiş: case-insensitive fallback
  for (const term of searchTerms) {
    const lower = term.toLowerCase();
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(lower)) {
        return i + 1;
      }
    }
  }

  return 1;
}

/**
 * Bir önizleme elemanı için arama terimleri üretir (öncelik sırasıyla).
 */
export function getSearchTerms(id: string, className: string, text: string, tagName: string): string[] {
  const searchTerms: string[] = [];
  if (id) {
    searchTerms.push(`id="${id}"`);
    searchTerms.push(`id='${id}'`);
  }
  if (className && typeof className === 'string') {
    const classes = className.split(/\s+/).filter((c) => c.trim().length > 1 && c !== 'hover' && c !== 'uni-selected-element');
    classes.forEach((c) => {
      searchTerms.push(`class="${c}"`);
      searchTerms.push(`class='${c}'`);
      searchTerms.push(`.${c}`);
    });
  }
  if (text && text.length > 2 && text.length < 40) {
    searchTerms.push(text.replace(/['"]/g, ''));
  }
  if (tagName) {
    searchTerms.push(`<${tagName}`);
  }
  return searchTerms;
}
