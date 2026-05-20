# Sunum / jüri / işveren — soru-cevap hazırlık rehberi

Bu dosya **“Neyi nasıl yaptın?”** sorularına cevap verebilmen için: kısa konuşma metinleri, mimari gerekçeler ve zor sorular. Kendi cümlelerinle ezberle; buradaki ifadeleri aynen okumak zorunda değilsin.

---

## A) 30 saniye — proje ne?

> “Akıllı Arıza ve Saha Operasyon: talep açan kişi uygulamada kayıt açıyor, yönetici açık talepleri görüp saha personeline atıyor, saha da telefondan durumu güncelliyor. İstemci Clomosy’de TRObject ile; veri ve giriş Firebase’de — Realtime Database ve Authentication. MVP’de arada özel sunucu veya Cloud Functions kullanmadık; istemci doğrudan REST ile konuşuyor, kurallar RTDB security rules’ta.”

---

## B) 2 dakika — ne yaptın (teslimatlar)?

1. **Beş TRObject birimi:** `MainCode` (açılış + Firebase URL/API key), `uLogin` (giriş + rol okuma + yönlendirme), `uTalepAcma` (talep oluşturma + kendi listesi + arama), `uYoneticiAtama` (açık talepler + personel + atama + 5 görev limiti), `uSahaPersoneli` (atanan işler + durum butonları + olay kaydı).
2. **Firebase tarafı:** Auth (e-posta/şifre), RTDB şeması (`users`, `tickets`, `events`), sorgu indeksleri, **security rules** deploy.
3. **İş kuralları:** Durum makinesi, SLA’nın istemcide hesaplanıp kayda yazılması, saha başına max 5 aktif görev, her durum değişiminde `events` altına log.
4. **Dokümantasyon:** Kurulum, veri modeli, MVP checklist, senaryo, teknoloji listesi, teknik rapor (Markdown + isteğe bağlı Word üretimi).

---

## C) “Nasıl yaptın?” — teknik akış (anlatım sırası)

1. **Kullanıcı giriş yapar** → `TclRest` ile Identity Toolkit’e `POST signInWithPassword` → `idToken` ve `localId` (uid) gelir → oturum bilgisi (token, uid, rol vb.) istemcide saklanır.
2. **Profil** → `GET users/<uid>.json?auth=token` → `rol` alanına göre `Clomosy.RunUnit` ile doğru ekrana geçilir.
3. **Talep listesi / atama / saha** → RTDB’ye `orderBy` + `equalTo` ile filtreli `GET`, yazma için `POST` / `PATCH`, olay için `POST .../events.json`.
4. **Yetki** → İstemci doğrulamasına ek olarak **database.rules.json** ile sunucu tarafı kısıt (rol + alan bazlı).

**Neden REST?** Clomosy tarafında hazır `TclRest` ile doğrudan HTTPS çağrısı yapılabiliyor; MVP için en az parça sayısı.

---

## D) Ekran ekran — “burada ne oluyor?”

| Ekran | Kısa cevap |
|-------|------------|
| **MainCode** | Splash; Firebase `DB_URL` ve `API_KEY` globalde; `uLogin`’e geçiş. |
| **uLogin** | Auth; profilden rol; yanlış şifrede kullanıcı dostu mesaj; role göre modül. |
| **uTalepAcma** | Form + `POST tickets`; listem `talepAcanId` sorgusu; yenile + arama; SLA alanı. |
| **uYoneticiAtama** | Açık talepler `durum=Acik`; personel `rol=SahaPersoneli`; `PATCH` + `events`; 5 görev kontrolü. |
| **uSahaPersoneli** | Bana atananlar `atananPersonelId`; durum butonları (geçiş kuralları); `PATCH` + `events`. |

---

## E) Zor sorular — ne sorabilirler, ne dersin?

### E1) “Arada backend yok; güvenlik nasıl?”

- **Kısa:** Kimlik Firebase Auth’ta; her RTDB isteği `idToken` ile. Yazma/okuma kuralları **RTDB Security Rules** ile sunucuda uygulanıyor; istemci sadece deneyim ve hızlı geri bildirim için kontrol ediyor.
- **Ekleme:** “Kötü niyetli istemci yazılsa bile rules yetkisiz yazmayı reddeder” (rules’ların gerçekten rol ve alanları doğruladığını `veri-modeli.md` / rules dosyasından gösterebilirsin).

