# Seed - Ilk Kullanicilari Olusturma

3 farkli role sahip test kullanicilarini hem **Firebase Auth**'a hem de
**RTDB `users/<uid>` dugumune** eklememiz gerekir. Bu rehber iki yol gosterir:

## Yontem 1 - Firebase Console (Hizli, Manuel)

### Adim 1: Auth'a kullanicilari ekle

Console > **Authentication** > **Users** > **Add user**:

| Email                  | Sifre        |
|------------------------|--------------|
| yonetici@firma.com     | yonetici123  |
| talepacan@firma.com    | talep123     |
| saha@firma.com         | saha123      |

Her ekleme sonrasi acilan satirdaki **User UID**'yi kopyala.

### Adim 2: RTDB'ye users dugumunu yaz

Console > **Realtime Database** > **Data** sekmesi
- Sag yukaridaki 3 nokta menusunden **Import JSON** sec
- Asagidaki JSON'u uzerinde edit yapip yukle (UID'leri kendi kopyaladiklarinla
  degistir):

```json
{
  "users": {
    "REPLACE-YONETICI-UID": {
      "email":   "yonetici@firma.com",
      "adSoyad": "Yonetici Test",
      "rol":     "Yonetici",
      "aktif":   true,
      "createdAt": "2026-01-01T00:00:00Z"
    },
    "REPLACE-TALEPACAN-UID": {
      "email":   "talepacan@firma.com",
      "adSoyad": "Talep Acan Test",
      "rol":     "TalepAcan",
      "aktif":   true,
      "createdAt": "2026-01-01T00:00:00Z"
    },
    "REPLACE-SAHA-UID": {
      "email":   "saha@firma.com",
      "adSoyad": "Ahmet Saha",
      "rol":     "SahaPersoneli",
      "aktif":   true,
      "createdAt": "2026-01-01T00:00:00Z"
    }
  }
}
```

> NOT: Import JSON mevcut tum data'yi **siler**, dikkat. Eger mevcut veri varsa
> elle Data sekmesinden `users/<UID>` altina tek tek ekle.

### Adim 3: Dogrulama

Console > **Realtime Database** > **Data**:
```
users
  REPLACE-YONETICI-UID
    email: yonetici@firma.com
    rol: Yonetici
    ...
```

---

## Yontem 2 - curl ile (Otomasyon)

### Adim 1: signUp ile Auth + uid uret

```bash
API_KEY="<FIREBASE_WEB_API_KEY>"
DB="https://<PROJECT>-default-rtdb.europe-west1.firebasedatabase.app"

for ROW in \
  "yonetici@firma.com|yonetici123|Yonetici Test|Yonetici" \
  "talepacan@firma.com|talep123|Talep Acan Test|TalepAcan" \
  "saha@firma.com|saha123|Ahmet Saha|SahaPersoneli"
do
  EMAIL=$(echo $ROW | cut -d'|' -f1)
  PASS=$(echo $ROW | cut -d'|' -f2)
  NAME=$(echo $ROW | cut -d'|' -f3)
  ROL=$(echo $ROW | cut -d'|' -f4)

  echo "=== Olusturuluyor: $EMAIL ($ROL) ==="
  RESP=$(curl -s -X POST \
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\",\"returnSecureToken\":true}")

  UID=$(echo $RESP | python3 -c "import sys,json;print(json.load(sys.stdin).get('localId',''))")
  TOKEN=$(echo $RESP | python3 -c "import sys,json;print(json.load(sys.stdin).get('idToken',''))")

  if [ -z "$UID" ]; then
    echo "HATA: $RESP"
    continue
  fi

  echo "UID: $UID"

  curl -s -X PUT "$DB/users/$UID.json?auth=$TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"adSoyad\":\"$NAME\",\"rol\":\"$ROL\",\"aktif\":true,\"createdAt\":\"2026-01-01T00:00:00Z\"}"

  echo ""
done
```

> Bu script `signUp` kullaniyor. Eger kullanici zaten varsa
> `EMAIL_EXISTS` hatasi doner; o satiri atlayip devam edebilirsiniz.

> Yonetici profilini yazarken `auth=$TOKEN` (yeni olusturulan kullanicinin
> kendi token'i) ile yaziyoruz. Security rules ilk seferinde kullaniciyi
> Yonetici olarak kabul etmedigi icin bu calismaz. Bu sebeple:
> **Ilk kullaniciyi Console ile olusturmak en pratik yoldur**, ondan sonra
> uygulamadan Yonetici giris yapip diger kullanicilari ekleyebilir.

---

## Yontem 3 - Yonetici Ekraninda Kullanici Yonetimi

MVP'de bu ekran yok. Gelecek faz icin: Yonetici'nin diger personeli ekleyip
silebilecegi bir `uKullaniciYonetimi.tro` eklenebilir. Bu ekran:

- Auth REST `accounts:signUp` ile Auth kullanicisi yaratir
- RTDB `users/<uid>` dugumunu yazar (rol, adSoyad, aktif=true)

---

## Sifre Sifirlama

Manuel: Console > Auth > kullaniciyi sec > "Reset password" gonder.

curl ile:
```bash
curl -X POST "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=$API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"requestType":"PASSWORD_RESET","email":"saha@firma.com"}'
```

Kullaniciya email gonderilir.

---

## Silme

Console > Auth > kullaniciyi sec > Delete user.
Ayrica RTDB `users/<uid>` dugumunu de silmeyi unutma.
