import {
  injectXsltIdsWithCounter,
  removeAllXsltIds,
  findElementByXsltId,
} from './xsltIdUtils';

export interface TransformResult {
  html: string;
  error?: string;
}

/**
 * XML verisini XSLT tasarımı ile tarayıcı tarafında dönüştürür.
 */
export function transformXmlWithXslt(xmlString: string, xsltString: string): TransformResult {
  if (!xmlString.trim()) {
    return { html: '', error: 'XML içeriği boş olamaz.' };
  }
  if (!xsltString.trim()) {
    return { html: '', error: 'XSLT içeriği boş olamaz.' };
  }

  try {
    const parser = new DOMParser();

    // 1. XML Ayrıştırma
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    const xmlError = xmlDoc.querySelector('parsererror');
    if (xmlError) {
      return {
        html: '',
        error: `XML Ayrıştırma Hatası:\n${xmlError.textContent}`
      };
    }

    // 2. XSLT Ayrıştırma
    const xsltDoc = parser.parseFromString(xsltString, 'application/xml');
    const xsltError = xsltDoc.querySelector('parsererror');
    if (xsltError) {
      return {
        html: '',
        error: `XSLT Ayrıştırma Hatası:\n${xsltError.textContent}`
      };
    }

    // 3. XSLT Elemanlarına Geçici Benzersiz ID Enjeksiyonu (data-xslt-id)
    if (xsltDoc.documentElement) {
      injectXsltIdsWithCounter(xsltDoc.documentElement, 1);
    }

    // 4. XSLT Dönüşüm İşlemi
    const xsltProcessor = new XSLTProcessor();
    try {
      xsltProcessor.importStylesheet(xsltDoc);
    } catch (e: any) {
      return {
        html: '',
        error: `XSLT Şablon Yükleme Hatası (importStylesheet):\n${e?.message || e}`
      };
    }

    try {
      const transformedDoc = xsltProcessor.transformToDocument(xmlDoc);
      
      // Bazı tarayıcılarda transform sonucu boş veya hata belgesi dönebilir
      if (!transformedDoc) {
        return {
          html: '',
          error: 'XSLT Dönüşüm Hatası: Dönüşüm işlemi başarısız oldu veya boş (null) döküman döndü.'
        };
      }
      const transformError = transformedDoc.querySelector('parsererror');
      if (transformError) {
        return {
          html: '',
          error: `Dönüşüm Sonrası Ayrıştırma Hatası:\n${transformError.textContent}`
        };
      }

      const serializer = new XMLSerializer();
      let htmlString = serializer.serializeToString(transformedDoc);
      
      // Clean up unescaped CDATA blocks and HTML entities in <script> tags for HTML browser compatibility
      htmlString = htmlString.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (match, scriptContent) => {
        let cleaned = scriptContent;
        // Decode HTML entities that might have been escaped by XMLSerializer
        cleaned = cleaned.replace(/&amp;/g, '&');
        cleaned = cleaned.replace(/&lt;/g, '<');
        cleaned = cleaned.replace(/&gt;/g, '>');
        cleaned = cleaned.replace(/&quot;/g, '"');
        cleaned = cleaned.replace(/&apos;/g, "'");
        
        // Comment out CDATA blocks (both unescaped and escaped variations)
        cleaned = cleaned.replace(/(?:<!\[CDATA\[|&lt;!\[CDATA\[)/gi, '/*<![CDATA[*/');
        cleaned = cleaned.replace(/(?:\]\]>|\]\]&gt;)/gi, '/*]]>*/');
        
        return match.replace(scriptContent, cleaned);
      });
      
      // Expand self-closing HTML tags (like <div ... />) to prevent browser DOM hierarchy corruption
      htmlString = htmlString.replace(/<([^>]*?)\/>/g, (match, tagContent) => {
        const tagNameMatch = tagContent.match(/^([a-zA-Z0-9:-]+)/);
        if (tagNameMatch) {
          const tagName = tagNameMatch[1].toLowerCase();
          const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
          if (!voidElements.includes(tagName)) {
            return `<${tagContent}></${tagNameMatch[1]}>`;
          }
        }
        return match;
      });

      // Inject early iframe error reporting script at the top of <head>
      const errorHandlerScript = `
<script>
  window.onerror = function(message, source, lineno, colno) {
    window.parent.postMessage({
      source: 'iframe-error',
      message: message,
      lineno: lineno,
      colno: colno
    }, '*');
    return false;
  };
  (function() {
    const originalConsoleError = window.console.error;
    window.console.error = function() {
      window.parent.postMessage({
        source: 'iframe-console-error',
        args: Array.prototype.slice.call(arguments).map(function(a) {
          return typeof a === 'object' ? JSON.stringify(a) : String(a);
        })
      }, '*');
      if (originalConsoleError) {
        originalConsoleError.apply(window.console, arguments);
      }
    };
  })();
</script>
`;
      htmlString = htmlString.replace(/<head\b[^>]*>/i, (match) => match + errorHandlerScript);
      
      return { html: htmlString };
    } catch (transformErr: any) {
      return {
        html: '',
        error: `XSLT Dönüşüm Çalışma Zamanı Hatası:\n${transformErr?.message || transformErr}`
      };
    }
  } catch (err: any) {
    return {
      html: '',
      error: `Beklenmeyen Hata:\n${err?.message || err}`
    };
  }
}

/**
 * XML belgesi içerisindeki gömülü XSLT şablonunu (Base64) tespit edip çözer.
 */
export function extractEmbeddedXslt(xmlString: string): string | null {
  if (!xmlString.trim()) return null;

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    
    // UBL-TR standardında gömülü XSLT arıyoruz
    const binaryObjects = xmlDoc.getElementsByTagNameNS('*', 'EmbeddedDocumentBinaryObject');
    
    for (let i = 0; i < binaryObjects.length; i++) {
      const element = binaryObjects[i];
      const filename = element.getAttribute('filename') || '';
      const mimeCode = element.getAttribute('mimeCode') || '';
      
      const parent = element.parentElement;
      const documentType = parent?.parentElement?.querySelector('DocumentType, DocumentTypeCode')?.textContent || '';
      
      const isXslt = 
        filename.toLowerCase().endsWith('.xslt') || 
        filename.toLowerCase().endsWith('.xsl') ||
        mimeCode.toLowerCase().includes('xml') ||
        documentType.toUpperCase() === 'XSLT';

      if (isXslt) {
        const base64Content = element.textContent || '';
        if (base64Content.trim()) {
          try {
            const binaryString = atob(base64Content.trim());
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let j = 0; j < len; j++) {
              bytes[j] = binaryString.charCodeAt(j);
            }
            const decoder = new TextDecoder('utf-8');
            const decodedText = decoder.decode(bytes);
            
            if (decodedText.includes('stylesheet') || decodedText.includes('transform')) {
              return decodedText;
            }
          } catch (e) {
            console.error('Base64 XSLT okuma hatası:', e);
          }
        }
      }
    }
  } catch (err) {
    console.error('Gömülü XSLT ayıklanırken beklenmeyen hata oluştu:', err);
  }
  return null;
}

/**
 * XML belgesindeki gömülü XSLT şablonunu (AdditionalDocumentReference / EmbeddedDocumentBinaryObject) kaldırır.
 */
export function removeEmbeddedXslt(xmlString: string): string {
  if (!xmlString.trim()) return xmlString;

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    
    // AdditionalDocumentReference etiketlerini ara
    const docRefs = xmlDoc.getElementsByTagNameNS('*', 'AdditionalDocumentReference');
    const toRemove: Element[] = [];

    for (let i = 0; i < docRefs.length; i++) {
      const ref = docRefs[i];
      
      const docType = ref.querySelector('DocumentType, DocumentTypeCode')?.textContent || '';
      const hasXsltBinary = ref.querySelector('EmbeddedDocumentBinaryObject[filename*="xslt" i], EmbeddedDocumentBinaryObject[filename*="xsl" i]') !== null;

      if (docType.toUpperCase() === 'XSLT' || hasXsltBinary) {
        toRemove.push(ref);
      }
    }

    // Doğrudan EmbeddedDocumentBinaryObject olup üstünde reference olmayanlar varsa
    if (toRemove.length === 0) {
      const binaryObjects = xmlDoc.getElementsByTagNameNS('*', 'EmbeddedDocumentBinaryObject');
      for (let i = 0; i < binaryObjects.length; i++) {
        const obj = binaryObjects[i];
        const filename = obj.getAttribute('filename') || '';
        if (filename.toLowerCase().endsWith('.xslt') || filename.toLowerCase().endsWith('.xsl')) {
          toRemove.push(obj);
        }
      }
    }

    // Elemanları temizle
    toRemove.forEach(el => {
      el.parentNode?.removeChild(el);
    });

    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
  } catch (err) {
    console.error('Gömülü XSLT temizlenirken hata oluştu:', err);
    return xmlString;
  }
}

