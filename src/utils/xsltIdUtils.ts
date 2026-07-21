/**
 * XSLT elemanlarına sıralı `data-xslt-id` kimlik enjekte eden, bu kimliklerle
 * eleman bulan ve kaydetme öncesi kimlikleri temizleyen ortak yardımcılar.
 *
 * Tüm kullanım yerleri aynı deterministik algoritmayı kullanmak zorundadır;
 * aksi halde preview ile XSLT kodu arasındaki kimlik eşlemesi bozulur.
 * Bu dosya tek kaynak (single source of truth) olarak hizmet verir.
 */

const XSLT_NAMESPACE = 'http://www.w3.org/1999/XSL/Transform';

/**
 * Verilen DOM kökünden başlayarak tüm non-XSLT elemanlarına sıralı
 * `data-xslt-id` niteliği ekler. Sayacı dışarıdan vererek deterministik
 * tutmaya olanak tanır.
 *
 * @param root XSLT belgesinin kök düğümü
 * @param startCounter Başlangıç sayacı değeri (varsayılan 1)
 * @returns En son kullanılan sayaç değeri
 */
export function injectXsltIdsWithCounter(root: Node, startCounter = 1): number {
  let counter = startCounter;
  const walk = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      if (element.namespaceURI !== XSLT_NAMESPACE) {
        element.setAttribute('data-xslt-id', String(counter++));
      }
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      walk(node.childNodes[i]);
    }
  };
  walk(root);
  return counter;
}

/**
 * Verilen DOM kökünden başlayarak tüm elemanlarındaki `data-xslt-id`
 * niteliğini kaldırır. Kaydetme/serileştirme öncesi çağrılır.
 */
export function removeAllXsltIds(root: Node): void {
  const walk = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      (node as Element).removeAttribute('data-xslt-id');
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      walk(node.childNodes[i]);
    }
  };
  walk(root);
}

/**
 * Verilen DOM ağacında, belirli bir `data-xslt-id` değerine sahip
 * ilk elemanı bulur ve döndürür. Bulamazsa null döner.
 */
export function findElementByXsltId(root: Node, targetId: string): Element | null {
  const target = String(targetId);
  const walk = (node: Node): Element | null => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      if (element.getAttribute && element.getAttribute('data-xslt-id') === target) {
        return element;
      }
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      const found = walk(node.childNodes[i]);
      if (found) return found;
    }
    return null;
  };
  return walk(root);
}
