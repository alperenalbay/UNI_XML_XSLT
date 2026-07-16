# Güncelleme Notları / Changelog

Bu dosya, **UNI XML & XSLT Canlı Tasarım Editörü** projesinde gerçekleştirilen tüm geliştirme, güncelleme ve optimizasyon işlemlerini kayıt altında tutmak amacıyla oluşturulmuştur.

---

## [1.10.0] - 2026-07-14 - 🗂️ Default Tabbed Layout for Code Editors

### Düzenlendi / Changed
- **Varsayılan Editör Düzeni (Default Tabbed Layout):** XML ve XSLT kod editörlerinin başlangıçtaki ve dosya yükleme sonrasındaki yerleşim düzeni `'split'` (üst üste/alt alta) yerine varsayılan olarak `'tabbed'` (sekmeli) yapıldı:
  - Artık XML ve XSLT dosyaları editöre aktarıldığında ya da şablon seçildiğinde iki editör aynı anda alt alta açılmayacak.
  - Kod pencereleri sadece seçilen sekmede (`XML Editörü` veya `XSLT Tasarımı`) temiz bir şekilde tekil olarak görüntülenecektir.
  - Kullanıcılar istedikleri takdirde üst araç çubuğundaki (header) yerleşim butonu aracılığıyla tek tıkla sekmeli ve dikey bölünmüş (split) düzen arasında dinamik geçiş yapmaya devam edebilirler.

---

## [1.9.0] - 2026-07-14 - 🖼️ Invoice Preview Canvas Background Synchronization

### Düzeltildi / Improved
- **Fatura Önizleme Canvas Arka Plan Eşitlemesi (Canvas Background Fix):** Fatura önizleme alanında beyaz A4 kağıt şablonunun arkasında yer alan ve daha önce koyu mavi (`#0b0f19`) olarak sert kodlanmış olan iframe doküman gövdesi (`htmlEl`) dinamikleştirildi. Seçilen uygulamanın temasına göre arka plan rengini otomatik olarak güncelleyecek şekilde uyarlandı:
  - *Linear Dark* durumunda koyu grafit/indigo,
  - *Vercel Obsidian* durumunda zifiri siyah,
  - *Kyoto Forest* durumunda derin orman yeşili,
  - *Stripe Clean* durumunda yumuşak açık mavi/gri (`#f6f9fc`),
  - *Notion Milk* durumunda ise sıcak kağıt rengi (`#fcfbfa`) arka planlar atanır.
- **İlişkili `useEffect` Reaktivitesi:** Tema değişikliklerinin iframe içindeki A4 sayfa arkası rengine anlık olarak yansıması için `appTheme` durumu, iframe boyutlama ve biçimlendirme `useEffect` kancasının bağımlılık dizisine (dependency array) dahil edildi.

---

## [1.8.0] - 2026-07-14 - 🌟 High-Contrast Light Theme Optimizations & Readability Fixes

### Düzeltildi / Improved
- **Açık Tema Buton Düzeltmeleri (Unreadability Fixes):** Açık temalarda (`stripe`, `notion`) koyu kalarak yazısı okunmayan tüm butonlar (`bg-slate-800` aktif tab sekmeleri, tasarımcı panelindeki `bg-indigo-950` "İçine Ekle", `bg-emerald-950` "Metni Düzenle" ve `bg-rose-950/50` "Bu Elemanı Sil" butonları) soft pastel tonlu aydınlık arka planlara ve yüksek kontrastlı renk kodlarına kavuşturuldu.
- **Program Adı (Logo) Görünürlüğü:** Açık temada beyaz renkli kaldığı için okunmayan degradeli (gradient-text) başlıklar ve program unvanları (`text-transparent bg-clip-text`) tespit edilerek açık temalarda doğrudan `var(--text-primary)` (koyu lacivert/füme) rengine dönüştürüldü.
- **Canlı Önizleme Arka Planı (Iframe Canvas):** Sistem veya tarayıcı karanlık modundayken faturanın arka planının gri/koyu kalmasını engellemek için fatura iframe'ine ve A4 sayfasına zorunlu saf beyaz (`#ffffff`) arka plan atandı. Fatura her zaman tam beyaz kağıt kontrastıyla okunabilir hale getirildi.
- **Yazı Rengi & Hover Çakışması Kontrolü:** İpucu butonları, select dropdown menüleri, pasif sekme yazıları ve hover esnasında yazının beyaza bürünerek kaybolduğu tüm durumlar (`hover:text-white` vb.) engellendi; hover durumlarında metin rengi otomatik olarak `var(--text-primary)` olacak şekilde CSS düzeyinde uyarlandı.
- **Hata / Uyarı Barlarının Uyumlandırılması:** XML/XSLT derleme hata barları ve sistem log raporu pencereleri açık tema renk paletlerine tam adapte edilerek göz yorgunluğunu önleyecek şekilde pastel hata arka planları ve koyu kırmızı/turuncu yazı renkleriyle yeniden dengelendi.

---

## [1.7.0] - 2026-07-14 - 🎨 Brand-Inspired Zen Themes (3 Dark & 2 Light)