/**
 * XSLT içerisindeki belirli bir CSS sınıfının stil özelliğini günceller.
 */
export function updateXsltStyle(xsltCode: string, selector: string, property: string, newValue: string): string {
  if (!xsltCode.trim() || !selector || !property) return xsltCode;

  try {
    const styleBlockStart = xsltCode.indexOf('<style');
    const styleBlockEnd = xsltCode.indexOf('</style>');
    
    if (styleBlockStart === -1 || styleBlockEnd === -1) return xsltCode;
    
    const styleContent = xsltCode.substring(styleBlockStart, styleBlockEnd + 8);
    
    const escapedSelector = selector.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const selectorRegex = new RegExp(`(${escapedSelector}\\s*\\{[^}]*\\})`, 'i');
    const selectorMatch = styleContent.match(selectorRegex);
    
    if (selectorMatch) {
      const block = selectorMatch[1];
      
      const propRegex = new RegExp(`(${property}\\s*:\\s*)[^;}]+(;?)`, 'i');
      let newBlock = '';
      
      if (block.match(propRegex)) {
        newBlock = block.replace(propRegex, `$1${newValue}$2`);
      } else {
        const insertIndex = block.lastIndexOf('}');
        if (insertIndex !== -1) {
          newBlock = block.substring(0, insertIndex) + `\n                        ${property}: ${newValue};` + block.substring(insertIndex);
        } else {
          newBlock = block;
        }
      }
      
      return xsltCode.replace(block, newBlock);
    }
  } catch (err) {
    console.error('Failed to update XSLT style', err);
  }
  return xsltCode;
}

/**
 * XSLT içerisindeki bir CSS sınıfından belirli bir stil değerini çeker.
 */
export function getXsltStyleValue(xsltCode: string, selector: string, property: string): string {
  if (!xsltCode.trim() || !selector || !property) return '';

  try {
    const styleBlockStart = xsltCode.indexOf('<style');
    const styleBlockEnd = xsltCode.indexOf('</style>');
    if (styleBlockStart === -1 || styleBlockEnd === -1) return '';
    
    const styleContent = xsltCode.substring(styleBlockStart, styleBlockEnd);
    const escapedSelector = selector.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const selectorRegex = new RegExp(`${escapedSelector}\\s*\\{[^}]*\\}`, 'i');
    const selectorMatch = styleContent.match(selectorRegex);
    
    if (selectorMatch) {
      const block = selectorMatch[0];
      const propRegex = new RegExp(`${property}\\s*:\\s*([^;}]+)`, 'i');
      const propMatch = block.match(propRegex);
      if (propMatch) {
        return propMatch[1].trim();
      }
    }
  } catch (e) {
    console.error('Failed to get XSLT style value', e);
  }
  return '';
}

/**
 * XSLT elemanının içeriğini fiziksel <nobr> etiketi içine sararak veya çıkararak
 * gerçek fatura motorlarında satır kaymasını kesin olarak önler.
 */
function applyNobrWrap(el: Element, enabled: boolean) {
  const doc = el.ownerDocument;
  if (!doc) return;

  const firstChild = el.firstElementChild;
  const isWrapped = firstChild && firstChild.tagName.toLowerCase() === 'nobr';

  if (enabled && !isWrapped) {
    const nobr = doc.createElement('nobr');
    while (el.firstChild) {
      nobr.appendChild(el.firstChild);
    }
    el.appendChild(nobr);
  } else if (!enabled && isWrapped && firstChild) {
    while (firstChild.firstChild) {
      el.insertBefore(firstChild.firstChild, firstChild);
    }
    el.removeChild(firstChild);
  }
}

/**
 * XSLT içerisindeki belirli bir elemanın inline CSS stil özelliğini ID'sine göre günceller.
 */
export function updateElementStyleInXsltById(
  xsltCode: string, 
  xsltId: string, 
  property: string, 
  value: string
): string {
  if (!xsltCode.trim() || !xsltId || !property) return xsltCode;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xsltCode, 'application/xml');
    
    if (doc.querySelector('parsererror')) {
      console.warn('XSLT parser error when updating style by ID');
      return xsltCode;
    }

    // Inject sequential IDs using the exact same deterministic algorithm
    if (doc.documentElement) {
      injectXsltIdsWithCounter(doc.documentElement, 1);
    }

    // Find the element by data-xslt-id
    const el = doc.documentElement ? findElementByXsltId(doc.documentElement, xsltId) : null;
    if (el) {
      // Parse the inline style attribute
      const currentStyle = el.getAttribute('style') || '';
      
      // Parse current CSS properties into a key-value map
      const stylesMap: Record<string, string> = {};
      currentStyle.split(';').forEach(pair => {
        const parts = pair.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim().toLowerCase();
          const val = parts.slice(1).join(':').trim();
          if (key) {
            stylesMap[key] = val;
          }
        }
      });

      // Update or add the property
      if (value) {
        let finalValue = value.trim();
        const importantProps = ['color', 'margin', 'padding', 'font-size', 'width', 'text-align', 'font-weight', 'font-style', 'text-decoration', 'white-space'];
        if (importantProps.includes(property.toLowerCase()) && !finalValue.toLowerCase().includes('!important')) {
          finalValue = `${finalValue} !important`;
        }
        stylesMap[property.toLowerCase()] = finalValue;
      } else {
        delete stylesMap[property.toLowerCase()];
      }

      // Reconstruct the style attribute string
      const styleString = Object.entries(stylesMap)
        .map(([k, v]) => `${k}: ${v}`)
        .join('; ');

      if (styleString) {
        el.setAttribute('style', styleString + ';');
      } else {
        el.removeAttribute('style');
      }

      // If property is width, also update raw HTML 'width' attribute for maximum compatibility in XML engines!
      if (property.toLowerCase() === 'width') {
        if (value) {
          const attrVal = value.replace(/\s*!important/gi, '').trim();
          el.setAttribute('width', attrVal);
        } else {
          el.removeAttribute('width');
        }
      }

      // If property is white-space, apply physical <nobr> wrapping inside template to ensure it never wraps in real invoices!
      if (property.toLowerCase() === 'white-space') {
        const isNowrap = value.toLowerCase().includes('nowrap');
        applyNobrWrap(el, isNowrap);
      }

      // Clean up all temporary data-xslt-id attributes
      if (doc.documentElement) {
        removeAllXsltIds(doc.documentElement);
      }

      return new XMLSerializer().serializeToString(doc);
    }
  } catch (err) {
    console.error('Failed to update element style in XSLT by ID', err);
  }
  return xsltCode;
}

/**
 * XSLT içerisindeki belirli bir elemanın metin içeriğini ID'sine göre günceller.
 */
export function updateElementTextInXsltById(xsltCode: string, xsltId: string, newText: string): string {
  if (!xsltCode.trim() || !xsltId) return xsltCode;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xsltCode, 'application/xml');
    
    if (doc.querySelector('parsererror')) {
      console.warn('XSLT parser error when updating element text by ID');
      return xsltCode;
    }

    // Inject sequential IDs using the exact same deterministic algorithm
    if (doc.documentElement) {
      injectXsltIdsWithCounter(doc.documentElement, 1);
    }

    // Find the element by data-xslt-id
    const el = doc.documentElement ? findElementByXsltId(doc.documentElement, xsltId) : null;
    if (el) {
      el.textContent = newText;

      // Clean up all temporary data-xslt-id attributes
      if (doc.documentElement) {
        removeAllXsltIds(doc.documentElement);
      }

      return new XMLSerializer().serializeToString(doc);
    }
  } catch (err) {
    console.error('Failed to update element text in XSLT by ID', err);
  }
  return xsltCode;
}

