/**
 * Önizleme iframe'inin sandbox ve script politikası.
 *
 * Neden ayrı dosya? İki gerçek hatanın kaynağı buradaydı:
 *
 * 1. Sandbox değeri, `designerActive` / `inspectorActive` / `imag-editor`
 *    değiştiğinde değişiyordu. `srcDoc` da aynı React commit'inde değiştiği
 *    için tarayıcı srcdoc gezinmesini ESKİ sandbox bayraklarıyla başlatıyor
 *    ve yeni belge `allow-scripts` olmadan yükleniyordu. `srcDoc` bir daha
 *    değişmediği için iframe bir daha yüklenmiyor, script'ler sessizce
 *    bloklanmış kalıyordu. Sandbox SABİT olunca bu yarış tamamen ortadan kalkar.
 *
 * 2. Sandbox `allow-same-origin` içerdiği için zaten script izolasyonu sağlamıyor;
 *    asıl koruma `allow-top-navigation` / `allow-popups` / `allow-forms`
 *    vermemektir (bunlar hâlâ verilmiyor).
 *
 * Uygulamanın kendi etkileşim script'leri (sütun boyutlandırma, görsel
 * sürükle-bırak, çift tıklama ile metin düzenleme) tasarım özelliklerinin
 * temeli olduğu için HER ZAMAN çalışır. Kullanıcı kontrolü, şablonun kendi
 * script'leri üzerinde uygulanır: Trusted mod kapalıyken bu bloklar
 * önizlemeden çıkarılır.
 */

/**
 * Önizleme iframe'inin sandbox değeri.
 *
 * `allow-same-origin` : üst uygulamanın iframe DOM'una erişmesi için şart
 *                       (zoom, element seçimi, sürükle-bırak).
 * `allow-scripts`     : tasarım etkileşimi ve şablon script'leri için.
 * `allow-modals`      : şablonların alert/confirm kullanabilmesi için.
 *
 * Kasıtlı olarak VERİLMEYENLER: allow-top-navigation, allow-popups,
 * allow-forms, allow-downloads, allow-pointer-lock.
 *
 * DİKKAT: Bu değer hiçbir koşulda değişmemeli. Değişmesi, aynı commit'te
 * değişen `srcDoc` ile yarışa girip önizleme script'lerini sessizce bloklar.
 */
export const PREVIEW_SANDBOX = 'allow-same-origin allow-scripts allow-modals';

/** Trusted mod açıkken şablonun kendi script'leri önizlemede çalışır. */
export const PREVIEW_TRUSTED_DEFAULT = true;

/**
 * Önizlemeden gelen `postMessage` gerçek mi?
 *
 * Bu kanal XSLT kodunu doğrudan değiştirdiği için (metin düzenleme, sütun
 * boyutlandırma, görsel sürükle-bırak) kaynağı doğrulanmalı.
 *
 * NEDEN `event.source === iframe.contentWindow` DEĞİL:
 * Önizleme, `srcDoc` + `sandbox` kullanan bir iframe. Chromium'da bu
 * kombinasyonda sandbox'lanmış çocuğun gönderdiği `event.source`, üst
 * uygulamanın gördüğü `iframe.contentWindow` ile referans-eşitliği kurmıyor
 * (ölçüldü: `false`). Bu kontrol eklendiğinde tasarımcının TÜM seçim akışı
 * sessizce ölüyordu — bu yüzden kaynak kimliği için kullanılmıyor.
 *
 * `origin` ise spec'in bu iş için verdiği alan ve ölçüldüğü gibi güvenilir:
 * `allow-same-origin` verildiği için önizleme uygulamayla aynı origin'de.
 */
export function isTrustedPreviewMessage(eventOrigin: string, appOrigin: string): boolean {
  // `file://` altında origin "null" olur; her iki taraf da "null" ise eşittir.
  return eventOrigin === appOrigin;
}

/**
 * HTML'den tüm `<script>` bloklarını çıkarır.
 *
 * Yalnızca Trusted mod KAPALIYKEN çağrılır. Sandbox'ta `allow-scripts`
 * açık kaldığı için script'leri "engellemek" yerine kaynaktan kaldırıyoruz;
 * böylece kullanıcı "neden barkod çıkmıyor?" yerine "neden script yok?"
 * sorusunu net biçimde görebiliyor.
 *
 * `src`/`type` özniteliklerine bakmaz: script'in ne yaptığı değil, çalışıp
 * çalışmadığı önemli. Kullanıcı kendi şablonundaki script'i de kapatmak
 * istediğinde bu davranış beklenen sonuçtur.
 */
export function stripTemplateScripts(html: string): string {
  if (!html) return html;
  return html.replace(/<script\b[\s\S]*?<\/script\s*>/gi, '');
}

/** Script sayısını döndürür — kullanıcıya "kaç script devre dışı" demek için. */
export function countTemplateScripts(html: string): number {
  if (!html) return 0;
  const matches = html.match(/<script\b/gi);
  return matches ? matches.length : 0;
}

/**
 * Trusted mod kapalıyken önizleme belgesinin içine gösterilen bilgilendirme
 * bandı. Kullanıcı, şablonundaki script'lerin neden görünmediğini bilmeli.
 */
export function buildScriptDisabledNotice(scriptCount: number): string {
  const plural = scriptCount > 1 ? 'script bloğu' : 'script bloğu';
  return `<div id="uni-script-disabled-notice" style="position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#7c2d12;color:#ffedd5;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:12px;line-height:1.5;padding:8px 12px;border-bottom:2px solid #f97316;text-align:center">
    <strong>Script'ler devre dışı.</strong> Bu şablonda ${scriptCount} ${plural} bulundu (barkod, QR vb.). Önizlemede çalışmaları için üstteki <strong>&quot;Script'ler&quot;</strong> anahtarını açın.
  </div>`;
}
