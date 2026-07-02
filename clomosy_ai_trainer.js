const fs = require('fs');

const BASE_URL = "https://www.docs.clomosy.com/api.php";
const OUTPUT_MD = "TRObject_AI_KnowledgeBase.md";
const OUTPUT_JSON = "TRObject_AI_KnowledgeBase.json";

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getAllPages() {
    console.log("Sayfa listesi aliniyor...");
    let pages = [];
    let apfrom = null;
    
    while (true) {
        const url = new URL(BASE_URL);
        url.searchParams.append("action", "query");
        url.searchParams.append("list", "allpages");
        url.searchParams.append("aplimit", "max");
        url.searchParams.append("format", "json");
        
        if (apfrom) {
            url.searchParams.append("apcontinue", apfrom);
        }
        
        const response = await fetch(url.toString());
        const data = await response.json();
        
        const pageList = data.query?.allpages || [];
        for (const p of pageList) {
            pages.push(p.title);
        }
        
        if (data.continue?.apcontinue) {
            apfrom = data.continue.apcontinue;
        } else {
            break;
        }
    }
    
    console.log(`Toplam ${pages.length} sayfa bulundu.`);
    return pages;
}

async function fetchPageContent(title) {
    const url = new URL(BASE_URL);
    url.searchParams.append("action", "query");
    url.searchParams.append("prop", "revisions");
    url.searchParams.append("rvprop", "content");
    url.searchParams.append("titles", title);
    url.searchParams.append("format", "json");
    
    try {
        const response = await fetch(url.toString());
        const data = await response.json();
        const pages = data.query?.pages || {};
        
        for (const pageId in pages) {
            if (pages[pageId].revisions && pages[pageId].revisions.length > 0) {
                return pages[pageId].revisions[0]["*"];
            }
        }
    } catch (e) {
        console.error("Hata:", title, e);
    }
    return null;
}

async function main() {
    const pages = await getAllPages();
    
    let all_knowledge = [];
    let md_content = "# Clomosy TRObject Yapay Zeka Bilgi Bankasi\n\nBu dokuman otomatik olarak docs.clomosy.com adresinden derlenmistir.\n\n";
    
    for (let i = 0; i < pages.length; i++) {
        const title = pages[i];
        console.log(`[${i+1}/${pages.length}] Icerik cekiliyor: ${title}`);
        const content = await fetchPageContent(title);
        
        if (content) {
            all_knowledge.push({
                title: title,
                content: content
            });
            
            md_content += `## ${title}\n\n`;
            md_content += content + "\n\n---\n\n";
        }
        
        await delay(100); // sunucuya yuklenmemek icin bekle
    }
    
    console.log(`Veriler disari aktariliyor: ${OUTPUT_JSON}`);
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(all_knowledge, null, 2), "utf8");
    
    console.log(`Veriler disari aktariliyor: ${OUTPUT_MD}`);
    fs.writeFileSync(OUTPUT_MD, md_content, "utf8");
    
    console.log("Islem tamamlandi!");
}

main().catch(console.error);
