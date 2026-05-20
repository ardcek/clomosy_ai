# Demo senaryosu — Patron, talep açan, saha personeli

Aşağıdaki senaryo **üç farklı kişi** ve uygulamadaki **üç rol** ile uyumludur: talebi açan, atayan (patron / yönetici), sahada çalışan. Sunumda hikâyeyi anlatırken veya canlı demo yaparken sırayı takip edebilirsin.

---

## Karakterler

| Kişi | Rol (uygulama) | Demo hesabı (varsa) |
|------|----------------|---------------------|
| **Arda Bey** — fabrika operasyon müdürü (“patron”) | Yönetici — açık talepleri görür, personele atar | `yonetici@firma.com` |
| **Esra Hanım** — üretim hattı sorumlusu | Talep açan — talep oluşturur, kendi taleplerini izler | `talepacan@firma.com` |
| **Ahmet Usta** — bakım-onarım teknisyeni | Saha personeli — kendine atanan işi görür, durumu günceller | `saha@firma.com` |

> Not: “Patron” işletme sahibi de olabilir; bu senaryoda pratik olarak **atama ve takip yetkisine** sahip **yönetici** rolüyle özdeşleştirdik.

---

## Arka plan (1 cümle)

**Klas Tekstil** fabrikasında 3. hat üzerindeki motor kabini sıcaklığı yükseliyor; durdurulmazsa hat durabilir. Esra Hanım durumu görür, talep açar. Arda Bey talebi görür ve o saatte en uygun teknisyen Ahmet Usta’ya atar. Ahmet telefondan işe gider, durumu adım adım günceller.

---

## Zaman çizelgesi (hikâye)

### 1) Salı 09:15 — Talep açan (Esra Hanım)

Esra Hanım, hattı gezerken motor kabininden anormal ses ve koku fark eder. Telefondan uygulamaya girer (**Talep açan**).

- **Başlık:** `3. Hat motor kabini — aşırı ısınma`  
- **Açıklama:** Fan sesi değişti, yağ kokusu var; hat şefi durdurmayı değerlendiriyor.  
- **Konum:** `Ana bina / 3. Hat / Motor kabini B`  
- **Öncelik:** **Kritik** (SLA: 2 saat)  
- **Talep Oluştur**’a basar. Sistem talebe numara verir; durum **Açık** olur.

**Slayt / demo notu:** “İç müşteri veya sahadaki sorumlu, tek formda kayıt bırakıyor; öncelik SLA’yı belirliyor.”

---

### 2) Salı 09:22 — Patron / yönetici (Arda Bey)

Arda Bey ofiste veya başka bir şubede. **Yönetici** hesabıyla girer, “Açık talepler” listesinde Esra Hanım’ın kaydını görür.

- Talebi okur; **Ahmet Usta**’yı seçer (o saatte aktif görev sayısı uygundur).  
- **Ata** der. Talep durumu **Atandı** olur; `events` altına “Arda Bey → Ahmet Usta’ya atandı” benzeri bir kayıt düşer.

**Slayt / demo notu:** “Patron/koordinatör doğru kişiyi seçiyor; telefon trafiği yerine tek ekran.”

---

### 3) Salı 09:35 — Saha personeli (Ahmet Usta)

Ahmet’in telefonunda bildirim yoksa bile listeyi **Yenile** ile günceller (**Saha personeli** ekranı).

- Kendine düşen görevi görür: konum ve öncelik net.  
- Depodan malzeme alıp yola çıkar → durumu **Yolda** yapar.  
- Kabine varınca fan rulmanını kontrol eder → **İşlemde**.  
- Rulman değişimi için parça bekleyecek → **Beklemede** + not: `Rulman sipariş no: … Perşembe teslim`.  
- Parça gelince tekrar **İşlemde**, işi bitirince **Tamamlandı** + kısa not: `Fan+rulman değişti, test OK`.

**Slayt / demo notu:** “Saha tek tuşla durum bildiriyor; patron ve talep açan sistemde ilerlemeyi görebilir.”

---

### 4) Salı 11:10 — Kapanış (herkes kazanır)

- **Esra Hanım:** Listesinde talebin **Tamamlandı** olduğunu görür; üretim güvenle devam eder.  
- **Arda Bey:** İstersen `events` zaman çizelgisinden “kim ne zaman ne yaptı”yı gösterir (teknik slayt).  
- **Ahmet Usta:** Aktif görev listesinden iş düşer; yük dengeleme kuralları (ör. max aktif görev) işletmeyi korur.

---

## Tek cümlelik özet (kapak veya son slayt)

> **Esra Hanım** talebi açar, **Arda Bey** Ahmet Usta’ya atar, **Ahmet** sahada durumu günceller — hepsi tek uygulamada, kayıt silinmez.

---

## Demo sırası (oturum değiştirme)

1. `talepacan@firma.com` → talep oluştur → çıkış  
2. `yonetici@firma.com` → talebi bul → Ahmet Usta’ya ata → çıkış  
3. `saha@firma.com` → görevi aç → Yolda → İşlemde → (isteğe bağlı Beklemede) → Tamamlandı  

İstersen bu metni `slayt-hazirlik-rehberi.md` içine “Senaryo” başlığıyla linkleyebilirsin; şimdilik ayrı dosya: **`docs/senaryo.md`**.
