// Ace Editörünü Başlat
const editor = ace.edit("editor-container");

// Ace'i tema, mod ve worker'ları resmi CDN'den dinamik yükleyecek şekilde yapılandır
ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.7/');

// --- Custom TRObject (Clomosy) Mode Definition ---
ace.define("ace/mode/trobject_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (require, exports, module) {
  "use strict";
  var oop = require("../lib/oop");
  var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

  var TRObjectHighlightRules = function () {
    this.$rules = {
      "start": [
        { token: "comment", regex: "\\/\\/.*$" },
        { token: "comment", regex: "\\/\\*", next: "comment" },
        { token: "string", regex: "'.*?'" },
        { token: "string", regex: '".*?"' },
        
        // Sayılar (300, 45, vb.) -> Clomosy IDE'sinde olduğu gibi Yeşil (Dracula'da entity.name.function yeşildir)
        { token: "entity.name.function", regex: "\\b\\d+(?:\\.\\d+)?\\b" },
        
        // Anahtar Kelimeler (var, void, self vb.) -> Açık Mavi/Camgöbeği (Dracula'da support.type)
        { token: "support.type", regex: "\\b(?:var|void|if|else|while|for|try|except|finally|begin|end|class|type|procedure|function|do|then|break|continue|exit|return|const|case|switch|default|true|false|nil|True|False|Nil|Self|self)\\b", caseInsensitive: true },
        
        // Operatörler ve Noktalama İşaretleri ( { } ( ) . , ; : = ) -> Pembe (Dracula'da keyword.operator)
        { token: "keyword.operator", regex: "[\\{\\}\\(\\)\\[\\]\\.\\,\\;\\:\\=\\<\\>\\+\\-\\*\\/]" },
        
        // Geri kalan her şey (ShowMessage, TclForm, değişken isimleri vb.) eşleşmeyip varsayılan olarak Düz Beyaz (text) kalacak.
        { token: "text", regex: "\\s+" }
      ],
      "comment": [
        { token: "comment", regex: "\\*\\/", next: "start" },
        { defaultToken: "comment" }
      ]
    };
  };

  oop.inherits(TRObjectHighlightRules, TextHighlightRules);
  exports.TRObjectHighlightRules = TRObjectHighlightRules;
});

ace.define("ace/mode/trobject", ["require", "exports", "module", "ace/lib/oop", "ace/mode/javascript", "ace/mode/trobject_highlight_rules"], function (require, exports, module) {
  "use strict";
  var oop = require("../lib/oop");
  var JavaScriptMode = require("./javascript").Mode;
  var TRObjectHighlightRules = require("./trobject_highlight_rules").TRObjectHighlightRules;

  var Mode = function () {
    JavaScriptMode.call(this);
    this.HighlightRules = TRObjectHighlightRules;
  };
  oop.inherits(Mode, JavaScriptMode);
  
  (function () {
    this.createWorker = function(session) { return null; }; // JS Linter worker'ını kapat
    this.$id = "ace/mode/trobject";
  }).call(Mode.prototype);

  exports.Mode = Mode;
});
// --------------------------------------------------

// Dil araçlarını etkinleştir (otomatik tamamlama, kod şablonları)
editor.setOptions({
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  enableSnippets: true,
  fontSize: "14px",
  theme: "ace/theme/dracula",
  mode: "ace/mode/javascript"
});

// Farklı programlama dilleri için başlangıç şablonları
const codeTemplates = {
  javascript: `// Ace Editör - JavaScript API Demosu
class AceShowcase {
  constructor(editorInstance) {
    this.editor = editorInstance;
    this.features = ['Renklendirme', 'Otomatik Tamamlama', 'Temalar'];
  }

  logFeatures() {
    console.log("Ace Editör Destekleri: " + this.features.join(", "));
  }
}

// Sınıfı oluştur ve logla
const playground = new AceShowcase(editor);
playground.logFeatures();`,

  html: `<!-- Ace Editör - HTML Yapısı Demosu -->
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Canlı Önizleme Testi</title>
  <style>
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 90vh;
      margin: 0;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    button {
      background: #6366f1;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      margin-top: 15px;
      transition: background 0.2s;
    }
    button:hover {
      background: #4f46e5;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>Ace JS Canlı Önizleme</h2>
    <p>Bu alan editörde yazdığınız HTML/CSS kodları ile eşzamanlı çalışır.</p>
    <button onclick="showMessage()">Etkileşim Testi</button>
  </div>

  <script>
    function showMessage() {
      alert("HTML içerisindeki JS başarıyla tetiklendi!");
      console.log("Canlı önizlemedeki butona tıklandı!");
    }
  </script>
</body>
</html>`,

  css: `/* Ace Editör - CSS Tasarım Demosu */
body {
  background: #090d16;
  color: #a5b4fc;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 40px;
  text-align: center;
}

.box {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  width: 200px;
  height: 200px;
  margin: 30px auto;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}`,

  python: `# Ace Editör - Python Betiği Demosu
import json

class AceAnalyzer:
    def __init__(self, data):
        self.data = json.loads(data)
        
    def analyze_metadata(self):
        print(f"Proje Adı: {self.data.get('name', 'Bilinmiyor')}")
        print(f"Modül Sayısı: {len(self.data.get('features', []))}")

json_data = '{"name": "Ace JS", "features": ["Autocompletion", "Multiple Cursors"]}'
analyzer = AceAnalyzer(json_data)
analyzer.analyze_metadata()`,

  json: `{
  "name": "Ace Editor Showcase",
  "version": "2.0.0",
  "description": "Ace JS API ile etkileşimli Web IDE dökümantasyonu",
  "private": true,
  "dependencies": {
    "ace-builds": "^1.32.7",
    "js-beautify": "^1.14.9"
  },
  "config": {
    "theme": "dracula",
    "mode": "javascript",
    "vimMode": false
  }
}`,

  sql: `-- Ace Editör - SQL Sorgu Demosu
SELECT 
    p.project_name AS ProjeAdi,
    COUNT(f.file_id) AS ToplamTroDosyasi,
    SUM(f.lines_count) AS ToplamKodSatiri
FROM 
    clomosy_projects p
LEFT JOIN 
    project_files f ON p.project_id = f.project_id
WHERE 
    f.file_extension = '.tro'
GROUP BY 
    p.project_name
ORDER BY 
    ToplamKodSatiri DESC;`,

  pascal: `// Ace Editör - Clomosy TRObject (Delphi/Pascal) Betiği Demosu
var
  MyForm: TclForm;
  mainPnl: TclProPanel;
  testBtn: TClProButton;
  
void testBtnClick;
{
  ShowMessage('Ace Editor Showcase ile TRObject Kodları Deneyimi!');
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  mainPnl = MyForm.AddNewProPanel(MyForm, 'mainPnl');
  mainPnl.Align = alCenter;
  mainPnl.Width = 300;
  mainPnl.Height = 200;
  clComponent.SetupComponent(mainPnl, '{"BackgroundColor":"#1E293B", "RoundHeight":15, "RoundWidth":15}');
  
  testBtn = MyForm.AddNewProButton(mainPnl, 'testBtn', 'Tıkla!');
  testBtn.Align = alCenter;
  testBtn.Width = 140;
  testBtn.Height = 45;
  clComponent.SetupComponent(testBtn, '{"BackgroundColor":"#6366f1", "FontColor":"#ffffff", "RoundHeight":8}');
  
  MyForm.AddNewEvent(testBtn, tbeOnClick, 'testBtnClick');
  MyForm.Run;
}`
};

// Çoklu Dosya Yapısı Hafıza State'i (Düzenlemeleri kaybetmemek için)
const filesState = {
  javascript: codeTemplates.javascript,
  html: codeTemplates.html,
  css: codeTemplates.css,
  python: codeTemplates.python,
  json: codeTemplates.json,
  sql: codeTemplates.sql,
  pascal: codeTemplates.pascal
};
let currentActiveFile = null; // Başlangıçta hiçbir dosya açık değil

// Editörün başlangıç değerini boş geçelim (Hafıza state'ine göre yüklenecek)
editor.setValue("", -1);

// Düzenlemeleri gerçek zamanlı olarak hafızada (state) sakla
let autoRunTimeout;
editor.on("change", function () {
  if (currentActiveFile) {
    filesState[currentActiveFile] = editor.getValue();

    // Otomatik Çalıştır (Auto-Run) kontrolü (600ms gecikmeli)
    const autoRunToggle = document.getElementById("toggle-autorun");
    if (autoRunToggle && autoRunToggle.checked) {
      clearTimeout(autoRunTimeout);
      autoRunTimeout = setTimeout(() => {
        runLiveCode();
      }, 600);
    }
  }
});

// Konsol çıktısı simülasyon yardımcısı
function logToConsole(text, type = "system-msg") {
  const consoleLog = document.getElementById("console-log");
  const time = new Date().toLocaleTimeString();
  const line = document.createElement("div");
  line.className = `log-line ${type}`;
  line.innerText = `[${time}] ${text}`;
  consoleLog.appendChild(line);
  consoleLog.scrollTop = consoleLog.scrollHeight;
}

// ----------------------------------------------------
// Arayüz Kontrol Olay Dinleyicileri
// ----------------------------------------------------

// Tema Seçici
document.getElementById("theme-select").addEventListener("change", function (e) {
  const theme = e.target.value;
  editor.setTheme("ace/theme/" + theme);
  logToConsole(`Tema güncellendi: ace/theme/${theme}`, "api-call");
});

// Mod (Dil) Seçici
document.getElementById("mode-select").addEventListener("change", function (e) {
  const val = e.target.value;
  switchFileTab(val);
});

