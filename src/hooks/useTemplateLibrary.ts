// Template library management (list + save) extracted from App.tsx.
//
// The template list and the "save current design as a template" flow are
// tightly related: after a save the list is refreshed silently.
import { useCallback, useRef } from 'react';
import { useEditorStore } from '../store/editorStore';
import type { CustomTemplate } from '../store/editorStore';

export interface ToastPayload {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  description?: string;
}

export interface UseTemplateLibraryApi {
  loadCustomTemplates: (opts?: { silent?: boolean }) => Promise<void>;
  handleSaveCurrentAsTemplate: (nameOverride?: string) => Promise<void>;
}

export function useTemplateLibrary(
  xsltContent: string,
  saveTemplateName: string,
  setSaveTemplateName: (v: string) => void,
  setIsSavingTemplate: (v: boolean) => void,
  setCustomTemplates: (t: CustomTemplate[]) => void,
  setInspectorStatus: (msg: string | null) => void,
  addToast: (t: ToastPayload) => void,
): UseTemplateLibraryApi {
  const templatesToastShown = useRef(false);
  const templatesLoading = useRef(false);

  const loadCustomTemplates = useCallback(async (opts?: { silent?: boolean }) => {
    // StrictMode double-effect and fast tab switches can fire several fetches
    // at once; one of them aborting would surface as a bogus error.
    if (templatesLoading.current) return;
    templatesLoading.current = true;
    const silent = opts?.silent ?? false;
    try {
      const res = await fetch('/api/list-templates');
      if (res.ok) {
        const data = await res.json();
        setCustomTemplates(data);
        // The success toast is shown on the FIRST load only; later background
        // refreshes (tab visits, after a save) stay silent.
        if (!templatesToastShown.current) {
          templatesToastShown.current = true;
          if (!silent) {
            addToast({
              type: 'success',
              message: 'Şablonlar Yüklendi',
              description: `${data.length} şablon bulundu`,
            });
          }
        }
      } else if (!silent) {
        addToast({
          type: 'warning',
          message: 'Şablon Yükleme Başarısız',
          description: 'Şablonlar yüklenemedi',
        });
      }
    } catch (err) {
      console.error('Failed to load custom templates:', err);
      // Stay quiet while a cached list is on screen; if the list is empty the
      // failure is real and the user should see it.
      const hasCached = useEditorStore.getState().customTemplates.length > 0;
      if (!silent || !hasCached) {
        addToast({
          type: 'error',
          message: 'Şablon Hatası',
          description: 'Şablonlar yüklenirken hata oluştu',
        });
      }
    } finally {
      templatesLoading.current = false;
    }
  }, [setCustomTemplates, addToast]);

  const handleSaveCurrentAsTemplate = useCallback(async (nameOverride?: string) => {
    const name = (nameOverride || saveTemplateName).trim();
    if (!name) {
      alert('Lütfen şablon için geçerli bir isim girin.');
      return;
    }
    setSaveTemplateName(name);
    setIsSavingTemplate(true);
    try {
      const res = await fetch('/api/save-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          content: xsltContent,
        }),
      });
      if (res.ok) {
        setInspectorStatus(`"${name}" şablonu başarıyla kaydedildi.`);
        setTimeout(() => setInspectorStatus(null), 3000);
        setSaveTemplateName('');
        await loadCustomTemplates({ silent: true });
      } else {
        alert('Şablon kaydedilirken sunucu hatası oluştu.');
      }
    } catch (err) {
      console.error(err);
      alert('Şablon kaydedilemedi. Sunucu hatası.');
    } finally {
      setIsSavingTemplate(false);
    }
  }, [xsltContent, saveTemplateName, setSaveTemplateName, setIsSavingTemplate, setInspectorStatus, loadCustomTemplates]);

  return { loadCustomTemplates, handleSaveCurrentAsTemplate };
}
