import re

with open('TRObject_Complete_Reference copy.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

css = '''<style>
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
.katman{display:inline-block;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:bold;margin-right:8px}
.k0{background:#1a3a5c;color:#58a6ff}.k1{background:#3a2a1a;color:#d2991d}
.k2{background:#1a3a1a;color:#3fb950}.k3{background:#3a1a3a;color:#bc8cff}
</style>'''

html = ['<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>🚀 TRObject — Clomosy Referans Rehberi</title>', css, '</head><body><div class="container">']

in_code = False
in_list = False
for line in lines:
    stripped = line.rstrip()

    # Code blocks
    if stripped.startswith('```'):
        if in_code:
            html.append('</code></pre>')
            in_code = False
        else:
            html.append('<pre><code>')
            in_code = True
        continue
    if in_code:
        # Escape HTML in code
        txt = stripped.replace('&','&').replace('<','<').replace('>','>')
        html.append(txt)
        continue

    # Headers
    m = re.match(r'^(#{1,5})\s+(.+)', stripped)
    if m:
        lvl = len(m.group(1))
        txt = m.group(2)
        # Bold markers
        txt = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', txt)
        # Inline code
        txt = re.sub(r'`([^`]+)`', r'<code>\1</code>', txt)
        if lvl <= 5:
            html.append(f'<h{lvl}>{txt}</h{lvl}>')
        continue

    # Blockquote
    if stripped.startswith('> '):
        txt = stripped[2:]
        txt = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', txt)
        txt = re.sub(r'`([^`]+)`', r'<code>\1</code>', txt)
        html.append(f'<blockquote>{txt}</blockquote>')
        continue

    # Horizontal rule
    if stripped == '---':
        html.append('<hr>')
        continue

    # Empty
    if stripped == '':
        html.append('')
        continue

    # Process inline formatting
    txt = stripped
    txt = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', txt)
    txt = re.sub(r'`([^`]+)`', r'<code>\1</code>', txt)

    # Table row (starts and ends with |)
    if stripped.startswith('|') and stripped.endswith('|'):
        cells = [c.strip() for c in stripped.split('|')[1:-1]]
        if all(c.startswith('---') or c.startswith(':--') for c in cells):
            continue  # skip separator row
        tag = 'th' if all(c.startswith('**') and c.endswith('**') for c in cells) else 'td'
        row = ''.join(f'<{tag}>{c.strip("* ")}</{tag}>' for c in cells)
        html.append(f'<tr>{row}</tr>')
        if tag == 'th':
            html[-1] = html[-1].replace('<tr>','<table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:14px"><tr>')
        if tag == 'td' and 'K0' in row:
            pass  # continue building table
        continue

    # Default paragraph
    html.append(f'<p>{txt}</p>')

# Close table if any
html.append('</table>' if any('<table' in h for h in html) else '')

html.extend(['</div></body></html>'])

with open('clomosy_referans.html', 'w', encoding='utf-8') as f:
    f.write('\n'.join(html))

print('Done!')