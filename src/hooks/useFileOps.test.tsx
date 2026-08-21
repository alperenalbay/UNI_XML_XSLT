import { act, useEffect, type ChangeEvent, type DragEvent, type RefObject } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEditorStore } from '../store/editorStore';
import { useFileOps } from './useFileOps';

type FileOpsApi = ReturnType<typeof useFileOps>;

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function HookHarness({
  onReady,
  updateXmlContent,
  updateXsltContent,
  iframeRef,
}: {
  onReady: (api: FileOpsApi) => void;
  updateXmlContent: (value: string) => void;
  updateXsltContent: (value: string) => void;
  iframeRef: RefObject<HTMLIFrameElement | null>;
}) {
  const api = useFileOps(updateXmlContent, updateXsltContent, iframeRef);
  useEffect(() => {
    onReady(api);
  }, [api, onReady]);
  return null;
}

describe('useFileOps', () => {
  let container: HTMLDivElement;
  let root: Root;
  let api: FileOpsApi | null = null;
  let updateXmlContent: ReturnType<typeof vi.fn>;
  let updateXsltContent: ReturnType<typeof vi.fn>;
  let iframeRef: RefObject<HTMLIFrameElement | null>;
  const OriginalFileReader = globalThis.FileReader;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    api = null;
    updateXmlContent = vi.fn();
    updateXsltContent = vi.fn();
    iframeRef = { current: null };
    useEditorStore.setState({ editorActiveTab: 'xml', isDragging: false });

    class MockFileReader {
      onload: ((event: any) => void) | null = null;
      readAsText(file: any) {
        const result = file.__content ?? '';
        this.onload?.({ target: { result } });
      }
    }
    (globalThis as any).FileReader = MockFileReader;
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    (globalThis as any).FileReader = OriginalFileReader;
    vi.restoreAllMocks();
  });

  const mountHook = async () => {
    await act(async () => {
      root.render(
        <HookHarness
          onReady={(hookApi) => {
            api = hookApi;
          }}
          updateXmlContent={updateXmlContent}
          updateXsltContent={updateXsltContent}
          iframeRef={iframeRef}
        />
      );
    });
    expect(api).not.toBeNull();
    return api as FileOpsApi;
  };

  it('uploads XML content via file input handler', async () => {
    const hook = await mountHook();
    const file = new File(['<root/>'], 'invoice.xml', { type: 'application/xml' }) as any;
    file.__content = '<Invoice>123</Invoice>';

    await act(async () => {
      hook.handleFileUpload(
        { target: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>,
        'xml'
      );
    });

    expect(updateXmlContent).toHaveBeenCalledWith('<Invoice>123</Invoice>');
    expect(updateXsltContent).not.toHaveBeenCalled();
  });

  it('handles drag-drop for XML and XSLT files', async () => {
    const hook = await mountHook();
    const xmlFile = new File(['x'], 'a.xml', { type: 'application/xml' }) as any;
    xmlFile.__content = '<Invoice>XML</Invoice>';
    const xsltFile = new File(['x'], 'b.xslt', { type: 'application/xml' }) as any;
    xsltFile.__content = '<xsl:stylesheet></xsl:stylesheet>';

    const event = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: { files: [xmlFile, xsltFile] },
    } as unknown as DragEvent<HTMLDivElement>;

    await act(async () => {
      hook.handleDrop(event);
    });

    expect(updateXmlContent).toHaveBeenCalledWith('<Invoice>XML</Invoice>');
    expect(updateXsltContent).toHaveBeenCalledWith('<xsl:stylesheet></xsl:stylesheet>');
    expect(useEditorStore.getState().editorActiveTab).toBe('xslt');
  });

  it('clears XML and XSLT via clear handler', async () => {
    const hook = await mountHook();

    await act(async () => {
      hook.handleClear('xml');
      hook.handleClear('xslt');
    });

    expect(updateXmlContent).toHaveBeenCalledWith('');
    expect(updateXsltContent).toHaveBeenCalledWith('');
  });

  it('prints through preview iframe window', async () => {
    const focus = vi.fn();
    const print = vi.fn();
    iframeRef.current = {
      contentWindow: {
        focus,
        print,
      },
    } as unknown as HTMLIFrameElement;

    const hook = await mountHook();

    await act(async () => {
      hook.handlePrint();
    });

    expect(focus).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledTimes(1);
  });
});
