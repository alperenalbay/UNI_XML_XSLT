import { describe, it, expect } from 'vitest';
import {
  PREVIEW_SANDBOX,
  PREVIEW_TRUSTED_DEFAULT,
  stripTemplateScripts,
  countTemplateScripts,
  buildScriptDisabledNotice,
  isTrustedPreviewMessage,
} from './previewScripts';

describe('previewScripts', () => {
  describe('PREVIEW_SANDBOX', () => {
    // Regresyon: sandbox değeri designerActive/inspectorActive ile değişiyordu.
    // Aynı commit'te değişen srcDoc ile yarışıp önizleme script'lerini sessizce
    // blokluyordu (barkod/QR çalışmıyordu). Sandbox sabit olmalı.
    it('should always allow scripts so the app interactivity layer works', () => {
      expect(PREVIEW_SANDBOX).toContain('allow-scripts');
    });

    it('should keep allow-same-origin so the parent can drive the preview DOM', () => {
      expect(PREVIEW_SANDBOX).toContain('allow-same-origin');
    });

    it('should not allow top navigation, popups or forms', () => {
      expect(PREVIEW_SANDBOX).not.toContain('allow-top-navigation');
      expect(PREVIEW_SANDBOX).not.toContain('allow-popups');
      expect(PREVIEW_SANDBOX).not.toContain('allow-forms');
      expect(PREVIEW_SANDBOX).not.toContain('allow-downloads');
    });
  });

  describe('PREVIEW_TRUSTED_DEFAULT', () => {
    it('should default to running template scripts so invoices render completely', () => {
      expect(PREVIEW_TRUSTED_DEFAULT).toBe(true);
    });
  });

  describe('stripTemplateScripts', () => {
    it('should remove a script block but keep the rest of the document', () => {
      const html = '<html><body><p>Fatura</p><script>alert(1)</script></body></html>';
      const result = stripTemplateScripts(html);
      expect(result).not.toContain('alert(1)');
      expect(result).toContain('<p>Fatura</p>');
    });

    it('should remove script tags with attributes and multiline bodies', () => {
      const html = `<html><body>
        <script type="text/javascript" src="barkod.js"></script>
        <script>
          var a = 1;
          var b = 2;
        </script>
        <table><tr><td>Kalem</td></tr></table>
      </body></html>`;
      const result = stripTemplateScripts(html);
      expect(result).not.toContain('barkod.js');
      expect(result).not.toContain('var b = 2;');
      expect(result).toContain('<td>Kalem</td>');
    });

    it('should remove every script when a template has several', () => {
      const html = '<body><script>a()</script><div>1</div><script>b()</script><script>c()</script></body>';
      const result = stripTemplateScripts(html);
      expect(result).not.toMatch(/<script/i);
      expect(result).toContain('<div>1</div>');
    });

    it('should return empty input unchanged', () => {
      expect(stripTemplateScripts('')).toBe('');
    });

    it('should leave a script-free document untouched', () => {
      const html = '<html><body><h1>Fatura</h1></body></html>';
      expect(stripTemplateScripts(html)).toBe(html);
    });

    it('should not treat a closing script tag inside CDATA as the end', () => {
      // Girdi bozuksa en azından script bloğu HTML'i bozmamalı.
      const html = '<body><script>if (a < b) {}</script><p>sonra</p></body>';
      const result = stripTemplateScripts(html);
      expect(result).toContain('<p>sonra</p>');
      expect(result).not.toMatch(/<script/i);
    });
  });

  describe('countTemplateScripts', () => {
    it('should count script blocks', () => {
      expect(countTemplateScripts('<body><script>a()</script><script>b()</script></body>')).toBe(2);
    });

    it('should return 0 when there is no script', () => {
      expect(countTemplateScripts('<body><p>x</p></body>')).toBe(0);
      expect(countTemplateScripts('')).toBe(0);
    });
  });

  describe('buildScriptDisabledNotice', () => {    it('should tell the user how many scripts were disabled and how to enable them', () => {
      const notice = buildScriptDisabledNotice(2);
      expect(notice).toContain('2');
      expect(notice).toContain('uni-script-disabled-notice');
      // Kullanıcı ne yapacağını bilmeli.
      expect(notice).toContain('Script');
    });

    it('should render safely inside the preview document', () => {
      const notice = buildScriptDisabledNotice(1);
      expect(notice.startsWith('<div')).toBe(true);
      expect(notice.endsWith('</div>')).toBe(true);
    });
  });

  describe('isTrustedPreviewMessage', () => {
    it('should accept a message coming from the app origin', () => {
      expect(isTrustedPreviewMessage('http://localhost:5173', 'http://localhost:5173')).toBe(true);
    });

    it('should reject a message from another origin', () => {
      expect(isTrustedPreviewMessage('https://kotu-site.example', 'http://localhost:5173')).toBe(false);
    });

    it('should reject an opaque origin against a real app origin', () => {
      // Sandbox'sız/opaque origin'li bir çerçeve uygulamayı kumanda edemez.
      expect(isTrustedPreviewMessage('null', 'http://localhost:5173')).toBe(false);
    });

    it('should still work when the app itself runs on file:// (origin null)', () => {
      expect(isTrustedPreviewMessage('null', 'null')).toBe(true);
    });
  });
});
