# 🚀 TRObject — TOKEN-DAYANIKLI REFERANS (Boot Kit)

> **Clomosy Cloud Mobile System | Atiker Yazılım**
> **Bu dosyayı oku = tüm Clomosy bilgisi geri yüklenir.**
> Kaynak: EğitimKitabı.pdf (8,727 satır) + docs.clomosy.com (130+ sayfa) + 14 proje (~250 .tro) + Forum (3,055 mesaj)

---

## ⚡ HIZLI BAŞLANGIÇ (Token Sıfırlanınca 2 Dakikada Boot)

```
Blok:{...} | Var:var ad:Tip | Atama:= | String:'tek tırnak' | Yorum:// /* */
function Ad(p):Tip;{Result=x;} | void Ad;{}
Unit:Clomosy.RunUnit('ad') | Form:TclForm.Create(Self)
Renk:SetFormColor('#hex','',clGNone) | REST:TCLRest.Create
JSON:CLParseJSON/ClDataSetFromJSON | SQLite:DBSQLiteQuery.OpenOrExecute
TclArray:.Add.GetItem.SetItem | Hata:try{}except{}
Event:AddNewEvent(bilesen,tbeOnClick,'prosedur') | clWidth→responsive
```

### Kopyala-Çalıştır Minimum Form
```pascal
var Form1:TclForm; Btn:TclButton;
void BtnClick;{ShowMessage('Tıklandı!');}
{
  Form1=TclForm.Create(Self);
  Form1.clSetCaption('Uygulamam');
  Btn=Form1.AddNewButton(Form1,'Btn','Tıkla');
  Form1.AddNewEvent(Btn,tbeOnClick,'BtnClick');
  Form1.Run;
}
```

---

## 📑 İÇİNDEKİLER (Katmanlı)

| Katman | Konu | Bölüm |
|--------|------|-------|
| **K0** | BOOT: Syntax, Veri Tipleri, Operatörler, Koşullar, Döngüler, Fonksiyon/Prosedür | 1-7 |
| **K0** | Unit, Form, Temel Bileşenler, Event | 8-10,15 |
| **K1** | Pro Bileşenler, İleri Bileşenler, Layout, Tema, Klavye | 11-14,16 |
| **K2** | System Library, Cl Utils, Clomosy API, REST, JSON | 17-21 |
| **K2** | Veritabanı, Dosya, Dizi, Hata | 22-25 |
| **K3** | Animasyon, Oyun/AI/IoT, Sensor/Medya, Timer, GameForm | 26-31 |
| **K3** | Pattern Kütüphanesi, Proje Mimarisi, IDE, Forum | 32-38 |

---

## KATMAN 0 — BOOT (Sıfırlanınca İlk Okunacak)

### 1. GENEL BAKIŞ

`.tro` uzantılı, Pascal/Delphi benzeri, **case-insensitive** mobil uygulama geliştirme dili.
`{...}` blok, `;` satır sonu, `=` atama, `'tek tırnak'` string.
Android, iOS, Windows, macOS, Linux'ta çalışır.
IDE: cms.clomosy.com | Runtime: Clomosy Learn

### 2. PROGRAM YAPISI
```pascal
const PI=3.14;
var myVar: Integer;

function Topla(a,b:Integer):Integer;
{ Result=a+b; }  // veya: Topla=a+b;

void ProsedurAdi;                    // parametresiz
void Parametreli(Ad:String; Yas:Integer); // parametreli
{ /* kod */ }

{
  ShowMessage(IntToStr(Topla(5,3)));
}
```
**Kurallar:** `const` → `var` → `function` → `void` → `{...}` sırası. Değişkenler **her zaman `{...}` dışında** tanımlanır.
**Type Inference:** `var Sayi; {Sayi=42;}` → Integer otomatik atanır.

### 3. VERİ TİPLERİ

| Kategori | Tipler |
|----------|--------|
| **Integer** | Byte(0..255), ShortInt(-128..127), SmallInt(-32K..32K), Integer(-2.1B..2.1B), LongInt, Int64, Cardinal(0..4.3B), LongWord, UInt64, Word |
| **Float** | Single(~7), Double(~15), Extended(~19-20), Currency(4 ondalık), Real |
| **Diğer** | String, Char, Boolean, Variant, TclDateTime |
| **Dizi** | `array[0..4] of Integer` — **0-tabanlıdır!** `array[10]` = 11 eleman |

