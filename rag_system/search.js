const fs = require('fs');
const path = require('path');
const MiniSearch = require('minisearch');

const DB_PATH = path.join(__dirname, 'vector_db.json');

function search(query, topK = 5) {
    if (!fs.existsSync(DB_PATH)) {
        console.error("Veritabanı bulunamadı. Lütfen önce indexer.js'i çalıştırın.");
        return;
    }

    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const miniSearch = MiniSearch.loadJSON(data, {
        fields: ['title', 'content', 'file'],
        storeFields: ['title', 'content', 'file']
    });

    console.log(`Aranıyor: "${query}"...`);
    
    // Prefix ve fuzzy arama ile esneklik sağla
    const results = miniSearch.search(query, { prefix: true, fuzzy: 0.2 });

    console.log("\n=== ARAMA SONUÇLARI ===\n");
    for (let i = 0; i < Math.min(topK, results.length); i++) {
        const r = results[i];
        console.log(`[Sonuç ${i+1}] Dosya: ${r.file} (Skor: ${r.score.toFixed(2)})`);
        console.log("--------------------------------------------------");
        console.log(r.content.trim());
        console.log("--------------------------------------------------\n");
    }
}

const queryArg = process.argv.slice(2).join(' ');
if (queryArg) {
    search(queryArg);
} else {
    console.log("Lütfen bir arama kelimesi girin: node search.js <sorgu>");
}