/**
 * XSLT kodundaki statik metinleri güvenli bir şekilde günceller.
 */
export function updateXsltText(xsltCode: string, oldText: string, newText: string): string {
  if (!oldText || oldText.trim() === '' || oldText === newText) return xsltCode;
  
  try {
    const trimmedOld = oldText.trim();
    const trimmedNew = newText.trim();

    if (xsltCode.includes(trimmedOld)) {
      return xsltCode.split(trimmedOld).join(trimmedNew);
    }
  } catch (err) {
    console.error('Failed to update XSLT text', err);
  }
  return xsltCode;
}

/**
 * XSLT DOM ağacındaki iki elemanın yerini değiştirir (swap).
 */
export function swapXsltElements(xsltCode: string, selectorA: string, selectorB: string): string {
  if (!xsltCode.trim() || !selectorA || !selectorB) return xsltCode;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xsltCode, 'application/xml');
    
    // Check if parse error occurred
    if (doc.querySelector('parsererror')) {
      console.warn('XSLT parser error when swapping');
      return xsltCode;
    }

    const classA = selectorA.startsWith('.') ? selectorA.substring(1) : selectorA;
    const classB = selectorB.startsWith('.') ? selectorB.substring(1) : selectorB;

    const findElementByClass = (root: Node, clsName: string): Element | null => {
      if (root.nodeType === Node.ELEMENT_NODE) {
        const el = root as Element;
        const cls = el.getAttribute('class') || '';
        if (cls.split(/\s+/).includes(clsName)) {
          return el;
        }
      }
      for (let i = 0; i < root.childNodes.length; i++) {
        const found = findElementByClass(root.childNodes[i], clsName);
        if (found) return found;
      }
      return null;
    };

    const elA = findElementByClass(doc.documentElement, classA);
    const elB = findElementByClass(doc.documentElement, classB);

    if (elA && elB && elA.parentNode === elB.parentNode && elA.parentNode !== null) {
      const parent = elA.parentNode;
      
      // We will perform a swap in the child nodes list
      const cloneA = elA.cloneNode(true);
      const cloneB = elB.cloneNode(true);
      
      parent.replaceChild(cloneA, elB);
      parent.replaceChild(cloneB, elA);

      const serializer = new XMLSerializer();
      return serializer.serializeToString(doc);
    }
  } catch (err) {
    console.error('Failed to swap XSLT elements', err);
  }
  return xsltCode;
}

/**
 * XSLT DOM ağacındaki watermark-stamp elemanının metnini güvenle günceller.
 */
export function updateWatermarkTextInXslt(xsltCode: string, newText: string): string {
  if (!xsltCode.trim()) return xsltCode;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xsltCode, 'application/xml');
    
    if (doc.querySelector('parsererror')) {
      console.warn('XSLT parser error when updating watermark text');
      return xsltCode;
    }

    const findElementByClass = (root: Node, clsName: string): Element | null => {
      if (root.nodeType === Node.ELEMENT_NODE) {
        const el = root as Element;
        const cls = el.getAttribute('class') || '';
        if (cls.split(/\s+/).includes(clsName)) {
          return el;
        }
      }
      for (let i = 0; i < root.childNodes.length; i++) {
        const found = findElementByClass(root.childNodes[i], clsName);
        if (found) return found;
      }
      return null;
    };

    const el = findElementByClass(doc.documentElement, 'watermark-stamp');
    if (el) {
      el.textContent = newText;
      const serializer = new XMLSerializer();
      return serializer.serializeToString(doc);
    }
  } catch (err) {
    console.error('Failed to update watermark text in XSLT', err);
  }
  return xsltCode;
}

/**
 * Bir XSLT görselinin base64 verisinden üretilecekWatermarkJSON'dur.
 * Görsel gövdede tam ortalanmış, silüet (siyah + düşük opaklık) olarak konumlanır.
 */
export interface WatermarkOptions {
  image: string;         // base64 data URI (örn. "data:image/png;base64,....")
  size: number;           // fatura genişliğine göre yüzde (1-100)
  opacity: number;        // 0-100 (silüet için düşük değer önerilir)
  rotation: number;       // derece
}

const WATERMARK_START_MARKER = '<!-- uni-watermark-start -->';
const WATERMARK_END_MARKER = '<!-- uni-watermark-end -->';

function escapeForXmlAttribute(text: string): string {
  return text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"');
}

function buildWatermarkBlock(opts: WatermarkOptions): string {
  const { image, size, opacity, rotation } = opts;
  const safeSize = Math.max(1, Math.min(100, Math.round(size)));
  const safeOpacity = Math.max(0, Math.min(100, Math.round(opacity)));
  const safeRotation = Math.round(rotation);
  // Watermark rendered IN FRONT of content (high z-index) but with low opacity + pointer-events:none +
  // mix-blend-mode:multiply. This is the standard e-invoice watermark technique: the watermark
  // sits visually on top but is semi-transparent so the underlying invoice content remains readable.
  // `mix-blend-mode:multiply` lets light backgrounds show through the watermark, giving the feel
  // of a background watermark even though it's stacked on top. On print, multiply + transparent
  // areas won't print as solid blocks.
  const overlayStyle = [
    'position:absolute',
    'top:0',
    'left:0',
    'width:210mm',
    'height:297mm',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'pointer-events:none',
    'z-index:9999',
    'mix-blend-mode:multiply',
    'overflow:hidden',
  ].join('; ');
  const imgStyle = [
    `width:${safeSize}%`,
    'height:auto',
    'max-height:100%',
    'object-fit:contain',
    `opacity:${(safeOpacity / 100).toFixed(2)}`,
    `transform:rotate(${safeRotation}deg)`,
    '-webkit-user-select:none',
    'user-select:none',
  ].join('; ');
  const escapedImage = escapeForXmlAttribute(image);
  return `${WATERMARK_START_MARKER}
<div class="uni-watermark-overlay" style="${overlayStyle}">
  <img src="${escapedImage}" alt="" style="${imgStyle}" />
</div>
${WATERMARK_END_MARKER}`;
}

/**
 * Verilen XSLT içeriğine görsel filigran (silüet) ekler.
 * `<body>` açılış etiketinden hemen sonra overlay div enjekte eder.
 * Eğer body yoksa, `<html>` açılışından sonra ekler.
 * Eğer zaten bir filigran bloğı varsa günceller (idempotent).
 *
 * XSLT koduna kalıcı olarak yazılır — kullanıcı düzenleyebilir.
 */
export function addWatermarkToXslt(xsltCode: string, opts: WatermarkOptions): string {
  if (!xsltCode.trim() || !opts.image) return xsltCode;

  try {
    const block = buildWatermarkBlock(opts);
    const startIdx = xsltCode.indexOf(WATERMARK_START_MARKER);
    if (startIdx !== -1) {
      const endIdx = xsltCode.indexOf(WATERMARK_END_MARKER, startIdx);
      if (endIdx !== -1) {
        const afterEnd = xsltCode.indexOf('>', endIdx);
        const tail = afterEnd !== -1 ? xsltCode.substring(afterEnd + 1) : '';
        return xsltCode.substring(0, startIdx) + block + tail;
      }
    }

    // Body açılışını bul (multi-line attribute'lara dayanıklı regex)
    const bodyMatch = xsltCode.match(/<body\b[^>]*>/i);
    if (bodyMatch && bodyMatch.index !== undefined) {
      const insertAt = bodyMatch.index + bodyMatch[0].length;
      return xsltCode.substring(0, insertAt) + '\n' + block + xsltCode.substring(insertAt);
    }

    // Html açılışını bul (body yokken yedek)
    const htmlMatch = xsltCode.match(/<html\b[^>]*>/i);
    if (htmlMatch && htmlMatch.index !== undefined) {
      const insertAt = htmlMatch.index + htmlMatch[0].length;
      return xsltCode.substring(0, insertAt) + '\n' + block + xsltCode.substring(insertAt);
    }

    return xsltCode;
  } catch (err) {
    console.error('Failed to add watermark to XSLT', err);
    return xsltCode;
  }
}

