<div align="center">

# UNI XML & XSLT Canlı Tasarım Editörü

**e-Fatura / e-Arşiv / UBL-TR XML faturaları için web tabanlı, tamamen istemci tarafında çalışan canlı XSLT tasarım editörü**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&labelColor=20232a)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&labelColor=1a1a2e)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white&labelColor=1e2a3a)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white&labelColor=0f172a)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5-F97316?logo=zustand&logoColor=white&labelColor=1c1917)](https://zustand.docs.pmnd.rs/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-0098FF?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHRleHQgeD0iMiIgeT0iMTgiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIj48L3RleHQ+PC9zdmc+)](https://microsoft.github.io/monaco-editor/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white&labelColor=1a1a1a)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/Lisans-MIT-yellow.svg)](LICENSE)

</div>

---

## 📖 Hakkında

**UNI XML & XSLT Canlı Tasarım Editörü**, Türkiye e-Dönüşüm standartlarına uygun **e-Fatura**, **e-Arşiv** ve **UBL-TR** XML faturalarınızı görsel olarak tasarlayabilmenizi sağlayan modern bir web uygulamasıdır.

Uygulama **tamamen istemci tarafında (client-side)** çalışır; hiçbir veri sunucuya gönderilmez. XML dosyalarınız ve tasarım şablonlarınız yalnızca tarayıcınızda işlenir ve saklanır.

## ✨ Özellikler

- ⚡ **Canlı Dönüşüm (Live Transformation)** — XSLT kodunuzdaki her değişiklik anında önizlemede görünür
- 🎨 **WYSIWYG Tasarımcı** — Görsel düzenleyici ile sürükle-bırak kolaylığında fatura tasarımı
- ✏️ **Satır İçi Metin Düzenleme** — Önizleme üzerinde doğrudan metin düzenlemesi
- 📚 **Yerel Şablon Kütüphanesi** — Hazır şablonları kaydedin, tekrar kullanın (tarayıcı yerel deposunda)
- 🖨️ **Kusursuz A4 Baskı** — Yazdırma için optimize edilmiş, milimetrik hassasiyette A4 çıktı
- 🔍 **Kod İnceleyici (Code Inspector)** — Monaco Editor ile gelişmiş XSLT/XML kod düzenleme
- 🌗 **5 Farklı Tema** — 3 koyu, 2 açık tema ile göz dostu çalışma ortamı
- 📤 **Gömülü XSLT Çıkarma** — PDF/XML içindeki gömülü XSLT stillerini otomatik ayıklayın
- 🔒 **%100 Gizlilik** — Tüm işlemler tarayıcınızda gerçekleşir, veriler asla dışarı çıkmaz

## 🚀 Hızlı Başlangıç

### Gereksinimler

- [Node.js](https://nodejs.org/) 20 veya üzeri

### Kolay Kurulum

**Windows:**

```bash
start.bat
```

**macOS / Linux:**

```bash
./start.sh
```

### Manuel Kurulum

```bash
# Depoyu klonlayın
git clone https://github.com/alperenalbay/UNI_XML_XSLT.git
cd UNI_XML_XSLT

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresini açın. Hazır! 🎉

### Üretim Derlemesi

```bash
npm run build
npm run preview
```

## 💡 Kullanım

1. **XML Yükleme** — e-Fatura / e-Arşiv / UBL-TR XML dosyanızı uygulamaya sürükleyip bırakın veya seçin
2. **Şablon Seçimi** — Yerel şablon kütüphanesinden hazır bir tasarım seçin veya sıfırdan başlayın
3. **Görsel Tasarım** — WYSIWYG editör ile tasarımınızı özelleştirin; satır içi metin düzenlemeyi kullanın
4. **XSLT Düzenleme** — Kod inceleyicide XSLT üzerinde ince ayarlar yapın, değişiklikler anında yansır
5. **Baskı / Dışa Aktarma** — Kusursuz A4 baskı ile faturanızı yazdırın veya kaydedin

> 🔐 **Not:** Tüm işlemler tarayıcınızda gerçekleşir. Dosyalarınız hiçbir sunucuya yüklenmez.

## 📁 Proje Yapısı

```
UNI_XML_XSLT/
├── src/
│   ├── components/        # React bileşenleri
│   ├── stores/            # Zustand durum yönetimi
│   ├── utils/             # Yardımcı fonksiyonlar
│   ├── themes/            # Tema tanımlamaları
│   └── templates/         # Varsayılan XSLT şablonları
├── tests/                 # Vitest test dosyaları
├── public/                # Statik varlıklar
├── start.bat              # Windows hızlı başlatma
├── start.sh               # macOS/Linux hızlı başlatma
├── LICENSE                # MIT Lisansı
├── CHANGELOG.md           # Sürüm geçmişi
└── package.json
```

## 🛠️ Teknolojiler

| Teknoloji | Sürüm | Amaç |
|-----------|-------|------|
| [React](https://react.dev/) | 19 | Kullanıcı arayüzü |
| [Vite](https://vite.dev/) | 8 | Derleme ve geliştirme aracı |
| [TypeScript](https://www.typescriptlang.org/) | 6 | Tip güvenli JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Hızlı stil geliştirme |
| [Zustand](https://zustand.docs.pmnd.rs/) | 5 | Durum yönetimi |
| [Monaco Editor](https://microsoft.github.io/monaco-editor/) | — | Kod düzenleyici |
| [Vitest](https://vitest.dev/) | — | Birim testleri |

## 🧪 Testler

Projede [Vitest](https://vitest.dev/) ile yazılmış birim testleri bulunur:

```bash
# Testleri çalıştır
npm run test

# Watch modunda çalıştır
npm run test:watch

# Kapsam raporu ile çalıştır
npm run test:coverage
```

## 🤝 Katkı Sağlama

Katkılarınız memnuniyetle karşılanır! 🎉

1. Depoyu fork edin
2. Yeni bir dal oluşturun (`git checkout -b feature/harika-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: harika özellik eklendi'`)
4. Dalınızı push edin (`git push origin feature/harika-ozellik`)
5. Pull Request açın

Hata bildirimleri ve özellik önerileri için [Issues](https://github.com/alperenalbay/UNI_XML_XSLT/issues) sekmesini kullanabilirsiniz.

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır. Detaylar için `LICENSE` dosyasını inceleyebilirsiniz.

Sürüm geçmişi için [CHANGELOG.md](CHANGELOG.md) dosyasına bakabilirsiniz.

---

<div align="center">

🤖 Bu proje **Google DeepMind Antigravity** yapay zekâ desteğiyle geliştirilmiştir.

⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!

</div>
