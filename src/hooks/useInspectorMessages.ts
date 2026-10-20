// Inspector/designer message handling extracted from App.tsx.
//
// The preview iframe talks to the app through window.postMessage. Every
// message can mutate the XSLT, so the origin is verified before anything is
// applied (see utils/previewScripts.ts — `event.source === iframe.contentWindow`
// is NOT reliable for srcdoc+sandbox iframes).
//
// All state writers are passed in as one typed `deps` object: the handler
// touches ~20 setters, and a flat parameter list would be unreadable.
import { useEffect } from 'react';
import {
  findLineByXsltId,
  updateXsltTagAtLine,
  updateElementStyleInXsltById,
  updateElementTextInXsltById,
  updateXsltText,
  getXsltStyleValue,
} from '../utils/xsltTransformer';
import type { ElementDetails } from '../utils/xsltTransformer';
import { isTrustedPreviewMessage } from '../utils/previewScripts';
import { getSearchTerms } from '../utils/xsltCodeSearch';
import type { ImageInfo } from '../utils/xsltTransformer';

export interface InspectorMessageDeps {
  xsltContent: string;
  designerImages: ImageInfo[];
  selectedElementDetails: ElementDetails | null;
  updateXsltContent: (xslt: string) => void;
  setIframeLogs: (logs: string[] | ((prev: string[]) => string[])) => void;
  setInspectorStatus: (msg: string | null) => void;
  setPendingTransforms: (fn: (prev: Record<string, { x: number; y: number }>) => Record<string, { x: number; y: number }>) => void;
  setSelectedElementDetails: (d: ElementDetails | null) => void;
  setSelectedSelector: (sel: string) => void;
  setSelectedElementName: (name: string) => void;
  setSelectedLineNumber: (n: number) => void;
  setStyleMargin: (v: string) => void;
  setStylePadding: (v: string) => void;
  setStyleFontSize: (v: string) => void;
  setStyleColor: (v: string) => void;
  setStyleWidth: (v: string) => void;
  setStyleTextAlign: (v: string) => void;
  setStyleFontWeight: (v: string) => void;
  setStyleFontStyle: (v: string) => void;
  setStyleTextDecoration: (v: string) => void;
  setStyleWhiteSpace: (v: string) => void;
  setWidthUnit: (u: string) => void;
  jumpToXsltLine: (line: number) => void;
  revealXsltLine: (line: number) => void;
}

interface SearchableLine {
  findLineInCode: (code: string, searchTerms: string[]) => number;
}

