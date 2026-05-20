# Veri Modeli - Firebase Realtime Database (RTDB)

## Genel Bakis

RTDB hiyerarsik JSON agacindan olusur. Bu projede iki ust dugum vardir:

```
{
  "users":   { ... },
  "tickets": { ... }
}
```

`tickets` icindeki her ticket'in altinda `events` alt-dugumu bulunur.

---

## JSON Agaci

```json
{
  "users": {
    "<uid>": {
      "email":   "talepacan@firma.com",
      "adSoyad": "Ali Talep",
      "rol":     "TalepAcan",
      "aktif":   true,
      "createdAt": "2026-01-15T10:00:00Z"
    }
  },

  "tickets": {
    "-Nxyz...": {
      "ticketNo":         "ARZ-260115140530",
      "baslik":           "Sunucu fan ariza",
      "aciklama":         "Bina A sunucu odasinda fan sesi anormal",
      "konum":            "Bina A / Sunucu Odasi 1",
      "oncelik":          "Kritik",
      "durum":            "Atandi",
      "talepAcanId":      "<uid-talepacan>",
      "atananPersonelId": "<uid-saha>",
      "createdAt":        "2026-01-15T14:05:30Z",
      "updatedAt":        "2026-01-15T14:30:00Z",
      "slaDeadline":      "2026-01-15T16:05:30Z",

      "events": {
        "-NevA...": {
          "fromStatus": "",
          "toStatus":   "Acik",
          "changedBy":  "<uid-talepacan>",
          "changedAt":  "2026-01-15T14:05:30Z",
          "note":       "Talep olusturuldu"
        },
        "-NevB...": {
          "fromStatus": "Acik",
          "toStatus":   "Atandi",
          "changedBy":  "<uid-yonetici>",
          "changedAt":  "2026-01-15T14:30:00Z",
          "note":       "Ahmet Saha'ya atandi"
        }
      }
    }
  }
}
```

---

## Alan Sozlugu

### users/<uid>

| Alan      | Tip     | Aciklama                                            |
|-----------|---------|------------------------------------------------------|
| email     | string  | Auth ile ayni email                                  |
| adSoyad   | string  | Goruntu adi                                          |
| rol       | string  | "TalepAcan" \| "Yonetici" \| "SahaPersoneli"          |
| aktif     | boolean | False = giris yapsa bile kullanim engelli            |
| createdAt | ISO     | Profil olusturuldugu zaman                           |

`<uid>` Firebase Auth tarafindan uretilen `localId`'dir.

### tickets/<key>

| Alan             | Tip   | Zorunlu | Aciklama                                  |
|------------------|-------|---------|--------------------------------------------|
| ticketNo         | string| evet    | `ARZ-<yyMMddHHmmss>` formatinda human-id   |
| baslik           | string| evet    | Kisa konu                                  |
| aciklama         | string| hayir   | Detay                                      |
| konum            | string| evet    | Bina/oda bilgisi                           |
| oncelik          | enum  | evet    | Kritik / Yuksek / Orta / Dusuk             |
| durum            | enum  | evet    | Acik/Atandi/Yolda/Islemde/Beklemede/Tamamlandi |
| talepAcanId      | uid   | evet    | Talep acan kullanicinin uid'si             |
| atananPersonelId | uid   | hayir   | Atama yapilana kadar bos                    |
| createdAt        | ISO   | evet    |                                            |
| updatedAt        | ISO   | evet    | Son durum/alan guncellemesi                 |
| slaDeadline      | ISO   | evet    | Oncelige gore otomatik hesap                |

`<key>` RTDB tarafindan POST sirasinda otomatik uretilen anahtardir
(`-N...` formatinda). Sirali zamanlama icin uretilir.

### tickets/<key>/events/<eventId>