### Eklendi / Added
- **5 Adet Küresel Tasarım Teması:** Tasarım ve yazılım dünyasının en çok beğenilen lider markalarının tasarım dillerinden esinlenen, belirgin contrasts ve renk geçişlerine sahip 5 yeni Zen teması eklendi (3 Koyu Mod, 2 Aydınlık Mod):
  1. *Linear Dark (Derin Koyu):* Linear.app esintili koyu grafit/indigo arka plan, neon mor/indigo odak noktaları ve morumsu panel sınırları (Koyu Mod 1).
  2. *Vercel Obsidian (Saf Koyu):* Vercel.com esintili saf zifiri siyah arka plan, koyu gri paneller ve keskin beyaz aksanlar (Koyu Mod 2).
  3. *Kyoto Forest (Yosun Koyu):* Derin orman yeşili arka plan, yosun panelleri ve parlak yeşil odak detayları (Koyu Mod 3).
  4. *Stripe Clean (Canlı Açık):* Stripe.com esintili ultra temiz açık mavi/gri arka plan, saf beyaz kartlar ve canlı Stripe moru odak noktaları (Açık Mod 1).
  5. *Notion Milk (Sıcak Açık):* Notion.so esintili sıcak kağıt/krem tonları, sıcak gri paneller ve toprak rengi/turuncu odak noktaları (Açık Mod 2).

### Düzeltildi / Improved
- **Geniş Kapsamlı CSS Köprüsü (Full Theme Overrides):** Daha önce tam fark edilmeyen renk geçişleri, uygulamadaki tüm alt butonlar, seçiciler (select inputs), scrollbar'lar, SVG ikonlar ve panel derinlikleri de dahil edilerek 100% kapsayıcı hale getirildi. Artık aydınlık ve karanlık modlar arasındaki dönüşüm kusursuz ve çok belirgindir.
- **Monaco Editor Dil & Tema Uyumu:** Açık temalara (`stripe`, `notion`) geçildiğinde Monaco editörleri anında açık renkli `light` şemaya, koyu temalara geçildiğinde ise `vs-dark` şemaya dinamik olarak uyum sağlayacak şekilde güncellendi.

---

## [1.6.0] - 2026-07-14 - 🌌 Dynamic Multi-Theme Zen System

### Eklendi / Added
- **4 Ayrı Arayüz Teması:** Kullanıcının ruh haline ve ışık ortamına göre arayüzü tek tıkla değiştirebileceği, özenle seçilmiş 4 Zen teması entegre edildi:
  1. *Zen Obsidian (Koyu):* Derin koyu volkanik cam tonları ve yosun yeşili odakları (Varsayılan).
  2. *Kyoto Forest (Koyu Yeşil):* Derin orman/bambu gölgesi yeşili ve taze nane rengi.
  3. *Nordic Snow (Açık):* Sade, tertemiz İskandinav kar beyazı/gri tonları ve arktik mavi odakları.
  4. *Sand & Clay (Sıcak Açık):* Yumuşak kum/tatami sarısı, kil rengi sınırlar ve sıcak terakota/amber odakları.
- **Dinamik Monaco Editor Teması:** Monaco Editor örnekleri, seçilen uygulamanın temasına göre (`nordic` veya `sand` ise açık temaya, `obsidian` veya `forest` ise koyu temaya) anlık olarak dinamik geçiş yapacak şekilde uyarlandı.
- **Görsel Tema Değiştirici (Theme Switcher):** Üst çubuğa (Header) her iki ekran durumunda da yerleşen, temaları temsil eden 4 minimalist renk halkası eklendi.

### Teknik Geliştirmeler / Engineering
- **CSS Değişken Köprüsü (CSS Bridges):** Uygulamadaki tüm sert kodlanmış Tailwind koyu sınıfları (`bg-slate-950`, `bg-slate-900`, `border-slate-800`, vb.), `index.css` dosyasında yazılan özel kural köprüleri ile dinamik CSS değişkenlerine (`--bg-main`, `--bg-panel`, vb.) bağlandı. Bu sayede `App.tsx` içerisindeki tek bir satır kod değiştirilmeden tüm arayüz 100% temalandırılabilir hale getirildi.

---

## [1.5.0] - 2026-07-14 - 🎨 Panel Simplification & Color Style Fixes

### Eklendi / Added
- **Zustand Uyumlu State Updaters:** React'ın fonksiyonel güncelleme deseninin (`prev => ...`) Zustand store'u ile tamamen geriye dönük uyumlu çalışmasını sağlayan akıllı fonksiyon yapısı entegre edildi.
- **`cleanHexColor` Renk Temizleme Yardımcısı:** Stil değerlerinde yer alan `!important` vb. CSS modifikatörlerini temizleyerek renk seçicinin (color input) sadece saf hex kodları ile kilitlenmeden çalışmasını sağlayan temizleyici eklendi.

### Düzenlendi & Sadeleştirildi / Simplified
- **Tasarım Paneli Temizliği (Cards Removal):** Görsel Tasarım Kontrol Paneli'ndeki şablona özel veya kararsız çalışan bölümler kaldırıldı:
  - *Kurumsal Tema Rengi* (şablon bağımlı olduğu için kaldırıldı).
  - *Eleman Konum Sıralaması (Satıcı/Alıcı Swap)* (kaldırıldı).
  - *Boş Alanlara Yeni Metin Ekleme* (kaldırıldı).
  - *Kaşe / Filigran Katmanı* (kaldırıldı).
  - *Fatura Dil Seçimi* (kaldırıldı).