/** Convert an rgb()/rgba() color to #hex for the HTML5 color input. */
function rgbToHex(rgbString: string): string {
  if (!rgbString) return '';
  if (rgbString.startsWith('#')) return rgbString;
  const match = rgbString.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (match) {
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    return '#' + [r, g, b].map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
  const matchRgba = rgbString.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/i);
  if (matchRgba) {
    const r = parseInt(matchRgba[1], 10);
    const g = parseInt(matchRgba[2], 10);
    const b = parseInt(matchRgba[3], 10);
    return '#' + [r, g, b].map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
  return '';
}

export function useInspectorMessages(deps: InspectorMessageDeps, lineFinder: SearchableLine) {
  const {
    xsltContent,
    designerImages,
    selectedElementDetails,
    updateXsltContent,
    setIframeLogs,
    setInspectorStatus,
    setPendingTransforms,
    setSelectedElementDetails,
    setSelectedSelector,
    setSelectedElementName,
    setSelectedLineNumber,
    setStyleMargin,
    setStylePadding,
    setStyleFontSize,
    setStyleColor,
    setStyleWidth,
    setStyleTextAlign,
    setStyleFontWeight,
    setStyleFontStyle,
    setStyleTextDecoration,
    setStyleWhiteSpace,
    setWidthUnit,
    jumpToXsltLine,
    revealXsltLine,
  } = deps;
  const { findLineInCode } = lineFinder;

  useEffect(() => {
    const handleInspectorMessage = (event: MessageEvent) => {
      if (!event.data) return;

      // SECURITY: messages on this channel mutate the XSLT directly
      // (xslt-text-edit, xslt-column-resized, image drag...), so the origin is
      // verified. `event.source === iframe.contentWindow` is NOT reliable for
      // srcdoc+sandbox iframes (see utils/previewScripts.ts).
      if (!isTrustedPreviewMessage(event.origin, window.location.origin)) return;

      const { source, text, className, tagName, id, original, current, targetTagName, targetSrc, targetHref, xsltId, imageIndex, isQrCode, colXsltId, colWidth, cellXsltId, tableXsltId, styles, message, lineno, colno, args } = event.data;

      if (source === 'iframe-error') {
        const errStr = `[Hata] ${message} (${lineno}:${colno})`;
        setIframeLogs((prev) => [...prev, errStr]);
        return;
      }

      if (source === 'iframe-console-error') {
        const errStr = `[Konsol Hatası] ${args.join(' ')}`;
        setIframeLogs((prev) => [...prev, errStr]);
        return;
      }

      // Case 0: Column resized via drag & drop in iframe preview
      if (source === 'xslt-column-resized') {
        const { xsltId: resizedId, xsltIds, widthPct } = event.data;
        if (resizedId && widthPct) {
          if (selectedElementDetails?.xsltId === resizedId) {
            setStyleWidth(widthPct);
            setWidthUnit('%');
          }
          let updated = xsltContent;
          const idsToUpdate = xsltIds && xsltIds.length > 0 ? xsltIds : [resizedId];
          idsToUpdate.forEach((id: string) => {
            const line = findLineByXsltId(updated, id);
            if (line > 0) {
              updated = updateXsltTagAtLine(updated, line, 'width', widthPct);
            } else {
              updated = updateElementStyleInXsltById(updated, id, 'width', widthPct);
            }
          });
          if (updated !== xsltContent) {
            updateXsltContent(updated);
            setInspectorStatus(`Sütun genişliği ayarlandı: ${widthPct}`);
            setTimeout(() => setInspectorStatus(null), 3000);
          }
        }
        return;
      }

      // Case: Image drag from Görsel Düzenleyici - only track pending, don't save yet
      if (source === 'xslt-image-drag') {
        const { imgSrc: dragSrc, imageIndex, x: newX, y: newY } = event.data;
        let key = dragSrc;
        if (typeof dragSrc === 'string' && dragSrc.startsWith('__qr__:')) {
          key = dragSrc;
        }
        if (imageIndex >= 0 && imageIndex < designerImages.length && designerImages[imageIndex].src) {
          key = designerImages[imageIndex].src;
        }
        if (key) {
          setPendingTransforms((prev) => ({ ...prev, [key]: { x: newX, y: newY } }));
        }
        return;
      }

      // Case 1: In-place text modifications (double clicked leaf texts)
      if (source === 'xslt-text-edit') {
        let updated = xsltContent;
        if (xsltId) {
          updated = updateElementTextInXsltById(xsltContent, xsltId, current);
        } else {
          updated = updateXsltText(xsltContent, original, current);
        }

        if (updated !== xsltContent) {
          updateXsltContent(updated);
          setInspectorStatus(`Metin güncellendi: "${original.substring(0, 10)}..." ➜ "${current.substring(0, 15)}..."`);
          setTimeout(() => setInspectorStatus(null), 3000);
        }
      }

      // Case 2: Click in Inspector mode (navigates code)
      else if (source === 'xslt-preview-inspector') {
        let line = 0;
        if (xsltId) {
          line = findLineByXsltId(xsltContent, xsltId);
        }
        if (line <= 0) {
          const searchTerms = getSearchTerms(id, className, text, tagName);
          if (searchTerms.length > 0) {
            line = findLineInCode(xsltContent, searchTerms);
          }
        }
        if (line >= 1) {
          jumpToXsltLine(line);
          setInspectorStatus(`Satır ${line} konumuna odaklanıldı (${text ? `"${text.substring(0, 12)}..."` : className || tagName})`);
          setTimeout(() => setInspectorStatus(null), 3000);
        }
        setSelectedElementDetails({ text, targetTagName, targetSrc, targetHref, xsltId, imageIndex, isQrCode, colXsltId, cellXsltId: cellXsltId || '', tableXsltId: tableXsltId || '' });
      }

      // Case 3: Click in Designer mode (focuses selector & loads style panel)
      else if (source === 'xslt-designer-click') {
        let sel = '';
        let elementName = '';

        if (id) {
          sel = `#${id}`;
          elementName = `${tagName.toUpperCase()}${sel}`;
        } else if (className && typeof className === 'string') {
          const classes = className.split(/\s+/).filter((c) => c.trim().length > 1 && c !== 'hover' && c !== 'uni-selected-element');
          if (classes.length > 0) {
            sel = `.${classes[0]}`;
            elementName = `${tagName.toUpperCase()}${sel}`;
          }
        }

        if (!sel) {
          sel = tagName.toLowerCase();
          elementName = tagName.toUpperCase();
        }

        setSelectedSelector(sel);
        setSelectedElementName(elementName);
        setSelectedElementDetails({ text, targetTagName, targetSrc, targetHref, xsltId, imageIndex, isQrCode, colXsltId, cellXsltId: cellXsltId || '', tableXsltId: tableXsltId || '' });

        // Extract current CSS property values (prefer computed styles, fall back
        // to the XSLT style block).
        if (styles) {
          setStyleMargin(styles.margin || '');
          setStylePadding(styles.padding || '');
          setStyleFontSize(styles.fontSize ? styles.fontSize.replace('px', '') : '');
          setStyleColor(rgbToHex(styles.color) || '#000000');

          const w = colWidth || styles.width || '';
          setStyleWidth(w);
          if (w.includes('%')) setWidthUnit('%');
          else if (w.includes('px')) setWidthUnit('px');
          else if (w === 'auto') setWidthUnit('auto');
          else setWidthUnit('%');

          setStyleTextAlign(styles.textAlign || 'left');
          setStyleFontWeight(styles.fontWeight || 'normal');
          setStyleFontStyle(styles.fontStyle || 'normal');
          setStyleTextDecoration(styles.textDecoration || 'none');
          setStyleWhiteSpace(styles.whiteSpace || 'normal');
        } else {
          setStyleMargin(getXsltStyleValue(xsltContent, sel, 'margin') || getXsltStyleValue(xsltContent, sel, 'margin-top') || '');
          setStylePadding(getXsltStyleValue(xsltContent, sel, 'padding') || getXsltStyleValue(xsltContent, sel, 'padding-top') || '');
          setStyleFontSize(getXsltStyleValue(xsltContent, sel, 'font-size') || '');
          setStyleColor(getXsltStyleValue(xsltContent, sel, 'color') || '');

          const w = getXsltStyleValue(xsltContent, sel, 'width') || '';
          setStyleWidth(w);
          if (w.includes('%')) setWidthUnit('%');
          else if (w.includes('px')) setWidthUnit('px');
          else if (w === 'auto') setWidthUnit('auto');
          else setWidthUnit('%');

          setStyleTextAlign(getXsltStyleValue(xsltContent, sel, 'text-align') || '');
          setStyleFontWeight(getXsltStyleValue(xsltContent, sel, 'font-weight') || '');
          setStyleFontStyle(getXsltStyleValue(xsltContent, sel, 'font-style') || '');
          setStyleTextDecoration(getXsltStyleValue(xsltContent, sel, 'text-decoration') || '');
          setStyleWhiteSpace(getXsltStyleValue(xsltContent, sel, 'white-space') || 'normal');
        }

        // Scroll the code editor to the element line silently (do NOT switch tab).
        let line = 0;
        if (xsltId) {
          line = findLineByXsltId(xsltContent, xsltId);
        }
        if (line <= 0) {
          const searchTerms = getSearchTerms(id, className, text, tagName);
          if (searchTerms.length > 0) {
            line = findLineInCode(xsltContent, searchTerms);
          }
        }
        if (line > 1) {
          setSelectedLineNumber(line);
          revealXsltLine(line);
        } else {
          setSelectedLineNumber(0);
        }
      }
    };

    window.addEventListener('message', handleInspectorMessage);
    return () => window.removeEventListener('message', handleInspectorMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xsltContent, designerImages, selectedElementDetails?.xsltId, updateXsltContent, setIframeLogs, jumpToXsltLine, setInspectorStatus, findLineInCode, revealXsltLine]);
}
