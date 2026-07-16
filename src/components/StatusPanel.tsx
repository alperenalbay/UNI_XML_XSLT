import { BarChart3, AlertCircle, CheckCircle, Package } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { useTemplates, useUpdates } from '../hooks';

export function StatusPanel() {
  const {
    validationStatus,
    customTemplates,
    updateAvailable,
    updateCheckStatus,
    isUpdating,
    xmlContent,
    xsltContent,
  } = useEditorStore();

  const { loadTemplates } = useTemplates();
  const { triggerUpdate } = useUpdates();

  const stats = {
    xmlSize: new Blob([xmlContent]).size,
    xsltSize: new Blob([xsltContent]).size,
    templatesCount: customTemplates.length,
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-auto">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 sticky top-0">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-bold text-slate-300">Durum & İstatistikler</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Validation Status */}
        <section className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Doğrulama Durumu
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-slate-900 rounded">
              <span className="text-slate-300">XML</span>
              {validationStatus.xmlValid ? (
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Geçerli
                </span>
              ) : (
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  Hata
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-900 rounded">
              <span className="text-slate-300">XSLT</span>
              {validationStatus.xsltValid ? (
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Geçerli
                </span>
              ) : (
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  Hata
                </span>
              )}
            </div>
          </div>

          {validationStatus.xmlError && (
            <div className="mt-2 p-2 bg-red-950/30 border border-red-900/40 rounded text-xs text-red-300">
              {validationStatus.xmlError}
            </div>
          )}

          {validationStatus.xsltError && (
            <div className="mt-2 p-2 bg-red-950/30 border border-red-900/40 rounded text-xs text-red-300">
              {validationStatus.xsltError}
            </div>
          )}
        </section>

        {/* File Statistics */}
        <section className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-xs font-bold text-slate-400 mb-3">Dosya Boyutları</div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-slate-900 rounded">
              <span className="text-slate-300">XML Boyutu</span>
              <span className="text-blue-400 font-mono">
                {(stats.xmlSize / 1024).toFixed(2)} KB
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-900 rounded">
              <span className="text-slate-300">XSLT Boyutu</span>
              <span className="text-blue-400 font-mono">
                {(stats.xsltSize / 1024).toFixed(2)} KB
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-900 rounded">
              <span className="text-slate-300">Toplam</span>
              <span className="text-indigo-400 font-mono font-bold">
                {((stats.xmlSize + stats.xsltSize) / 1024).toFixed(2)} KB
              </span>
            </div>
          </div>
        </section>

        {/* Templates */}
        <section className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-xs font-bold text-slate-400 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Kaydedilmiş Şablonlar
            </span>
            <button
              onClick={loadTemplates}
              className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition text-[10px] font-bold"
            >
              Yenile
            </button>
          </div>

          <div className="p-3 bg-slate-900 rounded text-sm text-slate-300">
            {customTemplates.length} Şablon Kaydedilmiş
          </div>

          {customTemplates.length > 0 && (
            <div className="mt-3 max-h-32 overflow-y-auto space-y-1">
              {customTemplates.map((template) => (
                <div
                  key={template.fileName}
                  className="text-[10px] text-slate-400 font-mono p-1 bg-slate-900/50 rounded truncate"
                  title={template.name}
                >
                  {template.name}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Updates */}
        {updateAvailable && (
          <section className="bg-emerald-950/30 rounded-lg p-4 border border-emerald-900/40">
            <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Yeni Güncelleme Mevcut
            </div>

            {updateCheckStatus && (
              <p className="text-xs text-slate-300 mb-3">{updateCheckStatus}</p>
            )}

            <button
              onClick={triggerUpdate}
              disabled={isUpdating}
              className="w-full px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/50 text-white text-xs font-bold transition"
            >
              {isUpdating ? 'Güncelleniyor...' : 'Şimdi Güncelle'}
            </button>
          </section>
        )}

        {/* Info */}
        <section className="bg-slate-800 rounded-lg p-4 border border-slate-700 mt-auto">
          <div className="text-[10px] text-slate-500 space-y-1">
            <p>
              <b>UNI XML&XSLT</b> client-side dönüşüm kullanır. Verileriniz asla sunucuya
              gönderilmez.
            </p>
            <p className="text-slate-600">© 2026 Devatek | Açık Kaynak</p>
          </div>
        </section>
      </div>
    </div>
  );
}
