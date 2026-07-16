import { describe, it, expect } from 'vitest';
import {
  transformXmlWithXslt,
  extractEmbeddedXslt,
  removeEmbeddedXslt,
  addElementToXslt,
  removeElementFromXslt,
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
});

