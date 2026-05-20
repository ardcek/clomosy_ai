# PROJE TEKNİK RAPORU: AKILLI ARIZA & SAHA OPERASYON (CLOMOSY / TROBJECT)

| | |
|---|---|
| **Hazırlayan** | Arda Çekiç, Esra Ağlar |
| **E-posta** | ardcek@hotmail.com, llesraaq.nur@gmail.com |
| **Platform** | Clomosy / TRObject |
| **Veri & kimlik** | Google Firebase (Identity Toolkit + Realtime Database), REST tabanlı erişim |
| **Proje aktivasyon kodu** | EDUCA-7F7DC |

---

## Giriş bilgileri (demo / test)

Aşağıdaki hesaplar rapor ve demo amaçlıdır; canlı ortamda kullanılmamalıdır.

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Yönetici | yonetici@firma.com | yonetici123 |
| Talep açan | talepacan@firma.com | talep123 |
| Saha personeli | saha@firma.com | saha123 |

---

## 1. YÖNETİCİ ÖZETİ

**Akıllı Arıza & Saha Operasyon**, Clomosy ortamında TRObject ile geliştirilen, sahada ve ofiste **arıza / iş taleplerinin** dijitalleştirilmesini hedefleyen düşük kodlu bir çözümdür. Talep oluşturma, yönetici tarafından personele atama ve saha personelinin **durum güncellemeleri** tek uygulama akışında toplanır; kullanıcılar rol bazlı ekranlara yönlendirilir. Amaç: taleplerin merkezi ve güncel kalması, iletişim ve manuel takip yükünün azaltılması.

---

## 2. TEKNİK ALTYAPI VE MİMARİ

**Geliştirme ortamı:** İş mantığı ve arayüz Clomosy üzerinde TRObject (.tro) birimleriyle tanımlanır; formlar, Pro bileşenler ve olay bağları platform kalıplarına uygundur.

**Kimlik ve yetkilendirme:** Firebase Authentication (e-posta / şifre) ile oturum; kullanıcı profili ve **rol** bilgisi (`Yonetici`, `TalepAcan`, `SahaPersoneli`) Realtime Database’deki kullanıcı kaydı üzerinden okunur ve ilgili modüle yönlendirme yapılır.

**Veri yönetimi:** Talep ve operasyon verileri **Firebase Realtime Database** üzerinde tutulur; istemci tarafında REST çağrıları ile okuma / yazma / sorgu (ör. `orderBy` + `equalTo`) gerçekleştirilir. Bu sayede mobil ve masaüstü istemciler aynı canlı veri modeline erişebilir.

**Arayüz:** ProPanel, ProListView, ProEdit vb. bileşenlerle kart tabanlı, responsive yerleşim; rol ekranlarında ortak tasarım token’ları (renk, tipografi) kullanılır.

---

## 3. MODÜLER YAPI VE FONKSİYONEL ÖZELLİKLER

**3.1. Güvenlik ve giriş (`uLogin`)**  
E-posta / şifre ile giriş; hata mesajlarının kullanıcı dostu gösterimi; başarılı girişte role göre `uYoneticiAtama`, `uTalepAcma` veya `uSahaPersoneli` birimine geçiş.

**3.2. Talep açan modül (`uTalepAcma`)**  
Yeni talep formu (başlık, açıklama, konum, öncelik); talebin RTDB’ye yazılması; kullanıcıya ait taleplerin listelenmesi, yenileme ve metin araması ile filtreleme. Önceliğe göre istemci tarafında SLA süresi hesaplanır.

**3.3. Yönetici atama modülü (`uYoneticiAtama`)**  
Açık taleplerin listelenmesi; personel seçimi ve talebe atama; talep özeti ve arama.

**3.4. Saha personeli modülü (`uSahaPersoneli`)**  
Personele atanan taleplerin listelenmesi; iş kuralına uygun **durum geçişleri** (ör. Atandı → Yolda / İşlemde, İşlemde → Beklemede / Tamamlandı vb.); isteğe bağlı not ve durum güncellemesi için RTDB güncellemeleri.

---

## 4. PROJE ÇIKTILARI VE AVANTAJLAR

- **Hız:** TRObject ile ekran ve iş akışlarının tek kod tabanında hızlı iterasyonu; Clomosy’nin bileşen modeli ile form yoğun geliştirmenin kısaltılması.  
- **Erişilebilirlik:** Firebase tabanlı veri; sahada mobil, ofiste aynı mantıkla kullanım.  
- **Maliyet / bakım:** Sunucu tarafında ağır özel API zorunluluğu olmadan RTDB ve kimlik servisleriyle sade mimari; modüllerin rol bazlı ayrılması bakımı kolaylaştırır.

---

## 5. SONUÇ

**Akıllı Arıza & Saha Operasyon**, Clomosy ve TRObject ile geliştirilen, talep yaşam döngüsünü **açma → atama → saha durumu** olarak kapsayan uygulamadır. Firebase ile kimlik ve gerçek zamanlı veri birleştirilerek, küçük ve orta ölçekli operasyon ekipleri için uygulanabilir bir saha operasyon iskeleti sunulmaktadır.

---

**İletişim:** ardcek@hotmail.com · llesraaq.nur@gmail.com  

**Proje aktivasyon kodu:** EDUCA-7F7DC
