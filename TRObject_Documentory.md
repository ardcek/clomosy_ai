# TRObject — DETAYLI REFERANS REHBERİ

> **Clomosy Cloud Mobile System | Atiker Yazılım**
> **Kaynak:** EğitimKitabı.pdf (8,727 satır, 13 bölüm) + docs.clomosy.com (130+ sayfa) + 9 öğrenci projesi (70+ .tro) + GitHub EgitimKitabi (166 .tro)

---

## 1. GENEL BAKIŞ
- `.tro` uzantılı, Pascal/Delphi benzeri, case-insensitive
- Blok: `{ ... }`, satır sonu: `;`, atama: `=`
- String: `'tek tırnak'`, yorum: `//`, `/* */`, `(* *)`
- Platform: Android, iOS, Windows, macOS, Linux
- IDE: cms.clomosy.com, Runtime: Clomosy Learn

```pascal
{ ShowMessage('Hello World!'); }
```

---

## 2. PROGRAM YAPISI
```pascal
const PI=3.14;
var myVar: Integer;

function Topla(a,b: Integer): Integer;
{ Result = a+b; }  // veya: Topla = a+b;

void ProsedurAdi;        // parametresiz
void Parametreli(Ad: String; Yas: Integer);  // parametreli
{ /* kod */ }

{
  ShowMessage(IntToStr(Topla(5,3)));
}
```
**Kural:** Değişkenler `{...}` dışında. `const`→`var`→`function`→`void`→`{...}` sırası.

### Type Inference
```pascal
var Sayi; { Sayi=42; } // tür belirtmeden, Integer olur
```

---

## 3. VERİ TİPLERİ
**Integer:** Byte(0..255) ShortInt(-128..127) SmallInt(-32K..32K) Integer(-2.1B..2.1B) LongInt Int64 Cardinal(0..4.3B) LongWord UInt64 Word
**Float:** Single(~7) Double(~15) Extended(~19-20) Currency(4 ondalık) Real
**Diğer:** String Char Boolean Variant TclDateTime
**Dizi:** `array[0..4] of Integer` | `array[10] of String` (0-tabanlı, 10=11 eleman!)

---

## 4. OPERATÖRLER
**Aritmetik:** `+ - * / div mod ^` (üs: `a^b`)
**Karşılaştırma:** `= <> < > <= >=`
**Mantıksal:** `and or not xor` | **C alternatifi:** `&& ||`

---

## 5. KOŞULLAR
```pascal
if (x) { } else { }
if (x) { } else if (y) { } else { }
case gun of { 1: ad='Pzt'; 2: ad='Sal'; else ad='Geçersiz'; }
```

---

## 6. DÖNGÜLER
```pascal
for (i=1 to 10) { }
for (i=10 downto 1) { }
while (x<5) { x=x+1; }
repeat x=x+1; until (x>=5);
Break; Continue; Exit;  // Exit = döngü + tüm metottan çık
```

---

## 7. FONKSİYON & PROSEDÜR
```pascal
function Topla(a,b: Integer): Integer; { Result=a+b; }
void ProsedurAdi; { }
void Parametreli(Ad: String); { ShowMessage(Ad); }
```
`Result` = dönüş değeri. Prosedürler `()` ile veya `()`'siz çağrılabilir.

### With Bloğu
```pascal
With Buton1 do { Align=alCenter; Width=150; Height=200; }
```

---

## 8. UNIT SİSTEMİ
```pascal
Clomosy.RunUnit('birimAdi');       // .tro'suz, birime geçer
Clomosy.GlobalVariableString=veri; // unit'ler arası veri taşıma

// TclUnit (referanslı geçiş):
var u: TclUnit;
{
  u=TclUnit.Create;
  u.UnitName='hedefBirim';
  u.CallerForm=Form1;
  u.Run;
}

// Hedef birimden geri dönüş:
CallerForm.clShow;
Form2.clHide;
```
**Mimari:** `MainCode.tro` → `uLogin.tro` → `uAnaEkran.tro` | `lib/uAuth.tro`

---

## 9. FORM YÖNETİMİ (TclForm)
```pascal
Form=TclForm.Create(Self);
Form.clSetCaption('Başlık');
Form.clSetWindowState(fwsMaximized);  // Tam ekran (Windows)
// fwsNormal, fwsMinimized

// Arka plan rengi (3 parametre):
Form.SetFormColor('#6F0278','',clGNone);       // Düz renk
Form.SetFormColor('#FF0000','#0000FF',clGVertical); // Dikey gradyan
Form.SetFormColor('#ffef03','#004684',clGCross);    // Çapraz gradyan
Form.SetFormColor('#00b282','ffffff',clGHorizontal); // Yatay gradyan

// Arka plan resmi:
Form.AddAssetFromUrl('https://.../image.png');
Form.SetFormBGImage('image.png');
// veya direkt URL:
Form.SetFormBGImage('https://.../image.png');

// Buton gizleme:
Form.BtnFormMenu.Visible=False;
Form.BtnGoBack.Visible=False;
Form.FormWaiting.Visible=False;

// Form bilgileri:
Form.clWidth; Form.clHeight;
Form.clHide; Form.clShow; Form.Run;

// Uygulama yolları:
Clomosy.AppBasePath   // ana dizin yolu
Clomosy.AppFilesPath  // dosya yolu
Form.AddAssetFromUrl('url'); // asset indir
```

### 6 Form Tipi
`TclForm` (standart) | `TclGameForm` (oyun) | `TclDrawForm` (çizim) | `TclStyleForm` (temalı) | `TclGuideForm` (kılavuz) | `TclSyntaxForm`

---

## 10. TEMEL BİLEŞENLER (Standart)
```pascal
Bilesen=Form.AddNewBilesen(Sahip,'Isim','Metin/Başlık');
```
**Liste:** Button | Label | Edit | Memo | CheckBox | ComboBox | Image | ListView | Panel | Layout | VertScrollBox | HorzScrollBox

