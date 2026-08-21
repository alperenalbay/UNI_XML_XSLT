import { act, useEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEditorStore } from '../store/editorStore';
import { useTemplates } from './useTemplates';

type TemplatesApi = ReturnType<typeof useTemplates>;

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function HookHarness({ onReady }: { onReady: (api: TemplatesApi) => void }) {
  const api = useTemplates();
  useEffect(() => {
    onReady(api);
  }, [api, onReady]);
  return null;
}

describe('useTemplates', () => {
  let container: HTMLDivElement;
  let root: Root;
  let api: TemplatesApi | null = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    api = null;
    useEditorStore.setState({
      customTemplates: [],
      saveTemplateName: '',
      isSavingTemplate: false,
    });
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    vi.restoreAllMocks();
  });

  const mountHook = async () => {
    await act(async () => {
      root.render(<HookHarness onReady={(hookApi) => { api = hookApi; }} />);
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(api).not.toBeNull();
    return api as TemplatesApi;
  };

  it('loads templates on mount', async () => {
    const templates = [{ name: 'Starter', fileName: 'starter.xslt', content: '<xsl:stylesheet/>' }];
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => templates,
    } as Response);

    await mountHook();

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/list-templates');
    expect(useEditorStore.getState().customTemplates).toEqual(templates);
  });

  it('saves template and refreshes list', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response) // initial mount loadTemplates
      .mockResolvedValueOnce({
        ok: true,
      } as Response) // save-template
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ name: 'Saved', fileName: 'saved.xslt', content: '<xsl:stylesheet/>' }],
      } as Response); // post-save loadTemplates

    useEditorStore.getState().setSaveTemplateName('Saved');
    const hook = await mountHook();

    let result = false;
    await act(async () => {
      result = await hook.saveTemplate('<xsl:stylesheet/>');
    });

    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith('/api/save-template', expect.objectContaining({ method: 'POST' }));
    expect(useEditorStore.getState().saveTemplateName).toBe('');
    expect(useEditorStore.getState().customTemplates[0]?.name).toBe('Saved');
    expect(useEditorStore.getState().isSavingTemplate).toBe(false);
  });

  it('returns false when template name is empty', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    const hook = await mountHook();
    await act(async () => {
      useEditorStore.getState().setSaveTemplateName('   ');
    });

    let result = true;
    await act(async () => {
      result = await hook.saveTemplate('<xsl:stylesheet/>');
    });

    expect(result).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1); // only mount loadTemplates
  });
});
