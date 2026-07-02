# 🧠 Clomosy AI — Otonom Eğitim & Yerel RAG Sistemi

<div align="center">

![Clomosy AI Banner](https://img.shields.io/badge/Clomosy-AI%20System-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMiAxNWwtNS01IDEuNDEtMS40MUwxMCAxNC4xN2w3LjU5LTcuNTlMMTkgOGwtOSA5eiIvPjwvc3ZnPg==)
![Node.js](https://img.shields.io/badge/Node.js-v24+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)
![Zero Token](https://img.shields.io/badge/Token%20Maliyeti-SIFIR-red?style=for-the-badge)

**Clomosy / TRObject platformu için geliştirilmiş, tamamen çevrimdışı (offline) çalışan otonom yapay zeka eğitim ve yerel bilgi arama (RAG) sistemi.**

[📖 Dokümantasyon](#-nasıl-çalışır) • [🚀 Kurulum](#-kurulum) • [🔍 Arama](#-arama-kullanımı) • [📊 Özellikler](#-özellikler)

</div>

---

## 🎯 Proje Nedir?

Bu sistem, [Clomosy](https://clomosy.com) platformunun tescilli dili **TRObject** ile yazılmış projelerin ve resmi dokümantasyonun tamamını otomatik olarak tarayıp, yapay zekanın anlık sorgu atıp kullanabileceği **yerel, sıfır maliyetli bir bilgi veritabanı** oluşturur.

### Temel Sorun ve Çözüm

| Problem | Çözümümüz |
|---------|-----------|
| Her sorguda tüm projeyi LLM'e yüklemek → **50.000+ Token** | RAG ile sadece ilgili 15 satırı getir → **~500 Token** |
| ML modeli indirme gerektiriyor | Tamamen offline TF-IDF/BM25 motoru |
| Yeni dosyalar için manual işlem | Watcher ile anlık, otomatik indeksleme |
| İnternet bağlantısı zorunluluğu | %100 yerel, kapalı devre sistem |

> 💡 **Sonuç:** Token maliyetinde **%99 tasarruf**, sıfır internet bağımlılığı, tam veri mahremiyeti.

---

## ✨ Özellikler

- 🤖 **Otonom Dokümantasyon Tarayıcısı** — `docs.clomosy.com`'daki tüm 265 sayfayı (TRObject dil referansı, bileşenler, fonksiyonlar) otomatik çeker ve yapılandırır
- 📂 **Akıllı Dosya Takipçisi (Watcher)** — `.tro`, `.md`, `.pdf` dosyalarını gerçek zamanlı izler; yeni dosya eklenir eklenmez saniyeler içinde indeksler
- 🔍 **Anlamsal Yerel Arama** — TF-IDF + BM25 destekli Minisearch motoru ile fuzzy (esnek) arama
- 📄 **PDF Desteği** — Clomosy Eğitim Kitabı dahil tüm PDF'leri otomatik okuyup parçalara böler
- 💾 **Kalıcı Bellek** — `vector_db.json` ile indekslenen her şey sistem yeniden başlatılsa bile hatırlanır
- 🔒 **Sıfır Veri Sızıntısı** — Hiçbir firma kodu dış sunuculara gönderilmez

---

## 📁 Proje Yapısı

```
clomosy-ai/
├── 📄 clomosy_ai_trainer.js       # Dokümantasyon web tarayıcısı (265 sayfa)
├── 📄 clomosy_ai_trainer.py       # Python alternatifi
│
├── 📂 rag_system/
│   ├── 📄 indexer.js              # Dosya watcher + chunker + indeksleyici
│   ├── 📄 search.js               # CLI arama arayüzü
│   ├── 📄 package.json            # Node.js bağımlılıkları
│   └── 📄 vector_db.json          # Yerel vektör veritabanı (auto-generated)
│
├── 📄 TRObject_AI_KnowledgeBase.md   # Tüm Clomosy dökümantasyonu (Markdown)
├── 📄 TRObject_AI_KnowledgeBase.json # Tüm Clomosy dökümantasyonu (JSON/RAG)
├── 📄 TRObject_Complete_Reference.md # TRObject dil referansı
└── 📄 TRObject_Documentory.md        # TRObject detaylı dokümantasyon
```

---

## 🚀 Kurulum

### Gereksinimler
- **Node.js** v18 veya üzeri

### Adım 1 — Bağımlılıkları Yükle

```bash
cd rag_system
npm install
```

### Adım 2 — Dokümantasyonu Çek (İlk Kurulumda Bir Kez)

```bash
# Clomosy'nin tüm resmi dökümantasyonunu çeker (~265 sayfa)
node clomosy_ai_trainer.js
```

Bu komut çalıştığında `TRObject_AI_KnowledgeBase.md` ve `TRObject_AI_KnowledgeBase.json` dosyaları oluşturulur.

### Adım 3 — Watcher'ı Başlat

```bash
cd rag_system
node indexer.js
```

> ✅ Bu noktadan itibaren sistem arka planda çalışır. Klasörünüze eklediğiniz her `.tro`, `.md` veya `.pdf` dosyası otomatik olarak indekslenir.

---

## 🔍 Arama Kullanımı

```bash
cd rag_system

# TRObject bileşeni araması
node search.js "SetupComponent"

# Fonksiyon araması
node search.js "DBSQLiteConnect"

# Konsept araması
node search.js "login ekranı buton animasyonu"
```

### Örnek Çıktı

```
Aranıyor: "SetupComponent"...

=== ARAMA SONUÇLARI ===

[Sonuç 1] Dosya: ClomosyBankProject\Clomosy\mainForm.tro (Skor: 6.64)
--------------------------------------------------
clComponent.SetupComponent(dovizAlBtn,'{
  "RoundHeight":12,
  "RoundWidth":12,
  "Width":100,
  "Height":26,
  "TextSize":20
}');
--------------------------------------------------
```

---

## 🏗️ Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────────┐
│                    CLOMOSY AI SİSTEMİ                       │
├─────────────────────┬───────────────────────────────────────┤
│  FAZ 1: VERİ ÇEKME  │  FAZ 2: YEREL RAG                    │
│                     │                                       │
│  docs.clomosy.com   │   .tro / .md / .pdf dosyaları        │
│       ↓             │          ↓                            │
│  MediaWiki API      │   chokidar (Watcher)                  │
│       ↓             │          ↓                            │
│  265 Sayfa Çekme    │   Chunker (800 char parçalar)         │
│       ↓             │          ↓                            │
│  KnowledgeBase.md   │   MiniSearch İndeksleme               │
│  KnowledgeBase.json │          ↓                            │
│                     │   vector_db.json (Kalıcı Bellek)      │
│                     │          ↓                            │
│                     │   search.js → Top-K Sonuçlar          │
└─────────────────────┴───────────────────────────────────────┘
```

---

## 📊 Performans İstatistikleri

> Gerçek çalışma verileri (01.07.2026 itibarıyla)

| Metrik | Değer |
|--------|-------|
| İndekslenen Dosya | 630+ benzersiz dosya |
| İndekslenen Chunk | 5.979+ kod parçası |
| Veritabanı Boyutu | ~12.5 MB |
| Arama Süresi | < 500ms |
| Desteklenen Format | `.tro`, `.md`, `.pdf`, `.txt` |
| Token Tasarrufu | %99 |

---

## 🛠️ Kullanılan Teknolojiler

| Paket | Versiyon | Amaç |
|-------|----------|------|
| `chokidar` | ^4.x | Dosya sistemi izleme (Watcher) |
| `minisearch` | ^7.x | Offline TF-IDF/BM25 arama motoru |
| `pdf-parse` | ^1.1.1 | PDF metin çıkarma |

---

## 🗺️ Yol Haritası

- [x] Clomosy dokümantasyon web tarayıcısı
- [x] Dosya watcher ve otomatik indeksleme
- [x] Yerel TF-IDF arama motoru
- [x] PDF desteği
- [ ] Vektörel embedding motoru (GPU ile)
- [ ] REST API arayüzü (HTTP sunucu)
- [ ] VS Code eklentisi entegrasyonu
- [ ] Windows Başlangıç servisi kurulum scripti

---

## 📜 Lisans

MIT License — Özgürce kullanabilir, dağıtabilir ve geliştirebilirsiniz.

---

<div align="center">

**Clomosy Topluluğu için ❤️ ile geliştirilmiştir**

[clomosy.com](https://clomosy.com) • [docs.clomosy.com](https://docs.clomosy.com)

</div>
