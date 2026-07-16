import {
  RefreshCw,
  Download,
  Upload,
  Printer,
  CheckCircle,
  AlertTriangle,
  Columns,
  Layout,
} from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

interface EditorToolbarProps {
  onRefresh: () => void;
  onDownloadXml: () => void;
  onDownloadXslt: () => void;
  onUploadXml: () => void;
  onUploadXslt: () => void;
  onPrint: () => void;
}

export function EditorToolbar({
  onRefresh,
  onDownloadXml,
  onDownloadXslt,
  onUploadXml,
  onUploadXslt,
  onPrint,
}: EditorToolbarProps) {
  const {
    autoRefresh,
    setAutoRefresh,
    editorLayout,
    setEditorLayout,
    validationStatus,
  } = useEditorStore();

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
      {/* Validation Status */}
      <div className="flex items-center gap-2 mr-4 text-sm">
        {validationStatus.xmlValid ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-red-500" />
        )}
        <span className="text-slate-300">
          {validationStatus.xmlValid ? 'XML ✓' : 'XML Error'}
        </span>
      </div>

      {/* Auto Refresh Toggle */}
      <button
        onClick={() => setAutoRefresh(!autoRefresh)}
        className={`p-2 rounded hover:bg-slate-700 transition ${
          autoRefresh ? 'bg-slate-700 text-blue-400' : 'text-slate-400'
        }`}
        title="Auto Refresh"
      >
        <RefreshCw className="w-4 h-4" />
      </button>

      {/* Layout Toggle */}
      <button
        onClick={() => setEditorLayout(editorLayout === 'split' ? 'tabbed' : 'split')}
        className="p-2 rounded hover:bg-slate-700 text-slate-400 transition"
        title="Toggle Layout"
      >
        {editorLayout === 'split' ? (
          <Columns className="w-4 h-4" />
        ) : (
          <Layout className="w-4 h-4" />
        )}
      </button>

      <div className="border-l border-slate-700 h-6 mx-2" />

      {/* Download Buttons */}
      <button
        onClick={onDownloadXml}
        className="p-2 rounded hover:bg-slate-700 text-slate-400 transition"
        title="Download XML"
      >
        <Download className="w-4 h-4" />
      </button>

      <button
        onClick={onDownloadXslt}
        className="p-2 rounded hover:bg-slate-700 text-slate-400 transition"
        title="Download XSLT"
      >
        <Download className="w-4 h-4" />
      </button>

      {/* Upload Buttons */}
      <button
        onClick={onUploadXml}
        className="p-2 rounded hover:bg-slate-700 text-slate-400 transition"
        title="Upload XML"
      >
        <Upload className="w-4 h-4" />
      </button>

      <button
        onClick={onUploadXslt}
        className="p-2 rounded hover:bg-slate-700 text-slate-400 transition"
        title="Upload XSLT"
      >
        <Upload className="w-4 h-4" />
      </button>

      <div className="border-l border-slate-700 h-6 mx-2" />

      {/* Print & Refresh */}
      <button
        onClick={onPrint}
        className="p-2 rounded hover:bg-slate-700 text-slate-400 transition"
        title="Print"
      >
        <Printer className="w-4 h-4" />
      </button>

      <button
        onClick={onRefresh}
        className="p-2 rounded hover:bg-slate-700 text-slate-400 transition"
        title="Refresh Transform"
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  );
}
