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

    // 3. XSLT Dönüşüm İşlemi
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
      const transformError = transformedDoc.querySelector('parsererror');
      if (transformError) {
        return {
          html: '',
          error: `Dönüşüm Sonrası Ayrıştırma Hatası:\n${transformError.textContent}`
        };
      }

      const serializer = new XMLSerializer();
      const htmlString = serializer.serializeToString(transformedDoc);
      
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
    
    const escapedSelector = selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
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
    const escapedSelector = selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
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
 * XSLT içerisine yeni bir metin alanı ekler ve onun için CSS kuralı tanımlar.
 */
export function addElementToXslt(xsltCode: string, parentClassName: string, text: string): string {
  if (!xsltCode.trim() || !parentClassName) return xsltCode;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xsltCode, 'application/xml');
    
    if (doc.querySelector('parsererror')) {
      console.warn('XSLT parser error when adding element');
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

    const parentEl = findElementByClass(doc.documentElement, parentClassName);
    if (parentEl) {
      const uniqueId = Date.now();
      const newClassName = `custom-text-${uniqueId}`;

      // Yeni div elemanı oluştur
      const newDiv = doc.createElement('div');
      newDiv.setAttribute('class', `${newClassName} custom-text-box`);
      newDiv.textContent = text;
      
      parentEl.appendChild(newDiv);
      
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
 * XSLT içerisindeki bir elemanı sınıfına göre kaldırır ve stil kuralını temizler.
 */
export function removeElementFromXslt(xsltCode: string, className: string): string {
  if (!xsltCode.trim() || !className) return xsltCode;

  try {
    const cleanClass = className.startsWith('.') ? className.substring(1) : className;

    const parser = new DOMParser();
    const doc = parser.parseFromString(xsltCode, 'application/xml');
    
    if (doc.querySelector('parsererror')) {
      console.warn('XSLT parser error when removing element');
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

    const el = findElementByClass(doc.documentElement, cleanClass);
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
      
      let serialized = new XMLSerializer().serializeToString(doc);

      // CSS stil kuralını temizle
      const escapedClass = cleanClass.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const cssRegex = new RegExp(`\\s*\\.${escapedClass}\\s*\\{[^}]*\\}`, 'i');
      serialized = serialized.replace(cssRegex, '');

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