/**
 * XSLT içinden uni-watermark overlay bloğunu kaldırır.
 * Marker comment'leriyle çevrelenmiş bloğu temizler.
 */
export function removeWatermarkFromXslt(xsltCode: string): string {
  if (!xsltCode.trim()) return xsltCode;
  try {
    const startIdx = xsltCode.indexOf(WATERMARK_START_MARKER);
    if (startIdx === -1) return xsltCode;
    const endIdx = xsltCode.indexOf(WATERMARK_END_MARKER, startIdx);
    if (endIdx === -1) return xsltCode;
    const afterEnd = xsltCode.indexOf('>', endIdx);
    const tail = afterEnd !== -1 ? xsltCode.substring(afterEnd + 1) : '';
    return xsltCode.substring(0, startIdx) + tail.replace(/^\n+/, '');
  } catch (err) {
    console.error('Failed to remove watermark from XSLT', err);
    return xsltCode;
  }
}

/**
 * XSLT içeriğinde şu anda bir filigran bloğu var mı kontrol eder.
 */
export function hasWatermarkInXslt(xsltCode: string): boolean {
  if (!xsltCode.trim()) return false;
  return xsltCode.indexOf(WATERMARK_START_MARKER) !== -1;
}

/**
 * XSLT içerisine yeni bir metin alanı ekler ve onun için CSS kuralı tanımlar.
 */
export function addElementToXslt(
  xsltCode: string, 
  parentSelector: string, 
  text: string,
  details?: { xsltId?: string }
): string {
  if (!xsltCode.trim()) return xsltCode;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xsltCode, 'application/xml');
    
    if (doc.querySelector('parsererror')) {
      console.warn('XSLT parser error when adding element');
      return xsltCode;
    }

    let parentEl: Element | null = null;

    // 1. Try to find parent by unique temporary XSLT ID if details is provided
    if (details && details.xsltId) {
      injectXsltIdsWithCounter(doc.documentElement, 1);
      parentEl = findElementByXsltId(doc.documentElement, String(details.xsltId));
    }

    // 2. Fallback to selector matching if not found by XSLT ID
    if (!parentEl && parentSelector) {
      if (parentSelector.startsWith('#')) {
        const idToFind = parentSelector.substring(1);
        const findElementById = (root: Node): Element | null => {
          if (root.nodeType === Node.ELEMENT_NODE) {
            const element = root as Element;
            if (element.getAttribute('id') === idToFind) {
              return element;
            }
          }
          for (let i = 0; i < root.childNodes.length; i++) {
            const found = findElementById(root.childNodes[i]);
            if (found) return found;
          }
          return null;
        };
        parentEl = findElementById(doc.documentElement);
      } else if (parentSelector.startsWith('.')) {
        const classToFind = parentSelector.substring(1);
        const findElementByClass = (root: Node): Element | null => {
          if (root.nodeType === Node.ELEMENT_NODE) {
            const element = root as Element;
            const cls = element.getAttribute('class') || '';
            if (cls.split(/\s+/).includes(classToFind)) {
              return element;
            }
          }
          for (let i = 0; i < root.childNodes.length; i++) {
            const found = findElementByClass(root.childNodes[i]);
            if (found) return found;
          }
          return null;
        };
        parentEl = findElementByClass(doc.documentElement);
      } else {
        const tagToFind = parentSelector.toLowerCase();
        const findElementByTag = (root: Node): Element | null => {
          if (root.nodeType === Node.ELEMENT_NODE) {
            const element = root as Element;
            if (element.tagName.toLowerCase() === tagToFind) {
              return element;
            }
          }
          for (let i = 0; i < root.childNodes.length; i++) {
            const found = findElementByTag(root.childNodes[i]);
            if (found) return found;
          }
          return null;
        };
        parentEl = findElementByTag(doc.documentElement);
      }
    }

    if (parentEl) {
      const uniqueId = Date.now();
      const newClassName = `custom-text-${uniqueId}`;

      // Yeni div elemanı oluştur
      const newDiv = doc.createElement('div');
      newDiv.setAttribute('class', `${newClassName} custom-text-box`);
      newDiv.textContent = text;
      
      parentEl.appendChild(newDiv);

      // Clean up temporary IDs
      if (doc.documentElement) {
        removeAllXsltIds(doc.documentElement);
      }
      
      let serialized = new XMLSerializer().serializeToString(doc);

      // CSS stil bloğuna kuralı ekle
      const styleBlockEnd = serialized.indexOf('</style>');
      if (styleBlockEnd !== -1) {
        const cssRule = `\n                    .${newClassName} {
                        display: block;
                        margin: 5px 0px;
                        padding: 0px;
                        font-size: 13px;
                        color: #333333;
                    }`;
        serialized = serialized.substring(0, styleBlockEnd) + cssRule + serialized.substring(styleBlockEnd);
      }
      
      return serialized;
    }
  } catch (err) {
    console.error('Failed to add element to XSLT', err);
  }
  return xsltCode;
}

/**
 * XSLT içerisindeki bir elemanı sınıfına, ID'sine veya tag adına göre kaldırır ve stil kuralını temizler.
 */