### E2) “Neden Cloud Functions kullanmadın?”

- MVP’de **hız ve basitlik**: tek katman (istemci + Firebase). İş mantığının bir kısmı istemcide, kritik kısıtlar rules’ta.
- **Sonraki adım:** Bildirim, karmaşık raporlama, üçüncü parti entegrasyon için Functions düşünülebilir.

### E3) “SLA’yı neden sunucuda değil istemcide hesapladın?”

- Aynı MVP gerekçesi: tek kaynak doğruluk için ileride **Functions veya sunucu** taşınabilir; şu an öncelik seçilince deadline anında `slaDeadline` alanına yazılıyor ve kayıtla birlikte saklanıyor.

### E4) “Firestore yerine Realtime Database?”

- Hiyerarşik JSON ve **basit sorgu + gerçek zamanlı** senaryoya uygun; proje zaten RTDB REST kalıbına kilitli. Firestore farklı model ve SDK; bu stack’te RTDB tutarlı.

### E5) “Ölçeklenir mi?”

- RTDB ve Auth ölçeklenebilir servisler; sorgu desenleri `indexOn` ile tanımlı. Çok kullanıcıda **maliyet, sorgu karmaşıklığı ve rules karmaşıklığı** artar; büyüme planı: raporlama için ayrı katman veya veri dışa aktarma.

### E6) “Oturum bilgisi nerede?”

- `Clomosy.GlobalVariableString` içinde pipe-ayırımlı string; basit MVP. **Risk:** cihaz güvenliği; geliştirme olarak “ileride güvenli depolama / token yenileme politikası” denebilir.

### E7) “TRObject / Clomosy nedir, neden?”

- Düşük kodlu mobil masaüstü hedefi; iş mantığı ve UI aynı dilde; dağıtım Clomosy ekosistemine uygun. **Trade-off:** Dil ve IDE’ye bağımlılık.

### E8) “Test ettin mi?”

- `docs/mvp-acceptance-checklist.md` içinde senaryo senaryo elle test maddeleri var (giriş, talep, atama, limit, saha durumları).

---

## F) “Sen ne yaptın?” — takım sunumunda (bölüşüm)

- Rolünü net söyle: örn. “Ben **yönetici atama ekranı ve RTDB atama akışını** / **login ve Auth entegrasyonunu** / **üç ekranın responsive düzenini** üstlendim.”
- Takım adına konuşuyorsan: “Biz modülleri böldük, veri modeli ve rules’ları birlikte sabitledik, checklist ile doğruladık.”

---

## G) Demo sırası (2–3 dk canlı veya video)

1. Talep açan ile talep oluştur → listede gör.  
2. Çıkış → Yönetici → aynı talebi seç → personele ata → Console’da `Atandi` + `events`.  
3. Çıkış → Saha → görevi gör → bir durum ilerlet → `events`.  
4. (İsteğe bağlı) 6. atama ile limit mesajı.

---

## H) Dürüst “eksik / iyileştirme” (güven verir)

- Push bildirimi yok; harita yok; dosya/ek yok.  
- İstemci tarafı iş kuralları rules ile çiftlenmeli (rules’ı göster).  
- Raporlama ve yönetici dashboard ileri faz.

---

## I) Son soru: “Özetle en önemli teknik karar?”

> “İstemciyi Clomosy TRObject ile yazıp veriyi Firebase RTDB + Auth’a REST ile bağladık; ara backend koymadık, güvenliği RTDB rules ile sağladık. Böylece MVP’yi az parçayla canlıya yakın tuttuk.”

---

## J) Hızlı kelime hazırlığı (İngilizce sorulursa)

- *Low-code client, REST over HTTPS, role-based routing, state machine, audit trail (events), client-side SLA calculation, security rules as server-side enforcement, no Cloud Functions in MVP.*

---

**İlgili dosyalar:** `README.md`, `docs/teknolojiler.md`, `docs/veri-modeli.md`, `docs/senaryo.md`, `docs/mvp-acceptance-checklist.md`.