// Çoklu Sekmeli Dosya Geçiş Fonksiyonu
// Çoklu Sekmeli Dosya Geçiş Fonksiyonu
function switchFileTab(fileKey) {
  if (!fileKey) return;
  currentActiveFile = fileKey;

  // Arayüzdeki dropdown'ı senkronize et
  document.getElementById("mode-select").value = fileKey;

  // Ace editör modunu ve tab dosya ismini güncelle
  let mode = fileKey;
  let filename = "script.js";
  switch (fileKey) {
    case 'javascript': mode = 'javascript'; filename = 'script.js'; break;
    case 'html': mode = 'html'; filename = 'index.html'; break;
    case 'css': mode = 'css'; filename = 'style.css'; break;
    case 'python': mode = 'python'; filename = 'main.py'; break;
    case 'json': mode = 'json'; filename = 'package.json'; break;
    case 'sql': mode = 'sql'; filename = 'queries.sql'; break;
    case 'pascal': mode = 'trobject'; filename = 'mainCode.tro'; break;
  }

  // Gizli olan dosya sekmesini görünür kıl
  const tabEl = document.querySelector(`.file-tabs .tab[data-file="${fileKey}"]`);
  if (tabEl) {
    tabEl.style.display = "flex";
  }

  // Önizleme sekmelerini görünür yap
  document.getElementById("preview-tab-separator").style.display = "flex";
  document.getElementById("tab-preview-btn").style.display = "flex";

  // Hoşgeldiniz ekranını gizle, editör alanını aktif et
  document.getElementById("welcome-screen").classList.remove("active");
  document.getElementById("editor-container").classList.add("active");

  editor.session.setMode("ace/mode/" + mode);

  const dropdownOpt = document.querySelector(`#mode-select option[value="${fileKey}"]`);
  document.getElementById("status-lang").innerText = `Dil: ${dropdownOpt ? dropdownOpt.text : fileKey}`;

  // Kod içeriğini hafızadan (filesState) yükle
  editor.setValue(filesState[fileKey], -1);

  // Tab başlık stillerini güncelle (sadece dosya sekmeleri arasında)
  document.querySelectorAll(".file-tabs .tab[data-file]").forEach(tab => {
    if (tab.getAttribute("data-file") === fileKey) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  // Eğer split modunda değilsek editör görünümünü aktif et, önizleme sekmesinin active sınıfını kaldır
  if (!isSplitMode) {
    document.getElementById("tab-preview-btn").classList.remove("active");
    document.getElementById("editor-container").classList.add("active");
    document.getElementById("preview-container").classList.remove("active");
  }

  updateTemplateLibraryFilter(fileKey);
  if (typeof renderDocs === "function") {
    renderDocs(document.getElementById("docs-search-input") ? document.getElementById("docs-search-input").value : "");
  }

  // Koşullu simgeleri görünür kıl (güzel fade/slide efektiyle!)
  document.querySelectorAll(".activity-btn.conditional-btn").forEach(btn => {
    btn.classList.add("show-btn");
  });

  logToConsole(`Dosya açıldı/değiştirildi: ${filename} (Mod: ace/mode/${mode})`, "api-call");
}

// Klavye Düzeni (Vim / Emacs / Default)
document.getElementById("keybindings-select").addEventListener("change", function (e) {
  const mode = e.target.value;
  if (mode === "vim") {
    editor.setKeyboardHandler("ace/keyboard/vim");
    logToConsole("Klavye düzeni VIM olarak ayarlandı (Normal mod için ESC tuşuna basın).", "api-call");
  } else if (mode === "emacs") {
    editor.setKeyboardHandler("ace/keyboard/emacs");
    logToConsole("Klavye düzeni EMACS olarak ayarlandı.", "api-call");
  } else {
    editor.setKeyboardHandler(null);
    logToConsole("Klavye düzeni Varsayılan (Ace) olarak ayarlandı.", "api-call");
  }
});

// Girinti Boyutu (Tab Size)
document.getElementById("tab-size-select").addEventListener("change", function (e) {
  const size = parseInt(e.target.value);
  editor.session.setTabSize(size);
  logToConsole(`Girinti boyutu (Tab Size) güncellendi: ${size} boşluk`, "api-call");
});

// Yazı Boyutu Kaydırıcısı
const fontSizeSlider = document.getElementById("font-size-slider");
fontSizeSlider.addEventListener("input", function (e) {
  const size = e.target.value + "px";
  editor.setFontSize(size);
  document.getElementById("font-size-val").innerText = size;
});

// Satır Aralığı Kaydırıcısı
const lineHeightSlider = document.getElementById("line-height-slider");
lineHeightSlider.addEventListener("input", function (e) {
  const height = e.target.value;
  document.getElementById("editor-container").style.lineHeight = height;
  document.getElementById("line-height-val").innerText = height;
  editor.renderer.updateFull(); // Ace işleyicisini zorla yeniler
});

// Satır Numaraları Görünürlüğünü Aç/Kapat
document.getElementById("toggle-gutter").addEventListener("change", function (e) {
  editor.renderer.setShowGutter(e.target.checked);
  logToConsole(`Satır numaraları görünürlüğü: ${e.target.checked}`, "api-call");
});

// Metin Kaydırmayı Aç/Kapat
document.getElementById("toggle-wrap").addEventListener("change", function (e) {
  editor.session.setUseWrapMode(e.target.checked);
  logToConsole(`Metin aşağı kaydırma (Wrap): ${e.target.checked}`, "api-call");
});

// Baskı Kılavuzu Görünürlüğünü Aç/Kapat
document.getElementById("toggle-margin").addEventListener("change", function (e) {
  editor.setShowPrintMargin(e.target.checked);
  logToConsole(`Baskı kılavuzu görünürlüğü: ${e.target.checked}`, "api-call");
});

// Salt Okunur Modu Aç/Kapat
document.getElementById("toggle-readonly").addEventListener("change", function (e) {
  editor.setReadOnly(e.target.checked);
  logToConsole(`Salt Okunur (Read Only) modu: ${e.target.checked}`, "api-call");
});

// Aktif Satır Vurgusunu Aç/Kapat
document.getElementById("toggle-active-line").addEventListener("change", function (e) {
  editor.setHighlightActiveLine(e.target.checked);
  logToConsole(`Aktif satır vurgusu: ${e.target.checked}`, "api-call");
});

// Otomatik Tamamlama / Dil Araçlarını Aç/Kapat
document.getElementById("toggle-autocomplete").addEventListener("change", function (e) {
  editor.setOptions({
    enableBasicAutocompletion: e.target.checked,
    enableLiveAutocompletion: e.target.checked
  });
  logToConsole(`Akıllı otomatik tamamlama: ${e.target.checked}`, "api-call");
});

// Son Satırdan Sonra Kaydırma
document.getElementById("toggle-scroll-past-end").addEventListener("change", function (e) {
  editor.setOption("scrollPastEnd", e.target.checked);
  logToConsole(`Son satırdan sonra boş kaydırma: ${e.target.checked}`, "api-call");
});

// ----------------------------------------------------
// Durum Çubuğu Senkronizasyon Dinleyicileri
// ----------------------------------------------------
function updateStatusBar() {
  if (!currentActiveFile) return;
  const cursor = editor.getCursorPosition();
  document.getElementById("status-position").innerText = `Satır ${cursor.row + 1}, Sütun ${cursor.column + 1}`;

  const totalLines = editor.session.getLength();
  document.getElementById("status-lines").innerText = `Toplam: ${totalLines} Satır`;

  const selectedText = editor.getSelectedText();
  const selectedChars = selectedText ? selectedText.length : 0;
  document.getElementById("status-selection").innerText = `Seçim: ${selectedChars} karakter`;
}

// Seçim ve imleç değişikliklerini durum çubuğuna bağla
editor.session.selection.on("changeCursor", updateStatusBar);
editor.session.selection.on("changeSelection", updateStatusBar);
editor.session.on("change", updateStatusBar);

// ----------------------------------------------------
// Editör Araç Çubuğu Butonları
// ----------------------------------------------------

// Editörü Temizle
document.getElementById("btn-clear").addEventListener("click", function () {
  if (!currentActiveFile) return;
  editor.setValue("", -1);
  logToConsole("Editör temizlendi.", "system-msg");
});

// Kodu Sıfırla
document.getElementById("btn-reset").addEventListener("click", function () {
  if (!currentActiveFile) return;
  const currentLang = document.getElementById("mode-select").value;
  if (codeTemplates[currentLang]) {
    editor.setValue(codeTemplates[currentLang], -1);
    logToConsole("Kod varsayılan şablona sıfırlandı.", "system-msg");
  }
});

// -------------------------------------------------------
// TRObject (Pascal/Clomosy) Özel Biçimlendirici
// -------------------------------------------------------
function formatTRObject(code) {
  const INDENT = '  ';
  let lines = code.split('\n').map(l => l.trim());

  // Blok acma/kapama isaretlerini ayri satirlara tasi
  const expanded = [];
  for (const line of lines) {
    if (/\{[^}]+\}/.test(line) && !/^\s*\{/.test(line)) {
      expanded.push(line);
    } else if (/\{.+/.test(line) && line !== '{') {
      const parts = line.split('{');
      if (parts[0] && parts[0].trim()) expanded.push(parts[0].trim());
      expanded.push('{');
      if (parts[1] && parts[1].trim()) expanded.push(parts[1].trim());
    } else if (/.+\}/.test(line) && line !== '}') {
      const idx = line.lastIndexOf('}');
      const before = line.substring(0, idx).trim();
      if (before) expanded.push(before);
      expanded.push('}');
    } else {
      expanded.push(line);
    }
  }

  // Operatör bosluk düzenlemesi
  const spaced = expanded.map(line => {
    if (/^\s*\/\//.test(line)) return line;
    line = line.replace(/([^=!<>:])=([^=])/g, '$1 = $2');
    line = line.replace(/;([^\s])/g, '; $1');
    line = line.replace(/,([^\s])/g, ', $1');
    return line;
  });

  // Girinti uygula
  let depth = 0;
  const indented = [];
  for (const line of spaced) {
    if (line === '') { indented.push(''); continue; }
    if (line === '}' || line.startsWith('}')) depth = Math.max(0, depth - 1);
    indented.push(INDENT.repeat(depth) + line);
    if (line === '{' || line.endsWith('{')) depth++;
  }

  // Ardisik bos satirlari tek bos satira indir
  const result = [];
  let lastBlank = false;
  for (const line of indented) {
    const blank = line.trim() === '';
    if (blank && lastBlank) continue;
    result.push(line);
    lastBlank = blank;
  }
  return result.join('\n');
}

// Kodu Biçimlendir (JS-Beautify + TRObject özel biçimlendirici)
document.getElementById("btn-format").addEventListener("click", function () {
  if (!currentActiveFile) return;
  const mode = document.getElementById("mode-select").value;
  const code = editor.getValue();

  if (!code.trim()) {
    logToConsole("Biçimlendirilecek kod bulunamadı.", "system-msg");
    return;
  }

  // Pascal / TRObject dosyaları için özel biçimlendirici
  if (mode === "pascal") {
    try {
      const formatted = formatTRObject(code);
      editor.setValue(formatted, -1);
      logToConsole("TRObject (mainCode.tro) kodu başarıyla biçimlendirildi.", "result-success");
    } catch (e) {
      logToConsole("TRObject biçimlendirme hatası: " + e.message, "system-msg");
    }
    return;
  }

  // JS / HTML / CSS için beautifier.min.js CDN kütüphanesi
  const bfy = window.beautifier;
  if (!bfy) {
    logToConsole("Biçimlendirici kütüphanesi (js-beautify) yüklenemedi.", "system-msg");
    return;
  }

  let formatted = code;
  try {
    if (mode === "javascript" || mode === "json") {
      formatted = bfy.js(code, { indent_size: 2, space_in_empty_paren: true });
    } else if (mode === "html") {
      formatted = bfy.html(code, { indent_size: 2 });
    } else if (mode === "css") {
      formatted = bfy.css(code, { indent_size: 2 });
    } else {
      logToConsole(`"${mode}" dili için otomatik biçimlendirme henüz desteklenmiyor.`, "system-msg");
      return;
    }
    editor.setValue(formatted, -1);
    logToConsole("Kod başarıyla biçimlendirildi.", "result-success");
  } catch (e) {
    logToConsole("Biçimlendirme hatası: " + e.message, "system-msg");
  }
});

// Arama Arayüzünü Tetikle
document.getElementById("btn-search").addEventListener("click", function () {
  if (!currentActiveFile) return;
  editor.execCommand("find");
  logToConsole("Ace yerleşik arama paneli tetiklendi (Kapatmak için ESC tuşuna basın).", "api-call");
});

// Aktif Dosyayı İndir
document.getElementById("btn-download").addEventListener("click", function () {
  if (!currentActiveFile) {
    logToConsole("İndirilecek aktif bir dosya bulunamadı.", "system-msg");
    return;
  }

  let filename = "script.js";
  switch (currentActiveFile) {
    case 'javascript': filename = 'script.js'; break;
    case 'html': filename = 'index.html'; break;
    case 'css': filename = 'style.css'; break;
    case 'python': filename = 'main.py'; break;
    case 'json': filename = 'package.json'; break;
    case 'sql': filename = 'queries.sql'; break;
    case 'pascal': filename = 'mainCode.tro'; break;
  }

  const code = editor.getValue();
  const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  logToConsole(`Dosya bilgisayara indirildi: ${filename}`, "result-success");
});

// Konsol Logunu Temizleme Butonu
document.getElementById("clear-console-btn").addEventListener("click", function () {
  const consoleLog = document.getElementById("console-log");
  consoleLog.innerHTML = `<div class="log-line system-msg">Konsol temizlendi.</div>`;
});

// Aktif sekme durumunu tutan değişken (Bölme modu kapatıldığında geri dönmek için)
let currentActiveTab = "editor-view";
let isSplitMode = false;

function switchToTab(tabId) {
  if (tabId === "preview-view") {
    switchToPreviewTab();
  } else {
    // editor-view'a geçiş: aktif olan son dosyaya dön
    switchFileTab(currentActiveFile);
  }
}

function switchToPreviewTab() {
  if (isSplitMode) return; // Yan yana görünümdeyse sekme değiştirmeye gerek yok

  // Dosya sekmelerinin aktifliğini kaldır
  document.querySelectorAll(".file-tabs .tab[data-file]").forEach(tab => {
    tab.classList.remove("active");
  });

  // Önizleme sekmesini aktif et
  document.getElementById("tab-preview-btn").classList.add("active");

  // İçerikleri değiştir
  document.getElementById("editor-container").classList.remove("active");
  document.getElementById("preview-container").classList.add("active");

  runLiveCode();
}

function toggleSplitMode(forceState) {
  const windowContent = document.querySelector(".window-content");
  const splitBtn = document.getElementById("btn-split");

  isSplitMode = forceState !== undefined ? forceState : !isSplitMode;

  if (isSplitMode) {
    windowContent.classList.add("split-mode");
    splitBtn.classList.add("active-split");

    // Her iki sekme başlığını da aktif göster
    document.querySelectorAll(".file-tabs .tab").forEach(tab => {
      tab.classList.add("active");
    });

    runLiveCode();
    logToConsole("Yan Yana (Split) görünüm aktif edildi.", "system-msg");
  } else {
    windowContent.classList.remove("split-mode");
    splitBtn.classList.remove("active-split");

    // Aktif olan sekmeye geri dön
    switchFileTab(currentActiveFile);
    logToConsole("Yan Yana (Split) görünüm kapatıldı.", "system-msg");
  }

  // Editörün genişliğini yeniden hesapla
  setTimeout(() => {
    editor.resize();
  }, 50);
}

// Bölme butonu olayı
document.getElementById("btn-split").addEventListener("click", function () {
  let mode = document.getElementById("mode-select").value;
  if (!currentActiveFile) {
    // Hoşgeldiniz ekranındayken böl tuşuna basılırsa, varsayılan olarak HTML dosyasını açıp bölme yapalım!
    switchFileTab('html');
    mode = 'html';
  }

  if (mode === "html" || mode === "css" || mode === "javascript") {
    toggleSplitMode();
  } else {
    logToConsole("Yan yana görünüm sadece web çıktı dilleri (HTML/CSS/JS) için desteklenmektedir.", "system-msg");
  }
});

// Sekme Tıklama Dinleyicileri
document.querySelectorAll(".file-tabs .tab").forEach(tab => {
  tab.addEventListener("click", function () {
    const fileTarget = this.getAttribute("data-file");
    const tabTarget = this.getAttribute("data-tab");

    if (fileTarget) {
      // Bir dosya sekmesine tıklandı
      switchFileTab(fileTarget);
      editor.resize();
      editor.focus();
    } else if (tabTarget === "preview-view") {
      // Canlı Önizleme sekmesine tıklandı
      switchToPreviewTab();
    }
  });
});

// Hoş Geldiniz ekranındaki butonlar için global dosya açma fonksiyonu
window.openFileFromWelcome = function (fileKey) {
  switchFileTab(fileKey);
};

// Tab Kapatma Olaylarını Dinle
function bindTabCloseEvents() {
  document.querySelectorAll(".tab-close-btn").forEach(closeBtn => {
    closeBtn.onclick = function (e) {
      e.stopPropagation(); // Sekmenin tıklanma olayını engeller (dosya geçişi olmasın)

      const tabElement = this.parentElement;
      const fileKey = tabElement.getAttribute("data-file");

      if (fileKey) {
        // Dosya sekmesini gizle
        tabElement.style.display = "none";

        // Eğer kapatılan sekme aktif dosyaysa, açık olan başka bir sekme seç
        if (currentActiveFile === fileKey) {
          const nextActiveTab = findNextAvailableFileTab();
          if (nextActiveTab) {
            switchFileTab(nextActiveTab);
          } else {
            // Açık dosya kalmadı, boş ekrana/hoşgeldiniz ekranına dön
            showWelcomeScreen();
          }
        } else {
          // Kapatılan sekme aktif değilse, sadece kalan sekmeleri kontrol et (hepsi kapandıysa hoşgeldiniz göster)
          const nextActiveTab = findNextAvailableFileTab();
          if (!nextActiveTab) {
            showWelcomeScreen();
          }
        }
      }
    };
  });
}

function findNextAvailableFileTab() {
  const visibleTabs = Array.from(document.querySelectorAll(".file-tabs .tab[data-file]"))
    .filter(tab => tab.style.display === "flex");
  if (visibleTabs.length > 0) {
    return visibleTabs[0].getAttribute("data-file");
  }
  return null;
}

function showWelcomeScreen() {
  currentActiveFile = null;
  document.getElementById("mode-select").value = ""; // Seçiciyi sıfırla

  // Tüm içerikleri gizle, hoşgeldiniz ekranını aktif et
  document.querySelectorAll(".window-content .tab-content").forEach(content => {
    if (content.id === "welcome-screen") {
      content.classList.add("active");
    } else {
      content.classList.remove("active");
    }
  });

  // Önizleme sekmelerini gizle
  document.getElementById("tab-preview-btn").style.display = "none";
  document.getElementById("preview-tab-separator").style.display = "none";

  // Durum çubuğunu temizle
  document.getElementById("status-lang").innerText = "Dosya Açık Değil";
  document.getElementById("status-lines").innerText = "Toplam: 0 Satır";
  document.getElementById("status-position").innerText = "Satır 0, Sütun 0";
  document.getElementById("status-selection").innerText = "Seçim: 0 karakter";

  logToConsole("Tüm açık dosyalar kapatıldı. Hoş geldiniz ekranına dönüldü.", "system-msg");
  updateTemplateLibraryFilter(null);
  if (typeof renderDocs === "function") {
    renderDocs("");
  }

  // Koşullu simgeleri gizle
  document.querySelectorAll(".activity-btn.conditional-btn").forEach(btn => {
    btn.classList.remove("show-btn");
  });

  // Eğer açık olan panel snippets veya docs ise, ayarlar paneline geri dön (çünkü diğerleri pasifleşiyor)
  const activeBtn = document.querySelector(".activity-btn.active");
  if (activeBtn && (activeBtn.getAttribute("data-tab") === "snippets" || activeBtn.getAttribute("data-tab") === "docs" || activeBtn.getAttribute("data-tab") === "sandbox")) {
    document.querySelectorAll(".activity-btn").forEach(b => b.classList.remove("active"));
    const settingsBtn = document.querySelector('.activity-btn[data-tab="settings"]');
    if (settingsBtn) {
      settingsBtn.classList.add("active");
    }

    document.querySelectorAll(".sidebar-section").forEach(sec => sec.classList.remove("active"));
    const settingsSec = document.getElementById("section-settings");
    if (settingsSec) {
      settingsSec.classList.add("active");
    }

    const titleText = document.getElementById("panel-title-text");
    const headerIcon = document.getElementById("panel-header-icon");
    if (titleText && headerIcon) {
      titleText.innerText = "Ayarlar & Görünüm";
      headerIcon.innerHTML = `<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>`;
    }
  }
}

// Kapatma olaylarını sayfa yüklemesinde bağla
bindTabCloseEvents();

// ----------------------------------------------------
// Kodu Derleme & Önizlemede Çalıştırma
// ----------------------------------------------------
function runLiveCode() {
  const mode = document.getElementById("mode-select").value;
  const code = editor.getValue();
  const iframe = document.getElementById("preview-iframe");

  logToConsole("Kod derleme işlemi tetiklendi...", "system-msg");

  if (mode === "html") {
    // HTML doğrudan iframe'e aktarılır, console.log'ları yakalayacak betik eklenir
    const customConsoleScript = `
      <script>
        const _log = console.log;
        console.log = function(...args) {
          _log(...args);
          window.parent.postMessage({ type: 'IFRAME_LOG', message: args.join(' ') }, '*');
        };
      </script>
    `;
    let finalHTML = code;
    if (code.includes("<head>")) {
      finalHTML = code.replace("<head>", `<head>${customConsoleScript}`);
    } else {
      finalHTML = customConsoleScript + code;
    }

    iframe.srcdoc = finalHTML;
    logToConsole("HTML Canlı Önizleme yüklendi.", "result-success");
  }
  else if (mode === "css") {
    // CSS stilleri boş bir HTML sayfasına enjekte edilir
    const finalHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${code}</style>
      </head>
      <body>
        <div class="box"></div>
        <h2>CSS Önizleme Modu</h2>
        <p>Editördeki CSS sınıfları bu kutuya uygulanmıştır.</p>
      </body>
      </html>
    `;
    iframe.srcdoc = finalHTML;
    logToConsole("CSS Tasarımı Önizleme alanına uygulandı.", "result-success");
  }
  else if (mode === "javascript") {
    // JS kodu iframe içinde izole edilerek çalıştırılır
    const finalHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <script>
          const _log = console.log;
          console.log = function(...args) {
            _log(...args);
            window.parent.postMessage({ type: 'IFRAME_LOG', message: args.join(' ') }, '*');
          };
          window.addEventListener('error', function(e) {
            window.parent.postMessage({ type: 'IFRAME_ERROR', message: e.message }, '*');
          });
        </script>
      </head>
      <body>
        <h3>JavaScript Canlı Çalıştırma Demosu</h3>
        <p>Kod çıktısı alt paneldeki konsolda görünecektir.</p>
        <script>
          try {
            ${code}
          } catch(err) {
            console.error(err);
          }
        </script>
      </body>
      </html>
    `;
    iframe.srcdoc = finalHTML;
    logToConsole("JavaScript kodu sandbox içinde çalıştırıldı.", "result-success");
  }
  else {
    // Python, SQL, JSON veya Clomosy TRObject için canlı grafik önizleme derlemesi yapıp iframe'e enjekte ederiz
    logToConsole(`[Derleyici] "${mode.toUpperCase()}" için canlı grafik önizleme derlemesi başlatılıyor...`, "api-call");

    let compiledHTML = "";
    if (mode === "pascal") { // Clomosy TRObject Emulator
      // Pascal/TRObject kodlarını parse edip dinamik arayüz oluşturalım
      let bgColor = "#0f111a";
      let showMessageText = "Ace Editor Showcase ile TRObject Kodları Deneyimi!";
      
      const components = {};
      const componentOrder = [];
      const styles = {};
      const imageSources = {};
      const listItems = {};

      const colorMap = {
        "clMediumpurple": "#9370db",
        "clWhite": "#ffffff",
        "clBlack": "#000000",
        "clRed": "#ff0000",
        "clGreen": "#00ff00",
        "clBlue": "#0000ff",
        "clYellow": "#ffff00",
        "clGNone": "transparent"
      };

      // SetFormColor veya clHexToColor eşleşmesi
      const hexColorMatch = code.match(/clHexToColor\s*\(\s*['"](#?[A-Fa-f0-9]{6})['"]\s*\)/i);
      if (hexColorMatch) {
        bgColor = hexColorMatch[1];
      } else {
        const simpleColorMatch = code.match(/SetFormColor\s*\(\s*['"](#?[A-Fa-f0-9]{6})['"]\s*\)/i);
        if (simpleColorMatch) bgColor = simpleColorMatch[1];
      }

      // ShowMessage yakalama
      const msgMatch = code.match(/ShowMessage\s*\(\s*['"]([^'"]+)['"]\s*\)/i);
      if (msgMatch) {
        showMessageText = msgMatch[1];
      }

      // SetupComponent yakalama (JSON stilleri)
      const setupRegex = /clComponent\.SetupComponent\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*['"]([^'"]+)['"]\s*\)/gi;
      let setupM;
      while ((setupM = setupRegex.exec(code)) !== null) {
        try {
          styles[setupM[1].trim()] = JSON.parse(setupM[2]);
        } catch (e) {}
      }

      // Align özellikleri (Hizalama)
      const alignRegex = /([a-zA-Z0-9_]+)\.Align\s*=\s*(al[A-Za-z]+)/gi;
      let alignM;
      while ((alignM = alignRegex.exec(code)) !== null) {
        const varName = alignM[1].trim();
        if (!styles[varName]) styles[varName] = {};
        styles[varName].Align = alignM[2];
      }

      // Width & Height özellikleri
      const widthRegex = /([a-zA-Z0-9_]+)\.Width\s*=\s*(\d+)/gi;
      let widthM;
      while ((widthM = widthRegex.exec(code)) !== null) {
        const varName = widthM[1].trim();
        if (!styles[varName]) styles[varName] = {};
        styles[varName].Width = widthM[2];
      }
      const heightRegex = /([a-zA-Z0-9_]+)\.Height\s*=\s*(\d+)/gi;
      let heightM;
      while ((heightM = heightRegex.exec(code)) !== null) {
        const varName = heightM[1].trim();
        if (!styles[varName]) styles[varName] = {};
        styles[varName].Height = heightM[2];
      }

      // Renk atamaları (Örn: lblStatus.clProSettings.FontColor = clAlphaColor.clMediumpurple)
      const colorAssignRegex = /([a-zA-Z0-9_]+)\.(?:clProSettings\.)?FontColor\s*=\s*(?:clAlphaColor\.)?([a-zA-Z0-9_]+)/gi;
      let colorAssignM;
      while ((colorAssignM = colorAssignRegex.exec(code)) !== null) {
        const varName = colorAssignM[1].trim();
        const colorVal = colorAssignM[2].trim();
        if (!styles[varName]) styles[varName] = {};
        styles[varName].FontColor = colorMap[colorVal] || colorVal;
      }

      // Paneller ve Layoutlar
      const panelRegex = /([a-zA-Z0-9_]+)\s*=\s*(?:[a-zA-Z0-9_]+)\.(AddNewProPanel|AddNewPanel|AddNewLayout)\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*['"]([^'"]+)['"]\s*\)/gi;
      let panelM;
      while ((panelM = panelRegex.exec(code)) !== null) {
        const varName = panelM[1].trim();
        const type = panelM[2].includes("Layout") ? "layout" : "panel";
        const parentVar = panelM[3].trim();
        const name = panelM[4];
        components[varName] = { varName, type, parentVar, name, children: [] };
        componentOrder.push(varName);
      }

      // Butonlar
      const btnRegex = /([a-zA-Z0-9_]+)\s*=\s*(?:[a-zA-Z0-9_]+)\.(AddNewProButton|AddNewButton)\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/gi;
      let btnM;
      while ((btnM = btnRegex.exec(code)) !== null) {
        const varName = btnM[1].trim();
        const parentVar = btnM[3].trim();
        const name = btnM[4];
        const text = btnM[5];
        components[varName] = { varName, type: "button", parentVar, name, text, children: [] };
        componentOrder.push(varName);
      }

      // Etiketler (Labels)
      const lblRegex = /([a-zA-Z0-9_]+)\s*=\s*(?:[a-zA-Z0-9_]+)\.(AddNewProLabel|AddNewLabel)\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/gi;
      let lblM;
      while ((lblM = lblRegex.exec(code)) !== null) {
        const varName = lblM[1].trim();
        const parentVar = lblM[3].trim();
        const name = lblM[4];
        const text = lblM[5];
        components[varName] = { varName, type: "label", parentVar, name, text, children: [] };
        componentOrder.push(varName);
      }

      // Giriş Kutuları (Edits)
      const editRegex = /([a-zA-Z0-9_]+)\s*=\s*(?:[a-zA-Z0-9_]+)\.AddNewEdit\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/gi;
      let editM;
      while ((editM = editRegex.exec(code)) !== null) {
        const varName = editM[1].trim();
        const parentVar = editM[3].trim();
        const name = editM[4];
        const placeholder = editM[5];
        components[varName] = { varName, type: "edit", parentVar, name, placeholder, children: [] };
        componentOrder.push(varName);
      }

      // Çok Satırlı Giriş Alanları (Memos)
      const memoRegex = /([a-zA-Z0-9_]+)\s*=\s*(?:[a-zA-Z0-9_]+)\.AddNewMemo\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/gi;
      let memoM;
      while ((memoM = memoRegex.exec(code)) !== null) {
        const varName = memoM[1].trim();
        const parentVar = memoM[3].trim();
        const name = memoM[4];
        const textVal = memoM[5].replace(/\\n/g, '\n');
        components[varName] = { varName, type: "memo", parentVar, name, text: textVal, children: [] };
        componentOrder.push(varName);
      }

      // Resim Kutuları (Images)
      const imgRegex = /([a-zA-Z0-9_]+)\s*=\s*(?:[a-zA-Z0-9_]+)\.AddNewImage\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*['"]([^'"]+)['"]\s*\)/gi;
      let imgM;
      while ((imgM = imgRegex.exec(code)) !== null) {
        const varName = imgM[1].trim();
        const parentVar = imgM[3].trim();
        const name = imgM[4];
        components[varName] = { varName, type: "image", parentVar, name, children: [] };
        componentOrder.push(varName);
      }

      // Resim Yükleme (setImage)
      const setImageRegex = /setImage\s*\(\s*([^,]+),\s*['"]([^'"]+)['"]\s*\)/gi;
      let setImageM;
      while ((setImageM = setImageRegex.exec(code)) !== null) {
        imageSources[setImageM[1].trim()] = setImageM[2];
      }

      // Listeler (ListView)
      const listRegex = /([a-zA-Z0-9_]+)\s*=\s*(?:[a-zA-Z0-9_]+)\.AddNewListView\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*['"]([^'"]+)['"]\s*\)/gi;
      let listM;
      while ((listM = listRegex.exec(code)) !== null) {
        const varName = listM[1].trim();
        const parentVar = listM[2].trim();
        const name = listM[3];
        components[varName] = { varName, type: "list", parentVar, name, children: [] };
        componentOrder.push(varName);
      }

      // Liste Elemanı Ekleme (AddItem)
      const addItemRegex = /(\w+)\.AddItem\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/gi;
      let addItemM;
      while ((addItemM = addItemRegex.exec(code)) !== null) {
        const listName = addItemM[1].trim();
        if (!listItems[listName]) listItems[listName] = [];
        listItems[listName].push({ title: addItemM[2], subtitle: addItemM[3] });
      }

      // Ağaç Yapısını Kur (Parent-Child Nesting)
      const rootComponents = [];
      componentOrder.forEach(varName => {
        const comp = components[varName];
        if (components[comp.parentVar]) {
          components[comp.parentVar].children.push(varName);
        } else {
          rootComponents.push(varName);
        }
      });

      // Bileşeni recursive olarak HTML'e dökme fonksiyonu
      function renderComponent(varName) {
        const comp = components[varName];
        if (!comp) return "";
        
        const style = styles[varName] || {};
        let css = "";
        
        // Background Color
        if (style.BackgroundColor) {
          css += `background-color: ${style.BackgroundColor}; `;
        } else if (comp.type === 'panel') {
          css += `background-color: rgba(255,255,255,0.05); `;
        } else if (comp.type === 'button') {
          css += `background-color: #6366f1; `;
        }
        
        // Font Color
        if (style.FontColor) {
          css += `color: ${style.FontColor}; `;
        }
        
        // Border Radius
        if (style.RoundHeight || style.RoundWidth) {
          const radius = style.RoundHeight || style.RoundWidth || 8;
          css += `border-radius: ${radius}px; `;
        } else if (comp.type === 'panel' || comp.type === 'button') {
          css += `border-radius: 12px; `;
        }
        
        // Width & Height
        if (style.Width) {
          css += `width: ${style.Width}px; `;
        } else if (comp.type === 'panel' || comp.type === 'layout') {
          css += `width: 90%; `;
        } else if (comp.type === 'button') {
          css += `width: 140px; `;
        } else {
          css += `width: 85%; `;
        }
        
        if (style.Height) {
          css += `height: ${style.Height}px; `;
        } else if (comp.type === 'button') {
          css += `height: 45px; `;
        }
        
        // Align
        if (style.Align) {
          const alignment = style.Align.toLowerCase();
          if (alignment.includes("top")) {
            css += `align-self: stretch; margin: 8px auto; width: 90%; `;
          } else if (alignment.includes("bottom")) {
            css += `align-self: stretch; margin-top: auto; margin-bottom: 8px; width: 90%; `;
          } else if (alignment.includes("center")) {
            css += `margin: 8px auto; `;
          } else if (alignment.includes("client")) {
            css += `flex: 1; align-self: stretch; width: 90%; margin: 8px auto; `;
          } else if (alignment.includes("left")) {
            css += `margin-right: auto; margin-top: 8px; margin-bottom: 8px; `;
          } else if (alignment.includes("right")) {
            css += `margin-left: auto; margin-top: 8px; margin-bottom: 8px; `;
          }
        }

        // Recursive children rendering
        let childrenHTML = "";
        if (comp.children && comp.children.length > 0) {
          comp.children.forEach(childVar => {
            childrenHTML += renderComponent(childVar);
          });
        }
        
        if (comp.type === 'panel' || comp.type === 'layout') {
          return `<div class="cl-panel" style="${css}" id="${comp.name}">${childrenHTML}</div>`;
        } else if (comp.type === 'button') {
          return `<button class="cl-btn" style="${css}" onclick="showClomosyDialog('${comp.text}')">${comp.text}</button>`;
        } else if (comp.type === 'label') {
          return `<div style="font-size: 14px; font-weight: 500; text-align: center; margin: 8px 0; ${css}">${comp.text}</div>`;
        } else if (comp.type === 'edit') {
          return `<input class="cl-input" style="${css}" type="text" placeholder="${comp.placeholder}" id="${comp.name}">`;
        } else if (comp.type === 'memo') {
          return `<textarea class="cl-textarea" style="${css}" id="${comp.name}" placeholder="Metin girin...">${comp.text}</textarea>`;
        } else if (comp.type === 'image') {
          const src = imageSources[comp.varName] || "https://clomosy.com/demos/bg.png";
          return `<img class="cl-img" style="${css}" src="${src}" id="${comp.name}">`;
        } else if (comp.type === 'list') {
          let listHTML = `<div class="cl-list" style="${css}" id="${comp.name}">`;
          const items = listItems[comp.varName] || [];
          if (items.length > 0) {
            items.forEach(it => {
              listHTML += `
                <div class="cl-list-item" onclick="selectListItem('${it.title}', '${it.subtitle}')">
                  <div class="cl-list-item-title">${it.title}</div>
                  <div class="cl-list-item-sub">${it.subtitle}</div>
                </div>
              `;
            });
          } else {
            listHTML += `<div style="color: #8b949e; text-align: center; padding: 15px; font-size: 11px;">Boş Liste</div>`;
          }
          listHTML += `</div>`;
          return listHTML;
        }
        
        return "";
      }

      // Root elemanlardan başlayarak ekranı inşa et
      let elementsHTML = "";
      rootComponents.forEach(varName => {
        elementsHTML += renderComponent(varName);
      });

      // Eğer hiç bileşen algılanmadıysa boş ekran olmasın, varsayılan bir şeyler çizelim
      if (rootComponents.length === 0) {
        elementsHTML = `
          <div style="color: #64748b; font-size: 13px; text-align: center; padding: 20px;">
            Görsel Arayüz Elemanı Bulunamadı.<br><br>
            Arayüzü başlatmak için kitaptaki örnekleri kullanabilirsiniz.
          </div>
        `;
      }

      // SQLite, REST API, GPS ve ses simülasyon loglama tetikleyicileri
      if (code.includes("DBSQLiteConnect")) {
        logToConsole("[SQLite Simülatör] DBSQLiteConnect çağrısı yapıldı. Yerel SQLite sandbox aktif.", "result-success");
      }
      if (code.includes("TclRest") || code.includes("TclRest.Create")) {
        logToConsole("[REST API Simülatör] TclRest nesnesi oluşturuldu. HTTP API istekleri simüle ediliyor.", "api-call");
      }
      if (code.includes("DeviceLocation") || code.includes("GPS")) {
        logToConsole("[GPS Sensörü] Konum okundu. Enlem: 41.0082, Boylam: 28.9784 (İstanbul)", "result-success");
      }
      if (code.includes("PlayGameSound") || code.includes("RegisterSound")) {
        logToConsole("[Ses Motoru] Oyun efekti kaydedildi ve çalınıyor...", "api-call");
      }

      compiledHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              background: #090a0f;
              color: #fff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 95vh;
              margin: 0;
            }
            .phone-emulator {
              width: 280px;
              height: 480px;
              border: 12px solid #1e293b;
              border-radius: 40px;
              background: ${bgColor};
              box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
              position: relative;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              transition: background 0.3s ease;
            }
            .phone-notch {
              width: 120px;
              height: 18px;
              background: #1e293b;
              border-bottom-left-radius: 12px;
              border-bottom-right-radius: 12px;
              position: absolute;
              top: 0;
              left: 50%;
              transform: translateX(-50%);
              z-index: 10;
            }
            .phone-header {
              height: 40px;
              background: rgba(0, 0, 0, 0.3);
              padding: 10px 16px 0 16px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 11px;
              color: #64748b;
              border-bottom: 1px solid rgba(255,255,255,0.05);
              z-index: 5;
            }
            .phone-screen {
              flex: 1;
              padding: 15px;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: center;
              position: relative;
              overflow-y: auto;
              box-sizing: border-box;
            }
            .cl-panel {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 16px;
              width: 90%;
              padding: 15px;
              margin: 8px 0;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              box-shadow: 0 4px 15px rgba(0,0,0,0.3);
              border: 1px solid rgba(255,255,255,0.05);
              box-sizing: border-box;
            }
            .cl-btn {
              background: #6366f1;
              color: white;
              border: none;
              width: 140px;
              height: 45px;
              border-radius: 10px;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
              transition: background 0.2s, transform 0.1s;
              margin: 8px auto;
              box-sizing: border-box;
            }
            .cl-btn:hover {
              background: #4f46e5;
            }
            .cl-btn:active {
              transform: scale(0.95);
            }
            .cl-input {
              width: 85%;
              padding: 8px 12px;
              background: #1e293b;
              border: 1px solid #334155;
              border-radius: 8px;
              color: #fff;
              margin: 8px auto;
              font-size: 13px;
              box-sizing: border-box;
            }
            .cl-textarea {
              width: 85%;
              height: 70px;
              padding: 8px 12px;
              background: #1e293b;
              border: 1px solid #334155;
              border-radius: 8px;
              color: #fff;
              margin: 8px auto;
              font-size: 13px;
              resize: none;
              box-sizing: border-box;
            }
            .cl-img {
              width: 120px;
              height: 120px;
              border-radius: 12px;
              object-fit: cover;
              margin: 8px auto;
              border: 1px solid rgba(255,255,255,0.1);
              box-sizing: border-box;
            }
            .cl-list {
              width: 90%;
              background: rgba(0,0,0,0.2);
              border-radius: 12px;
              border: 1px solid rgba(255,255,255,0.05);
              padding: 5px;
              max-height: 140px;
              overflow-y: auto;
              margin: 8px auto;
              box-sizing: border-box;
            }
            .cl-list-item {
              padding: 8px 12px;
              border-bottom: 1px solid rgba(255,255,255,0.03);
              cursor: pointer;
              transition: background 0.2s;
              text-align: left;
            }
            .cl-list-item:hover {
              background: rgba(99, 102, 241, 0.15);
            }
            .cl-list-item-title {
              font-weight: 600;
              font-size: 13px;
              color: #fff;
            }
            .cl-list-item-sub {
              font-size: 11px;
              color: #8b949e;
              margin-top: 2px;
            }
            /* Clomosy Toast/Dialog modal */
            .cl-dialog {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0,0,0,0.7);
              backdrop-filter: blur(5px);
              display: none;
              justify-content: center;
              align-items: center;
              padding: 16px;
              z-index: 100;
            }
            .cl-dialog-content {
              background: #1e293b;
              border: 1px solid #334155;
              border-radius: 16px;
              padding: 20px;
              text-align: center;
              width: 85%;
              box-shadow: 0 10px 25px rgba(0,0,0,0.5);
              animation: popIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            @keyframes popIn {
              0% { transform: scale(0.9); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
            .cl-dialog-title {
              font-weight: 700;
              font-size: 13px;
              margin-bottom: 8px;
              color: #a855f7;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .cl-dialog-body {
              font-size: 12px;
              color: #cbd5e1;
              margin-bottom: 18px;
              line-height: 1.4;
            }
            .cl-dialog-btn {
              background: #a855f7;
              color: white;
              border: none;
              padding: 8px 20px;
              border-radius: 8px;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="phone-emulator">
            <div class="phone-notch"></div>
            <div class="phone-header">
              <span>18:15</span>
              <span style="font-weight: 600;">Clomosy Emulator</span>
              <span>📶 🔋</span>
            </div>
            <div class="phone-screen">
              ${elementsHTML}
              
              <div id="dialog-box" class="cl-dialog">
                <div class="cl-dialog-content">
                  <div class="cl-dialog-title">Clomosy ShowMessage</div>
                  <div class="cl-dialog-body" id="dialog-body-text">${showMessageText}</div>
                  <button class="cl-dialog-btn" onclick="closeClomosyDialog()">Tamam</button>
                </div>
              </div>
            </div>
          </div>

          <script>
            function showClomosyDialog(btnName) {
              document.getElementById('dialog-box').style.display = 'flex';
              window.parent.postMessage({ type: 'IFRAME_LOG', message: 'ShowMessage tetiklendi: ' + btnName }, '*');
            }
            function closeClomosyDialog() {
              document.getElementById('dialog-box').style.display = 'none';
            }
            function selectListItem(title, sub) {
              document.getElementById('dialog-body-text').innerText = 'Secilen Eleman: ' + title + ' (' + sub + ')';
              document.getElementById('dialog-box').style.display = 'flex';
              window.parent.postMessage({ type: 'IFRAME_LOG', message: 'Liste elemani secildi: ' + title }, '*');
            }
          </script>
        </body>
        </html>
      `;
      logToConsole("[TRObject] Kod derlemesi ve arayüz çözümlemesi tamamlandı.", "system-msg");
    }
    else if (mode === "python") { // Python Terminal
      let outputLines = [];
      let variables = {};
      let hasError = false;
      let errorMsg = "";

      // unittest kodları yazıldıysa, dinamik unittest çıktısı üretelim
      const isUnittest = code.includes("import unittest") && code.includes("unittest.main");

      if (isUnittest) {
        // test metotlarını bulalım
        const testMethods = [];
        const testRegex = /def\s+(test_[a-zA-Z0-9_]+)/g;
        let tMatch;
        while ((tMatch = testRegex.exec(code)) !== null) {
          testMethods.push(tMatch[1]);
        }

        if (testMethods.length > 0) {
          testMethods.forEach(method => {
            outputLines.push(`${method} (__main__.TestToplamaFonksiyonu) ... ok`);
          });
        } else {
          outputLines.push("test_negatif_sayilar (__main__.TestToplamaFonksiyonu) ... ok");
          outputLines.push("test_pozitif_sayilar (__main__.TestToplamaFonksiyonu) ... ok");
        }
        outputLines.push("");
        outputLines.push("----------------------------------------------------------------------");
        outputLines.push(`Ran ${testMethods.length || 2} tests in 0.002s`);
        outputLines.push("");
        outputLines.push("<span style='color: #3fb950; font-weight: bold;'>OK</span>");
      } else {
        const lines = code.split("\n");
        for (let i = 0; i < lines.length; i++) {
          let line = lines[i].trim();
          if (!line || line.startsWith("#")) continue;

          // Değişken tanımlama kontrolü (Örn: x = 5 veya x = "test"). Karşılaştırma operasyonlarını (==, !=, vb) içermemeli.
          const assignMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^=].*)$/);

          // print(...) kontrolü
          if (line.startsWith("print(") && line.endsWith(")")) {
            let inner = line.substring(6, line.length - 1).trim();

            let evalExpr = inner;
            for (let v in variables) {
              let val = variables[v];
              if (typeof val === "string") {
                val = `"${val}"`;
              }
              evalExpr = evalExpr.replace(new RegExp('\\b' + v + '\\b', 'g'), val);
            }

            try {
              let result = Function('"use strict"; return (' + evalExpr + ')')();
              outputLines.push(String(result));
            } catch (e) {
              // Tırnaksız düz string ise temizleyip doğrudan yazdır
              let fallbackVal = inner.replace(/['"]/g, '');
              outputLines.push(fallbackVal);
            }
          }
          // Değişken tanımlama
          else if (assignMatch) {
            let varName = assignMatch[1];
            let varVal = assignMatch[2];

            let evalExpr = varVal;
            for (let v in variables) {
              let val = variables[v];
              if (typeof val === "string") {
                val = `"${val}"`;
              }
              evalExpr = evalExpr.replace(new RegExp('\\b' + v + '\\b', 'g'), val);
            }

            try {
              variables[varName] = Function('"use strict"; return (' + evalExpr + ')')();
            } catch (e) {
              variables[varName] = varVal.replace(/['"]/g, '');
            }
          }
          // Python kontrol blokları, fonksiyon ve sınıf tanımları (Bunları simülatörde hata vermeden geçebiliriz)
          else if (
            line.startsWith("if ") ||
            line.startsWith("def ") ||
            line.startsWith("class ") ||
            line.startsWith("import ") ||
            line.startsWith("from ") ||
            line.startsWith("else:") ||
            line.startsWith("elif ") ||
            line.startsWith("return ") ||
            line.startsWith("self.") ||
            line.startsWith("pass") ||
            line.startsWith("unittest.") ||
            line.startsWith("print")
          ) {
            continue; // Kontrol ve yapı satırlarını güvenle geç
          }
          else {
            hasError = true;
            errorMsg = `invalid syntax on line ${i + 1}: ${line}`;
            break;
          }
        }
      }

      let finalOutputHTML = "";
      let exitCodeText = "exit code 0";
      let exitColor = "#3fb950";

      if (hasError) {
        finalOutputHTML = `<span style="color: #ff6b6b; font-family: monospace;">Traceback (most recent call last):<br>&nbsp;&nbsp;File "main.py", line ${errorMsg}</span>`;
        exitCodeText = "exit code 1";
        exitColor = "#ff6b6b";
      } else {
        if (outputLines.length === 0) {
          outputLines.push("<span style='color: #8b949e;'>[Program çıktı üretmedi]</span>");
        }
        finalOutputHTML = outputLines.join("<br>");
      }

      compiledHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              background: #090a0f;
              color: #cbd5e1;
              font-family: 'JetBrains Mono', monospace;
              padding: 20px;
              margin: 0;
              font-size: 13px;
              line-height: 1.6;
            }
            .terminal-header {
              color: #8b949e;
              border-bottom: 1px solid #21262d;
              padding-bottom: 8px;
              margin-bottom: 15px;
              font-size: 11px;
              display: flex;
              justify-content: space-between;
            }
            .prompt {
              color: #58a6ff;
            }
            .output {
              color: #fff;
              background: rgba(255,255,255,0.02);
              padding: 12px;
              border-radius: 8px;
              border: 1px solid rgba(255,255,255,0.05);
              min-height: 80px;
            }
          </style>
        </head>
        <body>
          <div class="terminal-header">
            <span>Terminal - Python 3.10 Simulator</span>
            <span style="color: #8b949e;">[Çalıştı]</span>
          </div>
          <div style="margin-bottom: 10px;"><span class="prompt">$ python main.py</span></div>
          <div class="output">
            ${finalOutputHTML}
          </div>
          <div style="margin-top: 15px; font-size: 12px; color: ${exitColor};">
            Process finished with ${exitCodeText}
          </div>
        </body>
        </html>
      `;
      logToConsole("[Python] Betik kodu yürütüldü.", "system-msg");
      if (hasError) {
        logToConsole(`[Hata] ${errorMsg}`, "system-msg");
      } else {
        logToConsole(`[Python] Kod başarıyla çalıştırıldı (Çıktı satır sayısı: ${outputLines.length}).`, "result-success");
      }
    }
    else if (mode === "sql") { // SQL Client Grid
      // SQL Yorumlayıcı Simülatörü
      const statements = code.split(";").map(s => {
        return s.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
      }).filter(s => s.length > 0);

      let isQueryValid = true;
      let errorMsg = "";
      let columns = [];
      let dataRows = [];
      let tableName = "projects";
      let isCommand = false;
      let commandMessage = "";

      // Her çalıştırmada veri tabanını varsayılan durumuna sıfırla (SQL Fiddle gibi temiz bir sandbox sunmak için!)
      window.sqlDatabaseState = {
        users: [
          { ID: 1, Isim: "Arda Çekiç", Rol: "Yönetici", Aktif: "Evet" },
          { ID: 2, Isim: "Ahmet Yılmaz", Rol: "Geliştirici", Aktif: "Evet" },
          { ID: 3, Isim: "Ayşe Kaya", Rol: "Tasarımcı", Aktif: "Hayır" },
          { ID: 4, Isim: "Mehmet Demir", Rol: "Stajyer", Aktif: "Evet" }
        ],
        projects: [
          { ProjeAdi: "clomosy_ai", ToplamTroDosyasi: 12, ToplamKodSatiri: 1250 },
          { ProjeAdi: "game_project", ToplamTroDosyasi: 5, ToplamKodSatiri: 480 },
          { ProjeAdi: "category_helper", ToplamTroDosyasi: 3, ToplamKodSatiri: 240 }
        ]
      };

      if (statements.length === 0) {
        isQueryValid = false;
        errorMsg = "Sorgu boş. Lütfen geçerli bir SQL sorgusu yazın.";
      } else {
        // Her bir SQL satırını sırayla çalıştır
        for (let sIdx = 0; sIdx < statements.length; sIdx++) {
          const statement = statements[sIdx];
          const oneLineQuery = statement.replace(/\s+/g, ' ');
          const lowerQuery = oneLineQuery.toLowerCase();

          // Regex eşleşmeleri
          const createMatch = oneLineQuery.match(/create\s+table\s+(?:if\s+not\s+exists\s+)?(\w+)\s*\((.+)\)/i);
          const insertMatch = oneLineQuery.match(/insert\s+into\s+(\w+)\s*\((.+?)\)\s*values\s*\((.+?)\)/i);
          const deleteMatch = oneLineQuery.match(/delete\s+from\s+(\w+)(?:\s+where\s+(.+))?/i);
          const updateMatch = oneLineQuery.match(/update\s+(\w+)\s+set\s+(.+?)(?:\s+where\s+(.+))?$/i);
          const dropMatch = oneLineQuery.match(/drop\s+table\s+(?:if\s+exists\s+)?(\w+)/i);
          const isShowTables = lowerQuery === "show tables" || lowerQuery === "show tables;" || lowerQuery.includes("sqlite_master") || lowerQuery.includes("sqlite_schema");

          if (createMatch) {
            isCommand = true;
            const targetTable = createMatch[1].trim().toLowerCase();
            const isIfNotExists = lowerQuery.includes("if not exists");

            if (window.sqlDatabaseState[targetTable]) {
              if (!isIfNotExists) {
                isQueryValid = false;
                errorMsg = `Hata: '${targetTable}' adında bir tablo zaten mevcut.`;
                break;
              }
            } else {
              window.sqlDatabaseState[targetTable] = [];
            }
            commandMessage = `Tablo '${targetTable}' başarıyla oluşturuldu.`;
          }
          else if (insertMatch) {
            isCommand = true;
            const targetTable = insertMatch[1].trim().toLowerCase();
            const colsPart = insertMatch[2].trim();

            // VALUES kelimesinden sonrasını tamamen al
            const valuesKeywordIndex = oneLineQuery.toLowerCase().indexOf("values");
            const valuesBlock = oneLineQuery.substring(valuesKeywordIndex + 6).trim();

            if (!window.sqlDatabaseState[targetTable]) {
              isQueryValid = false;
              errorMsg = `Hata: '${targetTable}' tablosu bulunamadı.`;
              break;
            } else {
              const columnsList = colsPart.split(",").map(c => c.trim());

              // Parantezli değer kümelerini ayıkla e.g. (1, 'Ahmet', 28, 'İstanbul')
              const valSets = [];
              let braceCount = 0;
              let currentSet = "";
              for (let charIdx = 0; charIdx < valuesBlock.length; charIdx++) {
                const char = valuesBlock[charIdx];
                if (char === '(') {
                  braceCount++;
                  if (braceCount === 1) {
                    currentSet = "";
                    continue;
                  }
                }
                if (char === ')') {
                  braceCount--;
                  if (braceCount === 0) {
                    valSets.push(currentSet.trim());
                    continue;
                  }
                }
                if (braceCount > 0) {
                  currentSet += char;
                }
              }

              if (valSets.length === 0) {
                isQueryValid = false;
                errorMsg = "Hata: INSERT INTO değer kümesi bulunamadı.";
                break;
              }

              // Her satırı sırayla işle
              let insertedCount = 0;
              let innerError = false;
              for (let vsIdx = 0; vsIdx < valSets.length; vsIdx++) {
                const vSet = valSets[vsIdx];

                // Tırnak işaretlerine duyarlı olarak virgüllerden böl
                const valuesList = [];
                let inQuote = false;
                let quoteChar = "";
                let currentVal = "";
                for (let cIdx = 0; cIdx < vSet.length; cIdx++) {
                  const valChar = vSet[cIdx];
                  if ((valChar === "'" || valChar === '"') && (cIdx === 0 || vSet[cIdx - 1] !== '\\')) {
                    if (!inQuote) {
                      inQuote = true;
                      quoteChar = valChar;
                    } else if (valChar === quoteChar) {
                      inQuote = false;
                    } else {
                      currentVal += valChar;
                    }
                  } else if (valChar === ',' && !inQuote) {
                    valuesList.push(currentVal.trim());
                    currentVal = "";
                  } else {
                    currentVal += valChar;
                  }
                }
                valuesList.push(currentVal.trim());

                // Değerleri biçimlendir (tırnakları kaldır, sayıları dönüştür)
                const formattedValues = valuesList.map(v => {
                  let trimmed = v.trim();
                  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
                    return trimmed.substring(1, trimmed.length - 1);
                  }
                  return isNaN(trimmed) ? trimmed : Number(trimmed);
                });

                if (columnsList.length !== formattedValues.length) {
                  isQueryValid = false;
                  errorMsg = `Hata: INSERT INTO ${vsIdx + 1}. satırdaki sütun sayısı ile değer sayısı eşleşmiyor.`;
                  innerError = true;
                  break;
                } else {
                  let newRow = {};
                  columnsList.forEach((col, idx) => {
                    let colName = col;
                    if (window.sqlDatabaseState[targetTable].length > 0) {
                      const keys = Object.keys(window.sqlDatabaseState[targetTable][0]);
                      const found = keys.find(k => k.toLowerCase() === col.toLowerCase());
                      if (found) colName = found;
                    }
                    newRow[colName] = formattedValues[idx];
                  });
                  window.sqlDatabaseState[targetTable].push(newRow);
                  insertedCount++;
                }
              }

              if (innerError) {
                break;
              }
              commandMessage = `${insertedCount} satır '${targetTable}' tablosuna başarıyla eklendi.`;
            }
          }
          else if (deleteMatch) {
            isCommand = true;
            const targetTable = deleteMatch[1].trim().toLowerCase();
            const whereExpr = deleteMatch[2] ? deleteMatch[2].trim() : null;

            if (!window.sqlDatabaseState[targetTable]) {
              isQueryValid = false;
              errorMsg = `Hata: '${targetTable}' tablosu bulunamadı.`;
              break;
            } else {
              let originalLen = window.sqlDatabaseState[targetTable].length;
              if (!whereExpr) {
                window.sqlDatabaseState[targetTable] = [];
              } else {
                window.sqlDatabaseState[targetTable] = window.sqlDatabaseState[targetTable].filter(row => {
                  let evalExpr = whereExpr;
                  for (let col in row) {
                    let val = row[col];
                    if (typeof val === "string") val = `'${val}'`;
                    evalExpr = evalExpr.replace(new RegExp('\\b' + col + '\\b', 'gi'), val);
                  }
                  evalExpr = evalExpr.replace(/=/g, "==").replace(/and/gi, "&&").replace(/or/gi, "||");
                  try {
                    return !Function('"use strict"; return (' + evalExpr + ')')();
                  } catch (e) {
                    return true;
                  }
                });
              }
              let deletedCount = originalLen - window.sqlDatabaseState[targetTable].length;
              commandMessage = `${deletedCount} satır başarıyla silindi.`;
            }
          }
          else if (updateMatch) {
            isCommand = true;
            const targetTable = updateMatch[1].trim().toLowerCase();
            const setExpr = updateMatch[2].trim();
            const whereExpr = updateMatch[3] ? updateMatch[3].trim() : null;

            if (!window.sqlDatabaseState[targetTable]) {
              isQueryValid = false;
              errorMsg = `Hata: '${targetTable}' tablosu bulunamadı.`;
              break;
            } else {
              const assignments = setExpr.split(",").map(a => {
                const parts = a.split("=");
                return { col: parts[0].trim(), valExpr: parts[1].trim() };
              });

              let updatedCount = 0;
              window.sqlDatabaseState[targetTable] = window.sqlDatabaseState[targetTable].map(row => {
                let matches = true;
                if (whereExpr) {
                  let evalExpr = whereExpr;
                  for (let col in row) {
                    let val = row[col];
                    if (typeof val === "string") val = `'${val}'`;
                    evalExpr = evalExpr.replace(new RegExp('\\b' + col + '\\b', 'gi'), val);
                  }
                  evalExpr = evalExpr.replace(/=/g, "==").replace(/and/gi, "&&").replace(/or/gi, "||");
                  try {
                    matches = Function('"use strict"; return (' + evalExpr + ')')();
                  } catch (e) {
                    matches = false;
                  }
                }

                if (matches) {
                  updatedCount++;
                  let newRow = { ...row };
                  assignments.forEach(assign => {
                    let val = assign.valExpr;
                    if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
                      val = val.substring(1, val.length - 1);
                    } else if (!isNaN(val)) {
                      val = Number(val);
                    }

                    let matchedK = Object.keys(row).find(k => k.toLowerCase() === assign.col.toLowerCase());
                    if (matchedK) {
                      newRow[matchedK] = val;
                    } else {
                      newRow[assign.col] = val;
                    }
                  });
                  return newRow;
                }
                return row;
              });
              commandMessage = `${updatedCount} satır başarıyla güncellendi.`;
            }
          }
          else if (dropMatch) {
            isCommand = true;
            const targetTable = dropMatch[1].trim().toLowerCase();
            const isIfExists = lowerQuery.includes("if exists");

            if (!window.sqlDatabaseState[targetTable]) {
              if (!isIfExists) {
                isQueryValid = false;
                errorMsg = `Hata: '${targetTable}' tablosu bulunamadı.`;
                break;
              }
            } else {
              delete window.sqlDatabaseState[targetTable];
            }
            commandMessage = `Tablo '${targetTable}' başarıyla kaldırıldı (Drop).`;
          }
          else if (isShowTables) {
            isCommand = false;
            tableName = "system_tables";
            columns = ["Table_Name", "Row_Count"];
            dataRows = Object.keys(window.sqlDatabaseState).map(tName => {
              return {
                "Table_Name": tName,
                "Row_Count": window.sqlDatabaseState[tName].length
              };
            });
          }
          else if (lowerQuery.startsWith("select")) {
            isCommand = false;
            const selectRegex = /select\s+(.+?)\s+from\s+(\w+)(?:\s+where\s+(.+?))?(?:\s+order\s+by\s+(.+?))?$/i;
            const match = oneLineQuery.match(selectRegex);

            if (!match) {
              if (oneLineQuery.toLowerCase().includes("from users")) {
                tableName = "users";
              } else {
                tableName = "projects";
              }
              if (!window.sqlDatabaseState[tableName]) {
                isQueryValid = false;
                errorMsg = `Hata: '${tableName}' tablosu bulunamadı.`;
                break;
              } else {
                dataRows = JSON.parse(JSON.stringify(window.sqlDatabaseState[tableName]));
                columns = dataRows.length > 0 ? Object.keys(dataRows[0]) : [];
              }
            } else {
              const columnsExpr = match[1].trim();
              tableName = match[2].trim().toLowerCase();
              const whereExpr = match[3] ? match[3].trim() : null;
              const orderExpr = match[4] ? match[4].trim() : null;

              if (tableName === "clomosy_projects") tableName = "projects";

              if (window.sqlDatabaseState[tableName] === undefined) {
                isQueryValid = false;
                errorMsg = `Hata (SQL Engine): '${tableName}' adında bir tablo bulunamadı. (Mevcut tablolar: users, projects)`;
                break;
              } else {
                let sourceRows = window.sqlDatabaseState[tableName];
                let filteredRows = [...sourceRows];

                if (whereExpr) {
                  filteredRows = filteredRows.filter(row => {
                    let evalExpr = whereExpr;
                    for (let col in row) {
                      let val = row[col];
                      if (typeof val === "string") {
                        val = `'${val}'`;
                      }
                      evalExpr = evalExpr.replace(new RegExp('\\b' + col + '\\b', 'gi'), val);
                    }

                    evalExpr = evalExpr.replace(/=/g, "==")
                      .replace(/!==/g, "!=")
                      .replace(/and/gi, "&&")
                      .replace(/or/gi, "||");

                    try {
                      return Function('"use strict"; return (' + evalExpr + ')')();
                    } catch (e) {
                      return true;
                    }
                  });
                }

                if (orderExpr) {
                  const parts = orderExpr.split(/\s+/);
                  const sortCol = parts[0];
                  const isDesc = parts[1] && parts[1].toLowerCase() === "desc";

                  const actualColName = sourceRows.length > 0 ? Object.keys(sourceRows[0]).find(k => k.toLowerCase() === sortCol.toLowerCase()) : null;

                  if (actualColName) {
                    filteredRows.sort((a, b) => {
                      let valA = a[actualColName];
                      let valB = b[actualColName];
                      if (typeof valA === "string") {
                        return isDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
                      } else {
                        return isDesc ? valB - valA : valA - valB;
                      }
                    });
                  }
                }

                if (columnsExpr === "*") {
                  columns = sourceRows.length > 0 ? Object.keys(sourceRows[0]) : [];
                  dataRows = filteredRows;
                } else {
                  const colTokens = columnsExpr.split(",").map(c => c.trim());
                  columns = colTokens.map((token) => {
                    const aliasMatch = token.match(/as\s+(\w+)/i);
                    if (aliasMatch) return aliasMatch[1].trim();
                    const dotParts = token.split(".");
                    return dotParts[dotParts.length - 1].trim();
                  });

                  dataRows = filteredRows.map(row => {
                    let projectedRow = {};
                    colTokens.forEach((token, index) => {
                      let sourceColName = token;
                      const aliasMatch = token.match(/(.+?)\s+as\s+(\w+)/i);
                      let finalColName = columns[index];

                      if (aliasMatch) {
                        sourceColName = aliasMatch[1].trim();
                      }

                      const dotParts = sourceColName.split(".");
                      let rawColName = dotParts[dotParts.length - 1].trim();

                      let matchedKey = Object.keys(row).find(key => key.toLowerCase() === rawColName.toLowerCase());

                      if (matchedKey) {
                        projectedRow[finalColName] = row[matchedKey];
                      } else {
                        if (rawColName.toLowerCase().startsWith("count(") || rawColName.toLowerCase().startsWith("sum(")) {
                          projectedRow[finalColName] = rawColName.toLowerCase().startsWith("count(") ? filteredRows.length : 1250;
                        } else {
                          projectedRow[finalColName] = "NULL";
                        }
                      }
                    });
                    return projectedRow;
                  });
                }
              }
            }
          }
          else {
            isQueryValid = false;
            errorMsg = `Bilinmeyen SQL komutu: "${statement}"`;
            break;
          }
        }
      }

      let gridContentHTML = "";
      if (!isQueryValid) {
        gridContentHTML = `
          <div style="color: #ff6b6b; font-family: monospace; font-size: 13px; background: rgba(239, 68, 68, 0.1); padding: 14px; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px;">
            ${errorMsg}
          </div>
        `;
      } else if (isCommand) {
        gridContentHTML = `
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 12px; border-radius: 8px; color: #3fb950; font-weight: 600; font-size: 13px; margin-bottom: 15px;">
            ✓ Komut Başarıyla Yürütüldü
          </div>
          <div style="color: #cbd5e1; font-family: monospace; font-size: 13px; padding: 14px; background: #161b22; border-radius: 8px; border: 1px solid #30363d;">
            ${commandMessage}
          </div>
        `;
      } else {
        let headersHTML = columns.map(col => `<th>${col}</th>`).join("");
        let rowsHTML = dataRows.map(row => {
          let colsHTML = columns.map(col => `<td>${row[col] !== undefined ? row[col] : "NULL"}</td>`).join("");
          return `<tr>${colsHTML}</tr>`;
        }).join("");

        gridContentHTML = `
          <table>
            <thead>
              <tr>${headersHTML}</tr>
            </thead>
            <tbody>
              ${rowsHTML ? rowsHTML : `<tr><td colspan="${columns.length || 1}" style="text-align: center; color: #8b949e;">Sorgudan dönen veri bulunamadı.</td></tr>`}
            </tbody>
          </table>
          <div class="status">Sorgu başarıyla sonuçlandı. ${dataRows.length} satır döndürüldü. (Süre: 0.01 sn)</div>
        `;
      }

      compiledHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              background: #0f111a;
              color: #e2e8f0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              padding: 20px;
              margin: 0;
            }
            .grid-header {
              font-size: 12px;
              color: #94a3b8;
              margin-bottom: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              display: flex;
              justify-content: space-between;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              background: #161b22;
              border-radius: 8px;
              overflow: hidden;
              border: 1px solid #30363d;
            }
            th {
              background: #21262d;
              color: #fff;
              text-align: left;
              padding: 12px 14px;
              font-size: 12px;
              font-weight: 600;
              border-bottom: 1px solid #30363d;
            }
            td {
              padding: 10px 14px;
              border-bottom: 1px solid #21262d;
              font-size: 12px;
              color: #c9d1d9;
              font-family: monospace;
            }
            tr:last-child td {
              border-bottom: none;
            }
            tr:hover td {
              background: rgba(99, 102, 241, 0.05);
            }
            .status {
              font-size: 11px;
              color: #14b8a6;
              margin-top: 12px;
            }
          </style>
        </head>
        <body>
          <div class="grid-header">
            <span>Sorgu Sonuç Izgarası (Grid)</span>
            <span style="color: #58a6ff;">SQL Sorgu Çıktısı</span>
          </div>
          ${gridContentHTML}
        </body>
        </html>
      `;
      logToConsole("[SQL Engine] Sorgu derlendi.", "system-msg");
      if (isQueryValid) {
        logToConsole(`[SQL Engine] Sorgu başarılı. ${isCommand ? 'Komut yürütüldü.' : `'${tableName.toUpperCase()}' tablosu üzerinden veri çekildi.`}`, "result-success");
      } else {
        logToConsole(`[SQL Engine Hata] ${errorMsg}`, "system-msg");
      }
    }
    else if (mode === "json") { // JSON Schema Viewer
      let isJSONValid = true;
      let jsonErrorMsg = "";
      let parsedJSON = {};

      try {
        parsedJSON = JSON.parse(code);
      } catch (err) {
        isJSONValid = false;
        jsonErrorMsg = err.message;
      }

      let jsonDisplayHTML = "";
      if (!isJSONValid) {
        jsonDisplayHTML = `
          <div class="status-banner" style="background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #f87171;">
            <span>✗ Geçersiz JSON Yapısı (Hata)</span>
          </div>
          <div style="color: #f87171; font-family: monospace; font-size: 13px; padding: 14px; background: #161b22; border-radius: 8px; border: 1px solid #30363d;">
            ${jsonErrorMsg}
          </div>
        `;
      } else {
        // Dinamik olarak JSON içeriğinden kartlar oluşturalım
        let rowsHTML = "";
        for (let key in parsedJSON) {
          let value = parsedJSON[key];
          if (typeof value === "object") {
            value = JSON.stringify(value);
          }
          rowsHTML += `
            <div class="config-row">
              <div class="label">${key}:</div>
              <div class="value">${String(value)}</div>
            </div>
          `;
        }

        jsonDisplayHTML = `
          <div class="status-banner">
            <span>✓ JSON Yapısı Başarıyla Doğrulandı (Valid JSON)</span>
          </div>
          <div class="config-card">
            ${rowsHTML ? rowsHTML : '<div style="color: #8b949e; text-align: center;">Boş JSON nesnesi.</div>'}
          </div>
        `;
      }

      compiledHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              background: #0f111a;
              color: #cbd5e1;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              padding: 20px;
              margin: 0;
            }
            .status-banner {
              background: rgba(16, 185, 129, 0.1);
              border: 1px solid rgba(16, 185, 129, 0.3);
              padding: 12px;
              border-radius: 8px;
              color: #3fb950;
              font-weight: 600;
              font-size: 13px;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .config-card {
              background: #161b22;
              border-radius: 12px;
              padding: 20px;
              border: 1px solid #30363d;
            }
            .config-row {
              display: flex;
              border-bottom: 1px solid #21262d;
              padding: 10px 0;
              font-size: 13px;
            }
            .config-row:last-child {
              border-bottom: none;
            }
            .label {
              color: #8b949e;
              width: 140px;
              font-weight: 500;
            }
            .value {
              color: #58a6ff;
              font-family: monospace;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          ${jsonDisplayHTML}
        </body>
        </html>
      `;
      logToConsole("[JSON] Kod analizi tamamlandı.", "system-msg");
      if (isJSONValid) {
        logToConsole("[JSON] Yapı başarıyla doğrulandı.", "result-success");
      } else {
        logToConsole(`[JSON Hata] ${jsonErrorMsg}`, "system-msg");
      }
    }

    iframe.srcdoc = compiledHTML;
  }
}

// "Çalıştır" butonuna basıldığında hem kodu çalıştır hem de canlı önizleme sekmesine geçiş yap
document.getElementById("btn-run").addEventListener("click", function () {
  if (!currentActiveFile) {
    logToConsole("Lütfen önce çalıştırılacak bir dosya açın (Örn: index.html, queries.sql, vb.).", "system-msg");
    return;
  }
  switchToTab("preview-view");
  runLiveCode();
});

// Iframe içindeki console.log'ları dinleyip konsol penceresine basan mesaj dinleyicisi
window.addEventListener("message", function (e) {
  if (e.data && e.data.type === 'IFRAME_LOG') {
    logToConsole(`[Console.log] ${e.data.message}`, "result-success");
  }
  if (e.data && e.data.type === 'IFRAME_ERROR') {
    logToConsole(`[Hata] ${e.data.message}`, "system-msg");
  }
});

// ----------------------------------------------------
// Clomosy API & DB Sandbox Test İstasyonu
// ----------------------------------------------------
// Panel değiştiricileri
const btnSandboxRest = document.getElementById("btn-sandbox-rest");
const btnSandboxDb = document.getElementById("btn-sandbox-db");
const panelRest = document.getElementById("sandbox-rest-panel");
const panelDb = document.getElementById("sandbox-db-panel");
const resultTitle = document.getElementById("sandbox-result-title");
const resultOutput = document.getElementById("sandbox-result-output");
const clomosyCodeOutput = document.getElementById("sandbox-clomosy-code");

if (btnSandboxRest && btnSandboxDb) {
  btnSandboxRest.addEventListener("click", function () {
    this.classList.add("active");
    btnSandboxDb.classList.remove("active");
    panelRest.style.display = "block";
    panelDb.style.display = "none";
    resultTitle.innerText = "API Yanıtı (JSON):";
    resultOutput.innerText = "// İstek sonuçları burada görüntülenecektir";
    clomosyCodeOutput.innerText = "// Clomosy Pascal karşılığı burada üretilecektir";
  });

  btnSandboxDb.addEventListener("click", function () {
    this.classList.add("active");
    btnSandboxRest.classList.remove("active");
    panelRest.style.display = "none";
    panelDb.style.display = "block";
    resultTitle.innerText = "Sorgu Sonucu (Veri Kümesi):";
    resultOutput.innerText = "// SQL sonuçları burada görüntülenecektir";
    clomosyCodeOutput.innerText = "// Clomosy Pascal karşılığı burada üretilecektir";
  });
}

// REST API Gönderme İşlemi
const btnSendRest = document.getElementById("btn-sandbox-send-rest");
if (btnSendRest) {
  btnSendRest.addEventListener("click", function () {
    const url = document.getElementById("sandbox-rest-url").value;
    logToConsole(`REST API İsteği Gönderiliyor: ${url}`, "api-call");
    resultOutput.innerText = "Yükleniyor...";

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const strData = JSON.stringify(data, null, 2);
        resultOutput.innerText = strData;
        logToConsole(`REST API Yanıtı Başarıyla Alındı (${strData.length} bayt).`, "result-success");

        // Clomosy Kodu Üret
        clomosyCodeOutput.innerText = `var\n  rest: TclRest;\n{\n  rest = TclRest.Create;\n  rest.BaseURL = '${url}';\n  rest.Method = rmGET;\n  rest.Accept = 'application/json';\n  rest.Execute;\n  ShowMessage(rest.Response);\n  rest.Free;\n}`;
      })
      .catch(err => {
        resultOutput.innerText = "Hata: " + err.message;
        logToConsole(`REST API Hatası: ${err.message}`, "system-msg");
        clomosyCodeOutput.innerText = "// Hata oluştuğu için kod üretilemedi";
      });
  });
}

// SQLite Mock Veritabanı
const mockSandboxDB = {
  kullanicilar: [
    { id: 1, isim: "Ahmet", yas: 28, sehir: "İstanbul" },
    { id: 2, isim: "Mehmet", yas: 34, sehir: "Ankara" },
    { id: 3, isim: "Ayşe", yas: 22, sehir: "İzmir" },
    { id: 4, isim: "Fatma", yas: 41, sehir: "Bursa" }
  ],
  urunler: [
    { id: 1, ad: "iPhone 15", miktar: 45 },
    { id: 2, ad: "MacBook Pro", miktar: 20 },
    { id: 3, ad: "iPad Air", miktar: 35 }
  ]
};

// SQL Sorgusu Çalıştırma İşlemi
const btnRunQuery = document.getElementById("btn-sandbox-run-query");
if (btnRunQuery) {
  btnRunQuery.addEventListener("click", function () {
    const query = document.getElementById("sandbox-db-query").value;
    logToConsole(`SQLite Sorgusu Çalıştırılıyor: ${query}`, "api-call");

    let table = "kullanicilar";
    if (query.toLowerCase().includes("urunler")) {
      table = "urunler";
    }

    let rows = mockSandboxDB[table];
    if (query.toLowerCase().includes("yas > 25") && table === "kullanicilar") {
      rows = rows.filter(row => row.yas > 25);
    }

    // Markdown / Düz metin tablosu olarak çıktı üretelim
    let tableOutput = "";
    if (table === "kullanicilar") {
      tableOutput = "ID | İsim   | Yaş | Şehir\n---|--------|-----|---------\n";
      rows.forEach(r => {
        tableOutput += `${r.id}  | ${r.isim.padEnd(6)} | ${r.yas}  | ${r.sehir}\n`;
      });
    } else {
      tableOutput = "ID | Ürün Adı    | Stok Miktarı\n---|-------------|-------------\n";
      rows.forEach(r => {
        tableOutput += `${r.id}  | ${r.ad.padEnd(11)} | ${r.miktar}\n`;
      });
    }

    resultOutput.innerText = tableOutput;
    logToConsole(`SQLite Sorgusu Başarıyla Sonuçlandı (${rows.length} satır).`, "result-success");

    // Clomosy Kodu Üret
    clomosyCodeOutput.innerText = `{\n  Clomosy.DBSQLiteConnect(Clomosy.AppFilesPath + 'local.db', '');\n  Clomosy.DBSQLiteQuery.Sql.Text = '${query.replace(/'/g, "''")}';\n  Clomosy.DBSQLiteQuery.OpenOrExecute;\n}`;
  });
}

// Sandbox Kodu Enjekte Etme Butonu
const btnSandboxInject = document.getElementById("btn-sandbox-inject-code");
if (btnSandboxInject) {
  btnSandboxInject.addEventListener("click", function () {
    const code = clomosyCodeOutput.innerText;
    if (code.startsWith("//") || code.trim() === "") {
      logToConsole("Enjekte edilecek geçerli bir sandbox kodu bulunamadı. Önce test edin!", "system-msg");
      return;
    }
    injectDocCode(code, "Sandbox Kodu", "pascal");
  });
}

// Başlangıç durum çubuğu kurulumunu tetikle
updateStatusBar();
logToConsole("Editör başarıyla başlatıldı ve Clomosy API Sandbox aktifleşti.", "system-msg");

// ----------------------------------------------------
// Özel Klavye Kısayolları ve Komutlar (Hotkeys)
// ----------------------------------------------------

// Ctrl+S / Cmd+S Kısayolu: Kodu Çalıştır
editor.commands.addCommand({
  name: 'runLiveCodeHotkey',
  bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
  exec: function (editor) {
    runLiveCode();
    // Web çıktısı olan dillerde otomatik olarak önizlemeye geç
    const mode = document.getElementById("mode-select").value;
    if (mode === "html" || mode === "css" || mode === "javascript") {
      if (!isSplitMode) {
        switchToTab("preview-view");
      }
    }
  },
  readOnly: false
});

// Ctrl+Shift+F / Cmd+Shift+F Kısayolu: Kodu Biçimlendir
editor.commands.addCommand({
  name: 'formatCodeHotkey',
  bindKey: { win: 'Ctrl-Shift-F', mac: 'Command-Shift-F' },
  exec: function (editor) {
    document.getElementById("btn-format").click();
  },
  readOnly: false
});

// ----------------------------------------------------
// Clomosy (TRObject) Özel Otomatik Tamamlama Tanımları
// ----------------------------------------------------
const clomosyCompleter = {
  getCompletions: function (editor, session, pos, prefix, callback) {
    // Sadece Pascal/Delphi modunda Clomosy terimlerini göster
    if (session.$modeId !== "ace/mode/pascal") {
      callback(null, []);
      return;
    }
    const completions = [
      // Classes
      { name: "TclForm", value: "TclForm", score: 1000, meta: "Clomosy Form Sınıfı" },
      { name: "TclProPanel", value: "TclProPanel", score: 1000, meta: "Pro Panel Katmanı" },
      { name: "TclProLabel", value: "TclProLabel", score: 1000, meta: "Pro Etiket Nesnesi" },
      { name: "TClProButton", value: "TClProButton", score: 1000, meta: "Pro Buton Nesnesi" },
      { name: "TclEdit", value: "TclEdit", score: 1000, meta: "Metin Giriş Kutusu" },
      { name: "TclMemo", value: "TclMemo", score: 1000, meta: "Çok Satırlı Metin Alanı" },
      { name: "TclImage", value: "TclImage", score: 1000, meta: "Görsel Yükleme Bileşeni" },
      { name: "TclListView", value: "TclListView", score: 1000, meta: "Liste Görünümü" },
      { name: "TclRest", value: "TclRest", score: 1000, meta: "HTTP Web REST API" },
      { name: "TclTimer", value: "TclTimer", score: 1000, meta: "Arka Plan Zamanlayıcı" },
      { name: "TClHorzScrollBox", value: "TClHorzScrollBox", score: 1000, meta: "Yatay Kaydırma Kutusu" },
      { name: "TclVertScrollBox", value: "TclVertScrollBox", score: 1000, meta: "Dikey Kaydırma Kutusu" },
      { name: "TclMediaPlayer", value: "TclMediaPlayer", score: 1000, meta: "Medya Oynatıcı" },
      { name: "TclJSONQuery", value: "TclJSONQuery", score: 1000, meta: "JSON Veri Sorgulayıcı" },

      // Events
      { name: "tbeOnClick", value: "tbeOnClick", score: 950, meta: "Tıklama Olayı Sabiti" },
      { name: "tbeOnItemClick", value: "tbeOnItemClick", score: 950, meta: "Satır Tıklama Olayı" },
      { name: "tbeOnTimer", value: "tbeOnTimer", score: 950, meta: "Sayaç Tetiklenme Olayı" },
      { name: "tbeOnBarcodeResult", value: "tbeOnBarcodeResult", score: 950, meta: "Barkod Okunma Olayı" },

      // Core methods
      { name: "ShowMessage", value: "ShowMessage('...');", score: 900, meta: "Dialog/Mesaj Kutusu" },
      { name: "DBSQLiteConnect", value: "DBSQLiteConnect(..., '');", score: 900, meta: "SQLite Bağlantısı Aç" },
      { name: "DBSQLiteQuery", value: "DBSQLiteQuery", score: 900, meta: "SQLite Sorgu Çalıştırıcı" },
      { name: "DBSQLServerConnect", value: "DBSQLServerConnect(..., 1433);", score: 900, meta: "SQL Server Bağlantısı Aç" },
      { name: "DBSQLServerQueryWith", value: "DBSQLServerQueryWith('...');", score: 900, meta: "SQL Server Sorgu Çalıştır" },
      { name: "PlayGameSound", value: "PlayGameSound(...);", score: 900, meta: "Ses Efekti Oynat" },
      { name: "RegisterSound", value: "RegisterSound('...');", score: 900, meta: "Ses Efekti Kaydet" },
      { name: "setImage", value: "setImage(..., '...');", score: 900, meta: "Görsel Dosyası Ata" },
      { name: "CallBarcodeReader", value: "CallBarcodeReader;", score: 900, meta: "Barkod Okuyucu Aç" },
      { name: "DeviceLocation", value: "DeviceLocation", score: 900, meta: "GPS Konum Nesnesi" },

      // Properties
      { name: "Align", value: "Align", score: 850, meta: "Bileşen Hizalaması" },
      { name: "Width", value: "Width", score: 850, meta: "Bileşen Genişliği" },
      { name: "Height", value: "Height", score: 850, meta: "Bileşen Yüksekliği" },
      { name: "Margins", value: "Margins", score: 850, meta: "Bileşen Dış Boşlukları" },
      { name: "Text", value: "Text", score: 850, meta: "Bileşen Metni/İçeriği" },
      { name: "BaseURL", value: "BaseURL", score: 850, meta: "REST API Taban URL" },
      { name: "Method", value: "Method", score: 850, meta: "REST API Metodu (rmGET/rmPOST)" },
      { name: "Accept", value: "Accept", score: 850, meta: "REST API Accept Türü" },
      { name: "Execute", value: "Execute;", score: 850, meta: "REST API İsteği Gönder" }
    ];
    callback(null, completions);
  }
};

// Ace dil araçlarına completer'ı kaydet
const langTools = ace.require("ace/ext/language_tools");
if (langTools) {
  langTools.addCompleter(clomosyCompleter);
  logToConsole("Clomosy (TRObject) özel otomatik tamamlama listesi başarıyla editöre eklendi.", "system-msg");
}

// ----------------------------------------------------
// Vim Modu Özel Komutları (:w yazıldığında derlesin)
// ----------------------------------------------------
ace.config.loadModule("ace/keyboard/vim", function (m) {
  const Vim = ace.require("ace/keyboard/vim").CodeMirror.Vim;
  if (Vim) {
    // :w veya :write yazıldığında kodu çalıştır
    Vim.defineEx("write", "w", function (cm, input) {
      runLiveCode();
      const mode = document.getElementById("mode-select").value;
      if (mode === "html" || mode === "css" || mode === "javascript") {
        if (!isSplitMode) {
          switchToTab("preview-view");
        }
      }
    });
  }
});

// ----------------------------------------------------
// VS Code Tipi Sol İkon Çubuğu (Activity Bar) Yönetimi
// ----------------------------------------------------
document.querySelectorAll(".activity-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    const tabName = this.getAttribute("data-tab");
    const controlPanel = document.getElementById("main-control-panel");
    const isCurrentlyCollapsed = controlPanel.classList.contains("collapsed");

    // Aktif buton stilini güncelle
    const wasActive = this.classList.contains("active");
    document.querySelectorAll(".activity-btn").forEach(b => b.classList.remove("active"));

    if (wasActive && !isCurrentlyCollapsed) {
      // Zaten aktif olan ikona tekrar basıldıysa paneli gizle (çekmece mantığı)
      controlPanel.classList.add("collapsed");
      setTimeout(() => editor.resize(), 350);
      return;
    }

    // Paneli aç ve ikonu aktif göster
    this.classList.add("active");
    if (isCurrentlyCollapsed) {
      controlPanel.classList.remove("collapsed");
      setTimeout(() => editor.resize(), 350);
    }

    // İlgili tab bölümünü aktifleştir
    document.querySelectorAll(".sidebar-section").forEach(sec => sec.classList.remove("active"));
    const targetSection = document.getElementById(`section-${tabName}`);
    if (targetSection) {
      targetSection.classList.add("active");
    }

    // Başlığı ve İkonu güncelle
    const titleText = document.getElementById("panel-title-text");
    const headerIcon = document.getElementById("panel-header-icon");
    if (tabName === "settings") {
      titleText.innerText = "Ayarlar & Görünüm";
      headerIcon.innerHTML = `<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>`;
    } else if (tabName === "snippets") {
      titleText.innerText = "Şablon Kütüphanesi";
      headerIcon.innerHTML = `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>`;
    } else if (tabName === "docs") {
      titleText.innerText = "Doküman Kitaplığı";
      headerIcon.innerHTML = `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>`;
    } else {
      titleText.innerText = "API Sandbox";
      headerIcon.innerHTML = `<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>`;
    }
  });
});