- **Mükerrer Buton Temizliği:** Arayüzün sağ önizleme panelindeki mükerrer "Görsel Tasarımcı" butonu kaldırıldı. Görsel tasarım modu sadece sol taraftaki ana sekme üzerinden açılabilir hale getirildi.
- **Metin Çeviri Butonları Kaldırıldı:** Sağ taraftaki TR / EN fatura çeviri butonları arayüzden temizlendi.

### Düzeltildi / Fixed
- **Inline CSS Önceliği (Renk Seçimi):** Görsel tasarım panelinden değiştirilen tüm CSS değerlerinin (margin, padding, color, font-size vb.) fatura şablonundaki genel CSS kuralları tarafından ezilmesini önlemek amacıyla, üretilen inline stillere otomatik olarak `!important` önceliği atandı. Artık renk ve boyut değişimleri anında faturaya yansıyor.

---

## [1.4.0] - 2026-07-14 - 🛠️ Bug Fixes & Script/Inspector Robustness

### Eklendi / Added

#### **🛡️ Önizleme Script Hataları Loglama**
- Iframe içindeki erken aşama derleme, sözdizimi (`SyntaxError`) ve çalışma zamanı çökmelerini postMessage ile anında yakalayan dinleyici mekanizması eklendi.
- Yakalanan hatalar önizleme panelinin sağ üstünde yer alan **Sistem Raporu** (Logs) sekmesinde detaylarıyla görüntülenebiliyor.

### Düzeltildi / Fixed

#### **🔍 Koda Git (Inspector Line Locator) Optimizasyonu**
- `findLineInCode` arama mantığı tam metin karşılaştırmasından (`includes`) HTML/XML öznitelik (`class`/`id`) ayrıştırıcısına dönüştürüldü.
- Elemanlarda birden fazla sınıf (multiple classes) veya boşluk/tırnak varyasyonu bulunsa bile kod editörünün tam doğru satıra odaklanması sağlandı.

#### **🧩 HTML5 Kendi Kendini Kapatan Etiket Genişleticisi**
- XML standartlarında geçerli olan ancak HTML5 tarayıcı ortamında DOM ağacının bozulmasına yol açan kendi kendini kapatan etiketler (`<div ... />`, `<span ... />` vb.) otomatik olarak açık ve kapalı eşleşen etiketlere (`<div></div>`) dönüştürüldü.
- QRCode kütüphanesinin kendi data div'ini (`#qrvalue`) ve script bloğunu yanlışlıkla silerek çökmesi engellendi.

#### **🚀 Gömülü Script CDATA & Kaçış Karakteri Çözücü**
- XMLSerializer tarafından script blokları içinde kaçırılan (escaped) `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&apos;` entiteleri ve CDATA blokları ham kod hallerine çözümlendi (decoded).
- QRCode ve Barcode kütüphanelerinin `ReferenceError: QRCode is not defined` gibi derleme/çalışma zamanı hataları vermeden sıfır hata ile yüklenmesi sağlandı.

#### **✏️ Tasarımcı Editör Düzeltmeleri**
- "İçine Ekle" (Add Inside) ve "Metni Düzenle" (Edit Text) buton işlevleri için `xsltId` tabanlı seçim mekanizması entegre edildi.
- Inline veya butonlu metin düzenleme modlarında **Enter** tuşuna basıldığında (Shift olmaksızın) işlemin kaydedilip düzenleme odağının kapanması sağlandı.
- Eleman silme ("Bu Elemanı Sil") fonksiyonunun sınıf ismi çakışması durumunda alakasız alanları silmesi engellendi.

### Test Kapsamı / Test Coverage
- `xsltTransformer.test.ts` içerisine `addElementToXslt` ve `removeElementFromXslt` fonksiyonları için yeni test durumları (5 test) eklendi. Test sayısı **23'ten 28'e** yükseltildi.

---

## [1.3.0] - 2026-07-14 - ⚙️ Refactoring & State Management

### Eklendi / Added

#### **🏗️ Zustand State Management Integration**
- Merkezi state yönetim için `src/store/editorStore.ts` oluşturuldu (265+ LOC)
  - 40+ state değişkeni konsolide edildi
  - Type-safe interface'ler (`EditorState`, `EditorActions`) tanımlandı
  - Batch işlemleri desteği eklendi (`resetToDefaults`)
  - **Faydası:** useState chaos → single source of truth

#### **🎣 Custom Hooks Modularization**
- **`useXsltTransform.ts`** - XSLT dönüşüm mantığı ayrıştırıldı
  - Otomatik XML/XSLT dönüştürme
  - Validation state yönetimi
  - useEffect debouncing

- **`useTemplates.ts`** - Şablon yönetim API
  - Template loading/saving
  - Custom templates operations
  - API integration

- **`useUpdates.ts`** - GitHub sürüm kontrolü
  - Check updates functionality
  - Trigger update mechanism
  - Status reporting

- **`useInspector.ts`** - Element seçim ve CSS okuma
  - CSS selector builder
  - Element click handling
  - Inspector mode toggling

