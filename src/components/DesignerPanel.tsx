import { Sliders, Palette, Type, Layout, Wand2 } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

export function DesignerPanel() {
  const {
    selectedElement,
    watermarkText,
    watermarkColor,
    watermarkRotation,
    watermarkVisible,
    themePrimaryColor,
    setThemePrimaryColor,
  } = useEditorStore();

  if (!selectedElement) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-slate-400 p-4">
        <Sliders className="w-12 h-12 mb-3 opacity-50" />
        <p className="text-sm text-center">Preview'dan bir element seçin</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-auto">
      {/* Selected Element Info */}
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 sticky top-0">
        <div className="text-xs font-bold text-slate-300 mb-1">Seçili Element</div>
        <div className="text-xs text-slate-400 font-mono break-all">{selectedElement.selector}</div>
      </div>

      {/* Style Controls */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Typography */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <Type className="w-4 h-4" />
            Yazı Stili
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-2">Yazı Boyutu</label>
            <input
              type="text"
              value={selectedElement.styles.fontSize}
              onChange={() => {}}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder="16px"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              className={`p-2 rounded text-xs font-bold transition ${
                selectedElement.styles.fontWeight === 'bold'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Kalın"
            >
              B
            </button>
            <button
              className={`p-2 rounded text-xs font-bold italic transition ${
                selectedElement.styles.fontStyle === 'italic'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="İtalik"
            >
              I
            </button>
            <button
              className={`p-2 rounded text-xs font-bold underline transition ${
                selectedElement.styles.textDecoration === 'underline'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Altı Çizili"
            >
              U
            </button>
          </div>
        </section>

        {/* Colors */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <Palette className="w-4 h-4" />
            Renkler
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-2">Metin Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={selectedElement.styles.color}
                onChange={() => {}}
                className="w-10 h-9 rounded border border-slate-700 cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement.styles.color}
                onChange={() => {}}
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-2">Tema Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={themePrimaryColor}
                onChange={(e) => setThemePrimaryColor(e.target.value)}
                className="w-10 h-9 rounded border border-slate-700 cursor-pointer"
              />
              <input
                type="text"
                value={themePrimaryColor}
                onChange={(e) => setThemePrimaryColor(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <Layout className="w-4 h-4" />
            Boşluk
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-2">Padding</label>
            <input
              type="text"
              value={selectedElement.styles.padding}
              onChange={() => {}}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder="8px"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-2">Margin</label>
            <input
              type="text"
              value={selectedElement.styles.margin}
              onChange={() => {}}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder="4px"
            />
          </div>
        </section>

        {/* Watermark */}
        <section className="space-y-3 border-t border-slate-700 pt-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <Wand2 className="w-4 h-4" />
            Filigran
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={watermarkVisible}
              onChange={() => {}}
              className="rounded cursor-pointer"
            />
            <label className="text-xs text-slate-400">Görünür</label>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-2">Metin</label>
            <input
              type="text"
              value={watermarkText}
              onChange={() => {}}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-2">Renk</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={watermarkColor}
                onChange={() => {}}
                className="w-10 h-9 rounded border border-slate-700 cursor-pointer"
              />
              <input
                type="text"
                value={watermarkColor}
                onChange={() => {}}
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
              onChange={() => {}}
              className="w-full"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
