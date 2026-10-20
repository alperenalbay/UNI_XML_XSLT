// Preview iframe wiring extracted from App.tsx.
//
// Everything that happens INSIDE the preview document lives here: error/console
// capture, sheet styling, selection restore, and the click / double-click /
// focus-out listeners that report back to the app via window.parent.postMessage.
//
// The app side of that protocol lives in useInspectorMessages.
import type { ElementDetails } from '../utils/xsltTransformer';

export interface PreviewIframeOptions {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  /** Applies the "paper page" look (background, shadow, scale) to the iframe body */
  applySheetStyle: (doc: Document, scale: number) => void;
  zoomPercent: number;
  designerActive: boolean;
  inspectorActive: boolean;
  /** Current transform error, if any (listeners are skipped while it is set) */
  errorMsg?: string;
  selectedSelector: string;
  selectedElementDetails: ElementDetails | null;
  setIframeLogs: (logs: string[] | ((prev: string[]) => string[])) => void;
}

/** Reads the computed/ inline style values the style panel works with. */
function readElementStyles(target: HTMLElement) {
  const win = target.ownerDocument.defaultView;
  const computed = win ? win.getComputedStyle(target) : ({} as CSSStyleDeclaration);
  return {
    margin: target.style.margin || target.style.marginTop || computed.margin || computed.marginTop || '',
    padding: target.style.padding || target.style.paddingTop || computed.padding || computed.paddingTop || '',
    fontSize: target.style.fontSize || computed.fontSize || '',
    color: target.style.color || computed.color || '',
    width: target.style.width || computed.width || '',
    textAlign: target.style.textAlign || computed.textAlign || '',
    fontWeight: target.style.fontWeight || computed.fontWeight || '',
    fontStyle: target.style.fontStyle || computed.fontStyle || '',
    textDecoration: target.style.textDecoration || computed.textDecoration || '',
    whiteSpace: target.style.whiteSpace || computed.whiteSpace || '',
  };
}

/**
 * Finds the <col> element that owns the clicked cell, so the width of a
 * column can be edited instead of the width of one cell.
 */
function resolveColumnInfo(target: HTMLElement) {
  let colXsltId = '';
  let colWidth = '';
  const cell = target.closest('td, th');
  if (!cell) return { colXsltId, colWidth };

  const cellIndex = Array.prototype.indexOf.call(cell.parentNode?.children || [], cell);
  const table = cell.closest('table');
  if (table && cellIndex !== -1) {
    const colGroup = table.querySelector('colgroup');
    if (colGroup) {
      const cols = colGroup.querySelectorAll('col');
      if (cols && cols[cellIndex]) {
        colXsltId = cols[cellIndex].getAttribute('data-xslt-id') || '';
        const win = table.ownerDocument.defaultView;
        const colComputed = win ? win.getComputedStyle(cols[cellIndex]) : ({} as CSSStyleDeclaration);
        colWidth = cols[cellIndex].style.width || cols[cellIndex].getAttribute('width') || colComputed.width || '';
      }
    }
  }
  return { colXsltId, colWidth };
}