#### **📦 React Component Decomposition**
6 yeni bileşen oluşturuldu, App.tsx tekrar kullanılabilirlik sağlandı:

| Bileşen | Sorumluluğu | LOC |
|---------|-------------|-----|
| `EditorToolbar` | Editör araç çubuğu (refresh, layout, validation) | 105 |
| `EditorPanel` | XML/XSLT editörleri (split/tabbed view) | 180 |
| `PreviewPanel` | A4 ön izleme, zoom controls, tabs | 160 |
| `DesignerPanel` | WYSIWYG stil editörü, watermark, theme | 265 |
| `StatusPanel` | Durum, istatistikler, template list, updates | 220 |
| `ToastContainer` | Bildirim sistemi (error, success, warning, info) | 120 |

- **Faydası:** 3254 satır App.tsx → modüler mimariye başlangıç

#### **🧪 Unit Testing Framework**
- Vitest + happy-dom entegre edildi
  - `npm test` script'i eklendi
  - `npm test:ui` görsel test arayüzü
  - `vitest.config.ts` konfigürasyonu

#### **📋 Test Coverage**
```
✓ src/store/editorStore.test.ts (10 tests)
  - State initialization
  - Setters & getters
  - Batch operations
  - Validation state management

✓ src/utils/xsltTransformer.test.ts (12 tests)
  - Empty/invalid XML/XSLT handling
  - Embedded XSLT extraction
  - XSLT removal operations
  - Error edge cases

✓ src/components/ToastContainer.test.ts (1 test)
  - Toast hook structure
```

**Test Results:** ✅ **23 passed** (0 failed)

### Değiştirildi / Changed

- **Package.json** scripts güncellendi:
  ```json
  "test": "vitest",
  "test:ui": "vitest --ui"
  ```

- **Dependencies eklendi:**
  - `zustand@5.0.14` - State management
  - `vitest@4.1.10` - Unit testing
  - `@vitest/ui@4.1.10` - Test runner UI
  - `happy-dom@20.10.6` - DOM simulation for tests

### Yapı Iyileştirmeleri / Architecture Improvements

#### **Before (3254 LOC App.tsx):**
```
src/
├── App.tsx (3254 LOC) ❌
├── utils/
│   └── xsltTransformer.ts
└── samples/
    └── invoiceSample.ts
```

#### **After (Modular):**
```
src/
├── store/
│   ├── editorStore.ts (265 LOC) ✨
│   └── editorStore.test.ts
├── hooks/
│   ├── useXsltTransform.ts ✨
│   ├── useTemplates.ts ✨
│   ├── useUpdates.ts ✨
│   ├── useInspector.ts ✨
│   └── index.ts
├── components/
│   ├── EditorToolbar.tsx (105 LOC) ✨
│   ├── EditorPanel.tsx (180 LOC) ✨
│   ├── PreviewPanel.tsx (160 LOC) ✨
│   ├── DesignerPanel.tsx (265 LOC) ✨
│   ├── StatusPanel.tsx (220 LOC) ✨
│   ├── ToastContainer.tsx (120 LOC) ✨
│   ├── ToastContainer.test.ts
│   └── index.ts
├── App.tsx (3254 LOC) - Hazır refactor için
├── utils/
│   ├── xsltTransformer.ts
│   └── xsltTransformer.test.ts ✨
└── samples/
    └── invoiceSample.ts
```

**Toplam Yeni Kod:** ~2500 LOC ✨

### Build & Test Results

```
✅ Build Status: SUCCESS (801ms)
✅ Test Files: 3 passed
✅ Tests: 23 passed (0 failed)
✅ Dev Server: Running on port 5174
✅ No TypeScript errors
```

### Breaking Changes

❌ Hiçbir breaking change yok. Eski App.tsx tamamen fonksiyonel kalıyor.
- Backup: `src/App.tsx.backup` korunmuştur
- Kademeli refactor mümkündür

### Deprecations

⚠️ Yapılacak (next releases):
1. App.tsx'teki component logic → oluşturulan bileşenlere taşınacak
2. Vite middleware → Express backend'e taşınacak
3. ~~Toast notifications → Eski alert()ler değiştirilecek~~ ✅ YAPILDI

---

## [1.3.1] - 2026-07-14 - 🔔 Error Handling & Toast Notifications

### Eklendi / Added

#### **🔔 Global Toast Notification System**
- **`src/store/toastStore.ts`** - Zustand tabanlı global toast state management (59 LOC)
  - Merkezi toast yönetimi (tüm komponentlerden erişim)
  - Auto-dismiss desteği (tip bazında duration)
  - Multiple concurrent toasts
  - Toast kuyruğu ve öncelik sistemi

- **Toast Türleri:**
  - ✅ **success** (3s) - İşlem başarılı
  - ❌ **error** (5s) - Hata mesajları
  - ℹ️ **info** (4s) - Bilgi bildirimleri  
  - ⚠️ **warning** (4s) - Uyarı mesajları

#### **📢 App.tsx Error Handling Integration**
API ve transform işlemlerine toast bildirim eklendi:

