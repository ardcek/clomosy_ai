# Kurulum

Bu rehber projeyi sifirdan ayaga kaldirmak icin gerekli **Firebase Console**
adimlarini ve **Clomosy IDE** entegrasyonunu acklamaktadir. Cloud Functions
kurulumu YOK; sadece RTDB + Auth.

---

## 0. On Kosullar

- Bir Google hesabi
- Firebase CLI (yalnizca rules deploy'u icin; opsiyonel)
  ```bash
  npm install -g firebase-tools
  firebase --version   # 13.x veya ustu
  ```
- Clomosy IDE hesabi (cms.clomosy.com)

---

## 1. Firebase Projesi Olustur

1. [Firebase Console](https://console.firebase.google.com) > "Add project"
2. Ad: `akilli-ariza-mvp` (veya tercih)
3. Google Analytics: KAPALI (MVP icin gerek yok)
4. Olustur.

---

## 2. Authentication'i Etkinlestir

1. Sol menude **Authentication** > **Get started**
2. "Sign-in method" sekmesinden **Email/Password** -> **Enable** -> Save.

---

## 3. Realtime Database Olustur

1. Sol menude **Realtime Database** > **Create Database**
2. Lokasyon: **europe-west1** (Avrupa)
3. Kurallar: **Start in locked mode**
4. Create.

Aciklikta uretilen URL'i not al:
```
https://<PROJECT_ID>-default-rtdb.europe-west1.firebasedatabase.app
```

---

## 4. Web API Key'i Al

1. Firebase Console > **Project Settings** (cark simgesi)
2. "General" sekmesi
3. "Web API Key" alanini kopyala (uzun bir alfasayisal dizi)
   ornek: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 5. Security Rules'i Deploy Et

Iki yontemden biri:

### A) Firebase CLI ile (onerilen)

```bash
cd akilli-ariza-saha-operasyon
firebase login
firebase use <PROJECT_ID>
firebase deploy --only database
```

Cikti `+ Deploy complete!` olmali.

### B) Console'dan manuel

1. Firebase Console > **Realtime Database** > **Rules** sekmesi
2. `firebase/database.rules.json` icerigini kopyala-yapistir
3. **Publish**

---

## 6. Ilk Kullanicilari Olustur

Detayli bilgi: `firebase/seed.md`

Ozet: Console > **Authentication** > **Users** > **Add user** ile uc kullanici:

| Email                  | Sifre        | Rol           |
|------------------------|--------------|---------------|
| yonetici@firma.com     | yonetici123  | Yonetici      |
| talepacan@firma.com    | talep123     | TalepAcan     |
| saha@firma.com         | saha123      | SahaPersoneli |

Sonra Console > **Realtime Database** > **Data** sekmesinden veya ham JSON
import ile:

```json
{
  "users": {
    "<yonetici-uid>": {
      "email": "yonetici@firma.com",
      "adSoyad": "Yonetici Test",
      "rol": "Yonetici",
      "aktif": true,
      "createdAt": "2026-01-01T00:00:00Z"
    },
    "<talepacan-uid>": {
      "email": "talepacan@firma.com",
      "adSoyad": "Talep Acan Test",
      "rol": "TalepAcan",
      "aktif": true,
      "createdAt": "2026-01-01T00:00:00Z"
    },
    "<saha-uid>": {
      "email": "saha@firma.com",
      "adSoyad": "Saha Test",
      "rol": "SahaPersoneli",
      "aktif": true,
      "createdAt": "2026-01-01T00:00:00Z"
    }
  }
}
```

UID'leri Authentication > Users sayfasindan kopyalayabilirsin.

---

## 7. Clomosy IDE - Proje Olustur

1. https://cms.clomosy.com > Yeni Proje
2. Ad: `Akilli Ariza & Saha Operasyon`
3. Bos proje ile basla

---

## 8. Birimleri (Units) Yukle

5 `.tro` dosyayi sirasiyla yukle:

| Sira | Dosya                 | Aciklama                |
|------|-----------------------|-------------------------|
| 1    | `MainCode.tro`        | Boot birimi (zorunlu)   |
| 2    | `uLogin.tro`          | Giris ekrani            |
| 3    | `uTalepAcma.tro`      | TalepAcan ekrani        |
| 4    | `uYoneticiAtama.tro`  | Yonetici ekrani         |
| 5    | `uSahaPersoneli.tro`  | SahaPersoneli ekrani    |

> `app/lib/uRtdb.tro` ve `app/lib/uAuth.tro` IDE'ye YUKLENMEZ; sadece
> referans/snippet'tir.

---

## 9. Firebase Config'i .tro Icine Yaz

`MainCode.tro` dosyasinin tepesindeki iki sabit:

```tro
const
  DB_URL_DEFAULT  = 'https://YOUR-PROJECT-default-rtdb.europe-west1.firebasedatabase.app';
  API_KEY_DEFAULT = 'PUT-YOUR-FIREBASE-WEB-API-KEY-HERE';
```

Kendi degerlerinle degistir:

- `DB_URL_DEFAULT` = adim 3'te aldigin URL
- `API_KEY_DEFAULT` = adim 4'te kopyaladigin Web API Key

> Alternatif: Clomosy Proje Parametreleri'nden `DbUrl` ve `ApiKey`
> anahtarlariyla override edebilirsiniz; bu durumda dosyayi degistirmek
> zorunda kalmazsiniz.

---

## 10. Calistir ve Smoke Test

1. IDE'de `MainCode` birimini secip Run.
2. Splash ekrani sonrasi `uLogin` acilir.
3. `talepacan@firma.com / talep123` ile giris yap.
4. `Talep Olustur` ekraninda yeni bir talep gir.
5. Cikis yap. `yonetici@firma.com` ile giris yap.
6. Acik talebi gor, `saha@firma.com` kullanicisina ata.
7. Cikis yap. `saha@firma.com` ile giris yap.
8. Gorev listende yeni gorevi gor, "Yola Cik" -> "Islemde" -> "Tamamla".

Adimlarda hata olursa:

| Sorun                          | Sebep                                            |
|--------------------------------|---------------------------------------------------|
| `PERMISSION_DENIED` (read)     | Rules deploy edilmemis veya kullanici giris yapmamis|
| `Profil bulunamadi`            | `users/<uid>` RTDB dugumu yok                      |
| `INVALID_PASSWORD`             | Sifre yanlis                                        |
| `EMAIL_NOT_FOUND`              | Auth'da kullanici yok                              |
| `Token alinamadi`              | API Key yanlis veya Email/Password etkinlestirilmemis|

---

## 11. RTDB'de Veriyi Manuel Inceleme

Firebase Console > **Realtime Database** > **Data** sekmesinde JSON agacini
gercek zamanli izleyebilirsin. Bir talep olusturdugunda an'lik gozlemleyebilirsin.

---

## 12. Smoke Test (curl)

Authentication:
```bash
curl -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=<API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"email":"yonetici@firma.com","password":"yonetici123","returnSecureToken":true}'
```

Yanit icindeki `idToken`'i kopyala, sonra:

```bash
TOKEN="<idToken>"
DB="https://<PROJECT>-default-rtdb.europe-west1.firebasedatabase.app"

# Acik talepler
curl "$DB/tickets.json?auth=$TOKEN&orderBy=%22durum%22&equalTo=%22Acik%22"

# Yeni talep olustur
curl -X POST "$DB/tickets.json?auth=$TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ticketNo":"ARZ-TEST","baslik":"Test","durum":"Acik","oncelik":"Orta","konum":"Test","talepAcanId":"<uid>","atananPersonelId":"","createdAt":"2026-01-01T00:00:00Z","updatedAt":"2026-01-01T00:00:00Z","slaDeadline":"2026-01-02T00:00:00Z"}'
```

---

## 13. Production'a Hazirlama

- API Key + DB URL'i Clomosy Proje Parametreleri'nden yonet (kod dis)
- Rules sik istenirse `tickets` read kuralini per-record yap (performans icin
  ek "index" alanlari eklenebilir)
- HTTPS sertifikasi Firebase'in kendi alanlari icin otomatiktir