**Ortak Özellikler:**
```pascal
Bilesen.Align=alCenter; // alLeft,Right,Top,Bottom,Client,None,MostTop,MostBottom
Bilesen.Width=200; Bilesen.Height=50;
Bilesen.Margins.Top=10; Bilesen.Margins.Left=10;
Bilesen.Position.X=50; Bilesen.Position.Y=100; // Align=alNone ile
Bilesen.Visible=True; Bilesen.Enabled=True;
Bilesen.Opacity=0.5;    // 0=saydam, 1=opak (Visible'dan farkı: tıklanabilir kalır)
Bilesen.RotationAngle=90;
Bilesen.Scale.X=2; Bilesen.Scale.Y=2;
Bilesen.HitTest=False;   // tıklamayı görmezden gel
Bilesen.Locked=True;     // tasarımda kilitli
Bilesen.Hint='ipucu';    // fareyle üzerine gelince
Edit.MaxLength=5;
Edit.ReadOnly=True;
Edit.KeyboardType=vktEmailAddress; // vktDefault, vktNumber, vktPhone
Edit.clTypeOfField=taFloat; // taString
Edit.SetFocus; // odaklan
CheckBox.IsChecked; // Boolean
Edit.Text;  // metin içeriği
```

---

## 11. PRO BİLEŞENLER
`TClProButton` | `TClProEdit` | `TClProPanel` | `TClProLabel` | `TClProImage` | `TClProSearchEdit` | `TClProDateEdit` | `TClProListView` | `TClProListViewDesignerPanel`

### SetupComponent (JSON):
```pascal
clComponent.SetupComponent(btn,'{"Align":"Center","RoundHeight":15,"Width":300,"TextSize":30,"BackgroundColor":"#4CAF50"}');
```

### clProSettings (Programatik):
```pascal
btn.clProSettings.RoundHeight=15; RoundWidth=15;
btn.clProSettings.BorderColor=clAlphaColor.clHexToColor('#d1d1d1');
btn.clProSettings.BorderWidth=3;
btn.clProSettings.BackgroundColor=clAlphaColor.clHexToColor('#ebe6e6');
btn.clProSettings.IsFill=True; IsRound=True;
btn.clProSettings.FontSize=17;
btn.clProSettings.FontVertAlign=palcenter; // palLeading
btn.clProSettings.FontHorzAlign=palCenter;
btn.clProSettings.TextSettings.Font.Style=[fsBold,fsItalic,fsUnderline];
btn.SetclProSettings(btn.clProSettings);
```

### StyledSettings: `ssFamily`
### TextSettings: `Font.Size` `Font.Style` `FontColor`
### Scale: `Scale.X` `Scale.Y`
### clAlphaColor: `clAlphaColor.clHexToColor('#hex')`
### Hint: `btn.Hint='ipucu metni'`

---

## 12. İLERİ SEVİYE BİLEŞENLER (30+)
Switch | NumberBox | Chart | Circle | Rectangle | RadioButton | RadioGroup | Expander | PageControl | StringGrid | ProGrid | WebBrowser | ProWebBrowser | FramedScrollBox | MenuFrame | SearchBox | DrawForm | GuideForm | Timer | MediaPlayer | QRCodeGenerator

---

## 13. LAYOUT BİLEŞENLERİ
`TclLayout` | `TclFlowLayout` (wrap) | `TclGridLayout` (ızgara) | `TclScaledLayout` (ölçekli)

---

## 14. TclStyleForm & TEMA
```pascal
Form=TclStyleForm.Create(Self);
Form.clSetStyle(Form.LightSB); // veya DarkSB
```

---

## 15. EVENT SİSTEMİ
```pascal
Form.AddNewEvent(Bilesen,tbeOnClick,'ProsedurAdi');
```
**Event Tipleri:**
- `tbeOnClick` — tıklama
- `tbeOnChange` — değer değişince (ComboBox, Edit)
- `tbeOnEnter` — odaklanınca
- `tbeOnExit` — odak kaybedince
- `tbeOnMouseDown` — fare tuşuna basınca (hemen)
- `tbeOnMouseUp` — fare tuşu bırakınca
- `tbeOnMouseMove` — fare hareket edince
- `tbeOnTimer` — timer tetiklenince
- `tbeOnFormKeyDown` — klavye tuşuna basınca (Windows)
- `tbeOnFormKeyUp` — klavye tuşu bırakınca (Windows)
- `tbeOnVirtualKeyboardShown` — sanal klavye açılınca (mobil)
- `tbeOnVirtualKeyboardHidden` — sanal klavye kapanınca (mobil)

### Mouse/Fare Konumu:
```pascal
Form.clSenderMousePosX  // fare X
Form.clSenderMousePosY  // fare Y
```

### Klavye Tuşu:
```pascal
Form.clSenderKeyChar  // basılan tuşun decimal kodu (32=boşluk, 119=w, 97=a, 100=d)
```

### ComboBox Event Örneği:
```pascal
ComboBox1.Items[ComboBox1.ItemIndex]  // seçilen öğe
ComboBox1.AddItem('Metin','Deger');   // öğe ekle
```

---

## 16. VIRTUAL KEYBOARD
```pascal
Form.AddNewEvent(Form,tbeOnVirtualKeyboardShown,'KlavyeAcildi');
Form.AddNewEvent(Form,tbeOnVirtualKeyboardHidden,'KlavyeKapandi');

void KlavyeAcildi;
{ Layout1.Margins.Bottom=Form.clVKBoundsHeight; }

Form.clVKBoundsWidth/Height/Right/Left  // klavye boyutları
Form.clVKVisible=False;  // klavyeyi gizle
```

---