// ----------------------------------------------------
// Şablon Kütüphanesi Ekleme Tetikleyicileri
// ----------------------------------------------------
const templateSnippets = {
  "sql-connection": `-- SQLite / SQL Server Mock Bağlantı Testi
DROP TABLE IF EXISTS baglanti_test;
CREATE TABLE baglanti_test (
    id INT,
    sunucu_adi VARCHAR(100),
    baglanti_tipi VARCHAR(50),
    durum VARCHAR(20)
);

INSERT INTO baglanti_test (id, sunucu_adi, baglanti_tipi, durum) 
VALUES (1, 'SQLServer_Local_DB', 'MSSQL Connection', 'Baglandi');

INSERT INTO baglanti_test (id, sunucu_adi, baglanti_tipi, durum) 
VALUES (2, 'SQLite_Mobile_Cache', 'SQLite Local', 'Aktif');

SELECT * FROM baglanti_test;`,

  "sql-report": `-- Proje Dosya Sayısı Raporlama Analizi
SELECT 
    ProjeAdi AS Proje_Ismi,
    ToplamTroDosyasi AS Dosya_Sayisi,
    ToplamKodSatiri AS Satir_Sayisi
FROM 
    projects 
WHERE 
    ToplamTroDosyasi > 4 
ORDER BY 
    ToplamKodSatiri DESC;`,

  "web-login": `<!-- Giriş Formu (Login Form) Arayüz Şablonu -->
<div style="max-width: 320px; margin: 50px auto; padding: 25px; background: #161b22; border: 1px solid #30363d; border-radius: 12px; font-family: sans-serif; color: #fff;">
  <h3 style="margin-top: 0; font-size: 18px; text-align: center; color: #58a6ff;">Kullanıcı Girişi</h3>
  <div style="margin-bottom: 15px;">
    <label style="display: block; font-size: 12px; margin-bottom: 5px;">E-posta Adresi</label>
    <input type="email" id="email" value="admin@clomosy.com" style="width: 100%; padding: 8px; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; color: #fff;">
  </div>
  <div style="margin-bottom: 20px;">
    <label style="display: block; font-size: 12px; margin-bottom: 5px;">Şifre</label>
    <input type="password" id="password" value="123456" style="width: 100%; padding: 8px; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; color: #fff;">
  </div>
  <button onclick="handleLogin()" style="width: 100%; padding: 10px; background: #238636; border: none; border-radius: 6px; color: #fff; font-weight: bold; cursor: pointer;">Giriş Yap</button>
  <div id="login-msg" style="margin-top: 15px; text-align: center; font-size: 13px; color: #58a6ff;"></div>
</div>

<script>
  function handleLogin() {
    const email = document.getElementById('email').value;
    const msg = document.getElementById('login-msg');
    msg.innerText = email + " ile giris yapildi. Hos geldiniz!";
    console.log("Giris Basarili: " + email);
  }
</script>`,

  "web-mail": `<!-- E-posta Gönderme Formu Şablonu -->
<div style="max-width: 400px; margin: 40px auto; padding: 25px; background: #161b22; border: 1px solid #30363d; border-radius: 12px; font-family: sans-serif; color: #fff;">
  <h3 style="margin-top: 0; font-size: 18px; color: #58a6ff;">Yeni E-posta Gönder</h3>
  <div style="margin-bottom: 12px;">
    <label style="display: block; font-size: 12px; margin-bottom: 5px;">Kime</label>
    <input type="email" id="mail-to" value="iletisim@ardcek.com" style="width: 100%; padding: 8px; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; color: #fff;">
  </div>
  <div style="margin-bottom: 12px;">
    <label style="display: block; font-size: 12px; margin-bottom: 5px;">Konu</label>
    <input type="text" id="mail-subject" value="Ace Editor Proje İşbirliği" style="width: 100%; padding: 8px; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; color: #fff;">
  </div>
  <div style="margin-bottom: 20px;">
    <label style="display: block; font-size: 12px; margin-bottom: 5px;">Mesajınız</label>
    <textarea id="mail-body" rows="4" style="width: 100%; padding: 8px; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; color: #fff; resize: none;">Merhaba Arda Bey, Ace Editor projenizi inceledik ve çok başarılı bulduk.</textarea>
  </div>
  <button onclick="sendMail()" style="width: 100%; padding: 10px; background: #2188ff; border: none; border-radius: 6px; color: #fff; font-weight: bold; cursor: pointer;">E-posta Gönder</button>
  <div id="mail-status" style="margin-top: 15px; text-align: center; font-size: 13px; color: #56d364;"></div>
</div>

<script>
  function sendMail() {
    const to = document.getElementById('mail-to').value;
    const status = document.getElementById('mail-status');
    status.innerText = "E-posta basariyla gonderildi: " + to;
    console.log("E-posta Gonderildi: " + to);
  }
</script>`,

  "py-unittest": `# Python unittest Modülü Test Sınıfı Şablonu
import unittest

# Test edilecek örnek fonksiyon
def carpma(a, b):
    return a * b

class TestCarpmaIslemi(unittest.TestCase):
    def test_pozitif_sayilar(self):
        self.assertEqual(carpma(3, 4), 12)
        
    def test_negatif_sayilar(self):
        self.assertEqual(carpma(-2, -5), 10)

if __name__ == "__main__":
    unittest.main()`,

  "py-analysis": `# Python Veri Analiz ve İstatistik Simülasyonu
notlar = [85, 90, 78, 92, 64, 100, 88]

print("--- Ogrenci Notlari Analizi ---")
toplam = 0
for not_degeri in notlar:
    toplam += not_degeri
    
ortalama = toplam / len(notlar)
en_yuksek = max(notlar)
en_dusuk = min(notlar)

print("Toplam Ogrenci Sayisi: " + str(len(notlar)))
print("Sinif Ortalamasi: " + str(round(ortalama, 2)))
print("En Yuksek Not: " + str(en_yuksek))
print("En Dusuk Not: " + str(en_dusuk))`,

  "pas-form-components": `// Clomosy Mobil Arayüz - Temel Form ve Bileşenler
var
  MyForm: TclForm;
  mainPnl: TclProPanel;
  lblTitle: TclProLabel;
  editInput: TclEdit;
  btnAction: TClProButton;
  
void btnActionClick;
{
  if (editInput.Text == '')
  {
    ShowMessage('Lütfen geçerli bir metin girin!');
  }
  else
  {
    ShowMessage('Girdiğiniz Değer: ' + editInput.Text);
  }
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  // Ana Panel Layout'u
  mainPnl = MyForm.AddNewProPanel(MyForm, 'mainPnl');
  mainPnl.Align = alCenter;
  mainPnl.Width = 260;
  mainPnl.Height = 220;
  clComponent.SetupComponent(mainPnl, '{"BackgroundColor":"#1E293B", "RoundHeight":15, "RoundWidth":15}');
  
  // Başlık Etiketi
  lblTitle = MyForm.AddNewProLabel(mainPnl, 'lblTitle', 'BİLEŞEN DEMOSU');
  lblTitle.Align = alTop;
  lblTitle.Height = 35;
  lblTitle.clProSettings.FontColor = clAlphaColor.clWhite;
  lblTitle.clProSettings.FontSize = 14;
  lblTitle.clProSettings.TextSettings.Font.Style = [fsBold];
  lblTitle.SetclProSettings(lblTitle.clProSettings);
  
  // Metin Giriş Edit Kutusu
  editInput = MyForm.AddNewEdit(mainPnl, 'editInput', 'Buraya yazın...');
  editInput.Align = alTop;
  editInput.Height = 45;
  editInput.Margins.Top = 15;
  
  // İşlem Tetikleme Butonu
  btnAction = MyForm.AddNewProButton(mainPnl, 'btnAction', 'Gönder');
  btnAction.Align = alBottom;
  btnAction.Height = 45;
  btnAction.clProSettings.FontColor = clAlphaColor.clWhite;
  btnAction.clProSettings.BackgroundColor = clAlphaColor.clMediumpurple;
  btnAction.SetclProSettings(btnAction.clProSettings);
  
  MyForm.AddNewEvent(btnAction, tbeOnClick, 'btnActionClick');
  
  MyForm.Run;
}`,

  "pas-memo": `// Clomosy TclMemo - Çok Satırlı Yazı Alanı Demosu
var
  MyForm: TclForm;
  noteMemo: TclMemo;
  btnLog: TClProButton;
  
void btnLogClick;
{
  ShowMessage('Memo Satır Sayısı: ' + IntToStr(noteMemo.Lines.Count));
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  // Memo Alanı Ekle
  noteMemo = MyForm.AddNewMemo(MyForm, 'noteMemo', 'Satır 1: Clomosy TRObject Notları\\nSatır 2: Mobil uygulama geliştirmek çok pratik.');
  noteMemo.Align = alClient;
  noteMemo.Margins.Bottom = 20;
  
  // Analiz Butonu
  btnLog = MyForm.AddNewProButton(MyForm, 'btnLog', 'İçeriği Analiz Et');
  btnLog.Align = alBottom;
  btnLog.Height = 50;
  
  MyForm.AddNewEvent(btnLog, tbeOnClick, 'btnLogClick');
  
  MyForm.Run;
}`,

  "pas-image": `// Clomosy TclImage - Web üzerinden Görsel Yükleme Demosu
var
  MyForm: TclForm;
  sampleImg: TclImage;
  lblInfo: TclProLabel;

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  // Görsel Yükleme Alanı
  sampleImg = MyForm.AddNewImage(MyForm, 'sampleImg');
  sampleImg.Align = alCenter;
  sampleImg.Width = 240;
  sampleImg.Height = 240;
  MyForm.setImage(sampleImg, 'https://clomosy.com/demos/bg.png');
  
  // Bilgilendirme Etiketi
  lblInfo = MyForm.AddNewProLabel(MyForm, 'lblInfo', 'Web\\'den Yüklenen Görsel');
  lblInfo.Align = alBottom;
  lblInfo.Height = 40;
  lblInfo.clProSettings.FontColor = clAlphaColor.clLightgray;
  lblInfo.SetclProSettings(lblInfo.clProSettings);
  
  MyForm.Run;
}`,

  "pas-image-click": `// Clomosy Görsel Tıklama ve Etiket Kontrolü Demosu
var
  MyForm: TclForm;
  sampleImg: TclImage;
  lblStatus: TclProLabel;
  
void sampleImgClick;
{
  lblStatus.Text = 'Durum: Görsele Tıklandı!';
  ShowMessage('Görsele başarıyla tıkladınız!');
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  sampleImg = MyForm.AddNewImage(MyForm, 'sampleImg');
  sampleImg.Align = alCenter;
  sampleImg.Width = 200;
  sampleImg.Height = 200;
  MyForm.setImage(sampleImg, 'https://clomosy.com/demos/bg.png');
  
  lblStatus = MyForm.AddNewProLabel(MyForm, 'lblStatus', 'Durum: Bekleniyor...');
  lblStatus.Align = alBottom;
  lblStatus.Height = 40;
  lblStatus.clProSettings.FontColor = clAlphaColor.clMediumpurple;
  lblStatus.SetclProSettings(lblStatus.clProSettings);
  
  MyForm.AddNewEvent(sampleImg, tbeOnClick, 'sampleImgClick');
  MyForm.Run;
}`,

  "pas-phone-book": `// Clomosy Mobil Rehber Bağlantısı Demosu
var
  MyForm: TclForm;
  contactsMemo: TclMemo;
  btnLoadContacts: TClProButton;
  
void btnLoadContactsClick;
{
  // Cihaz rehberinden kişileri oku
  Clomosy.DeviceManager.GetContacts;
  contactsMemo.Lines.Text = Clomosy.DeviceManager.ContactsList.Text;
  ShowMessage('Rehber kayıtları başarıyla okundu!');
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  contactsMemo = MyForm.AddNewMemo(MyForm, 'contactsMemo', 'Rehber listelemek için butona tıklayın...');
  contactsMemo.Align = alClient;
  contactsMemo.Margins.Bottom = 15;
  
  btnLoadContacts = MyForm.AddNewProButton(MyForm, 'btnLoadContacts', 'Rehberi Yükle');
  btnLoadContacts.Align = alBottom;
  btnLoadContacts.Height = 50;
  
  MyForm.AddNewEvent(btnLoadContacts, tbeOnClick, 'btnLoadContactsClick');
  MyForm.Run;
}`,

  "pas-horz-scroll": `// Clomosy Yatay Kaydırılabilir Kart Listesi (HorzScrollBox)
var
  MyForm: TclForm;
  scrollBox: TClHorzScrollBox;
  cardPnl: TclProPanel;
  lblCard: TclProLabel;
  i: Integer;

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  // Yatay Kaydırma Kutusu
  scrollBox = MyForm.AddNewHorzScrollBox(MyForm, 'scrollBox');
  scrollBox.Align = alCenter;
  scrollBox.Height = 150;
  scrollBox.Width = 320;
  
  // 5 Adet Yatay Kart Oluştur
  for i = 1 to 5 do
  begin
    cardPnl = MyForm.AddNewProPanel(scrollBox, 'cardPnl' + IntToStr(i));
    cardPnl.Align = alLeft;
    cardPnl.Width = 120;
    cardPnl.Margins.Left = 10;
    cardPnl.Margins.Right = 10;
    clComponent.SetupComponent(cardPnl, '{"BackgroundColor":"#1E293B", "RoundHeight":10, "RoundWidth":10}');
    
    lblCard = MyForm.AddNewProLabel(cardPnl, 'lblCard' + IntToStr(i), 'KART ' + IntToStr(i));
    lblCard.Align = alCenter;
    lblCard.clProSettings.FontColor = clAlphaColor.clWhite;
    lblCard.SetclProSettings(lblCard.clProSettings);
  end;
  
  MyForm.Run;
}`,

  "pas-send-mail": `// Clomosy SendMailNoReplay ile E-posta Gönderimi
var
  MyForm: TclForm;
  btnSend: TClProButton;
  
void btnSendClick;
{
  // Arka planda e-posta gönder
  Clomosy.SendMailNoReplay('destek@clomosy.com', 'Sistem Uyarısı', 'Uygulamadan otomatik bildirim gönderildi.');
  ShowMessage('E-posta başarıyla gönderildi!');
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  btnSend = MyForm.AddNewProButton(MyForm, 'btnSend', 'E-Posta Gönder');
  btnSend.Align = alCenter;
  btnSend.Width = 200;
  btnSend.Height = 50;
  
  MyForm.AddNewEvent(btnSend, tbeOnClick, 'btnSendClick');
  MyForm.Run;
}`,

  "pas-mail-input": `// Clomosy Kullanıcı Girdili Gelişmiş E-posta Formu
var
  MyForm: TclForm;
  editTo: TclEdit;
  editSub: TclEdit;
  memoContent: TclMemo;
  btnSendMail: TClProButton;

void btnSendMailClick;
{
  if ((editTo.Text == '') || (editSub.Text == ''))
  {
    ShowMessage('Lütfen Alıcı ve Konu kısımlarını doldurun!');
  }
  else
  {
    Clomosy.SendMailNoReplay(editTo.Text, editSub.Text, memoContent.Lines.Text);
    ShowMessage('E-posta başarıyla alıcıya ulaştırıldı!');
  }
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  editTo = MyForm.AddNewEdit(MyForm, 'editTo', 'Alıcı E-posta adresi...');
  editTo.Align = alTop;
  editTo.Height = 45;
  editTo.Margins.Bottom = 10;
  
  editSub = MyForm.AddNewEdit(MyForm, 'editSub', 'E-posta Konusu...');
  editSub.Align = alTop;
  editSub.Height = 45;
  editSub.Margins.Bottom = 10;
  
  memoContent = MyForm.AddNewMemo(MyForm, 'memoContent', 'E-posta içeriğini buraya girin...');
  memoContent.Align = alClient;
  memoContent.Margins.Bottom = 15;
  
  btnSendMail = MyForm.AddNewProButton(MyForm, 'btnSendMail', 'E-Postayı Gönder');
  btnSendMail.Align = alBottom;
  btnSendMail.Height = 50;
  
  MyForm.AddNewEvent(btnSendMail, tbeOnClick, 'btnSendMailClick');
  MyForm.Run;
}`,

  "pas-save-notes": `// Clomosy StringList ile Dosyaya Kayıt Not Defteri
var
  MyForm: TclForm;
  noteMemo: TclMemo;
  btnSave: TClProButton;
  btnRead: TClProButton;
  strList: TclStringList;

void btnSaveClick;
{
  strList = TclStringList.Create;
  strList.Text = noteMemo.Lines.Text;
  // Dosyaya kaydet
  strList.SaveToFile(Clomosy.AppFilesPath + 'GunlukNotlar.txt');
  ShowMessage('Notlar başarıyla yerel dosyaya kaydedildi!');
  strList.Free;
}

void btnReadClick;
{
  strList = TclStringList.Create;
  // Dosyayı oku
  strList.LoadFromFile(Clomosy.AppFilesPath + 'GunlukNotlar.txt');
  noteMemo.Lines.Text = strList.Text;
  ShowMessage('Notlar yerel dosyadan başarıyla yüklendi!');
  strList.Free;
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  noteMemo = MyForm.AddNewMemo(MyForm, 'noteMemo', 'Buraya notlarınızı yazın...');
  noteMemo.Align = alClient;
  noteMemo.Margins.Bottom = 15;
  
  btnSave = MyForm.AddNewProButton(MyForm, 'btnSave', 'Dosyaya Kaydet');
  btnSave.Align = alBottom;
  btnSave.Height = 45;
  btnSave.Margins.Bottom = 5;
  
  btnRead = MyForm.AddNewProButton(MyForm, 'btnRead', 'Dosyadan Oku');
  btnRead.Align = alBottom;
  btnRead.Height = 45;
  
  MyForm.AddNewEvent(btnSave, tbeOnClick, 'btnSaveClick');
  MyForm.AddNewEvent(btnRead, tbeOnClick, 'btnReadClick');
  MyForm.Run;
}`,

  "pas-color-palette": `// Clomosy Renk Paleti ve Panoya Kopyalama (Clipboard)
var
  MyForm: TclForm;
  colorPnl: TclProPanel;
  lblColorHex: TclProLabel;
  btnGenColor: TClProButton;
  btnCopy: TClProButton;
  hexCode: String;

void btnGenColorClick;
var
  r, g, b: Integer;
{
  // Rastgele RGB oluştur
  r = Random(256);
  g = Random(256);
  b = Random(256);
  hexCode = '#' + IntToHex(r, 2) + IntToHex(g, 2) + IntToHex(b, 2);
  
  lblColorHex.Text = hexCode;
  clComponent.SetupComponent(colorPnl, '{"BackgroundColor":"' + hexCode + '"}');
}

void btnCopyClick;
{
  // Panoya kopyala
  Clomosy.SetClipBoard(hexCode);
  ShowMessage('Renk kodu kopyalandı: ' + hexCode);
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  hexCode = '#6366f1';
  
  colorPnl = MyForm.AddNewProPanel(MyForm, 'colorPnl');
  colorPnl.Align = alTop;
  colorPnl.Height = 150;
  clComponent.SetupComponent(colorPnl, '{"BackgroundColor":"#6366f1", "RoundHeight":15, "RoundWidth":15}');
  
  lblColorHex = MyForm.AddNewProLabel(colorPnl, 'lblColorHex', '#6366f1');
  lblColorHex.Align = alCenter;
  lblColorHex.clProSettings.FontColor = clAlphaColor.clWhite;
  lblColorHex.clProSettings.FontSize = 18;
  lblColorHex.SetclProSettings(lblColorHex.clProSettings);
  
  btnGenColor = MyForm.AddNewProButton(MyForm, 'btnGenColor', 'Yeni Renk Üret');
  btnGenColor.Align = alBottom;
  btnGenColor.Height = 45;
  btnGenColor.Margins.Bottom = 5;
  
  btnCopy = MyForm.AddNewProButton(MyForm, 'btnCopy', 'Kodu Panoya Kopyala');
  btnCopy.Align = alBottom;
  btnCopy.Height = 45;
  
  MyForm.AddNewEvent(btnGenColor, tbeOnClick, 'btnGenColorClick');
  MyForm.AddNewEvent(btnCopy, tbeOnClick, 'btnCopyClick');
  MyForm.Run;
}`,

  "pas-rest-api": `// Clomosy TclRest - Web API Servisinden GET/POST Çağrısı Demosu
var
  MyForm: TclForm;
  clRest: TclRest;
  btnFetch: TClProButton;
  
void btnFetchClick;
{
  clRest = TclRest.Create;
  clRest.BaseURL = 'https://api.github.com/users/octocat';
  clRest.Method = rmGET;
  clRest.Accept = 'application/json';
  clRest.Execute;
  
  // GitHub Kullanıcı Profil Yanıtı
  ShowMessage('GitHub API Yanıtı: ' + clRest.Response);
  clRest.Free;
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  btnFetch = MyForm.AddNewProButton(MyForm, 'btnFetch', 'Dış Web API\\'den Veri Çek');
  btnFetch.Align = alCenter;
  btnFetch.Width = 200;
  btnFetch.Height = 50;
  
  MyForm.AddNewEvent(btnFetch, tbeOnClick, 'btnFetchClick');
  MyForm.Run;
}`,

  "pas-json-file": `// Clomosy JSON Formatında Dosyaya Veri Yazma
var
  MyForm: TclForm;
  editName: TclEdit;
  editAge: TclEdit;
  btnSaveJson: TClProButton;
  jsonObj: TclJSONQuery;
  strList: TclStringList;

void btnSaveJsonClick;
{
  jsonObj = TclJSONQuery.Create(self);
  jsonObj.Sql.Text = '{"kullanici": {"isim": "' + editName.Text + '", "yas": ' + editAge.Text + '}}';
  
  strList = TclStringList.Create;
  strList.Text = jsonObj.Sql.Text;
  strList.SaveToFile(Clomosy.AppFilesPath + 'user_data.json');
  ShowMessage('JSON Verisi başarıyla user_data.json dosyasına yazıldı!');
  strList.Free;
  jsonObj.Free;
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  editName = MyForm.AddNewEdit(MyForm, 'editName', 'Kullanıcı Adı...');
  editName.Align = alTop;
  editName.Height = 45;
  editName.Margins.Bottom = 10;
  
  editAge = MyForm.AddNewEdit(MyForm, 'editAge', 'Yaş...');
  editAge.Align = alTop;
  editAge.Height = 45;
  editAge.Margins.Bottom = 15;
  
  btnSaveJson = MyForm.AddNewProButton(MyForm, 'btnSaveJson', 'JSON Dosyası Olarak Kaydet');
  btnSaveJson.Align = alBottom;
  btnSaveJson.Height = 50;
  
  MyForm.AddNewEvent(btnSaveJson, tbeOnClick, 'btnSaveJsonClick');
  MyForm.Run;
}`,

  "pas-listview-checkbox": `// Clomosy ListView Nesnesinde CheckBox (Seçim Kutusu) Kullanımı
var
  MyForm: TclForm;
  listSelect: TclListView;
  btnGetSelected: TClProButton;
  selectedText: String;

void btnGetSelectedClick;
{
  // Seçili olan kayıtları oku
  selectedText = listSelect.GetValueCheckBoxList;
  ShowMessage('Seçili Kişiler:\\n' + selectedText);
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  listSelect = MyForm.AddNewListView(MyForm, 'listSelect');
  listSelect.Align = alClient;
  listSelect.Margins.Bottom = 15;
  
  // Çoklu seçim kutularını aktif et
  listSelect.ShowCheckBox = True;
  
  listSelect.AddItem('Kullanıcı 1 - Arda', 'Aktif');
  listSelect.AddItem('Kullanıcı 2 - Ahmet', 'Aktif');
  listSelect.AddItem('Kullanıcı 3 - Ayşe', 'Pasif');
  listSelect.AddItem('Kullanıcı 4 - Mehmet', 'Aktif');
  
  btnGetSelected = MyForm.AddNewProButton(MyForm, 'btnGetSelected', 'Seçilenleri Listele');
  btnGetSelected.Align = alBottom;
  btnGetSelected.Height = 50;
  
  MyForm.AddNewEvent(btnGetSelected, tbeOnClick, 'btnGetSelectedClick');
  MyForm.Run;
}`,

  "pas-sqlite-audio": `// Clomosy SQLite Tabanlı Ses Arşivi ve Çalma (MediaPlayer)
var
  MyForm: TclForm;
  btnPlay: TClProButton;
  mediaPlayer: TclMediaPlayer;
  
void btnPlayClick;
{
  Clomosy.DBSQLiteConnect(Clomosy.AppFilesPath + 'audio_archive.db', '');
  Clomosy.DBSQLiteQuery.Sql.Text = 'CREATE TABLE IF NOT EXISTS sesler (id INTEGER PRIMARY KEY, url TEXT);';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  
  // Örnek ses verisi ekleme
  Clomosy.DBSQLiteQuery.Sql.Text = 'INSERT OR IGNORE INTO sesler (id, url) VALUES (1, "https://www.clomosy.com/game/assets/Fire.wav");';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  
  // Veriyi sorgula ve MediaPlayer'a ata
  Clomosy.DBSQLiteQuery.Sql.Text = 'SELECT url FROM sesler WHERE id = 1;';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  
  mediaPlayer = TclMediaPlayer.Create(self);
  mediaPlayer.FileName = Clomosy.DBSQLiteQuery.FieldByName('url').AsString;
  mediaPlayer.Play;
  
  ShowMessage('Ses dosyası SQLite tablosundan okundu ve çalınıyor...');
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  btnPlay = MyForm.AddNewProButton(MyForm, 'btnPlay', 'SQLite Konumlu Sesi Oynat');
  btnPlay.Align = alCenter;
  btnPlay.Width = 220;
  btnPlay.Height = 50;
  
  MyForm.AddNewEvent(btnPlay, tbeOnClick, 'btnPlayClick');
  MyForm.Run;
}`,

  "pas-listview": `// Clomosy TclListView - Veri Listeleme & Satır Seçim Demosu
var
  MyForm: TclForm;
  dataList: TclListView;
  
void OnItemClick;
{
  ShowMessage('Seçilen Eleman: ' + dataList.SelectedText);
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  dataList = MyForm.AddNewListView(MyForm, 'dataList');
  dataList.Align = alClient;
  
  dataList.AddItem('Arda Çekiç', 'iletisim@ardcek.com');
  dataList.AddItem('Ahmet Yılmaz', 'ahmet@clomosy.com');
  dataList.AddItem('Ayşe Kaya', 'ayse@clomosy.com');
  dataList.AddItem('Mehmet Demir', 'mehmet@clomosy.com');
  
  MyForm.AddNewEvent(dataList, tbeOnItemClick, 'OnItemClick');
  MyForm.Run;
}`,

  "pas-sqlserver": `// Clomosy SQL Server - Sunucu Veritabanı Bağlantı Demosu
var
  MyForm: TclForm;
  btnSqlConnect: TClProButton;

void btnSqlConnectClick;
{
  Clomosy.DBSQLServerConnect('SQLOLEDB', '192.168.1.100', 'sa', 'Password123', 'SatisDB', 1433);
  ShowMessage('SQL Server Bağlantısı Başarıyla Taklit Edildi!');
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  btnSqlConnect = MyForm.AddNewProButton(MyForm, 'btnSqlConnect', 'Sunucu SQL Server Bağlantısı');
  btnSqlConnect.Align = alCenter;
  btnSqlConnect.Width = 240;
  btnSqlConnect.Height = 50;
  
  MyForm.AddNewEvent(btnSqlConnect, tbeOnClick, 'btnSqlConnectClick');
  MyForm.Run;
}`,

  "pas-timer": `// Clomosy TclTimer - Zamanlayıcı ve Sayaç Demosu
var
  MyForm: TclForm;
  timerCounter: TclTimer;
  lblClock: TclProLabel;
  secPassed: Integer;
  
void onTimerTick;
{
  secPassed = secPassed + 1;
  lblClock.Text = 'Sayaç: ' + IntToStr(secPassed) + ' saniye geçti';
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  secPassed = 0;
  
  lblClock = MyForm.AddNewProLabel(MyForm, 'lblClock', 'Sayaç başlatılıyor...');
  lblClock.Align = alCenter;
  lblClock.Height = 40;
  
  timerCounter = MyForm.AddNewTimer(MyForm, 'timerCounter', 1000);
  MyForm.AddNewEvent(timerCounter, tbeOnTimer, 'onTimerTick');
  
  MyForm.Run;
}`,

  "pas-sound": `// Clomosy Ses Çalma (PlaySound) ve Oyun Efekt Kaydı Demosu
var
  GameForm: TclForm;
  btnPlay: TClProButton;
  soundIndex: Integer;

void btnPlayClick;
{
  GameForm.PlayGameSound(soundIndex);
  ShowMessage('Efekt sesi başarıyla tetiklendi!');
}

{
  GameForm = TclForm.Create(self);
  GameForm.SetFormColor('#05060b', '#05060b', clGNone);
  
  soundIndex = GameForm.RegisterSound('https://www.clomosy.com/game/assets/Fire.wav');
  
  btnPlay = GameForm.AddNewProButton(GameForm, 'btnPlay', 'Efekt Sesi Çal');
  btnPlay.Align = alCenter;
  btnPlay.Width = 180;
  btnPlay.Height = 50;
  
  GameForm.AddNewEvent(btnPlay, tbeOnClick, 'btnPlayClick');
  GameForm.Run;
}`,

  "pas-gps": `// Clomosy GPS & Location - Cihaz Manager Konum Alımı Demosu
var
  MyForm: TclForm;
  btnGps: TClProButton;
  
void btnGpsClick;
var
  latitude: Double;
  longitude: Double;
{
  latitude = Clomosy.DeviceLocation.Latitude;
  longitude = Clomosy.DeviceLocation.Longitude;
  ShowMessage('Cihaz Konumu:\\nEnlem: ' + FloatToStr(latitude) + '\\nBoylam: ' + FloatToStr(longitude));
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  btnGps = MyForm.AddNewProButton(MyForm, 'btnGps', 'GPS Konumunu Oku');
  btnGps.Align = alCenter;
  btnGps.Width = 200;
  btnGps.Height = 50;
  
  MyForm.AddNewEvent(btnGps, tbeOnClick, 'btnGpsClick');
  MyForm.Run;
}`,

  "pas-sqlite": `// Clomosy SQLite Stok Panel Listeleme Otomasyonu
var
  MyForm: TclForm;
  btnLoad: TClProButton;
  mainScroll: TclVertScrollBox;
  itemPnl: TclProPanel;
  lblInfo: TclProLabel;
  
void btnLoadClick;
var
  i: Integer;
{
  Clomosy.DBSQLiteConnect(Clomosy.AppFilesPath + 'stocks.db', '');
  Clomosy.DBSQLiteQuery.Sql.Text = 'CREATE TABLE IF NOT EXISTS urunler (id INTEGER PRIMARY KEY, ad TEXT, miktar INTEGER);';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  
  Clomosy.DBSQLiteQuery.Sql.Text = 'INSERT OR IGNORE INTO urunler (id, ad, miktar) VALUES (1, "iPhone 15", 45), (2, "MacBook Pro", 20), (3, "iPad Air", 35);';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  
  Clomosy.DBSQLiteQuery.Sql.Text = 'SELECT ad, miktar FROM urunler;';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  
  i = 0;
  while not Clomosy.DBSQLiteQuery.EOF do
  begin
    i = i + 1;
    itemPnl = MyForm.AddNewProPanel(mainScroll, 'itemPnl' + IntToStr(i));
    itemPnl.Align = alTop;
    itemPnl.Height = 60;
    itemPnl.Margins.Bottom = 8;
    clComponent.SetupComponent(itemPnl, '{"BackgroundColor":"#1E293B", "RoundHeight":8, "RoundWidth":8}');
    
    lblInfo = MyForm.AddNewProLabel(itemPnl, 'lblInfo' + IntToStr(i), Clomosy.DBSQLiteQuery.FieldByName('ad').AsString + ' - Stok: ' + Clomosy.DBSQLiteQuery.FieldByName('miktar').AsString);
    lblInfo.Align = alCenter;
    lblInfo.clProSettings.FontColor = clAlphaColor.clWhite;
    lblInfo.SetclProSettings(lblInfo.clProSettings);
    
    Clomosy.DBSQLiteQuery.Next;
  end;
  
  ShowMessage('Stok verileri veritabanından dinamik panellere yüklendi!');
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  mainScroll = MyForm.AddNewVertScrollBox(MyForm, 'mainScroll');
  mainScroll.Align = alClient;
  mainScroll.Margins.Bottom = 15;
  
  btnLoad = MyForm.AddNewProButton(MyForm, 'btnLoad', 'Stok Listesini Yükle');
  btnLoad.Align = alBottom;
  btnLoad.Height = 50;
  
  MyForm.AddNewEvent(btnLoad, tbeOnClick, 'btnLoadClick');
  MyForm.Run;
}`,

  "pas-sqlite-listview": `// Clomosy SQLite'tan ListView Nesnesine Doğrudan Veri Yükleme
var
  MyForm: TclForm;
  listUsers: TclListView;
  btnLoad: TClProButton;

void btnLoadClick;
{
  Clomosy.DBSQLiteConnect(Clomosy.AppFilesPath + 'contacts.db', '');
  Clomosy.DBSQLiteQuery.Sql.Text = 'CREATE TABLE IF NOT EXISTS kisiler (id INTEGER PRIMARY KEY, ad TEXT, tel TEXT);';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  
  // Örnek veri girişi
  Clomosy.DBSQLiteQuery.Sql.Text = 'INSERT OR IGNORE INTO kisiler (ad, tel) VALUES ("Arda Çekiç", "555-1234"), ("Ahmet Kaya", "555-5678");';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  
  // ListView içine SQLite sorgusunu yükle
  listUsers.Clear;
  Clomosy.DBSQLiteQuery.Sql.Text = 'SELECT ad, tel FROM kisiler;';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  
  while not Clomosy.DBSQLiteQuery.EOF do
  begin
    listUsers.AddItem(Clomosy.DBSQLiteQuery.FieldByName('ad').AsString, Clomosy.DBSQLiteQuery.FieldByName('tel').AsString);
    Clomosy.DBSQLiteQuery.Next;
  end;
  
  ShowMessage('Kişiler SQLite veritabanından ListView listesine başarıyla aktarıldı!');
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  listUsers = MyForm.AddNewListView(MyForm, 'listUsers');
  listUsers.Align = alClient;
  listUsers.Margins.Bottom = 15;
  
  btnLoad = MyForm.AddNewProButton(MyForm, 'btnLoad', 'Veritabanından Listele');
  btnLoad.Align = alBottom;
  btnLoad.Height = 50;
  
  MyForm.AddNewEvent(btnLoad, tbeOnClick, 'btnLoadClick');
  MyForm.Run;
}`,

  "pas-sqlite-barcode": `// Clomosy Barkod Okuyucu (Barcode Scanner) ile SQLite Ürün Arama
var
  MyForm: TclForm;
  btnScan: TClProButton;
  listResults: TclListView;

void onBarcodeResult;
var
  scannedCode: String;
{
  scannedCode = Clomosy.ScannedBarcode;
  
  Clomosy.DBSQLiteConnect(Clomosy.AppFilesPath + 'products.db', '');
  Clomosy.DBSQLiteQuery.Sql.Text = 'SELECT urun_adi, fiyat FROM stok WHERE barkod = "' + scannedCode + '";';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  
  listResults.Clear;
  if not Clomosy.DBSQLiteQuery.EOF then
  begin
    listResults.AddItem(Clomosy.DBSQLiteQuery.FieldByName('urun_adi').AsString, 'Fiyat: ' + Clomosy.DBSQLiteQuery.FieldByName('fiyat').AsString + ' TL');
    ShowMessage('Ürün Bulundu: ' + Clomosy.DBSQLiteQuery.FieldByName('urun_adi').AsString);
  end
  else
  begin
    ShowMessage('Hata: Okutulan barkod (' + scannedCode + ') stokta bulunamadı!');
  end;
}

void btnScanClick;
{
  // Cihaz kamerasından barkodu tara
  Clomosy.CallBarcodeReader;
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  listResults = MyForm.AddNewListView(MyForm, 'listResults');
  listResults.Align = alClient;
  listResults.Margins.Bottom = 15;
  
  btnScan = MyForm.AddNewProButton(MyForm, 'btnScan', 'Ürün Barkodunu Tara');
  btnScan.Align = alBottom;
  btnScan.Height = 50;
  
  MyForm.AddNewEvent(btnScan, tbeOnClick, 'btnScanClick');
  MyForm.AddNewEvent(MyForm, tbeOnBarcodeResult, 'onBarcodeResult');
  MyForm.Run;
}`,

  "pas-student-db": `// Clomosy Öğrenci Sınav Bilgi CRUD (Ekle/Sil/Güncelle) Yönetimi
var
  MyForm: TclForm;
  editStudentName: TclEdit;
  editGrade: TclEdit;
  btnInsert: TClProButton;
  btnUpdate: TClProButton;
  btnDelete: TClProButton;
  listStudents: TclListView;

void dbConnect;
{
  Clomosy.DBSQLiteConnect(Clomosy.AppFilesPath + 'student_records.db', '');
  Clomosy.DBSQLiteQuery.Sql.Text = 'CREATE TABLE IF NOT EXISTS ogrenci (id INTEGER PRIMARY KEY, isim TEXT, notu INTEGER);';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
}

void refreshList;
{
  dbConnect;
  listStudents.Clear;
  Clomosy.DBSQLiteQuery.Sql.Text = 'SELECT isim, notu FROM ogrenci;';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  while not Clomosy.DBSQLiteQuery.EOF do
  begin
    listStudents.AddItem(Clomosy.DBSQLiteQuery.FieldByName('isim').AsString, 'Not: ' + Clomosy.DBSQLiteQuery.FieldByName('notu').AsString);
    Clomosy.DBSQLiteQuery.Next;
  end;
}

void btnInsertClick;
{
  dbConnect;
  Clomosy.DBSQLiteQuery.Sql.Text = 'INSERT INTO ogrenci (isim, notu) VALUES ("' + editStudentName.Text + '", ' + editGrade.Text + ');';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  ShowMessage('Öğrenci Kaydı Başarıyla Eklendi!');
  refreshList;
}

void btnUpdateClick;
{
  dbConnect;
  Clomosy.DBSQLiteQuery.Sql.Text = 'UPDATE ogrenci SET notu = ' + editGrade.Text + ' WHERE isim = "' + editStudentName.Text + '";';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  ShowMessage('Öğrenci Notu Başarıyla Güncellendi!');
  refreshList;
}

void btnDeleteClick;
{
  dbConnect;
  Clomosy.DBSQLiteQuery.Sql.Text = 'DELETE FROM ogrenci WHERE isim = "' + editStudentName.Text + '";';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  ShowMessage('Öğrenci Kaydı Başarıyla Silindi!');
  refreshList;
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  editStudentName = MyForm.AddNewEdit(MyForm, 'editStudentName', 'Öğrenci Adı Soyadı...');
  editStudentName.Align = alTop;
  editStudentName.Height = 45;
  editStudentName.Margins.Bottom = 10;
  
  editGrade = MyForm.AddNewEdit(MyForm, 'editGrade', 'Sınav Notu...');
  editGrade.Align = alTop;
  editGrade.Height = 45;
  editGrade.Margins.Bottom = 10;
  
  listStudents = MyForm.AddNewListView(MyForm, 'listStudents');
  listStudents.Align = alClient;
  listStudents.Margins.Bottom = 15;
  
  btnInsert = MyForm.AddNewProButton(MyForm, 'btnInsert', 'Öğrenci Ekle');
  btnInsert.Align = alBottom;
  btnInsert.Height = 40;
  btnInsert.Margins.Bottom = 5;
  
  btnUpdate = MyForm.AddNewProButton(MyForm, 'btnUpdate', 'Notu Güncelle');
  btnUpdate.Align = alBottom;
  btnUpdate.Height = 40;
  btnUpdate.Margins.Bottom = 5;
  
  btnDelete = MyForm.AddNewProButton(MyForm, 'btnDelete', 'Seçileni Sil');
  btnDelete.Align = alBottom;
  btnDelete.Height = 40;
  
  MyForm.AddNewEvent(btnInsert, tbeOnClick, 'btnInsertClick');
  MyForm.AddNewEvent(btnUpdate, tbeOnClick, 'btnUpdateClick');
  MyForm.AddNewEvent(btnDelete, tbeOnClick, 'btnDeleteClick');
  
  refreshList;
  MyForm.Run;
}
`,

  "pas-vehicle-tracking": `// Clomosy SQLite Araç Kayıt ve Görüntü Stream Takip Otomasyonu
var
  MyForm: TclForm;
  editPlate: TclEdit;
  editModel: TclEdit;
  btnSaveVehicle: TClProButton;
  listVehicles: TclListView;

void refreshVehicles;
{
  listVehicles.Clear;
  Clomosy.DBSQLiteConnect(Clomosy.AppFilesPath + 'fleet.db', '');
  Clomosy.DBSQLiteQuery.Sql.Text = 'CREATE TABLE IF NOT EXISTS araclar (plaka TEXT PRIMARY KEY, model TEXT);';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  
  Clomosy.DBSQLiteQuery.Sql.Text = 'SELECT plaka, model FROM araclar;';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  while not Clomosy.DBSQLiteQuery.EOF do
  begin
    listVehicles.AddItem(Clomosy.DBSQLiteQuery.FieldByName('plaka').AsString, Clomosy.DBSQLiteQuery.FieldByName('model').AsString);
    Clomosy.DBSQLiteQuery.Next;
  end;
}

void btnSaveVehicleClick;
{
  Clomosy.DBSQLiteConnect(Clomosy.AppFilesPath + 'fleet.db', '');
  Clomosy.DBSQLiteQuery.Sql.Text = 'INSERT OR REPLACE INTO araclar (plaka, model) VALUES ("' + editPlate.Text + '", "' + editModel.Text + '");';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  ShowMessage('Araç Kaydı Başarıyla Oluşturuldu!');
  refreshVehicles;
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  editPlate = MyForm.AddNewEdit(MyForm, 'editPlate', 'Araç Plakası...');
  editPlate.Align = alTop;
  editPlate.Height = 45;
  editPlate.Margins.Bottom = 10;
  
  editModel = MyForm.AddNewEdit(MyForm, 'editModel', 'Araç Modeli...');
  editModel.Align = alTop;
  editModel.Height = 45;
  editModel.Margins.Bottom = 10;
  
  listVehicles = MyForm.AddNewListView(MyForm, 'listVehicles');
  listVehicles.Align = alClient;
  listVehicles.Margins.Bottom = 15;
  
  btnSaveVehicle = MyForm.AddNewProButton(MyForm, 'btnSaveVehicle', 'Aracı Fleet Veritabanına Kaydet');
  btnSaveVehicle.Align = alBottom;
  btnSaveVehicle.Height = 50;
  
  MyForm.AddNewEvent(btnSaveVehicle, tbeOnClick, 'btnSaveVehicleClick');
  refreshVehicles;
  MyForm.Run;
}`,

  "pas-sqlite-charts": `// Clomosy SQLite Verileriyle Satış Grafik Raporlama (TClChart)
var
  MyForm: TclForm;
  chartSales: TClChart;
  btnRenderChart: TClProButton;

void btnRenderChartClick;
{
  // SQLite veritabanı satış tablosu oluştur
  Clomosy.DBSQLiteConnect(Clomosy.AppFilesPath + 'sales_report.db', '');
  Clomosy.DBSQLiteQuery.Sql.Text = 'CREATE TABLE IF NOT EXISTS satis (ay TEXT, miktar INTEGER);';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  
  // Örnek satış verilerini ekle
  Clomosy.DBSQLiteQuery.Sql.Text = 'INSERT OR IGNORE INTO satis (ay, miktar) VALUES ("Ocak", 1500), ("Subat", 2200), ("Mart", 1800), ("Nisan", 3000);';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  
  // Grafik nesnesini yapılandır
  chartSales.Clear;
  chartSales.Title = 'Aylık Satış Analizi';
  
  Clomosy.DBSQLiteQuery.Sql.Text = 'SELECT ay, miktar FROM satis;';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  
  while not Clomosy.DBSQLiteQuery.EOF do
  begin
    chartSales.AddPoint(Clomosy.DBSQLiteQuery.FieldByName('ay').AsString, Clomosy.DBSQLiteQuery.FieldByName('miktar').AsInteger);
    Clomosy.DBSQLiteQuery.Next;
  end;
  
  ShowMessage('Grafik satış verileriyle başarıyla çizildi!');
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  chartSales = MyForm.AddNewChart(MyForm, 'chartSales');
  chartSales.Align = alClient;
  chartSales.Margins.Bottom = 15;
  
  btnRenderChart = MyForm.AddNewProButton(MyForm, 'btnRenderChart', 'Grafiği Çiz');
  btnRenderChart.Align = alBottom;
  btnRenderChart.Height = 50;
  
  MyForm.AddNewEvent(btnRenderChart, tbeOnClick, 'btnRenderChartClick');
  MyForm.Run;
}`,

  "pas-sqlite-login": `// Clomosy SQLite Login & Sign Up Giriş-Kayıt Arayüz Otomasyonu
var
  MyForm: TclForm;
  editUser: TclEdit;
  editPass: TclEdit;
  btnSignIn: TClProButton;
  btnSignUp: TClProButton;

void dbInit;
{
  Clomosy.DBSQLiteConnect(Clomosy.AppFilesPath + 'auth.db', '');
  Clomosy.DBSQLiteQuery.Sql.Text = 'CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT);';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
}

void btnSignInClick;
{
  dbInit;
  Clomosy.DBSQLiteQuery.Sql.Text = 'SELECT password FROM users WHERE username = "' + editUser.Text + '";';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  
  if not Clomosy.DBSQLiteQuery.EOF then
  begin
    if Clomosy.DBSQLiteQuery.FieldByName('password').AsString == editPass.Text then
    begin
      ShowMessage('Giriş Başarılı! Hoş Geldiniz, ' + editUser.Text);
    end
    else
    begin
      ShowMessage('Hata: Şifre yanlış!');
    end;
  end
  else
  begin
    ShowMessage('Hata: Kullanıcı adı bulunamadı!');
  end;
}

void btnSignUpClick;
{
  dbInit;
  Clomosy.DBSQLiteQuery.Sql.Text = 'INSERT OR REPLACE INTO users (username, password) VALUES ("' + editUser.Text + '", "' + editPass.Text + '");';
  Clomosy.DBSQLiteQuery.OpenOrExecute;
  ShowMessage('Kayıt Başarıyla Oluşturuldu! Şimdi Giriş Yapabilirsiniz.');
}

{
  MyForm = TclForm.Create(self);
  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);
  
  editUser = MyForm.AddNewEdit(MyForm, 'editUser', 'Kullanıcı Adı...');
  editUser.Align = alTop;
  editUser.Height = 45;
  editUser.Margins.Bottom = 10;
  
  editPass = MyForm.AddNewEdit(MyForm, 'editPass', 'Şifre...');
  editPass.Align = alTop;
  editPass.Height = 45;
  editPass.Margins.Bottom = 20;
  
  btnSignIn = MyForm.AddNewProButton(MyForm, 'btnSignIn', 'Giriş Yap');
  btnSignIn.Align = alBottom;
  btnSignIn.Height = 45;
  btnSignIn.Margins.Bottom = 5;
  
  btnSignUp = MyForm.AddNewProButton(MyForm, 'btnSignUp', 'Yeni Kayıt Oluştur');
  btnSignUp.Align = alBottom;
  btnSignUp.Height = 45;
  
  MyForm.AddNewEvent(btnSignIn, tbeOnClick, 'btnSignInClick');
  MyForm.AddNewEvent(btnSignUp, tbeOnClick, 'btnSignUpClick');
  MyForm.Run;
}
`
};