### 4. OPERATÖRLER

| Grup | Operatörler |
|------|------------|
| Aritmetik | `+` `-` `*` `/` `div` `mod` `^` (üs: `a^b`) |
| Karşılaştırma | `=` `<>` `<` `>` `<=` `>=` |
| Mantıksal | `and` `or` `not` `xor` — C stili: `&&` `||` |

### 5. KOŞULLAR
```pascal
if (x) { } else { }
if (x) { } else if (y) { } else { }

case gun of {
  1: ad='Pazartesi';
  2: ad='Salı';
else
  ad='Geçersiz';
}
```

### 6. DÖNGÜLER
```pascal
for (i=1 to 10) { }           // artan
for (i=10 downto 1) { }       // azalan
while (x < 5) { x=x+1; }
repeat x=x+1; until (x>=5);   // en az 1 kez çalışır
Break;      // döngüden çık
Continue;   // sonraki iterasyona geç
Exit;       // döngü + tüm metottan çık
```

### 7. FONKSİYON & PROSEDÜR
```pascal
// Fonksiyon (değer döndürür):
function Topla(a,b:Integer):Integer; { Result=a+b; }

// Prosedür (void — değer döndürmez):
void MerhabaDe; { ShowMessage('Merhaba!'); }
void Parametreli(Ad:String); { ShowMessage(Ad); }

// With bloğu:
With Buton1 do { Align=alCenter; Width=150; Height=200; }
```

### 8. UNIT SİSTEMİ
```pascal
// Temel geçiş:
Clomosy.RunUnit('birimAdi');          // .tro'suz dosya adı
Clomosy.GlobalVariableString=veri;    // unit'ler arası veri taşıma

// TclUnit (referanslı, diğer birimin nesnelerine erişim):
var u:TclUnit;
u=TclUnit.Create;
u.UnitName='hedefBirim';
u.CallerForm=Form1;
u.Run;
// Hedef birimden geri dönüş:
CallerForm.clShow;
Form2.clHide;
```
**Standart mimari:** `MainCode.tro` → `uLogin.tro` → `uAnaEkran.tro` | `lib/uAuth.tro` `lib/uVeri.tro`

### 9. FORM YÖNETİMİ (TclForm)
```pascal
Form=TclForm.Create(Self);
Form.clSetCaption('Başlık');
Form.clSetWindowState(fwsMaximized);  // fwsNormal, fwsMinimized

// Arka plan rengi — 3 parametre: (ana renk, gradyan rengi, gradyan tipi):
Form.SetFormColor('#6F0278','',clGNone);          // Düz renk
Form.SetFormColor('#F00','#00F',clGVertical);     // Dikey gradyan
Form.SetFormColor('#ff0','#048',clGCross);        // Çapraz gradyan
Form.SetFormColor('#0b2','fff',clGHorizontal);    // Yatay gradyan

// Arka plan resmi:
Form.AddAssetFromUrl('https://.../img.png');  // önce indir
Form.SetFormBGImage('img.png');                // indirilenle göster
Form.SetFormBGImage('https://.../img.png');    // veya direkt URL

// Standart butonları gizle:
Form.BtnFormMenu.Visible=False;
Form.BtnGoBack.Visible=False;
Form.FormWaiting.Visible=False;

// Form kontrolleri:
Form.clWidth; Form.clHeight;
Form.clHide; Form.clShow; Form.Run;
Clomosy.AppBasePath; Clomosy.AppFilesPath;
```

**6 Form Tipi:** `TclForm` | `TclGameForm` | `TclDrawForm` | `TclStyleForm` | `TclGuideForm` | `TclSyntaxForm`

### 10. TEMEL BİLEŞENLER
```pascal
Bilesen=Form.AddNewBilesen(Sahip,'Isim','Metin/Başlık');
// Liste: Button | Label | Edit | Memo | CheckBox | ComboBox | Image | ListView | Panel | Layout | VertScrollBox | HorzScrollBox
```

