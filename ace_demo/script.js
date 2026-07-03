// Initialize Ace Editor
const editor = ace.edit("editor-container");

// Configure Ace to load themes, modes, and workers from official CDN dynamically
ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.7/');

// Enable language tools (autocomplete, snippets)
editor.setOptions({
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  enableSnippets: true,
  fontSize: "14px",
  theme: "ace/theme/dracula",
  mode: "ace/mode/javascript"
});

// Code Templates for different languages
const codeTemplates = {
  javascript: `// Ace Editor - JavaScript API Demo
class AceShowcase {
  constructor(editorInstance) {
    this.editor = editorInstance;
    this.features = ['Syntax Highlighting', 'Autocomplete', 'Themes'];
  }

  logFeatures() {
    console.log("Ace Editor supports: " + this.features.join(", "));
  }
}

// Instantiate and log
const playground = new AceShowcase(editor);
playground.logFeatures();`,

  html: `<!-- Ace Editor - HTML Structure Demo -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Premium Ace Demo</title>
  <style>
    body {
      background: #0f111a;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
  </style>
</head>
<body>
  <h1>Ace JS ile Canlı Editör Deneyimi</h1>
  <button onclick="alert('Ace Editor Harika!')">Tıkla</button>
</body>
</html>`,

  css: `/* Ace Editor - CSS Styling Demo */
.editor-playground {
  background: rgba(30, 41, 59, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(12px);
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.editor-playground:hover {
  transform: translateY(-4px);
  border-color: rgba(99, 102, 241, 0.4);
}`,

  python: `# Ace Editor - Python Script Demo
import json

class AceAnalyzer:
    def __init__(self, data):
        self.data = json.loads(data)
        
    def analyze_metadata(self):
        print(f"Project Name: {self.data.get('name', 'Unknown')}")
        print(f"Features count: {len(self.data.get('features', []))}")

json_data = '{"name": "Ace JS", "features": ["Autocompletion", "Multiple Cursors"]}'
analyzer = AceAnalyzer(json_data)
analyzer.analyze_metadata()`,

  json: `{
  "name": "Ace Editor Showcase",
  "version": "1.0.0",
  "description": "Interactive playground for Ace JS API",
  "private": true,
  "dependencies": {
    "ace-builds": "^1.32.7",
    "js-beautify": "^1.14.9"
  },
  "config": {
    "theme": "dracula",
    "mode": "javascript",
    "autocompletion": true
  }
}`,

  sql: `-- Ace Editor - SQL Query Demo
SELECT 
    p.project_name,
    COUNT(f.file_id) as total_tro_files,
    SUM(f.lines_count) as total_code_lines
FROM 
    clomosy_projects p
LEFT JOIN 
    project_files f ON p.project_id = f.project_id
WHERE 
    f.file_extension = '.tro'
GROUP BY 
    p.project_name
HAVING 
    total_code_lines > 500
ORDER BY 
    total_code_lines DESC;`,

  pascal: `// Ace Editor - Clomosy TRObject (Delphi/Pascal) Script Demo
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

// Set initial value for editor
editor.setValue(codeTemplates.javascript, -1);

// Console output simulation helper
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
// UI Control Event Listeners
// ----------------------------------------------------

// Theme Selector
document.getElementById("theme-select").addEventListener("change", function(e) {
  const theme = e.target.value;
  editor.setTheme("ace/theme/" + theme);
  logToConsole(`Tema güncellendi: ace/theme/${theme}`, "api-call");
});

// Mode (Language) Selector
document.getElementById("mode-select").addEventListener("change", function(e) {
  const val = e.target.value;
  let mode = val;
  let filename = "script.js";

  // Map selector values to Ace modes and tab names
  switch(val) {
    case 'javascript': mode = 'javascript'; filename = 'script.js'; break;
    case 'html': mode = 'html'; filename = 'index.html'; break;
    case 'css': mode = 'css'; filename = 'style.css'; break;
    case 'python': mode = 'python'; filename = 'main.py'; break;
    case 'json': mode = 'json'; filename = 'package.json'; break;
    case 'sql': mode = 'sql'; filename = 'queries.sql'; break;
    case 'pascal': mode = 'pascal'; filename = 'mainCode.tro'; break;
  }

  editor.session.setMode("ace/mode/" + mode);
  document.getElementById("tab-filename").innerText = filename;
  document.getElementById("status-lang").innerText = `Dil: ${e.target.options[e.target.selectedIndex].text}`;

  // Load language template
  if (codeTemplates[val]) {
    editor.setValue(codeTemplates[val], -1);
  }
  
  logToConsole(`Dil ve Editör Modu güncellendi: ace/mode/${mode}`, "api-call");
});

// Font Size Slider
const fontSizeSlider = document.getElementById("font-size-slider");
fontSizeSlider.addEventListener("input", function(e) {
  const size = e.target.value + "px";
  editor.setFontSize(size);
  document.getElementById("font-size-val").innerText = size;
});

// Line Height Slider
const lineHeightSlider = document.getElementById("line-height-slider");
lineHeightSlider.addEventListener("input", function(e) {
  const height = e.target.value;
  document.getElementById("editor-container").style.lineHeight = height;
  document.getElementById("line-height-val").innerText = height;
  editor.renderer.updateFull(); // Force refresh Ace renderer
});

// Toggle Gutter (Line Numbers)
document.getElementById("toggle-gutter").addEventListener("change", function(e) {
  editor.renderer.setShowGutter(e.target.checked);
  logToConsole(`Satır numaraları görünürlüğü: ${e.target.checked}`, "api-call");
});

// Toggle Soft Wrap
document.getElementById("toggle-wrap").addEventListener("change", function(e) {
  editor.session.setUseWrapMode(e.target.checked);
  logToConsole(`Metin aşağı kaydırma (Wrap): ${e.target.checked}`, "api-call");
});

// Toggle Print Margin guide
document.getElementById("toggle-margin").addEventListener("change", function(e) {
  editor.setShowPrintMargin(e.target.checked);
  logToConsole(`Baskı kılavuzu görünürlüğü: ${e.target.checked}`, "api-call");
});

// Toggle Read-Only
document.getElementById("toggle-readonly").addEventListener("change", function(e) {
  editor.setReadOnly(e.target.checked);
  logToConsole(`Salt Okunur (Read Only) modu: ${e.target.checked}`, "api-call");
});

// Toggle Highlight Active Line
document.getElementById("toggle-active-line").addEventListener("change", function(e) {
  editor.setHighlightActiveLine(e.target.checked);
  logToConsole(`Aktif satır vurgusu: ${e.target.checked}`, "api-call");
});

// Toggle Autocomplete / Language Tools
document.getElementById("toggle-autocomplete").addEventListener("change", function(e) {
  editor.setOptions({
    enableBasicAutocompletion: e.target.checked,
    enableLiveAutocompletion: e.target.checked
  });
  logToConsole(`Akıllı otomatik tamamlama: ${e.target.checked}`, "api-call");
});

// ----------------------------------------------------
// Statusbar Sync Listeners
// ----------------------------------------------------
function updateStatusBar() {
  const cursor = editor.getCursorPosition();
  document.getElementById("status-position").innerText = `Satır ${cursor.row + 1}, Sütun ${cursor.column + 1}`;
  
  const totalLines = editor.session.getLength();
  document.getElementById("status-lines").innerText = `Toplam: ${totalLines} Satır`;

  const selectedText = editor.getSelectedText();
  const selectedChars = selectedText ? selectedText.length : 0;
  document.getElementById("status-selection").innerText = `Seçim: ${selectedChars} karakter`;
}

// Wire up selection and cursor changes to status bar
editor.session.selection.on("changeCursor", updateStatusBar);
editor.session.selection.on("changeSelection", updateStatusBar);
editor.session.on("change", updateStatusBar);

// ----------------------------------------------------
// Editor Toolbar Buttons
// ----------------------------------------------------

// Clear Editor
document.getElementById("btn-clear").addEventListener("click", function() {
  editor.setValue("", -1);
  logToConsole("Editör temizlendi.", "system-msg");
});

// Reset Code
document.getElementById("btn-reset").addEventListener("click", function() {
  const currentLang = document.getElementById("mode-select").value;
  if (codeTemplates[currentLang]) {
    editor.setValue(codeTemplates[currentLang], -1);
    logToConsole("Kod varsayılan şablona sıfırlandı.", "system-msg");
  }
});

// Format Code (JS-Beautify)
document.getElementById("btn-format").addEventListener("click", function() {
  const mode = document.getElementById("mode-select").value;
  const code = editor.getValue();
  
  if (!code.trim()) {
    logToConsole("Biçimlendirilecek kod bulunamadı.", "system-msg");
    return;
  }

  let formatted = code;
  try {
    if (mode === "javascript" || mode === "json") {
      formatted = js_beautify(code, { indent_size: 2, space_in_empty_paren: true });
    } else if (mode === "html") {
      formatted = html_beautify(code, { indent_size: 2 });
    } else if (mode === "css") {
      formatted = css_beautify(code, { indent_size: 2 });
    } else {
      logToConsole(`"${mode}" dili için otomatik biçimlendirme desteklenmiyor.`, "system-msg");
      return;
    }
    editor.setValue(formatted, -1);
    logToConsole("Kod başarıyla biçimlendirildi.", "result-success");
  } catch(e) {
    logToConsole("Biçimlendirme hatası: " + e.message, "system-msg");
  }
});

// Clear Console Log button
document.getElementById("clear-console-btn").addEventListener("click", function() {
  const consoleLog = document.getElementById("console-log");
  consoleLog.innerHTML = `<div class="log-line system-msg">Konsol temizlendi.</div>`;
});

// ----------------------------------------------------
// Live JS API Sandbox execution
// ----------------------------------------------------
document.querySelectorAll(".btn-api").forEach(button => {
  button.addEventListener("click", function() {
    const apiAction = this.getAttribute("data-api");
    const codeViewer = document.getElementById("executed-code");
    
    let jsString = "";
    let logMsg = "";
    let resMsg = "";

    switch(apiAction) {
      case 'get-value':
        jsString = `// Editördeki tüm içeriği bir değişkene alır\nconst currentCode = editor.getValue();\nconsole.log("Kod Boyutu: " + currentCode.length + " karakter");`;
        codeViewer.innerText = jsString;
        
        const codeVal = editor.getValue();
        logToConsole(`editor.getValue() tetiklendi`, "api-call");
        logToConsole(`İçerik Alındı. Boyut: ${codeVal.length} karakter. Satır: ${editor.session.getLength()}`, "result-success");
        break;

      case 'select-all':
        jsString = `// Editördeki tüm kodu seçili hale getirir\neditor.selectAll();\neditor.focus();`;
        codeViewer.innerText = jsString;
        
        editor.selectAll();
        editor.focus();
        logToConsole("editor.selectAll() tetiklendi", "api-call");
        logToConsole("Tüm kod seçildi.", "result-success");
        break;

      case 'insert-text':
        const textToInsert = `\n// İmlecin olduğu yere eklenen yeni satır\nvoid YeniFonksiyon;\n{\n  ShowMessage("API Sandbox!");\n}\n`;
        jsString = `// İmlecin olduğu yere (Cursor position) yeni metin ekler\neditor.insert(\`\${textToInsert}\`);\neditor.focus();`;
        codeViewer.innerText = jsString;
        
        editor.insert(textToInsert);
        editor.focus();
        logToConsole("editor.insert(...) tetiklendi", "api-call");
        logToConsole("İmlecin bulunduğu satıra yeni fonksiyon eklendi.", "result-success");
        break;

      case 'find-text':
        jsString = `// Editör içinde "ShowMessage" kelimesini aratıp vurgular\neditor.find("ShowMessage", {\n  backwards: false,\n  wrap: true,\n  caseSensitive: false,\n  wholeWord: false,\n  regExp: false\n});\neditor.focus();`;
        codeViewer.innerText = jsString;
        
        const found = editor.find("ShowMessage", { wrap: true });
        editor.focus();
        logToConsole('editor.find("ShowMessage") tetiklendi', "api-call");
        if (found) {
          logToConsole('"ShowMessage" kelimesi bulundu ve seçildi.', "result-success");
        } else {
          logToConsole('"ShowMessage" bulunamadı (Önce Pascal/Delphi moduna geçin)', "system-msg");
        }
        break;

      case 'show-annotations':
        jsString = `// Sol kenar çubuğunda (gutter) hata/uyarı işaretçisi gösterir\neditor.session.setAnnotations([\n  {\n    row: 5,\n    column: 2,\n    text: "Yazım hatası tespit edildi! (Örnek Hata)",\n    type: "error" // error, warning veya info\n  }\n]);`;
        codeViewer.innerText = jsString;
        
        editor.session.setAnnotations([
          {
            row: 5,
            column: 2,
            text: "Yazım hatası tespit edildi! (Örnek Hata)",
            type: "error"
          }
        ]);
        logToConsole("editor.session.setAnnotations(...) tetiklendi", "api-call");
        logToConsole("6. satıra bir hata (error) işaretçisi eklendi.", "result-success");
        break;

      case 'undo-redo':
        jsString = `// Geçmiş yığınından son işlemi geri alır\neditor.undo();\n// Veya geri alınanı ileri sarar:\n// editor.redo();`;
        codeViewer.innerText = jsString;
        
        editor.undo();
        logToConsole("editor.undo() tetiklendi", "api-call");
        logToConsole("Son yapılan düzenleme geri alındı.", "result-success");
        break;
    }
  });
});

// Trigger initial status bar setup
updateStatusBar();
logToConsole("Editör başarıyla başlatıldı ve JavaScript API Sandbox aktifleşti.", "system-msg");
