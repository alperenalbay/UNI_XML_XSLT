/**
 * Baskı sayfasının gerçek boyutunu şablonun kendi CSS'inden çıkarır.
 *
 * Neden? Önizleme A4 varsayıyordu (sabit 794px / 210mm / 297mm). 80mm fiş
 * gibi dar şablonlar ekranda küçük bir dikdörtgen olarak görünüyor, kullanıcı
 * büyütmek için elle zoom yapmak zorunda kalıyordu.
 *
 * CSS Paged Media'nın standart sinyali `@page { size: ... }` — fatura
 * şablonları fiş genişliğini zaten burada bildiriyor. Sinyal yoksa A4.
 */

export interface SheetSize {
  widthMm: number;
  /** `null` = "auto" (ör. `size: 80mm auto`) — yükseklik içeriğe göre. */
  heightMm: number | null;
  /** Kullanıcıya gösterilecek okunur ad, ör. "A4", "80mm fiş". */
  label: string;
}

export const A4_SHEET: SheetSize = { widthMm: 210, heightMm: 297, label: 'A4' };

/** CSS'te kullanılan sayfa adları → mm boyutları. */
const NAMED_SIZES: Record<string, { widthMm: number; heightMm: number }> = {
  a3: { widthMm: 297, heightMm: 420 },
  a4: { widthMm: 210, heightMm: 297 },
  a5: { widthMm: 148, heightMm: 210 },
  b5: { widthMm: 176, heightMm: 250 },
  letter: { widthMm: 215.9, heightMm: 279.4 },
  legal: { widthMm: 215.9, heightMm: 355.6 },
  tabloid: { widthMm: 279.4, heightMm: 431.8 },
};

const MM_PER_UNIT: Record<string, number> = {
  mm: 1,
  cm: 10,
  in: 25.4,
  pt: 25.4 / 72,
  pc: 25.4 / 6,
  px: 25.4 / 96,
  q: 25.4 / 101.6,
};

/** CSS uzunluğunu mm'ye çevirir. Geçersizse null. */
function toMm(token: string): number | null {
  const m = /^(-?\d*\.?\d+)\s*(mm|cm|in|pt|pc|px|q)$/i.exec(token.trim());
  if (!m) return null;
  const value = Number.parseFloat(m[1]);
  if (!Number.isFinite(value)) return null;
  return value * MM_PER_UNIT[m[2].toLowerCase()];
}

/**
 * Şablonun beyan ettiği sayfa boyutunu bulur.
 *
 * `html` genellikle dönüştürülmüş çıktıdır; `@page { size: 80mm auto }`
 * kalıbı aranır. Bulunamazsa A4 döner.
 */
export function detectSheetSize(html: string): SheetSize {
  if (!html) return A4_SHEET;

  // @page { ... size: <değer> ... }  — değer, süslü parantez kapanana kadar.
  const pageRule = /@page\b[^{]*\{([^}]*)\}/i.exec(html);
  if (!pageRule) return A4_SHEET;

  const sizeDecl = /(?:^|[;{\s])size\s*:\s*([^;}]+)/i.exec(pageRule[1]);
  if (!sizeDecl) return A4_SHEET;

  const parts = sizeDecl[1]
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return A4_SHEET;

  // Adlandırılmış boyut: size: A4 / letter / ...
  const named = parts[0].toLowerCase();
  if (parts.length === 1 && NAMED_SIZES[named]) {
    const s = NAMED_SIZES[named];
    return { widthMm: s.widthMm, heightMm: s.heightMm, label: named.toUpperCase() };
  }

  // Ölçülü boyut: size: 80mm auto / 210mm 297mm / 8cm
  const widthMm = toMm(parts[0]);
  if (widthMm === null || widthMm <= 0) return A4_SHEET;

  let heightMm: number | null = null;
  if (parts.length > 1 && parts[1].toLowerCase() !== 'auto') {
    const parsed = toMm(parts[1]);
    heightMm = parsed !== null && parsed > 0 ? parsed : null;
  }

  const label = heightMm === null ? `${Math.round(widthMm)}mm` : `${Math.round(widthMm)}×${Math.round(heightMm)}mm`;
  return { widthMm, heightMm, label };
}

/** mm → CSS piksel (96dpi). */
export function mmToPx(mm: number): number {
  return (mm * 96) / 25.4;
}