**Ortak özellikler:**
```pascal
Bilesen.Align=alCenter;  // alLeft, Right, Top, Bottom, Client, None, MostTop, MostBottom
Bilesen.Width=200; Bilesen.Height=50;
Bilesen.Margins.Top=10; Bilesen.Margins.Left=10;  // Right, Bottom da var
Bilesen.Position.X=50; Bilesen.Position.Y=100;    // Align=alNone ile kullanılır
Bilesen.Visible=True; Bilesen.Enabled=True;
Bilesen.Opacity=0.5;     // 0=saydam, 1=opak. Visible'dan farkı: tıklanabilir kalır!
Bilesen.RotationAngle=90;
Bilesen.Scale.X=2; Bilesen.Scale.Y=1.5;
Bilesen.HitTest=False;   // tıklamayı görmezden gel
Bilesen.Hint='ipucu';    // fareyle üzerine gelince gösterir
```

**Edit özel:** `MaxLength=5` `ReadOnly=True` `KeyboardType=vktEmailAddress` `clTypeOfField=taFloat` `SetFocus` `Text` `Password=True/False`
**CheckBox:** `IsChecked` (Boolean)
**ComboBox:** `Items[ItemIndex]` — seçili öğe | `AddItem('Metin','Deger')` — öğe ekle

### 15. EVENT SİSTEMİ
```pascal
Form.AddNewEvent(Bilesen,tbeOnClick,'ProsedurAdi');
```
**12 Event Tipi:** `tbeOnClick` | `tbeOnChange` | `tbeOnEnter` | `tbeOnExit` | `tbeOnMouseDown` | `tbeOnMouseUp` | `tbeOnMouseMove` | `tbeOnTimer` | `tbeOnFormKeyDown`(Windows) | `tbeOnFormKeyUp`(Windows) | `tbeOnVirtualKeyboardShown`(mobil) | `tbeOnVirtualKeyboardHidden`(mobil)

**Mouse Konumu:** `Form.clSenderMousePosX` `Form.clSenderMousePosY`
**Klavye Tuşu:** `Form.clSenderKeyChar` (decimal: 32=boşluk, 119=w, 97=a, 100=d)

---

## KATMAN 1 — BİLEŞEN

### 11. PRO BİLEŞENLER
`TClProButton` | `TClProEdit` | `TClProPanel` | `TClProLabel` | `TClProImage` | `TClProSearchEdit` | `TClProDateEdit` | `TClProListView` | `TClProListViewDesignerPanel`

**SetupComponent (JSON yöntemi):**
```pascal
clComponent.SetupComponent(btn,'{"Align":"Center","RoundHeight":15,"Width":300,"TextSize":30,"BackgroundColor":"#4CAF50","BorderWidth":2}');
```

**clProSettings (Programatik yöntem):**
```pascal
btn.clProSettings.RoundHeight=15; btn.clProSettings.RoundWidth=15;
btn.clProSettings.BorderWidth=3;
btn.clProSettings.IsFill=True; btn.clProSettings.IsRound=True;
btn.clProSettings.BorderColor=clAlphaColor.clHexToColor('#d1d1d1');
btn.clProSettings.BackgroundColor=clAlphaColor.clHexToColor('#ebe6e6');
btn.clProSettings.FontSize=17;
btn.clProSettings.FontVertAlign=palcenter;  // palLeading
btn.clProSettings.FontHorzAlign=palCenter;
btn.clProSettings.IsTransparent=False;
btn.clProSettings.TextSettings.Font.Style=[fsBold,fsItalic,fsUnderline];
btn.SetclProSettings(btn.clProSettings);
```

**Diğer Pro özellikler:** `StyledSettings=ssFamily` | `TextSettings.Font.Size/FontColor` | `Scale.X/Y` | `Hint='ipucu'` | `PictureSource='url'` | `PictureAutoFit=True` | `WordWrap=True` | `AutoSize=True` | `IsTransparent=True` | `clAlphaColor.clWhite` (hazır beyaz)

### 12. İLERİ SEVİYE BİLEŞENLER (22 adet)
Switch | NumberBox | Chart | Circle | Rectangle | RadioButton | RadioGroup | Expander | PageControl | StringGrid | ProGrid | WebBrowser | ProWebBrowser | FramedScrollBox | MenuFrame | SearchBox | DrawForm | GuideForm | Timer | MediaPlayer | QRCodeGenerator | ShareService

