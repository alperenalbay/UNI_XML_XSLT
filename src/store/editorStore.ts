import { create } from 'zustand';

export interface ValidationStatus {
  xmlValid: boolean;
  xsltValid: boolean;
  xmlError?: string;
  xsltError?: string;
}

export interface SelectedElementDetails {
  selector: string;
  elementName: string;
  details: any;
  styles: {
    margin: string;
    padding: string;
    fontSize: string;
    color: string;
    width: string;
    textAlign: string;
    fontWeight: string;
    fontStyle: string;
    textDecoration: string;
  };
}

export interface CustomTemplate {
  name: string;
  fileName: string;
  content: string;
}

export interface EditorState {
  // XML & XSLT Content
  xmlContent: string;
  xsltContent: string;
  
  // Transform Output
  htmlOutput: string;
  errorMsg: string | undefined;
  
  // Navigation & UI
  editorActiveTab: 'xml' | 'xslt' | 'designer';
  previewActiveTab: 'preview' | 'html' | 'logs';
  editorLayout: 'tabbed' | 'split';
  autoRefresh: boolean;
  isCopied: boolean;
  validationStatus: ValidationStatus;
  
  // Preview & Zoom
  zoomPercent: number;
  editorWidthPercent: number;
  isAutoFit: boolean;
  
  // Inspector & Designer
  inspectorActive: boolean;
  designerActive: boolean;
  inspectorStatus: string | null;
  
  // Selected Element (for WYSIWYG Styler)
  selectedElement: SelectedElementDetails | null;
  
  // Watermark
  watermarkText: string;
  watermarkRotation: number;
  watermarkVisible: boolean;
  watermarkColor: string;
  
  // Theme
  themePrimaryColor: string;
  appTheme: 'linear' | 'vercel' | 'forest' | 'stripe' | 'notion';
  
  // Language
  invoiceLanguage: 'tr' | 'en';
  
  // Templates
  customTemplates: CustomTemplate[];
  saveTemplateName: string;
  isSavingTemplate: boolean;
  
  // Updates
  updateAvailable: boolean;
  isUpdating: boolean;
  updateCheckStatus: string | null;
  
  // UI Flags
  isDragging: boolean;
  hasDismissedXslt: boolean;
  iframeLogs: string[];
}

export interface EditorActions {
  // Content setters
  setXmlContent: (content: string) => void;
  setXsltContent: (content: string) => void;
  setHtmlOutput: (html: string) => void;
  setErrorMsg: (error: string | undefined) => void;
  
  // Navigation
  setEditorActiveTab: (tab: 'xml' | 'xslt' | 'designer') => void;
  setPreviewActiveTab: (tab: 'preview' | 'html' | 'logs') => void;
  setEditorLayout: (layout: 'tabbed' | 'split') => void;
  setAutoRefresh: (auto: boolean) => void;
  setIsCopied: (copied: boolean) => void;
  setValidationStatus: (status: ValidationStatus) => void;
  
  // Preview & Zoom
  setZoomPercent: (zoom: number | ((prev: number) => number)) => void;
  setEditorWidthPercent: (width: number) => void;
  setIsAutoFit: (fit: boolean) => void;
  
  // Inspector & Designer
  setInspectorActive: (active: boolean) => void;
  setDesignerActive: (active: boolean) => void;
  setInspectorStatus: (status: string | null) => void;
  
  // Selected Element
  setSelectedElement: (element: SelectedElementDetails | null) => void;
  clearSelectedElement: () => void;
  
  // Watermark
  setWatermarkText: (text: string) => void;
  setWatermarkRotation: (rotation: number) => void;
  setWatermarkVisible: (visible: boolean) => void;
  setWatermarkColor: (color: string) => void;
  
  // Theme
  setThemePrimaryColor: (color: string) => void;
  setAppTheme: (theme: 'linear' | 'vercel' | 'forest' | 'stripe' | 'notion') => void;
  
  // Language
  setInvoiceLanguage: (lang: 'tr' | 'en') => void;
  
  // Templates
  setCustomTemplates: (templates: CustomTemplate[]) => void;
  setSaveTemplateName: (name: string) => void;
  setIsSavingTemplate: (saving: boolean) => void;
  
  // Updates
  setUpdateAvailable: (available: boolean) => void;
  setIsUpdating: (updating: boolean) => void;
  setUpdateCheckStatus: (status: string | null) => void;
  
  // UI Flags
  setIsDragging: (dragging: boolean) => void;
  setHasDismissedXslt: (dismissed: boolean) => void;
  setIframeLogs: (logs: string[] | ((prev: string[]) => string[])) => void;
  
  // Batch operations
  resetToDefaults: (xml: string, xslt: string) => void;
}