export function removeElementFromXslt(xsltCode: string, selector: string, details?: any): string {
  if (!xsltCode.trim() || !selector) return xsltCode;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xsltCode, 'application/xml');
    
    if (doc.querySelector('parsererror')) {
      console.warn('XSLT parser error when removing element');
      return xsltCode;
    }

    let el: Element | null = null;

    // 1. Try to find by tableXsltId (remove whole table) — table seçildiğinde tüm tabloyu sil
    if (!el && details && details.tableXsltId) {
      injectXsltIdsWithCounter(doc.documentElement, 1);
      const tableEl = findElementByXsltId(doc.documentElement, String(details.tableXsltId));
      if (tableEl && tableEl.tagName.toLowerCase() === 'table') {
        el = tableEl;
      }
    }

    // 2. Try to find by unique temporary XSLT ID if details is provided
    if (!el && details && details.xsltId) {
      injectXsltIdsWithCounter(doc.documentElement, 1);
      el = findElementByXsltId(doc.documentElement, String(details.xsltId));
    }

    // 3. If not found by XSLT ID, fallback to detailed image matching (by index first, then base64)
    if (!el && details && details.targetTagName) {
      const targetTag = details.targetTagName.toLowerCase();
      const targetSrc = details.targetSrc || '';

      // 3a. If imageIndex is provided, find the n-th <img> element deterministically
      if (targetTag === 'img' && details.imageIndex !== undefined && details.imageIndex !== null && details.imageIndex !== -1) {
        const targetIdx = Number(details.imageIndex);
        if (!Number.isNaN(targetIdx)) {
          let imgCounter = 0;
          const findNthImg = (root: Node): Element | null => {
            if (root.nodeType === Node.ELEMENT_NODE) {
              const element = root as Element;
              if (element.tagName.toLowerCase() === 'img' && !element.closest('uni-watermark-overlay, .uni-watermark-overlay, .uni-watermark-preview-overlay')) {
                if (imgCounter === targetIdx) return element;
                imgCounter++;
              }
            }
            for (let i = 0; i < root.childNodes.length; i++) {
              const found = findNthImg(root.childNodes[i]);
              if (found) return found;
            }
            return null;
          };
          el = findNthImg(doc.documentElement);
        }
      }

      // 3b. Fallback to base64 substring matching (longer prefix for accuracy)
      if (!el && targetTag === 'img' && targetSrc) {
        const findExactElement = (root: Node): Element | null => {
          if (root.nodeType === Node.ELEMENT_NODE) {
            const element = root as Element;
            if (element.tagName.toLowerCase() === targetTag) {
              const elementSrc = element.getAttribute('src') || '';
              // Use a longer prefix (256 chars) for reliable discrimination between similar images
              const cleanTargetSrc = targetSrc.replace(/^data:image\/[a-zA-Z]+;base64,/, '').replace(/\s/g, '').substring(0, 256);
              const cleanElementSrc = elementSrc.replace(/^data:image\/[a-zA-Z]+;base64,/, '').replace(/\s/g, '').substring(0, 256);
              if (cleanElementSrc && cleanTargetSrc && cleanElementSrc.includes(cleanTargetSrc)) {
                return element;
              }
            }
          }
          for (let i = 0; i < root.childNodes.length; i++) {
            const found = findExactElement(root.childNodes[i]);
            if (found) return found;
          }
          return null;
        };

        el = findExactElement(doc.documentElement);
      }

      // 3c. Non-image tags: match by tag name (and optional href for <a>)
      if (!el && targetTag !== 'img') {
        const findExactElement = (root: Node): Element | null => {
          if (root.nodeType === Node.ELEMENT_NODE) {
            const element = root as Element;
            if (element.tagName.toLowerCase() === targetTag) {
              if (targetTag === 'a' && details.targetHref) {
                if (element.getAttribute('href') !== details.targetHref) {
                  // Skip wrong <a>
                } else {
                  return element;
                }
              } else {
                return element;
              }
            }
          }
          for (let i = 0; i < root.childNodes.length; i++) {
            const found = findExactElement(root.childNodes[i]);
            if (found) return found;
          }
          return null;
        };
        el = findExactElement(doc.documentElement);
      }
    }

    // 4. Fallback to selector matching if exact match not found AND no xsltId was provided
    if (!el && (!details || !details.xsltId)) {
      if (selector.startsWith('#')) {
        const idToFind = selector.substring(1);
        const findElementById = (root: Node): Element | null => {
          if (root.nodeType === Node.ELEMENT_NODE) {
            const element = root as Element;
            if (element.getAttribute('id') === idToFind) {
              return element;
            }
          }
          for (let i = 0; i < root.childNodes.length; i++) {
            const found = findElementById(root.childNodes[i]);
            if (found) return found;
          }
          return null;
        };
        el = findElementById(doc.documentElement);
      } else if (selector.startsWith('.')) {
        const classToFind = selector.substring(1);
        const findElementByClass = (root: Node): Element | null => {
          if (root.nodeType === Node.ELEMENT_NODE) {
            const element = root as Element;
            const cls = element.getAttribute('class') || '';
            if (cls.split(/\s+/).includes(classToFind)) {
              return element;
            }
          }
          for (let i = 0; i < root.childNodes.length; i++) {
            const found = findElementByClass(root.childNodes[i]);
            if (found) return found;
          }
          return null;
        };
        el = findElementByClass(doc.documentElement);
      } else {
        const tagToFind = selector.toLowerCase();
        const findElementByTag = (root: Node): Element | null => {
          if (root.nodeType === Node.ELEMENT_NODE) {
            const element = root as Element;
            if (element.tagName.toLowerCase() === tagToFind) {
              return element;
            }
          }
          for (let i = 0; i < root.childNodes.length; i++) {
            const found = findElementByTag(root.childNodes[i]);
            if (found) return found;
          }
          return null;
        };
        el = findElementByTag(doc.documentElement);
      }
    }

    if (el && el.parentNode) {
      el.parentNode.removeChild(el);

      // Clean up all temporary data-xslt-id attributes before serializing
      if (doc.documentElement) {
        removeAllXsltIds(doc.documentElement);
      }

      let serialized = new XMLSerializer().serializeToString(doc);

      // CSS stil kuralını temizle
      if (selector.startsWith('.') || selector.startsWith('#')) {
        const escapedSelector = selector.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const cssRegex = new RegExp(`\\s*${escapedSelector}\\s*\\{[^}]*\\}`, 'i');
        serialized = serialized.replace(cssRegex, '');
      }

      return serialized;
    }
  } catch (err) {
    console.error('Failed to remove element from XSLT', err);
  }
  return xsltCode;
}

/**
 * XSLT DOM ağacındaki belirli bir sınıf adına sahip elemanın metnini günceller.
 */
export function updateElementTextInXsltByClass(xsltCode: string, className: string, newText: string): string {
  if (!xsltCode.trim() || !className) return xsltCode;

  try {
    const firstClass = className.split(/\s+/).filter(c => c.trim().length > 0 && c !== 'uni-selected-element')[0];
    if (!firstClass) return xsltCode;

    const parser = new DOMParser();
    const doc = parser.parseFromString(xsltCode, 'application/xml');
    
    if (doc.querySelector('parsererror')) {
      console.warn('XSLT parser error when updating text by class');
      return xsltCode;
    }

    const findElementByClass = (root: Node, clsName: string): Element | null => {
      if (root.nodeType === Node.ELEMENT_NODE) {
        const el = root as Element;
        const cls = el.getAttribute('class') || '';
        if (cls.split(/\s+/).includes(clsName)) {
          return el;
        }
      }
      for (let i = 0; i < root.childNodes.length; i++) {
        const found = findElementByClass(root.childNodes[i], clsName);
        if (found) return found;
      }
      return null;
    };

    const el = findElementByClass(doc.documentElement, firstClass);
    if (el) {
      el.textContent = newText;
      const serializer = new XMLSerializer();
      return serializer.serializeToString(doc);
    }
  } catch (err) {
    console.error('Failed to update element text in XSLT by class', err);
  }
  return xsltCode;
}

/**
 * Monaco editöründe hedeflenen satırdaki XML etiketinin width ve style özelliklerini
 * doğrudan metin (string) düzeyinde günceller. Bu sayede tüm belgenin parse/serialize
 * edilip bozulma ihtimalini ortadan kaldırır.
 */