### 13. LAYOUT BİLEŞENLERİ
`TclLayout` (genel) | `TclFlowLayout` (wrap yapar) | `TclGridLayout` (ızgara) | `TclScaledLayout` (ölçekli)

### 14. TEMA (TclStyleForm)
```pascal
Form=TclStyleForm.Create(Self);
Form.clSetStyle(Form.LightSB); // veya DarkSB
```

### 16. VIRTUAL KEYBOARD (mobil)
```pascal
Form.AddNewEvent(Form,tbeOnVirtualKeyboardShown,'KlavyeAcildi');
Form.AddNewEvent(Form,tbeOnVirtualKeyboardHidden,'KlavyeKapandi');
void KlavyeAcildi; { Layout1.Margins.Bottom=Form.clVKBoundsHeight; }
void KlavyeKapandi; { Layout1.Margins.Bottom=0; }
Form.clVKBoundsWidth/Height/Right/Left;  // klavye boyutları
Form.clVKVisible=False;                  // klavyeyi programatik gizle
```

---

## KATMAN 2 — VERİ

### 17. SYSTEM LIBRARY (58+ fonksiyon)

**String (16):** Copy, Delete, Insert, QuotedStr, Length, Pos, Trim, UpperCase, LowerCase, Chr, AnsiCompareStr, AnsiCompareText, CompareStr, CompareText, AnsiLowerCase, AnsiUpperCase, Append

**Math (19):** Abs, ArcTan, Cos, Sin, Ln, Sqr, Sqrt, Random, Round, Frac, Trunc, Odd, Ord, Low, High, Dec, Inc, Div, Mod + `clMath.GenerateRandom(min,max)`

**DateTime (10):** Date, Time, Now, DayOfWeek, DecodeDate, DecodeTime, EncodeDate, EncodeTime, FormatDateTime, IncMonth

**TypeConv (13):** IntToStr, StrToInt, StrToIntDef, FloatToStr, StrToFloat, DateToStr, StrToDate, TimeToStr, StrToTime, DateTimeToStr, StrToDateTime, IntToHex, FormatFloat

**Boolean (2):** Assigned, VarIsNull

**IO (6):** ShowMessage, InputQuery, InputAndCall, AskAndCall, Ask, `Console.Text()`(Windows .exe konsol)

**System (5):** Beep, GetCurrentLocation, SleepAndCall, ProcessMessages, HoldScreen

### 18. CL UTILITIES (28 gelişmiş fonksiyon)

| Fonksiyon | Açıklama |
|-----------|----------|
| `CLParseJSON(json,path)` | Dot notation: `'products.0.price'` |
| `ClAnimateFloat/Wait/Delay` | Float animasyon motoru |
| `ClDoClick(bilesen)` | Programatik tıklama |
| `ClFileExists/ClPathCombine` | Dosya/yol işlemleri |
| `ClGetStringAfter/Replace/To` | String yardımcıları |
| `ClLoadFromFile/ClSaveToFile` | Dosya okuma/yazma |
| `ClMath` | Matematik (`GenerateRandom(min,max)`) |
| `ClRTGetProperty/ClRTSetProperty` | Runtime property |
| `ClSender/ClSenderKey/ClSenderKeyChar` | Event kaynağı |
| `ClShowMessage/ClStrToLan` | Mesaj/çeviri |
| `ClTagInt/ClTagStr` | Tag değerleri |
| `ClearTemporary/Clipboard` | Geçici dosya/pano |

### 19. CLOMOSY CLASS API
```pascal
// Hesap: clGetUserName, clGetUserEmail, ClomosyID
// Unit: RunUnit('ad'), Uses('ad')
// Global: GlobalVariableString, GlobalVariableInteger
// Parametre: GetProjectUserDefParam('key')
// Veri: ClDataSetFromJSON(jsonStr)
// Platform: AppPlatform, PlatformIsMobile, PlatformIsTurkish, App_Path, AppBasePath, AppFilesPath, LocationIsActive
// DB: DBSQLiteQuery, DBSQLServerConnect, clLoadJSONDataFromURL(url)
```

