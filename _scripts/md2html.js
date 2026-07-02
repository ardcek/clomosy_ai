const fs = require('fs');
const lines = fs.readFileSync('TRObject_Complete_Reference copy.md', 'utf8').split('\n');

const css = `<style>
:root{--bg:#0d1117;--surface:#161b22;--border:#30363d;--text:#c9d1d9;--muted:#8b949e;--accent:#58a6ff;--green:#3fb950;--red:#f85149;--orange:#d2991d;--code-bg:#1a1a2e;--code-text:#e6edf3}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:'Segoe UI',Arial,sans-serif;line-height:1.7;font-size:15px}
.container{max-width:900px;margin:0 auto;padding:20px}
h1{color:var(--accent);text-align:center;font-size:28px;margin:20px 0}
h2{border-bottom:2px solid var(--accent);padding-bottom:8px;margin:40px 0 16px;color:var(--accent);font-size:22px}
h3{margin:24px 0 12px;color:var(--text);font-size:18px}
h4{color:var(--green);margin:16px 0 8px;font-size:16px}
h5{color:var(--orange);margin:12px 0 6px;font-size:14px}
pre{background:var(--code-bg);border:1px solid var(--border);border-radius:8px;padding:16px;overflow-x:auto;margin:12px 0;font-size:13px;line-height:1.6}
code{font-family:'Consolas',monospace;color:var(--code-text)}
p{margin:10px 0}
blockquote{background:var(--surface);border-left:3px solid var(--accent);padding:8px 16px;margin:12px 0;border-radius:0 8px 8px 0;color:var(--muted);font-size:14px}
strong{color:var(--accent)}
hr{border:none;border-top:1px solid var(--border);margin:30px 0}
.footer{text-align:center;padding:30px;color:var(--muted);font-size:13px;border-top:1px solid var(--border);margin-top:40px}
</style>`;

let html = ['<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>TRObject — Clomosy Referans Rehberi</title>', css, '</head><body><div class="container">'];

let inCode = false;
let inTable = false;

for (const line of lines) {
    let s = line;

    // Code blocks
    if (s.startsWith('```')) {
        if (inCode) { html.push('</code></pre>'); inCode = false; }
        else { html.push('<pre><code>'); inCode = true; }
        continue;
    }
    if (inCode) {
        html.push(s.replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>'));
        continue;
    }

    // Headers
    const hm = s.match(/^(#{1,5})\s+(.+)/);
    if (hm) {
        if (inTable) { html.push('</table>'); inTable = false; }
        const lvl = hm[1].length;
        let txt = hm[2].replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
        html.push(`<h${lvl}>${txt}</h${lvl}>`);
        continue;
    }

    // Blockquote
    if (s.startsWith('> ')) {
        let txt = s.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
        html.push(`<blockquote>${txt}</blockquote>`);
        continue;
    }

    // Horizontal rule
    if (s === '---') { html.push('<hr>'); continue; }

    // Empty
    if (s.trim() === '') { html.push(''); continue; }

    // Table
    if (s.startsWith('|') && s.endsWith('|')) {
        const cells = s.split('|').slice(1, -1).map(c => c.trim());
        if (cells.every(c => /^[-:]+$/.test(c))) continue;
        if (!inTable) { html.push('<table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:14px;border:1px solid var(--border)">'); inTable = true; }
        const isH = cells.every(c => c.startsWith('**') && c.endsWith('**'));
        const tag = isH ? 'th' : 'td';
        const style = isH ? 'style="background:var(--surface);color:var(--accent);padding:6px 10px;text-align:left;border:1px solid var(--border)"' : 'style="padding:6px 10px;border:1px solid var(--border);vertical-align:top"';
        const row = cells.map(c => `<${tag} ${style}>${c.replace(/\*\*/g,'')}</${tag}>`).join('');
        html.push(`<tr>${row}</tr>`);
        continue;
    }

    // Close table if non-table line
    if (inTable) { html.push('</table>'); inTable = false; }

    // Paragraph with inline formatting
    let txt = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
    html.push(`<p>${txt}</p>`);
}

if (inTable) html.push('</table>');
html.push('</div></body></html>');

fs.writeFileSync('clomosy_referans.html', html.join('\n'));
console.log('Done! ' + lines.length + ' lines processed.');