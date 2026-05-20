# Slayt hazırlık rehberi — Akıllı Arıza & Saha Operasyon

Bu doküman, sunumunu yaparken **ne anlatacağını**, **hangi görseli alacağını** ve **teknik derinliği hangi slaytta vereceğini** tek yerde toplar. İşveren / yatırımcı / akademik jüri için tonu sen ayarlarsın; aşağıdaki metinleri doğrudan slayta veya konuşmacı notuna kopyalayabilirsin.

---

## 1. Proje nedir? (tek cümle)

**Çok rollü bir arıza ve saha iş talebi yönetimi uygulaması:** talebi açan kişi kaydı oluşturur; yönetici uygun saha personeline atar; saha personeli telefondan durumu günceller. Veri **Firebase** üzerinde canlı tutulur; istemci **Clomosy** ile **TRObject** dilinde yazılmıştır; **sunucuda ayrı bir Node/API katmanı yoktur** (REST ile doğrudan RTDB + kimlik).

---

## 2. Ne işe yarar? (problem → çözüm)

| Zorluk | Uygulamanın cevabı |
|--------|---------------------|
| Telefon / WhatsApp ile talep kaybolur, “kim ne dedi?” belirsizdir | Her talep numaralı kayıt (`ticketNo`), konum, öncelik ve açıklama ile RTDB’de durur |
| Patron veya koordinatör “ekip nerede, iş bitti mi?” diye sürekli arar | Saha personeli durumu (Yolda, İşlemde, Beklemede, Tamamlandı) günceller; liste anlık yenilenebilir |
| Öncelik ve süre sözlü kalır | Öncelik seçilir; istemcide **SLA bitiş zamanı** hesaplanıp kayda yazılır |
| Sonradan hesap verilemez | Her durum değişikliği `events` altında **kim, ne zaman, notla** kaydedilir |

---

## 3. Kimlere hitap eder? (hedef kitle ve sektör örnekleri)

**Doğrudan kullanıcı rolleri**

- **İç müşteri / talep açan:** Arızayı veya işi bildiren birim (IT, tesis, güvenlik, üretim hattı vb.)
- **Koordinatör / yönetici:** Talepleri triyaj edip doğru kişiye atayan rol
- **Saha personeli:** Fiziksel müdahale veya yerinde kontrol yapan ekip

**Sektör örnekleri (slaytta “örnek senaryo” diye ver)**

- Tesis yönetimi: asansör, HVAC, elektrik arızası
- Kurumsal IT: sunucu odası, şube ağı, donanım
- Saha bakım: enerji, telekom, endüstriyel ekipman
- Güvenlik / altyapı: kamera, erişim, periyodik kontrol işleri

**İşveren (senin anlattığın kişi) için mesaj**

> “Sürekli adamları telefonla takip etmek yerine: talep sistemde açılıyor, öncelik ve konum yazılıyor, yönetici atıyor, saha kendi ekranından durumu güncelliyor. Geçmiş olaylar kayıtlı.”

---

## 4. Hikâye anlatımı (slayt için akış — 60 saniye)

1. **Müşteri / talep açan:** “Bina A sunucu odasında fan anormal, kritik” — uygulamada talep açar; sistem talebe numara ve SLA süresi verir.  
2. **Yönetici:** Açık talepleri görür; listeden veya aramayla bulur; uygun **saha personelini** seçer ve atar (personelin aşırı yüklenmesine karşı iş kuralları vardır).  
3. **Saha personeli:** Telefonda “bana atanan görevler” listesini görür; **Yola çıktım → İşlemde → Tamamlandı** (veya beklemede) gibi izin verilen geçişlerle ilerletir; gerekirse not düşer.  
4. **İşveren / denetim:** İster talep bazında ister olay zaman çizelgesi (`events`) ile “ne oldu, kim yaptı” görür.

Bu döngüyü bir slaytta **şema (ok diyagramı)** ile göstermek çok işe yarar.

---

## 5. Roller ve ekranlar (hangi .tro dosyası ne?)

