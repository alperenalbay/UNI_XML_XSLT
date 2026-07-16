import { useEffect, useCallback } from 'react';
import { useEditorStore } from '../store/editorStore';

export function useUpdates() {
  const {
    updateAvailable,
    isUpdating,
    updateCheckStatus,
    setUpdateAvailable,
    setIsUpdating,
    setUpdateCheckStatus,
  } = useEditorStore();

  const checkUpdates = useCallback(async () => {
    try {
      const res = await fetch('/api/check-update');
      if (res.ok) {
        const data = await res.json();
        if (data.updateAvailable) {
          setUpdateAvailable(true);
        }
      }
    } catch (err) {
      console.error('Failed to check updates:', err);
    }
  }, [setUpdateAvailable]);

  const triggerUpdate = useCallback(async (): Promise<boolean> => {
    setIsUpdating(true);
    setUpdateCheckStatus(
      'Uygulama güncelleniyor (git pull & npm install)... Lütfen bu sayfayı kapatmayın.'
    );

    try {
      const res = await fetch('/api/trigger-update', { method: 'POST' });
      if (res.ok) {
        setUpdateCheckStatus(
          'Güncelleme başarıyla tamamlandı! Sayfa 3 saniye içinde yenilenecek.'
        );
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        return true;
      } else {
        const data = await res.json();
        const errorMsg = `Güncelleme başarısız oldu: ${data.error || 'Bilinmeyen hata'}`;
        setUpdateCheckStatus(errorMsg);
        return false;
      }
    } catch (err: any) {
      console.error('Update error:', err);
      setUpdateCheckStatus('Güncelleme hatası oluştu.');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [setIsUpdating, setUpdateCheckStatus]);

  useEffect(() => {
    checkUpdates();
  }, [checkUpdates]);

  return {
    updateAvailable,
    isUpdating,
    updateCheckStatus,
    checkUpdates,
    triggerUpdate,
  };
}