export function usePreviewIframe(opts: PreviewIframeOptions) {
  const {
    iframeRef,
    applySheetStyle,
    zoomPercent,
    designerActive,
    inspectorActive,
    errorMsg,
    selectedSelector,
    selectedElementDetails,
    setIframeLogs,
  } = opts;

  const handleIframeLoad = () => {
    if (!iframeRef.current) return;
    const innerDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (!innerDoc) return;

    const iframeWindow = iframeRef.current.contentWindow;
    if (iframeWindow) {
      const win = iframeWindow as unknown as Window & { onerror: unknown; console: Console };
      setIframeLogs([]);

      try {
        iframeWindow.addEventListener('message', (event) => {
          if (event.data && event.data.action === 'select-element-by-id') {
            const el = innerDoc.querySelector(`[data-xslt-id="${event.data.xsltId}"]`) as HTMLElement;
            if (el) {
              el.click();
            }
          }
        });
      } catch (e) {
        console.warn('Could not register window message listener inside iframe', e);
      }

      win.onerror = (message: string | Event, _source?: string, lineno?: number, colno?: number) => {
        const errStr = `[Hata] ${message} (${lineno}:${colno})`;
        setIframeLogs((prev) => [...prev, errStr]);
        return false;
      };

      try {
        if (win.console && win.console.error) {
          const originalConsoleError = win.console.error;
          win.console.error = (...args: unknown[]) => {
            const errStr = `[Konsol Hatası] ${args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')}`;
            setIframeLogs((prev) => [...prev, errStr]);
            originalConsoleError.apply(win.console, args);
          };
        }
      } catch (e) {
        console.warn('Could not patch console.error', e);
      }
    }

    // Apply document styling & scale
    applySheetStyle(innerDoc, zoomPercent / 100);
    if (designerActive && innerDoc.body) {
      // Positioning context for drag & drop.
      innerDoc.body.style.position = 'relative';
    }

    const htmlEl = innerDoc.documentElement;
    if (htmlEl) {
      htmlEl.style.backgroundColor = '#0b0f19';
      htmlEl.style.overflowY = 'auto';
      htmlEl.style.height = '100%';
      htmlEl.style.padding = '0';
      htmlEl.style.margin = '0';
    }

    // Restore selection styling if a selector is active
    if (designerActive && (selectedSelector || selectedElementDetails?.xsltId)) {
      let elToSelect: HTMLElement | null = null;

      // 1. Try to find by XSLT ID first (most specific/accurate)
      if (selectedElementDetails?.xsltId) {
        elToSelect = innerDoc.querySelector(`[data-xslt-id="${selectedElementDetails.xsltId}"]`) as HTMLElement;
      }

      // 2. Fallback to CSS selector
      if (!elToSelect && selectedSelector) {
        try {
          elToSelect = innerDoc.querySelector(selectedSelector) as HTMLElement;
        } catch (e) {
          console.warn('Could not query selector', selectedSelector, e);
        }
      }

      if (elToSelect) {
        elToSelect.classList.add('uni-selected-element');
      }
    }

    // Attach listeners if inspector or designer is active
    if (!errorMsg && (inspectorActive || designerActive)) {
      // Click selection listener
      innerDoc.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const target = e.target as HTMLElement;
        if (!target) return;

        let foundClass = '';
        let foundTagName = target.tagName.toLowerCase();
        const foundId = target.id;

        if (target.className && typeof target.className === 'string') {
          const cleaned = target.className.replace('uni-selected-element', '').trim();
          if (cleaned) {
            foundClass = target.className;
          }
        }

        innerDoc.querySelectorAll('.uni-selected-element').forEach((el) => {
          el.classList.remove('uni-selected-element');
        });

        if (designerActive) {
          target.classList.add('uni-selected-element');
        }

        const text = target.innerText?.trim() || '';
        const styles = readElementStyles(target);
        const { colXsltId, colWidth } = resolveColumnInfo(target);

        const cell = target.closest('td, th');
        const cellXsltId = cell ? cell.getAttribute('data-xslt-id') || '' : '';
        const parentTable = cell ? cell.closest('table') : target.closest('table');
        const tableXsltId = parentTable ? parentTable.getAttribute('data-xslt-id') || '' : '';

        // For images, send imageIndex (data-image-index) for reliable removal.
        // Also treat QR code container (<div id="qrcode">) and its inner
        // <img>/<canvas> as image-like elements.
        let imageIndex: number | null = null;
        let isQrCode = false;
        if (foundTagName === 'img') {
          const rawIdx = target.getAttribute('data-image-index');
          if (rawIdx !== null) imageIndex = parseInt(rawIdx, 10);
        }
        // QR code detection: the element itself is the #qrcode container OR it
        // is a child of #qrcode.
        const qrContainer = target.id === 'qrcode' ? target : (target.closest('#qrcode') as HTMLElement | null);
        if (qrContainer) {
          isQrCode = true;
          // Use the qrcode container as the actual target for selection/removal
          // (we still report targetTagName as 'img'/'canvas' for the
          // descendant, but the qrIndex lets removeElementFromXslt find the
          // container).
          const qrIdx = qrContainer.getAttribute('data-qr-index');
          if (qrIdx !== null) {
            imageIndex = parseInt(qrIdx, 10);
          }
          // Override targetTagName so removeElementFromXslt treats it like a
          // removable asset block.
          foundTagName = 'div';
        }

        window.parent.postMessage({
          source: designerActive ? 'xslt-designer-click' : 'xslt-preview-inspector',
          text,
          className: foundClass || (isQrCode ? 'uni-qr-code' : target.className) || '',
          tagName: foundTagName,
          id: foundId || (isQrCode ? 'qrcode' : target.id) || '',
          targetTagName: isQrCode ? 'div' : target.tagName.toLowerCase(),
          targetSrc: target.getAttribute('src') || '',
          targetHref: target.getAttribute('href') || '',
          xsltId: (isQrCode && qrContainer ? qrContainer : target).getAttribute('data-xslt-id') || '',
          imageIndex,
          isQrCode,
          colXsltId,
          colWidth,
          cellXsltId,
          tableXsltId,
          styles,
        }, '*');
      });

      // Double-click inline text editor listener
      innerDoc.addEventListener('dblclick', (e) => {
        const target = e.target as HTMLElement;
        if (target && target.nodeType === Node.ELEMENT_NODE) {
          if (target.tagName === 'BODY' || target.tagName === 'HTML') return;
          const textVal = (target.innerText || '').trim();
          if (!textVal) return;
          target.contentEditable = 'true';
          target.focus();
          target.setAttribute('data-original-text', target.innerText || '');
          target.setAttribute('data-xslt-id-editable', target.getAttribute('data-xslt-id') || '');
          const handleEnter = (ev: KeyboardEvent) => {
            if (ev.key === 'Enter' && !ev.shiftKey) {
              ev.preventDefault();
              target.blur();
            }
          };
          target.addEventListener('keydown', handleEnter, { once: true });
        }
      });

      // Focusout inline edit save listener
      innerDoc.addEventListener('focusout', (e) => {
        const target = e.target as HTMLElement;
        if (target && target.contentEditable === 'true') {
          target.contentEditable = 'false';
          const original = target.getAttribute('data-original-text') || '';
          const current = target.innerText || '';
          const xsltId = target.getAttribute('data-xslt-id') || target.getAttribute('data-xslt-id-editable') || '';

          if (original.trim() !== current.trim()) {
            window.parent.postMessage({
              source: 'xslt-text-edit',
              original: original.trim(),
              current: current.trim(),
              xsltId,
            }, '*');
          }
        }
      });
    }
  };

  return { handleIframeLoad };
}