export function updateXsltTagAtLine(
  xsltContent: string,
  lineNumber: number,
  property: string,
  value: string
): string {
  if (lineNumber < 1) return xsltContent;
  const lines = xsltContent.split('\n');
  const lineIndex = lineNumber - 1;
  if (lineIndex >= lines.length) return xsltContent;

  let lineText = lines[lineIndex];
  const tagMatch = lineText.match(/<([a-zA-Z0-9:-]+)/);
  if (!tagMatch) return xsltContent;

  let tagName = tagMatch[1];
  let activeLineIndex = lineIndex;

  // XSLT etiketlerini (örn: <xsl:text>) doğrudan değiştirmeyi engelle; en yakın üst HTML kapsayıcısını bul
  if (tagName.startsWith('xsl:')) {
    let foundHtmlParent = false;
    for (let k = lineIndex - 1; k >= 0; k--) {
      const parentLineText = lines[k];
      const parentTagMatch = parentLineText.match(/<([a-zA-Z0-9:-]+)/);
      if (parentTagMatch) {
        const parentTagName = parentTagMatch[1];
        if (!parentTagName.startsWith('xsl:') && !parentLineText.includes('/>') && !parentLineText.includes('</' + parentTagName + '>')) {
          activeLineIndex = k;
          lineText = parentLineText;
          tagName = parentTagName;
          foundHtmlParent = true;
          break;
        }
      }
    }
    if (!foundHtmlParent) return xsltContent; // Üst HTML kapsayıcısı yoksa işlemi pas geç
  }

  // 1. White-space için <nobr> sarmalı (Çoklu satır uyumlu ve etiket eşleşme garantili)
  if (property.toLowerCase() === 'white-space') {
    const isNowrap = value.toLowerCase().includes('nowrap');
    const hasNobr = lineText.includes('<nobr>') || lineText.includes('&lt;nobr&gt;');
    
    if (isNowrap && !hasNobr) {
      const tagCloseIndex = lineText.indexOf('>');
      if (tagCloseIndex !== -1) {
        if (lineText.charAt(tagCloseIndex - 1) === '/') return xsltContent;
        
        const endTagStr = `</${tagName}>`;
        let endLineIndex = -1;
        let openTagsCount = 0;

        for (let j = activeLineIndex; j < lines.length; j++) {
          const currentLine = lines[j];
          const openMatches = currentLine.match(new RegExp(`<${tagName}\\b`, 'g')) || [];
          const closeMatches = currentLine.match(new RegExp(`</${tagName}>`, 'g')) || [];
          
          openTagsCount += openMatches.length;
          openTagsCount -= closeMatches.length;
          
          if (openTagsCount <= 0) {
            endLineIndex = j;
            break;
          }
        }

        if (endLineIndex !== -1) {
          if (endLineIndex === activeLineIndex) {
            const endTagIndex = lineText.lastIndexOf(endTagStr);
            if (endTagIndex > tagCloseIndex) {
              lineText = lineText.substring(0, tagCloseIndex + 1) + 
                         '<nobr>' + 
                         lineText.substring(tagCloseIndex + 1, endTagIndex) + 
                         '</nobr>' + 
                         lineText.substring(endTagIndex);
              lines[activeLineIndex] = lineText;
            }
          } else {
            lineText = lineText.substring(0, tagCloseIndex + 1) + '<nobr>' + lineText.substring(tagCloseIndex + 1);
            const endLineText = lines[endLineIndex];
            const endTagIndex = endLineText.indexOf(endTagStr);
            if (endTagIndex !== -1) {
              lines[endLineIndex] = endLineText.substring(0, endTagIndex) + '</nobr>' + endLineText.substring(endTagIndex);
            }
          }
        }
      }
    } else if (!isNowrap && hasNobr) {
      lineText = lineText.replace(/<nobr>/gi, '');
      if (lineText.includes('</nobr>')) {
        lineText = lineText.replace(/<\/nobr>/gi, '');
      } else {
        for (let j = activeLineIndex + 1; j < lines.length; j++) {
          if (lines[j].includes('</nobr>')) {
            lines[j] = lines[j].replace(/<\/nobr>/gi, '');
            break;
          }
        }
      }
      lines[activeLineIndex] = lineText;
    }
    lines[activeLineIndex] = lineText;
  }

  // 2. Şimdi, activeLineIndex'te başlayan start tag'i bulup style ve width niteliklerini güncelleyelim.
  let fullTagText = '';
  let endTagLineIndex = activeLineIndex;
  let firstCloseIndex = -1;

  for (let k = activeLineIndex; k < lines.length; k++) {
    const lineVal = lines[k];
    firstCloseIndex = lineVal.indexOf('>');
    if (firstCloseIndex !== -1) {
      fullTagText += (k === activeLineIndex ? '' : '\n') + lineVal.substring(0, firstCloseIndex + 1);
      endTagLineIndex = k;
      break;
    } else {
      fullTagText += (k === activeLineIndex ? '' : '\n') + lineVal;
    }
  }

  if (firstCloseIndex !== -1) {
    const updatedTag = updateAttributesInTagString(fullTagText, property, value);
    const lineRemainder = lines[endTagLineIndex].substring(firstCloseIndex + 1);
    lines.splice(activeLineIndex, endTagLineIndex - activeLineIndex + 1, updatedTag + lineRemainder);
  }

  return lines.join('\n');
}

/**
 * Bir tag string'i içerisindeki nitelikleri (style, width vb.) güvenli bir şekilde günceller.
 */
function updateAttributesInTagString(tagString: string, property: string, value: string): string {
  try {
    const parser = new DOMParser();
    const isSelfClosing = tagString.trim().endsWith('/>');
    const cleanTag = isSelfClosing ? tagString : tagString.replace(/>\s*$/, '/>');
    const xml = `<root>${cleanTag}</root>`;
    const doc = parser.parseFromString(xml, 'application/xml');
    
    if (doc.querySelector('parsererror')) {
      return tagString;
    }
    
    const el = doc.documentElement.firstElementChild;
    if (!el) return tagString;

    // Width niteliği
    if (property.toLowerCase() === 'width') {
      const cleanVal = value.replace(/\s*!important/gi, '').trim();
      if (cleanVal) {
        el.setAttribute('width', cleanVal);
      } else {
        el.removeAttribute('width');
      }
    }

    // nowrap niteliği (Sadece td ve th için geçerlidir)
    if (property.toLowerCase() === 'white-space') {
      const isNowrap = value.toLowerCase().includes('nowrap');
      const tagName = el.tagName.toLowerCase();
      if (tagName === 'td' || tagName === 'th') {
        if (isNowrap) {
          el.setAttribute('nowrap', 'nowrap');
        } else {
          el.removeAttribute('nowrap');
        }
      }
    }

    // Style niteliği
    const currentStyle = el.getAttribute('style') || '';
    const stylesMap: Record<string, string> = {};
    currentStyle.split(';').forEach(pair => {
      const parts = pair.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim().toLowerCase();
        const val = parts.slice(1).join(':').trim();
        if (key) stylesMap[key] = val;
      }
    });

    if (value) {
      let finalValue = value.trim();
      const importantProps = ['color', 'margin', 'padding', 'font-size', 'width', 'text-align', 'font-weight', 'font-style', 'text-decoration', 'white-space'];
      if (importantProps.includes(property.toLowerCase()) && !finalValue.toLowerCase().includes('!important')) {
        finalValue = `${finalValue} !important`;
      }
      stylesMap[property.toLowerCase()] = finalValue;
    } else {
      delete stylesMap[property.toLowerCase()];
    }

    const styleString = Object.entries(stylesMap)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');

    if (styleString) {
      el.setAttribute('style', styleString + ';');
    } else {
      el.removeAttribute('style');
    }

    const serializer = new XMLSerializer();
    let serializedEl = serializer.serializeToString(el);

    if (isSelfClosing && !serializedEl.endsWith('/>')) {
      serializedEl = serializedEl.replace(/>$/, '/>');
    } else if (!isSelfClosing && serializedEl.endsWith('/>')) {
      serializedEl = serializedEl.replace(/\/>$/, '>');
    }

    return serializedEl;
  } catch (e) {
    console.error('Error updating attributes in tag string', e);
    return tagString;
  }
}

export interface ImageInfo {
  src: string;
  alt: string;
  className: string;
  xsltId: string;
  index: number;
  isBase64: boolean;
  previewSrc: string;
  wrapperClass: string;
  currentWidth: string;
  currentAlign: string;
  currentMargin: string;
  currentFloat: string;
}

function parseImgStyle(styleStr: string, property: string): string {
  if (!styleStr || !property) return '';
  const regex = new RegExp(`${property}\\s*:\\s*([^;]+)`, 'i');
  const match = styleStr.match(regex);
  return match ? match[1].trim() : '';
}

function findImgTagBySrc(xsltCode: string, imgSrc: string): string | null {
  if (imgSrc.length < 200) {
    const escapedSrc = imgSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const imgRegex = new RegExp(`<img\\b[^>]*src\\s*=\\s*["']${escapedSrc}["'][^>]*/?>`, 'i');
    const match = xsltCode.match(imgRegex);
    return match ? match[0] : null;
  }
  const srcIdx = xsltCode.indexOf(imgSrc);
  if (srcIdx === -1) return null;
  const before = xsltCode.lastIndexOf('<img', srcIdx);
  if (before === -1) return null;
  const after = xsltCode.indexOf('>', srcIdx);
  if (after === -1) return null;
  return xsltCode.substring(before, after + 1);
}

function parseWrapperStyle(xsltCode: string, imgSrc: string, property: string): string {
  if (imgSrc.length < 200) {
    const escapedSrc = imgSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wrapperMatch = xsltCode.match(new RegExp(`<div[^>]*>\\s*<img[^>]*src\\s*=\\s*["']${escapedSrc}["']`, 'i'));
    if (!wrapperMatch) return '';
    const wrapperStart = wrapperMatch[0];
    const styleMatch = wrapperStart.match(/style\s*=\s*["']([^"']*)["']/i);
    if (styleMatch) {
      return parseImgStyle(styleMatch[1], property);
    }
    return '';
  }
  const srcIdx = xsltCode.indexOf(imgSrc);
  if (srcIdx === -1) return '';
  const beforeDiv = xsltCode.lastIndexOf('<div', srcIdx);
  if (beforeDiv === -1) return '';
  const divEnd = xsltCode.indexOf('>', beforeDiv);
  if (divEnd === -1 || divEnd < srcIdx) return '';
  const divOpenTag = xsltCode.substring(beforeDiv, divEnd + 1);
  const styleMatch = divOpenTag.match(/style\s*=\s*["']([^"']*)["']/i);
  if (styleMatch) {
    return parseImgStyle(styleMatch[1], property);
  }
  return '';
}

