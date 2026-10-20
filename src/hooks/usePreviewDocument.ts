// Preview document (srcDoc) construction extracted from App.tsx.
//
// Builds the HTML that is handed to the preview iframe via `srcDoc`:
//   - error page when the transform failed
//   - script stripping when the user turned template scripts off
//   - print stylesheet
//   - inspector / designer interaction styles + column-resize script
//   - image / QR tagging so the designer can address them
//   - transient watermark overlay (preview only, not written to the XSLT)
import { useMemo } from 'react';
import {
  stripTemplateScripts,
  countTemplateScripts,
  buildScriptDisabledNotice,
} from '../utils/previewScripts';
import { COLUMN_RESIZE_SCRIPT } from '../utils/columnResizeScript';
import { IMAGE_DRAG_SCRIPT } from '../utils/imageDragScript';

export interface PreviewDocumentOptions {
  htmlOutput: string;
  errorMsg?: string;
  /** Preview stylesheet width (e.g. "210mm") taken from the template's @page */
  sheetWidthCss: string;
  /** Preview stylesheet min-height; "0" means "auto" */
  sheetMinHeight: string;
  inspectorActive: boolean;
  designerActive: boolean;
  showTableBorders: boolean;
  editorActiveTab: string;
  allowPreviewScripts: boolean;
  /** When false, the template's own <script> blocks are removed from the preview */
  previewTrustedMode: boolean;
  watermarkVisible: boolean;
  watermarkImage: string;
  watermarkSize: number;
  watermarkOpacity: number;
  watermarkRotation: number;
}

const ERROR_PAGE = (errorMsg: string) => `
        <html>
          <head>
            <style>
              body { font-family: system-ui, sans-serif; padding: 25px; color: #ef4444; background: #fef2f2; }
              pre { background: #fee2e2; padding: 15px; border-radius: 6px; border: 1px solid #fca5a5; overflow-x: auto; font-size: 13px; white-space: pre-wrap; word-wrap: break-word; }
              h3 { margin-top: 0; }
            </style>
          </head>
          <body>
            <h3>⚠️ Tasarım Dönüştürme Hatası</h3>
            <p>XML ve XSLT eşleştirilirken bir hata oluştu:</p>
            <pre>${errorMsg.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          </body>
        </html>
      `;

const EMPTY_PREVIEW = '<p style="padding: 20px; color: #64748b; font-family: sans-serif; text-align: center;">Dönüştürülmüş fatura görüntüsü burada görüntülenecektir.</p>';

const PRINT_STYLES = `
        @media print {
          html, body {
            background: #ffffff !important;
            background-color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: auto !important;
            height: auto !important;
            min-height: 0 !important;
            box-shadow: none !important;
            transform: none !important;
          }
          .uni-selected-element {
            outline: none !important;
            box-shadow: none !important;
            border-color: transparent !important;
          }
        }
      `;

function injectIntoDocument(html: string, block: string): string {
  if (html.includes('</head>')) return html.replace('</head>', `${block}</head>`);
  if (html.includes('</body>')) return html.replace('</body>', `${block}</body>`);
  return html + block;
}

