# Ace Editor Interactive Showcase V3

Ace Editor (Ace JS) kutuphanesinin tum ozelliklerini, temalarini, dil modlarini ve Javascript API fonksiyonlarini canli olarak deneyimlemenizi saglayan tam kapsamli, tarayici tabanli bir Web IDE uygulamasidir. Herhangi bir backend sunucusuna ihtiyac duymadan, yalnizca statik dosyalar (HTML, CSS, JS) ile calisir.

Bu proje ozellikle Clomosy TRObject (Delphi/Pascal tabanli mobil uygulama gelistirme platformu) egitim surecleri icin tasarlanmis olup, ogrencilerin ve gelistiricilerin kod yazip test edebilecekleri guvenli bir ortam sunar.

---

## Proje Yapisi

```
ace_demo/
  index.html   - Ana sayfa: Tum arayuz bilesenleri, panel yapisi ve editor penceresi
  script.js    - Tum is mantigi: Editor yonetimi, sekme sistemi, API sandbox, dokumantasyon motoru
  style.css    - Gorsel tasarim: Koyu tema, glassmorphism efektleri, animasyonlar
  README.md    - Bu dosya
```

---

## Ozellikler

### Editor Cekirdegi

- Ace Editor v1.32.7 (CDN uzerinden yuklenir) ile profesyonel kod duzenleme deneyimi
- Coklu dosya destegiyle sekme (tab) tabanli dosya yonetimi: Her dosyanin durumu bellekte saklanir
- Desteklenen diller: JavaScript, HTML, CSS, Python, JSON, SQL ve Pascal/TRObject (Clomosy)
- Ozel TRObject syntax highlighting modu: Clomosy betik dilinin anahtar kelimeleri, sayilari, stringleri ve yorumlari farkli renklerle vurgulanir

### Tema ve Gorunum Ayarlari

- 6 farkli editor temasi: Monokai, Dracula, Solarized Dark, Twilight, GitHub (Light), Chrome (Light)
- 3 klavye duzeni secenegi: Varsayilan (Ace), Vim modu, Emacs modu
- Yazi boyutu ve satir araligi kayan cubuk (slider) kontrolleri
- Girinti boyutu secimi (2, 4, 8 bosluk)
- Acilip kapatilabilen davranis anahtarlari: Satir numaralari, metin kaydirma (wrap), baski kilavuzu, salt okunur mod, aktif satir vurgusu, otomatik tamamlama, son satirdan sonra kaydirma, otomatik calistirma

### Kod Araclari (Ust Arac Cubugu)

- **Indir**: Aktif dosyayi bilgisayara `.js`, `.html`, `.css`, `.py`, `.json`, `.sql` veya `.tro` uzantisiyla indirir
- **Bol**: HTML, CSS ve JavaScript dosyalari icin yan yana (split) gorunumde editoru ve canli onizlemeyi ayni anda gosterir
- **Calistir**: Yazilan HTML/CSS/JS kodunu sandbox iframe icinde canli olarak calistirir ve onizleme penceresinde gosterir
- **Ara**: Ace editore gomulu arama ve degistirme panelini acar (Ctrl+F kisayolu ile de tetiklenebilir)
- **Bicimlendir**: JavaScript, JSON, HTML ve CSS dosyalari icin js-beautify kutuphanesiyle otomatik kod bicimlendirir. Pascal/TRObject dosyalari icin ozel yazilmis bicimlendiriciye sahiptir
- **Temizle**: Editorun icerigini tamamen bosaltir
- **Sifirla**: Editoru o dilin varsayilan sablon koduna geri dondurur

### Hazir Kod Kutuphaneleri (Snippets)

Sol paneldeki ikinci sekme, farkli diller icin hazir kod sablonlari sunar:

- **SQL Sablonlari**: SQLite/SQL Server baglantisi ve gelismis raporlama sorgusu
- **Web Sablonlari**: Kullanici giris ekrani (login form) ve e-posta gonderme formu
- **Python Sablonlari**: Unit test modulu ve veri analizi simulasyonu
- **Clomosy Kutuphanesi**: Form ve temel bilesenler, TclMemo editor arayuzu, TclImage gorsel yukleme, TclListView veri listesi, TclRest HTTP API istemcisi, SQLite yerel veritabani, SQL Server baglantisi, TclTimer zamanlayici, ses calma ve GPS/cihaz sensoru sablonlari

Her sablon butonu, ilgili kodu dogrudan editore yukler ve uygun dil modunu otomatik olarak ayarlar.

### Clomosy API ve DB Sandbox

Sol paneldeki ucuncu sekme, iki farkli test ortami sunar:

- **REST API Test**: Secilen bir API adresine (GitHub, Fake Store, JSONPlaceholder) gercek HTTP GET istegi gonderir, JSON yanitini gorsel olarak gosterir ve bunun Clomosy Pascal karsiligiini otomatik olarak uretir. Uretilen kod dogrudan editore enjekte edilebilir.
- **SQLite SQL Test**: Girilen SQL sorgusunu simule eder, ornek sonuc tablosu olusturur ve sorgunun Clomosy `TclDBSQLiteQuery` karsiligiini uretir.

Her iki modda da konsol terminali uzerinden islem loglarini gercek zamanli izleyebilirsiniz.

### Clomosy Dokumantasyon Kitapligi

Sol paneldeki dorduncu sekme, Clomosy platformundaki tum bilesenleri, metodlari ve olaylari aranabilir bir katalogda sunar:

- 50den fazla bilesen karti: Her kart bilesenin adini, aciklamasini, ozelliklerini, metodlarini, olaylarini ve hazir kullanim ornegini icerir
- Canli arama: Bilesen veya metot ismiyle aninda filtreleme
- Koda Ekle butonu: Secilen bilesenin ornek kodunu dogrudan editore enjekte eder
- Dile duyarli filtreleme: Aktif dil moduna gore ilgili bilesenleri otomatik one cikarir

