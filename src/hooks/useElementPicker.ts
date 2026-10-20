// Element picker (list-based element selection) extracted from App.tsx.
//
// Lets the user pick a preview element from a searchable list instead of
// clicking inside the iframe — the list is rebuilt from the live preview DOM.
import { useCallback, useEffect, useState } from 'react';

export interface ElementPickerOption {
  id: string;
  label: string;
}

export interface UseElementPickerApi {
  elementPickerOptions: ElementPickerOption[];
  elementPickerFilter: string;
  setElementPickerFilter: (v: string) => void;
  refreshElementPickerOptions: () => void;
}

/** Structural wrappers whose innerText equals the whole page — they would
 *  drown the list. */
const SKIPPED_TAGS = ['html', 'body', 'head', 'title', 'script', 'style', 'meta', 'link'];

export function useElementPicker(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  /** Active editor tab; the list is only refreshed while the designer is open */
  editorActiveTab: string,
  /** Changes whenever the preview is re-rendered (e.g. after a transform) */
  previewRevision: string,
): UseElementPickerApi {
  const [elementPickerOptions, setElementPickerOptions] = useState<ElementPickerOption[]>([]);
  const [elementPickerFilter, setElementPickerFilter] = useState<string>('');

  const refreshElementPickerOptions = useCallback(() => {
    try {
      const innerDoc = iframeRef.current?.contentDocument;
      if (!innerDoc) {
        setElementPickerOptions([]);
        return;
      }
      const list: ElementPickerOption[] = [];
      innerDoc.querySelectorAll<HTMLElement>('[data-xslt-id]').forEach((el) => {
        const id = el.getAttribute('data-xslt-id');
        if (!id) return;
        const tag = el.tagName.toLowerCase();
        if (SKIPPED_TAGS.includes(tag)) return;
        const text = (el.innerText || '').trim().replace(/\s+/g, ' ');
        // Keep elements that carry text, plus images and table cells (those
        // have their own panel controls).
        if (text.length === 0 && tag !== 'img' && tag !== 'td' && tag !== 'th') return;
        const src = el.getAttribute('src');
        const srcNote = src ? (src.startsWith('data:') ? 'görsel' : src.slice(0, 28)) : 'boş';
        const label = text
          ? `${tag} · ${text.slice(0, 48)}${text.length > 48 ? '…' : ''}`
          : `${tag} · ${srcNote}`;
        list.push({ id, label });
      });
      setElementPickerOptions(list.slice(0, 500));
    } catch {
      setElementPickerOptions([]);
    }
  }, [iframeRef]);

  // Keep the picker list in sync with the latest transformed preview. The
  // transform is async, so refresh shortly after the content changes.
  useEffect(() => {
    if (editorActiveTab !== 'designer') return;
    const t = setTimeout(() => refreshElementPickerOptions(), 350);
    return () => clearTimeout(t);
  }, [editorActiveTab, previewRevision, refreshElementPickerOptions]);

  return {
    elementPickerOptions,
    elementPickerFilter,
    setElementPickerFilter,
    refreshElementPickerOptions,
  };
}
