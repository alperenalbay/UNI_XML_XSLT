import React, { useRef, useEffect } from 'react';
import { Eye, Code } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

interface PreviewPanelProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  srcDocValue: string;
  onTabChange: (tab: 'preview' | 'html' | 'logs') => void;
}

export function PreviewPanel({ iframeRef, srcDocValue, onTabChange }: PreviewPanelProps) {
  const {
    previewActiveTab,
    setPreviewActiveTab,
    zoomPercent,
    setZoomPercent,
    isAutoFit,
    setIsAutoFit,
    htmlOutput,
    errorMsg,
  } = useEditorStore();

  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewActiveTab !== 'preview') return;

    const handleResize = () => {
      if (previewContainerRef.current && isAutoFit) {
        const width = previewContainerRef.current.clientWidth;
        const availableWidth = width - 32;
        if (availableWidth > 0) {
          const fitScale = Math.min(100, Math.floor((availableWidth / 794) * 100));
          setZoomPercent(Math.max(30, fitScale));
        }
      }
    };

    handleResize();

    const observer = new ResizeObserver(handleResize);
    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [previewActiveTab, isAutoFit, setZoomPercent]);

  const handleTabClick = (tab: 'preview' | 'html' | 'logs') => {
    setPreviewActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Tab Navigation */}
      <div className="flex gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
        <button
          onClick={() => handleTabClick('preview')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition ${
            previewActiveTab === 'preview'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>

        <button
          onClick={() => handleTabClick('html')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition ${
            previewActiveTab === 'html'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Code className="w-4 h-4" />
          HTML
        </button>

        <button
          onClick={() => handleTabClick('logs')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition ${
            previewActiveTab === 'logs'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:bg-slate-700'
          }`}
        >
          Logs
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {previewActiveTab === 'preview' && (
          <div
            ref={previewContainerRef}
            className="w-full h-full bg-slate-950 overflow-auto flex flex-col items-center"
          >
            {/* Zoom Controls */}
            <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-700">
              <button
                onClick={() => setIsAutoFit(!isAutoFit)}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  isAutoFit
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Auto Fit
              </button>

              <input
                type="range"
                min="30"
                max="150"
                value={zoomPercent}
                onChange={(e) => setZoomPercent(Number(e.target.value))}
                className="w-32"
              />

              <span className="text-sm text-slate-400">{zoomPercent}%</span>
            </div>

            {/* Preview Content */}
            <iframe
              ref={iframeRef}
              srcDoc={srcDocValue}
              className="flex-1 w-full border-0 bg-slate-950"
              sandbox=""
              title="Preview"
            />
          </div>
        )}

        {previewActiveTab === 'html' && (
          <div className="w-full h-full overflow-auto bg-slate-950 p-4">
            <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap break-words">
              {htmlOutput || (errorMsg ? `Error: ${errorMsg}` : 'No output')}
            </pre>
          </div>
        )}

        {previewActiveTab === 'logs' && (
          <div className="w-full h-full overflow-auto bg-slate-950 p-4">
            <div className="text-slate-400 text-sm">
              <p>Template Library, Logs ve durum bilgileri burada gösterilecek.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