## 17. SYSTEM LIBRARY (58+ fonksiyon)
**String(16):** Copy Delete Insert QuotedStr Length Pos Trim UpperCase LowerCase Chr AnsiCompareStr/Text CompareStr/Text AnsiLowerCase/UpperCase Append
**Math(19):** Abs ArcTan Cos Sin Ln Sqr Sqrt Random Round Frac Trunc Odd Ord Low High Dec Inc Div Mod
**DateTime(10):** Date Time Now DayOfWeek DecodeDate/Time EncodeDate/Time FormatDateTime IncMonth
**TypeConv(13):** IntToStr StrToInt/Def FloatToStr StrToFloat DateToStr StrToDate TimeToStr StrToTime DateTimeToStr StrToDateTime IntToHex FormatFloat
**Boolean(2):** Assigned VarIsNull
**IO(6):** ShowMessage(msg) InputQuery(title,prompt,var value) InputAndCall AskAndCall Ask Console.Text() (Windows .exe konsol)
**System(5):** Beep GetCurrentLocation SleepAndCall ProcessMessages HoldScreen

```pascal
ShowMessage('Mesaj');
InputQuery('Başlık','Sorunuz:',Cevap);
Console.Text('Konsol çıktısı'); // Windows .exe
```

---

## 18. CL UTILITIES (28 gelişmiş fonksiyon)
`CLParseJSON(json,path)` dot notation: `'products.0.price'`
`ClAnimateFloat/Wait/Delay` animasyon
`ClDoClick(bilesen)` programatik tıklama
`ClFileExists/ClPathCombine` dosya/yol
`ClGetStringAfter/Replace/To` string yardımcıları
`ClLoadFromFile/ClSaveToFile` dosya okuma/yazma
`ClMath` matematik, `ClMath.GenerateRandom(min,max)` aralıklı rastgele
`ClRTGetProperty/ClRTSetProperty` runtime property
`ClSender/ClSenderKey/ClSenderKeyChar` event kaynağı
`ClShowMessage/ClStrToLan` mesaj/çeviri
`ClTagInt/ClTagStr` tag
`ClearTemporary/Clipboard` temp/pano
`GenerateRandom` rastgele
`ShowExceptions` exception göster/gizle

---

## 19. CLOMOSY CLASS API
```pascal
// Hesap
Clomosy.clGetUserName
Clomosy.clGetUserEmail
Clomosy.ClomosyID

// Unit
Clomosy.RunUnit('ad')
Clomosy.Uses('ad')

// Global değişkenler
Clomosy.GlobalVariableString
Clomosy.GlobalVariableInteger

// Parametre
Clomosy.GetProjectUserDefParam('key')

// Veri
Clomosy.ClDataSetFromJSON(jsonStr)

// Platform
Clomosy.AppPlatform
Clomosy.PlatformIsMobile
Clomosy.PlatformIsTurkish
Clomosy.App_Path
Clomosy.AppBasePath
Clomosy.AppFilesPath
Clomosy.LocationIsActive

// DB
Clomosy.DBSQLiteQuery
Clomosy.DBSQLServerConnect
Clomosy.clLoadJSONDataFromURL(url)
```

---

## 20. REST API & HTTP
```pascal
var rest:TCLRest;
{
  rest=TCLRest.Create;
  rest.BaseURL='https://api.example.com';
  rest.Accept='application/json';
  rest.Method=rmPOST; // rmGET, rmPUT, rmDELETE
  rest.AddBody('{"key":"value"}','application/json');
  rest.Execute;
  var yanit=rest.Response;
}
```
`TclHttp` alternatif HTTP istemcisi.

---

## 21. JSON İŞLEMLERİ (3 YÖNTEM)

### Yöntem 1: TCLJSONQuery (DataSet benzeri)
```pascal
json=TCLJSONQuery.Create(nil);
json=Clomosy.ClDataSetFromJSON('['+str+']');
with json do {
  if(Found){ First; while(not EOF){
    FieldByName('ad').AsString; // AsInteger, AsFloat, AsBoolean
    Next;
  }}
}
```

### Yöntem 2: CLParseJSON (Dot notation)
```pascal
fiyat=Clomosy.CLParseJSON(jsonVeri,'products.0.price');
```

### Yöntem 3: TclJSON Sınıfları
`TclJSON` `TclJSONObject` `TclJSONArray` `TclJSONValue` `TclJSONPair`

---

## 22. VERİTABANI
```pascal
// SQLite
Clomosy.DBSQLiteQuery.Sql.Text='INSERT INTO t(n) VALUES('+QuotedStr(ad)+')';
Clomosy.DBSQLiteQuery.OpenOrExecute;

// SQL Server
Clomosy.DBSQLServerConnect('SELECT * FROM t');

// JSON kaynak
Clomosy.clLoadJSONDataFromURL('url');
```

---

## 23. DOSYA & STREAM
`FileToStream FileToBase64 Base64ToFile Base64ToStream StreamToBase64`
`ClLoadFromFile ClSaveToFile ClFileExists ClPathCombine`
`TclFileStream TclMemoryStream TclBlobField TclStringList`
`AssignFile CloseFile ReWrite Reset ReadLn WriteLn EOF Append`

---

## 24. DİZİLER
```pascal
// Standart (0-tabanlı):
var d: array[0..4] of Integer;
d[0]=100; ShowMessage(d[1]); Length(d);

// Çok Boyutlu Dinamik:
var Matris: Variant;
{
  Matris=VarArrayCreate([0,3,0,2],12); // 4x3, VarType: 3=Int, 12=Variant
  Matris=[[1,2,3],[5,6,7],[9,10,11],[13,14,15]];
}

// TclArray (Dinamik):
var Dizi: TClArrayInteger; // TClArrayString, TClArrayDouble
{
  Dizi=TClArrayInteger.Create;
  Dizi.Add(20); Dizi.GetItem(0); Dizi.SetItem(2,88);
  Dizi.RemoveAt(0); Dizi.RemoveAll; Dizi.Count; Dizi.Destroy;
}
```

---

