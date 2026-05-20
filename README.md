# Akilli Ariza ve Saha Operasyon Platformu

Cok rollu (Talep Acan / Yonetici / Saha Personeli) ariza yonetim MVP'si. Clomosy
TRObject ile yazilan istemci, Firebase Realtime Database (RTDB) uzerinden REST
API ile dogrudan haberlesir; Cloud Functions katmani YOKTUR.

> Bu yapi Clomosy'nin resmi `Cloud Technology` dokumantasyonundaki
> Firebase RTDB ornegini birebir takip eder.

---

## Mimari

```
+---------------------------------------------+
| Clomosy istemci (.tro)                      |
|                                             |
|  MainCode --> uLogin --> uTalepAcma         |
|                       \-> uYoneticiAtama    |
|                       \-> uSahaPersoneli    |
|                                             |
|  TclRest (senkron) ile dogrudan REST cagri  |
+---------------------------------------------+
                |
                | HTTPS (idToken)
                v
+---------------------------------------------+
| Firebase                                    |
|  - Authentication (Email/Password)          |
|  - Realtime Database (RTDB)                 |
|    - users/<uid>: {email, adSoyad, rol, ...}|
|    - tickets/<key>: {ticketNo, baslik, ...} |
|      + events/<eId>: {fromStatus, ...}      |
|  - Security Rules (rol bazli yetki)         |
+---------------------------------------------+
```

**Onemli**: Cloud Functions, Firestore, Node.js backend YOK. Tum mantik
RTDB security rules + istemci kodu ile yurutulur.

---

## Roller

| Rol           | Yapabildigi                                                |
|---------------|------------------------------------------------------------|
| TalepAcan     | Kendi talebini olustur + kendi taleplerini listele         |
| Yonetici      | Tum acik talepleri gor + sahsa personele ata               |
| SahaPersoneli | Kendine atanan gorevleri gor + durum gecislerini guncelle  |

---

## Durum Makinesi

```
Acik -> Atandi -> Yolda -> Islemde -> Tamamlandi
                                  \-> Beklemede -> Islemde
```

Geri donus ve atlamalar reddedilir (istemci kontrol eder, rules de validate
edebilir).

---

## SLA (Service Level Agreement)

| Oncelik | Sure |
|---------|------|
| Kritik  | 2h   |
| Yuksek  | 8h   |
| Orta    | 24h  |
| Dusuk   | 72h  |

`slaDeadline` istemcide hesaplanir ve talep kaydedilirken yazilir.

---

## Diger Kurallar

- Bir SahaPersoneli'nin **maksimum 5** aktif gorevi (Atandi/Yolda/Islemde)
  olabilir. Yonetici atama yapmadan once kontrol eder.
- Her durum gecisi `tickets/<id>/events/<auto>` altinda kaydedilir
  (fromStatus, toStatus, changedBy, changedAt, note).

---

## Klasor Yapisi

```
akilli-ariza-saha-operasyon/
├── README.md                          # Bu dosya
├── firebase.json                      # Firebase CLI: sadece RTDB
├── .firebaserc                        # Proje ID
├── firebase/
│   ├── database.rules.json            # RTDB security rules + indeksler
│   ├── seed.md                        # Ilk kullanicilarin nasil yaratilacagi
│   └── _functions-eski/               # Onceki Cloud Functions surumu (arsiv)
├── app/
│   ├── MainCode.tro                   # Boot + config
│   ├── uLogin.tro                     # signInWithPassword + profil okuma
│   ├── uTalepAcma.tro                 # TalepAcan ekrani
│   ├── uYoneticiAtama.tro             # Yonetici ekrani
│   ├── uSahaPersoneli.tro             # SahaPersoneli ekrani
│   └── lib/
│       ├── uRtdb.tro                  # RTDB CRUD wrapper (snippet referans)
│       └── uAuth.tro                  # Auth wrapper (snippet referans)
└── docs/
    ├── veri-modeli.md
    ├── kurulum.md
    └── mvp-acceptance-checklist.md
```

`app/lib/` altindaki dosyalar Clomosy IDE'ye yuklenmez; sadece kod
duplikasyonunu azaltmak icin tekrar tekrar her birime kopyalanmak uzere
referans olarak tutulur.

---

## REST API'ler (Dogrudan RTDB)

Tum cagrilar `?auth=<idToken>` query parametresi ile yetkilendirilir.

### Auth (Identity Toolkit)

```
POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=<API_KEY>
Body: {"email":"...","password":"...","returnSecureToken":true}
Resp: {"idToken":"...","localId":"...","email":"...","refreshToken":"...",...}
```

### Kullanicilar

```
GET    /users/<uid>.json?auth=<token>
GET    /users.json?auth=<token>&orderBy="rol"&equalTo="SahaPersoneli"
```

### Talepler

```
POST   /tickets.json?auth=<token>
       Body: {"ticketNo":"...","baslik":"...","durum":"Acik",...}
       Resp: {"name":"<auto-key>"}

GET    /tickets/<key>.json?auth=<token>
GET    /tickets.json?auth=<token>&orderBy="durum"&equalTo="Acik"
GET    /tickets.json?auth=<token>&orderBy="talepAcanId"&equalTo="<uid>"
GET    /tickets.json?auth=<token>&orderBy="atananPersonelId"&equalTo="<uid>"

PATCH  /tickets/<key>.json?auth=<token>
       Body: {"durum":"Atandi","atananPersonelId":"...","updatedAt":"..."}

POST   /tickets/<key>/events.json?auth=<token>
       Body: {"fromStatus":"Acik","toStatus":"Atandi","changedBy":"...","changedAt":"...","note":"..."}
```

---

## Hizli Baslangic

1. **Firebase projesini hazirla** (Auth + RTDB) - bkz. `docs/kurulum.md`
2. **Security rules deploy**:
   ```bash
   firebase login
   firebase use <PROJECT_ID>
   firebase deploy --only database
   ```
3. **Ilk kullanicilari olustur** - bkz. `firebase/seed.md`
4. **Clomosy IDE'de yeni proje** ac, `app/` icindeki 5 `.tro` dosyasini yukle
5. **MainCode.tro**'da `DB_URL_DEFAULT` ve `API_KEY_DEFAULT` sabitlerini
   kendi projenle degistir
6. Calistir, `uLogin` ekranindan giris yap.

---

## Detayli Dokumantasyon

- [docs/sunum-soru-cevap-rehberi.md](docs/sunum-soru-cevap-rehberi.md) - Juri / isveren "neyi nasil yaptin" soru-cevap hazirligi
- [docs/teknolojiler.md](docs/teknolojiler.md) - Kullanilan tum teknolojiler ve bilincli olarak kullanilmayanlar
- [docs/veri-modeli.md](docs/veri-modeli.md) - RTDB JSON agaci + security rules
- [docs/kurulum.md](docs/kurulum.md) - Firebase Console adim adim setup
- [docs/mvp-acceptance-checklist.md](docs/mvp-acceptance-checklist.md) - Manual test senaryolari
- [firebase/seed.md](firebase/seed.md) - Ilk 3 kullanici (TalepAcan, Yonetici, SahaPersoneli) olusturma

---

## Eski Surumler

- `firebase/_functions-eski/` : Onceki Cloud Functions + Firestore versiyonu.
  Calismaz, sadece referans amaclidir.
- `app-eski/` ve `app-yerel-eski/` : Onceki istemci denemeleri (Pascal-unit
  stili Firebase istemcisi ve yerel SQLite stili).
