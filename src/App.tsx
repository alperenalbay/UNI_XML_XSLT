import { useState, useEffect, useRef, useMemo } from 'react'
import Editor from '@monaco-editor/react'
import { 
  FileCode, 
  RefreshCw, 
  Download, 
  Upload, 
  Printer, 
  CheckCircle, 
  AlertTriangle, 
  Columns, 
  Layout, 
  Sparkles, 
  Trash2, 
  Eye, 
  Code, 
  Info,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Target,
  FilePlus2,
  Plus,
  Compass,
  LayoutGrid,
  RotateCw,
  Sliders,
  Palette,
  Languages,
  Edit3
} from 'lucide-react'
import { 
  transformXmlWithXslt, 
  extractEmbeddedXslt, 
  removeEmbeddedXslt,
  updateXsltStyle,
  getXsltStyleValue,
  updateXsltText,
  updateElementTextInXsltById,
  updateElementStyleInXsltById,
  swapXsltElements,
  updateWatermarkTextInXslt,
  addElementToXslt,
  removeElementFromXslt
} from './utils/xsltTransformer'
import { DEFAULT_XML, DEFAULT_XSLT, SIMPLE_XSLT, EMPTY_XSLT } from './samples/invoiceSample'


function App() {
  // XML & XSLT State
  const [xmlContent, setXmlContent] = useState<string>(DEFAULT_XML)
  const [xsltContent, setXsltContent] = useState<string>(DEFAULT_XSLT)
  
  // Transform Output State
  const [htmlOutput, setHtmlOutput] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined)
  
  // Navigation & UI States
  const [editorActiveTab, setEditorActiveTab] = useState<'xml' | 'xslt' | 'designer'>('xml')
  const [previewActiveTab, setPreviewActiveTab] = useState<'preview' | 'html' | 'logs'>('preview')
  const [editorLayout, setEditorLayout] = useState<'tabbed' | 'split'>('split')
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [validationStatus, setValidationStatus] = useState<{
    xmlValid: boolean;
    xsltValid: boolean;
    xmlError?: string;
    xsltError?: string;
  }>({ xmlValid: true, xsltValid: true })

  // A4 Preview & Zoom States
  const [previewLayout] = useState<'A4' | 'fit'>('A4')
  const [zoomPercent, setZoomPercent] = useState<number>(85)
  const [editorWidthPercent, setEditorWidthPercent] = useState<number>(42)
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true)

  // Inspector & Designer States
  const [inspectorActive, setInspectorActive] = useState<boolean>(false)
  const [designerActive, setDesignerActive] = useState<boolean>(false)
  const [inspectorStatus, setInspectorStatus] = useState<string | null>(null)

  // Selected Element Details (for WYSIWYG Styler)
  const [selectedSelector, setSelectedSelector] = useState<string>('')
  const [selectedElementName, setSelectedElementName] = useState<string>('')
  const [selectedElementDetails, setSelectedElementDetails] = useState<any>(null)

  // CSS values for Selected Element
  const [styleMargin, setStyleMargin] = useState<string>('')
  const [stylePadding, setStylePadding] = useState<string>('')
  const [styleFontSize, setStyleFontSize] = useState<string>('')
  const [styleColor, setStyleColor] = useState<string>('')
  const [styleWidth, setStyleWidth] = useState<string>('')
  const [styleTextAlign, setStyleTextAlign] = useState<string>('')
  
  // Bold, Italic, Underline styles
  const [styleFontWeight, setStyleFontWeight] = useState<string>('')
  const [styleFontStyle, setStyleFontStyle] = useState<string>('')
  const [styleTextDecoration, setStyleTextDecoration] = useState<string>('')

  // Watermark / Stamp Details
  const [watermarkText, setWatermarkText] = useState<string>('ÖDENDİ')
  const [watermarkRotation, setWatermarkRotation] = useState<number>(-15)
  const [watermarkVisible, setWatermarkVisible] = useState<boolean>(true)
  const [watermarkColor, setWatermarkColor] = useState<string>('#ef4444')
  
  // Theme color details
  const [themePrimaryColor, setThemePrimaryColor] = useState<string>('#4f46e5')

  // Language State
  const [invoiceLanguage, setInvoiceLanguage] = useState<'tr' | 'en'>('tr')

  // Custom template library states
  const [customTemplates, setCustomTemplates] = useState<Array<{ name: string, fileName: string, content: string }>>([])
  const [saveTemplateName, setSaveTemplateName] = useState('')
  const [isSavingTemplate, setIsSavingTemplate] = useState(false)

  const loadCustomTemplates = async () => {
    try {
      const res = await fetch('/api/list-templates')
      if (res.ok) {
        const data = await res.json()
        setCustomTemplates(data)
      }
    } catch (err) {
      console.error('Failed to load custom templates:', err)
    }
  }

  // Load custom templates on mount
  useEffect(() => {
    loadCustomTemplates()
  }, [])

  // Auto reload custom templates list when user visits Status Report tab
  useEffect(() => {
    if (previewActiveTab === 'logs') {
      loadCustomTemplates()
    }
  }, [previewActiveTab])

  // Auto updater states
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateCheckStatus, setUpdateCheckStatus] = useState<string | null>(null)

  const checkUpdates = async () => {
    try {
      const res = await fetch('/api/check-update')
      if (res.ok) {
        const data = await res.json()
        if (data.updateAvailable) {
          setUpdateAvailable(true)
        }
      }
    } catch (err) {
      console.error('Failed to check updates:', err)
    }
  }

  const triggerUpdate = async () => {
    setIsUpdating(true)
    setUpdateCheckStatus('Uygulama güncelleniyor (git pull & npm install)... Lütfen bu sayfayı kapatmayın.')
    try {
      const res = await fetch('/api/trigger-update', { method: 'POST' })
      if (res.ok) {
        setUpdateCheckStatus('Güncelleme başarıyla tamamlandı! Sayfa 3 saniye içinde yenilenecek.')
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      } else {
        const data = await res.json()
        alert(`Güncelleme başarısız oldu: ${data.error || 'Bilinmeyen hata'}`)
        setUpdateCheckStatus(null)
      }
    } catch (err) {
      console.error(err)
      alert('Güncelleme hatası oluştu.')
      setUpdateCheckStatus(null)
    } finally {
      setIsUpdating(false)
    }
  }

  // Load custom templates and check updates on mount
  useEffect(() => {
    checkUpdates()
  }, [])

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState<boolean>(false)

  // XSLT Banner State
  const [hasDismissedXslt, setHasDismissedXslt] = useState<boolean>(false)

  // Editor References
  const xmlEditorRef = useRef<any>(null)
  const xsltEditorRef = useRef<any>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)

  // Auto-fit A4 preview width to preview panel container width
  useEffect(() => {
    if (previewActiveTab !== 'preview') return

    const handleResize = () => {
      if (previewContainerRef.current && isAutoFit) {
        const width = previewContainerRef.current.clientWidth
        // 32px padding (16px left + 16px right)
        const availableWidth = width - 32
        if (availableWidth > 0) {
          // Calculate scale percentage to fit 210mm (794px)
          const fitScale = Math.min(100, Math.floor((availableWidth / 794) * 100))
          setZoomPercent(Math.max(30, fitScale))
        }
      }
    }

    handleResize()

    const observer = new ResizeObserver(handleResize)
    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [previewActiveTab, isAutoFit])

  // Apply visual zoom internally inside the iframe document
  useEffect(() => {
    const applyIframeZoom = () => {
      if (iframeRef.current && previewActiveTab === 'preview') {
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
        if (iframeDoc && iframeDoc.body) {
          const scale = zoomPercent / 100
          
          // Style the body as an A4 document sheet centered in the slate view
          iframeDoc.body.style.transform = `scale(${scale})`
          iframeDoc.body.style.transformOrigin = 'top center'
          iframeDoc.body.style.width = '210mm'
          iframeDoc.body.style.minHeight = '297mm'
          iframeDoc.body.style.margin = '24px auto'
          iframeDoc.body.style.padding = '10px'
          iframeDoc.body.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)'
          iframeDoc.body.style.backgroundColor = '#ffffff'
          iframeDoc.body.style.transition = 'transform 0.15s ease-out'
          
          // Set root HTML element styling of the iframe to fit the dark theme and scroll natively
          const htmlEl = iframeDoc.documentElement
          if (htmlEl) {
            htmlEl.style.backgroundColor = '#0b0f19' // matching slate-950
            htmlEl.style.overflowY = 'auto'
            htmlEl.style.height = '100%'
            htmlEl.style.padding = '0'
            htmlEl.style.margin = '0'
          }
        }
      }
    }

    const timer = setTimeout(applyIframeZoom, 100)
    return () => clearTimeout(timer)
  }, [zoomPercent, htmlOutput, previewActiveTab])

  const handleXmlEditorMount = (editor: any) => {
    xmlEditorRef.current = editor
  }

  const handleXsltEditorMount = (editor: any) => {
    xsltEditorRef.current = editor
  }

  // Unified functions to update XML & XSLT states and force Monaco editors in sync (prevents tab-switching loss)
  const updateXmlContent = (newVal: string) => {
    setXmlContent(newVal)
    if (xmlEditorRef.current) {
      const currentVal = xmlEditorRef.current.getValue()
      if (currentVal !== newVal) {
        xmlEditorRef.current.setValue(newVal)
      }
    }
  }

  const updateXsltContent = (newVal: string) => {
    setXsltContent(newVal)
    if (xsltEditorRef.current) {
      const currentVal = xsltEditorRef.current.getValue()
      if (currentVal !== newVal) {
        xsltEditorRef.current.setValue(newVal)
      }
    }
  }

  // XML / XSLT Syntax / Well-formedness check
  useEffect(() => {
    const parser = new DOMParser()
    let xmlValid = true
    let xmlError: string | undefined = undefined
    let xsltValid = true
    let xsltError: string | undefined = undefined

    if (xmlContent.trim()) {
      const xmlDoc = parser.parseFromString(xmlContent, 'application/xml')
      const err = xmlDoc.querySelector('parsererror')
      if (err) {
        xmlValid = false
        xmlError = err.textContent || 'Geçersiz XML Formatı'
      }
    } else {
      xmlValid = false
      xmlError = 'XML içeriği boş'
    }

    if (xsltContent.trim()) {
      const xsltDoc = parser.parseFromString(xsltContent, 'application/xml')
      const err = xsltDoc.querySelector('parsererror')
      if (err) {
        xmlValid = false
        xsltError = err.textContent || 'Geçersiz XSLT Formatı'
      }
    } else {
      xsltValid = false
      xsltError = 'XSLT içeriği boş'
    }

    setValidationStatus({ xmlValid, xsltValid, xmlError, xsltError })
  }, [xmlContent, xsltContent])

  // Perform Transform
  const runTransformation = () => {
    const result = transformXmlWithXslt(xmlContent, xsltContent)
    if (result.error) {
      setErrorMsg(result.error)
    } else {
      setErrorMsg(undefined)
      setHtmlOutput(result.html)
    }
  }

  // Auto Refresh Trigger
  useEffect(() => {
    if (autoRefresh) {
      const timer = setTimeout(() => {
        runTransformation()
      }, 400) // Debounce transform to avoid freezing Monaco
      return () => clearTimeout(timer)
    }
  }, [xmlContent, xsltContent, autoRefresh])

  // Reset dismiss state when XML changes
  useEffect(() => {
    setHasDismissedXslt(false)
  }, [xmlContent])

  // Memoize iframe HTML output to prevent reload/desync on state changes (e.g. selection click)
  const srcDocValue = useMemo(() => {
    if (errorMsg) {
      return `
        <html>
          <head>
            <style>
              body { font-family: system-ui, sans-serif; padding: 25px; color: #ef4444; background: #fef2f2; }
              pre { background: #fee2e2; padding: 15px; border-radius: 6px; border: 1px solid #fca5a5; overflow-x: auto; font-size: 13px; white-space: pre-wrap; word-wrap: break-word; }
              h3 { margin-top: 0; }
            </style>
          </head>
          <body>
            <h3>⚠️ Tasarım Dönüştürme Hatası</h3>
            <p>XML ve XSLT eşleştirilirken bir hata oluştu:</p>
            <pre>${errorMsg.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          </body>
        </html>
      `;
    }

    let rawHtml = htmlOutput;
    if (rawHtml) {
      const printStyles = `
        @media print {
          html, body {
            background: #ffffff !important;
            background-color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: auto !important;
            height: auto !important;
            min-height: 0 !important;
            box-shadow: none !important;
            transform: none !important;
          }
          .uni-selected-element {
            outline: none !important;
            box-shadow: none !important;
            border-color: transparent !important;
          }
        }
      `;
      const printStyleBlock = `<style id="uni-print-style">${printStyles}</style>`;
      rawHtml = rawHtml.replace('</head>', `${printStyleBlock}</head>`);
      
      let styleRules = '';
      if (inspectorActive) {
        styleRules = `
          *:not(html):not(body):hover {
            outline: 2px dashed #3b82f6 !important;
            outline-offset: -2px !important;
            cursor: pointer !important;
          }
        `;
      } else if (designerActive) {
        styleRules = `
          *:not(html):not(body):hover {
            outline: 2px dashed #a855f7 !important;
            outline-offset: -2px !important;
            cursor: pointer !important;
          }
          .uni-selected-element {
            outline: 3px solid #a855f7 !important;
            outline-offset: -1px !important;
            box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.2), 0 0 12px rgba(168, 85, 247, 0.6) !important;
            animation: selectPulse 2s infinite ease-in-out !important;
          }
          @keyframes selectPulse {
            0% { box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2), 0 0 6px rgba(168, 85, 247, 0.4) !important; }
            50% { box-shadow: 0 0 0 6px rgba(168, 85, 247, 0.3), 0 0 16px rgba(168, 85, 247, 0.8) !important; }
            100% { box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2), 0 0 6px rgba(168, 85, 247, 0.4) !important; }
          }
        `;
      }
      if (styleRules) {
        const inspectorStyle = `<style id="uni-interactivity-style">${styleRules}</style>`;
        rawHtml = rawHtml.replace('</head>', `${inspectorStyle}</head>`);
      }
    }
    return rawHtml || '<p style="padding: 20px; color: #64748b; font-family: sans-serif; text-align: center;">Dönüştürülmüş fatura görüntüsü burada görüntülenecektir.</p>';
  }, [htmlOutput, errorMsg, inspectorActive, designerActive])

  // Attach event listeners and apply layout sizing inside the iframe document on load
  const handleIframeLoad = () => {
    if (!iframeRef.current) return
    const innerDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
    if (!innerDoc) return

    // Apply document styling & scale
    const scale = zoomPercent / 100
    if (innerDoc.body) {
      innerDoc.body.style.transform = `scale(${scale})`
      innerDoc.body.style.transformOrigin = 'top center'
      innerDoc.body.style.width = '210mm'
      innerDoc.body.style.minHeight = '297mm'
      innerDoc.body.style.margin = '24px auto'
      innerDoc.body.style.padding = '10px'
      innerDoc.body.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)'
      innerDoc.body.style.backgroundColor = '#ffffff'
      innerDoc.body.style.transition = 'transform 0.15s ease-out'
    }
    
    const htmlEl = innerDoc.documentElement
    if (htmlEl) {
      htmlEl.style.backgroundColor = '#0b0f19'
      htmlEl.style.overflowY = 'auto'
      htmlEl.style.height = '100%'
      htmlEl.style.padding = '0'
      htmlEl.style.margin = '0'
    }

    // Attach listeners if inspector or designer is active
    if (!errorMsg && (inspectorActive || designerActive)) {
      
      // Click selection listener
      innerDoc.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        const target = e.target as HTMLElement
        if (!target) return

        let foundClass = ''
        let foundTagName = target.tagName.toLowerCase()
        let foundId = target.id

        if (target.className && typeof target.className === 'string') {
          const cleaned = target.className.replace('uni-selected-element', '').trim()
          if (cleaned) {
            foundClass = target.className
          }
        }

        innerDoc.querySelectorAll('.uni-selected-element').forEach(el => {
          el.classList.remove('uni-selected-element')
        })
        
        if (designerActive) {
          target.classList.add('uni-selected-element')
        }

        const text = target.innerText?.trim() || ''
        const win = innerDoc.defaultView
        const computed = win ? win.getComputedStyle(target) : {} as any
        const styles = {
          margin: target.style.margin || target.style.marginTop || computed.margin || computed.marginTop || '',
          padding: target.style.padding || target.style.paddingTop || computed.padding || computed.paddingTop || '',
          fontSize: target.style.fontSize || computed.fontSize || '',
          color: target.style.color || computed.color || '',
          width: target.style.width || computed.width || '',
          textAlign: target.style.textAlign || computed.textAlign || '',
          fontWeight: target.style.fontWeight || computed.fontWeight || '',
          fontStyle: target.style.fontStyle || computed.fontStyle || '',
          textDecoration: target.style.textDecoration || computed.textDecoration || ''
        }

        window.parent.postMessage({
          source: designerActive ? 'xslt-designer-click' : 'xslt-preview-inspector',
          text,
          className: foundClass || target.className || '',
          tagName: foundTagName,
          id: foundId || target.id || '',
          targetTagName: target.tagName.toLowerCase(),
          targetSrc: target.getAttribute('src') || '',
          targetHref: target.getAttribute('href') || '',
          xsltId: target.getAttribute('data-xslt-id') || '',
          styles
        }, '*')
      })

      // Double-click inline text editor listener
      innerDoc.addEventListener('dblclick', (e) => {
        const target = e.target as HTMLElement
        if (target && target.nodeType === Node.ELEMENT_NODE) {
          const textVal = (target.innerText || '').trim()
          if (!textVal) return

          if (target.children.length === 0 || xsltContent.includes(textVal)) {
            target.contentEditable = "true"
            target.focus()
            target.setAttribute('data-original-text', target.innerText || '')
            target.setAttribute('data-xslt-id-editable', target.getAttribute('data-xslt-id') || '')
          }
        }
      })

      // Focusout inline edit save listener
      innerDoc.addEventListener('focusout', (e) => {
        const target = e.target as HTMLElement
        if (target && target.contentEditable === "true") {
          target.contentEditable = "false"
          const original = target.getAttribute('data-original-text') || ''
          const current = target.innerText || ''
          const xsltId = target.getAttribute('data-xslt-id') || target.getAttribute('data-xslt-id-editable') || ''

          if (original.trim() !== current.trim()) {
            window.parent.postMessage({
              source: 'xslt-text-edit',
              original: original.trim(),
              current: current.trim(),
              xsltId
            }, '*')
          }
        }
      })
    }
  }

  // Sync Designer Toolbox values from current XSLT content
  useEffect(() => {
    // 1. Watermark Rotation
    const rot = getXsltStyleValue(xsltContent, '.watermark-stamp', 'transform')
    if (rot) {
      const match = rot.match(/rotate\(([-\d]+)deg\)/)
      if (match) setWatermarkRotation(parseInt(match[1]))
    }
    
    // 2. Watermark Visibility
    const disp = getXsltStyleValue(xsltContent, '.watermark-stamp', 'display')
    if (disp) {
      setWatermarkVisible(disp !== 'none')
    } else {
      setWatermarkVisible(xsltContent.includes('watermark-stamp'))
    }
    
    // 3. Watermark Color
    const color = getXsltStyleValue(xsltContent, '.watermark-stamp', 'color')
    if (color) {
      setWatermarkColor(color)
    }

    // 4. Primary Theme Color
    const themeColor = getXsltStyleValue(xsltContent, '.logo-section', 'color')
    if (themeColor) {
      setThemePrimaryColor(themeColor)
    }
    
    // 5. Watermark Text content
    const textStart = xsltContent.indexOf('<div class="watermark-stamp">')
    if (textStart !== -1) {
      const textEnd = xsltContent.indexOf('</div>', textStart)
      if (textEnd !== -1) {
        const textVal = xsltContent.substring(textStart + 29, textEnd)
        if (!textVal.includes('<')) {
          setWatermarkText(textVal.trim())
        }
      }
    }
  }, [xsltContent])

  // Heuristic Search and Jump in XSLT code editor
  const findLineInCode = (code: string, searchTerms: string[]): number => {
    const lines = code.split('\n')
    
    // 1. Exact match (case sensitive) in priority order
    for (const term of searchTerms) {
      if (!term.trim()) continue
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(term)) {
          return i + 1
        }
      }
    }
    
    // 2. Case-insensitive match fallback
    for (const term of searchTerms) {
      if (!term.trim()) continue
      const lower = term.toLowerCase()
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes(lower)) {
          return i + 1
        }
      }
    }
    return 1
  }

  const jumpToXsltLine = (line: number) => {
    setEditorActiveTab('xslt')
    if (xsltEditorRef.current) {
      xsltEditorRef.current.revealLineInCenter(line)
      xsltEditorRef.current.setPosition({ lineNumber: line, column: 1 })
      xsltEditorRef.current.focus()
    }
  }

  // Handle messages from the iframe (Text edits and selector clicks)
  useEffect(() => {
    const handleInspectorMessage = (event: MessageEvent) => {
      if (!event.data) return

      const { source, text, className, tagName, id, original, current, targetTagName, targetSrc, targetHref, xsltId, styles } = event.data

      // Case 1: In-place text modifications (Double clicked leaf texts)
      if (source === 'xslt-text-edit') {
        let updated = xsltContent
        if (xsltId) {
          updated = updateElementTextInXsltById(xsltContent, xsltId, current)
        } else {
          updated = updateXsltText(xsltContent, original, current)
        }
        
        if (updated !== xsltContent) {
          updateXsltContent(updated)
          setInspectorStatus(`Metin güncellendi: "${original.substring(0, 10)}..." ➜ "${current.substring(0, 15)}..."`)
          setTimeout(() => setInspectorStatus(null), 3000)
        } 
      }
      
      // Case 2: Click in Inspector mode (navigates code)
      else if (source === 'xslt-preview-inspector') {
        const searchTerms = getSearchTerms(id, className, text, tagName)
        if (searchTerms.length > 0) {
          const line = findLineInCode(xsltContent, searchTerms)
          if (line > 1) {
            jumpToXsltLine(line)
            setInspectorStatus(`Satır ${line} konumuna odaklanıldı (${text ? `"${text.substring(0, 12)}..."` : className || tagName})`)
            setTimeout(() => setInspectorStatus(null), 3000)
          }
        }
      } 
      
      // Case 3: Click in Designer mode (focuses selector & loads style panel - stays in designer tab!)
      else if (source === 'xslt-designer-click') {
        let sel = ''
        let elementName = ''

        if (id) {
          sel = `#${id}`
          elementName = `${tagName.toUpperCase()}${sel}`
        } else if (className && typeof className === 'string') {
          const classes = className.split(/\s+/).filter(c => c.trim().length > 1 && c !== 'hover' && c !== 'uni-selected-element')
          if (classes.length > 0) {
            sel = `.${classes[0]}`
            elementName = `${tagName.toUpperCase()}${sel}`
          }
        }

        if (!sel) {
          sel = tagName.toLowerCase()
          elementName = tagName.toUpperCase()
        }

        setSelectedSelector(sel)
        setSelectedElementName(elementName)
        setSelectedElementDetails({ targetTagName, targetSrc, targetHref, xsltId })
        
        // Extract current CSS property values from XSLT code (Prefer computed styles, fallback to XSLT style block)
        if (styles) {
          setStyleMargin(styles.margin || '')
          setStylePadding(styles.padding || '')
          setStyleFontSize(styles.fontSize ? styles.fontSize.replace('px', '') : '')
          setStyleColor(rgbToHex(styles.color) || '#000000')
          setStyleWidth(styles.width || '')
          setStyleTextAlign(styles.textAlign || 'left')
          setStyleFontWeight(styles.fontWeight || 'normal')
          setStyleFontStyle(styles.fontStyle || 'normal')
          setStyleTextDecoration(styles.textDecoration || 'none')
        } else {
          setStyleMargin(getXsltStyleValue(xsltContent, sel, 'margin') || getXsltStyleValue(xsltContent, sel, 'margin-top') || '')
          setStylePadding(getXsltStyleValue(xsltContent, sel, 'padding') || getXsltStyleValue(xsltContent, sel, 'padding-top') || '')
          setStyleFontSize(getXsltStyleValue(xsltContent, sel, 'font-size') || '')
          setStyleColor(getXsltStyleValue(xsltContent, sel, 'color') || '')
          setStyleWidth(getXsltStyleValue(xsltContent, sel, 'width') || '')
          setStyleTextAlign(getXsltStyleValue(xsltContent, sel, 'text-align') || '')
          setStyleFontWeight(getXsltStyleValue(xsltContent, sel, 'font-weight') || '')
          setStyleFontStyle(getXsltStyleValue(xsltContent, sel, 'font-style') || '')
          setStyleTextDecoration(getXsltStyleValue(xsltContent, sel, 'text-decoration') || '')
        }

        // Scroll code editor to element line silently in the background (DO NOT SWITCH TAB!)
        const searchTerms = getSearchTerms(id, className, text, tagName)
        if (searchTerms.length > 0) {
          const line = findLineInCode(xsltContent, searchTerms)
          if (line > 1 && xsltEditorRef.current) {
            xsltEditorRef.current.revealLineInCenter(line)
            xsltEditorRef.current.setPosition({ lineNumber: line, column: 1 })
          }
        }
      }
    }

    // Helper helper to generate search priorities
    const getSearchTerms = (id: string, className: any, text: string, tagName: string) => {
      const searchTerms: string[] = []
      if (id) {
        searchTerms.push(`id="${id}"`)
        searchTerms.push(`id='${id}'`)
      }
      if (className && typeof className === 'string') {
        const classes = className.split(/\s+/).filter(c => c.trim().length > 1 && c !== 'hover' && c !== 'uni-selected-element')
        classes.forEach(c => {
          searchTerms.push(`class="${c}"`)
          searchTerms.push(`class='${c}'`)
          searchTerms.push(`.${c}`)
        })
      }
      if (text && text.length > 2 && text.length < 40) {
        searchTerms.push(text.replace(/['"]/g, ''))
      }
      if (tagName) {
        searchTerms.push(`<${tagName}`)
      }
      return searchTerms
    }

    window.addEventListener('message', handleInspectorMessage)
    return () => window.removeEventListener('message', handleInspectorMessage)
  }, [xsltContent, designerActive, inspectorActive])

  // Helper to convert rgb(r, g, b) colors to #hex format for HTML5 color input
  const rgbToHex = (rgbString: string): string => {
    if (!rgbString) return ''
    if (rgbString.startsWith('#')) return rgbString
    const match = rgbString.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i)
    if (match) {
      const r = parseInt(match[1], 10)
      const g = parseInt(match[2], 10)
      const b = parseInt(match[3], 10)
      return '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('')
    }
    const matchRgba = rgbString.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/i)
    if (matchRgba) {
      const r = parseInt(matchRgba[1], 10)
      const g = parseInt(matchRgba[2], 10)
      const b = parseInt(matchRgba[3], 10)
      return '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('')
    }
    return rgbString
  }

  // Handle WYSIWYG style edits from inputs
  const handleStyleChange = (property: string, value: string) => {
    if (!selectedSelector && !selectedElementDetails?.xsltId) return
    
    // Local state sync
    if (property === 'margin') setStyleMargin(value)
    else if (property === 'padding') setStylePadding(value)
    else if (property === 'font-size') setStyleFontSize(value)
    else if (property === 'color') setStyleColor(value)
    else if (property === 'width') setStyleWidth(value)
    else if (property === 'text-align') setStyleTextAlign(value)
    else if (property === 'font-weight') setStyleFontWeight(value)
    else if (property === 'font-style') setStyleFontStyle(value)
    else if (property === 'text-decoration') setStyleTextDecoration(value)
    
    // Write style changes back into Monaco editor (Prefer element ID inline style, fallback to style block)
    let updated = xsltContent
    if (selectedElementDetails?.xsltId) {
      updated = updateElementStyleInXsltById(xsltContent, selectedElementDetails.xsltId, property, value)
    } else if (selectedSelector) {
      updated = updateXsltStyle(xsltContent, selectedSelector, property, value)
    }

    if (updated !== xsltContent) {
      updateXsltContent(updated)
    }
  }

  // Watermark/Stamp handlers
  const handleWatermarkTextChange = (newVal: string) => {
    setWatermarkText(newVal)
    // Secure XML DOM based replacement to avoid file corruption
    const updated = updateWatermarkTextInXslt(xsltContent, newVal)
    if (updated !== xsltContent) {
      updateXsltContent(updated)
    }
  }

  const handleWatermarkRotationChange = (deg: number) => {
    setWatermarkRotation(deg)
    const updated = updateXsltStyle(xsltContent, '.watermark-stamp', 'transform', `rotate(${deg}deg)`)
    if (updated !== xsltContent) {
      updateXsltContent(updated)
    }
  }

  const handleWatermarkVisibilityChange = (visible: boolean) => {
    setWatermarkVisible(visible)
    const updated = updateXsltStyle(xsltContent, '.watermark-stamp', 'display', visible ? 'block' : 'none')
    if (updated !== xsltContent) {
      updateXsltContent(updated)
    }
  }

  const handleWatermarkColorChange = (color: string) => {
    setWatermarkColor(color)
    let updated = updateXsltStyle(xsltContent, '.watermark-stamp', 'color', color)
    updated = updateXsltStyle(updated, '.watermark-stamp', 'border-color', color)
    if (updated !== xsltContent) {
      updateXsltContent(updated)
    }
  }

  // Theme primary color handler
  const handleThemeColorChange = (color: string) => {
    setThemePrimaryColor(color)
    let updated = updateXsltStyle(xsltContent, '.logo-section', 'color', color)
    updated = updateXsltStyle(updated, '.grand-total', 'color', color)
    updated = updateXsltStyle(updated, '.grand-total td', 'border-top', `2px solid ${color}`)
    if (updated !== xsltContent) {
      updateXsltContent(updated)
    }
  }

  // Swap columns handler
  const handleSwapSupplierCustomer = () => {
    const updated = swapXsltElements(xsltContent, 'supplier-col', 'customer-col')
    if (updated !== xsltContent) {
      updateXsltContent(updated)
      setInspectorStatus("Satıcı ve Alıcı kolonlarının yerleri değiştirildi.")
      setTimeout(() => setInspectorStatus(null), 3000)
    }
  }

  // Visual layout XML addition/removals
  const handleAddTextElement = (parentClass: string) => {
    const updated = addElementToXslt(xsltContent, parentClass, "Yeni Metin Alanı (Düzenlemek için çift tıklayın)")
    if (updated !== xsltContent) {
      updateXsltContent(updated)
      setInspectorStatus("Boş alana yeni metin kutusu eklendi.")
      setTimeout(() => setInspectorStatus(null), 3000)
    }
  }

  const handleRemoveElement = (selector: string, details?: any) => {
    if (!selector) return
    const updated = removeElementFromXslt(xsltContent, selector, details)
    if (updated !== xsltContent) {
      updateXsltContent(updated)
      setSelectedSelector('')
      setSelectedElementDetails(null)
      setInspectorStatus("Seçilen eleman tasarımdan silindi.")
      setTimeout(() => setInspectorStatus(null), 3000)
    }
  }

  const handleSaveCurrentAsTemplate = async () => {
    if (!saveTemplateName.trim()) {
      alert('Lütfen şablon için geçerli bir isim girin.')
      return
    }
    setIsSavingTemplate(true)
    try {
      const res = await fetch('/api/save-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: saveTemplateName.trim(),
          content: xsltContent
        })
      })
      if (res.ok) {
        setInspectorStatus(`"${saveTemplateName}" şablonu başarıyla kaydedildi.`)
        setTimeout(() => setInspectorStatus(null), 3000)
        setSaveTemplateName('')
        await loadCustomTemplates()
      } else {
        alert('Şablon kaydedilirken sunucu hatası oluştu.')
      }
    } catch (err) {
      console.error(err)
      alert('Şablon kaydedilemedi. Sunucu hatası.')
    } finally {
      setIsSavingTemplate(false)
    }
  }

  const handleEditTextElement = () => {
    const iframe = document.getElementById('xslt-preview-iframe') as HTMLIFrameElement
    if (!iframe) return
    const innerDoc = iframe.contentDocument || iframe.contentWindow?.document
    if (!innerDoc) return

    const selectedEl = innerDoc.querySelector('.uni-selected-element') as HTMLElement
    if (selectedEl) {
      const originalText = selectedEl.innerText || ''
      selectedEl.setAttribute('data-original-text', originalText)
      selectedEl.setAttribute('data-xslt-id-editable', selectedEl.getAttribute('data-xslt-id') || '')
      
      selectedEl.contentEditable = "true"
      selectedEl.focus()
      
      // Select text contents to make it easy to overwrite
      const range = innerDoc.createRange()
      range.selectNodeContents(selectedEl)
      const selection = iframe.contentWindow?.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }

      setInspectorStatus("Metin düzenleniyor... Çıkmak için Enter'a basın veya dışarıya tıklayın.")
      setTimeout(() => setInspectorStatus(null), 4000)
    } else {
      setInspectorStatus("Düzenlemek için lütfen önce faturadan bir metin alanı seçin.")
      setTimeout(() => setInspectorStatus(null), 3000)
    }
  }

  // Category Quick Jump triggers
  const quickJumpTo = (category: 'css' | 'supplier' | 'customer' | 'title' | 'items' | 'totals') => {
    let terms: string[] = []
    switch (category) {
      case 'css':
        terms = ['<style', 'css']
        break
      case 'supplier':
        terms = ['AccountingSupplierParty', 'Satıcı Bilgileri', 'Satıcı']
        break
      case 'customer':
        terms = ['AccountingCustomerParty', 'Alıcı Bilgileri', 'Alıcı']
        break
      case 'title':
        terms = ['cbc:ID', 'Fatura No', 'E-FATURA']
        break
      case 'items':
        terms = ['InvoiceLine', 'items-table', 'xsl:for-each']
        break
      case 'totals':
        terms = ['LegalMonetaryTotal', 'totals-table', 'grand-total']
        break
    }
    const line = findLineInCode(xsltContent, terms)
    if (line > 1) {
      jumpToXsltLine(line)
    }
  }

  // Upload Handler
  const handleFileUploadWrapper = (e: React.ChangeEvent<HTMLInputElement>, type: 'xml' | 'xslt') => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (type === 'xml') {
        updateXmlContent(content)
      } else {
        updateXsltContent(content)
      }
    }
    reader.readAsText(file)
  }

  // Drag and Drop Event Handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget === e.target) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target?.result as string
          if (file.name.endsWith('.xml')) {
            updateXmlContent(content)
            setEditorActiveTab('xml')
          } else if (file.name.endsWith('.xslt') || file.name.endsWith('.xsl')) {
            updateXsltContent(content)
            setEditorActiveTab('xslt')
          }
        }
        reader.readAsText(file)
      })
    }
  }

  // Actions
  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlOutput)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.focus()
      iframeRef.current.contentWindow?.print()
    }
  }

  const handleClear = (type: 'xml' | 'xslt') => {
    if (type === 'xml') updateXmlContent('')
    else updateXsltContent('')
  }

  const loadDefaultSample = () => {
    updateXmlContent(DEFAULT_XML)
    updateXsltContent(DEFAULT_XSLT)
    setErrorMsg(undefined)
    setInvoiceLanguage('tr')
  }

  const translateInvoiceContent = (targetLang: 'tr' | 'en') => {
    let content = xsltContent
    let xml = xmlContent
    
    // Mapping of terms [Turkish, English]
    const translationPairs: [string, string][] = [
      ['e-Arşiv Fatura', 'e-Archive Invoice'],
      ['e-FATURA', 'e-INVOICE'],
      ['E-FATURA', 'INVOICE'],
      ['E-Fatura Önizleme', 'E-Invoice Preview'],
      ['Sade Fatura Tablosu', 'Simple Invoice Table'],
      ['Yeni Şablon Tasarımı', 'New Template Design'],
      ['Özelleştirme No:', 'Customization No:'],
      ['Senaryo:', 'Scenario:'],
      ['Fatura Tipi:', 'Invoice Type:'],
      ['İlave Fatura Tipi:', 'Additional Invoice Type:'],
      ['Fatura No:', 'Invoice No:'],
      ['Fatura ID:', 'Invoice ID:'],
      ['Fatura Tarihi:', 'Invoice Date:'],
      ['Tarih:', 'Date:'],
      ['Zaman:', 'Time:'],
      ['Tür:', 'Type:'],
      ['Düzenleme Tarihi:', 'Issue Date:'],
      ['Düzenleme Zamanı:', 'Issue Time:'],
      ['Fiili Sevk Tarihi:', 'Actual Delivery Date:'],
      ['Son Ödeme Tarihi:', 'Payment Due Date:'],
      ['Ödeme Yapacak Kurum', 'Paying Institution'],
      ['Ödeme Şekli:', 'Payment Method:'],
      ['Ödeme Şekli', 'Payment Method'],
      ['Ödeme Tarihi:', 'Payment Date:'],
      ['Ödeme Tarihi', 'Payment Date'],
      ['Ödeme Notu:', 'Payment Note:'],
      ['Ödeme Notu', 'Payment Note'],
      ['Ödeme Koşulu:', 'Payment Term:'],
      ['Ödeme Koşulu', 'Payment Term'],
      ['Teslim/Bedel Ödeme Yeri', 'Delivery / Payment Location'],
      ['Satıcı Bilgileri', 'Supplier Details'],
      ['Alıcı Bilgileri', 'Customer Details'],
      ['Sayın', 'Dear'],
      ['SAYIN', 'DEAR'],
      ['Vergi Dairesi/No:', 'Tax Office/No:'],
      ['Vergi Dairesi:', 'Tax Office:'],
      ['VKN:', 'Tax ID (VKN):'],
      ['VKN/TCKN:', 'Tax ID / National ID:'],
      ['TCKN:', 'National ID:'],
      ['TCKN/VKN:', 'Tax / National ID:'],
      ['E-posta:', 'Email:'],
      ['E-Posta:', 'Email:'],
      ['Web Sitesi:', 'Website:'],
      ['Müşteri No:', 'Customer No:'],
      ['İadeye Konu Olan Faturalar', 'Invoices Subject to Return'],
      ['E-Fatura Bilgi Fişi', 'E-Invoice Info Sheet'],
      ['İrsaliye Yerine Geçen E-Fatura Bilgi Fişi', 'E-Invoice Info Sheet Replacing Delivery Note'],
      ['Faturalı Satış Bilgi Fişi', 'Invoiced Sales Info Sheet'],
      ['Fatura Tahsilat Bilgi Fişi', 'Invoice Collection Info Sheet'],
      ['Komisyonlu Fatura Tahsilat Bilgi Fişi', 'Commissioned Invoice Collection Info Sheet'],
      ['Sıra No', 'Line No'],
      ['Mal / Hizmet Açıklaması', 'Description of Goods / Services'],
      ['Mal/Hizmet Açıklaması', 'Description of Goods / Services'],
      ['Mal / Hizmet', 'Goods / Services'],
      ['Mal/Hizmet', 'Goods/Services'],
      ['Mal Hizmet Tutarı', 'Goods/Services Amount'],
      ['Mal Hizmet Toplam Tutarı', 'Total Goods/Services Amount'],
      ['Mal Hizmet', 'Goods/Services'],
      ['Miktar', 'Quantity'],
      ['Birim', 'Unit'],
      ['Birim Fiyat', 'Unit Price'],
      ['KDV Oranı (%)', 'VAT Rate (%)'],
      ['KDV Oranı ( % )', 'VAT Rate ( % )'],
      ['KDV Oranı', 'VAT Rate'],
      ['KDV Tutarı', 'VAT Amount'],
      ['Toplam Tutar', 'Total Amount'],
      ['Tutar', 'Amount'],
      ['Ara Toplam:', 'Subtotal:'],
      ['Ara Toplam', 'Subtotal'],
      ['Hesaplanan KDV', 'Calculated VAT'],
      ['Hesaplanan', 'Calculated'],
      ['KDV Toplamı:', 'Total VAT:'],
      ['KDV Toplamı', 'Total VAT'],
      ['Vergi Toplamı', 'Total Tax'],
      ['Ödenecek Tutar:', 'Total Payable:'],
      ['Ödenecek Tutar', 'Total Payable'],
      ['Ödenecek Toplam Tutar:', 'Total Payable Amount:'],
      ['Ödenecek Toplam Tutar', 'Total Payable Amount'],
      ['ÖDENDİ', 'PAID'],
      ['BASİT FATURA ÖNİZLEME', 'SIMPLE INVOICE PREVIEW'],
      ['Satıcı Unvan:', 'Supplier Name:'],
      ['Alıcı Unvan:', 'Customer Name:'],
      ['İskonto', 'Discount'],
      ['Toplam İskonto:', 'Total Discount:'],
      ['Toplam İskonto', 'Total Discount'],
      ['Vergiler Dahil Toplam Tutar:', 'Total Amount VAT Included:'],
      ['Vergiler Dahil Toplam Tutar', 'Total Amount VAT Included'],
      ['Vergiler Dahil Toplam Tutar(TL)', 'Total Amount VAT Included (TL)'],
      ['Vergiler Dahil Reçete Toplam Tutarı', 'Total Prescription Amount VAT Included'],
      ['Vergiler Hariç Reçete Toplam Tutarı', 'Total Prescription Amount VAT Excluded'],
      ['KDV Hariç Ödenecek Tutar', 'Payable Amount Excl. VAT'],
      ['Toplam Ödenecek Tutar', 'Total Payable Amount'],
      ['Ödenecek Tutar(TL)', 'Payable Amount (TL)'],
      ['KDV Dahil', 'VAT Included'],
      ['KDV Hariç', 'VAT Excluded'],
      ['Diğer Vergiler', 'Other Taxes'],
      ['Mal Hizmet Toplam Tutarı:', 'Total Goods/Services Amount:'],
      ['Mal Hizmet Toplam Tutarı', 'Total Goods/Amount'],
      ['Yalnız', 'Only'],
      ['YALNIZ', 'ONLY'],
      ['KDV', 'VAT'],
      ['Katma Değer Vergisi', 'Value Added Tax']
    ]

    // Safe word replacement checking boundary of Turkish and English alphanumeric chars
    const replaceWordSafe = (text: string, search: string, replacement: string): string => {
      const escaped = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      const trChars = 'a-zA-Z0-9çıüğşöİIĞÜŞÇÖ'
      const regex = new RegExp(`(?<![${trChars}])${escaped}(?![${trChars}])`, 'g')
      return text.replace(regex, replacement)
    }

    // Sort translation pairs by search word length in descending order
    // to prevent shorter substrings from corrupting longer phrases
    const sortedPairs = [...translationPairs].sort((a, b) => {
      const searchA = targetLang === 'en' ? a[0] : a[1]
      const searchB = targetLang === 'en' ? b[0] : b[1]
      return searchB.length - searchA.length
    })

    // Translate XSLT: Split document into HTML tags and text nodes
    const tokens = content.split(/(<[^>]+>)/g)
    let inStyleBlock = false
    
    for (let i = 0; i < tokens.length; i++) {
      if (i % 2 === 1) {
        // It's a tag, check if it starts/ends a style block
        const tag = tokens[i].toLowerCase()
        if (tag.startsWith('<style')) {
          inStyleBlock = true
        } else if (tag.startsWith('</style')) {
          inStyleBlock = false
        }
      } else {
        // It's a text node. Translate only if it's not inside a style block
        let text = tokens[i]
        if (text && !inStyleBlock) {
          if (targetLang === 'en') {
            sortedPairs.forEach(([tr, en]) => {
              text = replaceWordSafe(text, tr, en)
            })
          } else {
            sortedPairs.forEach(([tr, en]) => {
              text = replaceWordSafe(text, en, tr)
            })
          }
          tokens[i] = text
        }
      }
    }
    content = tokens.join('')

    // Translate XML as well so dynamic cbc:Name values (like KDV) get translated in standard ways
    const xmlTokens = xml.split(/(<[^>]+>)/g)
    for (let i = 0; i < xmlTokens.length; i++) {
      if (i % 2 === 0) { // Text node
        let text = xmlTokens[i]
        if (text) {
          if (targetLang === 'en') {
            sortedPairs.forEach(([tr, en]) => {
              text = replaceWordSafe(text, tr, en)
            })
          } else {
            sortedPairs.forEach(([tr, en]) => {
              text = replaceWordSafe(text, en, tr)
            })
          }
          xmlTokens[i] = text
        }
      }
    }
    xml = xmlTokens.join('')

    if (targetLang === 'en') {
      if (watermarkText === 'ÖDENDİ') {
        setWatermarkText('PAID')
      }
    } else {
      if (watermarkText === 'PAID') {
        setWatermarkText('ÖDENDİ')
      }
    }
    
    updateXsltContent(content)
    updateXmlContent(xml)
    setInvoiceLanguage(targetLang)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newPercent = (moveEvent.clientX / window.innerWidth) * 100
      setEditorWidthPercent(Math.max(25, Math.min(75, newPercent)))
    }

    const handleMouseUp = () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  // Embedded XSLT Check
  const embeddedXslt = extractEmbeddedXslt(xmlContent)
  const showXsltBanner = embeddedXslt !== null && embeddedXslt !== xsltContent && !hasDismissedXslt

  const handleApplyEmbeddedXslt = () => {
    if (embeddedXslt) {
      updateXsltContent(embeddedXslt)
      setEditorActiveTab('xslt')
      setHasDismissedXslt(true)
    }
  }

  const handleRemoveEmbeddedXslt = () => {
    const cleanedXml = removeEmbeddedXslt(xmlContent)
    updateXmlContent(cleanedXml)
    setHasDismissedXslt(true)
  }

  return (
    <div 
      className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Fullscreen Overlay */}
      {isDragging && (
        <div 
          className="fixed inset-0 z-[100] bg-indigo-950/85 backdrop-blur-md border-4 border-dashed border-indigo-500 flex flex-col items-center justify-center gap-4 transition duration-200"
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="p-8 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center gap-4 max-w-md">
            <div className="h-16 w-16 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-bounce">
              <Upload className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Dosyaları Buraya Bırakın</h3>
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              XML (Fatura) veya XSLT (Tasarım) dosyanızı sürükleyip bırakarak editörde anında açabilirsiniz.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <svg className="h-5 w-5 text-white animate-pulse" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 12V28C15 33 19 37 24 37C29 37 33 33 33 28V12" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent m-0 py-0 flex items-center gap-2">
              UNI XML&amp;XSLT
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-indigo-400">Canlı Editör</span>
            </h1>
            <p className="text-xs text-slate-500 m-0">E-Fatura &amp; E-Arşiv XML / XSLT Canlı Tasarım &amp; Test İstasyonu</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3">
          <button
            onClick={loadDefaultSample}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition duration-150 text-indigo-400 hover:text-indigo-300 cursor-pointer"
            title="Sistemdeki varsayılan e-fatura verilerini ve şablonunu yükler."
          >
            <Info className="h-3.5 w-3.5" />
            Varsayılan Şablonu Yükle
          </button>

          {updateAvailable && (
            <button
              onClick={triggerUpdate}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse transition cursor-pointer animate-duration-1000"
              title="Yeni güncellemeyi otomatik olarak indirir ve kurar."
            >
              <Sparkles className="h-3.5 w-3.5" />
              {isUpdating ? 'Güncelleniyor...' : 'Yeni Sürümü Yükle'}
            </button>
          )}

          <div className="h-4 w-px bg-slate-805" />

          {/* Auto transform status */}
          <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-900 px-3 py-1.5 rounded-lg">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${autoRefresh && !errorMsg ? 'bg-emerald-400' : errorMsg ? 'bg-rose-400' : 'bg-amber-405'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${autoRefresh && !errorMsg ? 'bg-emerald-500' : errorMsg ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {errorMsg ? 'Hata Mevcut' : 'Sistem Hazır'}
            </span>
          </div>
        </div>
      </header>

      {/* Embedded XSLT Warning Banner */}
      {showXsltBanner && (
        <div className="bg-indigo-950/80 border-b border-indigo-500/30 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-200 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40 shrink-0">
              <Sparkles className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">Gömülü Tasarım Şablonu (XSLT) Bulundu!</span>
              <p className="text-slate-400 m-0 mt-0.5">Yüklediğiniz XML dosyasında base64 formatında kodlanmış e-Fatura tasarım dosyası mevcut.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleApplyEmbeddedXslt}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition cursor-pointer"
            >
              Tasarımı Şablona Yükle
            </button>
            <button
              onClick={() => setHasDismissedXslt(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold border border-slate-800 transition cursor-pointer"
            >
              Yoksay
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-73px)]">
        
        <section 
          className="w-full lg:w-[var(--editor-width)] flex flex-col bg-slate-950 shrink-0 border-r border-slate-900"
          style={{ '--editor-width': `${editorWidthPercent}%` } as React.CSSProperties}
        >
          {/* Editors Tab Bar */}
          <div className="flex items-center justify-between border-b border-slate-900 bg-slate-900 px-4 py-2 shrink-0">
            <div className="flex gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-900">
              <button
                onClick={() => {
                  setEditorActiveTab('xml')
                  setDesignerActive(false)
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition duration-150 cursor-pointer ${
                  editorActiveTab === 'xml'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="h-3.5 w-3.5 text-blue-400" />
                XML Verisi
                {!validationStatus.xmlValid && (
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </button>
              <button
                onClick={() => {
                  setEditorActiveTab('xslt')
                  setDesignerActive(false)
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition duration-150 cursor-pointer ${
                  editorActiveTab === 'xslt'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="h-3.5 w-3.5 text-purple-400" />
                XSLT Tasarımı
                {!validationStatus.xsltValid && (
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </button>
              <button
                onClick={() => {
                  setEditorActiveTab('designer')
                  setDesignerActive(true)
                  setInspectorActive(false)
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition duration-150 cursor-pointer ${
                  editorActiveTab === 'designer'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
                Görsel Tasarımcı (Beta)
              </button>
            </div>

            {/* Layout Toggle and Editor Actions */}
            <div className="flex items-center gap-2">
              {editorActiveTab !== 'designer' && (
                <button
                  onClick={() => setEditorLayout(editorLayout === 'tabbed' ? 'split' : 'tabbed')}
                  className="p-1.5 rounded-md hover:bg-slate-900 border border-transparent hover:border-slate-805 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  title={editorLayout === 'tabbed' ? 'Editörleri Alt Alta Göster' : 'Editörleri Sekmeli Göster'}
                >
                  {editorLayout === 'tabbed' ? <Columns className="h-4 w-4" /> : <Layout className="h-4 w-4" />}
                </button>
              )}
              
              <div className="h-4 w-px bg-slate-805 mx-1" />

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-950 h-3.5 w-3.5"
                />
                <span className="text-xs text-slate-400 select-none">Oto Yenile</span>
              </label>

              {!autoRefresh && (
                <button
                  onClick={runTransformation}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  Dönüştür
                </button>
              )}
            </div>
          </div>

          {/* Editors Container */}
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            {editorActiveTab === 'designer' ? (
              // FIGMA DESIGN PROPERTIES DASHBOARD
              <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-6 overflow-y-auto scrollbar-thin text-slate-300 select-none">
                
                {/* Title & Description */}
                <div className="border-b border-slate-900 pb-4 mb-6">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5 text-purple-400 animate-pulse" />
                    Görsel Tasarım Kontrol Paneli (Beta)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Sağ taraftaki fatura şablonunun genel renk temasını, kaşelerini, eleman yerleşim sıralarını ve eleman boyutlarını sol taraftaki bu panelden görsel olarak tasarlayabilirsiniz.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Card 1: Renk Teması */}
                  <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2">
                      <Palette className="h-4 w-4 text-indigo-400" />
                      Kurumsal Renk Teması
                    </h4>
                    <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-900">
                      <input 
                        type="color" 
                        value={themePrimaryColor} 
                        onChange={(e) => handleThemeColorChange(e.target.value)}
                        className="w-10 h-10 rounded border-0 bg-transparent cursor-pointer shrink-0"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">Birincil Tema Rengi</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{themePrimaryColor}</div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      * Logo rengi, fatura çizgileri ve KDV başlıkları bu renkle otomatik güncellenir.
                    </p>
                  </div>

                  {/* Card 2: Eleman Yerleşimi */}
                  <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2">
                        <Columns className="h-4 w-4 text-blue-400" />
                        Eleman Konum Sıralaması
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-2">
                        Fatura üzerindeki Satıcı ve Alıcı kolonlarının yerlerini tek tıkla swap edebilirsiniz. Bu işlem XSLT kodunu da günceller.
                      </p>
                    </div>
                    <button 
                      onClick={handleSwapSupplierCustomer}
                      className="w-full py-2.5 px-4 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-900 hover:border-slate-700 text-xs font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      <RefreshCw className="h-4 w-4 text-indigo-400" />
                      Satıcı &amp; Alıcı Yerini Swap Et
                    </button>
                  </div>

                  {/* Card 3: Yeni Metin Ekleme */}
                  <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 space-y-4 col-span-1 md:col-span-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2">
                      <Plus className="h-4 w-4 text-emerald-400" />
                      Boş Alanlara Yeni Metin / Metin Kutusu Ekle
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Fatura taslağı üzerindeki aşağıdaki ana bölgelere doğrudan tıklayarak düzenlenebilir boş metin kutuları (div) ekleyebilirsiniz:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={() => handleAddTextElement('supplier-col')}
                        className="py-2 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        🏢 Satıcı Bölgesine Ekle
                      </button>
                      <button
                        onClick={() => handleAddTextElement('customer-col')}
                        className="py-2 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        👤 Alıcı Bölgesine Ekle
                      </button>
                      <button
                        onClick={() => handleAddTextElement('invoice-info-section')}
                        className="py-2 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        📝 Detay/Bilgi Bölgesine Ekle
                      </button>
                    </div>
                  </div>

                  {/* Card 4: Kaşe / Filigran Katmanı */}
                  <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 space-y-4 col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <RotateCw className="h-4 w-4 text-rose-400" />
                        Kaşe / Filigran Katmanı
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={watermarkVisible} 
                          onChange={(e) => handleWatermarkVisibilityChange(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600 peer-checked:after:bg-white"></div>
                      </label>
                    </div>

                    {watermarkVisible ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <span className="text-[11px] text-slate-400">Kaşe Metni:</span>
                          <input 
                            type="text" 
                            value={watermarkText} 
                            onChange={(e) => handleWatermarkTextChange(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-400">
                            <span>Kaşe Döndürme (Açı):</span>
                            <span className="font-mono text-white font-bold">{watermarkRotation}°</span>
                          </div>
                          <input 
                            type="range" 
                            min="-90" 
                            max="90" 
                            value={watermarkRotation} 
                            onChange={(e) => handleWatermarkRotationChange(parseInt(e.target.value))}
                            className="w-full h-1 mt-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-rose-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] text-slate-400">Kaşe Rengi:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <input 
                              type="color" 
                              value={watermarkColor} 
                              onChange={(e) => handleWatermarkColorChange(e.target.value)}
                              className="w-8 h-8 border-0 bg-transparent cursor-pointer rounded shrink-0"
                            />
                            <span className="text-[10px] font-mono text-slate-500">{watermarkColor}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Kaşe / Filigran katmanı devre dışı bırakılmıştır.</p>
                    )}
                  </div>

                  {/* Card 5: Fatura Dil Seçimi */}
                  <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 space-y-4 col-span-1 md:col-span-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2">
                      <Languages className="h-4 w-4 text-indigo-400" />
                      Fatura Dil Seçimi / Invoice Language
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Faturadaki tüm başlık ve etiketleri (Satıcı/Alıcı Bilgileri, Ara Toplam, KDV, Ödenecek Tutar vb.) tek tıkla Türkçe veya İngilizce diline çevirebilirsiniz.
                    </p>
                    <div className="grid grid-cols-2 gap-3 max-w-sm">
                      <button
                        onClick={() => translateInvoiceContent('tr')}
                        className={`py-2 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                          invoiceLanguage === 'tr'
                            ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow'
                            : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span>🇹🇷</span> Türkçe (TR)
                      </button>
                      <button
                        onClick={() => translateInvoiceContent('en')}
                        className={`py-2 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                          invoiceLanguage === 'en'
                            ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow'
                            : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span>🇬🇧</span> English (EN)
                      </button>
                    </div>
                  </div>

                  {/* Card 6: Seçilen Eleman Stilleri */}
                  <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 space-y-4 col-span-1 md:col-span-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2">
                      <Sliders className="h-4 w-4 text-purple-400" />
                      Seçilen Eleman Stil Ayarları (WYSIWYG)
                    </h4>

                    {selectedSelector ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-indigo-400 font-mono">
                            Seçilen CSS Sınıfı: {selectedElementName}
                          </span>
                          <button 
                            onClick={() => setSelectedSelector('')}
                            className="text-[10px] text-slate-500 hover:text-white"
                          >
                            Seçimi Sıfırla
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          
                          {/* Font Size */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-400">
                              <span>Yazı Boyutu:</span>
                              <span className="font-mono text-white">{styleFontSize || 'varsayılan'}</span>
                            </div>
                            <input 
                              type="range" 
                              min="10" 
                              max="36" 
                              value={parseInt(styleFontSize) || 13} 
                              onChange={(e) => handleStyleChange('font-size', `${e.target.value}px`)}
                              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                          </div>

                          {/* Font Modifier Buttons (Bold, Italic, Underline) */}
                          <div className="space-y-1">
                            <span className="text-[11px] text-slate-400 block mb-1">Yazı Tipi Biçimi (Metin):</span>
                            <div className="flex gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 w-fit">
                              <button
                                onClick={() => handleStyleChange('font-weight', styleFontWeight === 'bold' ? 'normal' : 'bold')}
                                className={`px-3 py-1 rounded text-xs font-extrabold transition cursor-pointer ${
                                  styleFontWeight === 'bold' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                                }`}
                                title="Yazıyı Kalın Yap"
                              >
                                B (Kalın)
                              </button>
                              <button
                                onClick={() => handleStyleChange('font-style', styleFontStyle === 'italic' ? 'normal' : 'italic')}
                                className={`px-3 py-1 rounded text-xs italic transition cursor-pointer ${
                                  styleFontStyle === 'italic' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                                }`}
                                title="Yazıyı İtalik Yap"
                              >
                                I (İtalik)
                              </button>
                              <button
                                onClick={() => handleStyleChange('text-decoration', styleTextDecoration === 'underline' ? 'none' : 'underline')}
                                className={`px-3 py-1 rounded text-xs underline transition cursor-pointer ${
                                  styleTextDecoration === 'underline' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                                }`}
                                title="Yazının Altını Çiz"
                              >
                                U (Altı Çizili)
                              </button>
                            </div>
                          </div>

                          {/* Padding */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-400">
                              <span>İç Boşluk (Padding):</span>
                              <span className="font-mono text-white">{stylePadding || 'varsayılan'}</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="50" 
                              value={parseInt(stylePadding) || 0} 
                              onChange={(e) => handleStyleChange('padding', `${e.target.value}px`)}
                              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                          </div>

                          {/* Margin */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-400">
                              <span>Dış Boşluk (Margin):</span>
                              <span className="font-mono text-white">{styleMargin || 'varsayılan'}</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="50" 
                              value={parseInt(styleMargin) || 0} 
                              onChange={(e) => handleStyleChange('margin', `${e.target.value}px`)}
                              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                          </div>

                          {/* Width */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-400">
                              <span>Genişlik (Width):</span>
                              <span className="font-mono text-white">{styleWidth || 'varsayılan'}</span>
                            </div>
                            <input 
                              type="range" 
                              min="10" 
                              max="100" 
                              value={parseInt(styleWidth) || 100} 
                              onChange={(e) => handleStyleChange('width', styleWidth.includes('%') ? `${e.target.value}%` : `${e.target.value}px`)}
                              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                          </div>

                          {/* Color & Alignment */}
                          <div className="flex items-center justify-between col-span-1 md:col-span-2 pt-3 border-t border-slate-900 text-xs">
                            <div className="flex items-center gap-2">
                              <span>Yazı Rengi:</span>
                              <input 
                                type="color" 
                                value={styleColor.startsWith('#') && styleColor.length === 7 ? styleColor : '#333333'} 
                                onChange={(e) => handleStyleChange('color', e.target.value)}
                                className="w-7 h-7 border-0 bg-transparent cursor-pointer rounded shrink-0"
                              />
                              <span className="text-[10px] font-mono text-slate-500">{styleColor}</span>
                            </div>

                            <div className="flex gap-1 bg-slate-900 p-1 rounded border border-slate-800">
                              {['left', 'center', 'right', 'justify'].map((align) => (
                                <button
                                  key={align}
                                  onClick={() => handleStyleChange('text-align', align)}
                                  className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition cursor-pointer ${
                                    styleTextAlign === align ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                                  }`}
                                >
                                  {align === 'left' ? 'Sol' : align === 'center' ? 'Ort' : align === 'right' ? 'Sağ' : 'Yas'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Actions: Add Inside, Edit Text or Remove Selected */}
                          <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-900 flex flex-col gap-2.5">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAddTextElement(selectedSelector.substring(1))}
                                className="flex-1 py-2 px-3 bg-indigo-950 hover:bg-indigo-900 border border-indigo-900/60 hover:border-indigo-700 text-xs font-bold text-indigo-300 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Plus className="h-4 w-4" />
                                İçine Ekle
                              </button>

                              <button
                                onClick={handleEditTextElement}
                                className="flex-1 py-2 px-3 bg-emerald-950 hover:bg-emerald-900 border border-emerald-900/60 hover:border-emerald-700 text-xs font-bold text-emerald-300 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                                title="Seçili elemanın metin içeriğini düzenlemenizi sağlar."
                              >
                                <Edit3 className="h-4 w-4" />
                                Metni Düzenle
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveElement(selectedSelector, selectedElementDetails)}
                              className="w-full py-2 px-4 bg-rose-950 hover:bg-rose-900 border border-rose-900/50 hover:border-rose-800 text-xs font-bold text-rose-300 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                              title="Seçili elemanı fatura taslağından siler."
                            >
                              <Trash2 className="h-4 w-4" />
                              Bu Elemanı Sil
                            </button>
                          </div>

                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-slate-900/20 border border-dashed border-slate-800 rounded-xl">
                        <div className="p-2.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                          <Info className="h-5 w-5" />
                        </div>
                        <p className="text-xs text-slate-500 leading-normal">
                          Sağ taraftaki fatura önizleme belgesi üzerindeki **düzenlenebilir bir alana** (Logo unvanı, Adres kartları, Fatura başlığı, veya eklediğiniz özel metin kutuları) tıklayarak yazı boyutu, kalınlık, renk ve boşluk değerlerini düzenleyebilirsiniz.
                        </p>
                      </div>
                    )}
                  </div>

                </div>

                <div className="mt-8 pt-4 border-t border-slate-900 text-xs text-slate-500 flex items-center justify-between">
                  <span>💡 İpucu: Önizlemedeki herhangi bir yazıya <b>çift tıklayarak</b> içeriğini doğrudan değiştirebilirsiniz.</span>
                  <span>Düzenlenen Selector: {selectedSelector || 'Yok'}</span>
                </div>

              </div>
            ) : editorLayout === 'tabbed' ? (
              // TABBED LAYOUT (Preserves editor state and ref using hidden class)
              <div className="flex-1 relative min-h-0 flex flex-col">
                {/* File input and info bar */}
                <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950 border-b border-slate-900 text-xs text-slate-400 shrink-0">
                  <div className="flex items-center gap-2">
                    <span>Dosya Yükle:</span>
                    <label className="cursor-pointer text-indigo-400 hover:underline flex items-center gap-1 font-medium">
                      <Upload className="h-3 w-3" />
                      Gözat
                      <input
                        type="file"
                        accept={editorActiveTab === 'xml' ? '.xml' : '.xslt,.xsl'}
                        onChange={(e) => handleFileUploadWrapper(e, editorActiveTab)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <button 
                    onClick={() => handleClear(editorActiveTab)}
                    className="text-slate-500 hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" /> Temizle
                  </button>
                </div>

                {/* Quick XSLT Jump Toolbar (only when XSLT tab is visible) */}
                {editorActiveTab === 'xslt' && (
                  <div className="bg-slate-900 border-b border-slate-900 px-4 py-1.5 flex items-center gap-1.5 text-[10px] text-slate-400 overflow-x-auto shrink-0 scrollbar-none">
                    <span className="flex items-center gap-1 text-slate-500 font-medium shrink-0">
                      <Compass className="h-3 w-3" /> Hızlı Git:
                    </span>
                    <button onClick={() => quickJumpTo('css')} className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-slate-800 hover:border-indigo-500/20 transition cursor-pointer">🎨 CSS Stilleri</button>
                    <button onClick={() => quickJumpTo('supplier')} className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-blue-400 border border-slate-800 hover:border-blue-500/20 transition cursor-pointer">🏢 Satıcı Bilgisi</button>
                    <button onClick={() => quickJumpTo('customer')} className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-purple-400 border border-slate-800 hover:border-purple-500/20 transition cursor-pointer">👤 Alıcı Bilgisi</button>
                    <button onClick={() => quickJumpTo('title')} className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-cyan-500/20 transition cursor-pointer">📝 Fatura No</button>
                    <button onClick={() => quickJumpTo('items')} className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-amber-405 border border-slate-800 hover:border-amber-500/20 transition cursor-pointer">🛒 Ürün Tablosu</button>
                    <button onClick={() => quickJumpTo('totals')} className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 hover:border-emerald-500/20 transition cursor-pointer">📊 Toplamlar</button>
                  </div>
                )}

                {/* Validation warnings overlay */}
                {editorActiveTab === 'xml' && !validationStatus.xmlValid && (
                  <div className="bg-rose-950/40 border-b border-rose-900 px-4 py-2 text-xs text-rose-300 flex items-start gap-2 shrink-0">
                    <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">XML Sözdizimi Hatası:</span> {validationStatus.xmlError}
                    </div>
                  </div>
                )}
                {editorActiveTab === 'xslt' && !validationStatus.xsltValid && (
                  <div className="bg-rose-950/40 border-b border-rose-900 px-4 py-2 text-xs text-rose-300 flex items-start gap-2 shrink-0">
                    <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">XSLT Sözdizimi Hatası:</span> {validationStatus.xsltError}
                    </div>
                  </div>
                )}

                {/* Monaco Instances */}
                <div className="flex-1 min-h-0 bg-slate-950 relative">
                  <div className={`w-full h-full ${editorActiveTab === 'xml' ? 'block' : 'hidden'}`}>
                    <Editor
                      height="100%"
                      language="xml"
                      theme="vs-dark"
                      value={xmlContent}
                      onChange={(v) => updateXmlContent(v || '')}
                      onMount={handleXmlEditorMount}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', Consolas, monospace",
                        wordWrap: 'on',
                        automaticLayout: true,
                        scrollbar: { vertical: 'visible', horizontal: 'visible' },
                      }}
                    />
                  </div>
                  <div className={`w-full h-full ${editorActiveTab === 'xslt' ? 'block' : 'hidden'}`}>
                    <Editor
                      height="100%"
                      language="xml"
                      theme="vs-dark"
                      value={xsltContent}
                      onChange={(v) => updateXsltContent(v || '')}
                      onMount={handleXsltEditorMount}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', Consolas, monospace",
                        wordWrap: 'on',
                        automaticLayout: true,
                        scrollbar: { vertical: 'visible', horizontal: 'visible' },
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              // SPLIT LAYOUT (XML on top, XSLT on bottom)
              <div className="flex-1 flex flex-col min-h-0">
                {/* XML Editor Block */}
                <div className="flex-1 min-h-[200px] flex flex-col border-b border-slate-900">
                  {/* XML Bar */}
                  <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-b border-slate-900 text-xs text-slate-400 shrink-0">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                      <FileCode className="h-3.5 w-3.5 text-blue-400" />
                      XML VERİSİ
                      {!validationStatus.xmlValid ? (
                        <span className="flex items-center gap-1 text-[10px] text-rose-400 bg-rose-950/50 border border-rose-900 px-1.5 py-0.2 rounded">
                          <AlertTriangle className="h-2.5 w-2.5" /> Geçersiz
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-900 px-1.5 py-0.2 rounded">
                          <CheckCircle className="h-2.5 w-2.5" /> Geçerli
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer text-indigo-400 hover:underline flex items-center gap-1">
                        <Upload className="h-3 w-3" />
                        XML Yükle
                        <input
                          type="file"
                          accept=".xml"
                          onChange={(e) => handleFileUploadWrapper(e, 'xml')}
                          className="hidden"
                        />
                      </label>
                      <button 
                        onClick={() => handleClear('xml')}
                        className="text-slate-500 hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" /> Temizle
                      </button>
                    </div>
                  </div>

                  {/* XML Validation Overlay */}
                  {!validationStatus.xmlValid && (
                    <div className="bg-rose-950/40 border-b border-rose-900 px-4 py-2 text-xs text-rose-300 flex items-start gap-2 shrink-0">
                      <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                      <div className="line-clamp-2" title={validationStatus.xmlError}>
                        <span className="font-semibold">XML Hatası:</span> {validationStatus.xmlError}
                      </div>
                    </div>
                  )}

                  {/* Editor */}
                  <div className="flex-1 min-h-0 bg-slate-950">
                    <Editor
                      height="100%"
                      language="xml"
                      theme="vs-dark"
                      value={xmlContent}
                      onChange={(v) => updateXmlContent(v || '')}
                      onMount={handleXmlEditorMount}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        fontFamily: "'JetBrains Mono', Consolas, monospace",
                        wordWrap: 'on',
                        automaticLayout: true,
                      }}
                    />
                  </div>
                </div>

                {/* XSLT Editor Block */}
                <div className="flex-1 min-h-[200px] flex flex-col">
                  {/* XSLT Bar */}
                  <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-b border-slate-900 text-xs text-slate-400 shrink-0">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                      <FileCode className="h-3.5 w-3.5 text-purple-400" />
                      XSLT TASARIMI
                      {!validationStatus.xsltValid ? (
                        <span className="flex items-center gap-1 text-[10px] text-rose-400 bg-rose-950/50 border border-rose-900 px-1.5 py-0.2 rounded">
                          <AlertTriangle className="h-2.5 w-2.5" /> Geçersiz
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-900 px-1.5 py-0.2 rounded">
                          <CheckCircle className="h-2.5 w-2.5" /> Geçerli
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer text-indigo-400 hover:underline flex items-center gap-1">
                        <Upload className="h-3 w-3" />
                        XSLT Yükle
                        <input
                          type="file"
                          accept=".xslt,.xsl"
                          onChange={(e) => handleFileUploadWrapper(e, 'xslt')}
                          className="hidden"
                        />
                      </label>
                      <button 
                        onClick={() => handleClear('xslt')}
                        className="text-slate-500 hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" /> Temizle
                      </button>
                    </div>
                  </div>

                  {/* Quick navigation row for split layout */}
                  <div className="bg-slate-950 border-b border-slate-900 px-4 py-1 flex items-center gap-1.5 text-[9px] text-slate-400 overflow-x-auto shrink-0 scrollbar-none">
                    <span className="text-slate-500 font-medium shrink-0">Hızlı Git:</span>
                    <button onClick={() => quickJumpTo('css')} className="px-1.5 py-0.2 rounded bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-slate-800 hover:border-indigo-500/20 transition cursor-pointer">🎨 CSS</button>
                    <button onClick={() => quickJumpTo('supplier')} className="px-1.5 py-0.2 rounded bg-slate-900 hover:bg-slate-800 text-blue-400 border border-slate-800 hover:border-blue-500/20 transition cursor-pointer">🏢 Satıcı</button>
                    <button onClick={() => quickJumpTo('customer')} className="px-1.5 py-0.2 rounded bg-slate-900 hover:bg-slate-800 text-purple-400 border border-slate-800 hover:border-purple-500/20 transition cursor-pointer">👤 Alıcı</button>
                    <button onClick={() => quickJumpTo('title')} className="px-1.5 py-0.2 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-cyan-500/20 transition cursor-pointer">📝 Fatura No</button>
                    <button onClick={() => quickJumpTo('items')} className="px-1.5 py-0.2 rounded bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:border-amber-500/20 transition cursor-pointer">🛒 Ürünler</button>
                    <button onClick={() => quickJumpTo('totals')} className="px-1.5 py-0.2 rounded bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 hover:border-emerald-500/20 transition cursor-pointer">📊 Toplamlar</button>
                  </div>

                  {/* XSLT Validation Overlay */}
                  {!validationStatus.xsltValid && (
                    <div className="bg-rose-950/40 border-b border-rose-900 px-4 py-2 text-xs text-rose-300 flex items-start gap-2 shrink-0">
                      <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                      <div className="line-clamp-2" title={validationStatus.xsltError}>
                        <span className="font-semibold">XSLT Hatası:</span> {validationStatus.xsltError}
                      </div>
                    </div>
                  )}

                  {/* Editor */}
                  <div className="flex-1 min-h-0 bg-slate-950">
                    <Editor
                      height="100%"
                      language="xml"
                      theme="vs-dark"
                      value={xsltContent}
                      onChange={(v) => updateXsltContent(v || '')}
                      onMount={handleXsltEditorMount}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        fontFamily: "'JetBrains Mono', Consolas, monospace",
                        wordWrap: 'on',
                        automaticLayout: true,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Resizer Divider */}
        <div 
          onMouseDown={handleMouseDown}
          className="hidden lg:flex w-1 bg-slate-900 hover:bg-indigo-600 active:bg-indigo-600 cursor-col-resize transition-all relative z-40 select-none flex-col justify-center items-center group"
          title="Paneli genişletmek için sürükleyin"
        >
          <div className="w-[2px] h-8 bg-slate-805 group-hover:bg-indigo-500 rounded" />
        </div>

        {/* Right Side: Preview & Output */}
        <section className="flex-1 flex flex-col bg-slate-950 min-w-0">
          
          {/* Preview Tab Bar */}
          <div className="flex items-center justify-between border-b border-slate-900 bg-slate-900 px-4 py-2 shrink-0">
            <div className="flex gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-900">
              <button
                onClick={() => setPreviewActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition duration-150 cursor-pointer ${
                  previewActiveTab === 'preview'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="h-3.5 w-3.5 text-indigo-400" />
                Önizleme
              </button>
              <button
                onClick={() => setPreviewActiveTab('html')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition duration-150 cursor-pointer ${
                  previewActiveTab === 'html'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="h-3.5 w-3.5 text-cyan-400" />
                HTML Çıktısı
              </button>
              <button
                onClick={() => setPreviewActiveTab('logs')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition duration-150 cursor-pointer ${
                  previewActiveTab === 'logs'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                } ${errorMsg ? 'text-rose-400' : ''}`}
              >
                <Info className="h-3.5 w-3.5 text-amber-400" />
                Sistem Raporu {errorMsg && '⚠️'}
              </button>
            </div>

            {/* Actions for Preview Pane */}
            <div className="flex items-center gap-1.5">
              {/* Target / Inspector Toggle (Only visible in Preview tab) */}
              {previewActiveTab === 'preview' && !errorMsg && (
                <>
                  <button
                    onClick={() => {
                      setInspectorActive(!inspectorActive)
                      setDesignerActive(false)
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      inspectorActive 
                        ? 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white shadow shadow-blue-600/20' 
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                    title="Faturadaki bir elemana tıklayarak koddaki satırını bulur."
                  >
                    <Target className="h-3.5 w-3.5" />
                    Koda Git
                  </button>

                  {/* WYSIWYG Visual Designer Mode Toggle */}
                  <button
                    onClick={() => {
                      const nextState = !designerActive
                      setDesignerActive(nextState)
                      setInspectorActive(false)
                      if (nextState) {
                        setEditorActiveTab('designer')
                      } else {
                        setEditorActiveTab('xslt')
                      }
                      setSelectedSelector('') // clear styling targets
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      designerActive 
                        ? 'bg-purple-600 hover:bg-purple-600 border-purple-600 text-white shadow shadow-purple-600/20' 
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                    title="Sol panelde görsel tasarım arayüzünü (hizalama, genişlik, metin düzenleme) açar."
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    Görsel Tasarımcı (Beta)
                  </button>
                </>
              )}



              {previewActiveTab === 'preview' && (
                <div className="flex items-center gap-1 bg-slate-900/60 p-0.5 rounded-lg border border-slate-800">
                  <button
                    onClick={() => translateInvoiceContent('tr')}
                    className={`px-2 py-1.5 rounded-md text-[10px] font-bold transition duration-150 cursor-pointer flex items-center gap-1 ${
                      invoiceLanguage === 'tr'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Faturayı Türkçe diline çevirir."
                  >
                    🇹🇷 TR
                  </button>
                  <button
                    onClick={() => translateInvoiceContent('en')}
                    className={`px-2 py-1.5 rounded-md text-[10px] font-bold transition duration-150 cursor-pointer flex items-center gap-1 ${
                      invoiceLanguage === 'en'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Faturayı İngilizce diline çevirir."
                  >
                    🇬🇧 EN
                  </button>
                </div>
              )}

              {previewActiveTab === 'preview' && !errorMsg && (
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition cursor-pointer"
                  title="Faturayı yazdırır veya PDF kaydeder."
                >
                  <Printer className="h-3.5 w-3.5" />
                  Yazdır / PDF
                </button>
              )}

              {previewActiveTab === 'html' && (
                <button
                  onClick={handleCopyHtml}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-805 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition cursor-pointer"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {isCopied ? 'Kopyalandı!' : 'HTML Kopyala'}
                </button>
              )}

              <button
                onClick={() => handleDownload(
                  previewActiveTab === 'html' || previewActiveTab === 'preview' ? htmlOutput : errorMsg || '', 
                  previewActiveTab === 'html' || previewActiveTab === 'preview' ? 'e-fatura.html' : 'logs.txt', 
                  previewActiveTab === 'html' || previewActiveTab === 'preview' ? 'text/html' : 'text/plain'
                )}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-lg shadow-indigo-600/10 transition duration-150 cursor-pointer"
                disabled={!htmlOutput && !errorMsg}
              >
                <Download className="h-3.5 w-3.5" />
                Dosya İndir
              </button>
            </div>
          </div>

          {/* Render Area */}
          <div className="flex-1 bg-slate-950 p-3 min-h-0 flex flex-col relative">
            
            {/* Inspector Navigation Toast Banner */}
            {inspectorStatus && (
              <div className="absolute top-5 left-5 right-5 z-20 bg-indigo-600/95 text-white px-4 py-2.5 rounded-xl border border-indigo-500 shadow-2xl flex items-center gap-2.5 text-xs animate-pulse">
                <Sparkles className="h-4 w-4 shrink-0 text-white" />
                <span className="font-semibold">{inspectorStatus}</span>
              </div>
            )}

            {/* Aspect Ratio and Zoom Toolbar (only visible in A4 preview mode) */}
            {previewActiveTab === 'preview' && previewLayout === 'A4' && (
              <div className="mb-2 px-3 py-1.5 bg-slate-900/60 border border-slate-900 rounded-lg flex items-center justify-between text-xs text-slate-400 shrink-0">
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                  <Info className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                  Önizleme A4 baskı şablonuyla eş ölçeklidir.
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => {
                        setZoomPercent(prev => Math.max(30, prev - 5))
                        setIsAutoFit(false)
                      }}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                      title="Uzaklaştır"
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </button>
                    <input 
                      type="range"
                      min="30"
                      max="150"
                      value={zoomPercent}
                      onChange={(e) => {
                        setZoomPercent(parseInt(e.target.value))
                        setIsAutoFit(false)
                      }}
                      className="w-24 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      title="Yakınlaştırma Oranı"
                    />
                    <button 
                      onClick={() => {
                        setZoomPercent(prev => Math.min(150, prev + 5))
                        setIsAutoFit(false)
                      }}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                      title="Yakınlaştır"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="font-mono text-[10px] w-12 text-center select-none font-bold text-indigo-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900">
                    {zoomPercent}%
                  </span>

                  <button 
                    onClick={() => {
                      setIsAutoFit(true)
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                      isAutoFit 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                    }`}
                    title="Sayfayı Ekran Genişliğine Sığdırır."
                  >
                    Genişliğe Sığdır
                  </button>
                </div>
              </div>
            )}

            {/* Viewport Container */}
            <div className="flex-1 flex flex-row min-h-0 relative gap-3">
              
              {/* Preview Viewport Container (keeps the same iframe DOM node always to prevent reload blank bug) */}
              <div 
                ref={previewContainerRef}
                className="flex-1 rounded-xl overflow-hidden shadow-2xl flex flex-col relative min-h-0 bg-slate-900 border border-slate-900"
              >
                
                {previewActiveTab === 'preview' ? (
                  <iframe 
                    ref={iframeRef}
                    srcDoc={srcDocValue}
                    onLoad={handleIframeLoad}
                    className="w-full h-full border-none bg-slate-900"
                    title="Fatura Canlı Önizleme"
                  />
                ) : null}

                {previewActiveTab === 'html' && (
                  <div className="w-full h-full bg-slate-900 p-1 select-text">
                    <Editor
                      height="100%"
                      language="html"
                      theme="vs-dark"
                      value={htmlOutput}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 12,
                        fontFamily: "'JetBrains Mono', Consolas, monospace",
                        wordWrap: 'on',
                        automaticLayout: true,
                      }}
                    />
                  </div>
                )}

                {previewActiveTab === 'logs' && (
                  <div className="w-full h-full bg-slate-900 p-6 font-mono text-xs overflow-y-auto select-text scrollbar-thin text-slate-300">
                    
                    {/* Title */}
                    <div className="border-b border-slate-800 pb-4 mb-4">
                      <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 m-0">
                        <Info className="h-4 w-4 text-indigo-400" />
                        Sistem Durum Raporu
                      </h3>
                      <p className="text-[10px] text-slate-500 m-0 mt-1">Dönüştürücü durumu, gömülü dosyalar ve şablon seçimi</p>
                    </div>

                    {/* Errors display if any */}
                    {errorMsg && (
                      <div className="bg-rose-950/30 border border-rose-900 text-rose-300 rounded-lg p-4 mb-5 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-rose-400 text-sm">Tasarım Dönüşüm Hatası</div>
                          <pre className="mt-2 text-xs overflow-x-auto bg-rose-950/60 p-3 rounded border border-rose-900/60 whitespace-pre-wrap leading-relaxed text-rose-200">
                            {errorMsg}
                          </pre>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* File Status Cards */}
                      <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 space-y-2">
                        <div className="text-xs font-bold text-slate-400 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                          <FileCode className="h-3.5 w-3.5 text-blue-400" />
                          XML Durumu
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500">Sözdizimi:</span>
                          <span className={validationStatus.xmlValid ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                            {validationStatus.xmlValid ? 'GEÇERLİ' : 'GEÇERSİZ'}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500">Boyut:</span>
                          <span>{xmlContent.length.toLocaleString()} karakter</span>
                        </div>
                      </div>

                      <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 space-y-2">
                        <div className="text-xs font-bold text-slate-400 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                          <FileCode className="h-3.5 w-3.5 text-purple-400" />
                          XSLT Durumu
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500">Sözdizimi:</span>
                          <span className={validationStatus.xsltValid ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                            {validationStatus.xsltValid ? 'GEÇERLİ' : 'GEÇERSİZ'}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500">Boyut:</span>
                          <span>{xsltContent.length.toLocaleString()} karakter</span>
                        </div>
                      </div>
                    </div>

                    {/* Update Station Section */}
                    <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 mb-6">
                      <div className="text-xs font-bold text-slate-400 border-b border-slate-800 pb-2 mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <RefreshCw className="h-3.5 w-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '3s' }} />
                          Uygulama Güncelleme İstasyonu (Auto-Updater)
                        </span>
                        <button
                          onClick={checkUpdates}
                          disabled={isUpdating}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer disabled:opacity-50"
                        >
                          Şimdi Denetle
                        </button>
                      </div>
                      
                      {updateCheckStatus && (
                        <div className="text-xs text-amber-300 bg-amber-950/20 border border-amber-900/40 rounded p-2.5 mb-3 leading-relaxed">
                          {updateCheckStatus}
                        </div>
                      )}

                      {updateAvailable ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg">
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-emerald-400">
                              Yeni Bir Güncelleme Mevcut!
                            </div>
                            <div className="text-[10px] text-slate-400">
                              GitHub üzerinde yeni geliştirmeler tespit edildi. Tek tıkla otomatik olarak güncelleyebilirsiniz.
                            </div>
                          </div>
                          <button
                            onClick={triggerUpdate}
                            disabled={isUpdating}
                            className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer shrink-0"
                          >
                            {isUpdating ? 'Güncelleniyor...' : 'Şimdi Güncelle'}
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 py-1.5 italic text-center">
                          Uygulamanız en güncel sürümde çalışıyor. Herhangi bir yeni güncelleme bulunmuyor.
                        </div>
                      )}
                    </div>

                    {/* Embedded Files Section */}
                    <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 mb-6">
                      <div className="text-xs font-bold text-slate-400 border-b border-slate-800 pb-2 mb-3 flex items-center gap-1.5">
                        <FileCode className="h-3.5 w-3.5 text-indigo-400" />
                        Yüklenen XML'deki Gömülü Tasarımlar (Embedded Files)
                      </div>

                      {embeddedXslt ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-lg">
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-white flex items-center gap-1">
                              <Sparkles className="h-3 w-3 text-indigo-400" />
                              Gömülü e-Fatura Tasarımı (invoice.xslt)
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Boyut: {embeddedXslt.length.toLocaleString()} karakter | Durum: {' '}
                              <span className={embeddedXslt === xsltContent ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                                {embeddedXslt === xsltContent ? 'Aktif (Editörde yüklü)' : 'İnaktif (Editörde yüklü değil)'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            {embeddedXslt !== xsltContent && (
                              <button
                                onClick={handleApplyEmbeddedXslt}
                                className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition cursor-pointer"
                                title="Gömülü XSLT şablonunu XSLT editörüne yazar ve aktif eder."
                              >
                                Aktif Et
                              </button>
                            )}
                            <button
                              onClick={() => handleDownload(embeddedXslt, 'gomulu-tasarim.xslt', 'text/xml')}
                              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[10px] font-bold transition cursor-pointer"
                              title="XML içindeki gömülü XSLT şablonunu bağımsız bir dosya olarak indirir."
                            >
                              İndir
                            </button>
                            <button
                              onClick={handleRemoveEmbeddedXslt}
                              className="px-2 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 hover:text-white text-[10px] font-bold border border-rose-900/30 transition cursor-pointer"
                              title="XML'deki gömülü XSLT kod bloğunu siler."
                            >
                              XML'den Kaldır
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 py-2 italic text-center">
                          Bu XML dosyasının içerisinde gömülü herhangi bir XSLT tasarım dosyası tespit edilmedi.
                        </div>
                      )}
                    </div>

                    {/* Template Library Selection - "Yeni Şablon Ekle / Değiştir" */}
                    <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                      <div className="text-xs font-bold text-slate-400 border-b border-slate-800 pb-2 mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <FilePlus2 className="h-3.5 w-3.5 text-emerald-400" />
                          Tasarım Şablonu Değiştir / Yeni Şablon Yükle
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Standard UBL-TR */}
                        <button
                          onClick={() => updateXsltContent(DEFAULT_XSLT)}
                          className={`p-3 rounded-lg border text-left space-y-1 transition duration-150 cursor-pointer ${
                            xsltContent === DEFAULT_XSLT 
                              ? 'bg-slate-900 border-indigo-500/50 text-indigo-200' 
                              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 text-slate-300'
                          }`}
                        >
                          <div className="text-xs font-bold flex items-center gap-1 text-white">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                            Standart e-Fatura
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Detaylı logolu ve tablolu kurumsal UBL-TR fatura tasarımı şablonu.
                          </p>
                        </button>

                        {/* Simple Table */}
                        <button
                          onClick={() => updateXsltContent(SIMPLE_XSLT)}
                          className={`p-3 rounded-lg border text-left space-y-1 transition duration-150 cursor-pointer ${
                            xsltContent === SIMPLE_XSLT 
                              ? 'bg-slate-900 border-indigo-500/50 text-indigo-200' 
                              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 text-slate-300'
                          }`}
                        >
                          <div className="text-xs font-bold flex items-center gap-1 text-white">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                            Sade Tablo Tasarımı
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Metin odaklı, hızlı baskıya uygun sadeleştirilmiş fatura şablonu.
                          </p>
                        </button>

                        {/* Empty template */}
                        <button
                          onClick={() => updateXsltContent(EMPTY_XSLT)}
                          className={`p-3 rounded-lg border text-left space-y-1 transition duration-150 cursor-pointer ${
                            xsltContent === EMPTY_XSLT 
                              ? 'bg-slate-900 border-indigo-500/50 text-indigo-200' 
                              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 text-slate-300'
                          }`}
                        >
                          <div className="text-xs font-bold flex items-center gap-1 text-white">
                            <Plus className="h-3 w-3 text-slate-400" />
                            Boş Şablon
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Sıfırdan kendi XSLT tasarımınızı oluşturmak için boş bir XML iskeleti.
                          </p>
                        </button>
                      </div>

                      {/* Save Current as Template Form */}
                      <div className="mt-5 pt-4 border-t border-slate-900">
                        <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                          Mevcut Düzenlemeyi Şablon Olarak Kaydet
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Şablon İsmi (Örn: Logolu Mavi Tasarım)"
                            value={saveTemplateName}
                            onChange={(e) => setSaveTemplateName(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                          />
                          <button
                            onClick={handleSaveCurrentAsTemplate}
                            disabled={isSavingTemplate}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/50 text-white font-bold text-xs rounded transition flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            {isSavingTemplate ? 'Kaydediliyor...' : 'Şablonlara Kaydet'}
                          </button>
                        </div>
                      </div>

                      {/* Custom Templates List */}
                      {customTemplates.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-slate-900">
                          <div className="text-[11px] font-bold text-slate-400 mb-2.5 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                              Kaydedilmiş Özel Şablonlarınız ({customTemplates.length})
                            </span>
                            <button
                              onClick={loadCustomTemplates}
                              className="p-1 hover:bg-slate-800 rounded transition text-slate-500 hover:text-slate-300 cursor-pointer"
                              title="Şablon listesini diskten yeniden tara ve güncelle"
                            >
                              <RefreshCw className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto scrollbar-thin pr-1">
                            {customTemplates.map((t, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition ${
                                  xsltContent === t.content
                                    ? 'bg-indigo-950/20 border-indigo-500/40 text-white'
                                    : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <div className="truncate pr-2">
                                  <div className="font-semibold text-[11px] text-slate-200 truncate">{t.name}</div>
                                  <div className="text-[9px] text-slate-500 font-mono truncate">{t.fileName}</div>
                                </div>
                                <button
                                  onClick={() => updateXsltContent(t.content)}
                                  className={`px-2 py-1 rounded text-[10px] font-bold transition shrink-0 cursor-pointer ${
                                    xsltContent === t.content
                                      ? 'bg-indigo-600 text-white'
                                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                                  }`}
                                >
                                  {xsltContent === t.content ? 'Yüklü' : 'Yükle'}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Transform Engine Details */}
                    <div className="mt-6 text-[10px] text-slate-500 border-t border-slate-800 pt-4">
                      <p><b>UNI XML&amp;XSLT</b>, dönüşüm işlemini tamamen tarayıcınızın yerel <b>XSLTProcessor</b> API'si yardımıyla client-side olarak yürütür. Verileriniz hiçbir sunucuya yüklenmez veya aktarılmaz. Güvenlidir.</p>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        </section>

      </main>

      {/* Footer Info */}
      <footer className="bg-slate-950 border-t border-slate-900 px-6 py-2 flex items-center justify-between text-xs text-slate-500 shrink-0">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span>İpucu: XML veya XSLT dosyasını ekranın herhangi bir yerine sürükleyip bırakarak yükleyebilirsiniz.</span>
        </div>
        <div>
          <span>Açık Kaynak Kodlu © 2026 Devatek | UNI XML&amp;XSLT</span>
        </div>
      </footer>
    </div>
  )
}

export default App
