import { describe, it, expect } from 'vitest';
import { detectSheetSize, mmToPx, A4_SHEET } from './sheetSize';

describe('sheetSize', () => {
  describe('mmToPx', () => {
    it('should convert A4 width to the 794px the preview used to assume', () => {
      expect(mmToPx(210)).toBeCloseTo(793.7, 1);
    });

    it('should convert an 80mm receipt to ~302px', () => {
      expect(mmToPx(80)).toBeCloseTo(302.4, 1);
    });
  });

  describe('detectSheetSize', () => {
    it('should fall back to A4 when the template declares nothing', () => {
      expect(detectSheetSize('<html><body><p>fatura</p></body></html>')).toEqual(A4_SHEET);
    });

    it('should fall back to A4 for empty input', () => {
      expect(detectSheetSize('')).toEqual(A4_SHEET);
    });

    it('should read a named page size', () => {
      const s = detectSheetSize('@page { size: A5; margin: 10mm; }');
      expect(s.widthMm).toBe(148);
      expect(s.heightMm).toBe(210);
      expect(s.label).toBe('A5');
    });

    it('should read an 80mm receipt with auto height (mini-fis)', () => {
      const s = detectSheetSize('<style>@page { size: 80mm auto; margin: 0; }</style>');
      expect(s.widthMm).toBe(80);
      expect(s.heightMm).toBeNull();
      expect(s.label).toBe('80mm');
    });

    it('should read explicit millimetre dimensions', () => {
      const s = detectSheetSize('@page { size: 210mm 297mm; }');
      expect(s.widthMm).toBe(210);
      expect(s.heightMm).toBe(297);
    });

    it('should convert centimetres', () => {
      const s = detectSheetSize('@page { size: 8cm auto; }');
      expect(s.widthMm).toBe(80);
      expect(s.heightMm).toBeNull();
    });

    it('should convert inches', () => {
      const s = detectSheetSize('@page { size: 8.5in 11in; }');
      expect(s.widthMm).toBeCloseTo(215.9, 1);
      expect(s.heightMm).toBeCloseTo(279.4, 1);
    });

    it('should convert pixels', () => {
      const s = detectSheetSize('@page { size: 794px auto; }');
      expect(s.widthMm).toBeCloseTo(210.1, 0);
    });

    it('should tolerate extra declarations inside the @page block', () => {
      const html = '<style>@page { margin: 5mm; size: 100mm 200mm; border: 0; }</style>';
      const s = detectSheetSize(html);
      expect(s.widthMm).toBe(100);
      expect(s.heightMm).toBe(200);
    });

    it('should not be fooled by size: outside an @page block', () => {
      // Sadece body/tablo içindeki `size:` ifadesi sayfa boyutu DEĞİLDİR.
      const html = '<style>.icon { size: 300px; } @media print { body { size: 5mm; } }</style>';
      expect(detectSheetSize(html)).toEqual(A4_SHEET);
    });

    it('should ignore a non-numeric size and stay on A4', () => {
      expect(detectSheetSize('@page { size: banana; }')).toEqual(A4_SHEET);
    });

    it('should ignore a zero width', () => {
      expect(detectSheetSize('@page { size: 0mm auto; }')).toEqual(A4_SHEET);
    });

    it('should find the @page rule inside a full transformed document', () => {
      const html = `<html><head><style>
        body { font-family: monospace; }
        @page { size: 58mm auto; margin: 0; }
      </style></head><body>x</body></html>`;
      expect(detectSheetSize(html).widthMm).toBe(58);
    });
  });
});