| Rol (RTDB `users.rol`) | Birim (ekran) | Kullanıcı ne yapar? |
|------------------------|---------------|----------------------|
| (Giriş öncesi) | `MainCode.tro` | Uygulama açılır, yapılandırma, `uLogin`’e geçiş |
| Herkes | `uLogin.tro` | E-posta/şifre, rolüne göre ilgili modüle yönlendirme |
| TalepAcan | `uTalepAcma.tro` | Yeni talep formu; kendi taleplerini listeleme, yenileme, arama |
| Yonetici | `uYoneticiAtama.tro` | Açık talepler; personel seçimi; atama; arama |
| SahaPersoneli | `uSahaPersoneli.tro` | Atanan görevler; durum butonları; not; yenileme |

**Sunum ipucu:** Bir slaytta “tek kod tabanı, üç rol, üç ekran” de.

---

## 6. Durum makinesi (tek slayt)

```
Acik → Atandi → Yolda → Islemde → Tamamlandi
                         \-> Beklemede -> Islemde
```

- Geçişler **iş kurallarına** bağlıdır (ör. “Atandı”dan hem “Yolda” hem “İşlemde”ye gidilebilir gibi senaryolar kodda tanımlıdır).  
- **Tamamlanan** talepler saha listesinde gösterilmez (filtre).

---

## 7. SLA (öncelik → süre) — tek tablo slaytı

| Öncelik | Süre (istemcide hesaplanan SLA) |
|---------|----------------------------------|
| Kritik  | 2 saat |
| Yüksek  | 8 saat |
| Orta    | 24 saat |
| Düşük   | 72 saat |

`slaDeadline` alanı talep oluşturulurken kayda yazılır.

---

## 8. İş kuralı örneği (işvereni etkileyen detay)

- Bir saha personelinin aynı anda **en fazla 5 aktif** görevi (Atandı / Yolda / İşlemde) olabilir; yönetici atama yapmadan önce kontrol edilir.  
- Her durum değişikliği `tickets/<id>/events/<id>` altında **fromStatus, toStatus, changedBy, changedAt, note** ile loglanır.

---

## 9. Teknik mimari (derinlik isteyen slayt / ek)

```
Clomosy istemci (.tro)
  TclRest → HTTPS
    Firebase Authentication (e-posta/şifre, idToken)
    Realtime Database (REST: okuma/yazma/sorgu)
  Cloud Functions YOK — kurallar RTDB rules üzerinden
```

- **Veri:** `users/<uid>`, `tickets/<key>`, `tickets/<key>/events/<eventId>`  
- **Sorgu örnekleri:** açık talepler `durum=Acik`; talep açanın listesi `talepAcanId`; sahanın listesi `atananPersonelId`  
- Ayrıntı: `docs/veri-modeli.md`, `README.md`, `firebase/database.rules.json`

---

## 10. Görsel / ekran görüntüsü checklist (slaytta “olsa iyi” dediğin her şey)

Uygulamayı emülatör veya gerçek cihazda açıp **tam ekran veya telefon çerçevesi** ile yakala. Her görsele kısa başlık koy.

| # | Slayt konusu | Ne yakala? |
|---|----------------|-------------|
| 1 | Kapak | Logo yoksa proje adı + “Clomosy + Firebase” alt başlık |
| 2 | Problem | Ofis fotoğrafı (stok) veya madde işaretli “kaos” — zorunlu değil |
| 3 | Çözüm özeti | Basit kutu diyagram: Talep → Atama → Saha |
| 4 | Giriş | `uLogin` — e-posta/şifre alanları, “Giriş Yap”, üst başlık |
| 5 | Rol ayrımı | İsteğe bağlı: üç küçük ikon + üç rol adı |
| 6 | Talep açan | `uTalepAcma` — form dolu + “Talep Oluştur” |
| 7 | Talep listesi | `uTalepAcma` — “Taleplerim”, arama çubuğu, **kartlarda metin görünür** halde |
| 8 | Yönetici | `uYoneticiAtama` — açık talep listesi + personel seçimi / Ata |
| 9 | Saha | `uSahaPersoneli` — atanmış görev + durum butonları |
| 10 | Durum güncelleme | Aynı ekranda farklı durum veya not alanı vurgulu |
| 11 | Mimari | README’deki ASCII kutu veya Mermaid ile çizilmiş şema |
| 12 | Veri ağacı | `veri-modeli.md`’den sadeleştirilmiş JSON örneği (1 slayt) |
| 13 | Güvenlik / demo | Demo hesap tablosu (`docs/proje-teknik-raporu-akilli-ariza.md` ile aynı) — **canlıda şifre slaytına koyma** tercih edilebilir |
| 14 | Sonuç | “MVP tamam”, “genişletilebilir alanlar” (bildirim, harita, rapor PDF…) |