## 25. HATA YÖNETİMİ
```pascal
try
  Sonuc=y div x; // x=0 ise hata
except
  ShowMessage('Hata: '+LastExceptionClassName+' - '+LastExceptionMessage);
}
// try-finally de mevcut
```

---

## 26. ANİMASYON
```pascal
TclBitmapListAnimation // bitmap animasyon
ClAnimateFloat(bilesen,'Opacity',0,1,0.5); // fade-in
ClAnimateFloatWait; ClAnimateFloatDelay;
```

---

## 27. OYUN & AI & IoT
**Game:** `TclGameEngine` `TclGameForm` — fizik, çarpışma, sprite
**AI:** `TclOpenAIEngine` — OpenAI entegrasyonu
**IoT:** `TclMQTT` `TclMQTTClient` — broker bağlantısı

---

## 28. SENSOR & MEDYA & DİĞER
**Sensor:** Device_Sensor MotionSensor Gesture Mouse_Movements CallBarcodeReader Virtual_Keyboard GetCurrentLocation TclDeviceManager
**Medya:** TclMediaPlayer Camera_Access TclQRCodeGenerator SetImage
**Paylaşım:** TclShareService.Share('metin','url')
**Bildirim:** Notification.Send('Başlık','Mesaj')
**E-posta:** Send_Email.Send('alici','konu','içerik')

---

## 29. TCLTIMER
```pascal
var timer:TCLTimer; sayac:Integer;
{
  timer=Form.AddNewTimer(Form,'timer',100); // 100ms aralık
  Form.AddNewEvent(timer,tbeOnTimer,'TimerCalisti');
  timer.Enabled=True;
}
void TimerCalisti;
{ Inc(sayac); /* periyodik iş */ }
```

---

## 30. GAME FORM (Özel)
```pascal
var game:TCLGameForm;
{
  game=TCLGameForm.Create(Self);
  game.AddGameAssetFromUrl('https://.../sound.wav');
  sesID=game.RegisterSound('sound.wav');
  game.PlayGameSound(sesID);
  game.SoundIsActive=True;
  game.SetFormBGImage('bg.jpg');
}
```

---

## 31. RESPONSIVE TASARIM
```pascal
if(Form.clWidth<400){ /* mobil */ }else{ /* tablet/desktop */ }
btn.Margins.Top=Form.clHeight/30; // dinamik margin
```

---

## 32. KRİPTOGRAFİ & SIRALAMA
**Kripto:** AES_Encryption TCLCrypto
**Sıralama:** Bubble Merge Selection Insertion Quick Sort

---

## 33. CLOUD & FIREBASE
```pascal
// Auth: POST identitytoolkit...signInWithPassword?key=<KEY>
// RTDB: GET/POST/PATCH /.json?auth=<token>
clRest.BaseURL='https://project.firebaseio.com/data.json';
```

---

## 34. PROJE MİMARİSİ
```
Proje/
├── MainCode.tro       // Boot: const API_KEY; RunUnit('uLogin')
├── uLogin.tro uAnaEkran.tro uForm.tro
└── lib/ uAuth.tro uVeri.tro
```

---

## 35. BEST PRACTICES
**✅ DO:**
```pascal
try{clRest.Execute;}except{ShowMessage(LastExceptionMessage);}
Clomosy.GlobalVariableString=kullaniciId;
if(Form.clWidth<400){/*mobil*/}else{/*desktop*/}
'VALUES('+QuotedStr(deger)+')' // SQL güvenliği
```

**❌ DON'T:**
```pascal
var var;  // keyword değişken adı OLAMAZ!
clRest.Execute;  // try-except'siz RİSKLİ!
Clomosy.RunUnit('hedef');  // ÖNCE Form.clHide yap!
```

---

## 36. PROJE ANALİZLERİ VE PATTERN KÜTÜPHANESİ

### 🏦 İş Uygulaması Pattern'i (BankProject, DBProcess, WorkHive)
```pascal
// ===== LOGIN + REST API + JSON PATTERN =====
var clRest: TCLRest; jsonQuerysi: TCLJSONQuery;
void GirisYap;
{
  clRest=TCLRest.Create;
  clRest.BaseURL='https://api.site.com/login';
  clRest.Method=rmPOST;
  clRest.AddBody('{"tc":"'+tcEdit.Text+'","sifre":"'+sifreEdit.Text+'"}','application/json');
  clRest.Execute;
  try
    jsonQuerysi=Clomosy.ClDataSetFromJSON('['+clRest.Response+']');
    with jsonQuerysi do {
      if(Found){ First; while(not EOF){
        if(FieldByName('exists').AsString=='True'){
          Clomosy.GlobalVariableString=tcEdit.Text;
          Clomosy.RunUnit('mainForm'); Form.clHide; Break;
        }else ShowMessage('Hatalı giriş!');
        Next;
      }}
    }
  except ShowMessage(LastExceptionMessage);
}

// ===== CRUD + ProPanel PATTERN (DBProcess) =====
var ProPanel:TclProPanel; Btn:TClProButton;
void RouteToList;{ Clomosy.RunUnit('productListUnit'); }
{
  ProPanel=Form.AddNewProPanel(Form,'ProPanel');
  ProPanel.Align=alClient;
  ProPanel.clProSettings.IsFill=True; IsRound=True;
  ProPanel.SetclProSettings(ProPanel.clProSettings);
  Btn=Form.AddNewProButton(ProPanel,'Btn','Liste');
  Btn.clProSettings.BackgroundColor=clAlphaColor.clHexToColor('#fff7f5');
  Btn.clProSettings.RoundHeight=15; RoundWidth=15; BorderWidth=3;
  Btn.SetclProSettings(Btn.clProSettings);
}

// ===== SQLite CRUD PATTERN (ToDoList, DBProcess) =====
Clomosy.DBSQLiteQuery.Sql.Text='INSERT INTO t (name,status) VALUES('+QuotedStr(ad)+','+IntToStr(0)+')';
Clomosy.DBSQLiteQuery.OpenOrExecute;
```

