const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const pdf = require('pdf-parse');
const MiniSearch = require('minisearch');

const DB_PATH = path.join(__dirname, 'vector_db.json');
const TARGET_DIR = path.resolve(__dirname, '..');

let miniSearch = new MiniSearch({
  fields: ['title', 'content', 'file'], // aranacak alanlar
  storeFields: ['title', 'content', 'file'] // geri döndürülecek alanlar
});

// Load existing DB
if (fs.existsSync(DB_PATH)) {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        miniSearch = MiniSearch.loadJSON(data, {
            fields: ['title', 'content', 'file'],
            storeFields: ['title', 'content', 'file']
        });
    } catch (e) {
        console.error("DB parsing error", e);
    }
}

// Basit metin parçalayıcı (Chunker)
function chunkText(text, maxChars = 800) {
    const chunks = [];
    let current = "";
    const lines = text.split('\n');
    for (const line of lines) {
        if (current.length + line.length > maxChars) {
            chunks.push(current);
            current = line + '\n';
        } else {
            current += line + '\n';
        }
    }
    if (current.trim().length > 0) chunks.push(current);
    return chunks;
}

// Dosya işleme
async function processFile(filePath) {
    try {
        const ext = path.extname(filePath).toLowerCase();
        let text = "";
        
        if (ext === '.tro') {
            text = fs.readFileSync(filePath, 'utf-8');
        } else {
            return;
        }
        
        const chunks = chunkText(text);
        
        const docsToAdd = [];
        for (let i = 0; i < chunks.length; i++) {
            if (chunks[i].trim().length < 10) continue;
            docsToAdd.push({
                id: filePath + "_" + i,
                title: path.basename(filePath),
                file: filePath,
                content: chunks[i]
            });
        }
        
        // Eskileri silmeye çalış
        docsToAdd.forEach(doc => {
            try { miniSearch.discard(doc.id); } catch(e){}
        });
        
        miniSearch.addAll(docsToAdd);
        
        fs.writeFileSync(DB_PATH, JSON.stringify(miniSearch));
        console.log(`[RAG] İndekslendi: ${path.basename(filePath)} (${docsToAdd.length} parça)`);
        
    } catch (e) {
        console.error(`[RAG] Hata - ${filePath}:`, e.message);
    }
}

// Dosya silme / veri temizleme
async function deleteFile(filePath) {
    try {
        let deletedCount = 0;
        const keys = Array.from(miniSearch._idToShortId.keys());
        for (const id of keys) {
            if (id.startsWith(filePath + "_")) {
                try {
                    miniSearch.discard(id);
                    deletedCount++;
                } catch (e) {}
            }
        }
        if (deletedCount > 0) {
            fs.writeFileSync(DB_PATH, JSON.stringify(miniSearch));
            console.log(`[RAG] Silindi: ${path.basename(filePath)} (${deletedCount} parça veritabanından kaldırıldı)`);
        }
    } catch (e) {
        console.error(`[RAG] Silme Hatası - ${filePath}:`, e.message);
    }
}

// Sistemi Başlat
async function start() {
    console.log("[RAG] Sistem Başlatıldı (MiniSearch Motoru - Sadece .tro Dosyaları İzleniyor). Klasörler izleniyor...");
    
    const watcher = chokidar.watch(TARGET_DIR, {
        ignored: /(^|[\/\\])\..|node_modules|rag_system/,
        persistent: true,
        ignoreInitial: false 
    });

    watcher
      .on('add', async filePath => {
          if (path.extname(filePath).toLowerCase() === '.tro') {
              await processFile(filePath);
          }
      })
      .on('change', async filePath => {
           if (path.extname(filePath).toLowerCase() === '.tro') {
              await processFile(filePath);
          }
      })
      .on('unlink', async filePath => {
          if (path.extname(filePath).toLowerCase() === '.tro') {
              await deleteFile(filePath);
          }
      });
}

start();


