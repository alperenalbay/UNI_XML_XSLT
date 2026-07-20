import { useCallback } from 'react'
import { useEditorStore } from '../store/editorStore'

/**
 * Dosya yükleme, sürükle-bırak, indirme, yazdırma, kopyalama ve temizleme
 * işlemlerini merkezi olarak sağlayan hook.
 *
 * App.tsx içindeki `updateXmlContent` / `updateXsltContent` wrapper'ları
 * (Monaco editörü ile senkronize eden fonksiyonlar) parametre olarak alınır;
 * bu sayede content güncelleme stratejisi hook'a sızdırılmamış olur.
 *
 * @param updateXmlContent  XML içeriğini güncelleyen App-level wrapper
 * @param updateXsltContent XSLT içeriğini güncelleyen App-level wrapper
 * @param iframeRef         Önizleme iframe referansı (yazdırma için)
 */
export function useFileOps(
  updateXmlContent: (value: string) => void,
  updateXsltContent: (value: string) => void,
  iframeRef: React.RefObject<HTMLIFrameElement | null>
) {
  const {
    htmlOutput,
    isCopied,
    setIsCopied,
    setIsDragging,
    setEditorActiveTab,
  } = useEditorStore()

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: 'xml' | 'xslt') => {
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
    },
    [updateXmlContent, updateXsltContent]
  )

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [setIsDragging])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [setIsDragging])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget === e.target) {
      setIsDragging(false)
    }
  }, [setIsDragging])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
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
    },
    [updateXmlContent, updateXsltContent, setIsDragging, setEditorActiveTab]
  )

  const handleCopyHtml = useCallback(() => {
    navigator.clipboard.writeText(htmlOutput)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }, [htmlOutput, setIsCopied])

  const handleDownload = useCallback(
    (content: string, filename: string, mimeType: string) => {
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
    []
  )

  const handlePrint = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.focus()
      iframeRef.current.contentWindow?.print()
    }
  }, [iframeRef])

  const handleClear = useCallback(
    (type: 'xml' | 'xslt') => {
      if (type === 'xml') updateXmlContent('')
      else updateXsltContent('')
    },
    [updateXmlContent, updateXsltContent]
  )

  return {
    isCopied,
    handleFileUpload,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCopyHtml,
    handleDownload,
    handlePrint,
    handleClear,
  }
}
