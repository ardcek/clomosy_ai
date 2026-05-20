# Kullanılan teknolojiler ve bileşenler — Akıllı Arıza & Saha Operasyon

Bu liste sunum, rapor ve teknik sorular için **tek referans** olarak kullanılabilir. “Ne kullanılmadı” maddeleri de özellikle önemlidir (mimari karar).

---

## 1. İstemci platformu ve dil

| Teknoloji | Ne için kullanılıyor? |
|-----------|------------------------|
| **Clomosy** | Uygulama çalışma ortamı (IDE + runtime); formlar ve bileşenler bu platformda açılır. |
| **TRObject (.tro)** | Tüm iş mantığı ve arayüz kodu; Pascal-benzeri sözdizimi, `TclForm` / `TclPro*` bileşenleri. |
| **Birim (unit) yapısı** | `MainCode.tro`, `uLogin.tro`, `uTalepAcma.tro`, `uYoneticiAtama.tro`, `uSahaPersoneli.tro` — modüler ekran ve `Clomosy.RunUnit` ile geçiş. |

---

## 2. Arayüz (UI) bileşenleri (Clomosy tarafı)

Kodda geçen başlıca sınıflar:

| Bileşen / tip | Kullanım |
|---------------|----------|
| `TclForm` | Ana form kabuğu |
| `TclProPanel`, `TclProLabel`, `TclProButton`, `TclProEdit` | Kartlar, başlıklar, düğmeler, metin kutuları |
| `TclProListView` + `TClProListViewDesignerPanel` | Talep/görev listeleri (şablon + JSON veri bağlama) |
| `TClComboBox` | Öncelik seçimi, personel seçimi |
| `TclVertScrollBox` | Dikey kaydırma |
| `TClTimer` | İlk açılışta gerçek genişlik gelene kadar responsive yerleşim tetikleme |
| `clAlphaColor`, `SetclProSettings` | Tema renkleri ve Pro bileşen stil güncellemesi |

---

## 3. Ağ ve iletişim

| Teknoloji | Ne için? |
|-----------|----------|
| **HTTPS** | Tüm REST çağrıları şifreli kanal üzerinden. |
| **`TclRest` (Clomosy)** | `GET` / `POST` / `PATCH` istekleri; `BaseURL`, `Method`, `Body`, `Execute`. |
| **JSON (metin olarak)** | İstek gövdeleri ve yanıtlar; `Clomosy.ClDataSetFromJSON` ile listeye yükleme; manuel string birleştirme + kaçış yardımcıları (`JsonEsc` vb.). |
| **Query parametresi `?auth=<idToken>`** | Realtime Database REST çağrılarında Firebase kimlik doğrulaması. |

---

## 4. Kimlik doğrulama (Authentication)

| Teknoloji / uç nokta | Açıklama |
|---------------------|----------|
| **Google Firebase Authentication** | E-posta + şifre ile giriş. |
| **Identity Toolkit REST API** | `POST .../v1/accounts:signInWithPassword?key=<Web_API_Key>` — yanıtta `idToken`, `localId` (uid). |
| **Oturum durumu (istemci)** | `Clomosy.GlobalVariableString` üzerinde pipe-ayırımlı `SessionGet` / `SessionSet` (`Token`, `UserId`, `Rol`, vb.). |

---

## 5. Veri katmanı

| Teknoloji | Açıklama |
|-----------|----------|
| **Firebase Realtime Database (RTDB)** | Tek gerçek zamanlı veri deposu; hiyerarşik JSON (`users`, `tickets`, `tickets/.../events`). |
| **RTDB REST API** | `.json` uçları: okuma, filtreli sorgu (`orderBy` + `equalTo`), `POST` ile yeni kayıt, `PATCH` ile güncelleme. |
| **Güvenlik kuralları** | `firebase/database.rules.json` — rol ve alan bazlı okuma/yazma kısıtları. |
| **`.indexOn` indeksleri** | Sorgulanan alanlar için RTDB indeks tanımları (aynı rules dosyasında / ilgili yapılandırma). |

**Önemli mimari not:** Bu MVP’de **Cloud Functions yok**, **Firestore yok** (aktif uygulama yolu). İstemci doğrudan RTDB + Auth ile konuşur.

---

## 6. Firebase projesi ve araçlar

| Araç / dosya | Rol |
|--------------|-----|
| **Firebase CLI** (`firebase deploy --only database`) | RTDB kurallarının dağıtımı |
| **`firebase.json`** | RTDB rules dosyası yolunu işaret eder |
| **`.firebaserc`** | Firebase proje ID eşlemesi |
| **Firebase Console** (manuel) | Auth kullanıcıları, RTDB verisi, Web API Key, Database URL |

---

## 7. İş mantığı özeti (kodda uygulanan kurallar)

| Konu | Uygulama |
|------|----------|
| **Roller** | `TalepAcan`, `Yonetici`, `SahaPersoneli` — `users/<uid>.rol` ile eşleşir, `uLogin` yönlendirir. |
| **Durum makinesi** | `Acik` → `Atandi` → `Yolda` → `Islemde` → `Tamamlandi` / `Beklemede` geçişleri (istemci doğrulaması). |
| **SLA** | Öncelik → süre; istemcide hesaplanan `slaDeadline` alanı talebe yazılır. |
| **Olay kaydı** | `tickets/<id>/events/<auto>` — `fromStatus`, `toStatus`, `changedBy`, `changedAt`, `note`. |
| **Yük limiti** | Saha personeli başına en fazla **5** aktif görev (`Atandi` / `Yolda` / `Islemde`); atama öncesi kontrol. |

---

## 8. Konfigürasyon (istemci)

| Kaynak | İçerik |
|--------|--------|
| **`MainCode.tro`** | Varsayılan `DB_URL_DEFAULT`, `API_KEY_DEFAULT`; boot’ta global değişkene yazılır (Clomosy proje parametreleri ile override edilebilir). |

---

## 9. Dokümantasyon ve yardımcı üretim

| Teknoloji | Kullanım |
|-----------|----------|
| **Markdown** | `README.md`, `docs/*.md` |
| **Python 3 + `python-docx`** | `docs/build_rapor_docx.py` ile teknik rapor Word çıktısı (`docs/.venv-docx` sanal ortamı). |

---

## 10. Kullanılmayan / bilinçli olarak dışarıda bırakılanlar

| Madde | Not |
|--------|-----|
| **Cloud Functions** | Aktif mimaride yok; eski deneme `firebase/_functions-eski/` altında arşiv. |
| **Firestore** | Aktif veri modeli RTDB. |
| **Özel Node.js / .NET API sunucusu** | İstemci doğrudan Firebase REST ile konuşur. |
| **SQLite (bu MVP akışında)** | Bu proje RTDB odaklı; eski denemeler `app-yerel-eski` vb. klasörlerde kalabilir. |

---

## 11. Sunum için tek cümle (stack özeti)

> **Clomosy + TRObject** istemcisi, **HTTPS** üzerinden **TclRest** ile **Firebase Authentication** ve **Realtime Database REST** kullanarak çok rollü talep yönetimi sunar; yetkiler **RTDB Security Rules** ile, iş kuralları ve arayüz **TRObject kodunda** uygulanır.

---

İlgili dosyalar: `README.md`, `docs/veri-modeli.md`, `docs/kurulum.md`, `app/MainCode.tro`.
