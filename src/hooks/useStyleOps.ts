// Style-write helper extracted from App.tsx.
import { useCallback } from 'react';
import { updateXsltTagAtLine, updateElementStyleInXsltById, updateXsltStyle, findLineByXsltId } from '../utils/xsltTransformer';
import type { ElementDetails } from '../utils/xsltTransformer';

export interface StyleSetters {
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
}

export interface UseStyleOpsApi {
  handleStyleChange: (property: string, value: string) => void;
}

export function useStyleOps(
  xsltContent: string,
  selectedSelector: string,
  selectedElementDetails: ElementDetails | null,
  selectedLineNumber: number,
  updateXsltContent: (xslt: string) => void,
  setters: StyleSetters,
): UseStyleOpsApi {
  const handleStyleChange = useCallback((property: string, value: string) => {
    if (!selectedSelector && !selectedElementDetails?.xsltId) return;

    if (property === 'margin') setters.setStyleMargin(value);
    else if (property === 'padding') setters.setStylePadding(value);
    else if (property === 'font-size') setters.setStyleFontSize(value);
    else if (property === 'color') setters.setStyleColor(value);
    else if (property === 'width') setters.setStyleWidth(value);
    else if (property === 'text-align') setters.setStyleTextAlign(value);
    else if (property === 'font-weight') setters.setStyleFontWeight(value);
    else if (property === 'font-style') setters.setStyleFontStyle(value);
    else if (property === 'text-decoration') setters.setStyleTextDecoration(value);
    else if (property === 'white-space') setters.setStyleWhiteSpace(value);

    let updated = xsltContent;
    const isWidth = property.toLowerCase() === 'width';
    const colXsltId = selectedElementDetails?.colXsltId;
    const targetId = (isWidth && colXsltId) ? colXsltId : selectedElementDetails?.xsltId;

    let targetLine = selectedLineNumber;
    if (isWidth && colXsltId) {
      const colLine = findLineByXsltId(xsltContent, colXsltId);
      if (colLine > 0) targetLine = colLine;
    }

    if (targetLine > 0) {
      updated = updateXsltTagAtLine(xsltContent, targetLine, property, value);
    } else if (targetId) {
      updated = updateElementStyleInXsltById(xsltContent, targetId, property, value);
    } else if (selectedSelector) {
      updated = updateXsltStyle(xsltContent, selectedSelector, property, value);
    }

    if (updated !== xsltContent) {
      updateXsltContent(updated);
    }
  }, [xsltContent, selectedSelector, selectedElementDetails, selectedLineNumber, updateXsltContent, setters]);

  return { handleStyleChange };
}
