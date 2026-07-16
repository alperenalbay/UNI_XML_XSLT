import { useEffect, useCallback } from 'react';
import { useEditorStore } from '../store/editorStore';
import type { CustomTemplate } from '../store/editorStore';

export function useTemplates() {
  const {
    customTemplates,
    setCustomTemplates,
    setIsSavingTemplate,
    setSaveTemplateName,
    saveTemplateName,
  } = useEditorStore();

  const loadTemplates = useCallback(async () => {
    try {
      const res = await fetch('/api/list-templates');
      if (res.ok) {
        const data = await res.json();
        setCustomTemplates(data);
      }
    } catch (err) {
      console.error('Failed to load templates:', err);
    }
  }, [setCustomTemplates]);

  const saveTemplate = useCallback(
    async (xsltContent: string): Promise<boolean> => {
      if (!saveTemplateName.trim()) {
        console.warn('Template name is empty');
        return false;
      }

      setIsSavingTemplate(true);
      try {
        const res = await fetch('/api/save-template', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: saveTemplateName,
            content: xsltContent,
          }),
        });

        if (res.ok) {
          setSaveTemplateName('');
          await loadTemplates();
          return true;
        } else {
          const error = await res.text();
          console.error('Save template error:', error);
          return false;
        }
      } catch (err) {
        console.error('Save template error:', err);
        return false;
      } finally {
        setIsSavingTemplate(false);
      }
    },
    [saveTemplateName, setIsSavingTemplate, setSaveTemplateName, loadTemplates]
  );

  const loadTemplate = useCallback((template: CustomTemplate) => {
    return template.content;
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  return {
    customTemplates,
    saveTemplate,
    loadTemplate,
    loadTemplates,
  };
}