| Alan       | Tip    | Aciklama                                           |
|------------|--------|----------------------------------------------------|
| fromStatus | string | Onceki durum ('' ise ilk olay)                     |
| toStatus   | string | Yeni durum                                          |
| changedBy  | uid    | Olayi yapan kullanicinin uid'si                     |
| changedAt  | ISO    | Zaman                                              |
| note       | string | Opsiyonel aciklama                                  |

---

## Indeksler (`.indexOn`)

`tickets` altindaki sorgular hizli olsun diye su indeksler tanimlanir:

```json
"tickets": {
  ".indexOn": ["durum", "talepAcanId", "atananPersonelId", "createdAt"]
}
```

`events` altinda:

```json
"events": {
  ".indexOn": ["changedAt"]
}
```

Bu indeksler `database.rules.json` icinde tanimlidir.

---

## Tipik Sorgular

| Senaryo                                | Sorgu                                                         |
|----------------------------------------|----------------------------------------------------------------|
| Tum acik talepler (Yonetici)            | `orderBy="durum"&equalTo="Acik"`                              |
| Bir kullanicinin kendi talepleri        | `orderBy="talepAcanId"&equalTo="<uid>"`                       |
| Bir personele atanmis talepler          | `orderBy="atananPersonelId"&equalTo="<uid>"`                  |
| SahaPersoneli kullanicilarinin listesi  | `users` -> `orderBy="rol"&equalTo="SahaPersoneli"`            |

---

## Security Rules Ozeti

`firebase/database.rules.json` icinde tanimli; ozet:

| Yol                       | Read                                       | Write                                            |
|---------------------------|--------------------------------------------|--------------------------------------------------|
| `/users`                  | Sadece Yonetici (list)                     | -                                                |
| `/users/<uid>`            | Sahibi veya Yonetici                       | Sadece Yonetici (profil olustur/duzenle)         |
| `/tickets`                | Auth olan herkes okur (filtre istemcide)   | -                                                |
| `/tickets/<key>` (create) | -                                          | TalepAcan, kendi uid'si ile `talepAcanId` esitse |
| `/tickets/<key>` (update) | -                                          | Yonetici tamami; SahaPersoneli sadece atanan     |

> `tickets` icin read genis tutuldu cunku istemci `orderBy/equalTo` ile
> kendi filtresini yapiyor. Daha sika kisitlama icin per-record `.read`
> kuralina ihtiyac olur, ama RTDB rules indexed query ile birlikte
> calismadigi icin pratik bir kisitlama olmaz. MVP'de read tum auth kullanici
> icin acik tutulmustur; ileride hassas verili sahalar varsa hassas alanlar
> bir alt dugume tasinmalidir.

### Durum/Oncelik Validation

`tickets/<key>/durum` icin sadece su degerler kabul edilir:
`Acik | Atandi | Yolda | Islemde | Beklemede | Tamamlandi`

`tickets/<key>/oncelik` icin: `Kritik | Yuksek | Orta | Dusuk`

---

## Aktif Gorev Limiti

Yonetici atama yaparken istemci `tickets?orderBy="atananPersonelId"&equalTo="<uid>"`
sorgusu yapip durum'u (Atandi/Yolda/Islemde) sayar. 5+ ise atama yapilamaz.

> Bu kontrol istemcide oldugu icin "race condition" durumlarinda 6'ya
> ulasabilir. MVP icin kabul edilebilir. Sert kural icin RTDB
> transaction veya `.write` rule icine `(personelin aktif sayisi <= 5)`
> seklinde karmasik bir mantik gerekir.

---

## Genisleme Notlari

- Coklu dosya eki, fotograf, lokasyon, push notification gibi ozellikler
  bu MVP'de yoktur. Eklenirken ek dugumler (`/uploads`, `/notifications`)
  olusturulup secure rules guncellenmelidir.
- Audit trail (kim hangi alani ne zaman degistirdi) icin `events` yeterlidir
  ancak alan-bazli takip yapilmiyor; ileride `field`, `oldValue`, `newValue`
  alanlari eklenebilir.
