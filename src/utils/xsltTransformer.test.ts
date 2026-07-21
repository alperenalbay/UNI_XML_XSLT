import { describe, it, expect } from 'vitest';
import {
  transformXmlWithXslt,
  extractEmbeddedXslt,
  removeEmbeddedXslt,
  addElementToXslt,
  removeElementFromXslt,
  updateXsltTagAtLine,
  addWatermarkToXslt,
  removeWatermarkFromXslt,
  hasWatermarkInXslt,
} from './xsltTransformer';

describe('xsltTransformer', () => {
  describe('transformXmlWithXslt', () => {
    it('should handle empty XML', () => {
      const result = transformXmlWithXslt('', '<xsl:stylesheet />');
      expect(result.error).toBeDefined();
      expect(result.html).toBe('');
    });

    it('should handle empty XSLT', () => {
      const result = transformXmlWithXslt('<root />', '');
      expect(result.error).toBeDefined();
      expect(result.html).toBe('');
    });

    it('should handle invalid XML', () => {
      const result = transformXmlWithXslt('<root', '<xsl:stylesheet />');
      expect(result.error).toBeTruthy();
      expect(result.html).toBe('');
    });

    it('should handle invalid XSLT', () => {
      const result = transformXmlWithXslt('<root />', '<xsl:stylesheet');
      expect(result.error).toBeTruthy();
    });

    it('should skip browser-specific XSLTProcessor tests in Node environment', () => {
      // XSLTProcessor sadece browser'da mevcut
      // Happy-dom/jsdom'da test edilmez
      expect(typeof (globalThis as any).XSLTProcessor).toBe('undefined');
    });
  });

  describe('extractEmbeddedXslt', () => {
    it('should return null for empty XML', () => {
      const result = extractEmbeddedXslt('');
      expect(result).toBeNull();
    });

    it('should return null if no embedded XSLT found', () => {
      const xml = '<root><item>Test</item></root>';
      const result = extractEmbeddedXslt(xml);
      expect(result).toBeNull();
    });

    it('should handle malformed embedded XSLT gracefully', () => {
      const xml = `<root>
        <AdditionalDocumentReference>
          <DocumentType>XSLT</DocumentType>
        </AdditionalDocumentReference>
      </root>`;
      const result = extractEmbeddedXslt(xml);
      expect(result).toBeNull();
    });
  });

  describe('removeEmbeddedXslt', () => {
    it('should return unchanged XML if no embedded XSLT', () => {
      const xml = '<root><item>Test</item></root>';
      const result = removeEmbeddedXslt(xml);
      expect(result).toContain('<item>Test</item>');
    });

    it('should preserve content when removing XSLT', () => {
      const xml = `<root>
        <Content>Important Data</Content>
        <AdditionalDocumentReference>
          <DocumentType>XSLT</DocumentType>
        </AdditionalDocumentReference>
      </root>`;
      const result = removeEmbeddedXslt(xml);
      expect(result).toContain('Important Data');
    });

    it('should handle empty input gracefully', () => {
      const result = removeEmbeddedXslt('');
      expect(result).toBe('');
    });

    it('should handle XML with only whitespace', () => {
      const result = removeEmbeddedXslt('   ');
      expect(result.trim()).toBe('');
    });
  });

  describe('addElementToXslt', () => {
    const xslt = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <head>
        <style>
          .container { padding: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <p id="first-p">Hello World</p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

    it('should add element inside parent matched by class', () => {
      const result = addElementToXslt(xslt, '.container', 'New text');
      expect(result).toContain('New text');
      expect(result).toContain('custom-text-');
    });

    it('should add element inside parent matched by id', () => {
      const result = addElementToXslt(xslt, '#first-p', 'Sub text');
      expect(result).toContain('Sub text');
    });

    it('should add element inside parent matched by xsltId', () => {
      const result = addElementToXslt(xslt, '', 'By ID text', { xsltId: '2' });
      expect(result).toContain('By ID text');
    });
  });

  describe('removeElementFromXslt', () => {
    const xslt = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <head>
        <style>
          .target-class { color: red; }
          .other-class { color: blue; }
        </style>
      </head>
      <body>
        <div class="target-class">Item 1</div>
        <div class="other-class">Item 2</div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

    it('should remove element by selector class name', () => {
      const result = removeElementFromXslt(xslt, '.target-class');
      expect(result).not.toContain('Item 1');
      expect(result).toContain('Item 2');
      expect(result).not.toContain('.target-class { color: red; }');
    });

    it('should not fall back to class if xsltId is provided but not matched', () => {
      const result = removeElementFromXslt(xslt, '.other-class', { xsltId: '999' });
      expect(result).toContain('Item 2');
    });
  });

  describe('updateXsltTagAtLine', () => {
    it('should wrap single-line element with nobr when nowrap is enabled', () => {
      const code = '<span>Hello</span>';
      const result = updateXsltTagAtLine(code, 1, 'white-space', 'nowrap');
      expect(result).toBe('<span style="white-space: nowrap !important;"><nobr>Hello</nobr></span>');
    });

    it('should unwrap single-line element with nobr when nowrap is disabled', () => {
      const code = '<span><nobr>Hello</nobr></span>';
      const result = updateXsltTagAtLine(code, 1, 'white-space', 'normal');
      expect(result).toBe('<span style="white-space: normal !important;">Hello</span>');
    });

    it('should wrap multi-line element with nobr and matching closing tag', () => {
      const code = `<span>
  <xsl:text>Hello</xsl:text>
</span>`;
      const result = updateXsltTagAtLine(code, 1, 'white-space', 'nowrap');
      const expected = `<span style="white-space: nowrap !important;"><nobr>
  <xsl:text>Hello</xsl:text>
</nobr></span>`;
      expect(result).toBe(expected);
    });

    it('should unwrap multi-line element correctly', () => {
      const code = `<span><nobr>
  <xsl:text>Hello</xsl:text>
</nobr></span>`;
      const result = updateXsltTagAtLine(code, 1, 'white-space', 'normal');
      const expected = `<span style="white-space: normal !important;">
  <xsl:text>Hello</xsl:text>
</span>`;
      expect(result).toBe(expected);
    });

    it('should redirect update from xsl:text to its parent HTML tag', () => {
      const code = `<span>
  <xsl:text>Hello</xsl:text>
</span>`;
      const result = updateXsltTagAtLine(code, 2, 'white-space', 'nowrap');
      const expected = `<span style="white-space: nowrap !important;"><nobr>
  <xsl:text>Hello</xsl:text>
</nobr></span>`;
      expect(result).toBe(expected);
    });

    it('should update style attribute on a single-line tag', () => {
      const code = '<div style="color: red;">Hello</div>';
      const result = updateXsltTagAtLine(code, 1, 'color', 'blue');
      expect(result).toBe('<div style="color: blue !important;">Hello</div>');
    });

    it('should update style attribute on a multiline start tag', () => {
      const code = `<div
  class="my-div"
  style="color: red;"
>
  Hello
</div>`;
      const result = updateXsltTagAtLine(code, 1, 'text-align', 'center');
      // The updated tag will be serialized on a single line where it was replaced, which is fine
      expect(result).toBe(`<div class="my-div" style="color: red; text-align: center !important;">
  Hello
</div>`);
    });

    it('should update width attribute and width inside style attribute', () => {
      const code = '<col width="10%"/>';
      const result = updateXsltTagAtLine(code, 1, 'width', '20%');
      expect(result).toBe('<col width="20%" style="width: 20% !important;"/>');
    });
  });

  describe('addWatermarkToXslt', () => {
    const baseXslt = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <head><title>Test</title></head>
      <body>
        <p>Hello</p>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

    const sampleImage = 'data:image/png;base64,iVBORw0KGgoAAAANS';

    it('should return unchanged XSLT when image is empty', () => {
      const result = addWatermarkToXslt(baseXslt, { image: '', size: 50, opacity: 20, rotation: -15 });
      expect(result).toBe(baseXslt);
    });

    it('should insert watermark overlay inside body', () => {
      const result = addWatermarkToXslt(baseXslt, { image: sampleImage, size: 50, opacity: 20, rotation: -15 });
      expect(result).toContain('uni-watermark-overlay');
      expect(result).toContain(sampleImage);
      expect(result).toContain('width:50%');
      expect(result).toContain('opacity:0.20');
      expect(result).toContain('rotate(-15deg)');
      const bodyIdx = result.indexOf('<body>');
      const overlayIdx = result.indexOf('uni-watermark-overlay');
      expect(overlayIdx).toBeGreaterThan(bodyIdx);
    });

    it('should fall back to html when body missing', () => {
      const noBodyXslt = `<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/"><html><p>x</p></html></xsl:template>
</xsl:stylesheet>`;
      const result = addWatermarkToXslt(noBodyXslt, { image: sampleImage, size: 50, opacity: 20, rotation: 0 });
      expect(result).toContain('uni-watermark-overlay');
    });

    it('should update existing watermark instead of duplicating (idempotent)', () => {
      const once = addWatermarkToXslt(baseXslt, { image: sampleImage, size: 50, opacity: 20, rotation: -15 });
      const twice = addWatermarkToXslt(once, { image: sampleImage, size: 80, opacity: 50, rotation: 45 });
      expect(twice).toContain('width:80%');
      expect(twice).toContain('opacity:0.50');
      expect(twice).toContain('rotate(45deg)');
      const matches = twice.match(/uni-watermark-overlay/g);
      expect(matches?.length).toBe(1);
    });

    it('should clamp size and opacity to safe ranges', () => {
      const result = addWatermarkToXslt(baseXslt, { image: sampleImage, size: 999, opacity: -20, rotation: -15 });
      expect(result).toContain('width:100%');
      expect(result).toContain('opacity:0.00');
    });
  });

  describe('removeWatermarkFromXslt', () => {
    const baseXslt = `<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/"><html><body><p>x</p></body></html></xsl:template>
</xsl:stylesheet>`;
    const sampleImage = 'data:image/png;base64,iVBORw0KGgoAAAANS';

    it('should return unchanged when no watermark exists', () => {
      expect(removeWatermarkFromXslt(baseXslt)).toBe(baseXslt);
    });

    it('should remove a watermark block added by addWatermarkToXslt', () => {
      const marked = addWatermarkToXslt(baseXslt, { image: sampleImage, size: 50, opacity: 20, rotation: -15 });
      expect(hasWatermarkInXslt(marked)).toBe(true);
      const cleaned = removeWatermarkFromXslt(marked);
      expect(hasWatermarkInXslt(cleaned)).toBe(false);
      expect(cleaned).toContain('<p>x</p>');
      expect(cleaned).toContain('</body>');
    });
  });

  describe('hasWatermarkInXslt', () => {
    it('should return false for empty and watermark-free XSLT', () => {
      expect(hasWatermarkInXslt('')).toBe(false);
      expect(hasWatermarkInXslt('<xsl:stylesheet/>')).toBe(false);
    });

    it('should return true after watermark added', () => {
      const baseXslt = '<html><body><p>hi</p></body></html>';
      const marked = addWatermarkToXslt(baseXslt, { image: 'data:image/png;base64,aaa', size: 50, opacity: 20, rotation: 0 });
      expect(hasWatermarkInXslt(marked)).toBe(true);
    });
  });
});