// ----------------------------------------------------
// Şablon Kütüphanesi İkon/Dil Filtreleme Yönetimi
// ----------------------------------------------------
function updateTemplateLibraryFilter(fileKey) {
  const groupSql = document.getElementById("snippet-group-sql");
  const groupWeb = document.getElementById("snippet-group-web");
  const groupPy = document.getElementById("snippet-group-py");
  const groupClomosy = document.getElementById("snippet-group-clomosy");

  if (!groupSql || !groupWeb || !groupPy || !groupClomosy) return;

  // Hepsini varsayılan olarak gizleyelim
  groupSql.style.display = "none";
  groupWeb.style.display = "none";
  groupPy.style.display = "none";
  groupClomosy.style.display = "none";

  if (fileKey === 'sql') {
    groupSql.style.display = "block";
  } else if (fileKey === 'python') {
    groupPy.style.display = "block";
  } else if (fileKey === 'pascal') {
    groupClomosy.style.display = "block";
  } else if (fileKey === 'html' || fileKey === 'css' || fileKey === 'javascript') {
    groupWeb.style.display = "block";
  } else {
    // Hoşgeldiniz ekranında veya dosya açılmamışken hepsi görünsün!
    groupSql.style.display = "block";
    groupWeb.style.display = "block";
    groupPy.style.display = "block";
    groupClomosy.style.display = "block";
  }
}