| İşlem | Toast Tipi | Mesaj |
|--------|-----------|-------|
| XML/XSLT Dönüştürme | success/error | "Dönüştürme Başarılı" / "XSLT Dönüştürme Hatası" |
| Şablon Yükleme | success/warning | "Şablonlar Yüklendi" / "Şablon Yükleme Başarısız" |
| Güncelleme Kontrolü | info/warning | "Güncelleme Mevcut" / "Güncelleme Kontrolü Başarısız" |
| Güncelleme Tetikleme | success/error | "Güncelleme Tamamlandı" / "Güncelleme Başarısız" |

#### **💄 Enhanced Toast UI**
- Backdrop blur efekti
- Smooth slide-in animation (`animate-slide-in`)
- İkon ve açıklama metni desteği
- Kapatma butonu (manuel dismiss)
- Responsive tasarım (max-w-sm)
- Dark theme uyumlu renkler

### Değiştirildi / Changed

**App.tsx Error Handling (Lines 122-397):**
- `loadCustomTemplates()` → toast notifications ile geliştirildi
- `checkUpdates()` → info/warning toasts eklendi
- `triggerUpdate()` → success/error toasts eklendi
- `runTransformation()` → success/error toasts eklendi
- Eski `alert()` modal'larından toast'lara geçildi

**ToastContainer.tsx Refactoring:**
- Props-based model → Zustand store-based model
- Local state hook → Global state management
- Auto-render (no parent props needed)
- Type-safe Toast interface

**UI Improvements:**
- `pointer-events-none` parent wrapper (non-interactive overlay)
- `pointer-events-auto` toast items (interactive)
- Consistent color scheme with app theme
- Better visual hierarchy with icons

### Test Updates

✅ **23 tests passed** (unchanged):
- Toast store tests (new)
- Transform tests (fixed)
- Editor store tests (passing)

**Fixed TypeScript errors:**
- Type-only imports for Toast interface (`import type`)
- Removed unused imports (`vi` from vitest)
- Fixed global type references (`globalThis.XSLTProcessor`)

### Build & Performance

```
✅ Build Status: SUCCESS (1.01s)
✅ Bundle Size: 593.28 kB (gzip: 153.73 kB)
✅ Tests: 23 passed
✅ Dev Server: Running on port 5175
✅ No TypeScript errors
```

### Benefits

1. **User Feedback:** Kullanıcılar artık tüm işlemlerin sonuçlarını anında görebiliyor
2. **Error Transparency:** Hatalar açık ve anlaşılır şekilde bildirilir
3. **Non-blocking:** Toast'lar interaktif değildir, workflow akışını bozmaz
4. **Scalable:** Yeni işlemler kolayca toast'lara entegre edilebilir
5. **Maintainable:** Merkezi state management, dağınık alert()ler yerine

### Architecture

```typescript
// App.tsx'de kullanım:
const { addToast } = useToast()

// İşlem başarılı
addToast({
  type: 'success',
  message: 'Dönüştürme Başarılı',
  description: 'XML/XSLT başarıyla işlendi'
})

// Hata durumu
addToast({
  type: 'error',
  message: 'XSLT Dönüştürme Hatası',
  description: result.error.substring(0, 150)
})
```

---

## [1.3.0] - 2026-07-14 - ⚙️ Refactoring & State Management
### Eklendi / Added
- **📁 Dinamik Yerel Şablon Kütüphanesi ve Kaydetme Desteği:** Tasarımcının o anki düzenlenmiş halini isimlendirerek kalıcı olarak yerel diske kaydedebilmesini sağlayan **Şablon Kütüphanesi** özelliği eklendi.
  - Arka planda çalışan Vite dev server sunucusuna entegre edilen özel bir Node.js dosya yönetim ara yazılımı (Vite middleware) sayesinde, şablonlar doğrudan proje dizininde yer alan `public/templates/` klasörüne `.xslt` formatında kaydedilir.
  - "Sistem Durum Raporu" sekmesinde yer alan şablon kütüphanesine, mevcut tasarımı isim vererek diske kaydeden giriş alanı ve buton yerleştirildi.
  - Diske kaydedilen tüm şablonlar, aynı sekmede şık bir kart listesi halinde görüntülenir ve tek tıkla editöre geri yüklenebilir.
  - Dosya sistemindeki `public/templates` klasörüne dışarıdan atılan veya silinen XSLT dosyaları program tarafından otomatik olarak algılanır, listenin yanındaki yenileme butonuyla veya sekmeler arası geçiş yapıldığında anında taranarak listeye yansıtılır.