### Clomosy Linter (Oto-Duzeltme)

Pascal/TRObject dosyalari icin ozel bir statik kod analiz motoru calisir:

- Degisken tanimlama bloku kontrolu (var blogu varligi)
- Form olusturma sablonu kontrolu (TclForm.Create ve MyForm.Run)
- Yaygin hata tespiti: `Form1` yerine `MyForm`, `begin/end` yerine `{ }`, eslesmemis parantez ve suslu parantezler
- Olay baglama sozdizimi dogrulamasi (AddNewEvent parametreleri)
- Sonuclar Ace editordeki satir isareti (annotation) sistemine entegre edilir ve sorunlu satirlar sari/kirmizi ikonlarla vurgulanir

### Diger Ozellikler

- VS Code benzeri Activity Bar (sol ikon cubugu) ile paneller arasi gecis
- Canli durum cubugu: Aktif dil, toplam satir sayisi, imlek konumu ve secili karakter sayisi
- Hosgeldiniz ekrani: Dosya acik olmadiginda kullaniciya hizli dosya acma butonlari sunar
- Sekme kapatma destegi: Her dosya sekmesinde (X) butonu ile kapatma ve otomatik olarak bir sonraki acik dosyaya gecis
- Tamamen Turkce arayuz

---

## Kullanilan Teknolojiler

| Teknoloji | Surum | Amac |
|---|---|---|
| Ace Editor | 1.32.7 | Kod editoru cekirdegi, syntax highlighting, otomatik tamamlama |
| js-beautify | 1.14.9 | JavaScript, HTML ve CSS kod bicimlendiricisi |
| Google Fonts | - | Outfit (arayuz) ve JetBrains Mono (kod) yazi tipleri |
| Vanilla JS | ES6+ | Tum uygulama mantigi, DOM manipulasyonu, Fetch API |
| Vanilla CSS | CSS3 | Koyu tema, glassmorphism, CSS Grid/Flexbox, animasyonlar |

Tum kutuphaneler CDN uzerinden yuklenir. Hicbir build araci, bundler veya paket yoneticisi gerekmez.

---

## Kurulum ve Calistirma

Bu proje tamamen statik dosyalardan olusur. Herhangi bir sunucu kurulumuna gerek yoktur.

### Yerel Kullanim

1. Bu repoyu klonlayin:
   ```
   git clone https://github.com/ardcek/ace_demo.git
   ```
2. `index.html` dosyasini herhangi bir modern tarayicida acin.

### Canli Sunucu ile Kullanim

Daha iyi bir deneyim icin yerel bir HTTP sunucusu kullanabilirsiniz:

```
# Python ile
python -m http.server 8080

# Node.js ile
npx serve .

# VS Code ile
# Live Server eklentisini kurup index.html uzerinde sag tiklayip "Open with Live Server" secin
```

### GitHub Pages ile Yayinlama

1. GitHub uzerinde repo ayarlarindan Pages bolumune gidin
2. Source olarak `main` dalini ve `/ (root)` klasorunu secin
3. Birkac dakika icinde `https://ardcek.github.io/ace_demo/` adresinde yayina alinir

---

## Tarayici Uyumlulugu

- Google Chrome 90 ve uzeri
- Mozilla Firefox 90 ve uzeri
- Microsoft Edge 90 ve uzeri
- Safari 15 ve uzeri

Internet baglantisi gereklidir (CDN uzerinden Ace Editor ve diger kutuphanelerin yuklenmesi icin).

---

## Proje Detaylari

### index.html

Ana HTML dosyasidir. Tum arayuz yapisini icerir:
- Ust baslik cubugu ve proje tanitimi
- Sol panel: Dort sekmeli ayar/arac paneli (Ayarlar, Snippets, API Sandbox, Dokumantasyon)
- Sag panel: IDE penceresi (baslik cubugu, dosya sekmeleri, editor alani, canli onizleme, durum cubugu)
- Activity bar: VS Code benzeri dikey ikon cubugu
- Alt bilgi (footer)

### script.js

Uygulamanin tum is mantigi bu dosyada yer alir:
- Ace Editor yapilandirmasi ve ozel TRObject modu tanimlamasi
- Coklu dosya durumu yonetimi (filesState nesnesi)
- Tum arayuz kontrol olay dinleyicileri (tema, mod, klavye duzeni, yazi boyutu vb.)
- Hazir kod sablonlari ve snippet sistemi
- REST API test sandbox motoru (gercek Fetch istekleri ve Clomosy kod uretimi)
- SQLite sorgu simulasyonu ve kod uretimi
- 50+ bilesen iceren dokumantasyon veritabani ve arama motoru
- TRObject linter/statik analiz motoru
- Sekme yonetimi, split gorunum, canli onizleme ve dosya indirme islevleri

### style.css

Uygulamanin gorsel tasarimini tanimlayan CSS dosyasidir:
- CSS degiskenleri ile merkezi renk ve boyut yonetimi
- Koyu tema (Dark mode) tasarimi
- Glassmorphism efektleri (yari saydam, bulanik arka planli paneller)
- CSS Grid ve Flexbox tabanli duyarli yerlesim
- Micro-animasyonlar ve gecis efektleri
- Ozel kaydirma cubugu ve form eleman stilleri

---

## Lisans

Bu proje Arda Cekic tarafindan gelistirilmistir. Tum haklari saklidir.

---

## Iletisim

Web: [ardcek.com](https://ardcek.com)
GitHub: [github.com/ardcek](https://github.com/ardcek)