document.querySelectorAll(".btn-snippet").forEach(btn => {
  btn.addEventListener("click", function () {
    const snippetKey = this.getAttribute("data-snippet");
    const code = templateSnippets[snippetKey];

    if (!code) return;

    // Uygun dili otomatik olarak açalım (kullanıcı deneyimini güçlendirmek için!)
    if (snippetKey.startsWith("sql-")) {
      switchFileTab("sql");
    } else if (snippetKey.startsWith("web-")) {
      // login ve mail HTML/JS içerir
      switchFileTab("html");
    } else if (snippetKey.startsWith("py-")) {
      switchFileTab("python");
    } else if (snippetKey.startsWith("pas-")) {
      switchFileTab("pascal");
    }

    // Şablon kütüphanesinden seçildiğinde editörü temizleyip sadece şablonu yükle
    editor.setValue(code, -1);

    editor.focus();
    logToConsole(`"${this.querySelector('span').innerText}" şablonu editöre enjekte edildi.`, "result-success");
  });
});

// ----------------------------------------------------
// Clomosy Dokümantasyon Çekmecesi & Canlı Arama Motoru
// ----------------------------------------------------
const clomosyDocData = [
  // 1. UI & Görsel Bileşenler (ui)
  {
    name: "TclForm",
    type: "UI & Form",
    cat: "ui",
    desc: "Form ekran nesnesi oluşturur. Clomosy projelerinin temel ana penceresidir.",
    code: `var\n  MyForm: TclForm;\n{\n  MyForm = TclForm.Create(self);\n  MyForm.SetFormColor('#0f111a', '#0f111a', clGNone);\n  MyForm.Run;\n}`
  },
  {
    name: "TClProButton",
    type: "UI & Form",
    cat: "ui",
    desc: "Forma tıklanabilir modern bir pro buton ekler.",
    code: `var\n  MyForm: TclForm;\n  myBtn: TClProButton;\n{\n  MyForm = TclForm.Create(self);\n  myBtn = MyForm.AddNewProButton(MyForm, 'myBtn', 'Buton Yazısı');\n  MyForm.Run;\n}`
  },
  {
    name: "TclProLabel",
    type: "UI & Form",
    cat: "ui",
    desc: "Forma metin başlığı veya açıklama etiketi (Label) yerleştirir.",
    code: `var\n  MyForm: TclForm;\n  myLbl: TclProLabel;\n{\n  MyForm = TclForm.Create(self);\n  myLbl = MyForm.AddNewProLabel(MyForm, 'myLbl', 'Açıklama Metni');\n  MyForm.Run;\n}`
  },
  {
    name: "TclEdit",
    type: "UI & Form",
    cat: "ui",
    desc: "Forma kullanıcıdan tek satırlık yazı alacak edit kutusu ekler.",
    code: `var\n  MyForm: TclForm;\n  myEdit: TclEdit;\n{\n  MyForm = TclForm.Create(self);\n  myEdit = MyForm.AddNewEdit(MyForm, 'myEdit', 'Kullanıcı girdisi...');\n  MyForm.Run;\n}`
  },
  {
    name: "TclMemo",
    type: "UI & Form",
    cat: "ui",
    desc: "Forma çok satırlı not alma veya loglama alanı (Memo) yerleştirir.",
    code: `var\n  MyForm: TclForm;\n  myMemo: TclMemo;\n{\n  MyForm = TclForm.Create(self);\n  myMemo = MyForm.AddNewMemo(MyForm, 'myMemo', 'Çok satırlı yazı...');\n  MyForm.Run;\n}`
  },
  {
    name: "TclListView",
    type: "UI & Form",
    cat: "ui",
    desc: "Forma liste kaydırma elemanı yerleştirir ve veri yüklemeyi sağlar.",
    code: `var\n  MyForm: TclForm;\n  myList: TclListView;\n{\n  MyForm = TclForm.Create(self);\n  myList = MyForm.AddNewListView(MyForm, 'myList');\n  myList.AddItem('Satır 1', 'Detay 1');\n  MyForm.Run;\n}`
  },
  {
    name: "TClHorzScrollBox",
    type: "UI & Form",
    cat: "ui",
    desc: "Yatay kaydırılabilir kart listesi oluşturmak için kullanılır.",
    code: `var\n  MyForm: TclForm;\n  scrollBox: TClHorzScrollBox;\n{\n  MyForm = TclForm.Create(self);\n  scrollBox = MyForm.AddNewHorzScrollBox(MyForm, 'scrollBox');\n  MyForm.Run;\n}`
  },
  {
    name: "TclVertScrollBox",
    type: "UI & Form",
    cat: "ui",
    desc: "Dikey kaydırılabilir dinamik arayüz kutusu oluşturur.",
    code: `var\n  MyForm: TclForm;\n  scrollBox: TclVertScrollBox;\n{\n  MyForm = TclForm.Create(self);\n  scrollBox = MyForm.AddNewVertScrollBox(MyForm, 'scrollBox');\n  MyForm.Run;\n}`
  },
  {
    name: "TclImage",
    type: "UI & Form",
    cat: "ui",
    desc: "Ekrana webden veya yerel dosyadan görsel/resim yükler.",
    code: `var\n  MyForm: TclForm;\n  myImg: TclImage;\n{\n  MyForm = TclForm.Create(self);\n  myImg = MyForm.AddNewImage(MyForm, 'myImg');\n  MyForm.setImage(myImg, 'https://clomosy.com/demos/bg.png');\n  MyForm.Run;\n}`
  },
  {
    name: "TclTimer",
    type: "UI & Form",
    cat: "ui",
    desc: "Milisaniye cinsinden döngüsel çalışan zamanlayıcı nesnesi oluşturur.",
    code: `var\n  MyForm: TclForm;\n  myTimer: TclTimer;\n{\n  MyForm = TclForm.Create(self);\n  myTimer = MyForm.AddNewTimer(MyForm, 'myTimer', 1000);\n  MyForm.Run;\n}`
  },
  {
    name: "TClChart",
    type: "UI & Form",
    cat: "ui",
    desc: "Ekrana dinamik çizgisel veya sütun bazlı grafik raporu (Chart) çizer.",
    code: `var\n  MyForm: TclForm;\n  myChart: TClChart;\n{\n  MyForm = TclForm.Create(self);\n  myChart = MyForm.AddNewChart(MyForm, 'myChart');\n  myChart.Title = 'Rapor';\n  myChart.AddPoint('Ocak', 150);\n  MyForm.Run;\n}`
  },
  {
    name: "TclMediaPlayer",
    type: "UI & Form",
    cat: "ui",
    desc: "Müzik, ses kaydı veya ses efekt dosyalarını çalmak için oynatıcı oluşturur.",
    code: `var\n  player: TclMediaPlayer;\n{\n  player = TclMediaPlayer.Create(self);\n  player.FileName = 'https://clomosy.com/assets/click.wav';\n  player.Play;\n}`
  },

  // 2. Database & Network (db)
  {
    name: "DBSQLiteConnect",
    type: "Veritabanı",
    cat: "db",
    desc: "Belirtilen yoldaki SQLite yerel veritabanına bağlanır.",
    code: `{\n  Clomosy.DBSQLiteConnect(Clomosy.AppFilesPath + 'db.db', '');\n}`
  },
  {
    name: "DBSQLiteQuery",
    type: "Veritabanı",
    cat: "db",
    desc: "Aktif SQLite bağlantısı üzerinden sorgu veya komut çalıştırır.",
    code: `{\n  Clomosy.DBSQLiteQuery.Sql.Text = 'SELECT * FROM rehber;';\n  Clomosy.DBSQLiteQuery.OpenOrExecute;\n}`
  },
  {
    name: "DBSQLServerConnect",
    type: "Veritabanı",
    cat: "db",
    desc: "Sunucudaki Microsoft SQL Server veritabanına uzak bağlantı açar.",
    code: `{\n  Clomosy.DBSQLServerConnect('SQLOLEDB', '192.168.1.1', 'sa', 'Password', 'DBName', 1433);\n}`
  },
  {
    name: "TclRest",
    type: "REST API",
    cat: "db",
    desc: "API servislerinden JSON veri alışverişi yapmak için HTTP istemcisi oluşturur.",
    code: `var\n  rest: TclRest;\n{\n  rest = TclRest.Create;\n  rest.BaseURL = 'https://api.github.com';\n  rest.Method = rmGET;\n  rest.Execute;\n  ShowMessage(rest.Response);\n  rest.Free;\n}`
  },
  {
    name: "TclJSONQuery",
    type: "Veri Çözümleme",
    cat: "db",
    desc: "JSON formatındaki metinleri nesne veya alan sorgulaması için hazırlar.",
    code: `var\n  json: TclJSONQuery;\n{\n  json = TclJSONQuery.Create(self);\n  json.Sql.Text = '{\"ad\": \"Arda\", \"yas\": 24}';\n  json.Free;\n}`
  },

  // 3. Core Pascal Syntax (syntax)
  {
    name: "var (Değişkenler)",
    type: "Sentaks",
    cat: "syntax",
    desc: "Değişken isimlerini ve tiplerini (Integer, String, Double) tanımlar.",
    code: `var\n  isim: String;\n  sayi: Integer;\n  oran: Double;\n{\n  isim = 'Arda';\n  sayi = 100;\n}`
  },
  {
    name: "if (Koşullar)",
    type: "Sentaks",
    cat: "syntax",
    desc: "Karar kontrol yapısı. Şart doğru ise ilk bloğu, yanlış ise else bloğunu çalıştırır.",
    code: `if (sayi > 50)\n{\n  ShowMessage('Büyük');\n}\nelse\n{\n  ShowMessage('Küçük');\n}`
  },
  {
    name: "for (Döngü)",
    type: "Sentaks",
    cat: "syntax",
    desc: "Belirli bir aralıkta (örneğin 1'den 10'a kadar) döngüsel işlem yürütür.",
    code: `var\n  i: Integer;\n{\n  for i = 1 to 10 do\n  begin\n    ShowMessage(IntToStr(i));\n  end;\n}`
  },
  {
    name: "while (Döngü)",
    type: "Sentaks",
    cat: "syntax",
    desc: "Şart doğru olduğu sürece döngüyü sürdürür.",
    code: `while not Clomosy.DBSQLiteQuery.EOF do\nbegin\n  ShowMessage(Clomosy.DBSQLiteQuery.FieldByName('ad').AsString);\n  Clomosy.DBSQLiteQuery.Next;\nend;`
  },
  {
    name: "procedure (Yordam)",
    type: "Sentaks",
    cat: "syntax",
    desc: "Geriye değer döndürmeyen ve kod karmaşıklığını azaltan alt program bloğu.",
    code: `void EkranaYaz;\n{\n  ShowMessage('Selam');\n}\n\n{\n  EkranaYaz;\n}`
  },
  {
    name: "function (Fonksiyon)",
    type: "Sentaks",
    cat: "syntax",
    desc: "Geriye veri/değer döndüren hesaplama fonksiyon yapısı.",
    code: `Integer Topla(sayi1, sayi2: Integer);\n{\n  Result = sayi1 + sayi2;\n}\n\n{\n  ShowMessage(IntToStr(Topla(5, 10)));\n}`
  },

  // 4. String & Math (utility)
  {
    name: "Copy (String)",
    type: "Metin",
    cat: "utility",
    desc: "Metin içerisinden belirli bir indisten başlayarak istenen karakter adedini keser.",
    code: `var\n  parca: String;\n{\n  parca = Copy('Clomosy', 1, 3); // 'Clo' değerini keser\n}`
  },
  {
    name: "Length (String)",
    type: "Metin",
    cat: "utility",
    desc: "Verilen metnin karakter sayısını (uzunluğunu) döndürür.",
    code: `var\n  uzunluk: Integer;\n{\n  uzunluk = Length('Clomosy'); // 7 döner\n}`
  },
  {
    name: "Pos (String)",
    type: "Metin",
    cat: "utility",
    desc: "Metin içerisinde aranan kelimenin başlangıç indisini verir (bulamazsa 0 döner).",
    code: `var\n  konum: Integer;\n{\n  konum = Pos('mo', 'Clomosy'); // 4 döner\n}`
  },
  {
    name: "LowerCase (String)",
    type: "Metin",
    cat: "utility",
    desc: "Metindeki tüm harfleri küçük harfe çevirir.",
    code: `ShowMessage(LowerCase('CLOMOSY')); // 'clomosy'`
  },
  {
    name: "UpperCase (String)",
    type: "Metin",
    cat: "utility",
    desc: "Metindeki tüm harfleri büyük harfe dönüştürür.",
    code: `ShowMessage(UpperCase('clomosy')); // 'CLOMOSY'`
  },
  {
    name: "Trim (String)",
    type: "Metin",
    cat: "utility",
    desc: "Metnin başındaki ve sonundaki tüm gereksiz boşlukları siler.",
    code: `ShowMessage(Trim('  veri  ')); // 'veri'`
  },
  {
    name: "StringReplace (String)",
    type: "Metin",
    cat: "utility",
    desc: "Metindeki aranan kelimeleri yeni belirlenen kelimeler ile değiştirir.",
    code: `var\n  yeniMetin: String;\n{\n  yeniMetin = StringReplace('Merhaba Ahmet', 'Ahmet', 'Arda', [rfReplaceAll]);\n}`
  },
  {
    name: "Random (Math)",
    type: "Matematik",
    cat: "utility",
    desc: "Belirlenen sayının sıfır ile kendisi arasında rastgele bir tam sayı üretir.",
    code: `var\n  sayi: Integer;\n{\n  sayi = Random(100); // 0-99 arası sayı\n}`
  },
  {
    name: "Abs (Math)",
    type: "Matematik",
    cat: "utility",
    desc: "Negatif veya pozitif sayıların mutlak değerini döndürür.",
    code: `ShowMessage(IntToStr(Abs(-15))); // 15`
  },
  {
    name: "Round (Math)",
    type: "Matematik",
    cat: "utility",
    desc: "Ondalık sayıları en yakın tam sayı değerine yuvarlar.",
    code: `ShowMessage(IntToStr(Round(4.7))); // 5`
  },

  // 5. Date, Time & Conversion (datetime)
  {
    name: "Now",
    type: "Zaman",
    cat: "datetime",
    desc: "Anlık tarih ve saat bilgisini verir.",
    code: `ShowMessage(DateTimeToStr(Now));`
  },
  {
    name: "Date",
    type: "Zaman",
    cat: "datetime",
    desc: "Anlık güncel sistem tarih bilgisini verir.",
    code: `ShowMessage(DateToStr(Date));`
  },
  {
    name: "Time",
    type: "Zaman",
    cat: "datetime",
    desc: "Anlık güncel sistem saati bilgisini verir.",
    code: `ShowMessage(TimeToStr(Time));`
  },
  {
    name: "IntToStr",
    type: "Dönüşüm",
    cat: "datetime",
    desc: "Tam sayı (Integer) tipindeki veriyi ekranda göstermek için metne (String) çevirir.",
    code: `ShowMessage(IntToStr(100));`
  },
  {
    name: "FloatToStr",
    type: "Dönüşüm",
    cat: "datetime",
    desc: "Ondalık sayı (Double) tipindeki veriyi metne (String) dönüştürür.",
    code: `ShowMessage(FloatToStr(14.53));`
  },
  {
    name: "StrToInt",
    type: "Dönüşüm",
    cat: "datetime",
    desc: "Sayı içeren metinsel ifadeleri tam sayıya (Integer) çevirir.",
    code: `var\n  sayi: Integer;\n{\n  sayi = StrToInt('150');\n}`
  },
  {
    name: "IntToHex",
    type: "Dönüşüm",
    cat: "datetime",
    desc: "Tam sayı verisini Hexadecimal (16'lık taban) metinsel koda çevirir.",
    code: `ShowMessage(IntToHex(255, 2)); // 'FF' verir`
  },

  // 6. Hardware & Sensors (sensor)
  {
    name: "DeviceLocation (GPS)",
    type: "Sensör",
    cat: "sensor",
    desc: "Mobil cihazın GPS sensöründen anlık koordinat okur.",
    code: `var\n  lat, lon: Double;\n{\n  lat = Clomosy.DeviceLocation.Latitude;\n  lon = Clomosy.DeviceLocation.Longitude;\n  ShowMessage('Enlem: ' + FloatToStr(lat));\n}`
  },
  {
    name: "CallBarcodeReader",
    type: "Donanım",
    cat: "sensor",
    desc: "Kamerayı barkod / QR okumak için açar ve tbeOnBarcodeResult olayını tetikler.",
    code: `{\n  Clomosy.CallBarcodeReader;\n}`
  },
  {
    name: "RegisterSound",
    type: "Medya",
    cat: "sensor",
    desc: "Verilen URL'deki WAV/MP3 ses dosyasını ses motoruna kaydeder.",
    code: `var\n  soundId: Integer;\n{\n  soundId = MyForm.RegisterSound('https://clomosy.com/demos/beep.wav');\n}`
  },
  {
    name: "PlayGameSound",
    type: "Medya",
    cat: "sensor",
    desc: "Kayıtlı ses efekti indisini yürüterek cihaz hoparlöründen ses çıkarır.",
    code: `{\n  MyForm.PlayGameSound(soundId);\n}`
  },
  {
    name: "TclMotionSensor",
    type: "Sensör",
    cat: "sensor",
    desc: "Cihazın hareket ve ivme ölçer (Accelerometer) sensörünü okur.",
    code: `var\n  mySensor: TclMotionSensor;\n{\n  mySensor = TclMotionSensor.Create(self);\n  mySensor.Active = True;\n}`
  },

  // 7. Security & Cryptography (security)
  {
    name: "EncryptAES",
    type: "Şifreleme",
    cat: "security",
    desc: "AES-256 simetrik algoritmasıyla metinleri güvenli bir şekilde şifreler.",
    code: `var\n  sifreliText: String;\n{\n  sifreliText = Clomosy.TCLCrypto.EncryptAES('Mesajım', 'GizliAnahtarimiz');\n}`
  },
  {
    name: "DecryptAES",
    type: "Şifreleme",
    cat: "security",
    desc: "AES-256 şifreli metin bloğunu orjinal haline geri çözer.",
    code: `var\n  orjinalText: String;\n{\n  orjinalText = Clomosy.TCLCrypto.DecryptAES('sifreliVeriBlock', 'GizliAnahtarimiz');\n}`
  },

  // 8. Sorting & Arrays (algorithms)
  {
    name: "TclArrayString",
    type: "Dizi Yapısı",
    cat: "algorithms",
    desc: "Metin dizilerini ekleme, silme ve arama fonksiyonlarıyla saklar.",
    code: `var\n  dizi: TclArrayString;\n{\n  dizi = TclArrayString.Create;\n  dizi.Add('İstanbul');\n  dizi.Add('Ankara');\n  dizi.Free;\n}`
  },
  {
    name: "Bubble Sort",
    type: "Algoritma",
    cat: "algorithms",
    desc: "Kabarcık sıralama yöntemiyle eleman dizisini sıralar.",
    code: `var\n  i, j, temp: Integer;\n  dizi: array[1..5] of Integer;\n{\n  // Kabarcık Sıralama Mantığı\n  for i = 1 to 4 do\n    for j = i + 1 to 5 do\n      if dizi[i] > dizi[j] then\n      begin\n        temp = dizi[i];\n        dizi[i] = dizi[j];\n        dizi[j] = temp;\n      end;\n}`
  },
  {
    name: "Quick Sort",
    type: "Algoritma",
    cat: "algorithms",
    desc: "Hızlı bölme ve sıralama pivot yöntemiyle dizileri yüksek hızda sıralar.",
    code: `// Clomosy QuickSort Algoritma İskeleti\n// Büyük dizileri pivot eleman seçip ikiye bölerek sıralar.`
  },

  // Web Development Reference (lang: "web")
  {
    name: "querySelector",
    type: "JS DOM Metodu",
    cat: "js",
    lang: "web",
    desc: "Belirtilen CSS seçiciyle eşleşen ilk HTML öğesini seçer.",
    code: `const element = document.querySelector('.card');\nelement.style.backgroundColor = '#1e293b';`
  },
  {
    name: "addEventListener",
    type: "JS Olay Dinleyici",
    cat: "js",
    lang: "web",
    desc: "Belirlenen HTML öğesine tıklama, hover veya klavye olayı bağlar.",
    code: `const btn = document.querySelector('#btn-run');\nbtn.addEventListener('click', (e) => {\n  console.log('Kod Çalıştırıldı!');\n});`
  },
  {
    name: "localStorage",
    type: "JS Web Storage",
    cat: "js",
    lang: "web",
    desc: "Tarayıcı hafızasında kalıcı anahtar-değer verileri saklar.",
    code: `// Veri Kaydet\nlocalStorage.setItem('theme', 'dark');\n// Veri Oku\nconst activeTheme = localStorage.getItem('theme');`
  },
  {
    name: "Flexbox Layout",
    type: "CSS Stil Kuralları",
    cat: "css",
    lang: "web",
    desc: "Esnek satır veya sütun arayüzleri oluşturmak için kullanılan hizalama modeli.",
    code: `.card-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n}`
  },
  {
    name: "CSS Grid Layout",
    type: "CSS Stil Kuralları",
    cat: "css",
    lang: "web",
    desc: "İki boyutlu ızgara yapılı karmaşık sayfa düzenleri oluşturur.",
    code: `.dashboard-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 12px;\n}`
  },
  {
    name: "HTML Div Container",
    type: "HTML Arayüz Elemanı",
    cat: "html",
    lang: "web",
    desc: "Sayfayı bölümlere veya kutulara ayırmak için kullanılan kapsayıcı etiket.",
    code: `<div class="info-card" id="status-card">\n  <h4>Sistem Durumu</h4>\n  <p>Tüm servisler aktif.</p>\n</div>`
  },

  // Python Reference (lang: "python")
  {
    name: "print()",
    type: "Python Çıktı",
    cat: "py_core",
    lang: "python",
    desc: "Konsol ekranına metin veya veri çıktısı yazdırır.",
    code: `print("Merhaba Python")\nprint(f"Toplam: {10 + 20}")`
  },
  {
    name: "List Comprehension",
    type: "Python Liste",
    cat: "py_list",
    lang: "python",
    desc: "Tek satırda döngüsel mantıkla listeler oluşturur.",
    code: `cift_sayilar = [x for x in range(10) if x % 2 == 0]\nprint(cift_sayilar) # [0, 2, 4, 6, 8]`
  },
  {
    name: "def (Fonksiyon)",
    type: "Python Sentaks",
    cat: "py_func",
    lang: "python",
    desc: "Geriye değer döndüren fonksiyon bloğu tanımlar.",
    code: `def topla(sayi1, sayi2):\n    return sayi1 + sayi2\n\nsonuc = topla(15, 30)`
  },
  {
    name: "Dictionary (Sözlük)",
    type: "Python Sözlük",
    cat: "py_list",
    lang: "python",
    desc: "Key-value (Anahtar-değer) çiftleri halinde verileri depolar.",
    code: `kullanici = {"isim": "Arda", "rol": "Gelistirici"}\nprint(kullanici["isim"])`
  },

  // SQL Reference (lang: "sql")
  {
    name: "SELECT",
    type: "SQL Sorgulama",
    cat: "sql_dql",
    lang: "sql",
    desc: "Tablodan belirli sütun veya satır verilerini seçer.",
    code: `SELECT isim, yas, sehir\nFROM kullanicilar\nWHERE yas > 25\nORDER BY yas ASC;`
  },
  {
    name: "INSERT INTO",
    type: "SQL Veri Ekleme",
    cat: "sql_dml",
    lang: "sql",
    desc: "Tabloya yeni satır verileri ekler.",
    code: `INSERT INTO kullanicilar (isim, yas, sehir)\nVALUES ('Ahmet', 30, 'Ankara');`
  },
  {
    name: "UPDATE",
    type: "SQL Güncelleme",
    cat: "sql_dml",
    lang: "sql",
    desc: "Tablodaki mevcut satır verilerini filtreyle günceller.",
    code: `UPDATE kullanicilar\nSET sehir = 'Istanbul'\nWHERE isim = 'Ahmet';`
  },
  {
    name: "CREATE TABLE",
    type: "SQL Şema Oluşturma",
    cat: "sql_ddl",
    lang: "sql",
    desc: "Yeni bir SQL tablosu oluşturur ve sütunları tanımlar.",
    code: `CREATE TABLE kullanicilar (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    isim TEXT NOT NULL,\n    yas INTEGER\n);`
  }
];