### 20. REST API
```pascal
var rest:TCLRest;
{
  rest=TCLRest.Create;
  rest.BaseURL='https://api.example.com/endpoint';
  rest.Accept='application/json';
  rest.Method=rmPOST;  // rmGET, rmPUT, rmDELETE
  rest.AddBody('{"key":"value"}','application/json');
  rest.ContentType='application/json';
  rest.Execute;
  var yanit=rest.Response;
}
// TclHttp alternatif HTTP istemcisi
```

### 21. JSON İŞLEMLERİ (3 Yöntem)
```pascal
// Yöntem 1: TCLJSONQuery (DataSet benzeri — çoklu kayıt):
json=TCLJSONQuery.Create(nil);
json=Clomosy.ClDataSetFromJSON('['+jsonStr+']');
with json do {
  if(Found){ First; while(not EOF){
    FieldByName('ad').AsString;  // AsInteger, AsFloat, AsBoolean
    Next;
  }}
}

// Yöntem 2: CLParseJSON (Dot notation — tek değer):
fiyat=Clomosy.CLParseJSON(jsonVeri,'products.0.price');

// Yöntem 3: TclJSON sınıfları: TclJSON, TclJSONObject, TclJSONArray, TclJSONValue, TclJSONPair
```

### 22. VERİTABANI (SQLite + SQL Server)
```pascal
// SQLite bağlantı + tablo oluşturma:
Clomosy.DBSQLiteConnect(Clomosy.AppFilesPath+'veritabani.db3','');
Clomosy.DBSQLiteQuery.Sql.Text='CREATE TABLE IF NOT EXISTS Kullanicilar(kullaniciID INTEGER PRIMARY KEY AUTOINCREMENT, kullaniciAdi TEXT, kullaniciSifre TEXT)';
Clomosy.DBSQLiteQuery.OpenOrExecute;

// INSERT:
Clomosy.DBSQLiteQuery.Sql.Text='INSERT INTO t(name,status) VALUES('+QuotedStr(ad)+','+IntToStr(0)+')';
Clomosy.DBSQLiteQuery.OpenOrExecute;

// SELECT + EOF kontrolü:
Clomosy.DBSQLiteQuery.Sql.Text='SELECT * FROM Kullanicilar WHERE kullaniciAdi='+QuotedStr(ad);
Clomosy.DBSQLiteQuery.OpenOrExecute;
if(not Clomosy.DBSQLiteQuery.Eof){ /* kayıt bulundu */ }

// Tablo var mı kontrolü:
Clomosy.DBSQLiteQuery.Sql.Text='SELECT name FROM sqlite_master WHERE type="table" AND name="tabloAdi";';
Clomosy.DBSQLiteQuery.OpenOrExecute;

// SQL Server: Clomosy.DBSQLServerConnect('SELECT * FROM t')
// JSON kaynak: Clomosy.clLoadJSONDataFromURL('url')
```

### 23. DOSYA & STREAM
`FileToStream` `FileToBase64` `Base64ToFile` `Base64ToStream` `StreamToBase64`
`ClLoadFromFile` `ClSaveToFile` `ClFileExists` `ClPathCombine`
`TclFileStream` `TclMemoryStream` `TclBlobField` `TclStringList`
`AssignFile` `CloseFile` `ReWrite` `Reset` `ReadLn` `WriteLn` `EOF` `Append`

### 24. DİZİLER
```pascal
// Standart dizi (0-tabanlı!):
var d:array[0..4] of Integer;
d[0]=100; ShowMessage(d[1]); Length(d);

// Çok boyutlu dinamik:
var M:Variant;
M=VarArrayCreate([0,3,0,2],12); // 4x3, VarType: 3=Int, 12=Variant
M=[[1,2,3],[5,6,7],[9,10,11],[13,14,15]];

// TclArray (Dinamik — sınırsız):
var D:TClArrayInteger;  // TClArrayString, TClArrayDouble
D=TClArrayInteger.Create;
D.Add(20); D.Add(30); D.Add(17);
D.GetItem(0);         // 20
D.SetItem(2,88);      // 2.indis=88
D.RemoveAt(0);        // ilk elemanı sil
D.RemoveAll;          // tümünü temizle
D.Count;              // eleman sayısı
D.Destroy;            // bellekten temizle
```