**Demo girişler (sunum provası için)** — raporla uyumlu:

- Yönetici: `yonetici@firma.com` / `yonetici123`  
- Talep açan: `talepacan@firma.com` / `talep123`  
- Saha: `saha@firma.com` / `saha123`

---

## 11. Önerilen slayt sırası (örnek 14–18 slayt)

1. Başlık + isimler + tarih  
2. Problem (manuel takip, kayıp bilgi)  
3. Çözüm (tek cümle + diyagram)  
4. Hedef kitle / sektörler  
5. Üç rol tanımı  
6. Senaryo hikâyesi (4 madde)  
7. Ekran: Giriş  
8. Ekran: Talep oluşturma  
9. Ekran: Talep listesi (talep açan)  
10. Ekran: Yönetici atama  
11. Ekran: Saha + durumlar  
12. Durum makinesi (şema)  
13. SLA tablosu  
14. Teknik mimari (isteğe bağlı)  
15. Veri modeli / denetim izi (`events`)  
16. Sonuç + teşekkür + sorular  

Akademik/jüri için **14–15’te** “Clomosy TRObject, REST, RTDB rules, Functions yok” cümlesini net söyle.

---

## 12. Konuşmacı notu örnekleri (kopyala-yapıştır)

**Giriş (20 sn):**  
“Bu proje, arıza ve saha iş taleplerinin uygulama üzerinden açılması, yöneticinin personele ataması ve sahadaki çalışanın durumu güncellemesiyle uçtan uca izlenmesini sağlıyor. Backend olarak Firebase Realtime Database kullanıyoruz; istemci Clomosy’de TRObject ile geliştirildi.”

**İş değeri (20 sn):**  
“Talep açan müşteri veya iç birim önceliği ve konumuyla kayıt bırakıyor; SLA süresi otomatik hesaplanıyor. Yönetici doğru kişiyi atıyor; saha personeli telefondan durumu ilerletiyor. Her adım olay kaydına düşüyor.”

**Teknik (15 sn):**  
“Cloud Functions kullanmıyoruz; istemci doğrudan REST ile RTDB’ye yazıyor, yetkiler security rules ile sınırlı. Bu, MVP için hızlı ve şeffaf bir mimari.”

---

## 13. “Daha iyi olsaydı” slaytı (dürüst roadmap — güven kazanır)

- Push bildirimi (yeni talep / atama)  
- Harita üzerinde konum  
- Ek dosya / fotoğraf ekleme  
- Yönetici dashboard (grafik, ortalama çözüm süresi)  
- Çoklu firma (tenant) veya LDAP  
- Çevrimdışı senkron  

---

## 14. Dosya referansları (sunumdan sonra soru gelirse)

| Konu | Dosya |
|------|--------|
| Genel mimari | `README.md` |
| Hikâye senaryosu (patron / talep açan / saha) | `docs/senaryo.md` |
| Kullanılan teknolojiler (stack özeti) | `docs/teknolojiler.md` |
| Sunum / jüri soru-cevap hazırlığı | `docs/sunum-soru-cevap-rehberi.md` |
| Veri şeması | `docs/veri-modeli.md` |
| Kurulum | `docs/kurulum.md` |
| MVP kontrol listesi | `docs/mvp-acceptance-checklist.md` |
| Teknik rapor (Word üretimi) | `docs/build_rapor_docx.py` → `proje-teknik-raporu-akilli-ariza.docx` |
| Giriş + rol yönlendirme | `app/uLogin.tro` |
| Modüller | `uTalepAcma.tro`, `uYoneticiAtama.tro`, `uSahaPersoneli.tro` |
| Boot | `app/MainCode.tro` |

---

## 15. Telif / akademik not

Proje **Aliker / Clomosy** ekosisteminde TRObject ile geliştirilmiştir; Firebase markası sunumda doğru yazılmalıdır. Hazırlayan isimleri ve aktivasyon kodu için teknik rapor dosyasına bakabilirsin.

---

**Özet:** Slaytta önce **hikâye ve iş değeri**, sonra **üç rol ve ekran görüntüleri**, istenirse **durum + SLA**, en sonda **teknik mimari ve veri modeli** — bu sıra hem işvereni hem jüriyi doyurur.
