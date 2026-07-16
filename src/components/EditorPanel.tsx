import React from 'react';
import Editor from '@monaco-editor/react';
import { FileCode, AlertTriangle } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

interface EditorPanelProps {
  xmlEditorRef: React.RefObject<any>;
  xsltEditorRef: React.RefObject<any>;
  onXmlChange: (value: string) => void;
  onXsltChange: (value: string) => void;
}

export function EditorPanel({
  xmlEditorRef,
  xsltEditorRef,
  onXmlChange,
  onXsltChange,
}: EditorPanelProps) {
  const {
    xmlContent,
    xsltContent,
    editorActiveTab,
    setEditorActiveTab,
    editorLayout,
    validationStatus,
  } = useEditorStore();

  const editorCommonProps = {
    theme: 'vs-dark',
    options: {
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on' as const,
      fontSize: 13,
      fontFamily: "'Fira Code', 'Monaco', monospace",
      formatOnPaste: true,
      formatOnType: true,
    },
  };

  // Tabbed Layout
  if (editorLayout === 'tabbed') {
    return (
      <div className="flex flex-col h-full bg-slate-900">
        {/* Tab Navigation */}
        <div className="flex gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
          <button
            onClick={() => setEditorActiveTab('xml')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition ${
              editorActiveTab === 'xml'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-700'
            }`}
          >
            <FileCode className="w-4 h-4" />
            XML
            {!validationStatus.xmlValid && (
              <AlertTriangle className="w-3 h-3 text-red-500" />
            )}
          </button>

          <button
            onClick={() => setEditorActiveTab('xslt')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition ${
              editorActiveTab === 'xslt'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-700'
            }`}
          >
            <FileCode className="w-4 h-4" />
            XSLT
            {!validationStatus.xsltValid && (
              <AlertTriangle className="w-3 h-3 text-red-500" />
            )}
          </button>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-hidden">
          {editorActiveTab === 'xml' && (
            <Editor
              height="100%"
              language="xml"
              value={xmlContent}
              onChange={(value) => onXmlChange(value || '')}
              onMount={(editor) => {
                xmlEditorRef.current = editor;
              }}
              {...editorCommonProps}
            />
          )}

          {editorActiveTab === 'xslt' && (
            <Editor
              height="100%"
              language="xml"
              value={xsltContent}
              onChange={(value) => onXsltChange(value || '')}
              onMount={(editor) => {
                xsltEditorRef.current = editor;
              }}
              {...editorCommonProps}
            />
          )}
        </div>
      </div>
    );
  }

  // Split Layout
  return (
    <div className="flex h-full gap-1 bg-slate-900">
      {/* XML Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">XML</span>
          {!validationStatus.xmlValid && (
            <AlertTriangle className="w-3 h-3 text-red-500 ml-auto" />
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language="xml"
            value={xmlContent}
            onChange={(value) => onXmlChange(value || '')}
            onMount={(editor) => {
              xmlEditorRef.current = editor;
            }}
            {...editorCommonProps}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="w-1 bg-slate-700 cursor-col-resize hover:bg-blue-500 transition" />

      {/* XSLT Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">XSLT</span>
          {!validationStatus.xsltValid && (
            <AlertTriangle className="w-3 h-3 text-red-500 ml-auto" />
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language="xml"
            value={xsltContent}
            onChange={(value) => onXsltChange(value || '')}
            onMount={(editor) => {
              xsltEditorRef.current = editor;
            }}
            {...editorCommonProps}
          />
        </div>
      </div>
    </div>
  );
}