### 25. HATA YÖNETİMİ
```pascal
// try-except (hata yakalama):
try
  Sonuc=y div x; // x=0 → hata!
except
  ShowMessage('Hata: '+LastExceptionClassName+' - '+LastExceptionMessage);
}

// try-finally (her durumda çalışır):
try
  // riskli kod
finally
  // her zaman çalışacak temizlik kodu
}
```

---

## KATMAN 3 — MİMARİ & PATTERN'LER

### 26. ANİMASYON
```pascal
// Bitmap animasyon: TclBitmapListAnimation
// Float animasyon:
ClAnimateFloat(bilesen,'Opacity',0,1,0.5); // 0.5 saniyede fade-in
ClAnimateFloatWait;   // animasyon bitene kadar bekle
ClAnimateFloatDelay(bilesen,'X',100,200,1.0); // 1sn gecikmeli
```

### 27. OYUN & AI & IoT
**Oyun:** `TclGameEngine` `TclGameForm` — fizik, çarpışma, sprite yönetimi
**AI:** `TclOpenAIEngine` — OpenAI entegrasyonu
**IoT:** `TclMQTT` `TclMQTTClient` — MQTT broker bağlantısı

### 28. SENSOR & MEDYA & PAYLAŞIM
**Sensor:** Device_Sensor, MotionSensor, Gesture, Mouse_Movements, CallBarcodeReader, Virtual_Keyboard, GetCurrentLocation, TclDeviceManager
**Medya:** TclMediaPlayer, Camera_Access, TclQRCodeGenerator, SetImage
**Sosyal:** `TclShareService.Share('metin','url')` — WhatsApp/Instagram/Twitter
**Bildirim:** `Notification.Send('Başlık','Mesaj')`
**E-posta:** `Send_Email.Send('alici@mail.com','Konu','İçerik')`

### 29. TCLTIMER
```pascal
var timer:TCLTimer; sayac:Integer;
void TimerCalisti;{ Inc(sayac); /* her 100ms'de bir çalışır */ }
{
  timer=Form.AddNewTimer(Form,'timer',100); // 100ms aralık
  Form.AddNewEvent(timer,tbeOnTimer,'TimerCalisti');
  timer.Enabled=True; // başlat
  // timer.Enabled=False; // durdur
}
```

### 30. GAME FORM (Özel Oyun Formu)
```pascal
var game:TCLGameForm; sesID:Integer;
{
  game=TCLGameForm.Create(Self);
  game.AddGameAssetFromUrl('https://.../sound.wav'); // ses dosyası indir
  sesID=game.RegisterSound('sound.wav');              // sesi kaydet
  game.PlayGameSound(sesID);                          // sesi çal
  game.SoundIsActive=True;
  game.SetFormBGImage('https://.../bg.jpg');
  game.Run;
}
```

### 31. RESPONSIVE TASARIM
```pascal
// Ekran boyutuna göre uyarlama:
if(Form.clWidth < 400){ /* mobil */ } else { /* tablet/desktop */ }

// Dinamik boyutlandırma:
btn.Margins.Top=Form.clHeight/30;       // %3.3 üst boşluk
btn.Width=Form.clWidth*0.75;            // %75 genişlik
btn.Left=(Form.clWidth-btn.Width)/2;    // yatay merkezleme
img.Position.Y=Form.clHeight*0.08;      // %8 üst boşluk
```

### 32. KRİPTOGRAFİ & SIRALAMA
**Kripto:** AES_Encryption, TCLCrypto
**Sıralama Algoritmaları:** Bubble, Merge, Selection, Insertion, Quick Sort

### 33. CLOUD & FIREBASE
```pascal
// Firebase Auth:
POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=<API_KEY>
Body: {"email":"...","password":"...","returnSecureToken":true}

// RTDB CRUD: GET/POST/PATCH /.json?auth=<token>
clRest.BaseURL='https://project.firebaseio.com/data.json';
clRest.Method=rmPOST;
clRest.AddBody('{"ad":"deger"}','application/json');
clRest.Execute;
```

### 34. PROJE MİMARİSİ (Standart)
```
Proje/
├── MainCode.tro          // const API_KEY; RunUnit('uLogin')
├── uLogin.tro            // Giriş ekranı
├── uAnaEkran.tro         // Ana menü
├── uForm1.tro            // İş formları
└── lib/
    ├── uAuth.tro          // Yetkilendirme
    └── uVeri.tro          // Veritabanı işlemleri
```

