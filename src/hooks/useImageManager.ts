// Image management (designer) extracted from App.tsx.
//
// Covers: scanning the XSLT for images, adding/replacing an image from a
// file, per-image style changes and the drag-position apply/reset flow.
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  extractAllImagesFromXslt,
  getImageStyleFromXslt,
  getImageTransformFromXslt,
  replaceImageInXslt,
  addImageToXslt,
  updateImageStyleInXslt,
  setImageTransformInXslt,
  transformXmlWithXslt,
} from '../utils/xsltTransformer';
import type { ImageInfo } from '../utils/xsltTransformer';

export interface ToastPayload {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  description?: string;
}

export interface UseImageManagerApi {
  designerImages: ImageInfo[];
  imageWidths: Record<number, string>;
  imageAligns: Record<number, string>;
  imageMargins: Record<number, string>;
  imageTransforms: Record<number, { x: number; y: number }>;
  pendingTransforms: Record<string, { x: number; y: number }>;
  /** Setter for pending drag positions (the inspector message handler needs it) */
  setPendingTransforms: (fn: (prev: Record<string, { x: number; y: number }>) => Record<string, { x: number; y: number }>) => void;
  /** Which image row is expanded in the designer image list */
  expandedImageIdx: number | null;
  setExpandedImageIdx: (idx: number | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleReplaceImage: (image: ImageInfo) => void;
  handleAddImage: () => void;
  handleImageStyleChange: (idx: number, imgSrc: string, property: string, value: string) => void;
  handleApplyImageTransforms: () => void;
  handleResetImageTransforms: () => void;
}

export function useImageManager(
  xsltContent: string,
  xmlContent: string,
  updateXsltContent: (xslt: string) => void,
  setHtmlOutput: (html: string) => void,
  addToast: (t: ToastPayload) => void,
): UseImageManagerApi {
  const [designerImages, setDesignerImages] = useState<ImageInfo[]>([]);
  const [imageWidths, setImageWidths] = useState<Record<number, string>>({});
  const [imageAligns, setImageAligns] = useState<Record<number, string>>({});
  const [imageMargins, setImageMargins] = useState<Record<number, string>>({});
  const [imageTransforms, setImageTransforms] = useState<Record<number, { x: number; y: number }>>({});
  const [pendingTransforms, setPendingTransforms] = useState<Record<string, { x: number; y: number }>>({});
  const [expandedImageIdx, setExpandedImageIdx] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceImageRef = useRef<{ src: string; index: number } | null>(null);

  // Scan XSLT for images when content changes
  useEffect(() => {
    const images = extractAllImagesFromXslt(xsltContent);
    setDesignerImages(images);

    const widths: Record<number, string> = {};
    const aligns: Record<number, string> = {};
    const margins: Record<number, string> = {};
    images.forEach((img: ImageInfo, i: number) => {
      widths[i] = getImageStyleFromXslt(xsltContent, img.src, 'width') || '300px';
      aligns[i] = getImageStyleFromXslt(xsltContent, img.src, 'text-align') || 'center';
      margins[i] = getImageStyleFromXslt(xsltContent, img.src, 'margin') || '10px 0px';
    });
    setImageWidths(widths);
    setImageAligns(aligns);
    setImageMargins(margins);

    const transforms: Record<number, { x: number; y: number }> = {};
    images.forEach((img: ImageInfo, i: number) => {
      transforms[i] = getImageTransformFromXslt(xsltContent, img.src);
    });
    setImageTransforms(transforms);
  }, [xsltContent]);

  const handleImageFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      addToast({ type: 'error', message: 'Geçersiz Format', description: 'PNG, JPEG, GIF, WebP veya SVG dosyası seçin.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUri = ev.target?.result as string;
      if (!dataUri) return;

      if (replaceImageRef.current) {
        const oldSrc = replaceImageRef.current.src;
        const updated = replaceImageInXslt(xsltContent, oldSrc, dataUri);
        if (updated !== xsltContent) {
          updateXsltContent(updated);
          setPendingTransforms((prev) => {
            const next = { ...prev };
            delete next[oldSrc];
            return next;
          });
          addToast({ type: 'success', message: 'Görsel Değiştirildi', description: 'Görsel başarıyla güncellendi.' });
        }
        replaceImageRef.current = null;
      } else {
        const updated = addImageToXslt(xsltContent, dataUri, file.name);
        if (updated !== xsltContent) {
          updateXsltContent(updated);
          addToast({ type: 'success', message: 'Görsel Eklendi', description: 'Yeni görsel tasarıma eklendi.' });
        }
      }
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  }, [xsltContent, updateXsltContent, addToast]);

  const handleReplaceImage = useCallback((image: ImageInfo) => {
    replaceImageRef.current = { src: image.src, index: image.index };
    fileInputRef.current?.click();
  }, []);

  const handleAddImage = useCallback(() => {
    replaceImageRef.current = null;
    fileInputRef.current?.click();
  }, []);

  const handleApplyImageTransforms = useCallback(() => {
    const entries = Object.entries(pendingTransforms);
    if (entries.length === 0) return;

    let currentXslt = xsltContent;
    for (const [src, pos] of entries) {
      const updated = setImageTransformInXslt(currentXslt, src, pos.x, pos.y);
      if (updated !== currentXslt) currentXslt = updated;
    }

    if (currentXslt !== xsltContent) {
      updateXsltContent(currentXslt);
      const result = transformXmlWithXslt(xmlContent, currentXslt);
      if (!result.error) setHtmlOutput(result.html);

      const newTransforms: Record<number, { x: number; y: number }> = {};
      designerImages.forEach((img: ImageInfo, i: number) => {
        const pend = pendingTransforms[img.src];
        if (pend) newTransforms[i] = pend;
        else newTransforms[i] = imageTransforms[i] || { x: 0, y: 0 };
      });
      setImageTransforms(newTransforms);
      setPendingTransforms({});

      addToast({ type: 'success', message: 'Değişiklikler Kaydedildi', description: `${entries.length} görsel konumu XSLT'ye uygulandı.` });
    }
  }, [pendingTransforms, xsltContent, xmlContent, designerImages, imageTransforms, updateXsltContent, setHtmlOutput, addToast]);

  const handleResetImageTransforms = useCallback(() => {
    setPendingTransforms({});
    const result = transformXmlWithXslt(xmlContent, xsltContent);
    if (!result.error) setHtmlOutput(result.html);
  }, [xmlContent, xsltContent, setHtmlOutput]);

  const handleImageStyleChange = useCallback((idx: number, imgSrc: string, property: string, value: string) => {
    const updated = updateImageStyleInXslt(xsltContent, imgSrc, property, value);
    if (updated !== xsltContent) {
      updateXsltContent(updated);
      if (property === 'width' || property === 'max-width') setImageWidths((prev) => ({ ...prev, [idx]: value }));
      else if (property === 'text-align') setImageAligns((prev) => ({ ...prev, [idx]: value }));
      else if (property === 'margin') setImageMargins((prev) => ({ ...prev, [idx]: value }));
      const result = transformXmlWithXslt(xmlContent, updated);
      if (!result.error) setHtmlOutput(result.html);
    }
  }, [xsltContent, xmlContent, updateXsltContent, setHtmlOutput]);

  return {
    designerImages,
    imageWidths,
    imageAligns,
    imageMargins,
    imageTransforms,
    pendingTransforms,
    setPendingTransforms,
    expandedImageIdx,
    setExpandedImageIdx,
    fileInputRef,
    handleImageFileSelected,
    handleReplaceImage,
    handleAddImage,
    handleImageStyleChange,
    handleApplyImageTransforms,
    handleResetImageTransforms,
  };
}
