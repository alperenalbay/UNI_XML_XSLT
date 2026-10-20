// Inline text-edit helper (contentEditable flow) extracted from App.tsx.
import { useCallback } from 'react';
import type { ElementDetails } from '../utils/xsltTransformer';

export interface UseInlineTextEditApi {
  handleEditTextElement: () => void;
}

export function useInlineTextEdit(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  selectedElementDetails: ElementDetails | null,
  selectedSelector: string,
  setInspectorStatus: (msg: string | null) => void,
): UseInlineTextEditApi {
  const handleEditTextElement = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!innerDoc) return;

    let selectedEl = innerDoc.querySelector('.uni-selected-element') as HTMLElement | null;
    if (!selectedEl && selectedElementDetails?.xsltId) {
      selectedEl = innerDoc.querySelector(`[data-xslt-id="${selectedElementDetails.xsltId}"]`) as HTMLElement | null;
    }
    if (!selectedEl && selectedSelector) {
      try {
        selectedEl = innerDoc.querySelector(selectedSelector) as HTMLElement | null;
      } catch (e) {
        console.warn('Invalid selector query', e);
      }
    }

    if (selectedEl) {
      const originalText = selectedEl.innerText || '';
      selectedEl.setAttribute('data-original-text', originalText);
      selectedEl.setAttribute('data-xslt-id-editable', selectedEl.getAttribute('data-xslt-id') || '');

      selectedEl.contentEditable = 'true';
      selectedEl.focus();

      const range = innerDoc.createRange();
      range.selectNodeContents(selectedEl);
      const selection = iframe.contentWindow?.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }

      const handleEnter = (ev: KeyboardEvent) => {
        if (ev.key === 'Enter' && !ev.shiftKey) {
          ev.preventDefault();
          selectedEl!.blur();
        }
      };
      selectedEl.addEventListener('keydown', handleEnter, { once: true });

      setInspectorStatus('Metin düzenleniyor... Çıkmak için Enter\'a basın veya dışarıya tıklayın.');
      setTimeout(() => setInspectorStatus(null), 4000);
    } else {
      setInspectorStatus('Düzenlemek için lütfen önce faturadan bir metin alanı seçin.');
      setTimeout(() => setInspectorStatus(null), 3000);
    }
  }, [iframeRef, selectedElementDetails, selectedSelector, setInspectorStatus]);

  return { handleEditTextElement };
}