### 35. BEST PRACTICES
```pascal
// ✅ DO:
try{clRest.Execute;}except{ShowMessage(LastExceptionMessage);}  // REST güvenliği
Clomosy.GlobalVariableString=kullaniciId;                         // veri taşıma
if(Form.clWidth<400){/*mobil*/}else{/*desktop*/}                 // responsive
'VALUES('+QuotedStr(deger)+')'                                   // SQL güvenliği

// ❌ DON'T:
var var;                    // KEYWORD değişken adı OLAMAZ!
clRest.Execute;             // try-except'siz REST → ÇÖKER!
Clomosy.RunUnit('hedef');  // clHide yapmadan → BELLEK SIZINTISI!
```

### 36. PATTERN KÜTÜPHANESİ (Kopyala-Çalıştır)

**🏦 İş Uygulaması — Login + REST API + JSON (BankProject)**
```pascal
var clRest:TCLRest; json:TCLJSONQuery;
void GirisYap;
{
  clRest=TCLRest.Create;
  clRest.BaseURL='https://api.site.com/login';
  clRest.Method=rmPOST;
  clRest.AddBody('{"tc":"'+tcEdit.Text+'","sifre":"'+sifreEdit.Text+'"}','application/json');
  clRest.Execute;
  try
    json=Clomosy.ClDataSetFromJSON('['+clRest.Response+']');
    with json do{if(Found){First;while(not EOF){
      if(FieldByName('exists').AsString=='True'){
        Clomosy.GlobalVariableString=tcEdit.Text;
        Clomosy.RunUnit('mainForm'); Form.clHide; Break;
      }else ShowMessage('Hatalı giriş!');
      Next;
    }}}
  except ShowMessage(LastExceptionMessage);
}
```

**🏦 İş Uygulaması — CRUD + ProPanel (DBProcess)**
```pascal
var ProPanel:TclProPanel; Btn:TClProButton;
void RouteToList;{Clomosy.RunUnit('productListUnit');}
{
  ProPanel=Form.AddNewProPanel(Form,'ProPanel');
  ProPanel.Align=alClient; ProPanel.clProSettings.IsFill=True; IsRound=True;
  ProPanel.SetclProSettings(ProPanel.clProSettings);
  Btn=Form.AddNewProButton(ProPanel,'Btn','Listele');
  Btn.clProSettings.BackgroundColor=clAlphaColor.clHexToColor('#fff7f5');
  Btn.clProSettings.RoundHeight=15; RoundWidth=15; BorderWidth=3;
  Btn.SetclProSettings(Btn.clProSettings);
  Form.AddNewEvent(Btn,tbeOnClick,'RouteToList');
}
```

**🎮 Oyun — GameForm + Timer + Ses (AerialDefence)**
```pascal
var g:TCLGameForm; t:TCLTimer; d,sn:Integer;
void ts;{Inc(d);sn=d div 10;if(sn==1){t.Enabled=False;}}
{
  g=TCLGameForm.Create(Self); g.AddGameAssetFromUrl('sound.wav');
  sid=g.RegisterSound('sound.wav'); g.PlayGameSound(sid); g.SoundIsActive=True;
  t=g.AddNewTimer(g,'t',100); g.AddNewEvent(t,tbeOnTimer,'ts'); t.Enabled=True; g.Run;
}
```

**🎨 Modern UI (HABITLY)** — `Edit.Password=True/False` şifre toggle, `Assigned()` nesne kontrolü, `PictureSource` direkt URL, `IsTransparent`, `Width*40/100` yüzdesel, Label'a `tbeOnClick`, `fsUnderline`

**💱 Canlı Borsa (Borsa-Takip)** — `CLParseJSON` + `rmGet` + Binance API, `Label.Left/Top` direkt pozisyon, `clAlphaColor.clWhite`, `RoundWidth/Height`

**📚 Kitap Takip** — `DBSQLiteConnect` + `sqlite_master` tablo kontrolü, `ClSender` + `clTagStr` ile çoklu buton tek void, `BackgroundColor=nil` varsayılan