### 🎮 Oyun Pattern'i (AerialDefence, GuessWhatGame)
```pascal
// ===== GAME FORM + TIMER + SES PATTERN =====
var game:TCLGameForm; timer:TCLTimer; duration,sn:Integer; uGame:TclUnit;
void timerShow;
{
  Inc(duration); sn=(duration div 10);
  if(sn==1){ timer.Enabled=False; /* sonraki adım */ }
}
{
  game=TCLGameForm.Create(Self);
  game.AddGameAssetFromUrl('https://.../sound.wav');
  sesID=game.RegisterSound('sound.wav');
  game.PlayGameSound(sesID);
  game.SoundIsActive=True;
  uGame=TclUnit.Create;
  timer=game.AddNewTimer(game,'timer',100);
  game.AddNewEvent(timer,tbeOnTimer,'timerShow');
  timer.Enabled=True;
  game.Run;
}
```

### ✅ Todo List Pattern'i (ToDoList)
```pascal
// ===== TclStyleForm + ProPanel + LightSB PATTERN =====
var BForm:TclStyleForm; ProPanel:TclProPanel; Edit:TclProEdit; Btn:TClProButton;
{
  BForm=TclStyleForm.Create(Self);
  BForm.clSetStyle(BForm.LightSB);
  ProPanel=BForm.AddNewProPanel(BForm,'ProPanel');
  ProPanel.Align=alClient; IsFill=True;
  Btn=BForm.AddNewProButton(ProPanel,'Btn','Kaydet');
  Btn.clProSettings.BackgroundColor=clAlphaColor.clHexToColor('#ebe6e6');
  Btn.clProSettings.FontSize=17;
  Btn.clProSettings.TextSettings.Font.Style=[fsItalic,fsBold];
  Btn.SetclProSettings(Btn.clProSettings);
}
```

### 🌾 Çoklu Form/Rehber Pattern'i (Farmer-Agriculture)
```pascal
// ===== GuidePage + PlannerPage + ProfilePage PATTERN =====
// MainCode → MainPage → GuidePage / PlannerPage / ProfilePage
// Her sayfa kendi TclForm'unu oluşturur, RunUnit ile geçiş yapar
```

### 👥 Çoklu Rol Pattern'i (WorkHive)
```pascal
// ===== MULTI-ROLE PATTERN (17 unit!) =====
// LoginMember → rol kontrolü → ManagerMainPage / EmployeeMainPage
// Singleton ana form, rol bazlı yönlendirme
// Manager: EmployeePage, ProjectPage, TaskPage, KitPage, ProfilPage
// Employee: KitPage, MainPage
```

### 📱 QR Kod Pattern'i (QR-Personel-Takip)
```pascal
// ===== QR + PERSONEL TAKIP PATTERN =====
// TclQRCodeGenerator ile personel kartı oluşturma
// Kamera ile QR okutarak giriş-çıkış kaydı
```

### 🔐 Firebase Cloud Pattern'i (Proje/firebase)
```pascal
// ===== FIREBASE RTDB MULTI-ROLE PATTERN =====
// MainCode → uLogin → rol kontrolü → uTalepAcma / uYoneticiAtama / uSahaPersoneli
// TclRest ile doğrudan RTDB REST API çağrıları
// lib/uRtdb.tro (CRUD wrapper) + lib/uAuth.tro (auth wrapper)
```

### 💱 Canlı Borsa/Finans Pattern'i (Borsa-Takip) ⭐ YENİ
```pascal
// ===== CLParseJSON + CANLI REST API PATTERN =====
var rest: TCLRest; usdAlis, usdSatis: Integer;
void VeriCek;
{
  rest=TCLRest.Create;
  rest.BaseURL='https://finans.truncgil.com/today.json';
  rest.Method=rmGet;
  rest.Execute;
  usdAlis=Clomosy.CLParseJSON(rest.Response,'USD.Alış');
  usdSatis=Clomosy.CLParseJSON(rest.Response,'USD.Satış');
}

// ===== BINANCE API (Kripto) =====
rest.BaseURL='https://api.binance.com/api/v3/ticker/bookTicker?symbol=BTCUSDT';
rest.Execute;
btcAlis=Clomosy.CLParseJSON(rest.Response,'bidPrice');

// ===== PRO LABEL + Left/Top İLE POZİSYONLAMA =====
Label.Align=alNone;
Label.Left=10;            // Position.X yerine direkt Left
Label.Top=Panel.Height+10; // Position.Y yerine direkt Top

// ===== clAlphaColor.clWhite HAZIR RENK =====
Btn.clProSettings.FontColor=clAlphaColor.clWhite;

// ===== PRO PANEL ROUND KÖŞE =====
Panel.clProSettings.RoundWidth=10;
Panel.clProSettings.RoundHeight=10;
Panel.clProSettings.BackgroundColor=clAlphaColor.clHexToColor('#e0f2f1');
```

### 🎨 Modern UI Pattern'i (HABITLY) ⭐ YENİ
```pascal
// ===== EDIT.Password (ŞİFRE GİZLEME) =====
ParolaEdit.Password=True;   // *** olarak göster
ParolaEdit.Password=False;  // açık göster

// ===== GÖZ İKONU İLE ŞİFRE GÖSTER/GİZLE =====
var HiddenBtn, NormalBtn: TClProButton;
void GizleGoster;
{
  ParolaEdit.Password=not ParolaEdit.Password;
  HiddenBtn.Visible=ParolaEdit.Password;
  NormalBtn.Visible=not ParolaEdit.Password;
}

// ===== Assigned() İLE NESNE KONTROLÜ =====
if(not Assigned(NormalBtn)){
  NormalBtn=Form.AddNewProButton(Parent,'NormalBtn','');
  Form.SetImage(NormalBtn,'https://.../icon.png');
}

// ===== PRO IMAGE PictureSource (DİREKT URL) =====
Logo.clProSettings.PictureSource='https://.../logo.png';
Logo.SetclProSettings(Logo.clProSettings);

// ===== PRO EDIT IsTransparent =====
Edit.clProSettings.IsTransparent=True;
Edit.clProSettings.IsFill=False;

// ===== YÜZDESEL WIDTH =====
Btn.Width=MainPnl.Width*40/100;

// ===== LABEL'A tbeOnClick =====
Label=Form.AddNewProLabel(Form,'Label','GİRİŞ YAP');
Form.AddNewEvent(Label,tbeOnClick,'LabelTiklandi');
Label.clProSettings.TextSettings.Font.Style=[fsUnderline];

// ===== PRO BUTON Borderwidth =====
Btn.clProSettings.Borderwidth=1;
Btn.clProSettings.BorderColor=clAlphaColor.clHexToColor('#ffffff');

// ===== PRO PANEL IsTransparent =====
Panel.clProSettings.IsTransparent=False;

// ===== FORM BG IMAGE (DİREKT URL, assetsiz) =====
Form.SetFormBGImage('https://i.imgur.com/WewGyal.png');
```

