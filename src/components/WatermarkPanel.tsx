import { Wand2, Upload, Save, Trash2 } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { addWatermarkToXslt, removeWatermarkFromXslt, hasWatermarkInXslt } from '../utils/xsltTransformer';
import { useToast } from '../store/toastStore';

/**
 * Filigran (watermark) yönetim paneli.
 * Element seçimi gerektirmez — her zaman DesignerPanel'in altında görünür.
 * Kullanıcı Base64 görsel yükler, opacity/boyut/döndürme ayarlar;
 * önizleme canlı güncellenir. "XSLT'ye Kaydet" ile filigran kalıcı XSLT koduna yazılır.
 */
export function WatermarkPanel() {
  const {
    watermarkText,
    watermarkColor,
    watermarkRotation,
    watermarkVisible,
    watermarkImage,
    watermarkSize,
    watermarkOpacity,
    xsltContent,
    setWatermarkText,
    setWatermarkColor,
    setWatermarkRotation,
    setWatermarkVisible,
    setWatermarkImage,
    setWatermarkSize,
    setWatermarkOpacity,
    setXsltContent,
  } = useEditorStore();
  const { addToast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast({ type: 'error', message: 'Geçersiz dosya', description: 'Lütfen bir görsel dosyası seçin (PNG, JPG, SVG...)' });
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      addToast({ type: 'error', message: 'Dosya çok büyük', description: 'Maksimum 1.5 MB görsel yükleyebilirsiniz' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setWatermarkImage(result);
      if (!watermarkVisible) setWatermarkVisible(true);
      addToast({ type: 'success', message: 'Filigran görseli yüklendi', description: `${file.name} önizlemeye eklendi` });
    };
    reader.onerror = () => {
      addToast({ type: 'error', message: 'Yükleme hatası', description: 'Görsel okunamadı' });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveToXslt = () => {
    if (!watermarkImage) {
      addToast({ type: 'error', message: 'Görsel yok', description: 'Önce bir filigran görseli yükleyin' });
      return;
    }
    const updated = addWatermarkToXslt(xsltContent, {
      image: watermarkImage,
      size: watermarkSize,
      opacity: watermarkOpacity,
      rotation: watermarkRotation,
    });
    if (updated !== xsltContent) {
      setXsltContent(updated);
      addToast({ type: 'success', message: 'Filigran kaydedildi', description: 'Filigran XSLT koduna etiketlerle eklendi' });
    } else {
      addToast({ type: 'error', message: 'Kaydedilemedi', description: 'XSLT koduna ekleme başarısız oldu' });
    }
  };

  const handleRemoveFromXslt = () => {
    if (!hasWatermarkInXslt(xsltContent)) {
      addToast({ type: 'info', message: 'Filigran yok', description: 'XSLT kodunda kaldırılacak filigran bulunamadı' });
      return;
    }
    const updated = removeWatermarkFromXslt(xsltContent);
    if (updated !== xsltContent) {
      setXsltContent(updated);
      addToast({ type: 'success', message: 'Filigran kaldırıldı', description: 'Filigran bloğu XSLT kodundan silindi' });
    }
  };

  return (
    <section className="space-y-3 border-t border-slate-700/60 pt-4 mt-2 bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
        <Wand2 className="w-4 h-4" />
        Filigran
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={watermarkVisible}
          onChange={(e) => setWatermarkVisible(e.target.checked)}
          className="rounded cursor-pointer"
        />
        <label className="text-xs text-slate-400">Önizlemede Görünür</label>
      </div>

      {/* Image uploader */}
      <div>
        <label className="text-xs text-slate-400 block mb-2">Filigran Görseli (Base64)</label>
        <label className="flex items-center justify-center gap-2 w-full bg-slate-800 border border-dashed border-slate-600 rounded px-2 py-3 text-xs text-slate-300 hover:bg-slate-700 cursor-pointer transition">
          <Upload className="w-4 h-4" />
          {watermarkImage ? 'Görseli Değiştir' : 'Görsel Yükle'}
          <input
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
        {watermarkImage && (
          <div className="mt-2 flex items-center gap-2 bg-slate-800 border border-slate-700 rounded p-2">
            <img
              src={watermarkImage}
              alt="Filigran önizleme"
              className="w-12 h-12 object-contain bg-slate-900 rounded border border-slate-700"
            />
            <button
              onClick={() => setWatermarkImage('')}
              className="text-xs text-red-400 hover:text-red-300 transition"
              title="Görseli kaldır"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-2">Metin Etiketi</label>
        <input
          type="text"
          value={watermarkText}
          onChange={(e) => setWatermarkText(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          placeholder="ÖRN. ÖDENDİ"
        />
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-2">Renk</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={watermarkColor}
            onChange={(e) => setWatermarkColor(e.target.value)}
            className="w-10 h-9 rounded border border-slate-700 cursor-pointer"
          />
          <input
            type="text"
            value={watermarkColor}
            onChange={(e) => setWatermarkColor(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-2">
          Döndürme ({watermarkRotation}°)
        </label>
        <input
          type="range"
          min="-180"
          max="180"
          value={watermarkRotation}
          onChange={(e) => setWatermarkRotation(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-2">
          Boyut (%{watermarkSize})
        </label>
        <input
          type="range"
          min="5"
          max="100"
          value={watermarkSize}
          onChange={(e) => setWatermarkSize(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-2">
          Opaklık (%{watermarkOpacity})
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={watermarkOpacity}
          onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Save / Remove in XSLT */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button
          onClick={handleSaveToXslt}
          disabled={!watermarkImage}
          className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-bold rounded px-2 py-2 transition"
          title="Bu filigranı XSLT koduna kalıcı olarak yaz"
        >
          <Save className="w-3.5 h-3.5" />
          XSLT'ye Kaydet
        </button>
        <button
          onClick={handleRemoveFromXslt}
          className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-red-900 border border-slate-700 hover:border-red-700 text-slate-300 hover:text-red-200 text-xs font-bold rounded px-2 py-2 transition"
          title="XSLT kodundan filigran bloğunu sil"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Kaldır
        </button>
      </div>
      <p className="text-[10px] text-slate-500 leading-relaxed">
        Not: Yukarıdaki kontroller önizleme içindir. Filigranı faturada kalıcı yapmak için <strong>XSLT'ye Kaydet</strong> butonuna basın.
      </p>
    </section>
  );
}