export function usePreviewDocument(opts: PreviewDocumentOptions): string {
  const {
    htmlOutput,
    errorMsg,
    sheetWidthCss,
    sheetMinHeight,
    inspectorActive,
    designerActive,
    showTableBorders,
    editorActiveTab,
    allowPreviewScripts,
    previewTrustedMode,
    watermarkVisible,
    watermarkImage,
    watermarkSize,
    watermarkOpacity,
    watermarkRotation,
  } = opts;

  return useMemo(() => {
    if (errorMsg) {
      return ERROR_PAGE(errorMsg);
    }

    let rawHtml = htmlOutput;
    // If the preview is empty but a watermark image is loaded, give the watermark
    // a minimal HTML frame so the user can still see it before any XSLT
    // transformation has produced output.
    if (!rawHtml && watermarkVisible && watermarkImage) {
      rawHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8" /><title>Filigran Önizleme</title></head><body></body></html>`;
    }

    if (rawHtml) {
      // When trusted mode is OFF the template's own scripts are stripped from
      // the preview. The sandbox always keeps allow-scripts enabled (the
      // application's own interaction scripts need it), so this is what makes
      // script execution a user choice. The notice tells the user how many
      // scripts were removed and why.
      if (!previewTrustedMode) {
        const scriptCount = countTemplateScripts(rawHtml);
        if (scriptCount > 0) {
          rawHtml = stripTemplateScripts(rawHtml);
          rawHtml = injectIntoDocument(rawHtml, buildScriptDisabledNotice(scriptCount));
        }
      }

      rawHtml = injectIntoDocument(rawHtml, `<style id="uni-print-style">${PRINT_STYLES}</style>`);

      let styleRules = '';
      let scriptCode = '';
      // Page dimensions come from the template's own @page declaration (see
      // sheetSize.ts); assuming A4 broke 80mm receipts in designer mode.
      const sheetBodyCss = `
            width: ${sheetWidthCss} !important;
            min-height: ${sheetMinHeight} !important;
            margin: 24px auto !important;
            padding: 10px !important;
            background-color: #ffffff !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4) !important;
            box-sizing: border-box !important;
      `;
      if (inspectorActive) {
        styleRules = `
          body {${sheetBodyCss}}
          table, div {
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          *:not(html):not(body):hover {
            outline: 2px dashed #3b82f6 !important;
            outline-offset: -2px !important;
            cursor: pointer !important;
          }
        `;
      } else if (designerActive) {
        styleRules = `
          body {${sheetBodyCss}}
          table, div {
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          *:not(html):not(body):hover {
            outline: 2px dashed #a855f7 !important;
            outline-offset: -2px !important;
            cursor: pointer !important;
          }
          .uni-selected-element {
            outline: 3px solid #a855f7 !important;
            outline-offset: -1px !important;
            box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.2), 0 0 12px rgba(168, 85, 247, 0.6) !important;
            animation: selectPulse 2s infinite ease-in-out !important;
          }
          @keyframes selectPulse {
            0% { box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2), 0 0 6px rgba(168, 85, 247, 0.4) !important; }
            50% { box-shadow: 0 0 0 6px rgba(168, 85, 247, 0.3), 0 0 16px rgba(168, 85, 247, 0.8) !important; }
            100% { box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2), 0 0 6px rgba(168, 85, 247, 0.4) !important; }
          }
          .uni-col-resizer {
            position: absolute;
            top: 0;
            right: 0;
            width: 6px;
            cursor: col-resize;
            user-select: none;
            height: 100%;
            z-index: 1000;
            transition: background-color 0.15s;
          }
          .uni-col-resizer:hover, .uni-col-resizer.resizing {
            background-color: #a855f7 !important;
            width: 6px !important;
          }
          ${showTableBorders ? `
            table, tr, td, th {
              outline: 1px dashed rgba(168, 85, 247, 0.4) !important;
              outline-offset: -1px !important;
            }
            .uni-col-resizer {
              background-color: rgba(168, 85, 247, 0.35) !important;
              width: 4px !important;
            }
          ` : ''}
        `;

        scriptCode = COLUMN_RESIZE_SCRIPT;
      }
      if (styleRules) {
        const inspectorStyle = `<style id="uni-interactivity-style">${styleRules}</style>`;
        rawHtml = injectIntoDocument(rawHtml, inspectorStyle);
      }
      if (allowPreviewScripts && scriptCode) {
        rawHtml = injectIntoDocument(rawHtml, scriptCode);
      }
    }

    // Ensure body is relatively positioned for drag mode
    if (editorActiveTab === 'imag-editor' && rawHtml) {
      rawHtml = rawHtml.replace(/<body\b[^>]*>/i, (m) => {
        if (m.includes('style=')) {
          return m.replace(/style\s*=\s*["']([^"']*)["']/i, (_, s) => `style="${s}; position: relative;"`);
        }
        return m.replace('>', ' style="position: relative;">');
      });
    }

    // Add data-image-index to all img tags for robust drag tracking & removal
    if ((editorActiveTab === 'imag-editor' || designerActive) && rawHtml) {
      let imgCounter = 0;
      rawHtml = rawHtml.replace(/<img\b/gi, () => `<img data-image-index="${imgCounter++}"`);
      // Also tag <div id="qrcode"> and similar QR containers so they can be
      // selected/removed. QR codes rendered via JS into a div; marking the
      // container lets the designer target it.
      let qrCounter = 0;
      rawHtml = rawHtml.replace(/<div\b[^>]*\bid=["']?qrcode["']?[^>]*>/gi, (m) => `${m.replace(/>$/, ' data-qr-index="' + (qrCounter++) + '">')}`);
      // Some samples render QR into <canvas>; tag those too.
      let canvasCounter = 0;
      rawHtml = rawHtml.replace(/<canvas\b/gi, () => `<canvas data-canvas-index="${canvasCounter++}"`);
    }

    // Image drag script for visual editor mode
    if (editorActiveTab === 'imag-editor' && allowPreviewScripts) {
      rawHtml = injectIntoDocument(rawHtml, IMAGE_DRAG_SCRIPT);
    }

    // Live preview watermark overlay (in-memory only — not written to the XSLT
    // unless the user clicks "XSLT'ye Kaydet")
    if (watermarkVisible && watermarkImage) {
      const safeSize = Math.max(1, Math.min(100, Math.round(watermarkSize)));
      const safeOpacity = Math.max(0, Math.min(100, Math.round(watermarkOpacity)));
      const safeRotation = Math.round(watermarkRotation);
      // Single absolute overlay positioned over the body (which is
      // `position:relative` + `transform:scale` in handleIframeLoad, making it
      // the containing block). Concrete dimensions ensure the overlay covers
      // the whole page. `z-index:9999` + low opacity + pointer-events:none +
      // mix-blend-mode:multiply is the standard e-invoice watermark technique:
      // the watermark sits visually on top but is semi-transparent so the
      // underlying invoice content remains readable, and white/light
      // backgrounds effectively "show through" it.
      // On print, multiply + transparent areas won't print as solid blocks
      // (and the print stylesheet removes the scale transform), so the
      // watermark stays subtle on physical output too.
      // Page dimensions come from the template's declaration; assuming A4
      // pushed the watermark off the page for 80mm receipts.
      const overlayStyle = [
        'position:absolute',
        'top:0',
        'left:0',
        `width:${sheetWidthCss}`,
        `height:${sheetMinHeight === '0' ? '100%' : sheetMinHeight}`,
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'pointer-events:none',
        'z-index:9999',
        'mix-blend-mode:multiply',
        'overflow:hidden',
      ].join('; ');
      const imgStyle = [
        `width:${safeSize}%`,
        'height:auto',
        'max-height:100%',
        'object-fit:contain',
        `opacity:${(safeOpacity / 100).toFixed(2)}`,
        `transform:rotate(${safeRotation}deg)`,
        'user-select:none',
      ].join('; ');
      const previewWatermarkBlock = `<div class="uni-watermark-preview-overlay" style="${overlayStyle}"><img src="${watermarkImage}" alt="" style="${imgStyle}" /></div>`;
      // Mark as transient preview-only overlay (distinct from the saved
      // uni-watermark-overlay).
      if (rawHtml.includes('<body')) {
        rawHtml = rawHtml.replace(/<body\b[^>]*>/i, (m) => `${m}\n${previewWatermarkBlock}`);
      } else {
        rawHtml = previewWatermarkBlock + rawHtml;
      }
    }

    return rawHtml || EMPTY_PREVIEW;
  }, [htmlOutput, errorMsg, inspectorActive, designerActive, showTableBorders, watermarkVisible, watermarkImage, watermarkSize, watermarkOpacity, watermarkRotation, editorActiveTab, allowPreviewScripts, previewTrustedMode, sheetWidthCss, sheetMinHeight]);
}
