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
* **Görsel Tasarımcı (Beta):** Kod yazmadan faturanın kurumsal temasını (renklerini), kaşe/filigran yazılarını, kolon yerleşimlerini (Satıcı/Alıcı swap) ve whitelisted alanların iç boşluk (padding), dış boşluk (margin), genişlik ve yazı stili ayarlarını görsel panelden yapabilirsiniz.
* **Sessiz Koda Git (Inspector):** Önizleme ekranındaki bir elemana tıklayarak o elemanın XSLT kodundaki tam satırına anında odaklanabilirsiniz.
* **Çift Tıklama ile Metin Düzenleme:** Önizleme üzerindeki statik metinlere (kaşeler, sabit başlıklar veya yeni eklenen metin kutuları) çift tıklayarak metinleri doğrudan güncelleyebilirsiniz. Yapay zeka koruma kalkanı sayesinde dinamik fatura formüllerinin bozulması engellenir.
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
* **Visual Designer (Beta):** Without writing code, you can visually adjust corporate theme colors, stamp/watermark text, swap column positions (Supplier/Customer), and tweak padding, margin, width, and typography styles for whitelisted zones.
* **Silent Jump to Code (Inspector):** Click any element on the preview screen to instantly focus on its exact line within the XSLT code editor.
* **Double-Click Text Editing:** Double-click static text (stamps, static headers, or newly added text boxes) directly on the preview to update them. AI-assisted checks prevent breaking dynamic formula bindings.
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
