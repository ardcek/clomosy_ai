import requests
import json
import time
import os

BASE_URL = "https://www.docs.clomosy.com/api.php"
OUTPUT_MD = "TRObject_AI_KnowledgeBase.md"
OUTPUT_JSON = "TRObject_AI_KnowledgeBase.json"

def get_all_pages():
    print("Sayfa listesi aliniyor...")
    pages = []
    apfrom = None
    
    while True:
        params = {
            "action": "query",
            "list": "allpages",
            "aplimit": "max",
            "format": "json"
        }
        if apfrom:
            params["apcontinue"] = apfrom
            
        response = requests.get(BASE_URL, params=params)
        data = response.json()
        
        for p in data.get("query", {}).get("allpages", []):
            pages.append(p["title"])
            
        if "continue" in data:
            apfrom = data["continue"]["apcontinue"]
        else:
            break
            
    print(f"Toplam {len(pages)} sayfa bulundu.")
    return pages

def fetch_page_content(title):
    params = {
        "action": "query",
        "prop": "revisions",
        "rvprop": "content",
        "titles": title,
        "format": "json"
    }
    
    response = requests.get(BASE_URL, params=params)
    data = response.json()
    
    pages = data.get("query", {}).get("pages", {})
    for page_id, page_data in pages.items():
        if "revisions" in page_data:
            return page_data["revisions"][0]["*"]
    return None

def main():
    pages = get_all_pages()
    
    all_knowledge = []
    md_content = "# Clomosy TRObject Yapay Zeka Bilgi Bankasi\n\nBu dokuman otomatik olarak docs.clomosy.com adresinden derlenmistir.\n\n"
    
    for idx, title in enumerate(pages):
        print(f"[{idx+1}/{len(pages)}] Icerik cekiliyor: {title}")
        content = fetch_page_content(title)
        
        if content:
            all_knowledge.append({
                "title": title,
                "content": content
            })
            
            md_content += f"## {title}\n\n"
            md_content += content
            md_content += "\n\n---\n\n"
            
        # Sunucuya yuklenmemek icin bekle
        time.sleep(0.1)
        
    print(f"Veriler disari aktariliyor: {OUTPUT_JSON}")
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(all_knowledge, f, ensure_ascii=False, indent=2)
        
    print(f"Veriler disari aktariliyor: {OUTPUT_MD}")
    with open(OUTPUT_MD, "w", encoding="utf-8") as f:
        f.write(md_content)
        
    print("Islem tamamlandi!")

if __name__ == "__main__":
    main()
