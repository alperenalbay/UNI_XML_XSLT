import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from './editorStore';

describe('editorStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useEditorStore.setState({
      xmlContent: '',
      xsltContent: '',
      htmlOutput: '',
      errorMsg: undefined,
      editorActiveTab: 'xml',
      autoRefresh: true,
      selectedElement: null,
    });
  });

  it('should initialize with default state', () => {
    const state = useEditorStore.getState();
    expect(state.xmlContent).toBe('');
    expect(state.xsltContent).toBe('');
    expect(state.autoRefresh).toBe(true);
    expect(state.editorActiveTab).toBe('xml');
  });

  it('should set XML content', () => {
    const { setXmlContent } = useEditorStore.getState();
    setXmlContent('<root />');
    const state = useEditorStore.getState();
    expect(state.xmlContent).toBe('<root />');
  });

  it('should set XSLT content', () => {
    const { setXsltContent } = useEditorStore.getState();
    setXsltContent('<xsl:stylesheet />');
    const state = useEditorStore.getState();
    expect(state.xsltContent).toBe('<xsl:stylesheet />');
  });

  it('should set HTML output', () => {
    const { setHtmlOutput } = useEditorStore.getState();
    setHtmlOutput('<html><body>Test</body></html>');
    const state = useEditorStore.getState();
    expect(state.htmlOutput).toContain('Test');
  });

  it('should toggle auto refresh', () => {
    const initialState = useEditorStore.getState();
    expect(initialState.autoRefresh).toBe(true);

    const { setAutoRefresh } = useEditorStore.getState();
    setAutoRefresh(false);
    const newState = useEditorStore.getState();
    expect(newState.autoRefresh).toBe(false);
  });

  it('should set editor tab', () => {
    const { setEditorActiveTab } = useEditorStore.getState();
    setEditorActiveTab('xslt');
    const state = useEditorStore.getState();
    expect(state.editorActiveTab).toBe('xslt');
  });

  it('should set validation status', () => {
    const { setValidationStatus } = useEditorStore.getState();
    setValidationStatus({
      xmlValid: false,
      xsltValid: true,
      xmlError: 'Invalid XML',
    });
    const state = useEditorStore.getState();
    expect(state.validationStatus.xmlValid).toBe(false);
    expect(state.validationStatus.xmlError).toBe('Invalid XML');
  });

  it('should set watermark properties', () => {
    const { setWatermarkText, setWatermarkColor } = useEditorStore.getState();
    setWatermarkText('DRAFT');
    setWatermarkColor('#ff0000');

    const state = useEditorStore.getState();
    expect(state.watermarkText).toBe('DRAFT');
    expect(state.watermarkColor).toBe('#ff0000');
  });

  it('should reset to defaults', () => {
    const { setXmlContent, setXsltContent, resetToDefaults } = useEditorStore.getState();
    setXmlContent('<old />');
    setXsltContent('<old />');

    resetToDefaults('<new />', '<new />');
    const state = useEditorStore.getState();
    expect(state.xmlContent).toBe('<new />');
    expect(state.xsltContent).toBe('<new />');
    expect(state.htmlOutput).toBe('');
  });

  it('should clear selected element', () => {
    const { setSelectedElement, clearSelectedElement } = useEditorStore.getState();
    setSelectedElement({
      selector: 'div.test',
      elementName: 'div',
      details: {},
      styles: {
        margin: '10px',
        padding: '5px',
        fontSize: '14px',
        color: '#000',
        width: '100%',
        textAlign: 'left',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
      },
    });

    let state = useEditorStore.getState();
    expect(state.selectedElement).not.toBeNull();

    clearSelectedElement();
    state = useEditorStore.getState();
    expect(state.selectedElement).toBeNull();
  });
});