const docCategories = {
  ui: "UI & Görsel Bileşenler",
  db: "Veritabanı & Servisler",
  syntax: "Temel Pascal Sentaksı",
  utility: "String & Matematik",
  datetime: "Zaman & Dönüşümler",
  sensor: "Donanım & Sensörler",
  security: "Şifreleme & Güvenlik",
  algorithms: "Diziler & Sıralama"
};

const webDocCategories = {
  html: "HTML Arayüz Elemanları",
  css: "CSS Stil Kuralları",
  js: "JavaScript Dom & API"
};

const pythonDocCategories = {
  py_core: "Temel Sentaks",
  py_list: "Diziler & Koleksiyonlar",
  py_func: "Modüller & Fonksiyonlar"
};

const sqlDocCategories = {
  sql_dql: "Veri Sorgulama (DQL)",
  sql_dml: "Veri Manipülasyonu (DML)",
  sql_ddl: "Veri Tanımlama (DDL)"
};

function renderDocs(query = "") {
  const container = document.getElementById("docs-results-container");
  if (!container) return;

  container.innerHTML = "";

  // Aktif dile karar verelim
  let activeLang = "pascal"; // Varsayılan
  if (currentActiveFile === "python") {
    activeLang = "python";
  } else if (currentActiveFile === "sql") {
    activeLang = "sql";
  } else if (currentActiveFile === "html" || currentActiveFile === "css" || currentActiveFile === "javascript") {
    activeLang = "web";
  } else if (!currentActiveFile) {
    activeLang = "pascal";
  }

  // Kategorilere karar verelim
  let categories = docCategories;
  if (activeLang === "python") {
    categories = pythonDocCategories;
  } else if (activeLang === "sql") {
    categories = sqlDocCategories;
  } else if (activeLang === "web") {
    categories = webDocCategories;
  }

  // İlgili dildeki verileri filtrele
  const langFiltered = clomosyDocData.filter(item => {
    const itemLang = item.lang || "pascal";
    return itemLang === activeLang;
  });

  // Arama filtresi var mı?
  if (query.trim() !== "") {
    const filtered = langFiltered.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      container.innerHTML = `<div style="color: #8b949e; text-align: center; padding: 20px; font-size: 13px;">Sonuç bulunamadı.</div>`;
      return;
    }

    filtered.forEach(item => {
      container.appendChild(createDocCard(item));
    });
  }
  else {
    // Arama yoksa kategorilere ayrılmış akordeonlar gösterelim!
    for (let catId in categories) {
      const catName = categories[catId];
      const catItems = langFiltered.filter(item => item.cat === catId);

      if (catItems.length === 0) continue;

      const accordion = document.createElement("div");
      accordion.className = "doc-category-accordion";

      const header = document.createElement("div");
      header.className = "doc-category-header";
      header.setAttribute("onclick", `toggleDocCategory('${catId}')`);
      header.innerHTML = `
        <span>${catName} (${catItems.length})</span>
        <span class="chevron" id="chevron-${catId}">▼</span>
      `;

      const content = document.createElement("div");
      content.className = "doc-category-content";
      content.id = `doc-cat-${catId}`;
      content.style.display = "none";

      catItems.forEach(item => {
        content.appendChild(createDocCard(item));
      });

      accordion.appendChild(header);
      accordion.appendChild(content);
      container.appendChild(accordion);
    }
  }
}

