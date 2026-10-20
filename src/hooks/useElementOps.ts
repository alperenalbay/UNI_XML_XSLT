// Element add/remove helpers extracted from App.tsx.
import { useCallback } from 'react';
import { addElementToXslt, removeElementFromXslt } from '../utils/xsltTransformer';
import type { ElementDetails } from '../utils/xsltTransformer';

export interface UseElementOpsApi {
  handleAddTextElement: (parentSelector: string, details?: ElementDetails | null) => void;
  handleRemoveElement: (selector: string, details?: ElementDetails | null) => void;
}

export function useElementOps(
  xsltContent: string,
  updateXsltContent: (xslt: string) => void,
  setInspectorStatus: (msg: string | null) => void,
  setSelectedSelector: (sel: string) => void,
  setSelectedElementDetails: (d: ElementDetails | null) => void,
  setSelectedLineNumber: (n: number) => void,
): UseElementOpsApi {
  const handleAddTextElement = useCallback((parentSelector: string, details?: ElementDetails | null) => {
    const updated = addElementToXslt(xsltContent, parentSelector, 'Yeni Metin Alanı (Düzenlemek için çift tıklayın)', details ?? undefined);
    if (updated !== xsltContent) {
      updateXsltContent(updated);
      setInspectorStatus('Boş alana yeni metin kutusu eklendi.');
      setTimeout(() => setInspectorStatus(null), 3000);
    }
  }, [xsltContent, updateXsltContent, setInspectorStatus]);

  const handleRemoveElement = useCallback((selector: string, details?: ElementDetails | null) => {
    if (!selector && !details?.xsltId && !details?.tableXsltId) return;
    const updated = removeElementFromXslt(xsltContent, selector, details ?? undefined);
    if (updated !== xsltContent) {
      updateXsltContent(updated);
      setSelectedSelector('');
      setSelectedElementDetails(null);
      setSelectedLineNumber(0);
      setInspectorStatus('Seçilen eleman tasarımdan silindi.');
      setTimeout(() => setInspectorStatus(null), 3000);
    }
  }, [xsltContent, updateXsltContent, setSelectedSelector, setSelectedElementDetails, setSelectedLineNumber, setInspectorStatus]);

  return { handleAddTextElement, handleRemoveElement };
}
