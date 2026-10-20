// Self-update check/apply logic extracted from App.tsx.
//
// The state itself (updateAvailable / isUpdating / updateCheckStatus) lives in
// the editor store so it survives tab switches; this hook only owns the
// request flow and reports results through the store setters.
import { useCallback } from 'react';

export interface ToastPayload {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  description?: string;
}

export interface UseAppUpdateApi {
  checkUpdates: () => Promise<void>;
  triggerUpdate: () => Promise<void>;
}

export function useAppUpdate(
  setUpdateAvailable: (v: boolean) => void,
  setIsUpdating: (v: boolean) => void,
  setUpdateCheckStatus: (v: string | null) => void,
  addToast: (t: ToastPayload) => void,
): UseAppUpdateApi {
  const checkUpdates = useCallback(async () => {
    try {
      const res = await fetch('/api/check-update');
      if (res.ok) {
        const data = await res.json();
        if (data.updateAvailable) {
          setUpdateAvailable(true);
          addToast({
            type: 'info',
            message: 'Güncelleme Mevcut',
            description: `Yeni sürüm ${data.version} kullanılabilir`,
          });
        }
      }
    } catch (err) {
      console.error('Failed to check updates:', err);
      addToast({
        type: 'warning',
        message: 'Güncelleme Kontrolü Başarısız',
        description: 'Güncellemeler kontrol edilemedi',
      });
    }
  }, [setUpdateAvailable, addToast]);

  const triggerUpdate = useCallback(async () => {
    setIsUpdating(true);
    setUpdateCheckStatus('Uygulama güncelleniyor (git pull & npm install)... Lütfen bu sayfayı kapatmayın.');
    addToast({
      type: 'info',
      message: 'Güncelleme Başlıyor',
      description: 'Uygulama güncelleniyor, lütfen bekleyiniz...',
    });
    try {
      const res = await fetch('/api/trigger-update', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.changed === false) {
          setUpdateAvailable(false);
          setUpdateCheckStatus('Uygulama zaten en güncel sürümde çalışıyor, güncelleme gerekmedi.');
          addToast({
            type: 'info',
            message: 'Zaten Güncel',
            description: 'Uygulama en güncel sürümde, güncelleme gerekmedi.',
          });
        } else {
          setUpdateCheckStatus('Güncelleme başarıyla tamamlandı! Sayfa 3 saniye içinde yenilenecek.');
          addToast({
            type: 'success',
            message: 'Güncelleme Tamamlandı',
            description: 'Sayfa yeniden yüklenecek...',
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } else {
        const data = await res.json();
        addToast({
          type: 'error',
          message: 'Güncelleme Başarısız',
          description: data.error || 'Bilinmeyen hata',
        });
        setUpdateCheckStatus(null);
      }
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        message: 'Güncelleme Hatası',
        description: 'Güncelleme işlemi sırasında hata oluştu',
      });
      setUpdateCheckStatus(null);
    } finally {
      setIsUpdating(false);
    }
  }, [setUpdateAvailable, setIsUpdating, setUpdateCheckStatus, addToast]);

  return { checkUpdates, triggerUpdate };
}