function updateImgStyleInTag(tagContent: string, property: string, value: string): string {
  const styleMatch = tagContent.match(/style\s*=\s*["']([^"']*)["']/i);
  const fullStyleAttr = styleMatch ? styleMatch[0] : '';
  const currentStyle = styleMatch ? styleMatch[1] : '';

  const props = currentStyle.split(';').filter(Boolean).map(s => s.trim());
  const newProps: string[] = [];
  let found = false;

  props.forEach(p => {
    const parts = p.split(':');
    const key = parts[0]?.trim().toLowerCase();
    if (key === property.toLowerCase()) {
      newProps.push(`${property}: ${value}`);
      found = true;
    } else {
      newProps.push(p);
    }
  });

  if (!found) {
    newProps.push(`${property}: ${value}`);
  }

  const newStyle = newProps.join('; ');
  const newStyleAttr = `style="${newStyle}"`;

  if (fullStyleAttr) {
    return tagContent.replace(fullStyleAttr, newStyleAttr);
  } else {
    return tagContent + ' ' + newStyleAttr;
  }
}

function updateImgTagBySrc(xsltCode: string, imgSrc: string, property: string, value: string): string {
  if (imgSrc.length < 200) {
    const escapedSrc = imgSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const imgRegex = new RegExp(`(<img\\b[^>]*src\\s*=\\s*["']${escapedSrc}["'][^>]*)(/?>)`, 'i');
    return xsltCode.replace(imgRegex, (_match, before, closing) => {
      const updatedBefore = updateImgStyleInTag(before, property, value);
      return updatedBefore + closing;
    });
  }
  const tagContent = findImgTagBySrc(xsltCode, imgSrc);
  if (!tagContent) return xsltCode;
  const closingMatch = tagContent.match(/(\/?>)$/);
  if (!closingMatch) return xsltCode;
  const closing = closingMatch[1];
  const before = tagContent.slice(0, -closing.length).trimEnd();
  const updatedBefore = updateImgStyleInTag(before, property, value);
  return xsltCode.replace(tagContent, updatedBefore + closing);
}

function updateWrapperDivByImgSrc(xsltCode: string, imgSrc: string, property: string, value: string): string {
  if (imgSrc.length < 200) {
    const escapedSrc = imgSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wrapperRegex = new RegExp(`(<div\\b[^>]*>)\\s*\\n?\\s*(<img\\b[^>]*src\\s*=\\s*["']${escapedSrc}["'][^>]*/?>)`, 'i');
    return xsltCode.replace(wrapperRegex, (_match, divOpen, imgTag) => {
      const updatedDiv = updateImgStyleInTag(divOpen, property, value);
      return updatedDiv + '\n' + imgTag;
    });
  }
  const srcIdx = xsltCode.indexOf(imgSrc);
  if (srcIdx === -1) return xsltCode;
  const beforeDiv = xsltCode.lastIndexOf('<div', srcIdx);
  if (beforeDiv === -1) return xsltCode;
  const divClose = xsltCode.indexOf('>', beforeDiv);
  if (divClose === -1 || divClose >= srcIdx) return xsltCode;
  const divOpen = xsltCode.substring(beforeDiv, divClose + 1);
  const afterDiv = xsltCode.indexOf('<img', divClose);
  if (afterDiv === -1) return xsltCode;
  const imgClose = xsltCode.indexOf('>', afterDiv);
  if (imgClose === -1) return xsltCode;
  const imgTag = xsltCode.substring(afterDiv, imgClose + 1);
  const updatedDiv = updateImgStyleInTag(divOpen, property, value);
  const oldFragment = xsltCode.substring(beforeDiv, imgClose + 1);
  return xsltCode.replace(oldFragment, updatedDiv + '\n' + imgTag);
}