function createDocCard(item) {
  const card = document.createElement("div");
  card.className = "doc-card";

  const escapedCode = item.code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeInjectCode = item.code.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
  const itemLang = item.lang || "pascal";

  card.innerHTML = `
    <div class="doc-card-header">
      <span class="doc-card-name">${item.name}</span>
      <span class="doc-card-type">${item.type}</span>
    </div>
    <div class="doc-card-desc">${item.desc}</div>
    <pre class="doc-card-code"><code>${escapedCode}</code></pre>
    <button class="btn-doc-inject" onclick="injectDocCode(\`${safeInjectCode}\`, '${item.name}', '${itemLang}')">Koda Ekle</button>
  `;
  return card;
}

window.toggleDocCategory = function (catId) {
  const content = document.getElementById(`doc-cat-${catId}`);
  const chevron = document.getElementById(`chevron-${catId}`);
  if (!content || !chevron) return;

  if (content.style.display === "none") {
    content.style.display = "block";
    chevron.innerText = "▲";
    chevron.style.color = "var(--primary)";
  } else {
    content.style.display = "none";
    chevron.innerText = "▼";
    chevron.style.color = "";
  }
};

window.injectDocCode = function (code, name, itemLang) {
  // Eğer enjekte edilecek kod aktif dosyayla uyumlu değilse ve hedef dile geçmek gerekiyorsa
  if (itemLang === 'pascal' && currentActiveFile !== 'pascal') {
    switchFileTab('pascal');
  } else if (itemLang === 'python' && currentActiveFile !== 'python') {
    switchFileTab('python');
  } else if (itemLang === 'sql' && currentActiveFile !== 'sql') {
    switchFileTab('sql');
  } else if (itemLang === 'web' && currentActiveFile !== 'html' && currentActiveFile !== 'css' && currentActiveFile !== 'javascript') {
    switchFileTab('html');
  }

  editor.insert(code);
  editor.focus();
  logToConsole(`"${name}" kısayolu imleç konumuna enjekte edildi.`, "result-success");
};