- **🔄 Entegre Sürüm Denetleyici ve Tek Tıkla Güncelleme (Auto-Updater):** Uygulamayı bilgisayarına indirmiş/kullanmakta olan kullanıcıların herhangi bir terminal komutu yazmasına veya manuel dosya kopyalamasına gerek kalmadan güncel kalabilmesi için **otomatik sürüm kontrolü ve güncelleme mekanizması** geliştirildi:
  - **Çevrimdışı/Terminal Kontrolü (`start.bat` & `start.sh`):** Uygulama başlatılırken arka planda git deposundan fetch çekilerek yeni bir sürüm olup olmadığı sorgulanır. Yeni bir güncelleme varsa terminalde *"Yeni bir sürüm tespit edildi! Otomatik yüklemek ister misiniz? (E/H)"* uyarısı gösterilir; onaylandığında otomatik olarak `git pull && npm install` çekilerek güncel kodlar kurulur.
  - **Canlı Web Arayüzü Kontrolü (`App.tsx` & `vite.config.ts`):** Vite sunucusuna entegre edilen `/api/check-update` ve `/api/trigger-update` Node.js API uç noktaları sayesinde, web uygulaması açıldığında veya Durum Raporu sekmesi ziyaret edildiğinde sürüm kontrolü yapılır. Yeni sürüm mevcutsa üst barda parlayan **"Yeni Sürümü Yükle"** butonu belirir. Tıklandığında sistem arka planda kodları günceller, bağımlılıkları yükler ve sayfayı otomatik olarak yenileyerek en güncel sürüme geçişi tamamlar.

### Değiştirildi / Changed
- **📋 Varsayılan Tasarım Şablonu Güncellendi (DEFAULT_XSLT):** Masaüstünde bulunan gelişmiş `gomulu-tasarim.xslt` dosyası, uygulamanın açılışta yüklediği ana varsayılan tasarım şablonu (DEFAULT_XSLT) olarak ayarlandı.
- **🌐 Gelişmiş UBL-TR Çeviri Kapsamı & Sıralama Filtresi:** Çeviri sözlüğü "Vergiler Dahil Reçete Toplam Tutarı", "Ödeme Tarihi", "Ödeme Notu", "KDV Hariç Ödenecek Tutar" gibi tüm detayları kapsayacak şekilde genişletildi. Kelime uzunluğuna göre azalan sıralama (`descending`) sayesinde çakışmalar giderildi. "Mal Hizmet", "Mal Hizmet Tutarı", "Hesaplanan" ve "KDV" (XML veri düğümünden gelenler dahil) alanlarının Türkçe kalması sorunu, hem XSLT hem de XML veri katmanlarında dinamik sözlük eşleşmesi sağlanarak tamamen çözüldü.
- **🎚️ İçiçe Ölçeklenen (İçeriksel) Zoom Kontrolü:** Zoom kaydırıcısı ve oranları uygulandığında dış önizleme çerçevesinin veya iframe penceresinin büyüyüp küçülmesi/değişmesi engellendi. Yakınlaştırma işlemi artık iframe içindeki fatura dokümanının gövdesine (`body`) uygulanarak faturanın kendi boyutları çerçeve içinde büyüyüp küçülecektir. Çerçeve boyutu sabit kalırken kaydırma çubukları doğrudan iframe içinde çıkacaktır.
- **↔️ Sürüklenebilir Esnek Panel Sınırları (Split-Pane Resize):** Sol editör paneli ile sağ önizleme paneli arasına sürüklenebilir bir ayraç çizgisi (`Resizer Divider`) yerleştirildi. Kullanıcılar artık sınır çizgilerinden tutarak panelleri istedikleri gibi daraltıp genişletebilirler.
- **📄 Varsayılan A4 Baskı Görünümü:** A4 düzen modu varsayılan ve kalıcı hale getirilerek "A4 Sayfa / Fit" değiştirme butonu arayüz kalabalığını önlemek amacıyla kaldırıldı.

### Düzeltildi / Fixed
- **🎨 Görsel Tasarımcı ve Metin Düzenleyici Aktivasyonu:** Görsel tasarımcı modunun sadece önceden tanımlanmış sınıflarda (`STYLEABLE_CLASSES` beyaz listesi) çalışması kısıtlaması kaldırıldı. Tasarımcı artık faturadaki **tüm etiketler ve sınıflar** üzerinde çalışır hale getirilerek her türlü özelleştirilmiş XSLT şablonuyla %100 uyumlu hale getirildi. Çift tıklama ile metin düzenleme (inline-edit) özelliği tüm statik metinler için aktif edildi.
- **🖥️ Seçim Sonrası Önizleme Kararma/Kayıp Hatası Giderildi:** Görsel tasarımcıda fatura üzerinde herhangi bir alana tıklandığında sol taraftaki panelin güncellenmesiyle React'in iframe DOM içeriğini sıfırlayıp sayfanın kararmasına veya kaybolmasına yol açan senkronizasyon hatası, iframe yükleme yöntemi tamamen deklaratif `srcDoc` ve `onLoad` yapısına geçirilerek kökten çözüldü.
- **🖨️ Yazıcı Baskı Görünümü Optimizasyonu (Çift A4 Çerçeve & Gölge Temizliği):** Yazdırma işlemi tetiklendiğinde ortaya çıkan gölge silüeti, sayfa sınırlarında oluşan çift A4 çizgi görünümü ("A4 içinde A4") ve zoom oranı bozulmaları giderildi. iframe çıktısına eklenen dinamik `@media print` CSS kuralları sayesinde, yazdırma aşamasında tarayıcı önizleme gölgesi (`box-shadow`), dış boşluklar (`margin`), arka plan renkleri ve mor seçim çizgileri tamamen temizlenerek faturanın doğrudan beyaz A4 kağıda tam ölçekli ve sıfır hata ile basılması sağlandı.
- **🎨 Hassas WYSIWYG Eleman Stil Güncellemesi (Inline Style Desteği):** Görsel tasarımcıda seçilen elemanların yazı boyutu, rengi, boşlukları (margin/padding) ve hizalaması gibi stil değişikliklerinin çalışmama veya tüm şablona hatalı yansıma sorunu giderildi. 
  - Stil güncelleme motoru, değişiklikleri yalnızca `<style>` bloğundaki ortak sınıflara yazmak yerine, **Sıralı ID Eşleme (xsltId)** yardımıyla doğrudan hedef elemanın kendi **inline `style="..."` özniteliğine** yazar hale getirildi. Bu sayede CSS öncelik sırasına göre stiller kesin olarak ve yalnızca seçilen elemana uygulanır.
  - Önizleme ekranındaki tıklama dinleyicisine **computed (hesaplanmış) CSS** değerlerini okuma yeteneği eklendi. Seçilen elemanın rengi (RGB formatından HEX formatına otomatik dönüştürülerek), yazı boyutu, boşlukları ve hizalaması paneldeki slider/renk seçici alanlara anında doldurulur. Böylece kullanıcı elemanın mevcut stil değerlerini net bir şekilde görüp düzenleyebilir.
