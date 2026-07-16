import { useEffect, useCallback } from 'react';
import { useEditorStore } from '../store/editorStore';
import { transformXmlWithXslt } from '../utils/xsltTransformer';

export function useXsltTransform() {
  const {
    xmlContent,
    xsltContent,
    autoRefresh,
    setHtmlOutput,
    setErrorMsg,
    setValidationStatus,
  } = useEditorStore();

  const transform = useCallback(async () => {
    if (!autoRefresh) return;

    const result = transformXmlWithXslt(xmlContent, xsltContent);

    if (result.error) {
      setHtmlOutput('');
      setErrorMsg(result.error);
      setValidationStatus({
        xmlValid: false,
        xsltValid: false,
        xmlError: result.error,
        xsltError: result.error,
      });
    } else {
      setHtmlOutput(result.html);
      setErrorMsg(undefined);
      setValidationStatus({
        xmlValid: true,
        xsltValid: true,
      });
    }
  }, [xmlContent, xsltContent, autoRefresh, setHtmlOutput, setErrorMsg, setValidationStatus]);

  useEffect(() => {
    if (autoRefresh && xmlContent && xsltContent) {
      transform();
    }
  }, [transform, autoRefresh, xmlContent, xsltContent]);

  return { transform };
}