export function extractAllImagesFromXslt(xsltCode: string): ImageInfo[] {
  if (!xsltCode.trim()) return [];
  const results: ImageInfo[] = [];
  let index = 0;

  const imgRegex = /<img\b([^>]*?)>/gi;
  let match: RegExpExecArray | null;

  while ((match = imgRegex.exec(xsltCode)) !== null) {
    const tagContent = match[1];
    const srcMatch = tagContent.match(/src\s*=\s*["']([^"']*)["']/i);
    const altMatch = tagContent.match(/alt\s*=\s*["']([^"']*)["']/i);
    const classMatch = tagContent.match(/class\s*=\s*["']([^"']*)["']/i);
    const xsltIdMatch = tagContent.match(/data-xslt-id\s*=\s*["']([^"']*)["']/i);
    const styleStr = tagContent.match(/style\s*=\s*["']([^"']*)["']/i);

    const src = srcMatch ? srcMatch[1] : '';
    const alt = altMatch ? altMatch[1] : '';
    const className = classMatch ? classMatch[1] : '';
    const xsltId = xsltIdMatch ? xsltIdMatch[1] : '';
    const isBase64 = src.startsWith('data:image/');
    const styleText = styleStr ? styleStr[1] : '';

    let previewSrc = src;
    if (isBase64 && src.length > 200) {
      previewSrc = src.substring(0, 100) + '...' + src.slice(-20);
    }

    const currentWidth = parseImgStyle(styleText, 'width') || parseImgStyle(styleText, 'max-width') || '300px';
    const currentFloat = parseImgStyle(styleText, 'float') || 'none';

    const wrapperStyle = parseWrapperStyle(xsltCode, src, 'text-align');
    const wrapperMargin = parseWrapperStyle(xsltCode, src, 'margin');
    const wrapperFloat = parseWrapperStyle(xsltCode, src, 'float');

    let wrapperClass = '';
    if (src.length < 200) {
      const wrapperClassMatch = xsltCode.match(new RegExp(`<div\\b([^>]*)>\\s*<img[^>]*src\\s*=\\s*["']${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i'));
      wrapperClass = wrapperClassMatch?.[1]?.match(/class\s*=\s*["']([^"']*)["']/i)?.[1] || '';
    } else {
      const srcIdx = xsltCode.indexOf(src);
      if (srcIdx !== -1) {
        const beforeDiv = xsltCode.lastIndexOf('<div', srcIdx);
        if (beforeDiv !== -1) {
          const divEnd = xsltCode.indexOf('>', beforeDiv);
          if (divEnd !== -1 && divEnd < srcIdx) {
            const divAttrs = xsltCode.substring(beforeDiv + 4, divEnd);
            const clsMatch = divAttrs.match(/class\s*=\s*["']([^"']*)["']/i);
            wrapperClass = clsMatch ? clsMatch[1] : '';
          }
        }
      }
    }

    results.push({
      src, alt, className, xsltId, index, isBase64, previewSrc,
      wrapperClass,
      currentWidth,
      currentAlign: wrapperStyle || 'center',
      currentMargin: wrapperMargin || '10px 0px',
      currentFloat: wrapperFloat || currentFloat
    });
    index++;
  }

  return results;
}

export function replaceImageInXslt(xsltCode: string, oldSrc: string, newSrc: string): string {
  if (!xsltCode.trim() || !oldSrc || !newSrc) return xsltCode;
  try {
    return xsltCode.split(oldSrc).join(newSrc);
  } catch (err) {
    console.error('Failed to replace image in XSLT', err);
    return xsltCode;
  }
}

export function addImageToXslt(xsltCode: string, src: string, alt: string): string {
  if (!xsltCode.trim() || !src) return xsltCode;
  try {
    const imgTag = `<div style="text-align: center; margin: 10px 0px; padding: 0px;">
  <img src="${escapeForXmlAttribute(src)}" alt="${escapeForXmlAttribute(alt || '')}" style="max-width: 100%; width: 300px; height: auto; display: inline-block;" />
</div>`;

    const bodyMatch = xsltCode.match(/<body\b[^>]*>/i);
    if (bodyMatch && bodyMatch.index !== undefined) {
      const insertAt = bodyMatch.index + bodyMatch[0].length;
      const afterBody = xsltCode.substring(insertAt).trimStart();
      const indent = afterBody.startsWith('\n') ? '' : '\n';
      return xsltCode.substring(0, insertAt) + indent + imgTag + '\n' + afterBody;
    }

    const htmlMatch = xsltCode.match(/<html\b[^>]*>/i);
    if (htmlMatch && htmlMatch.index !== undefined) {
      const insertAt = htmlMatch.index + htmlMatch[0].length;
      return xsltCode.substring(0, insertAt) + '\n' + imgTag + xsltCode.substring(insertAt);
    }

    return xsltCode;
  } catch (err) {
    console.error('Failed to add image to XSLT', err);
    return xsltCode;
  }
}

export function updateImageStyleInXslt(xsltCode: string, imgSrc: string, property: string, value: string): string {
  if (!xsltCode.trim() || !imgSrc || !property) return xsltCode;
  try {
    const imgProps = ['width', 'max-width', 'height', 'display', 'float'];
    const wrapperProps = ['text-align', 'margin', 'padding', 'float'];

    if (wrapperProps.includes(property)) {
      const result = updateWrapperDivByImgSrc(xsltCode, imgSrc, property, value);
      if (result !== xsltCode) return result;
    }

    if (imgProps.includes(property)) {
      const result = updateImgTagBySrc(xsltCode, imgSrc, property, value);
      if (result !== xsltCode) return result;
    }

    return xsltCode;
  } catch (err) {
    console.error('Failed to update image style in XSLT', err);
    return xsltCode;
  }
}

export function getImageStyleFromXslt(xsltCode: string, imgSrc: string, property: string): string {
  if (!xsltCode.trim() || !imgSrc || !property) return '';
  try {
    const tagContent = findImgTagBySrc(xsltCode, imgSrc);
    if (!tagContent) return '';

    const styleMatch = tagContent.match(/style\s*=\s*["']([^"']*)["']/i);
    if (styleMatch) {
      const val = parseImgStyle(styleMatch[1], property);
      if (val) return val;
    }

    const wrapperProps = ['text-align', 'margin', 'padding'];

    if (wrapperProps.includes(property)) {
      return parseWrapperStyle(xsltCode, imgSrc, property);
    }

    return '';
  } catch (err) {
    console.error('Failed to get image style from XSLT', err);
    return '';
  }
}

export function getImageTransformFromXslt(xsltCode: string, imgSrc: string): { x: number; y: number } {
  if (!xsltCode.trim() || !imgSrc) return { x: 0, y: 0 };
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xsltCode, 'application/xml');
    if (doc.querySelector('parsererror')) return { x: 0, y: 0 };

    const imgEls = doc.querySelectorAll('img[src]');
    for (const el of imgEls) {
      if (el.getAttribute('src') === imgSrc) {
        const style = el.getAttribute('style') || '';
        const m = style.match(/transform\s*:\s*translate\s*\(\s*([-\d.]+)px\s*,\s*([-\d.]+)px\s*\)/i);
        if (m) return { x: parseFloat(m[1]) || 0, y: parseFloat(m[2]) || 0 };
        return { x: 0, y: 0 };
      }
    }
    return { x: 0, y: 0 };
  } catch {
    return { x: 0, y: 0 };
  }
}

export function setImageTransformInXslt(xsltCode: string, imgSrc: string, x: number, y: number): string {
  if (!xsltCode.trim() || !imgSrc) return xsltCode;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xsltCode, 'application/xml');
    if (doc.querySelector('parsererror')) {
      console.warn('XSLT parse error in setImageTransform');
      return xsltCode;
    }

    let target: Element | null = null;

    // QR targets are sent as "__qr__:<elementId>"
    if (imgSrc.startsWith('__qr__:')) {
      const qrId = imgSrc.slice('__qr__:'.length) || 'qrcode';
      target = doc.querySelector(`#${qrId}`);
    } else {
      const imgEls = doc.querySelectorAll('img[src]');
      for (const el of imgEls) {
        if (el.getAttribute('src') === imgSrc) {
          target = el;
          break;
        }
      }
    }

    if (!target) return xsltCode;

    const translateVal = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    const currentStyle = target.getAttribute('style') || '';

    const styles: Record<string, string> = {};
    currentStyle.split(';').forEach(pair => {
      const parts = pair.split(':');
      if (parts.length >= 2) {
        styles[parts[0].trim().toLowerCase()] = parts.slice(1).join(':').trim();
      }
    });

    styles['transform'] = translateVal;
    styles['position'] = 'relative';
    styles['z-index'] = '10';

    const newStyle = Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ');
    target.setAttribute('style', newStyle + ';');

    return new XMLSerializer().serializeToString(doc);
  } catch (err) {
    console.error('Failed to set image transform in XSLT', err);
    return xsltCode;
  }
}

/**
 * XSLT ID'sini (data-xslt-id) barındıran öğeyi DOM üzerinden bulup,
 * o öğenin Monaco editöründeki satır numarasını bulur.
 */
export function findLineByXsltId(xsltCode: string, targetId: string): number {
  if (!xsltCode.trim() || !targetId) return 0;
  try {
    let line = 1;
    let xsltIdCounter = 1;
    const target = Number(targetId);
    const counterToLine: Record<number, number> = {};
    
    // Find XSLT prefix from the stylesheet element, e.g. <xsl:stylesheet -> xsl
    let xslPrefix = 'xsl';
    const rootMatch = xsltCode.match(/<([a-zA-Z0-9_-]+):(?:stylesheet|transform)/i);
    if (rootMatch) {
      xslPrefix = rootMatch[1];
    }
    
    const xslPrefixColon = xslPrefix + ':';
    let inTag = false;
    let tagContent = '';
    let currentTagStartLine = 1;
    
    for (let i = 0; i < xsltCode.length; i++) {
      const char = xsltCode[i];
      if (char === '\n') {
        line++;
      }
      
      if (char === '<') {
        // Check if it's not a comment or CDATA
        if (xsltCode.startsWith('<!--', i)) {
          const closeIndex = xsltCode.indexOf('-->', i);
          if (closeIndex !== -1) {
            const commentText = xsltCode.substring(i, closeIndex + 3);
            const newlines = (commentText.match(/\n/g) || []).length;
            line += newlines;
            i = closeIndex + 2;
          }
          continue;
        }
        if (xsltCode.startsWith('<![CDATA[', i)) {
          const closeIndex = xsltCode.indexOf(']]>', i);
          if (closeIndex !== -1) {
            const cdataText = xsltCode.substring(i, closeIndex + 3);
            const newlines = (cdataText.match(/\n/g) || []).length;
            line += newlines;
            i = closeIndex + 2;
          }
          continue;
        }
        
        inTag = true;
        tagContent = '';
        currentTagStartLine = line;
        continue;
      }
      
      if (char === '>') {
        if (inTag) {
          inTag = false;
          tagContent = tagContent.trim();
          if (!tagContent.startsWith('/') && !tagContent.startsWith('?') && !tagContent.startsWith('!')) {
            const tagNameMatch = tagContent.match(/^([a-zA-Z0-9:-]+)/);
            if (tagNameMatch) {
              const name = tagNameMatch[1];
              if (!name.startsWith(xslPrefixColon)) {
                counterToLine[xsltIdCounter] = currentTagStartLine;
                xsltIdCounter++;
              }
            }
          }
        }
        continue;
      }
      
      if (inTag) {
        tagContent += char;
      }
    }
    
    // Direct match
    if (counterToLine[target]) return counterToLine[target];
    
    // Elements inside XSLT loops (for-each, apply-templates etc.)
    // produce multiple DOM copies but share the same template tag.
    // Use modulo to wrap around to the correct template position.
    const maxCounter = xsltIdCounter - 1;
    if (maxCounter > 0 && target > maxCounter) {
      const adjusted = ((target - 1) % maxCounter) + 1;
      return counterToLine[adjusted] || 0;
    }
  } catch (e) {
    console.error('Failed to find line by XSLT ID scanner', e);
  }
  return 0;
}