const initialState: EditorState = {
  xmlContent: '',
  xsltContent: '',
  htmlOutput: '',
  errorMsg: undefined,
  
  editorActiveTab: 'xml',
  previewActiveTab: 'preview',
  editorLayout: 'tabbed',
  autoRefresh: true,
  isCopied: false,
  validationStatus: { xmlValid: true, xsltValid: true },
  
  zoomPercent: 85,
  editorWidthPercent: 42,
  isAutoFit: true,
  
  inspectorActive: false,
  designerActive: false,
  inspectorStatus: null,
  
  selectedElement: null,
  
  watermarkText: 'ÖDENDİ',
  watermarkRotation: -15,
  watermarkVisible: true,
  watermarkColor: '#ef4444',
  
  themePrimaryColor: '#4f46e5',
  appTheme: 'linear',
  invoiceLanguage: 'tr',
  
  customTemplates: [],
  saveTemplateName: '',
  isSavingTemplate: false,
  
  updateAvailable: false,
  isUpdating: false,
  updateCheckStatus: null,
  
  isDragging: false,
  hasDismissedXslt: false,
  iframeLogs: [],
};

export const useEditorStore = create<EditorState & EditorActions>((set) => ({
  ...initialState,
  
  setXmlContent: (content: string) => set({ xmlContent: content }),
  setXsltContent: (content: string) => set({ xsltContent: content }),
  setHtmlOutput: (html: string) => set({ htmlOutput: html }),
  setErrorMsg: (error: string | undefined) => set({ errorMsg: error }),
  
  setEditorActiveTab: (tab: 'xml' | 'xslt' | 'designer') => set({ editorActiveTab: tab }),
  setPreviewActiveTab: (tab: 'preview' | 'html' | 'logs') => set({ previewActiveTab: tab }),
  setEditorLayout: (layout: 'tabbed' | 'split') => set({ editorLayout: layout }),
  setAutoRefresh: (auto: boolean) => set({ autoRefresh: auto }),
  setIsCopied: (copied: boolean) => set({ isCopied: copied }),
  setValidationStatus: (status: ValidationStatus) => set({ validationStatus: status }),
  
  setZoomPercent: (zoom: number | ((prev: number) => number)) => set((state) => ({
    zoomPercent: typeof zoom === 'function' ? zoom(state.zoomPercent) : zoom
  })),
  setEditorWidthPercent: (width: number) => set({ editorWidthPercent: width }),
  setIsAutoFit: (fit: boolean) => set({ isAutoFit: fit }),
  
  setInspectorActive: (active: boolean) => set({ inspectorActive: active }),
  setDesignerActive: (active: boolean) => set({ designerActive: active }),
  setInspectorStatus: (status: string | null) => set({ inspectorStatus: status }),
  
  setSelectedElement: (element: SelectedElementDetails | null) => set({ selectedElement: element }),
  clearSelectedElement: () => set({ selectedElement: null }),
  
  setWatermarkText: (text: string) => set({ watermarkText: text }),
  setWatermarkRotation: (rotation: number) => set({ watermarkRotation: rotation }),
  setWatermarkVisible: (visible: boolean) => set({ watermarkVisible: visible }),
  setWatermarkColor: (color: string) => set({ watermarkColor: color }),
  
  setThemePrimaryColor: (color: string) => set({ themePrimaryColor: color }),
  setAppTheme: (theme: 'linear' | 'vercel' | 'forest' | 'stripe' | 'notion') => set({ appTheme: theme }),
  setInvoiceLanguage: (lang: 'tr' | 'en') => set({ invoiceLanguage: lang }),
  
  setCustomTemplates: (templates: CustomTemplate[]) => set({ customTemplates: templates }),
  setSaveTemplateName: (name: string) => set({ saveTemplateName: name }),
  setIsSavingTemplate: (saving: boolean) => set({ isSavingTemplate: saving }),
  
  setUpdateAvailable: (available: boolean) => set({ updateAvailable: available }),
  setIsUpdating: (updating: boolean) => set({ isUpdating: updating }),
  setUpdateCheckStatus: (status: string | null) => set({ updateCheckStatus: status }),
  
  setIsDragging: (dragging: boolean) => set({ isDragging: dragging }),
  setHasDismissedXslt: (dismissed: boolean) => set({ hasDismissedXslt: dismissed }),
  setIframeLogs: (logs: string[] | ((prev: string[]) => string[])) => set((state) => ({
    iframeLogs: typeof logs === 'function' ? logs(state.iframeLogs) : logs
  })),
  
  resetToDefaults: (xml: string, xslt: string) => set({
    xmlContent: xml,
    xsltContent: xslt,
    htmlOutput: '',
    errorMsg: undefined,
    selectedElement: null,
    iframeLogs: [],
  }),
}));
