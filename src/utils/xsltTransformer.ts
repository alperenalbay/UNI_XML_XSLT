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
    let xsltIdCounter = 1;
    const injectXsltIds = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        if (el.namespaceURI !== 'http://www.w3.org/1999/XSL/Transform') {
          el.setAttribute('data-xslt-id', String(xsltIdCounter++));
        }
      }
      for (let i = 0; i < node.childNodes.length; i++) {
        injectXsltIds(node.childNodes[i]);
      }
    };
    if (xsltDoc.documentElement) {
      injectXsltIds(xsltDoc.documentElement);
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
    let xsltIdCounter = 1;
    const injectXsltIds = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.namespaceURI !== 'http://www.w3.org/1999/XSL/Transform') {
          element.setAttribute('data-xslt-id', String(xsltIdCounter++));
        }
      }
      for (let i = 0; i < node.childNodes.length; i++) {
        injectXsltIds(node.childNodes[i]);
      }
    };
    if (doc.documentElement) {
      injectXsltIds(doc.documentElement);
    }

    // Find the element by data-xslt-id
    const idToFind = String(xsltId);
    const findElementByXsltId = (root: Node): Element | null => {
      if (root.nodeType === Node.ELEMENT_NODE) {
        const element = root as Element;
        if (element.getAttribute('data-xslt-id') === idToFind) {
          return element;
        }
      }
      for (let i = 0; i < root.childNodes.length; i++) {
        const found = findElementByXsltId(root.childNodes[i]);
        if (found) return found;
      }
      return null;
    };

    const el = findElementByXsltId(doc.documentElement);
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
        stylesMap[property.toLowerCase()] = value;
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

      // Clean up all temporary data-xslt-id attributes
      const removeXsltIds = (node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          (node as Element).removeAttribute('data-xslt-id');
        }
        for (let i = 0; i < node.childNodes.length; i++) {
          removeXsltIds(node.childNodes[i]);
        }
      };
      if (doc.documentElement) {
        removeXsltIds(doc.documentElement);
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
    let xsltIdCounter = 1;
    const injectXsltIds = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.namespaceURI !== 'http://www.w3.org/1999/XSL/Transform') {
          element.setAttribute('data-xslt-id', String(xsltIdCounter++));
        }
      }
      for (let i = 0; i < node.childNodes.length; i++) {
        injectXsltIds(node.childNodes[i]);
      }
    };
    if (doc.documentElement) {
      injectXsltIds(doc.documentElement);
    }

    // Find the element by data-xslt-id
    const idToFind = String(xsltId);
    const findElementByXsltId = (root: Node): Element | null => {
      if (root.nodeType === Node.ELEMENT_NODE) {
        const element = root as Element;
        if (element.getAttribute('data-xslt-id') === idToFind) {
          return element;
        }
      }
      for (let i = 0; i < root.childNodes.length; i++) {
        const found = findElementByXsltId(root.childNodes[i]);
        if (found) return found;
      }
      return null;
    };

    const el = findElementByXsltId(doc.documentElement);
    if (el) {
      el.textContent = newText;

      // Clean up all temporary data-xslt-id attributes
      const removeXsltIds = (node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          (node as Element).removeAttribute('data-xslt-id');
        }
        for (let i = 0; i < node.childNodes.length; i++) {
          removeXsltIds(node.childNodes[i]);
        }
      };
      if (doc.documentElement) {
        removeXsltIds(doc.documentElement);
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

    // 1. Try to find by unique temporary XSLT ID if details is provided
    if (details && details.xsltId) {
      let xsltIdCounter = 1;
      const injectXsltIds = (node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.namespaceURI !== 'http://www.w3.org/1999/XSL/Transform') {
            element.setAttribute('data-xslt-id', String(xsltIdCounter++));
          }
        }
        for (let i = 0; i < node.childNodes.length; i++) {
          injectXsltIds(node.childNodes[i]);
        }
      };
      if (doc.documentElement) {
        injectXsltIds(doc.documentElement);
      }

      const idToFind = String(details.xsltId);
      const findElementByXsltId = (root: Node): Element | null => {
        if (root.nodeType === Node.ELEMENT_NODE) {
          const element = root as Element;
          if (element.getAttribute('data-xslt-id') === idToFind) {
            return element;
          }
        }
        for (let i = 0; i < root.childNodes.length; i++) {
          const found = findElementByXsltId(root.childNodes[i]);
          if (found) return found;
        }
        return null;
      };
      el = findElementByXsltId(doc.documentElement);
    }

    // 2. If not found by XSLT ID, fallback to detailed base64 matching (for images)
    if (!el && details && details.targetTagName) {
      const targetTag = details.targetTagName.toLowerCase();
      const targetSrc = details.targetSrc || '';
      
      const findExactElement = (root: Node): Element | null => {
        if (root.nodeType === Node.ELEMENT_NODE) {
          const element = root as Element;
          if (element.tagName.toLowerCase() === targetTag) {
            // If it's an image, match src (either exact, or if XSLT contains it as substring)
            if (targetTag === 'img' && targetSrc) {
              const elementSrc = element.getAttribute('src') || '';
              const cleanTargetSrc = targetSrc.replace(/^data:image\/[a-zA-Z]+;base64,/, '').replace(/\s/g, '').substring(0, 50);
              const cleanElementSrc = elementSrc.replace(/^data:image\/[a-zA-Z]+;base64,/, '').replace(/\s/g, '').substring(0, 50);
              if (cleanElementSrc && cleanTargetSrc && cleanElementSrc.includes(cleanTargetSrc)) {
                return element;
              }
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

    // 2. Fallback to selector matching if exact match not found
    if (!el) {
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
      const removeXsltIds = (node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          (node as Element).removeAttribute('data-xslt-id');
        }
        for (let i = 0; i < node.childNodes.length; i++) {
          removeXsltIds(node.childNodes[i]);
        }
      };
      if (doc.documentElement) {
        removeXsltIds(doc.documentElement);
      }

      let serialized = new XMLSerializer().serializeToString(doc);

      // CSS stil kuralını temizle
      if (selector.startsWith('.') || selector.startsWith('#')) {
        const escapedSelector = selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
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