**🏭 Vardiya Personel (15 unit kurumsal)** — `MouseDown+MouseUp` hover efekti, `PictureAutoFit`, `WordWrap`, `Left=(Form.clWidth-btn.Width)/2` merkezleme

**✅ TodoList** — `TclStyleForm+LightSB`, ProPanel+ProEdit+ProButton, `FontVertAlign=palcenter`

**🌾 Farmer, 👥 WorkHive(17 unit), 📱 QR, 🔐 Firebase, 📊 Bütçe, 🚗 ArabaGaler** — pattern'ler hazır

### 37. IDE REHBERİ (cms.clomosy.com)

| # | Bileşen | Görev |
|---|---------|-------|
| 1 | Kod Editörü | Çoklu sekme, TRObject yazımı |
| 2 | Kaydet (Ctrl+S) | Kodu sunucuya gönderir |
| 3 | Aktivasyon Kodu | Kullanıcı Member GUID girişi |
| 4 | Üye Listesi | Projedeki kullanıcılar |
| 5 | Tüm Birimleri Kaydet | Açık tüm unit'leri kaydeder |
| 6 | .tro İndir | Ana Kod'u dosya olarak indirir |
| 7 | Otomatik Kaydetme | Süre ayarlı periyodik kayıt |
| 8 | Renk Paleti | Hex/HSL/RGB dönüşümleri |
| 9 | Dokümantasyon | docs.clomosy.com linki |

**Birim ekleme:** Artı(+) → Birim Adı (`u` prefix, Türkçe karakter YOK) → TRObject → Ekle
**Proje:** Dışarı Aktar(.zip), İçeri Aktar, Educational firması seçimi
**Hata konsolu:** En alt = hata türü, altı = kaynak satır (`Source position: X,Y`)

### 38. FORUM ANALİZİ (forum.clomosy.com.tr)

**Platform:** Web Wiz Forums v12.07
**İstatistik:** 3,055 mesaj, 1,051 konu, 9 forum, **358 üye**
**En büyük forum:** Genel İşlemler(FID=122) — 762 konu, 2,285 mesaj

**Tespit edilen üyeler:** ardcek(PF=399) | Developer(PF=106) | Emr.Erkmn(PF=257) | kaanl0(PF=345) | Eren Ö.(PF=347) | Melih(PF=371) | Zitdoyz(PF=397) | Saliha Göçergi(PF=96)

**Forumdan öğrenilen kritik bilgiler:**
- Education hesap **33 birim sınırı** var
- JSON'da ID için **RECORD_GUID** kullanımı zorunlu
- Değişken adlarında **Türkçe karakter OLMAZ** (`ısŞifre` → hata!)
- `var` unutmak → **Syntax error**
- `TclCircle.Fill.Color` → overflow hatası (çözüm: satırları sil)

**En çok tartışılan:** Syntax dönüşümü, TclCircle overflow, Edit kontrol(5 yöntem), SQLite bağlantı, Responsive, Pro bileşenler, REST API, Oyun, Mimari

---

## 🔑 HIZLI REFERANS KARTI

```
Blok:{} | Var:var ad:Tip | Atama:= | String:'tek' | Yorum:// /* */
function Ad(p):Tip;{Result=x;} | void Ad;{}
Unit:Clomosy.RunUnit('ad') | GlobalVariableString
Form:TclForm.Create(Self) | Renk:SetFormColor('#hex','',clGNone)
Btn:AddNewButton | Edit.Text | CheckBox.IsChecked
Event:AddNewEvent(b,tbeOnClick,'void') | 12 event tipi
Pro:clProSettings.RoundHeight/BorderColor/FontSize/IsFill
REST:TCLRest.Create | JSON:CLParseJSON/ClDataSetFromJSON
SQLite:DBSQLiteQuery.OpenOrExecute | TclArray:.Add.GetItem.SetItem
Timer:AddNewTimer | Game:TCLGameForm+RegisterSound
AI:TclOpenAIEngine | IoT:TclMQTT | Share:TclShareService
Hata:try{}except{} | Responsive:if(clWidth<400) | clWidth*0.75
```

> 📚 docs.clomosy.com(249s) | EğitimKitabı.pdf(8,727s) | github.com/Clomosy | forum.clomosy.com.tr(3,055 mesaj, 358 üye)