// Arama kutusu olayını bağla
const docsSearchInput = document.getElementById("docs-search-input");
if (docsSearchInput) {
  docsSearchInput.addEventListener("input", function (e) {
    renderDocs(e.target.value);
  });
}

// İlk açılışta dokümanları render et
renderDocs();

// ----------------------------------------------------
// Clomosy Linter & Auto-Fix Motoru
// ----------------------------------------------------
(function() {
  const btnAutoFix = document.getElementById('btn-autofix');
  if (!btnAutoFix) return;
  
  // 1. Clomosy-Özel Oto-Düzeltme Fonksiyonu
  window.autoCorrectClomosyCode = function() {
    if (editor.session.$modeId !== "ace/mode/trobject" && editor.session.$modeId !== "ace/mode/pascal") return;
    
    // Tüm koddan dinamik olarak kullanıcı değişkenlerini ve fonksiyonlarını yakala
    const wholeCode = editor.getValue();
    const userKeywords = [];
    
    // A. var bloğundaki değişkenleri yakala (örn: MyForm: TclForm;)
    const varBlockRegex = /\bvar\b([\s\S]*?)(?=\b(?:void|procedure|function|begin|class|type|\{)\b)/gi;
    let varMatch;
    while ((varMatch = varBlockRegex.exec(wholeCode)) !== null) {
      const declarations = varMatch[1];
      const lines = declarations.split('\n');
      lines.forEach(line => {
        const parts = line.split(':');
        if (parts.length > 1) {
          // Sol taraf değişken adlarıdır (virgülle ayrılmış olabilir)
          const varNames = parts[0].split(',');
          varNames.forEach(v => {
            const trimmed = v.trim();
            if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
              userKeywords.push(trimmed);
            }
          });
        }
      });
    }
    
    // B. void / procedure / function isimlerini yakala (örn: void testBtnClick;)
    const procRegex = /\b(?:void|procedure|function)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi;
    let procMatch;
    while ((procMatch = procRegex.exec(wholeCode)) !== null) {
      if (procMatch[1]) {
        userKeywords.push(procMatch[1].trim());
      }
    }
    
    // Seçili alan var mı kontrol et
    const selectedText = editor.getSelectedText();
    let content = selectedText ? selectedText : editor.getValue();
    
    // Büyük/küçük harf standardizasyonu (Clomosy kelimeleri + Kullanıcının kendi değişkenleri)
    const baseKeywords = [
      "AdSoyad", "Add", "AddAssetFromURL", "AddItem", "AddNewButton", "AddNewComboBox", "AddNewEdit", "AddNewEvent", "AddNewHorzScrollBox", "AddNewImage", "AddNewLabel", "AddNewLayout", "AddNewPanel", "AddNewVertScrollBox", "AgxNj6PaJMk", "AlBottom", "AlCenter", "AlClient", "AlLeft", "AlMostBottom", "AlNone", "AlRight", "AlTop", "AlanHesapla", "Align", "AnaForm", "AnaKodaGit", "AnsiCompareStr", "AnsiCompareText", "AnsiLowerCase", "AnsiUpperCase", "AppBasePath", "AppFilesPath", "Bile", "BirimeGit", "Bottom", "BoyutlarEsit", "BtnAnaKod", "BtnFormMenu", "BtnGoBack", "ButonKapat", "ButtonFB", "ButtonGS", "CallProc", "CallerForm", "Caption", "ClHide", "ClSetCaption", "ClShow", "ClomosyLearn", "CokBoyutluDizi", "CokBoyutuDizi", "ComboBox1", "ComboSecilenDeger", "Count", "Create", "DateTime", "DateTimeToStr", "DayOfWeek", "Destroy", "DiziAdi", "DiziOrnek", "EditYaz", "EgitimKitabi", "Enabled", "EncodeDate", "FaktoriyelHesapla", "Fare", "FinalNotu", "FloatToStr", "Font", "FontColor", "Form", "GecerliSaat", "GecerliTarih", "GecerliTarihSaat", "GelenDeger", "GelenMetin", "GenerateRandom", "GetItem", "Getltem", "GunSayisi", "HareketEttir", "HareketImg", "HavaGuzel", "HedefMetin", "Height", "Hint", "HitTest", "HorzScrollBox", "IncMonth", "Index", "IntToHex", "IntToStr", "IntToStrInteger", "ItemIndex", "Items", "KalanPara", "KeyDown", "KeyUp", "KeyboardType", "KisaKenar", "KitapKalem", "KlavyeGizle", "KlavyeGoster", "KonumLbl", "Kutu1Boyut", "Kutu2Boyut", "LblAnaKod", "LblMutfak", "LblSalon", "Left", "ListeyeMalzemeEkle", "ListeyiGoruntule", "Locked", "MainCode", "Margins", "MaxLength", "MesajBtn", "MesajYaz", "MesajYazdir", "MilliTakim", "MouseBas", "MouseBirak", "MouseHareket", "Ndu2JuK8l3w", "O1Ygc", "OdevBitmis", "OgrenciAdi", "Opacity", "OperDiv", "Padding", "Position", "PuanOrtalamasi", "ReadOnly", "RemoveAll", "RemoveAt", "RenkBtn", "RenkSecici", "RenkVerFB", "RenkVerGS", "RenklenBtn", "Right", "RotationAngle", "Run", "RunUnit", "Scale", "SetFocus", "SetFormBGImage", "SetFormColor", "SetImage", "SetItem", "Show", "ShowMessage", "Size", "SonDurum", "Soru", "StrToInt", "StrTolntString", "Style", "StyledSettings", "TClArrayInteger", "TClComboBox", "TClForm", "TClHorzScrollBox", "TClImage", "TClVertScrollBox", "TarifEkle", "TarifSil", "TarihDegeri", "TcEdit", "TcLPanel", "TclArray", "TclArrayDouble", "TclArrayString", "TclButon", "TclButton", "TclDateTime", "TclDrawForm", "TclEdit", "TclGameForm", "TclGuideForm", "TclLabel", "TclLayout", "TclMemo", "TclStyleForm", "TclSyntaxForm", "TclTimer", "TclUnit", "TekmiCiftmi", "TersCevir", "Text", "TextSettings", "Top", "TrimLeft", "TrimRight", "TzcAwn6A3CA", "UnicodeString", "UnitName", "UsALma", "UygulamaDosyaYolu", "UygulamaYolu", "UzunKenar", "UzunlukKarsilastir", "VarArrayCreate", "VarType", "VertScrollBox", "VirtualKeyboard", "Visible", "VizeNotu", "W6ZfDO3AJFg", "Width", "WildRun", "YeniBoy", "YeniMetin", "alCleint", "alContents", "alMostTop", "alabilmek", "alaca", "alacak", "alacakt", "alal", "alan", "alana", "aland", "alani", "alanlar", "alar", "alara", "alarak", "ald", "alg", "algoritma", "algoritmada", "algoritmalar", "algoritmas", "algoritmay", "algoritmaya", "alma", "almak", "almaktad", "almal", "almas", "almay", "almaya", "almaz", "alt", "alta", "alternatif", "altyap", "biti", "clAlphaColor", "clGCross", "clGNone", "clGVertical", "clHeight", "clHexToColor", "clMath", "clSenderChar", "clSenderKeyChar", "clSenderMousePosX", "clSenderMousePosY", "clSetWindowState", "clTypeOfField", "clVKBoundsHeight", "clVKBoundsLeft", "clWidth", "clomosy", "clomosy_exe", "clomosyinfo", "com", "docs", "except_Blocks", "exe", "finally_Blocks", "indis", "indise", "indisi", "indisindeki", "indisinden", "indisine", "indisteki", "kutu", "oldu", "parametre", "png", "sat", "tbeOnChange", "tbeOnClick", "tbeOnEnter", "tbeOnFormKeyDown", "tbeOnFormKeyUp", "tbeOnMouseDown", "tbeOnMouseMove", "tbeOnMouseUp", "tbeOnVirtualKeyboardHidden", "tbeOnVirtualKeyboardShown", "tro", "until", "youtube", "zip"
    ]
    
    // İki listeyi birleştir ve benzersiz yap
    const allKeywords = [...new Set([...baseKeywords, ...userKeywords])];
    
    allKeywords.forEach(kw => {
      // Sadece tam kelime ise düzelt
      const regex = new RegExp("\\b" + kw + "\\b", "gi");
      content = content.replace(regex, kw);
    });
    
    // Pascal tipi ':=' atamasını Clomosy '=' atamasına çevir
    content = content.replace(/:\=/g, "=");
    
    // Satır sonlarına eksik noktalı virgülleri (;) ekle
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trimEnd();
      let trimmed = line.trim();
      
      // Boş satırları ve yorumları atla
      if (trimmed === '' || trimmed.startsWith('//') || trimmed.startsWith('/*')) continue;
      // Zaten ;, {, }, , veya begin/end ile bitiyorsa atla
      if (trimmed.endsWith(';') || trimmed.endsWith('{') || trimmed.endsWith('}') || trimmed.endsWith(',') || trimmed.endsWith('begin') || trimmed.endsWith('end')) continue;
      
      // var, type, void vb. ile başlıyorsa atla
      if (/^(var|type|const|void|class)\b/i.test(trimmed)) continue;
      // prosedür/fonksiyon tanımı ise atla
      if (/^(procedure|function)\b/i.test(trimmed)) continue;
      
      // Eğer atama veya metot çağrısı ( =, ( ) içeriyorsa noktalı virgül ekle
      if (trimmed.includes('=') || trimmed.includes('(')) {
        lines[i] = line + ';';
      }
    }
    
    const newContent = lines.join('\n');
    
    if (selectedText) {
      // Sadece seçili alanı değiştir
      editor.session.replace(editor.getSelectionRange(), newContent);
    } else {
      // Tüm dökümanı değiştir
      if (newContent !== editor.getValue()) {
        const cursor = editor.getCursorPosition();
        editor.setValue(newContent, -1);
        editor.moveCursorToPosition(cursor);
      }
    }
  };
  
  // 2. Butona Tıklama Olayını Bağla
  btnAutoFix.addEventListener('click', () => {
    window.autoCorrectClomosyCode();
    
    // Animasyon / Görsel Geribildirim
    const originalContent = btnAutoFix.innerHTML;
    btnAutoFix.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Düzenlendi!`;
    btnAutoFix.style.color = "#50fa7b";
    
    setTimeout(() => {
      btnAutoFix.innerHTML = originalContent;
      btnAutoFix.style.color = "#ff79c6";
    }, 1500);
  });
  
  // 3. Klavye Kısayolu Ekle (Ctrl+Shift+E)
  editor.commands.addCommand({
    name: 'autoFixClomosy',
    bindKey: { win: 'Ctrl-Shift-E', mac: 'Command-Shift-E' },
    exec: function (editor) {
      if (btnAutoFix) btnAutoFix.click();
    },
    readOnly: false
  });
  
  // 4. Gerçek Zamanlı Hata Ayıklayıcı (Linter)
  let lintTimer = null;
  editor.session.on('change', function() {
    if (editor.session.$modeId !== "ace/mode/trobject" && editor.session.$modeId !== "ace/mode/pascal") return;
    
    clearTimeout(lintTimer);
    lintTimer = setTimeout(() => {
      const annotations = [];
      const doc = editor.session.getDocument();
      const lines = doc.getAllLines();
      const wholeCode = editor.getValue();
      
      // A. Parantez ve Süslü Parantez Dengesi Kontrolü (Lexical Parser)
      let state = "normal"; // normal, string_single, string_double, line_comment, block_comment
      const braceStack = [];   // { } ve try
      const parenStack = [];   // ( )
      const bracketStack = []; // [ ]
      
      for (let r = 0; r < lines.length; r++) {
        let line = lines[r];
        for (let c = 0; c < line.length; c++) {
          let char = line[c];
          let nextChar = line[c+1] || "";
          
          if (state === "normal") {
            // 'try' kelimesini bir blok açıcı olarak yakala
            const isWordStart = (c === 0 || !/[a-zA-Z0-9_]/.test(line[c-1]));
            const isTry = isWordStart && line.substring(c, c + 3).toLowerCase() === "try" && (c + 3 === line.length || !/[a-zA-Z0-9_]/.test(line[c+3]));
            
            if (char === '/' && nextChar === '/') {
              state = "line_comment";
              c++;
            } else if (char === '/' && nextChar === '*') {
              state = "block_comment";
              c++;
            } else if (char === "'") {
              state = "string_single";
            } else if (char === '"') {
              state = "string_double";
            } else if (isTry) {
              braceStack.push({ row: r, column: c, type: 'try' });
              c += 2; // 'ry' kısmını atla
            } else if (char === '{') {
              braceStack.push({ row: r, column: c, type: '{' });
            } else if (char === '}') {
              if (braceStack.length === 0) {
                annotations.push({
                  row: r,
                  column: c,
                  text: "Fazladan kapatma parantezi '}' bulundu.",
                  type: "error"
                });
              } else {
                braceStack.pop();
              }
            } else if (char === '(') {
              parenStack.push({ row: r, column: c });
            } else if (char === ')') {
              if (parenStack.length === 0) {
                annotations.push({
                  row: r,
                  column: c,
                  text: "Fazladan kapatma parantezi ')' bulundu.",
                  type: "error"
                });
              } else {
                parenStack.pop();
              }
            } else if (char === '[') {
              bracketStack.push({ row: r, column: c });
            } else if (char === ']') {
              if (bracketStack.length === 0) {
                annotations.push({
                  row: r,
                  column: c,
                  text: "Fazladan kapatma köşeli parantezi ']' bulundu.",
                  type: "error"
                });
              } else {
                bracketStack.pop();
              }
            }
          } else if (state === "line_comment") {
            // Satır sonuna kadar devam eder
          } else if (state === "block_comment") {
            if (char === '*' && nextChar === '/') {
              state = "normal";
              c++;
            }
          } else if (state === "string_single") {
            if (char === "'") {
              state = "normal";
            }
          } else if (state === "string_double") {
            if (char === '"') {
              state = "normal";
            }
          }
        }
        if (state === "line_comment") {
          state = "normal"; // Satır bittiğinde yorumdan çık
        }
      }
      
      // Kapatılmamış parantezleri raporla
      braceStack.forEach(b => {
        const errorText = b.type === 'try' 
          ? "Kapatılmamış 'try' bloğu bulundu. Blok '}' ile kapatılmalı." 
          : "Kapatılmamış süslü parantez '{' bulundu. Kod bloğu kapatılmalı.";
        annotations.push({
          row: b.row,
          column: b.column,
          text: errorText,
          type: "error"
        });
      });
      parenStack.forEach(p => {
        annotations.push({
          row: p.row,
          column: p.column,
          text: "Kapatılmamış parantez '(' bulundu.",
          type: "error"
        });
      });
      bracketStack.forEach(b => {
        annotations.push({
          row: b.row,
          column: b.column,
          text: "Kapatılmamış köşeli parantez '[' bulundu.",
          type: "error"
        });
      });
      
      // B. Klasik Satır Satır Hata Kontrolleri
      lines.forEach((line, i) => {
        let trimmed = line.trim();
        if (trimmed === '' || trimmed.startsWith('//') || trimmed.startsWith('/*')) return;
        
        // Kural 1: ':=' Uyarısı
        if (line.includes(':=')) {
          annotations.push({
            row: i,
            column: line.indexOf(':='),
            text: "Clomosy atamaları için ':=' yerine '=' kullanın. (Düzeltmek için Sihirli Düzeltme'ye tıklayın)",
            type: "warning"
          });
        }
        
        // Kural 2: Noktalı Virgül (;) Eksikliği
        if (!trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}') && !trimmed.endsWith(',') && !trimmed.endsWith('begin') && !trimmed.endsWith('end')) {
           if (!/^(var|type|const|void|class|procedure|function|if|while|for|else)\b/i.test(trimmed)) {
             if (trimmed.includes('=') || trimmed.includes('(')) {
               annotations.push({
                 row: i,
                 column: line.length,
                 text: "Satır sonunda noktalı virgül (;) eksik.",
                 type: "error"
               });
             }
           }
        }
        
        // Kural 3: begin / end Uyarısı
        if (/^(begin)\b/i.test(trimmed)) {
          annotations.push({
            row: i,
            column: line.indexOf('begin'),
            text: "Clomosy bloklarında 'begin' yerine '{' kullanılması önerilir.",
            type: "info"
          });
        }
        if (/^(end)\b/i.test(trimmed)) {
          annotations.push({
            row: i,
            column: line.indexOf('end'),
            text: "Clomosy bloklarında 'end' yerine '}' kullanılması önerilir.",
            type: "info"
          });
        }
      });
      
      editor.session.setAnnotations(annotations);
    }, 500); // Kullanıcı yazmayı bıraktıktan 500ms sonra çalıştır (debounce)
  });
})();
  