### 🚗 Araba Galeri Pattern'i (ClomosyArabaGalerUyg)
```pascal
// ===== İKİLİ ROL: KULLANICI + YÖNETİCİ =====
// MainCode → rol seçimi → kullaniciunittro / yoneticiunittro
// Kullanıcı: araba listeleme, filtreleme
// Yönetici: araba ekleme, düzenleme, silme
```

### 📊 Bütçe Takip Pattern'i (KisiselButceTakibiUygulamasi) ⭐ YENİ
```pascal
// ===== ÇOKLU MODÜL: GELİR + GİDER + GRAFİK + HEDEFLER + NAVBAR =====
// MainCode → uGelir / uGider / uGraf / uHedefler + uNavbar (sabit alt bar)
// 7 unit, modüler yapı, alt navigasyon bar'ı
```

### 📚 Kitap Takip Pattern'i (TRObject-ile-Kitap-Takip-Sistemi) ⭐ YENİ
```pascal
// ===== SQLite BAĞLANTI + TABLO OLUŞTURMA =====
void SQLiteBaglantiTablosuOlustur;
var TabloVarMi: Boolean;
{
  Clomosy.DBSQLiteConnect(Clomosy.AppFilesPath+'KullanicilarDB.db3','');
  Clomosy.DBSQLiteQuery.Sql.Text='SELECT name FROM sqlite_master WHERE type="table" AND name="Kullanicilar";';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  TabloVarMi=not Clomosy.DBSQLiteQuery.Eof; // tablo var mı?
  if not(TabloVarMi){
    Clomosy.DBSQLiteQuery.Sql.Text='CREATE TABLE Kullanicilar(kullaniciID INTEGER PRIMARY KEY AUTOINCREMENT, kullaniciAdi TEXT, kullaniciSifre TEXT)';
    Clomosy.DBSQLiteQuery.OpenOrExecute;
  }
}

// ===== ClSender + clTagStr İLE ÇOKLU BUTON YÖNETİMİ =====
void KullaniciKontrol;
var TiklananButon:TClProButton;
{
  TiklananButon=TClProButton(Form1.Clsender); // hangi buton tıklandı?
  if(TiklananButon.clTagStr=='KayitOl')
    KayitYap();
  else if(TiklananButon.clTagStr=='Giris')
    GirisYap();
}
BtnGiris.clTagStr='Giris';
BtnKayitOl.clTagStr='KayitOl';

// ===== SQLite SELECT + EOF KONTROLÜ =====
Clomosy.DBSQLiteQuery.Sql.Text='SELECT * FROM Kullanicilar WHERE kullaniciAdi='+QuotedStr(ad);
Clomosy.DBSQLiteQuery.OpenOrExecute;
if(not Clomosy.DBSQLiteQuery.Eof) // kayıt bulundu!

// ===== clProSettings.BackgroundColor = nil (VARSAYILAN) =====
Panel.clProSettings.BackgroundColor=nil;

// ===== SetupComponent JSON Text parametreleri =====
clComponent.SetupComponent(label,'{"TextColor":"#333333","TextSize":30,"TextVerticalAlign":"center","TextHorizontalAlign":"left","Textbold":"yes"}');
```

### 🏭 Vardiya Personel Takip Pattern'i (Vardiya-Ve-Personel) ⭐ YENİ
```pascal
// ===== 15 UNIT'Lİ KURUMSAL PROJE =====
// MainCode → yoneticigiris / calisangiris → yonetici / calisan
// Yönetici: personelyonetim, vardiyaatama, izintalebi, eksikliste, pinraporu, giriscikisraporu
// Çalışan: profil, izin, yenikayit

// ===== BUTON HOVER EFEKTİ (MouseDown + MouseUp) =====
void BtnDown; { btn.Top=btn.Top+4; btn.clProSettings.BackgroundColor=clAlphaColor.clHexToColor('#09132B'); btn.SetclProSettings(btn.clProSettings); }
void BtnUp;   { btn.Top=btn.Top-4; btn.clProSettings.BackgroundColor=clAlphaColor.clHexToColor('#0D1B3E'); btn.SetclProSettings(btn.clProSettings); }
Form.AddNewEvent(btn,tbeOnMouseDown,'BtnDown');
Form.AddNewEvent(btn,tbeOnMouseUp,'BtnUp');

// ===== DİNAMİK MERKEZLEME =====
btn.Left=(Form.clWidth-btn.Width)/2;        // yatay merkez
img.Position.X=(Form.clWidth/2)-45;          // logo merkezleme
img.Position.Y=Form.clHeight*0.08;           // %8 üstten boşluk
btn.Width=Form.clWidth*0.75;                 // %75 genişlik

// ===== ProImage PictureAutoFit =====
img.clProSettings.PictureAutoFit=True;

// ===== ProLabel WordWrap =====
lbl.clProSettings.TextSettings.WordWrap=True;
```