- **📝 Hedefli Metin Düzenleme ve "Metni Düzenle" Butonu:** Görsel tasarımcıda seçilen herhangi bir elemanın metin içeriğini anında değiştirebilmek için sol panele **"Metni Düzenle" (Edit Text)** butonu eklendi. Butona tıklandığında önizlemedeki ilgili eleman programatik olarak `contentEditable` yapılarak kullanıcının doğrudan fatura üzerinde yazması sağlanır. Metin güncellenip odağı kaybettiğinde (blur), değişiklikler **Sıralı ID Eşleme (xsltId)** mantığı ile XSLT kodunda tam olarak o elemanın `textContent` verisiyle değiştirilir. Ayrıca, varsayılan XSLT şablonundaki (Notlar, Tevkifat Sebepleri, Ödeme Notları ve Taşıyıcı Bilgileri gibi) tüm ham metin düğümleri ve dinamik `<xsl:value-of>` etiketleri ayrı `<span>` etiketleri içine alınarak **satır bazında noktasal seçim, ekleme ve düzenleme** yapılması sağlandı. Böylece notlar bölümündeki alanların düzenlenememesi sorunu tamamen çözüldü.
- **🖼️ Noktasal Resim & Eleman Silme Optimizasyonu (Sıralı ID Eşleme Katmanı):** Dinamik UBL XML verisinden beslenen (`<xsl:attribute>` veya curly braces `{}` ile dinamik `src` alan) görsellerin ve yapısal elemanların Base64 veya sınıflarına bakılmaksızın %100 doğrulukla silinebilmesi için **WYSIWYG Sıralı ID Eşleme (data-xslt-id) mimarisi** geliştirildi. XSLT şablonu HTML'e dönüştürülürken arka planda her statik elemana sıralı bir kimlik enjekte edilir, kullanıcı tıkladığında bu kimlik yakalanır ve silme aşamasında XSLT DOM ağacından o kimliğe sahip eleman tam olarak çıkarılır. Kaydetme/Serileştirme öncesinde bu geçici kimlikler XSLT dosyasından tamamen temizlenerek dosyanın orijinal bütünlüğü ve temizliği korunur. Bu sayede görsel silerken başka görsellerin silinmesi sorunu tamamen tarihe karışmıştır.
- **🎯 Belirgin Pulsing (Nabız) Seçim Halesi:** Kullanıcının tıkladığı elemanın seçili olduğunu net bir şekilde görebilmesi için mor çerçeveye (`3px solid #a855f7`) ek olarak yumuşak dalgalanan bir gölge efekti (`box-shadow`) ve sürekli dönen bir nabız animasyonu (`@keyframes selectPulse`) entegre edildi. Ayrıca, tıklanan elemanın üstündeki tüm sınıfları aramak yerine **doğrudan tıklanan en alt yaprak elemanı (leaf node) hedefleyen hassas seçim** modeline geçildi. Bu sayede notlar veya tablolardaki gibi metin alanları seçildiğinde tüm sayfanın yanlışlıkla seçilip parlaması (bütün sayfanın hale içine girmesi) engellendi.
- **🎛️ Yakınlaştırma & Stil Ayar Barı Görünürlüğü (Range Sliders):** Koyu tema arayüzünde kaybolan varsayılan HTML5 kaydırma çubukları (`input[type="range"]`) yerine, yüksek kontrastlı ve özel tasarımlı kaydırma izleri (`track`) ile beyaz çerçeveli ve gölgeli kaydırma butonları (`thumb`) eklenerek Görsel Tasarımcı ve zoom barları tamamen görünür ve estetik hale getirildi.
- **🎨 Tema Renkleri Kontrast ve Yazı Okunurluğu Düzeltmesi:** Sol paneldeki metinlerin, başlıkların ve açıklamaların birbirine karışmasını önlemek için Tailwind CSS sınıf isimlerindeki yazım hataları (`slate-955`, `slate-505`, `slate-455` vb. geçersiz Tailwind sınıfları) temizlenerek standart Tailwind renk skalasına (`slate-900`, `slate-500`, `slate-400` vb.) geçildi. Böylece farklı renk tonları arasındaki kontrast dengesi düzeltilerek tüm yazılar okunabilir hale getirildi.
- **🐛 A4 Önizleme Yerleşim ve Taşma Hatası:** Zoom ölçekleme işleminde layout boyutlarının değişmesi ve yatay kaydırma çubuklarının (scrollbars) çıkması sorunu, ölçeklemeyi doğrudan iframe iç bellek katmanına indirgeyerek tamamen giderildi.
- **🔍 ResizeObserver ile Otomatik Genişlik Eşitleme (Auto-Fit Width):** Ekran boyutu veya bölme genişliği ne olursa olsun, A4 önizleme sayfasının yatayda taşmasını engellemek için `ResizeObserver` entegre edildi. Sürükleme veya pencere boyutlandırma sırasında sayfa ölçeği dinamik olarak hesaplanarak kaydırma çubuğu ihtiyacı tamamen ortadan kaldırıldı.

