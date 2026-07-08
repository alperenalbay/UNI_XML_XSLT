# Güncelleme Notları / Changelog

Bu dosya, **UNI XML & XSLT Canlı Tasarım Editörü** projesinde gerçekleştirilen tüm geliştirme, güncelleme ve optimizasyon işlemlerini kayıt altında tutmak amacıyla oluşturulmuştur.

---

## [1.2.0] - 2026-07-08
### Eklendi / Added
- **📁 Dinamik Yerel Şablon Kütüphanesi ve Kaydetme Desteği:** Tasarımcının o anki düzenlenmiş halini isimlendirerek kalıcı olarak yerel diske kaydedebilmesini sağlayan **Şablon Kütüphanesi** özelliği eklendi.
  - Arka planda çalışan Vite dev server sunucusuna entegre edilen özel bir Node.js dosya yönetim ara yazılımı (Vite middleware) sayesinde, şablonlar doğrudan proje dizininde yer alan `public/templates/` klasörüne `.xslt` formatında kaydedilir.
  - "Sistem Durum Raporu" sekmesinde yer alan şablon kütüphanesine, mevcut tasarımı isim vererek diske kaydeden giriş alanı ve buton yerleştirildi.
  - Diske kaydedilen tüm şablonlar, aynı sekmede şık bir kart listesi halinde görüntülenir ve tek tıkla editöre geri yüklenebilir.
  - Dosya sistemindeki `public/templates` klasörüne dışarıdan atılan veya silinen XSLT dosyaları program tarafından otomatik olarak algılanır, listenin yanındaki yenileme butonuyla veya sekmeler arası geçiş yapıldığında anında taranarak listeye yansıtılır.

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
