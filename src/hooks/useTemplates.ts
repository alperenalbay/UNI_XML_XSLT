// Template-loading helpers extracted from App.tsx to keep the main component
// focused on orchestration. Pure functions over the content setters + the
// current XML document, so behaviour is identical to the inlined version.
import { useCallback } from 'react';
import { DEFAULT_XML, DEFAULT_DESPATCH_XML, DEFAULT_XSLT } from '../samples/invoiceSample';

export interface UseTemplatesApi {
  loadDefaultSample: () => void;
  getMatchingSampleXml: (xslt: string) => string;
  loadTemplateWithSampleXml: (xslt: string) => void;
}

export function useTemplates(
  xmlContent: string,
  updateXmlContent: (xml: string) => void,
  updateXsltContent: (xslt: string) => void,
  setErrorMsg: (msg: string | undefined) => void,
): UseTemplatesApi {
  const loadDefaultSample = useCallback(() => {
    updateXmlContent(DEFAULT_XML);
    updateXsltContent(DEFAULT_XSLT);
    setErrorMsg(undefined);
  }, [updateXmlContent, updateXsltContent, setErrorMsg]);

  const getMatchingSampleXml = useCallback((xslt: string): string => {
    if (!xslt) return DEFAULT_XML;
    const checks = [
      /DespatchAdvice/i,
      /DespatchLine/i,
      /DespatchSupplierParty/i,
      /ActualDespatchDate/i,
    ];
    if (checks.some((re) => re.test(xslt))) {
      return DEFAULT_DESPATCH_XML;
    }
    return DEFAULT_XML;
  }, []);

  const loadTemplateWithSampleXml = useCallback((xslt: string) => {
    const currentXml = xmlContent || '';
    const isDespatchTemplate = /DespatchAdvice|DespatchLine|DespatchSupplierParty|ActualDespatchDate/i.test(xslt);
    const xmlHasDespatch = currentXml.includes('DespatchAdvice') || currentXml.includes('DespatchLine');
    const typeMatches = (isDespatchTemplate && xmlHasDespatch) || (!isDespatchTemplate && !xmlHasDespatch);
    if (!currentXml.trim() || !typeMatches) {
      updateXmlContent(getMatchingSampleXml(xslt));
    }
    updateXsltContent(xslt);
  }, [xmlContent, updateXmlContent, updateXsltContent, getMatchingSampleXml]);

  return { loadDefaultSample, getMatchingSampleXml, loadTemplateWithSampleXml };
}
