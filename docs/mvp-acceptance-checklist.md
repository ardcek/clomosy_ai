# MVP Acceptance Checklist

Bu liste manuel test senaryolarini icerir. Tum maddeler [x] olduktan sonra
MVP "kabul edilebilir" sayilir.

## Hazirlik

- [ ] Firebase projesi olusturuldu (Auth + RTDB)
- [ ] Realtime Database `europe-west1` bolgesinde
- [ ] Security rules deploy edildi (`firebase deploy --only database`)
- [ ] 3 test kullanicisi Auth + `users` dugumunde olusturuldu
- [ ] `MainCode.tro` icindeki `DB_URL_DEFAULT` ve `API_KEY_DEFAULT`
      kendi degerlerle guncellendi
- [ ] 5 `.tro` birim Clomosy IDE'ye yuklendi
- [ ] Proje calistirildi, splash + uLogin acildi

---

## Senaryo 1 - Boot + Splash

- [ ] Uygulama acilirken splash ekran 1-2 saniye gosterildi
- [ ] Sonra uLogin ekranina otomatik gecti
- [ ] Hata mesaji yok

## Senaryo 2 - Login (Basarili)

- [ ] `talepacan@firma.com / talep123` ile giris yapildi
- [ ] uTalepAcma ekrani acildi
- [ ] Header'daki kullanici adi `AdSoyad` alanindan geliyor

## Senaryo 3 - Login (Hatali)

- [ ] Yanlis sifre denendi -> kirmizi hata mesaji gosterildi
- [ ] Bos email/sifre -> "zorunlu" mesaji gosterildi
- [ ] Kullanici Firebase Auth'a kayitli ama `users/<uid>` dugumu yok
  -> "Profil bulunamadi" mesaji gosterildi

## Senaryo 4 - Talep Olusturma (TalepAcan)

- [ ] Baslik, konum, oncelik dolduruldu -> "Talep Olustur" tiklandi
- [ ] Yesil basari mesaji gosterildi
- [ ] Talep listesi otomatik yenilendi
- [ ] Yeni talep listede gozukuyor (`ARZ-... - Baslik (Acik)`)
- [ ] Bos baslik/konum -> hata mesaji
- [ ] Bos oncelik -> hata mesaji
- [ ] Firebase Console'da `tickets/<key>` dugumu olustu
- [ ] `tickets/<key>/events/<id>` altinda ilk event ("Acik") gozukuyor

## Senaryo 5 - Listemi Yenile

- [ ] "Listemi Yenile" tiklandi -> sadece bu kullanicinin talepleri gosteriliyor
- [ ] Baska kullanicinin talepleri gosterilmiyor

## Senaryo 6 - Yonetici - Acik Talepleri Listeleme

- [ ] Cikis -> `yonetici@firma.com / yonetici123` ile giris
- [ ] uYoneticiAtama ekrani acildi
- [ ] Sol panelde tum acik talepler listeleniyor
- [ ] Sag panelde tum saha personeli listeleniyor

## Senaryo 7 - Atama

- [ ] Bir talep secildi (sol)
- [ ] Bir personel secildi (sag)
- [ ] Opsiyonel not yazildi
- [ ] "Ata" tiklandi
- [ ] Basari mesaji gosterildi
- [ ] Acik talepler listesi yenilendi, atanan talep cikti
- [ ] Firebase Console'da `tickets/<key>` durumu "Atandi" oldu, `atananPersonelId` doldu
- [ ] `events` altina yeni event ("Acik -> Atandi") eklendi

## Senaryo 8 - Atama Limiti (Aktif Gorev = 5)

- [ ] Bir personele 5 talep zaten Atandi/Yolda/Islemde durumundayken
      6. atama denendi
- [ ] Hata mesaji: "Bu personelin 5 aktif gorevi var, atama yapilamaz"
- [ ] Atama yapilmadi (RTDB'de degisiklik yok)

## Senaryo 9 - SahaPersoneli - Gorev Listesi

- [ ] Cikis -> `saha@firma.com / saha123` ile giris
- [ ] uSahaPersoneli ekrani acildi
- [ ] Kendisine atanmis gorevler listeleniyor
- [ ] Tamamlanmis gorevler listede gozukmuyor

## Senaryo 10 - Durum Gecisleri (Gecerli)

- [ ] Atandi durumundaki bir gorev secildi -> "Yola Cik" tiklandi
- [ ] Basari mesaji, liste yenilendi, durum "Yolda"
- [ ] "Islemde" tiklandi -> durum "Islemde"
- [ ] "Beklet" tiklandi -> durum "Beklemede"
- [ ] "Islemde" tiklandi -> durum "Islemde"
- [ ] "Tamamla" tiklandi -> durum "Tamamlandi"
- [ ] Gorev listeden cikti
- [ ] Her gecis icin `events` altinda yeni kayit olustu (fromStatus, toStatus, note)

## Senaryo 11 - Durum Gecisleri (Gecersiz)

- [ ] "Atandi" durumundayken direkt "Tamamla" denendi
- [ ] Hata mesaji: "Atandi -> Tamamlandi gecisi gecerli degil"
- [ ] Durum degismedi

## Senaryo 12 - Cikis

- [ ] Herhangi bir ekrandan "Cikis" tiklandi
- [ ] uLogin ekranina dondu
- [ ] `Token` ve `Rol` AppGetVariable bos donuyor
- [ ] Yeni login ile farkli rol denenebiliyor

## Senaryo 13 - SLA Hesaplama

- [ ] Kritik oncelikli talep olusturuldu
  - [ ] `slaDeadline` = createdAt + 2h
- [ ] Yuksek oncelikli talep
  - [ ] +8h
- [ ] Orta
  - [ ] +24h
- [ ] Dusuk
  - [ ] +72h

(Console'da RTDB > Data sekmesinden gozle dogrulanir.)

## Senaryo 14 - Yetki Sertligi

- [ ] TalepAcan kullanicisi `tickets?orderBy="durum"&equalTo="Acik"` cagrisi
      yapsa bile bunu app'in icinde yapamaz (uYoneticiAtama ekrani acilmaz)
- [ ] Direkt RTDB rules kontrolu: TalepAcan kendi olmayan ticket'i PATCH
      etmeye calisirsa `PERMISSION_DENIED` doner

---

## Bilinen Sinirlar

- Atama limiti **istemcide** kontrol edilir (race condition mumkun)
- Read kurali tum auth kullaniciya acik (filtre istemcide)
- Cevrimdisi durum yok
- Push notification yok
- Dosya/fotograf eklenmesi yok

Bunlar gelecek faz icin notlardir.