---

## [1.1.0] - 2026-07-08
### Eklendi / Added
- **🌐 Fatura Dil Seçici (TR / EN):** 
  - Fatura şablonlarındaki tüm statik Türkçe başlıkları ("Fatura No", "Satıcı Bilgileri", "Mal/Hizmet Açıklaması", "Ödenecek Tutar", "Ara Toplam", "ÖDENDİ" vb.) tek tıkla İngilizce'ye ve tekrar Türkçe'ye dönüştüren dinamik çeviri motoru eklendi.
  - **Önizleme Kontrol Paneli**'ne hızlı geçiş için `TR / EN` butonu yerleştirildi.
  - **Görsel Tasarımcı Kontrol Paneli**'ne görsel dil seçimi kartı (`🇹🇷 Türkçe` / `🇬🇧 English`) entegre edildi.
- **📝 Güncelleme Notları (CHANGELOG.md):** Yapılan tüm değişikliklerin tarihsel olarak kayıt altında tutulacağı not dosyası oluşturuldu.
- **🛠️ start.bat & start.sh İyileştirmeleri:**
  - `start.bat` dosyasında çift tıklandığında çalışmama veya yanlış klasörde açılma sorununu çözmek için `cd /d "%~dp0"` eklendi, hatalı davranabilen `netstat` port kontrolü kaldırıldı, `&` karakterlerinin komut ayracı olarak algılanmasını önlemek için `^&` kaçış karakteri uygulandı ve `if` blokları içindeki parantez hataları giderilerek başlatma süreci tamamen kararlı hale getirildi.
  - `start.sh` dosyasında da macOS ve Linux kullanıcılarının başka projeleri açıkken veya port çakışmalarında sunucunun açılmasını engelleyen hatalı `lsof`/`nc` port kontrol mantığı kaldırıldı; yerine daha kararlı olan doğrudan çalıştırma ve tarayıcı yönlendirme mantığı getirildi.

### Düzeltildi / Fixed
- **🐛 Güvenli Dil Çevirisi Algoritması:** Gömülü XSLT kodlarındaki URI ve nitelik isimlerinin (örneğin `xmlns:clmIANAMIMEMediaType:2003` içindeki `Type:`) yanlışlıkla Türkçe kelimelerle yer değiştirmesini ve XSLT parse hatası vermesini engellemek için, çeviri algoritması sadece tag dışındaki metin düğümlerini (text nodes) hedef alacak şekilde split-token mimarisine geçirildi. Ayrıca harf sınırları (`(?<![a-zA-Z0-9çıüğşöİIĞÜŞÇÖ])`) regex kuralları ile korunarak tam kelime eşleşmesi sağlandı ve CSS stil kodlarının (`<style>`) çeviriden muaf tutulması sağlandı.

---

## [1.0.0] - 2026-07-07
### Eklendi / Added (Dün Yapılanlar)
- **⚡ Canlı Dönüşüm & Önizleme:** XML verisi ile XSLT tasarım şablonunu tarayıcı içinde (client-side) anında birleştirip çıktı üreten altyapı kuruldu.
- **🎨 Görsel Tasarımcı (WYSIWYG Styler):**
  - Tema rengi değiştirme özelliği.
  - Kaşe / Filigran katmanı yönetimi (Döndürme, renk, görünürlük ve metin düzenleme).
  - Satıcı ve Alıcı kolonlarının yerlerini tek tıkla yer değiştiren (swap) algoritma.
- **🔍 Inspector (Koda Git):** Önizleme ekranındaki bir elemana tıklandığında, XSLT kodunda ilgili satırı tespit edip editörü o satıra kaydıran ve vurgulayan mekanizma.
- **✏️ WYSIWYG Çift Tıklama ile Metin Düzenleme:** Önizleme üzerindeki statik metinlerin çift tıklanarak düzenlenmesi ve XSLT koduna senkronize edilmesi.
- **➕ Yeni Alan Ekleme:** Faturadaki Alıcı, Satıcı ve Detay sütunlarına dinamik metin kutuları ekleme özelliği.
- **📦 Gömülü XSLT Ayıklama:** XML içindeki base64 formatındaki tasarımları ayıklama ve editöre tek tıkla yükleme/temizleme özelliği.
