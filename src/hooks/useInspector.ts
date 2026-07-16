import { useCallback, useRef } from 'react';
import { useEditorStore } from '../store/editorStore';
import type { SelectedElementDetails } from '../store/editorStore';

export function useInspector() {
  const {
    inspectorActive,
    inspectorStatus,
    setInspectorActive,
    setInspectorStatus,
    setSelectedElement,
  } = useEditorStore();

  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  const handleElementClick = useCallback(
    (event: MouseEvent) => {
      if (!inspectorActive) return;

      event.preventDefault();
      event.stopPropagation();

      const target = event.target as HTMLElement;
      if (!target) return;

      const xsltId = target.getAttribute('data-xslt-id');
      if (!xsltId) {
        setInspectorStatus('Seçilen elemanda XSLT ID bulunamadı');
        return;
      }

      const selector = buildCssSelector(target);
      const styles = window.getComputedStyle(target);

      const elementDetails: SelectedElementDetails = {
        selector,
        elementName: target.tagName.toLowerCase(),
        details: {
          tagName: target.tagName,
          id: target.id,
          className: target.className,
          xsltId,
        },
        styles: {
          margin: styles.margin || '',
          padding: styles.padding || '',
          fontSize: styles.fontSize || '',
          color: styles.color || '',
          width: styles.width || '',
          textAlign: styles.textAlign || '',
          fontWeight: styles.fontWeight || '',
          fontStyle: styles.fontStyle || '',
          textDecoration: styles.textDecoration || '',
        },
      };

      setSelectedElement(elementDetails);
      setInspectorStatus(`Seçili: ${selector}`);
    },
    [inspectorActive, setSelectedElement, setInspectorStatus]
  );

  const toggleInspector = useCallback(() => {
    setInspectorActive(!inspectorActive);
    if (!inspectorActive) {
      setInspectorStatus('Inspector açık - Elemana tıklayın');
    } else {
      setInspectorStatus(null);
    }
  }, [inspectorActive, setInspectorActive, setInspectorStatus]);

  const enableInspectorMode = useCallback(() => {
    if (previewIframeRef.current?.contentWindow) {
      const iframeDoc = previewIframeRef.current.contentWindow.document;
      iframeDoc.addEventListener('click', handleElementClick, true);

      return () => {
        iframeDoc.removeEventListener('click', handleElementClick, true);
      };
    }
  }, [handleElementClick]);

  return {
    inspectorActive,
    inspectorStatus,
    toggleInspector,
    handleElementClick,
    enableInspectorMode,
    previewIframeRef,
  };
}

function buildCssSelector(element: HTMLElement): string {
  if (!element) return '';

  let selector = element.tagName.toLowerCase();

  if (element.id) {
    selector += `#${element.id}`;
  } else {
    if (element.className) {
      const classes = element.className
        .split(' ')
        .map((c) => c.trim())
        .filter((c) => c);
      if (classes.length > 0) {
        selector += `.${classes.join('.')}`;
      }
    }

    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children);
      const index = siblings.indexOf(element) + 1;
      if (index > 0) {
        selector += `:nth-child(${index})`;
      }
    }
  }

  return selector;
}