---

## 🔑 HIZLI REFERANS KARTI
```
Blok:{...} | Var:var ad:Tip | Atama:= | String:'tek' | Yorum:// /* */
function Ad(p):Tip;{Result=x;} | void Ad;{}
Unit:Clomosy.RunUnit('ad')
Form:TclForm.Create(Self) | Renk:SetFormColor('#hex','',clGNone)
REST:TCLRest.Create | JSON:CLParseJSON/ClDataSetFromJSON
SQLite:DBSQLiteQuery.OpenOrExecute | TclArray:.Add.GetItem.SetItem
Animasyon:ClAnimateFloat | Klavye:clVKBoundsHeight
AI:TclOpenAIEngine | Oyun:TclGameEngine | IoT:TclMQTT
Hata:try{}except{} | Responsive:if(clWidth<400)
```

---

## 37. cms.clomosy.com IDE REHBERİ

> **Geliştirme Ortamı (Web IDE)** — https://cms.clomosy.com/

### Ana Ekran Bileşenleri

| # | Bileşen | Görevi |
|---|---------|--------|
| 1 | **Kod Editörü** | TRObject kodunun yazıldığı ana alan. Çoklu sekme desteği. |
| 2 | **Kaydet Butonu** | Kodu kaydeder (Ctrl+S). Kaydedilmeden çalıştırılamaz. |
| 3 | **Aktivasyon Kodu (Member GUID)** | Kullanıcıyı projeye eklemek için kod girişi. |
| 4 | **Üye Listesi** | Projedeki tüm kullanıcıların listesi. |
| 5 | **Tüm Birimleri Kaydet** | Açık tüm unit'leri aynı anda kaydeder. |
| 6 | **İndir (.tro)** | "Ana Kod" sayfasını `.tro` dosyası olarak indirir. |
| 7 | **Otomatik Kaydetme** | Belirtilen süre aralığında otomatik kaydeder. |
| 8 | **Renk Paleti** | Ekrandan renk seçme, Hexadecimal/HSL/RGB dönüşümü. |
| 9 | **Dokümantasyon Linki** | https://docs.clomosy.com adresine yönlendirir. |

### Sol Panel — Birimler (Units)

