# UNI XML & XSLT Canlı Tasarım Editörü / Live Design Editor

<div align="center">
  <img src="https://img.shields.io/badge/Powered%20by-Google%20DeepMind%20Antigravity-blueviolet?style=for-the-badge&logo=google" alt="Antigravity AI">
  <img src="https://img.shields.io/badge/Made%20with-AI%20Assisted-magenta?style=for-the-badge&logo=artificialintelligence" alt="AI Assisted">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
</div>

---

## 🇹🇷 Türkçe Tanıtım

**UNI XML & XSLT**, e-Fatura, e-Arşiv ve UBL-TR standartlarındaki XML fatura verilerini XSLT şablonları ile canlı olarak görselleştiren, biçimlendiren ve tasarlayan web tabanlı, istemci taraflı (client-side) gelişmiş bir tasarım istasyonudur.

Hiçbir veriyi sunucuya göndermeden, tamamen tarayıcınızın yerel dönüştürme motoru (XSLTProcessor) yardımıyla çalışır ve gizliliği maksimum düzeyde korur.

### ✨ Temel Özellikler
* **Canlı Dönüşüm & Önizleme:** XML ve XSLT dosyalarındaki en ufak kod değişikliklerini anında sağ taraftaki A4 baskı önizleme ekranında görebilirsiniz.
* **Görsel Tasarımcı (WYSIWYG Stiler):** Kod yazmadan faturadaki tüm elemanların yazı boyutunu, rengini, hizalamasını, genişliğini ve boşluk (margin/padding) ayarlarını inline style enjeksiyon motoru sayesinde doğrudan görsel panelden yapabilirsiniz.
* **Çift Tıklama veya "Metni Düzenle" Butonu ile Yazma:** Önizleme üzerindeki herhangi bir statik nota, başlığa veya metin kutusuna çift tıklayarak ya da sol paneldeki "Metni Düzenle" butonu yardımıyla metinleri doğrudan fatura üzerinde değiştirebilirsiniz. Notlar bölümü satır bazlı düzenlemeye uygun hale getirilmiştir.
* **Dinamik Yerel Şablon Kütüphanesi:** Tasarladığınız faturanın son halini isim vererek proje dizinindeki `public/templates/` klasörüne kalıcı olarak kaydedebilir ve istediğinizde geri yükleyebilirsiniz. Klasöre dışarıdan atılan veya silinen XSLT dosyaları program tarafından otomatik olarak algılanır ve listelenir.
* **Gelişmiş Yazıcı & Baskı Çıktısı:** Yazdırma esnasında faturanın çevresindeki gölgeleri, sayfa marjı bozulmalarını, zoom ölçeklerini ve seçim çerçevelerini dinamik `@media print` CSS kuralları yardımıyla temizler, A4 kağıda tam ölçekli ve kusursuz çıktı verir.
* **Sessiz Koda Git (Inspector):** Önizleme ekranındaki bir elemana tıklayarak o elemanın XSLT kodundaki tam satırına anında odaklanabilirsiniz.
* **Boş Alanlara Yeni Metin Ekleme:** Faturanın Alıcı, Satıcı veya Detay bölgelerine tek tıkla yeni metin kutuları yerleştirebilir, bunları görsel panelden özelleştirebilirsiniz.
* **Gömülü XSLT Ayıklama:** XML dosyasında base64 formatında gömülü olan XSLT kodlarını otomatik tespit eder, tek tıkla şablon editörüne yükler veya XML'den temizler.

### 🚀 Kolay Başlangıç (Tek Tıkla Çalıştır)
Projeyi bilgisayarınıza indirdikten sonra terminal komutları yazmadan çalıştırmak için:

* **Windows Kullanıcıları:**
  Kök dizindeki **`start.bat`** dosyasına çift tıklayın. Node.js yüklü ise gerekli bağımlılıklar kurulacak ve tarayıcınız otomatik olarak açılacaktır.

* **macOS & Linux Kullanıcıları:**
  Terminali açıp proje klasörüne gidin ve şu komutları sırasıyla çalıştırın:
  ```bash
  chmod +x start.sh
  ./start.sh
  ```

---

## 🇺🇸 English Description

**UNI XML & XSLT** is a web-based, client-side advanced design station that visualizes, formats, and designs XML invoice data in e-Invoice, e-Archive, and UBL-TR standards using XSLT templates.

It runs entirely within your browser using the local conversion engine (XSLTProcessor) without sending any data to a server, ensuring maximum privacy.

### ✨ Key Features
* **Live Transformation & Preview:** Instantly see any code changes in XML and XSLT files on the right-hand A4 print preview screen.
* **Visual Designer (WYSIWYG Styler):** Visually adjust font sizes, colors, alignments, widths, and padding/margin styles for any element directly on the panel using our inline style injection engine.
* **Inline Text Editing & "Edit Text" Button:** Change text contents of any note, static title, or text box directly on the invoice using the "Edit Text" button or by double-clicking it. The invoice notes section is optimized for row-by-row selection and editing.
* **Local Template Library:** Save your custom designs with a name into the project's `public/templates/` folder and load them instantly. The application automatically detects, lists, and watches XSLT templates added or removed externally in Windows Explorer.
* **Perfect Print Output:** Removes preview shadow borders, page margin offsets, zoom transformations, and selector glows using dynamic `@media print` CSS rules, providing a clean, edge-to-edge A4 print.
* **Silent Jump to Code (Inspector):** Click any element on the preview screen to instantly focus on its exact line within the XSLT code editor.
* **Add Text Boxes to Empty Spaces:** Insert new editable text boxes (divs) into the Customer, Supplier, or Invoice details columns with a single click, and customize them using the visual panel.
* **Embedded XSLT Extraction:** Automatically detects base64-encoded embedded XSLT templates inside XML documents and lets you load them into the editor or remove them with one click.

### 🚀 Quick Start (One-Click Launch)
After downloading the project to your computer, to run it without manually typing terminal commands:

* **Windows Users:**
  Double-click the **`start.bat`** file in the root directory. If Node.js is installed, it will automatically install dependencies and launch the browser.

* **macOS & Linux Users:**
  Open terminal, navigate to the project directory, and run the following commands:
  ```bash
  chmod +x start.sh
  ./start.sh
  ```

---

## 🤖 Yapay Zeka Katkı Etiketi / AI Contribution Badge

> [!NOTE]
> Bu projenin görsel tasarımı, WYSIWYG düzenleyicisi, XSLT ayrıştırma algoritmaları ve çift yönlü senkronizasyon yetenekleri **Google DeepMind Antigravity AI** yazılım asistanı yardımıyla tasarlanmış, optimize edilmiş ve doğrulanmıştır.
> 
> This project's visual UI, WYSIWYG styler, XSLT parsing algorithms, and bidirectional editor synchronization capabilities have been designed, optimized, and verified with the assistance of **Google DeepMind Antigravity AI** coding assistant.