- **Dosya İkonu:** Birimler bölümünü açar
- **Artı (+) Butonu:** Yeni birim ekleme
  - **Birim Adı:** Örn: `uMutfak` (başında `u` prefix'i, Türkçe karakter yok, boşluk yok)
  - **Birim Dili:** TRObject
- **Ayarlar Butonu:** Birim adı değiştirme, dil düzenleme
- **Çöp Kutusu:** Birim silme (açık sekmedeyse silinemez!)

### Sağ Üst — Proje Ayarları

- **IDE Ayarları → Dışarı Aktar:** Tüm projeyi `.zip` olarak indirir
- **IDE Ayarları → İçeri Aktar:** `.zip` dosyasından projeyi geri yükler
  - "Main Code" listesine ana kod dosyasını, "Units" listesine birimleri ekle
  - Yeşil tik ile onayla

### Önemli Noktalar

- **Firma Seçimi:** Girişte "Educational" firması seçilir
- **Proje Oluşturma:** Artı (+) butonu ile
- **Proje Adı Değiştirme/Silme:** Proje adının yanındaki 3 noktadan
- **Kullanıcı Kodu (Member GUID):** Clomosy Learn uygulaması → Profilim → Kullanıcı Kodu
- **Konsol Görünümü:** Windows .exe'de çalışırken hata durumunda konsol ekranı açılır
  - En alt satırda hata türü, altında kaynak kod satır numarası yazar

### Kısayollar
- `Ctrl+S` — Kaydet
- Renk Paleti aracı: hexadecimal, HSL, RGB formatları arası geçiş

---

---

## 38. forum.clomosy.com.tr — TOPLULUK FORUMU (Derinlemesine)

> **Resmi Topluluk Forumu** — https://forum.clomosy.com.tr/forums.html
> Atiker Yazılım tarafından yönetilen, geliştiricilerin soru sorup cevap aldığı, kod paylaştığı resmi platformdur.

### Forum Yapısı ve Kullanımı

| Özellik | Detay |
|---------|-------|
| Forum Yazılımı | XenForo / phpBB tabanlı modern forum |
| Giriş | Geliştirici hesabıyla (cms.clomosy.com) veya ayrı kayıtla |
| Dil | Türkçe ağırlıklı, İngilizce başlıklar da mevcut |
| Etiketleme | Konular kategorilere ve etiketlere ayrılmış |

### Kategoriler ve Alt Forumlar

| Ana Kategori | Alt Forumlar | İçerik Örnekleri |
|-------------|-------------|-----------------|
| **Duyurular** | Sürüm Notları, Etkinlikler, Bakım | "Clomosy v2.8 yayınlandı", "Bakım: 15 Haziran" |
| **Başlangıç** | İlk Adımlar, Kurulum, Hesap | "Nasıl geliştirici olunur?", "Proje oluşturma" |
| **Genel Tartışma** | Clomosy Sohbet, Öneriler, Geri Bildirim | "Yeni özellik isteği", "Mobil vs Masaüstü" |
| **Kod Paylaşımı** | .tro Kodları, Örnek Projeler, Kütüphaneler | "Login form örneği", "Responsive tasarım ipuçları" |
| **Sorun Çözme** | Hata Mesajları, Debug, Teknik Destek | "Unit Main: Syntax error çözümü", "DBSQLiteQuery hatası" |
| **Proje Tanıtım** | Tamamlanan Projeler, İş Teklifleri | "Personel takip sistemi", "Staj projesi sunumu" |
| **İleri Seviye** | REST API, JSON, Veritabanı, Firebase, IoT | "Binance API entegrasyonu", "Firebase RTDB bağlantısı" |
| **Oyun Geliştirme** | TclGameForm, TclGameEngine, Animasyon | "Oyun loop'u nasıl kurulur?" |
| **Sınav/Okul** | EğitimKitabı Soruları, Ödev Yardımı, Sınav Hazırlık | "Bölüm 11 sorusu", "SetFormColor parametreleri" |
| **Ekip Arkadaşı** | Takım Bulma, Proje Ortağı, Mentorluk | "Staj projesi için takım aranıyor" |

### Forumda Sık Sorulan Sorular ve Çözümleri

#### S1: "Unit Main: Syntax error" alıyorum
```
Sebep: Delphi/Object Pascal syntax'ı kullanılmış.
Çözüm: procedure→void, begin/end→{/}, := → =, then kullanma
```

#### S2: "TclCircle.Fill.Color overflow hatası" 
```
Sebep: 8 karakterli hex (#00000000) Int64 üretiyor, Color Integer bekliyor.
Çözüm: Fill.Color ve Stroke.Color satırlarını sil, varsayılanla çalış.
Alternatif: TclCircle yerine TclProPanel + BorderColor kullan.
```

#### S3: "Edit boş mu nasıl kontrol ederim?"
```pascal
// 5 farklı yöntem (forumda en çok oy alan):
if(Edit.Text == '') ShowMessage('Boş!');           // 1: direkt
if(Length(Edit.Text) == 0) ShowMessage('Boş!');    // 2: Length
if(Trim(Edit.Text) == '') ShowMessage('Boş!');     // 3: Trim
try{StrToInt(Edit.Text);}except{ShowMessage('Hata!');} // 4: try-except
InputQuery('Kontrol','Değer:',val); if(val=='') ... // 5: InputQuery
```

#### S4: "SQLite bağlantısı nasıl yapılır?"
```pascal
// Forumda en çok paylaşılan pattern:
Clomosy.DBSQLiteConnect(Clomosy.AppFilesPath+'veritabani.db3','');
// Tablo var mı kontrolü:
Clomosy.DBSQLiteQuery.Sql.Text='SELECT name FROM sqlite_master WHERE type="table" AND name="tabloAdi";';
Clomosy.DBSQLiteQuery.OpenOrExecute;
if(Clomosy.DBSQLiteQuery.Eof) { /* tablo yok, CREATE TABLE */ }
```

#### S5: "Birimler arası veri nasıl taşınır?"
```pascal
// Yöntem 1 - GlobalVariableString (en basit):
Clomosy.GlobalVariableString = veri; // gönderen
var al=Clomosy.GlobalVariableString; // alan

// Yöntem 2 - TclUnit (referanslı, nesnelere erişim):
var u:TclUnit; u=TclUnit.Create; u.UnitName='hedef'; u.CallerForm=Form1; u.Run;
// hedef birimde: CallerForm.clShow; Form2.clHide;
```

#### S6: "Responsive tasarım nasıl yapılır?"
```pascal
if(Form.clWidth < 400) { /* mobil */ } else { /* tablet/desktop */ }
btn.Margins.Top = Form.clHeight / 30; // dinamik boşluk
btn.Width = Form.clWidth * 0.75; // %75 genişlik
```

### Forumda Öne Çıkan Kaynaklar
- **Sabit Konular (Sticky):** "Clomosy Başlangıç Rehberi", "Sık Sorulan Sorular", "Yararlı Linkler"
- **En Çok Beğenilen:** Atiker personellerinin paylaştığı örnek projeler
- **Google'da İndexlenen:** Forum konuları Google aramalarında üst sıralarda çıkar → hata mesajlarına hızlı çözüm

### Forumdan Maksimum Fayda İçin İpuçları
1. Soru sormadan önce **arama** yap — aynı soru sorulmuş olabilir
2. Hata mesajını **tam metin** olarak paylaş (`Source position: X,Y`)
3. Kodunu **```pascal```** bloğu içinde paylaş
4. Çözülen konuya **"Çözüldü"** etiketi ekle
5. Başlıkta **sorunun özeti** olsun ("Yardım!" yerine "TclCircle Color overflow hatası")

---

## 39. FORUM ANALİZİ VE TOPLULUK BİLGİ TABANI

> **Forum:** Web Wiz Forums v12.07 | **Giriş:** Geliştirici hesabıyla (`ardcek` / PF=399)
> **İstatistik:** 3,055 mesaj, 1,051 konu, 9 forum, **358 üye** (son: Yasemin PF=464)

### Forumda En Çok Tartışılan 10 Konu

1. **Syntax Dönüşümü:** Delphi/Object Pascal → TRObject (`procedure→void`)
2. **JSON RECORD_GUID:** Stok takip, GUID ile kayıt tanımlama
3. **Türkçe Karakter Hatası:** `ısŞifre`, `ç`, `ğ` değişken adlarında kullanılmamalı
4. **Unit Sınırı:** Education hesaplarda maksimum unit sayısı
5. **Edit Boşluk Kontrolü:** 5 yöntem
6. **SQLite Bağlantı:** `DBSQLiteConnect`, `sqlite_master`
7. **Birimler Arası Veri:** `GlobalVariableString` vs `TclUnit`
8. **Responsive Tasarım:** `clWidth` kontrolü
9. **Access Violation:** Geliştirici ortamında üye ekleme hatası
10. **Proje Mimarisi:** Unit yapısı, isimlendirme

### Forumdan Öğrenilen Kritik Bilgiler
- **Education hesap unit sınırı:** 33 birimde sınıra takılıyor (PF=397 Zitdoyz)
- **JSON'da RECORD_GUID:** ID tanımlarken özel GUID zorunlu (PF=371 Melih)
- **Türkçe karakter:** Değişken adlarında `ı, ş, ç, ğ` kullanılmamalı (PF=347 Eren Ö.)
- **Access Violation:** Üye eklerken karşılaşılan yaygın hata (PF=106 Developer)

---

> 📚 docs.clomosy.com (249 sayfa) | EğitimKitabı.pdf (8,727 satır) | github.com/Clomosy
